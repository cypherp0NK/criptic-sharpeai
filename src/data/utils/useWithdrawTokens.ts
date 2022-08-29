import Sharpe from "../static/chain_info/Sharpe.json"
import { utils, ethers } from "ethers"
import {useContext, useState} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"
import Web3Modal from 'web3modal';

export const useWithdrawTokens = ( vault: string ) => {
    const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
    const { address, balance } = useContext(WalletContext);
    const { abi } = Sharpe
    const shareWithdrawState = false
    const [withdrawError, setWithdrawError] = useState<string>('')
    const [withdrawEvent, setWithdrawEvent] = useState<boolean>(false)
    const [withdrawHash, setWithdrawHash] = useState<string>('https://polygonscan.com/tx/')

    const shareWithdrawn = async (amount: string, output: boolean) => {
        if (
            (window && window.web3 === undefined) ||
            (window && window.ethereum === undefined)
          ) {
            return('wallet error')
          }
        else{
          if (output === true){
            const connection = web3Modal && (await web3Modal.connect());
            const provider = new ethers.providers.Web3Provider(connection);
            const SharpeaiContract = new ethers.Contract(vault, abi, provider.getSigner())
            SharpeaiContract.withdraw(amount, 0, 0, address, true, false)
            .then((tx: any) => {
              provider.waitForTransaction(tx.hash)
              .then(()=>{
                setWithdrawHash(('https://polygonscan.com/tx/').concat(tx.hash))
                setWithdrawEvent(true)
              })
            })
            .catch((error: any)=>{
              setWithdrawError((error.message).slice(0,225).concat("..."))
            })
          }
          else if (output === false){
            const connection = web3Modal && (await web3Modal.connect());
            const provider = new ethers.providers.Web3Provider(connection);
            const SharpeaiContract = new ethers.Contract(vault, abi, provider.getSigner())
            SharpeaiContract.withdraw(amount, 0, 0, address, false, true)
            .then((tx: any) => {
              provider.waitForTransaction(tx.hash)
              .then(()=>{
                setWithdrawHash(('https://polygonscan.com/tx/').concat(tx.hash))
                setWithdrawEvent(true)
              })
            })
            .catch((error: any)=>{
              setWithdrawError((error.message).slice(0,225).concat("..."))
            })
          }
            
            }
    }
    return { shareWithdrawn, shareWithdrawState, withdrawError, setWithdrawError,withdrawEvent, setWithdrawEvent, withdrawHash, setWithdrawHash }

} 