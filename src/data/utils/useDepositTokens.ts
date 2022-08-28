import Sharpe from "../static/chain_info/Sharpe.json"
import ERC20 from "../static/chain_info/WethToken.json"
import { utils, ethers } from "ethers"
import {useContext, useState} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"
import Web3Modal from 'web3modal';

export const useDepositTokens = (tokenAddress1: string, tokenAddress2: string, vault: string) => {
    const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
    const { address} = useContext(WalletContext);
    const { abi } = Sharpe
    const erc20ABI = ERC20.abi
    const [txnError, setTxnError] = useState<string>('')
    const [token1Event, setToken1Event] = useState<boolean>(false)
    const [token2Event, setToken2Event] = useState<boolean>(false)
    const [depositEvent, setDepositEvent] = useState<boolean>(false)
    const [depositHash, setDepositHash] = useState<string>('https://polygonscan.com/tx/')
    // new ethers.providers.Web3Provider(window.ethereum);
    const approvingToken1State = false
    
    const approveToken1 = async (amount1: string) => {
        if (
            (window && window.web3 === undefined) ||
            (window && window.ethereum === undefined)
          ) {
            return('wallet error')
          }
        else{
            const connection = web3Modal && (await web3Modal.connect());
            const provider = new ethers.providers.Web3Provider(connection);
            const erc20Contract1 = new ethers.Contract(tokenAddress1, erc20ABI, provider.getSigner())
            erc20Contract1.approve(vault, amount1)
            .then((tx: any) => {
              provider.waitForTransaction(tx.hash)
              .then(()=>{
                setToken1Event(true)
              })
            })
            .catch((error: any)=>{
              setTxnError((error.message).slice(0,225).concat("..."))
            })
            }
    }
    
    const approvingToken2State = false
    const approveToken2 = async (amount2: string) => {
        if (
            (window && window.web3 === undefined) ||
            (window && window.ethereum === undefined)
          ) {
            return('wallet error')
          }
        else{
            const connection = web3Modal && (await web3Modal.connect());
            const provider = new ethers.providers.Web3Provider(connection);
            const erc20Contract2 = new ethers.Contract(tokenAddress2, erc20ABI, provider.getSigner())
            erc20Contract2.approve(vault, amount2)
            .then((tx: any) => {
              provider.waitForTransaction(tx.hash)
              .then(()=>{
                setToken2Event(true)
              })
            })
            .catch((error: any)=>{
              setTxnError((error.message).slice(0,225).concat("..."))
            })
        }
    }
    
    const depositState = false
    const depositTokens = async (amountA: string, amountB: string) => {
        if (
            (window && window.web3 === undefined) ||
            (window && window.ethereum === undefined)
          ) {
            return('wallet error')
          }
        else{
            const connection = web3Modal && (await web3Modal.connect());
            const provider = new ethers.providers.Web3Provider(connection);
            const SharpeaiContract = new ethers.Contract(vault, abi, provider.getSigner())
            SharpeaiContract.deposit(amountA, amountB, 0, 0, address)
            .then((tx: any) => {
              provider.waitForTransaction(tx.hash)
              .then(()=>{
                setDepositHash(('https://polygonscan.com/tx/').concat(tx.hash))
                setDepositEvent(true)
              })
            })
            .catch((error: any)=>{
              setTxnError((error.message).slice(0,225).concat("..."))
            })
        }
    }
    
    return {approveToken1, txnError, setTxnError, token1Event, setToken1Event, token2Event, setToken2Event,depositEvent, setDepositEvent,depositHash, setDepositHash, approvingToken1State, approveToken2, approvingToken2State, depositTokens, depositState, erc20ABI, abi}
}