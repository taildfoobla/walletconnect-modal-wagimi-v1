import {useContext, useEffect, useState} from 'react'
import Web3 from "web3"
import {getPrivateSaleInfo, getWalletInfo} from "../services/privateSale"
import AuthContext from "../contexts/AuthContext"
import BigNumber from "bignumber.js"
import contractABI from '../abi/MFGPrivateSale.json'
import {getStringOfBigNumber} from "../utils/number"
import ERC20Balance from "../abi/ERC20Balance.json"

const PrivateSale = (props) => {
    const [buyLoading, setBuyLoading] = useState(false)
    const [claimLoading, setClaimLoading] = useState(false)
    const [privateSaleInfo, setPrivateSaleInfo] = useState({})
    const [walletInfo, setWalletInfo] = useState({})

    const {user, setUserInfo} = useContext(AuthContext)
    // console.log(user)

    useEffect(() => {
        const fetchPrivateSaleInfo = async () => {
            const {data, success} = await getPrivateSaleInfo()
            if (data && success) {
                setPrivateSaleInfo(data.data)
                if (!!data.data.mfgToken) {
                    const web3 = new Web3(window.web3.currentProvider)
                    const contract = new web3.eth.Contract(ERC20Balance.abi, data.data.mfgToken)
                    const weiBalance = await contract.methods.balanceOf(user.account).call()
                    const decimals = await contract.methods.decimals().call()
                    const balance = new BigNumber(weiBalance).div(10 ** decimals)
                    setUserInfo({...user, mfgBalance: balance.toString()})
                }
            }
        }
        const fetchWalletInfo = async () => {
            const {data, success} = await getWalletInfo(user.account)
            if (data && success) {
                setWalletInfo(data.data)
            }
        }
        fetchPrivateSaleInfo().then()
        fetchWalletInfo().then()
    }, [user.account])

    const handleBuyMFG = async () => {
        setBuyLoading(true)
        const web3js = new Web3(window.web3.currentProvider)
        const nonce = await web3js.eth.getTransactionCount(user.account, 'latest') //get latest nonce
        // console.log(window.web3, user.account, privateSaleInfo.contract)
        const privateSaleContract = new web3js.eth.Contract(contractABI.abi, privateSaleInfo.contract)
        web3js.eth.sendTransaction({
                to: privateSaleInfo.contract,
                from: user.account,
                nonce: nonce,
                value: getStringOfBigNumber(10 ** 18),
                data: privateSaleContract.methods.buyTokens(user.account).encodeABI()
            },
            async function (err, hash) {
                setBuyLoading(false)
                if (!err) {
                    console.log("The hash of MFG buying transaction is: ", hash,)
                    // let status = await web3.eth.getTransaction(hash);
                    // console.log("The status of MFG sending transaction is: ", status);
                } else {
                    console.log("Something went wrong when submitting your transaction:", err)
                }
            })
    }

    const handleClaimMFG = async () => {
        setClaimLoading(true)
        let web3js = new Web3(window.web3.currentProvider)
        const privateSaleContract = new web3js.eth.Contract(contractABI.abi, privateSaleInfo.contract)
        const tx = {
            to: privateSaleInfo.contract,
            from: user.account,
            // value: web3js.utils.toWei('1', 'ether'),
            data: privateSaleContract.methods.claimTokens().encodeABI()
        }
        // const gasLimit = await web3js.eth.estimateGas(tx)
        // tx.gas = gasLimit
        web3js.eth.sendTransaction(tx,
            async function (err, hash) {
                setClaimLoading(false)
                if (!err) {
                    console.log("The hash of MFG claiming transaction is: ", hash,)
                    // let status = await web3.eth.getTransaction(hash);
                    // console.log("The status of MFG sending transaction is: ", status);
                } else {
                    console.log("Something went wrong when submitting your transaction:", err)
                }
            })
    }

    const {contract, rate, purchase, remainingSlot, endTime} = privateSaleInfo
    const {balance, lastClaimTime} = walletInfo
    const lastClaimStr = lastClaimTime !== "0" ? new Date(lastClaimTime * 1000).toTimeString() + ", " + new Date(lastClaimTime * 1000).toDateString() : "Invalid Date"
    const realBalance = new BigNumber(balance).div(1e18).toString()
    const isPSActive = endTime > 0 && remainingSlot > 0

    return (
        <div>
            <div className={'flex justify-start items-center'}>
                <div className={'flex mr-5'}>
                    <h2 className={'font-bold text-2xl dark:text-white'}>Private Sale</h2>
                </div>
                <div className={'flex'}>
                    {isPSActive ? (
                        <span
                            className="bg-green-400 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-500 dark:text-white">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round"
                                                                          strokeWidth={2}
                                                                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
                            Active
                        </span>
                    ) : (
                        <span
                            className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-200 dark:text-indigo-900">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg"><path
                                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                            Inactive
                        </span>
                    )}
                </div>
            </div>
            <div className={'mt-8'}>
                <div className={'flex items-start'}>
                    Sale contract:&nbsp;<span
                    className={'text-green-500'}>{contract}</span>
                </div>
                {/*<div className={'flex items-start'}>*/}
                {/*    MFG token:&nbsp;<span*/}
                {/*    className={'text-green-500'}>{mfg}</span>*/}
                {/*</div>*/}
                <div className={'flex items-start mt-1'}>
                    Purchase price :&nbsp;<span className={'text-green-500'}>{purchase}</span>
                </div>
                <div className={'flex items-start mt-1'}>
                    Sale rate:&nbsp;<span className={'text-green-500'}>{rate} (1 GLMR = {rate} MFG)</span>
                </div>
                <div className={'flex items-start mt-1'}>
                    Remaining slot:&nbsp;<span className={'text-green-500'}>{remainingSlot}</span>
                </div>
                <hr className={'my-4'}/>
                <div className={'flex items-start mt-1'}>
                    Your balance in Private Sale:&nbsp;<span className={'text-green-500'}>{realBalance} MFG</span>
                </div>
                <div className={'flex items-start mt-1'}>
                    Last claim time:&nbsp;<span className={'text-green-500'}>{lastClaimStr}</span>
                </div>
                <div className={'flex flex-row mt-4'}>
                    <button type="button"
                            onClick={handleBuyMFG}
                            disabled={buyLoading}
                            className="mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        {
                            buyLoading ? (
                                <svg role="status" className="inline w-4 h-4 mr-3 text-white animate-spin"
                                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB"/>
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor"/>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 mr-2 -ml-1 inline" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                                </svg>
                            )
                        } Buy MFG
                    </button>
                    <button type="button"
                            onClick={handleClaimMFG}
                            disabled={claimLoading}
                            className="mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        {
                            claimLoading ? (
                                <svg role="status" className="inline w-4 h-4 mr-3 text-white animate-spin"
                                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB"/>
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor"/>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>)
                        } Claim MFG
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PrivateSale