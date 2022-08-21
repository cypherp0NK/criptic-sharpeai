import {useContext, useEffect, useState} from "react"
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import cn from 'classnames';
import { Transition } from '@/components/ui/transition';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronDown } from '@/components/icons/chevron-down';
import { SearchIcon } from '@/components/icons/search';
import FarmList from '@/components/farms/list';
import { FarmsData } from '@/data/static/farms-data';
import { useDepositTokens } from '@/data/utils/useDepositTokens';
import { vaultData } from '@/data/utils/vaultData';
import { utils, ethers, providers } from 'ethers';
import { formatUnits } from "@ethersproject/units"
import {WalletContext} from "@/lib/hooks/use-connect"
import {TabContext, TabPanel} from "@material-ui/lab"
import { useWithdrawTokens } from '@/data/utils/useWithdrawTokens';
import { getEventListeners } from "events";
import { Divider } from "@material-ui/core";
import { Close } from '@/components/icons/close';
import { ExportIcon } from '@/components/icons/export-icon';
import { Spinner } from '../components/icons/spinner';
import { ERROR_EVENT } from "web3modal";


const sort = [
  { id: 1, name: 'Hot' },
  { id: 2, name: 'APR' },
  { id: 3, name: 'Earned' },
  { id: 4, name: 'Total staked' },
  { id: 5, name: 'Latest' },
];

