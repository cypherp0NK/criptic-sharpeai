import SharpeAI from "../static/chain_info/SharpeAI.json"
import ERC20 from "../static/chain_info/WethToken.json"
import { utils, ethers } from "ethers"
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"

export const useDepositTokens = (tokenAddress1: string, tokenAddress2: string, vault: string) => {
    const { address, balance } = useContext(WalletContext);
    const { abi } = SharpeAI
    const erc20ABI = ERC20.abi
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20Contract1 = new ethers.Contract(tokenAddress1, erc20ABI, provider.getSigner())
    const erc20Contract2 = new ethers.Contract(tokenAddress2, erc20ABI, provider.getSigner())
    const SharpeaiContract = new ethers.Contract(vault, abi, provider.getSigner())

    const approvingToken1State = false
    
    const approveToken1 = (amount1: string) => {
        const approvingToken1 = erc20Contract1.approve(vault, amount1)
    }
    
    const approvingToken2State = false
    const approveToken2 = (amount2: string) => {
        const approvingToken2 = erc20Contract2.approve(vault, amount2)
    }
    
    const depositState = false
    const depositTokens = (amountA: string, amountB: string) => {
        const deposit = SharpeaiContract.deposit(amountA, amountB, 0, 0, address)
    }
    
    return {approveToken1, approvingToken1State, approveToken2, approvingToken2State, depositTokens, depositState, erc20ABI, abi, provider}
}