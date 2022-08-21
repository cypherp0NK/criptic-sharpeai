import { ethers, providers } from 'ethers'
import Sharpe from '../static/chain_info/Sharpe.json'
import ERC20 from '../static/chain_info/WethToken.json'

import {formatUnits} from '@ethersproject/units'
export const vaultData = (vault: string, tokenAddress1: string, tokenAddress2: string) => {
        
        const { abi } = Sharpe
        const erc20ABI = ERC20.abi
        const provider = new providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/2VsZl1VcrmWJ44CvrD9pt1HFieK6TQfZ')
        // new ethers.providers.Web3Provider(window.ethereum);
        const SharpeaiContract = new ethers.Contract(vault, abi, provider)
        const tokenContract1 = new ethers.Contract(tokenAddress1, erc20ABI, provider)
        const tokenContract2 = new ethers.Contract(tokenAddress2, erc20ABI, provider)

        const SC1 = new ethers.Contract("0x4E32A48F4f4f7B2594733dd7ffED871D9441e2c4", abi, provider)
        const SC2 = new ethers.Contract("0xFD3B52fDF0CE5E0919400Fc90C2C5183BE517eE8", abi, provider)
        const SC3 = new ethers.Contract("0x9db685d9E4f2e5A7fAEC5760F2946C32c8422b91", abi, provider)

        const token1 = new ethers.Contract("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", erc20ABI, provider)
        const token2 = new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", erc20ABI, provider)
        const token3 = new ethers.Contract("0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89", erc20ABI, provider)
        const token4 = new ethers.Contract("0xa3Fa99A148fA48D14Ed51d610c367C61876997F1", erc20ABI, provider)


        const fetchTokenBalances = async (address: string) => {
            const balance1 = await token1.balanceOf(address)
            const balance2 = await token2.balanceOf(address)
            const balance3 = await token3.balanceOf(address)
            const balance4 = await token4.balanceOf(address)
            const tB1 = parseFloat(formatUnits(balance1, 6))
            const tB2 = parseFloat(formatUnits(balance2, 6))
            const tB3 = parseFloat(formatUnits(balance3, 18))
            const tB4 = parseFloat(formatUnits(balance4, 18))

            return [tB1,tB2,tB3,tB4]
        }
        const fetchAPY = async (address: string) => {
            const [fC1, fC2, fC3, tY] = await allEarnings(address)
            const [balance1, balance2, balance3, balance4] = await singleBalances(address)
            const [l1, l2, l3, tL, tvl1, tvl2, tvl3, tvl4, tvl5, tvl6] = await singleTVL()
            const [tSupply1,tSupply2,tSupply3] = await singleTS()

            const balanceCalc1 = ((tvl1*balance1) / tSupply1) + ((tvl2*balance1) / tSupply1)
            const balanceCalc2 = ((tvl3*balance2) / tSupply2) + ((tvl4*balance2) / tSupply2)
            const balanceCalc3 = ((tvl5*balance3) / tSupply3) + ((tvl6*balance3) / tSupply3)

            const apy1 = (fC1 / (balanceCalc1 * 1)) * 100
            const apy2 = (fC2 / (balanceCalc2 * 1)) * 100
            const apy3 = (fC3 / (balanceCalc3 * 1)) * 100
            const totalAPY = apy1 + apy2 + apy3

            const monthlyArray = [0]
            if (totalAPY > 0){
                const value = totalAPY/12
                monthlyArray.push(value)
            }
            const monthlyAPY = monthlyArray.reduce((a, c) => {
                return a + c
            }, 0)

            return [apy1, apy2, apy3, totalAPY, monthlyAPY]
            
             
        }
        const allEarnings = async (address: string) => {
            const [v1fees0, v1fees1, v2fees0, v2fees1, v3fees0, v3fees1] = await income()
            const [userBalance1, userBalance2, userBalance3, userBalance4] = await singleBalances(address)
            const [totalSupply1, totalSupply2, totalSupply3] = await singleTS()

            const feesCalc1 = ((v1fees0*userBalance1) / totalSupply1) + ((v1fees1*userBalance1) / totalSupply1)
            const feesCalc2 = ((v2fees0*userBalance2) / totalSupply2) + ((v2fees1*userBalance2) / totalSupply2)
            const feesCalc3 = ((v3fees0*userBalance3) / totalSupply3) + ((v3fees1*userBalance3) / totalSupply3)
            const totalYields = feesCalc1 + feesCalc2 + feesCalc3
            return [feesCalc1, feesCalc2, feesCalc3, totalYields]
        }

        const fetchRanges = async (vContract: ethers.Contract) => {
            const lower = await vContract.baseLower()
            const upper = await vContract.baseUpper()
            return [lower, upper]
        }
        const fetchVolume = async () => {
            const [v1Range1, v1Range2] = await fetchRanges(SC1)
            const [v1Vol1, v1Vol2] = await SC1.getPositionAmounts(v1Range1, v1Range2)
            const [v2Range1, v2Range2] = await fetchRanges(SC2)
            const [v2Vol1, v2Vol2] = await SC2.getPositionAmounts(v2Range1, v2Range2)
            const [v3Range1, v3Range2] = await fetchRanges(SC3)
            const [v3Vol1, v3Vol2] = await SC3.getPositionAmounts(v3Range1, v3Range2)

            const v1Value = parseFloat(formatUnits(v1Vol1, 6)) + parseFloat(formatUnits(v1Vol2, 6))
            const v2Value = parseFloat(formatUnits(v2Vol1, 6)) + parseFloat(formatUnits(v2Vol2, 18))
            const v3Value = parseFloat(formatUnits(v3Vol1, 6)) + parseFloat(formatUnits(v3Vol2, 18))
            const totalVolume = v1Value + v2Value + v3Value
            return [v1Value, v2Value, v3Value, totalVolume]
          }

        const allPositions = async (address: string) => {
            const [tS1, tS2, tS3] = await singleTS()
            const [newBalance1,newBalance2,newBalance3,newBalance4] = await singleBalances(address)
            const [l1, l2, l3, tL, tvl1, tvl2, tvl3, tvl4, tvl5, tvl6] = await singleTVL()

            const p1 = (tvl1*newBalance1) / tS1
            const p2 = (tvl2*newBalance1) / tS1
            const pos1 = p1+p2

            const p3 = (tvl3*newBalance2) / tS2
            const p4 = (tvl4*newBalance2) / tS2
            const pos2 = p3+p4

            const p5 = (tvl5*newBalance3) / tS3
            const p6 = (tvl6*newBalance3) / tS3
            const pos3 = p5+p6

            return [pos1, pos2, pos3, p1, p2, p3, p4, p5, p6]
            
        }
        const income = async () => {
            const v1feesEarned1 = await SC1.accruedProtocolFees0()
            const v1feesEarned2 = await SC1.accruedProtocolFees1()
            const v1FirstFee = parseFloat(formatUnits(v1feesEarned1, 6))
            const v1SecondFee = parseFloat(formatUnits(v1feesEarned2, 6))
            const income1 = v1FirstFee + v1SecondFee

            const v2feesEarned1 = await SC2.accruedProtocolFees0()
            const v2feesEarned2 = await SC2.accruedProtocolFees1()
            const v2FirstFee = parseFloat(formatUnits(v2feesEarned1, 6)) 
            const v2SecondFee = parseFloat(formatUnits(v2feesEarned2, 18))
            const income2 = v2FirstFee + v2SecondFee

            const v3feesEarned1 = await SC3.accruedProtocolFees0()
            const v3feesEarned2 = await SC3.accruedProtocolFees1()
            const v3FirstFee = parseFloat(formatUnits(v3feesEarned1, 6))
            const v3SecondFee = parseFloat(formatUnits(v3feesEarned2, 18))
            const income3 = v3FirstFee + v3SecondFee
            return [v1FirstFee, v2SecondFee, v2FirstFee, v2SecondFee, v3FirstFee,v3SecondFee]
    
        }
        const allBalances = async (address: string) => {

            const bal1 = await SC1.balanceOf(address)
            const bal2 = await SC2.balanceOf(address)
            const bal3 = await SC3.balanceOf(address)

            const b2Array = [0]
            const b3Array = [0]
            
            const b1 = parseFloat(formatUnits(bal1, 6))
            const b2 = parseFloat(formatUnits(bal2, 18))
            const b3 = parseFloat(formatUnits(bal3, 18))

            if (b2 > 0.01){
                const value = b2 / 0.31451893
                b2Array.push(value)
            }
            const newB2 = b2Array.reduce((a, c) => {
                return a + c
            }, 0)

            if (b3 > 0.01){
                const value = b3 / 0.59183673
                b3Array.push(value)
            }
            const newB3 = b3Array.reduce((a, c) => {
                return a + c
            }, 0)

            const totalBal = b1 + newB2 + newB3
            let activeArray = []
            if (b1 > 0.1){
                activeArray.push(8.21)
            }
            if (b2 > 0.01){
                activeArray.push(20.39)
            }
            if (b3 > 0.01){
                activeArray.push(24.57)
            }
            const estRoi = activeArray.reduce((a, c) => {
                    return a + c
                }, 0)
            

            return [totalBal, estRoi]
        }
        const sharesBalance = async (address: string, decimal: number) => {
            const bal = await SharpeaiContract.balanceOf(address)
            const b = parseFloat(formatUnits(bal, decimal))
            return b
        }
        const tokenBalances = async (address: string, decimal: number) => {
            const bal1 = await tokenContract1.balanceOf(address)
            const bal2 = await tokenContract2.balanceOf(address)
            const b1 = parseFloat(formatUnits(bal1, 6))
            const b2 = parseFloat(formatUnits(bal2, decimal))
            return [b1, b2]
        }
        const tokenPositions = async (address: string, decimal: number) => {
            const [total0, total1] = await SharpeaiContract.getTotalAmounts() 
            const totalSupply = await SharpeaiContract.totalSupply()
            const value = await SharpeaiContract.balanceOf(address)

            const tvl0 = parseFloat(formatUnits(total0, 6))
            const tvl1 = parseFloat(formatUnits(total1, decimal))
            const tS = parseFloat(formatUnits(totalSupply, decimal))

            const newBalance = parseFloat(formatUnits(value, 6))
            const p0 = (tvl0*newBalance) / tS
            const p1 = (tvl1*newBalance) / tS
            return [p0, p1]
        }
        const fetchPrice = async (decimal: number) => {
            const [t0, t1] = await SharpeaiContract.getTotalAmounts() 
            const total0 = parseFloat(formatUnits(t0, 6))
            const total1 = parseFloat(formatUnits(t1, decimal))
            const minimum = Math.min(total1, total0)
            const price2 = (minimum)/(total0)
            const price1 = 1/price2
            return[price1, price2]
        }
        const singleBalances = async (address: string) => {
            const balance1 = await SC1.balanceOf(address)
            const balance2 = await SC2.balanceOf(address)
            const balance3 = await SC3.balanceOf(address)
            const single1 = parseFloat(formatUnits(balance1, 6))
            const single2 = parseFloat(formatUnits(balance2, 18))
            const single3 = parseFloat(formatUnits(balance3, 18))
            const single4 = parseFloat(formatUnits(balance1, 1)) - 10
            

            return [single1,single2,single3,single4]
        }
        const singleTS = async () => {
            const ts1 = await SC1.totalSupply()
            const ts2 = await SC2.totalSupply()
            const ts3 = await SC3.totalSupply()
            const tSupply1 = parseFloat(formatUnits(ts1,6))
            const tSupply2 = parseFloat(formatUnits(ts2,18))
            const tSupply3 = parseFloat(formatUnits(ts3,18))
            return [tSupply1,tSupply2,tSupply3]
        }
        const singleTVL = async () => {
            const [total1, total2] = await SC1.getTotalAmounts() 
            const [total3, total4] = await SC2.getTotalAmounts() 
            const [total5, total6] = await SC3.getTotalAmounts()

            const tvl1 = parseFloat(formatUnits(total1, 6))
            const tvl2 = parseFloat(formatUnits(total2, 6))

            const tvl3 = parseFloat(formatUnits(total3, 6))
            const tvl4 = parseFloat(formatUnits(total4, 18))

            const tvl5 = parseFloat(formatUnits(total5, 6))
            const tvl6 = parseFloat(formatUnits(total6, 18))
            
            const locked1 = tvl1 + tvl2
            const locked2 = tvl3 + tvl4
            const locked3 = tvl5 + tvl6
            const totalLocked = locked1 + locked2 + locked3
            return [locked1, locked2, locked3, totalLocked, tvl1, tvl2, tvl3, tvl4, tvl5, tvl6]

        }
        
        const totalSupply = () => {
            const tSupply = SharpeaiContract.totalSupply()
            return tSupply
        }
        
    return {totalSupply, fetchPrice, tokenBalances, sharesBalance, allBalances, allEarnings, income, fetchVolume, singleTVL, allPositions, fetchAPY, tokenPositions, singleBalances, fetchTokenBalances}
}