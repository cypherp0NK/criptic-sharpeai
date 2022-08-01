import SharpeAI from "../static/chain_info/SharpeAI.json"
import { utils, ethers } from "ethers"
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"

export const useWithdrawTokens = ( vault: string ) => {
    const { address, balance } = useContext(WalletContext);
    const { abi } = SharpeAI
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const SharpeaiContract = new ethers.Contract(vault, abi, provider.getSigner())

    const shareWithdrawState = false

    const shareWithdrawn = (amount: string) => {
        const shareWithdraw = SharpeaiContract.withdraw(amount, 0, 0, address)
    }
    return { shareWithdrawn, shareWithdrawState }

} 