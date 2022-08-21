import Sharpe from "../static/chain_info/Sharpe.json"
import { utils, ethers } from "ethers"
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"
import Web3Modal from 'web3modal';

export const useWithdrawTokens = ( vault: string ) => {
    const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
    const { address, balance } = useContext(WalletContext);
    const { abi } = Sharpe
    const shareWithdrawState = false

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
            const shareWithdraw = SharpeaiContract.withdraw(amount, 0, 0, address)
            }
    }
    return { shareWithdrawn, shareWithdrawState }

} 