function SortList() {
  const [selectedItem, setSelectedItem] = useState(sort[0]);

  return (
    <div className="relative w-full md:w-auto">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex h-11 w-full items-center justify-between rounded-lg bg-gray-100 px-4 text-sm text-gray-900 dark:bg-light-dark dark:text-white md:w-36 lg:w-40 xl:w-56">
          {selectedItem.name}
          <ChevronDown />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-300"
          enterFrom="opacity-0 "
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
        >
          <Listbox.Options className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-lg bg-white p-3 shadow-large dark:bg-light-dark">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition dark:text-white  ${
                      selected
                        ? 'my-1 bg-gray-100 dark:bg-dark'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

function Search() {
  return (
    <form
      className="relative flex w-full rounded-full md:w-auto lg:w-64 xl:w-80"
      noValidate
      role="search"
    >
      <label className="flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
          placeholder="Search farms"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
    </form>
  );
}

function StackedSwitch() {
  let [isStacked, setIsStacked] = useState(false);
  return (
    <Switch
      checked={isStacked}
      onChange={setIsStacked}
      className="flex items-center gap-2 text-gray-400 sm:gap-3"
    >
      <div
        className={cn(
          isStacked ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-500',
          'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
        )}
      >
        <span
          className={cn(
            isStacked
              ? 'bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-light-dark'
              : 'bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-light-dark',
            'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
          )}
        />
      </div>
      <span className="inline-flex text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-sm">
        Staked only
      </span>
    </Switch>
  );
}

function Status() {
  let [status, setStatus] = useState('live');

  return (
    <RadioGroup
      value={status}
      onChange={setStatus}
      className="flex items-center sm:gap-3"
    >
      <RadioGroup.Option value="live">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${
              checked ? 'text-white' : 'text-brand'
            }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">LIVE</span>
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="finished">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${
              checked ? 'text-white' : 'text-brand'
            }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">FINISHED</span>
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}

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
            const { address, shareBalance1, shareBalance2, shareBalance3, shareBalance4, poolPos1, poolPos2, poolPos3, 
              v1P1,
              v1P2,
              v2P1,
              v2P2,
              v3P1,
              v3P2,
              tB1,
              tB2,
              tB3,
              tB4, error } = useContext(WalletContext);

            const {approveToken1, approvingToken1State, approveToken2, approvingToken2State, depositTokens, depositState, erc20ABI, abi} = useDepositTokens(farm.token1, farm.token2, farm.vault)
            const {totalSupply, fetchPrice, tokenBalances, } = vaultData(farm.vault, farm.token1, farm.token2)
            const provider = new providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/2VsZl1VcrmWJ44CvrD9pt1HFieK6TQfZ')
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
            const [depositHash, setDepositHash] = useState<string>('https://polygonscan.com/tx/')
            const [withdrawHash, setWithdrawHash] = useState<string>('https://polygonscan.com/tx/')
            const [errorCard, setErrorCard] = useState<boolean>(false)
            const [errorMsg, setErrorMsg] = useState<string>('')

          //   const maxBalance1 = async () => {
          //     if (farm.from === "USDC" && farm.to === "USDT"){
          //       const newAmount = tB1
          //       const [p1, p2] = await fetchPrice(6)
          //       const calcEquiv = String((parseFloat(newAmount) * p2).toFixed(5))
          //       setAmount(newAmount)
          //       setAmount2(calcEquiv)
          //       setAmt(newAmount)
          //       setAmt2(calcEquiv)
          //       }
          //     else{
          //       const newAmount = tB1
          //       const [p1, p2] = await fetchPrice(18)
          //       const calcEquiv = String((parseFloat(newAmount) * p2).toFixed(5))
          //       setAmount(newAmount)
          //       setAmount2(calcEquiv)
          //       setAmt(newAmount)
          //       setAmt2(calcEquiv)
          //     }         
          // }
          // const maxBalance2 = async () => {
          //   if (farm.from === "USDC" && farm.to === "USDT"){
          //     const newAmount = tB2
          //     const [p1, p2] = await fetchPrice(6)
          //     const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
          //     setAmount2(newAmount)
          //     setAmount(calcEquiv)
          //     setAmt2(newAmount)
          //     setAmt(calcEquiv)
          //     }
          // else if (farm.from === "USDC" && farm.to === "FRAX"){
          //   const newAmount = tB3
          //     const [p1, p2] = await fetchPrice(18)
          //     const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
          //     setAmount2(newAmount)
          //     setAmount(calcEquiv)
          //     setAmt2(newAmount)
          //     setAmt(calcEquiv)
          //     }
          // else if (farm.from === "USDC" && farm.to === "MIMATIC"){
          //   const newAmount = tB4
          //     const [p1, p2] = await fetchPrice(18)
          //     const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
          //     setAmount2(newAmount)
          //     setAmount(calcEquiv)
          //     setAmt2(newAmount)
          //     setAmt(calcEquiv)
          //     }
          // }
          //   const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
          //         if (farm.from === "USDC" && farm.to === "USDT"){
          //           const newAmount = event.target.value === "" ? "" : (event.target.value)
          //           const [p1, p2] = await fetchPrice(6)
          //           const calcEquiv = String((parseFloat(newAmount) * p2).toFixed(5))
          //           setAmount(newAmount)
          //           setAmount2(calcEquiv)
          //           setAmt(newAmount)
          //           setAmt2(calcEquiv)
          //           }
          //         else{
          //           const newAmount = event.target.value === "" ? "" : (event.target.value)
          //           const [p1, p2] = await fetchPrice(18)
          //           const calcEquiv = String((parseFloat(newAmount) * p2).toFixed(5))
          //           setAmount(newAmount)
          //           setAmount2(calcEquiv)
          //           setAmt(newAmount)
          //           setAmt2(calcEquiv)
          //         }
          //       }
          //   const handleInputChange2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
          //     if (farm.from === "USDC" && farm.to === "USDT"){
          //         const newAmount = event.target.value === "" ? "" : (event.target.value)
          //         const [p1, p2] = await fetchPrice(6)
          //         const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
          //         setAmount2(newAmount)
          //         setAmount(calcEquiv)
          //         setAmt2(newAmount)
          //         setAmt(calcEquiv)
          //         }
          //     else{
          //       const newAmount = event.target.value === "" ? "" : (event.target.value)
          //         const [p1, p2] = await fetchPrice(18)
          //         const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
          //         setAmount2(newAmount)
          //         setAmount(calcEquiv)
          //         setAmt2(newAmount)
          //         setAmt(calcEquiv)
          //         }
          //       }

          //   const handleApproveSubmit1 = async () => {
          //       try{ 
          //           const amountAsWei = Number(amt1) * 1e6
          //           const status = await approveToken1(amountAsWei.toString())
          //           if (status === 'wallet error'){
          //             setCard0Of3(false)
          //             setErrorMsg('No WALLET detected!')
          //             setErrorCard(true)
          //           }
          //           else{
          //             if (approvedToken2 === false) {
          //               setCard0Of3(true)
                        
          //               }
          //               setIsMining1(true)
          //             }
          //           }
          //       catch (err) {
          //           if (err instanceof Error){
          //             setErrorMsg(err.message)
          //           }
          //           if (error){
          //             setErrorMsg('No WALLET detected!')
          //           }
          //           else{
          //             setErrorMsg('Something went wrong')
          //           }
          //           setErrorCard(true)
          //           setCard0Of3(false)
          //         }
          //   }

          //   const handleApproveSubmit2 = async () => {
              
          //     if (farm.from === "USDC" && farm.to === "USDT"){
          //       try{
          //         const amount2AsWei = Number(amt2) * 1e6
          //         const status = await approveToken2(amount2AsWei.toString())
          //         if (status === 'wallet error'){
          //           setCard0Of3(false)
          //           setErrorMsg('No WALLET detected!')
          //           setErrorCard(true)
          //         }
          //         else{
          //           if (approvedToken1 === false) {
          //             setCard0Of3(true)
                      
          //           }
          //           setIsMining2(true)
          //         }
          //       }

          //       catch (err) {
          //         if (err instanceof Error){
          //           setErrorMsg(err.message)
          //         }
          //         else{
          //           setErrorMsg('Something went wrong')
          //         }
          //         setErrorCard(true)
          //       }
          //     }
          //     else{
          //       try{
          //         const amount2AsWei = utils.parseEther(amt2.toString())
          //         if (approvedToken1 === false) {
          //           setCard0Of3(true)
          //         }
          //         const status = await approveToken2(amount2AsWei.toString())
          //         if (status === 'wallet error'){
          //           setCard0Of3(false)
          //           setErrorMsg('No WALLET detected!')
          //           setErrorCard(true)
          //         }
          //         else{
          //           if (approvedToken1 === false) {
          //             setCard0Of3(true)
                      
          //           }
          //           setIsMining2(true)
          //         }
          //     }

          //       catch (err) {
          //         if (err instanceof Error){
          //           setErrorMsg(err.message)
          //         }
          //         else{
          //           setErrorMsg('Something went wrong')
          //         }
          //         setErrorCard(true)
          //       }
          //     }
          //   }
              
              
          //   const handleDepositSubmit = async () => {
          //     if (farm.from === "USDC" && farm.to === "USDT"){
          //       try {
          //         const amountAsWei = Number(amt1) * 1e6
          //         const amount2AsWei = Number(amt2) * 1e6
          //         const status = await depositTokens((amountAsWei.toString()), (amount2AsWei.toString()))
          //         if (status === 'wallet error'){
          //           setCard0Of3(false)
          //           setErrorMsg('No WALLET detected!')
          //           setErrorCard(true)
          //         }
          //         else{
          //           setApproved(false)
          //           setIsMining3(true)
          //         }
          //       }
          //       catch (err) {
          //         if (err instanceof Error){
          //           setErrorMsg(err.message)
          //         }
          //         else{
          //           setErrorMsg('Cannot deposit')
          //         }
          //         setErrorCard(true)
          //       }
          //     }
          //     else{
          //       try
          //         {
          //         const amountAsWei = Number(amt1) * 1e6
          //         const amount2AsWei = utils.parseEther(amt2.toString())
          //         const status = await depositTokens((amountAsWei.toString()), (amount2AsWei.toString()))
          //         if (status === 'wallet error'){
          //           setCard0Of3(false)
          //           setErrorMsg('No WALLET detected!')
          //           setErrorCard(true)
          //         }
          //         else{
          //           setApproved(false)
          //           setIsMining3(true)
          //         }
          //       }
          //       catch (err) 
          //         {
          //           if (err instanceof Error){
          //             setErrorMsg(err.message)
          //           }
          //           else{
          //             setErrorMsg('Cannot deposit tokens')
          //           }
          //           setErrorCard(true)
          //         }
                  
          //     }
              
          //     }

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

              // Withdraw Tab

              const {shareWithdrawn, shareWithdrawState} = useWithdrawTokens(farm.vault)
              const {sharesBalance} = vaultData(farm.vault, farm.token1, farm.token2)
              const [ amount, amountState ] = useState<string>('')
              const [card0Of1, setCard0Of1] = useState<boolean>(false)
              const [card1Of1, setCard1Of1] = useState<boolean>(false)
              const [withdrawalMining, setWithdrawalMining] = useState<boolean>(false)

              const maxBalance3 = async () => {
                if (farm.from === "USDC" && farm.to === "USDT"){
                  const newAmount = shareBalance1
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
                if (farm.from === "USDC" && farm.to === "USDT"){
                  try
                    {
                    const amountAsWei = ethers.utils.parseUnits((amount).toString(), 1)
                    const status = await shareWithdrawn(amountAsWei.toString())
                    if (status === 'wallet error'){
                      setCard0Of1(false)
                      setErrorMsg('No WALLET detected!')
                      setErrorCard(true)
                    }
                    else{
                      setWithdrawalMining(true)
                      setCard0Of1(true)
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
                        const status = await shareWithdrawn(amountAsWei.toString())
                        if (status === 'wallet error'){
                          setCard0Of1(false)
                          setErrorMsg('No WALLET detected!')
                          setErrorCard(true)
                        }
                        else{
                          setWithdrawalMining(true)
                          setCard0Of1(true)
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
            useEffect(() => {
              
                const contr = new ethers.Contract(farm.token1, erc20ABI, provider)
                const contr2 = new ethers.Contract(farm.token2, erc20ABI, provider)
                const sharpeEvents = new ethers.Contract(farm.vault, abi, provider)
                if (usdtPending && usdcPending) {
                  setCard1Of3(false)
                }
                
              contr.on("Approval", (from, to, amount, event) => {
                
                  if (from === address && to === farm.vault)
                    {
                      setCard0Of3(false)
                      setZappCard0of2(false)
                      setZappCard1of2(true)
                      setApprovedToken1(true)
                      //setUsdcPending(true)
                      setIsMining1(false)                      
                      // setCard1Of3(true)
                    }
                  
              })
              contr2.on("Approval", (from, to, amount) => {
                if (from === address && to === farm.vault)
                  {
                    setCard0Of3(false)
                    setZappCard0of2(false)
                    setZappCard1of2(true)
                    setApprovedToken2(true)
                    //setUsdtPending(true)
                    setIsMining2(false)
                    // setCard1Of3(true)
                  }
            })
            
              sharpeEvents.on("Deposit", (sender, to, shares, amount0, amount1, event) => {
                if (to === address)
                  {
                    setDepositHash(('https://polygonscan.com/tx/').concat(event.transactionHash))
                    setCard1Of3(false)
                    setUsdcPending(false)
                    setZappCard1of2(false)
                    setZappCard2of2(true)
                    //setCard3Of3(true)
                    setIsMining3(false)
                  }
            })
            sharpeEvents.on("Withdraw", (sender, to, shares, amount0, amount1, event) => {
              if (to === address)
                {
                  setWithdrawHash(('https://polygonscan.com/tx/').concat(event.transactionHash))
                  setCard0Of1(false)

                  setCard1Of1(true)
                  setWithdrawalMining(false)
                }
          })
         

            
            }, [])
           
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
              <div className="fixed left-5 top-5 z-50 gap-2 flex flex-col bg-transparent w-96">
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
                  <Close className="h-auto w-2.5" />
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
                  <Close className="h-auto w-2.5" />
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
                  <Close className="h-auto w-2.5" />
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
                  <Close className="h-auto w-2.5" />
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
                onClick={()=> {setZappCard2of2(false)}}
                >
                  <Close className="h-auto w-2.5" />
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
                onClick={()=> {setErrorCard(false)}}
                >
                  <Close className="h-auto w-2.5" />
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
                <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-6">
                  <div className="text-xs font-medium uppercase text-black ltr:text-left rtl:text-left dark:text-white sm:text-sm">
                    Shares Balance: {farm.to === 'USDT'? shareBalance4 : farm.to === 'FRAX' ? shareBalance2 : farm.to === 'MIMATIC' ? shareBalance3 : "0.00"}
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
                <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-6">
                  <div className="flex flex-col gap-2 text-xs font-medium uppercase text-black ltr:text-left rtl:text-left dark:text-white sm:text-sm">
                  <div className="inline-flex">
                    <div className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                      <div className="bg-white h-full w-full rounded-full"></div>
                    </div>&nbsp;
                    {farm.from === "USDC" ? tB1 : '0.00'}&nbsp;{farm.from}
                  </div>
                  <div className="inline-flex">
                    <div onClick={zappTab2} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.to === "USDT" ? tB2 : farm.to === "FRAX" ? tB3 : farm.to === "MIMATIC" ? tB4 : '0.00'} {farm.to}
                  </div>
                  {/* <div className="inline-flex">
                    <div onClick={switchTab1} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.from} / {farm.to}
                  </div> */}
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
                    <Button className="bg-txngreen" shape="rounded" fullWidth size="large">
                      DEPOSIT
                    </Button>
                  
                    <Button className="bg-gray-800" onClick={switchTab2} shape="rounded" fullWidth size="large">
                        WITHDRAW
                    </Button>
                    
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0.0"
                      value={zappAmount1}
                      onChange={inputZapp1}
                      className="spin-button-hidden h-13 w-full appearance-none rounded-lg border-solid border-gray-400 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600"
                    />
                    <span onClick={maxZappInput1} className="cursor-pointer absolute top-1/2 -translate-y-1/2 rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
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
                <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-6">
                  <div className="flex flex-col gap-2 text-xs font-medium uppercase text-black ltr:text-left rtl:text-left dark:text-white sm:text-sm">
                  <div className="inline-flex">
                    <div onClick={zappTab1} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.from === "USDC" ? tB1 : '0.00'}&nbsp;{farm.from}
                  </div>
                  <div className="inline-flex">
                    <div className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                      <div className="bg-white h-full w-full rounded-full"></div>
                    </div>&nbsp;
                    {farm.to === "USDT" ? tB2 : farm.to === "FRAX" ? tB3 : farm.to === "MIMATIC" ? tB4 : '0.00'} {farm.to}
                  </div>
                  {/* <div className="inline-flex">
                    <div onClick={switchTab1} className="cursor-pointer bg-gray-900 h-5 w-5 rounded-full p-1 border border-white">
                    </div>&nbsp;
                    {farm.from} / {farm.to}
                  </div> */}
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
                    <Button className="bg-txngreen" shape="rounded" fullWidth size="large">
                      DEPOSIT
                    </Button>
                  
                    <Button className="bg-gray-800" onClick={switchTab2} shape="rounded" fullWidth size="large">
                        WITHDRAW
                    </Button>
                    
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0.0"
                      value={zappAmount2}
                      onChange={inputZapp2}
                      className="spin-button-hidden h-13 w-full appearance-none rounded-lg border-solid border-gray-400 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600"
                    />
                    <span onClick={maxZappInput2} className="cursor-pointer absolute top-1/2 -translate-y-1/2 rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
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
                  : isMining1 ? (
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
