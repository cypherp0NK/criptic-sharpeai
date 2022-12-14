import {useContext, useEffect, useState} from "react"
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Button from '@/components/ui/button';
import FarmList from '@/components/farms/list';
import { FarmsData } from '@/data/static/farms-data';
import { useDepositTokens } from '@/data/utils/useDepositTokens';
import { vaultData } from '@/data/utils/vaultData';
import { utils, ethers, providers } from 'ethers';
import {WalletContext} from "@/lib/hooks/use-connect"
import {TabContext, TabPanel} from "@material-ui/lab"
import { useWithdrawTokens } from '@/data/utils/useWithdrawTokens';
import { Close } from '@/components/icons/close';
import { ExportIcon } from '@/components/icons/export-icon';
import { Spinner } from '../components/icons/spinner';
import usdcsvgImage from '@/components/icons/usdcsvgImage.svg';
import tethersvgImage from '@/components/icons/tethersvgImage.svg'
import fraxsvgImage from '@/components/icons/fraxsvgImage.svg'
import mimaticsvgImage from '@/components/icons/mimaticsvgImage.svg'
import Image from '@/components/ui/image';
import Web3Modal from 'web3modal';

const FarmsPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Taurus Pools"
        description="Sharpe - Structured Investment Products, For the World."
      />
      <div className="mx-auto w-full sm:pt-8">
        <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-5">
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Pool
          </span>
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Earned
          </span>
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            APY
          </span>
          <span className="hidden px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
            Liquidity
          </span>
          <span className="hidden px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
            TVL
          </span>
        </div>

        {FarmsData.map((farm) => {
            const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
            const { address, error } = useContext(WalletContext);
            const {approveToken1, txnError, setTxnError, token1Event, setToken1Event, token2Event, setToken2Event,depositEvent, setDepositEvent,depositHash, setDepositHash, approvingToken1State, approveToken2, approvingToken2State, depositTokens, depositState, erc20ABI, abi} = useDepositTokens(farm.token1, farm.token2, farm.vault)
            const [ amount1, setAmount ] = useState<string>('')
            const [ amount2, setAmount2 ] = useState<string>('')
            const [amt1, setAmt] = useState<string>('')
            const [amt2, setAmt2] = useState<string>('')
            const [approved, setApproved] = useState<boolean>(false)
            const [approvedToken1, setApprovedToken1] = useState<boolean>(false)
            const [approvedToken2, setApprovedToken2] = useState<boolean>(false)
            const [card0Of3, setCard0Of3] = useState<boolean>(false)
            const [card1Of3, setCard1Of3] = useState<boolean>(false)
            const [card2Of3, setCard2Of3] = useState<boolean>(false)
            const [card3Of3, setCard3Of3] = useState<boolean>(false)
            const [usdcPending, setUsdcPending] = useState<boolean>(false)
            const [usdtPending, setUsdtPending] = useState<boolean>(false)
            const [isMining1, setIsMining1] = useState<boolean>(false)
            const [isMining2, setIsMining2] = useState<boolean>(false)
            const [isMining3, setIsMining3] = useState<boolean>(false)
            
            const [errorCard, setErrorCard] = useState<boolean>(false)
            const [errorMsg, setErrorMsg] = useState<string>('')

            const [shareBalance4, setShareBalance4] = useState<string>('--')
            const [shareBalance2, setShareBalance2] = useState<string>('--')
            const [shareBalance3, setShareBalance3] = useState<string>('--')
            const [poolPos1, setPoolPos1] = useState<string>('--')
            const [poolPos2, setPoolPos2] = useState<string>('--')
            const [poolPos3, setPoolPos3] = useState<string>('--')
            const [v1P1, setV1P1] = useState<string>('--')
            const [v1P2, setV1P2] = useState<string>('--')
            const [v2P1, setV2P1] = useState<string>('--')
            const [v2P2, setV2P2] = useState<string>('--')
            const [v3P1, setV3P1] = useState<string>('--')
            const [v3P2, setV3P2] = useState<string>('--')
            const [tB1, setTB1] = useState<string>('--')
            const [tB2, setTB2] = useState<string>('--')
            const [tB3, setTB3] = useState<string>('--')
            const [tB4, setTB4] = useState<string>('--')

            // Withdraw Tab
            const {shareWithdrawn, shareWithdrawState, withdrawEvent, setWithdrawEvent, withdrawError, setWithdrawError, withdrawHash, setWithdrawHash} = useWithdrawTokens(farm.vault)
            const [ amount, amountState ] = useState<string>('')
            const [output, setOutput] = useState<boolean>(true)
            const [card0Of1, setCard0Of1] = useState<boolean>(false)
            const [card1Of1, setCard1Of1] = useState<boolean>(false)
            const [withdrawalMining, setWithdrawalMining] = useState<boolean>(false)

            useEffect(() => {
              if (address){
                if (
                  (window && window.web3 === undefined) ||
                  (window && window.ethereum === undefined)
                ) {
                  console.log('window not available; logged from taurus')
                }
                else{
                  let distributedProvider = new ethers.providers.Web3Provider(window.ethereum);
                  gettingVaultData(distributedProvider);
                  
                  }
              }
                
              // if (usdtPending && usdcPending) {
              //   setCard1Of3(false)
              // }
              
            if (token1Event === true){
                setCard0Of3(false)
                setZappCard0of2(false)
                setZappCard1of2(true)
                setApprovedToken1(true)
                //setUsdcPending(true)
                setIsMining1(false)                      
                // setCard1Of3(true)
                
                setToken1Event(false)
          }

            if (token2Event === true){
              setCard0Of3(false)
              setZappCard0of2(false)
              setZappCard1of2(true)
              setApprovedToken2(true)
              //setUsdtPending(true)
              setIsMining2(false)
              // setCard1Of3(true)
              setToken2Event(false)
                
             }
          
            if (depositEvent === true) {
                  
                  setCard1Of3(false)
                  setUsdcPending(false)
                  setZappCard1of2(false)
                  setZappCard2of2(true)
                  //setCard3Of3(true)
                  setIsMining3(false)
                  let distributedProvider = new ethers.providers.Web3Provider(window.ethereum)
                  gettingVaultData(distributedProvider)
                  setApprovedToken1(false)
                  setApprovedToken2(false)
                  setDepositEvent(false)
        }
         if (withdrawEvent === true){
                setCard0Of1(false)

                setCard1Of1(true)
                setWithdrawalMining(false)
                let distributedProvider = new ethers.providers.Web3Provider(window.ethereum)
                gettingVaultData(distributedProvider)
                setWithdrawEvent(false)
              }
        if (txnError !== '' || withdrawError !== ''){
          setZappCard0of2(false)
          setZappCard1of2(false)
          setZappCard2of2(false)
          //withdraw
          setCard0Of1(false)

          setIsMining1(false)
          setIsMining2(false)
          setIsMining3(false)
          setWithdrawalMining(false)

          setToken1Event(false)
          setToken2Event(false)
          setDepositEvent(false)
          setWithdrawEvent(false)
          setErrorMsg(txnError !== '' ? txnError : withdrawError !== '' ? withdrawError : 'Transaction Error')
          setErrorCard(true)
        }
       
          }, [address,txnError,setTxnError,withdrawError,setWithdrawError,token1Event,token2Event,depositEvent,withdrawEvent,shareBalance4, shareBalance2,shareBalance3,poolPos1,poolPos2,poolPos3,v1P1,v1P2,v2P1,v2P2,v3P1,v3P2,tB1,tB2,tB3,tB4,setShareBalance4,setShareBalance2,setShareBalance3,setPoolPos1,setPoolPos2,setPoolPos3,setV1P1,setV1P2,setV2P1,setV2P2,setV3P1,setV3P2,setTB1,setTB2,setTB3,setTB4,gettingVaultData])

          async function gettingVaultData(p: any){
            const {allPositions, fetchTokenBalances, singleBalances} = vaultData(p)
            const [pos1, pos2, pos3, p1, p2, p3, p4, p5, p6] = await allPositions(address)
            const [tBal1, tBal2, tBal3, tBal4] = await fetchTokenBalances(address)
            const [sBal1, sBal2, sBal3, sBal4] = await singleBalances(address)
            
            setShareBalance4((sBal4.toFixed(2)).toString())
            setShareBalance2((sBal2.toFixed(2)).toString())
            setShareBalance3((sBal3.toFixed(2)).toString())
            setPoolPos1((pos1.toFixed(2)).toString())
            setPoolPos2((pos2.toFixed(2)).toString())
            setPoolPos3((pos3.toFixed(2)).toString())
            setV1P1((p1.toFixed(2)).toString())
            setV1P2((p2.toFixed(2)).toString())
            setV2P1((p3.toFixed(2)).toString())
            setV2P2((p4.toFixed(2)).toString())
            setV3P1((p5.toFixed(2)).toString())
            setV3P2((p6.toFixed(2)).toString())

            setTB1((tBal1.toFixed(2)).toString())
            setTB2((tBal2.toFixed(2)).toString())
            setTB3((tBal3.toFixed(2)).toString())
            setTB4((tBal4.toFixed(2)).toString())
          
          }

              const [SelectedTab, setSelectedTab] = useState("3")
              const switchTab1 = () => {
                setSelectedTab("1")
            }
              const switchTab2 = () => {
                  setSelectedTab("2")
              }
              const zappTab1 = () => {
                setSelectedTab("3")
                setZappCard0of2(false)
                setZappCard1of2(false)
                setZappCard2of2(false)
                setIsMining1(false)
                setIsMining2(false)
                setIsMining3(false)
              }
              const zappTab2 = () => {
                setSelectedTab("4")
                setZappCard0of2(false)
                setZappCard1of2(false)
                setZappCard2of2(false)
                setIsMining1(false)
                setIsMining2(false)
                setIsMining3(false)
              }

              const maxBalance3 = async () => {
                if (farm.from === "USDC" && farm.to === "USDT"){
                  const newAmount = shareBalance4
                  amountState(newAmount)
                  }
                else if (farm.from === "USDC" && farm.to === "FRAX"){
                    const newAmount = shareBalance2  
                    amountState(newAmount)
                    }
                else if (farm.from === "USDC" && farm.to === "MIMATIC"){
                  const newAmount = shareBalance3
                  amountState(newAmount)
                  }
                }
            const handleInputChangeWithdraw = (event: React.ChangeEvent<HTMLInputElement>) => {
                const newAmount = event.target.value === "" ? "" : (event.target.value)
                amountState(newAmount)
            }
            const handleWithdrawSubmit = async () => {
                setWithdrawError('')
                setErrorCard(false)
                if (farm.from === "USDC" && farm.to === "USDT"){
                  try
                    {
                    const amountAsWei = ethers.utils.parseUnits((amount).toString(), 1)
                    const status = await shareWithdrawn(amountAsWei.toString(), output)
                    
                    if (status === 'wallet error'){
                      setCard0Of1(false)
                      setErrorMsg('No WALLET detected!')
                      setErrorCard(true)
                      
                    }
                    else{
                      setWithdrawalMining(true)
                      setCard0Of1(true)
                      // setWithdrawEvent(true)
                    }
                  }
                  catch (err) 
                    {
                      if (err instanceof Error){
                        setErrorMsg(err.message)
                      }
                      else{
                        setErrorMsg('Cannot withdraw tokens')
                      }
                      setErrorCard(true)
                      
                    }
                 }
                 else{      
                    try
                      {
                        const amountAsWei = utils.parseEther((amount).toString())
                        const status = await shareWithdrawn(amountAsWei.toString(), output)
                        if (status === 'wallet error'){
                          setCard0Of1(false)
                          setErrorMsg('No WALLET detected!')
                          setErrorCard(true)

                        }
                        else{
                          setWithdrawalMining(true)
                          setCard0Of1(true)
                          // setWithdrawEvent(true)
                        }
                      }
                    catch (err) 
                      {
                        if (err instanceof Error){
                          setErrorMsg(err.message)
                        }
                        else{
                          setErrorMsg('Cannot withdraw tokens')
                        }
                        setErrorCard(true)
                        
                      }
                 }
            }

            // Zapp1 Tab
            const [ zappAmount1, zappAmount1State ] = useState<string>('')
            const [zappCard0of2, setZappCard0of2] = useState<boolean>(false)
            const [zappCard1of2, setZappCard1of2] = useState<boolean>(false)
            const [zappCard2of2, setZappCard2of2] = useState<boolean>(false)
            const inputZapp1  = (event: React.ChangeEvent<HTMLInputElement>) => {
              const amt = event.target.value === "" ? "" : (event.target.value)
              zappAmount1State(amt)
            }
            const maxZappInput1 = async () => {
                zappAmount1State(tB1)  
            }
            
            const zappApprove1 = async () => {
              try{ 
                  setTxnError('')
                  setErrorCard(false)
                  const amountAsWei = Number(zappAmount1) * 1e6
                  const status = await approveToken1(amountAsWei.toString())
                  if (status === 'wallet error'){
                    setZappCard0of2(false)
                    setErrorMsg('No WALLET detected!')
                    setErrorCard(true)
                  }
                  else{
                      setZappCard0of2(true)
                      setIsMining1(true)
                      // setToken1Event(true)
                    }
                  }
              catch (err) {
                  if (err instanceof Error){
                    setErrorMsg(err.message)
                  }
                  if (error){
                    setErrorMsg('No WALLET detected!')
                  }
                  else{
                    setErrorMsg('Something went wrong')
                  }
                  setErrorCard(true)
                  setCard0Of3(false)
                  
                }
          }
          
            const zappDeposit1 = async () => {
                try {
                  setTxnError('')
                  setErrorCard(false)
                  const amountAsWei = Number(zappAmount1) * 1e6
                  const amount2AsWei = 0
                  const status = await depositTokens((amountAsWei.toString()), (amount2AsWei.toString()))
                  if (status === 'wallet error'){
                    setZappCard0of2(false)
                    setErrorMsg('No WALLET detected!')
                    setErrorCard(true)
                  }
                  else{
                    setApproved(false)
                    setIsMining3(true)
                    //setDepositEvent(true)
                  }
                }
                catch (err) {
                  if (err instanceof Error){
                    setErrorMsg(err.message)
                  
                  }
                  else{
                    setErrorMsg('Cannot deposit')
                  }
                  setErrorCard(true)
                  
                }              
              }

          //Zapp2 Tab
          const [zappAmount2, zappAmount2State ] = useState<string>('')
          const inputZapp2 = (event: React.ChangeEvent<HTMLInputElement>) => {
            const amt = event.target.value === "" ? "" : (event.target.value)
            zappAmount2State(amt)
          }
          const maxZappInput2 = async () => {
            if (farm.from === "USDC" && farm.to === "USDT"){
                  zappAmount2State(tB2)
                  }
              else if (farm.from === "USDC" && farm.to === "FRAX"){
                zappAmount2State(tB3)
                  }
              else if (farm.from === "USDC" && farm.to === "MIMATIC"){
                zappAmount2State(tB4)
                  } 
          }
          const zappApprove2 = async () => {
            setTxnError('')
            setErrorCard(false)
            if (farm.from === "USDC" && farm.to === "USDT"){
              try{
                const amount2AsWei = Number(zappAmount2) * 1e6
                const status = await approveToken2(amount2AsWei.toString())
                if (status === 'wallet error'){
                  setZappCard0of2(false)
                  setErrorMsg('No WALLET detected!')
                  setErrorCard(true)
                }
                else{
                  if (approvedToken1 === false) {
                    setZappCard0of2(true)
                  }
                  setIsMining2(true)
                  // setToken2Event(true)
                }
              }

              catch (err) {
                if (err instanceof Error){
                  setErrorMsg(err.message)
                }
                else{
                  setErrorMsg('Something went wrong')
                }
                setErrorCard(true)
                
              }
            }
            else{
              try{
                const amount2AsWei = utils.parseEther(zappAmount2.toString())
                if (approvedToken1 === false) {
                  setZappCard0of2(true)
                }
                const status = await approveToken2(amount2AsWei.toString())
                if (status === 'wallet error'){
                  setZappCard0of2(false)
                  setErrorMsg('No WALLET detected!')
                  setErrorCard(true)
                }
                else{
                  if (approvedToken1 === false) {
                    setZappCard0of2(true)
                    
                  }
                  setIsMining2(true)
                  // setToken2Event(true)
                }
            }

              catch (err) {
                if (err instanceof Error){
                  setErrorMsg(err.message)
                }
                else{
                  setErrorMsg('Something went wrong')
                }
                setErrorCard(true)
                
              }
            }
          }
          const zappDeposit2 = async () => {
            setTxnError('')
            setErrorCard(false)
            if (farm.from === "USDC" && farm.to === "USDT"){
              try {
                const amountAsWei = 0
                const amount2AsWei = Number(zappAmount2) * 1e6
                const status = await depositTokens((amountAsWei.toString()), (amount2AsWei.toString()))
                if (status === 'wallet error'){
                  setZappCard0of2(false)
                  setErrorMsg('No WALLET detected!')
                  setErrorCard(true)
                }
                else{
                  setApproved(false)
                  setIsMining3(true)
                  // setDepositEvent(true)
                }
              }
              catch (err) {
                if (err instanceof Error){
                  setErrorMsg(err.message)
                }
                else{
                  setErrorMsg('Cannot deposit')
                }
                setErrorCard(true)
                
              }
            }
            else{
              try
                {
                const amountAsWei = 0
                const amount2AsWei = utils.parseEther(zappAmount2.toString())
                const status = await depositTokens((amountAsWei.toString()), (amount2AsWei.toString()))
                if (status === 'wallet error'){
                  setZappCard0of2(false)
                  setErrorMsg('No WALLET detected!')
                  setErrorCard(true)
                }
                else{
                  setApproved(false)
                  setIsMining3(true)
                  // setDepositEvent(true)
                }
              }
              catch (err) 
                {
                  if (err instanceof Error){
                    setErrorMsg(err.message)
                  }
                  else{
                    setErrorMsg('Cannot deposit tokens')
                  }
                  setErrorCard(true)
                  
                }
                
            }             
          }           
           
          return (
            <FarmList
              key={farm.id}
              from={farm.from}
              to={farm.to}
              earned={farm.earned}
              apr={farm.apr}
              liquidity={farm.liquidity}
              multiplier={farm.multiplier}
            >
              <div className="fixed text-white left-5 top-5 z-50 gap-2 flex flex-col bg-transparent w-96">
            {card0Of3 ? <div className="bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-1/6"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
                <div className="flex flex-col text-little gap-2">
                  <div>0/3 Transactions confirmed</div>
                  <div>Approve token 1 in your wallet.</div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setCard0Of3(false)}}
                >
                  <Close className="h-auto w-2.5" />
                </Button>
              </div>
            </div> : ''}
            { card1Of3 ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-1/4"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
                <div className="flex flex-col text-little gap-2">
                  <div>1/3 Transactions confirmed</div>
                  <div>Approve token 2 in your wallet.</div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small"
                onClick={()=> {setCard1Of3(false)}} 
                >
                  <Close className="h-auto w-2.5" />
                </Button>
              </div>
            </div> : ''}
            {usdcPending && usdtPending ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-3/4"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
                <div className="flex flex-col text-little gap-2">
                  <div>2/3 Transactions confirmed</div>
                  <div>Click on deposit and<br></br>confirm transaction in your wallet.</div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setUsdcPending(false);setUsdtPending(false)}}
                >
                  <Close className="h-auto w-2.5" />
                </Button>
              </div>
            </div> : ''}
            {card3Of3 ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-full"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
                <div className="flex flex-col text-little gap-2">
                  <div>3/3 Transactions confirmed</div>
                  <div>Deposit Confirmed</div>
                  <div className="flex flex-col border border-txngreen p-5 gap-2 rounded-md">
                    <div>You have successfully deposited into the {farm.from}-{farm.to} vault</div>
                    <div className="flex flex-row text-txngreen cursor-pointer">
                    <a target="_blank"
                rel="noopener noreferrer"
                href={depositHash} className="inline-flex items-center">
                  View on Explorer&nbsp;<ExportIcon className="h-auto w-2.5" /></a>
                    </div>
                  </div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setCard3Of3(false)}}
                >
                  <Close className="h-auto w-2.5" />
                </Button>
              </div>
            </div> : ''}
            {card0Of1 ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-1/6"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
                <div className="flex flex-col text-little gap-2">
                  <div>0/1 Transactions confirmed</div>
                  <div>Confirm wallet transaction to complete withdrawal.</div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setCard0Of1(false)}}
                >
                  <Close className="h-auto w-2.5 text-white" />
                </Button>
              </div>
            </div> : ''}
            {card1Of1 ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-full"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
              <div className="flex flex-col text-little gap-2">
                  <div>1/1 Transactions confirmed</div>
                  <div>Withdraw Success</div>
                  <div className="flex flex-col border border-txngreen p-5 gap-2 rounded-md">
                    <div>You have successfully Withdrawn from the {farm.from}-{farm.to} vault</div>
                    <div className="flex flex-row text-txngreen cursor-pointer">
                    <a target="_blank"
                      rel="noopener noreferrer"
                      href={withdrawHash} className="inline-flex items-center">
                        View on Explorer&nbsp;<ExportIcon className="h-auto w-2.5" /></a>
                    </div>
                  </div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setCard1Of1(false)}}
                >
                  <Close className="h-auto w-2.5 text-white" />
                </Button>
              </div>
            </div> : ''}
            {zappCard0of2 ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-1/6"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
                <div className="flex flex-col text-little gap-2">
                  <div>0/2 Transactions confirmed</div>
                  <div>Approve token in your wallet.</div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setZappCard0of2(false)}}
                >
                  <Close className="h-auto w-2.5 text-white" />
                </Button>
              </div>
            </div> : ''}
            {zappCard1of2 ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-1/2"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
                <div className="flex flex-col text-little gap-2">
                  <div>1/2 Transactions confirmed</div>
                  <div>Click on deposit and<br></br>confirm transaction in your wallet.</div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setZappCard1of2(false)}}
                >
                  <Close className="h-auto w-2.5 text-white" />
                </Button>
              </div>
            </div> : ''}
            {zappCard2of2 ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txngreen p-2 w-full"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
              <div className="flex flex-col text-little gap-2">
                  <div>2/2 Transactions confirmed</div>
                  <div>Deposit Success</div>
                  <div className="flex flex-col border border-txngreen p-5 gap-2 rounded-md">
                    <div>You have successfully Deposited into the {farm.from}-{farm.to} vault</div>
                    <div className="flex flex-row text-txngreen cursor-pointer">
                    <a target="_blank"
                      rel="noopener noreferrer"
                      href={depositHash} className="inline-flex items-center">
                        View on Explorer&nbsp;<ExportIcon className="h-auto w-2.5 text-white" /></a>
                    </div>
                  </div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setZappCard2of2(false)}}
                >
                  <Close className="h-auto w-2.5 text-white" />
                </Button>
              </div>
            </div> : ''}
            {errorCard ? <div className=" bg-dark border-2 border-txngrey rounded-sm">
              <div className="relative bg-txnError p-2 w-full"></div>
              <div className="flex flex-row justify-between pt-3 pl-3 pr-1 pb-5">
                <div className="flex flex-col text-little gap-2 w-full">
                  <div>Transaction Error</div>
                  <div className="flex flex-col border border-txnError p-5 gap-2 rounded-md">
                    <div>{errorMsg}</div>
                  </div>
                </div>
                <Button
                title="Close"
                color="white"
                shape="circle"
                variant="transparent"
                size="small" 
                onClick={()=> {setTxnError("");setWithdrawError("");setErrorCard(false)}}
                >
                  <Close className="h-auto w-2.5 text-white" />
                </Button>
              </div>
            </div> : ''}
          </div>
              <TabContext value={SelectedTab}>
              <TabPanel value="1">
              {/* <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                  <div className="flex flex-col gap-2 text-xs font-medium uppercase text-black ltr:text-left rtl:text-left dark:text-white sm:text-sm">
                  <div className="inline-flex">
                    <div onClick={zappTab1} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.from === "USDC" ? tB1 : '0.00'}&nbsp;{farm.from}
                  </div>
                  <div className="inline-flex">
                    <div onClick={zappTab2} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.to === "USDT" ? tB2 : farm.to === "FRAX" ? tB3 : farm.to === "MIMATIC" ? tB4 : '0.00'} {farm.to}
                  </div>
                  <div className="inline-flex">
                    <div className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                      <div className="bg-white h-full w-full rounded-full"></div>
                    </div>&nbsp;
                    {farm.from} / {farm.to}
                  </div>
                  </div>
                  <div className="cursor-pointer flex text-sm text-center justify-center align-center w-full py-px h-fit bg-gray-900 border border-slate-300 rounded-md">
                    View Vault Details
                  </div>
                  <div className="flex flex-col gap-3 text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                    <span>Your Position: {farm.to === "USDT" ? poolPos1 : farm.to === "FRAX" ? poolPos2 : farm.to === "MIMATIC" ? poolPos3 : '0.00'}</span>
                    <span>{farm.to === "USDT" ? v1P1 : farm.to === "FRAX" ? v2P1 : farm.to === "MIMATIC" ? v3P1  : '0.00'} {farm.from} + {farm.to === "USDT" ? v1P2 : farm.to === "FRAX" ? v2P2 : farm.to === "MIMATIC" ? v3P2 : '0.00'} {farm.to}</span>
                  </div>
                  
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4 sm:mb-6 sm:gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0.0"
                      value={amount1}
                      onChange={handleInputChange}
                      className="spin-button-hidden h-13 w-full appearance-none rounded-lg border-solid border-gray-200 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600"
                    />
                    <span onClick={maxBalance1} className="cursor-pointer absolute top-1/2 -translate-y-1/2 rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      Max
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0.0"
                      value={amount2}
                      onChange={handleInputChange2}
                      className="spin-button-hidden h-13 w-full appearance-none rounded-lg border-solid border-gray-200 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600"
                    />
                    <span onClick={maxBalance2} className="cursor-pointer absolute top-1/2 -translate-y-1/2 rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      Max
                    </span>
                  </div>
                </div>

              <div className="mb-4 grid grid-cols-2 gap-4 sm:mb-6 sm:gap-6">
                <Button className="bg-txngreen" shape="rounded" fullWidth size="large">
                  DEPOSIT
                </Button>
                <Button onClick={switchTab2} shape="rounded" fullWidth size="large">
                  WITHDRAW
                </Button>
              </div>
              {farm.to === "USDT" ? approvedToken1 && approvedToken2 ? (
                <>
                { isMining3 ? (
                  <Button shape="rounded" fullWidth size="large">
                  <Spinner/>
                  </Button>
                ):
                  (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleDepositSubmit}>
                    DEPOSIT
                  </Button>)}
                </>
              )
               : approvedToken1 ? (<>

                { isMining2 ? (
                  <Button shape="rounded" fullWidth size="large">
                  <Spinner/>
                  </Button>
                ):
                (<Button className="bg-txngreen" onClick={handleApproveSubmit2} shape="rounded" fullWidth size="large">
                Approve {farm.to}
                  </Button>)}
                  </>
               ) : approvedToken2 ? (
                 <>
                  {isMining1 ? (
                    <Button shape="rounded" fullWidth size="large">
                    <Spinner/>
                    </Button>
                  ) : (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit1} >
                  Approve {farm.from}
                  </Button>)}
              </>
               ) : (<div className="grid grid-cols-2 gap-4 sm:gap-6">
               {isMining1 ? (<Button shape="rounded" fullWidth size="large">
               <Spinner/>
               </Button>) : 
               (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit1}>
                 Approve {farm.from}
               </Button>)}

               {isMining2 ? (
                 <Button shape="rounded" fullWidth size="large">
                 <Spinner/>
               </Button>
               ):(
               <Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit2}>
                 Approve {farm.to}
               </Button>)}
             </div>) : farm.to === "FRAX" ? approvedToken1 && approvedToken2 ? (
                 <>
                 { isMining3 ? (
                   <Button shape="rounded" fullWidth size="large">
                   <Spinner/>
                   </Button>
                 ):
                   (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleDepositSubmit}>
                     DEPOSIT
                   </Button>)}
                 </>
              )
               : approvedToken1 ? (<>

                { isMining2 ? (
                  <Button shape="rounded" fullWidth size="large">
                  <Spinner/>
                  </Button>
                ):
                (<Button className="bg-txngreen" onClick={handleApproveSubmit2} shape="rounded" fullWidth size="large">
                Approve {farm.to}
                  </Button>)}
                  </>
               ) : approvedToken2 ? (
                 <>
                  {isMining1 ? (
                    <Button shape="rounded" fullWidth size="large">
                    <Spinner/>
                    </Button>
                  ) : (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit1} >
                  Approve {farm.from}
                  </Button>)}
              </>
               ) : (<div className="grid grid-cols-2 gap-4 sm:gap-6">
               {isMining1 ? (<Button shape="rounded" fullWidth size="large">
               <Spinner/>
               </Button>) : 
               (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit1}>
                 Approve {farm.from}
               </Button>)}

               {isMining2 ? (
                 <Button shape="rounded" fullWidth size="large">
                 <Spinner/>
               </Button>
               ):(
               <Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit2}>
                 Approve {farm.to}
               </Button>)}
             </div>) : farm.to === "MIMATIC" ? approvedToken1 && approvedToken2 ? (
                 <>
                 { isMining3 ? (
                   <Button shape="rounded" fullWidth size="large">
                   <Spinner/>
                   </Button>
                 ):
                   (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleDepositSubmit}>
                     DEPOSIT
                   </Button>)}
                 </>
              )
               : approvedToken1 ? (<>

                { isMining2 ? (
                  <Button shape="rounded" fullWidth size="large">
                  <Spinner/>
                  </Button>
                ):
                (<Button className="bg-txngreen" onClick={handleApproveSubmit2} shape="rounded" fullWidth size="large">
                Approve {farm.to}
                  </Button>)}
                  </>
               ) : approvedToken2 ? (
                 <>
                  {isMining1 ? (
                    <Button shape="rounded" fullWidth size="large">
                    <Spinner/>
                    </Button>
                  ) : (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit1} >
                  Approve {farm.from}
                  </Button>)}
              </>
               ) : (<div className="grid grid-cols-2 gap-4 sm:gap-6">
               {isMining1 ? (<Button shape="rounded" fullWidth size="large">
               <Spinner/>
               </Button>) : 
               (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit1}>
                 Approve {farm.from}
               </Button>)}

               {isMining2 ? (
                 <Button shape="rounded" fullWidth size="large">
                 <Spinner/>
               </Button>
               ):(
               <Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit2}>
                 Approve {farm.to}
               </Button>)}
             </div>)  
              : 
              (<div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit1}>
                Approve {farm.from}
              </Button>
              <Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleApproveSubmit2}>
                Approve {farm.to}
              </Button>
            </div>)}
               */}
              </TabPanel>
              <TabPanel value="2">
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                  <div className="text-xs font-medium uppercase text-black ltr:text-left rtl:text-left dark:text-white sm:text-sm">
                    Shares Balance: {farm.to === 'USDT'? (parseFloat(shareBalance4) < 0 ? '0.00' : shareBalance4) : farm.to === 'FRAX' ? shareBalance2 : farm.to === 'MIMATIC' ? shareBalance3 : "0.00"}
                    <div className= "text-sm py-1">Expected token output:</div>
                    <div className="flex flex-row gap-2 text-xs font-medium uppercase text-black ltr:text-left rtl:text-left dark:text-white sm:text-sm">
                    <div onClick={()=>{setOutput(true)}} className="inline-flex items-center">
                      <div className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                        {output ? <div className="bg-white h-full w-full rounded-full"></div> : '' }
                      </div>&nbsp;{farm.from}
                    </div>
                    <div onClick={()=>{setOutput(false)}} className="inline-flex">
                      <div className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                      {!output ? <div className="bg-white h-full w-full rounded-full"></div> : '' }
                      </div>&nbsp;
                      {farm.to}
                    </div>
                    
                    </div>

                  </div>
                  <div className="cursor-pointer flex text-sm text-center justify-center align-center w-full py-px h-fit bg-gray-900 border border-slate-300 rounded-md">
                  {farm.to === "USDT" ? <a href="/usdc-usdt">View Vault Details</a> : farm.to === "FRAX" ? <a href="/usdc-frax">View Vault Details</a> : farm.to === "MIMATIC" ? <a href="/usdc-mimatic">View Vault Details</a> : ''}
                  </div>
                  <div className="flex flex-col gap-3 text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                    <span>Your Position: {farm.to === "USDT" ? poolPos1 : farm.to === "FRAX" ? poolPos2 : farm.to === "MIMATIC" ? poolPos3 : '0.00'}</span>
                    <span>{farm.to === "USDT" ? v1P1 : farm.to === "FRAX" ? v2P1 : farm.to === "MIMATIC" ? v3P1  : '0.00'} {farm.from} + {farm.to === "USDT" ? v1P2 : farm.to === "FRAX" ? v2P2 : farm.to === "MIMATIC" ? v3P2 : '0.00'} {farm.to}</span>
                  </div>
                  
                </div>
                <div className="mb-2 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6">
                  
                  <div className="mb-2 grid grid-cols-2 gap-3 sm:mb-1 px-5 py-3 rounded-lg border border-slate-500 bg-body dark:border-gray-700 dark:bg-gray-900 sm:gap-3">
                    <Button className="bg-gray-800" onClick={zappTab1} shape="rounded" fullWidth size="large">
                      DEPOSIT
                    </Button>
                  
                    <Button className="bg-txngreen" shape="rounded" fullWidth size="large">
                        WITHDRAW
                    </Button>
                    
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0.0"
                      value={amount}
                      onChange={handleInputChangeWithdraw}
                      className="spin-button-hidden h-13 w-full appearance-none rounded-lg border-solid border-gray-400 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600"
                    />
                    <span onClick={maxBalance3} className="cursor-pointer absolute top-1/2 -translate-y-1/2 rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      Max
                    </span>
                  </div>
                  {withdrawalMining ? 
                    (<Button shape="rounded" fullWidth size="large">
                    <Spinner/>
                  </Button>)
                  : (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={handleWithdrawSubmit}>
                    WITHDRAW
                  </Button>)}
                </div>
                
              </TabPanel>
              <TabPanel value="3">
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                  <div className="flex flex-col gap-2 text-xs font-medium uppercase text-black ltr:text-left rtl:text-left dark:text-white sm:text-sm">
                  <div className="inline-flex items-center">
                    <div className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                      <div className="bg-white h-full w-full rounded-full"></div>
                    </div>&nbsp;
                    <Image height={"20"} width={"20"} src={usdcsvgImage} alt="usdc-img" />&nbsp;
                    {farm.from === "USDC" ? tB1 : '0.00'}&nbsp;{farm.from}
                  </div>
                  <div className="inline-flex">
                    <div onClick={zappTab2} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.to === "USDT" ? 
                      <div className="inline-flex items-center">
                        <Image height={"20"} width={"20"} src={tethersvgImage} alt="usdc-img" />&nbsp;
                          {tB2} 
                      </div>
                      : 
                     farm.to === "FRAX" ? 
                      <div className="inline-flex items-center">
                        <Image height={"21"} width={"20"} src={fraxsvgImage} alt="usdc-img" />&nbsp;
                          {tB3} 
                      </div>
                     : farm.to === "MIMATIC" ? 
                      <div className="inline-flex items-center">
                        <div className="-ml-1.5 -mr-2 inline-flex items-center">
                          <Image height={"23"} width={"34"} src={mimaticsvgImage} alt="usdc-img" />&nbsp;
                        </div>
                          {tB4} 
                      </div>
                     : '0.00'}&nbsp;{farm.to}
                  </div>
                  {/* <div className="inline-flex">
                    <div onClick={switchTab1} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.from} / {farm.to}
                  </div> */}
                  </div>
                  <div className="cursor-pointer flex text-sm text-center justify-center align-center w-full py-px h-fit bg-gray-100 dark:bg-gray-900 border border-slate-500 rounded-md">
                  {farm.to === "USDT" ? <a href="/usdc-usdt">View Vault Details</a> : farm.to === "FRAX" ? <a href="/usdc-frax">View Vault Details</a> : farm.to === "MIMATIC" ? <a href="/usdc-mimatic">View Vault Details</a> : ''}
                  </div>
                  <div className="flex flex-col gap-3 text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                    <span>Your Position: {farm.to === "USDT" ? poolPos1 : farm.to === "FRAX" ? poolPos2 : farm.to === "MIMATIC" ? poolPos3 : '0.00'}</span>
                    <span>{farm.to === "USDT" ? v1P1 : farm.to === "FRAX" ? v2P1 : farm.to === "MIMATIC" ? v3P1  : '0.00'} {farm.from} + {farm.to === "USDT" ? v1P2 : farm.to === "FRAX" ? v2P2 : farm.to === "MIMATIC" ? v3P2 : '0.00'} {farm.to}</span>
                  </div>
                  
                </div>
                <div className="mb-2 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6">
                  
                  <div className="mb-2 grid grid-cols-2 gap-3 sm:mb-1 px-5 py-3 rounded-lg border border-slate-500 bg-body dark:border-gray-700 dark:bg-gray-900 sm:gap-3">
                    <Button className="bg-txngreen" shape="rounded" fullWidth size="large">
                      DEPOSIT
                    </Button>
                  
                    <Button className="bg-gray-800" onClick={switchTab2} shape="rounded" fullWidth size="large">
                        WITHDRAW
                    </Button>
                    
                  </div>
                  <div className="relative h-13 w-full flex flex-row items-center rounded-lg border border-slate-500 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600">
                    <Image height={"20"} width={"20"} src={usdcsvgImage} alt="usdc-img" />
                    <input
                      type="text"
                      placeholder="0.0"
                      value={zappAmount1}
                      onChange={inputZapp1}
                      className="spin-button-hidden h-10 w-full appearance-none rounded-lg border-solid border-body bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-900 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-900"
                    />
                    <span onClick={maxZappInput1} className="cursor-pointer rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      Max
                    </span>
                  </div>
                  {approvedToken1 ? 
                    (<>
                      { isMining3 ? (
                        <Button shape="rounded" fullWidth size="large">
                        <Spinner/>
                        </Button>
                      ):
                        (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={zappDeposit1}>
                          DEPOSIT
                        </Button>)}
                      </>)
                  : isMining1 ? (
                  <Button shape="rounded" fullWidth size="large">
                    <Spinner/>
                  </Button>)
                  : (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={zappApprove1}>
                    Approve {farm.from}
                  </Button>)}
                </div>
                
              </TabPanel>
              <TabPanel value="4">
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                  <div className="flex flex-col gap-2 text-xs font-medium uppercase text-black ltr:text-left rtl:text-left dark:text-white sm:text-sm">
                  <div className="inline-flex items-center">
                    <div onClick={zappTab1} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    <Image height={"20"} width={"20"} src={usdcsvgImage} alt="usdc-img" />&nbsp;
                    {farm.from === "USDC" ? tB1 : '0.00'}&nbsp;{farm.from}
                  </div>
                  <div className="inline-flex">
                    <div className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                      <div className="bg-white h-full w-full rounded-full"></div>
                    </div>&nbsp;
                    {farm.to === "USDT" ? 
                      <div className="inline-flex items-center">
                        <Image height={"20"} width={"20"} src={tethersvgImage} alt="usdc-img" />&nbsp;
                          {tB2} 
                      </div>
                      : 
                     farm.to === "FRAX" ? 
                      <div className="inline-flex items-center">
                        <Image height={"21"} width={"20"} src={fraxsvgImage} alt="usdc-img" />&nbsp;
                          {tB3} 
                      </div>
                     : farm.to === "MIMATIC" ? 
                      <div className="inline-flex items-center">
                        <div className="-ml-1.5 -mr-2 inline-flex items-center">
                          <Image height={"23"} width={"34"} src={mimaticsvgImage} alt="usdc-img" />&nbsp;
                        </div>
                        {tB4} 
                      </div>
                     : '0.00'}&nbsp;{farm.to}
                  </div>
                  {/* <div className="inline-flex">
                    <div onClick={switchTab1} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.from} / {farm.to}
                  </div> */}
                  </div>
                  <div className="cursor-pointer flex text-sm text-center justify-center align-center w-full py-px h-fit bg-gray-100 dark:bg-gray-900 border border-slate-500 rounded-md">
                  {farm.to === "USDT" ? <a href="/usdc-usdt">View Vault Details</a> : farm.to === "FRAX" ? <a href="/usdc-frax">View Vault Details</a> : farm.to === "MIMATIC" ? <a href="/usdc-mimatic">View Vault Details</a> : ''}
                  </div>
                  <div className="flex flex-col gap-3 text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                    <span>Your Position: {farm.to === "USDT" ? poolPos1 : farm.to === "FRAX" ? poolPos2 : farm.to === "MIMATIC" ? poolPos3 : '0.00'}</span>
                    <span>{farm.to === "USDT" ? v1P1 : farm.to === "FRAX" ? v2P1 : farm.to === "MIMATIC" ? v3P1  : '0.00'} {farm.from} + {farm.to === "USDT" ? v1P2 : farm.to === "FRAX" ? v2P2 : farm.to === "MIMATIC" ? v3P2 : '0.00'} {farm.to}</span>
                  </div>
                  
                </div>
                <div className="mb-2 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6">
                  
                  <div className="mb-2 grid grid-cols-2 gap-3 sm:mb-1 px-5 py-3 rounded-lg border border-slate-500 bg-body dark:border-gray-700 dark:bg-gray-900 sm:gap-3">
                    <Button className="bg-txngreen" shape="rounded" fullWidth size="large">
                      DEPOSIT
                    </Button>
                  
                    <Button className="bg-gray-800" onClick={switchTab2} shape="rounded" fullWidth size="large">
                        WITHDRAW
                    </Button>
                    
                  </div>
                  <div className="relative h-13 w-full flex flex-row items-center rounded-lg border border-slate-500 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600">
                    {farm.to === "USDT" ? 
                    <Image height={"20"} width={"20"} src={tethersvgImage} alt="usdt-img" />
                    : farm.to === "FRAX" ? 
                    <Image height={"21"} width={"21"} src={fraxsvgImage} alt="frax-img" />
                    : farm.to === "MIMATIC" ? 
                    <Image height={"22"} width={"22"} src={mimaticsvgImage} alt="mimatic-img" />
                    : ""}
                    <input
                      type="text"
                      placeholder="0.0"
                      value={zappAmount2}
                      onChange={inputZapp2}
                      className="spin-button-hidden h-10 w-full appearance-none rounded-lg border-solid border-body bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-900 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-900"
                    />
                    <span onClick={maxZappInput2} className="cursor-pointer rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      Max
                    </span>
                  </div>
                  {approvedToken2 ? 
                    (<>
                      { isMining3 ? (
                        <Button shape="rounded" fullWidth size="large">
                        <Spinner/>
                        </Button>
                      ):
                        (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={zappDeposit2}>
                          DEPOSIT
                        </Button>)}
                      </>)
                  : isMining2 ? (
                  <Button shape="rounded" fullWidth size="large">
                    <Spinner/>
                  </Button>)
                  : (<Button className="bg-txngreen" shape="rounded" fullWidth size="large" onClick={zappApprove2}>
                    Approve {farm.to}
                  </Button>)}
                </div>
                
              </TabPanel>
              </TabContext>
            </FarmList>
          );
        })}
      </div>
    </>
  );
};

FarmsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FarmsPage;
