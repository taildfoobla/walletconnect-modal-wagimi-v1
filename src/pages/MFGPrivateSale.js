import React, {useContext, useEffect, useState} from 'react'
import Web3 from "web3"
import {getPrivateSaleInfo, getWalletInfo, getWalletMerklePath} from "../services/tokenSale"
import WalletAuthContext from "../contexts/WalletAuthContext"
import BigNumber from "bignumber.js"
import contractABI from '../abis/MFGPrivateSale.json'
import {getStringOfBigNumber} from "../utils/number"
import ERC20Balance from "../abis/ERC20Balance.json"
import WalletAuthRequired from "../components/shared/WalletAuthRequired"
import {notification, Typography} from "antd"
import {getMainMessage} from "../utils/tx-error"
import {getAddressScanUrl, getShortAddress, getTxScanUrl} from "../utils/blockchain"
import LoadingWrapper from "../components/shared/LoadingWrapper"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import CurveBGWrapper from "../wrappers/CurveBG"

const {Paragraph} = Typography

const MFGPrivateSale = (props) => {
    const [loading, setLoading] = useState(true)
    const [buyLoading, setBuyLoading] = useState(false)
    const [claimLoading, setClaimLoading] = useState(false)
    const [privateSaleInfo, setPrivateSaleInfo] = useState({})
    const [walletInfo, setWalletInfo] = useState({})

    const {wallet, setWallet, provider} = useContext(WalletAuthContext)

    useEffect(() => {
        wallet.account && fetchData().then()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account])

    const fetchData = async () => {
        setLoading(true)
        const fetchPrivateSaleInfo = async () => {
            const {data, success} = await getPrivateSaleInfo()
            if (data && success) {
                setPrivateSaleInfo(data.data)
                if (!!data.data.mfgToken) {
                    // const provider = await detectProvider()
                    const web3 = new Web3(provider)
                    const contract = new web3.eth.Contract(ERC20Balance.abi, data.data.mfgToken)
                    const weiBalance = await contract.methods.balanceOf(wallet.account).call()
                    const decimals = await contract.methods.decimals().call()
                    const balance = new BigNumber(weiBalance).div(10 ** decimals)
                    setWallet({...wallet, mfgBalance: balance.toString()})
                }
            }
        }
        const fetchWalletInfo = async () => {
            const {data, success} = await getWalletInfo(wallet.account)
            if (data && success) {
                setWalletInfo(data.data)
            }
        }
        await Promise.all([fetchPrivateSaleInfo(), fetchWalletInfo()])
        setLoading(false)
    }

    const handleBuyMFG = async () => {
        setBuyLoading(true)
        try {
            const provider = window.SubWallet
            if (!provider) {
                console.log('SubWallet is not installed')
            }
            const web3js = new Web3(provider)
            const nonce = await web3js.eth.getTransactionCount(wallet.account, 'latest')
            const privateSaleContract = new web3js.eth.Contract(contractABI.abi, privateSaleInfo.contract)

            const {data, success} = await getWalletMerklePath(wallet.account)
            if (success && data.data.path) {
                const path = data.data.path
                // console.log(path)
                const txHash = await provider.request({
                    method: 'eth_sendTransaction', params: [
                        {
                            to: privateSaleInfo.contract,
                            from: wallet.account,
                            nonce: nonce,
                            value: getStringOfBigNumber(10 ** 18),
                            data: privateSaleContract.methods.buyTokens(path).encodeABI()
                        }
                    ]
                })
                console.log("The hash of MFG buying transaction is: ", txHash)
                notification.success({
                    message: `Transaction Successful`,
                    description: (
                        <div>
                            The hash of MFG buying transaction is: <br/>
                            <a target="_blank" rel="noreferrer"
                               className={'text-blue-600'}
                               href={getTxScanUrl(txHash)}>{txHash}</a>
                        </div>
                    ),
                    placement: 'bottomRight',
                    duration: 30000
                })
            } else {
                notification.error({
                    message: `Transaction Failed`,
                    description: 'Your wallets is not whitelisted',
                    placement: 'bottomRight',
                    duration: 3
                })
            }
            setBuyLoading(false)
        } catch (e) {
            setBuyLoading(false)
            showTxError(e.message)
            console.log("!error", e)
        }
    }

    const handleClaimMFG = async () => {
        setClaimLoading(true)
        try {
            const provider = window.SubWallet
            if (!provider) {
                console.log('SubWallet is not installed')
            }
            const web3js = new Web3(provider)
            const nonce = await web3js.eth.getTransactionCount(wallet.account, 'latest')
            const privateSaleContract = new web3js.eth.Contract(contractABI.abi, privateSaleInfo.contract)
            const tx = {
                to: privateSaleInfo.contract,
                from: wallet.account,
                nonce,
                data: privateSaleContract.methods.claimTokens().encodeABI()
            }
            const txHash = await provider.request({
                method: 'eth_sendTransaction', params: [tx]
            })
            console.log("The hash of MFG claiming transaction is: ", txHash)
            notification.success({
                message: `Transaction Successful`,
                description: (
                    <div>
                        The hash of MFG claiming transaction is: <br/>
                        <a target="_blank" rel="noreferrer"
                           className={'text-blue-600'}
                           href={getTxScanUrl(txHash)}>{txHash}</a>
                    </div>
                ),
                placement: 'bottomRight',
                duration: 30000
            })
            setClaimLoading(false)
        } catch (e) {
            setClaimLoading(false)
            showTxError(e.message)
            console.log("!error", e)
        }
    }

    const showTxError = (message) => {
        notification.error({
            message: `Transaction Failed`,
            description: getMainMessage(message),
            placement: 'bottomRight',
            duration: 3
        })
    }

    const renderAddressLink = (address) => {
        const url = getAddressScanUrl(address)
        return (
            <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-blue-600 text-sm normal-case'}>View on
                block explorer</a>
        )
    }

    const {contract, rate, purchase, remainingSlot, endTime} = privateSaleInfo
    const {balance, lastClaimTime} = walletInfo
    const lastClaimStr = lastClaimTime !== "0" ? new Date(lastClaimTime * 1000).toTimeString() + ", " + new Date(lastClaimTime * 1000).toDateString() : "Invalid Date"
    const realBalance = new BigNumber(balance).div(1e18).toString()
    const isPSActive = endTime > 0 && remainingSlot > 0

    return (
        <CurveBGWrapper>
            <EnvWrapper routeItem={Paths.PrivateSale}>
                <WalletAuthRequired className={'section page-mfg-ps'}>
                    {
                        !loading && contract && <div className="section-content">
                            <div className="container">
                                <div className={'flex flex-col'}>
                                    <div className={'flex justify-center'}>
                                        <h2 className={'font-bold text-3xl secondary-color'}>MFG Private Sale</h2>
                                    </div>
                                    <div className={'flex justify-center mt-4'}>
                                        {isPSActive ? (
                                            <span
                                                className="bg-green-400 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-500 dark:text-white">
                                    Active
                                </span>
                                        ) : (
                                            <span
                                                className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-200 dark:text-indigo-900">
                                    Inactive
                                </span>
                                        )}
                                    </div>
                                </div>
                                <div className="moonfit-card">
                                    <div className="moonfit-card-inner">
                                        <div className="card-title flex justify-between">
                                            <div className={'flex'}>Sale information</div>
                                            <div className={'flex'}>
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a href="#" className={'normal-case text-xs inline'}
                                                   onClick={() => fetchData()}>
                                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                                    </svg>
                                                    Refresh
                                                </a>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className={'mt-8'}>
                                                <div className={'flex flex-col'}>
                                                    <div className={'flex'}>Sale contract</div>
                                                    <div className={'flex flex-col'}>
                                                        <Paragraph className={'flex text-green-500'}
                                                                   copyable={{text: contract, format: 'text/plain'}}>
                                                            {getShortAddress(contract, 14)}
                                                        </Paragraph>
                                                        <div className={'flex'}>
                                                            {renderAddressLink(contract)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'flex flex-col mt-2'}>
                                                    <div className={'flex'}>Purchase price</div>
                                                    <div className={'flex text-green-500'}>{purchase}</div>
                                                </div>
                                                <div className={'flex flex-col mt-2'}>
                                                    <div className={'flex'}>Sale rate</div>
                                                    <div className={'flex text-green-500'}>{rate} (1 GLMR = {rate} MFG)
                                                    </div>
                                                </div>
                                                <div className={'flex flex-col mt-2'}>
                                                    <div className={'flex'}>Remaining slot</div>
                                                    <div className={'flex text-green-500'}>{remainingSlot}</div>
                                                </div>
                                                <hr className={'my-4'}/>
                                                <div className={'flex flex-col'}>
                                                    <div className={'flex'}>Your balance in Private Sale</div>
                                                    <div className={'flex text-green-500'}>{realBalance}</div>
                                                </div>
                                                <div className={'flex flex-col mt-2'}>
                                                    <div className={'flex'}>Last claim time</div>
                                                    <div className={'flex text-green-500'}>{lastClaimStr}</div>
                                                </div>
                                                <div className={'flex flex-row justify-center mt-4'}>
                                                    <button type="button"
                                                            onClick={handleBuyMFG}
                                                            disabled={buyLoading}
                                                            className="mt-3 button button-secondary">
                                                        {
                                                            buyLoading ? (
                                                                <svg role="status"
                                                                     className="inline w-4 h-4 mr-3 text-white animate-spin"
                                                                     viewBox="0 0 100 101" fill="none"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                        fill="#E5E7EB"/>
                                                                    <path
                                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                        fill="currentColor"/>
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-5 h-5 mr-2 -ml-1 inline"
                                                                     fill="currentColor"
                                                                     viewBox="0 0 20 20"
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
                                                            className="mt-3 button button-primary">
                                                        {
                                                            claimLoading ? (
                                                                <svg role="status"
                                                                     className="inline w-4 h-4 mr-3 text-white animate-spin"
                                                                     viewBox="0 0 100 101" fill="none"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                        fill="#E5E7EB"/>
                                                                    <path
                                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                        fill="currentColor"/>
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-6 h-6 inline" fill="none"
                                                                     stroke="currentColor"
                                                                     viewBox="0 0 24 24"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          strokeWidth={2}
                                                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                                </svg>)
                                                        } Claim MFG
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <LoadingWrapper loading={loading}/>
                </WalletAuthRequired>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default MFGPrivateSale