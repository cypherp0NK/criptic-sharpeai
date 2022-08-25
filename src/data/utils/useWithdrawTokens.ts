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

    const shareWithdrawn = async (amount: string) => {
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
            SharpeaiContract.withdraw(amount, 0, 0, address)
            .then((tx: any) => {
              provider.waitForTransaction(tx.hash)
              .then(()=>{
                console.log(tx.hash)
              })
            })
            .catch((error: any)=>{
              setWithdrawError(error.message)
            })
            }
    }
    return { shareWithdrawn, shareWithdrawState, withdrawError, setWithdrawError }

} 