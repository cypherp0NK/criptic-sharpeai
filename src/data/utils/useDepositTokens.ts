import Sharpe from "../static/chain_info/Sharpe.json"
import ERC20 from "../static/chain_info/WethToken.json"
import { utils, ethers } from "ethers"
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"
import Web3Modal from 'web3modal';

export const useDepositTokens = (tokenAddress1: string, tokenAddress2: string, vault: string) => {
    const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
    const { address, balance } = useContext(WalletContext);
    const { abi } = Sharpe
    const erc20ABI = ERC20.abi
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
            const approvingToken1 = erc20Contract1.approve(vault, amount1)
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
            const approvingToken2 = erc20Contract2.approve(vault, amount2)
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
            const deposit = SharpeaiContract.deposit(amountA, amountB, 0, 0, 0, address)
        }
    }
    
    return {approveToken1, approvingToken1State, approveToken2, approvingToken2State, depositTokens, depositState, erc20ABI, abi}
}