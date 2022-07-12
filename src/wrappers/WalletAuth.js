import React, {useEffect, useState} from 'react'
import WalletAuthContext from "../contexts/WalletAuthContext"
import {switchNetwork} from "../utils/blockchain"
import Web3 from "web3"


const WalletAuthWrapper = ({children}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [wallet, setWallet] = useState({})

    useEffect(() => {
        function checkConnectedWallet() {
            const userData = JSON.parse(localStorage.getItem('walletAccount'))
            if (userData != null) {
                setWallet(userData)
                setIsConnected(true)
            }
        }

        checkConnectedWallet()
    }, [])

    const onConnect = async () => {
        try {
            const provider = window.SubWallet
            if (!provider) {
                console.log('SubWallet is not installed')
            }
            await provider.request({method: 'eth_requestAccounts'})
            const chainId = await provider.request({method: 'eth_chainId'})

            await switchNetwork(provider)

            const web3 = new Web3(provider)
            const walletAccount = await web3.eth.getAccounts()
            const account = walletAccount[0]
            let ethBalance = await web3.eth.getBalance(account) // Get wallet balance
            ethBalance = web3.utils.fromWei(ethBalance, 'ether') //Convert balance to wei
            saveWalletInfo(ethBalance, account, chainId)
        } catch (err) {
            console.log(
                'There was an error fetching your accounts. Make sure your SubWallet is configured correctly.'
            )
        }
    }

    const onDisconnect = (callback = null) => {
        window.localStorage.removeItem('walletAccount')
        setWallet({})
        setIsConnected(false)
        callback && callback()
    }

    const saveWalletInfo = (ethBalance, account, chainId) => {
        const walletAccount = {
            account: account,
            balance: ethBalance,
            chainId: chainId,
        }
        window.localStorage.setItem('walletAccount', JSON.stringify(walletAccount)) // user persisted data
        const userData = JSON.parse(localStorage.getItem('walletAccount'))
        setWallet(userData)
        setIsConnected(true)
    }

    return (
        <WalletAuthContext.Provider value={{wallet, setWallet, onConnect, onDisconnect, isConnected}}>
            {children}
        </WalletAuthContext.Provider>
    )
}

export default WalletAuthWrapper
