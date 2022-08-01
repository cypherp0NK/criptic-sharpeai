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
import { utils, ethers } from 'ethers';
import { formatUnits } from "@ethersproject/units"
import {WalletContext} from "@/lib/hooks/use-connect"
import {TabContext, TabPanel} from "@material-ui/lab"
import { useWithdrawTokens } from '@/data/utils/useWithdrawTokens';
import { getEventListeners } from "events";


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
        {/* <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <Status />
            <div className="md:hidden">
              <StackedSwitch />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden shrink-0 md:block">
              <StackedSwitch />
            </div>
            <Search />
            <SortList />
          </div>
        </div> */}

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
            const { address, shareBalance1, shareBalance2, shareBalance3, poolPos1, poolPos2, poolPos3, 
              v1P1,
              v1P2,
              v2P1,
              v2P2,
              v3P1,
              v3P2,
              tB1,
              tB2,
              tB3,
              tB4 } = useContext(WalletContext);

            const {approveToken1, approvingToken1State, approveToken2, approvingToken2State, depositTokens, depositState, erc20ABI, provider} = useDepositTokens(farm.token1, farm.token2, farm.vault)
            const {totalSupply, fetchPrice, tokenBalances} = vaultData(farm.vault, farm.token1, farm.token2)
            const [ amount1, setAmount ] = useState<string>('')
            const [ amount2, setAmount2 ] = useState<string>('')
            const [amt1, setAmt] = useState<string>('')
            const [amt2, setAmt2] = useState<string>('')
            const [approved, setApproved] = useState<boolean>(false)

            const maxBalance1 = async () => {
              if (farm.from === "USDC" && farm.to === "USDT"){
                const newAmount = tB1
                const [p1, p2] = await fetchPrice(6)
                const calcEquiv = String((parseFloat(newAmount) * p2).toFixed(5))
                setAmount(newAmount)
                setAmount2(calcEquiv)
                setAmt(newAmount)
                setAmt2(calcEquiv)
                }
              else{
                const newAmount = tB1
                const [p1, p2] = await fetchPrice(18)
                const calcEquiv = String((parseFloat(newAmount) * p2).toFixed(5))
                setAmount(newAmount)
                setAmount2(calcEquiv)
                setAmt(newAmount)
                setAmt2(calcEquiv)
              }         
          }
          const maxBalance2 = async () => {
            if (farm.from === "USDC" && farm.to === "USDT"){
              const newAmount = tB2
              const [p1, p2] = await fetchPrice(6)
              const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
              setAmount2(newAmount)
              setAmount(calcEquiv)
              setAmt2(newAmount)
              setAmt(calcEquiv)
              }
          else if (farm.from === "USDC" && farm.to === "FRAX"){
            const newAmount = tB3
              const [p1, p2] = await fetchPrice(18)
              const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
              setAmount2(newAmount)
              setAmount(calcEquiv)
              setAmt2(newAmount)
              setAmt(calcEquiv)
              }
          else if (farm.from === "USDC" && farm.to === "MIMATIC"){
            const newAmount = tB4
              const [p1, p2] = await fetchPrice(18)
              const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
              setAmount2(newAmount)
              setAmount(calcEquiv)
              setAmt2(newAmount)
              setAmt(calcEquiv)
              }
          }
            const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
                  if (farm.from === "USDC" && farm.to === "USDT"){
                    const newAmount = event.target.value === "" ? "" : (event.target.value)
                    const [p1, p2] = await fetchPrice(6)
                    const calcEquiv = String((parseFloat(newAmount) * p2).toFixed(5))
                    setAmount(newAmount)
                    setAmount2(calcEquiv)
                    setAmt(newAmount)
                    setAmt2(calcEquiv)
                    }
                  else{
                    const newAmount = event.target.value === "" ? "" : (event.target.value)
                    const [p1, p2] = await fetchPrice(18)
                    const calcEquiv = String((parseFloat(newAmount) * p2).toFixed(5))
                    setAmount(newAmount)
                    setAmount2(calcEquiv)
                    setAmt(newAmount)
                    setAmt2(calcEquiv)
                  }
                }
            const handleInputChange2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
              if (farm.from === "USDC" && farm.to === "USDT"){
                  const newAmount = event.target.value === "" ? "" : (event.target.value)
                  const [p1, p2] = await fetchPrice(6)
                  const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
                  setAmount2(newAmount)
                  setAmount(calcEquiv)
                  setAmt2(newAmount)
                  setAmt(calcEquiv)
                  }
              else{
                const newAmount = event.target.value === "" ? "" : (event.target.value)
                  const [p1, p2] = await fetchPrice(18)
                  const calcEquiv = String((parseFloat(newAmount) * p1).toFixed(5))
                  setAmount2(newAmount)
                  setAmount(calcEquiv)
                  setAmt2(newAmount)
                  setAmt(calcEquiv)
                  }
                }
            const handleApproveSubmit = async () => {
                  if (farm.from === "USDC" && farm.to === "USDT"){
                    const amountAsWei = Number(amt1) * 1e6
                    const amount2AsWei = Number(amt2) * 1e6
                    setApproved(true)
                    return [approveToken1(amountAsWei.toString()), approveToken2(amount2AsWei.toString())]
                    
                  }
                  else{
                    const amountAsWei = Number(amt1) * 1e6
                    const amount2AsWei = utils.parseEther(amt2.toString())
                    const tS = totalSupply()
                    setApproved(true)
                    return [approveToken1(amountAsWei.toString()), approveToken2(amount2AsWei.toString())]
                  }
                  
              }
              const getContractEvent = async () => {
                console.log('running')
                    
                    let contr = new ethers.Contract(farm.token1, erc20ABI, provider)
                    
                    contr.on("approve", (from, to, amount, event) => {
                        console.log("transfer happened")
                        console.log(amount.toString())
                        console.log(event)
                        console.log(JSON.stringify(from))
                    })
              }
              
            const handleDepositSubmit = async () => {
              if (farm.from === "USDC" && farm.to === "USDT"){
                const amountAsWei = Number(amt1) * 1e6
                const amount2AsWei = Number(amt2) * 1e6
                setApproved(false)
                return [depositTokens((amountAsWei.toString()), (amount2AsWei.toString()))]
              }
              else{
                const amountAsWei = Number(amt1) * 1e6
                const amount2AsWei = utils.parseEther(amt2.toString())
                setApproved(false)
                return [depositTokens((amountAsWei.toString()), (amount2AsWei.toString()))]
              }
              
              }

              const [SelectedTab, setSelectedTab] = useState("1")
              const switchTab1 = () => {
                setSelectedTab("1")
            }
              const switchTab2 = () => {
                  setSelectedTab("2")
              }

              // Withdraw Tab

              const {shareWithdrawn, shareWithdrawState} = useWithdrawTokens(farm.vault)
              const {sharesBalance} = vaultData(farm.vault, farm.token1, farm.token2)
              const [ amount, amountState ] = useState<string>('')

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
            const handleWithdrawSubmit = () => {
                if (farm.from === "USDC" && farm.to === "USDT"){
                    console.log(address)
                    const amountAsWei = ethers.utils.parseUnits((amount).toString(), 1)
                    return [shareWithdrawn(amountAsWei.toString())]
                 }
                 else{      
                    const amountAsWei = utils.parseEther((amount).toString())
                    return [shareWithdrawn(amountAsWei.toString())]
                 }
            }
            // useEffect(() => {
            //   try{
            //     console.log('running')
            //     let contr = new ethers.Contract(farm.token1, erc20ABI, provider)
            //     contr.on("approve", (from, to, amount) => {
            //         console.log("transfer happened")
            //         console.log(JSON.stringify(to))
            //     })}
            //     catch {
            //       console.log('aaaa')
            //     }
            // })
           
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
              <TabContext value={SelectedTab}>
              <TabPanel value="1">
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
                <div className="text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                  Wallet Balance {farm.from}: {farm.from === "USDC" ? tB1 : '0.00'}<br></br>
                  Wallet Balance {farm.to}: {farm.to === "USDT" ? tB2 : farm.to === "FRAX" ? tB3 : farm.to === "MIMATIC" ? tB4 : '0.00'}
                </div>
                <div className="flex flex-col gap-3 text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                  <span>Your Position: {farm.to === "USDT" ? poolPos1 : farm.to === "FRAX" ? poolPos2 : farm.to === "MIMATIC" ? poolPos3 : '0.00'}</span>
                  <span>{farm.to === "USDT" ? v1P1 : farm.to === "FRAX" ? v2P1 : farm.to === "MIMATIC" ? v3P1  : '0.00'} {farm.from} + {farm.to === "USDT" ? v1P2 : farm.to === "FRAX" ? v2P2 : farm.to === "MIMATIC" ? v3P2 : '0.00'} {farm.to}</span>
                </div>
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
                <Button shape="rounded" fullWidth size="large">
                  DEPOSIT
                </Button>
                <Button onClick={switchTab2} shape="rounded" fullWidth size="large">
                  WITHDRAW
                </Button>
              </div>
              {farm.to === "USDT" ? approved ? (
                <Button shape="rounded" fullWidth size="large" onClick={handleDepositSubmit}>
                DEPOSIT
              </Button>
              )
               : (<Button shape="rounded" fullWidth size="large" onClick={handleApproveSubmit}>
                APPROVE
              </Button>) : farm.to === "FRAX" ? approved ? (
                <Button shape="rounded" fullWidth size="large" onClick={handleDepositSubmit}>
                DEPOSIT
              </Button>
              )
               : (<Button shape="rounded" fullWidth size="large" onClick={handleApproveSubmit}>
                APPROVE
              </Button>) : farm.to === "MIMATIC" ? approved? (
                <Button shape="rounded" fullWidth size="large" onClick={handleDepositSubmit}>
                DEPOSIT
              </Button>
              )
               : (<Button shape="rounded" fullWidth size="large" onClick={handleApproveSubmit}>
                APPROVE
              </Button>)  
              : 
              (<Button shape="rounded" fullWidth size="large" onClick={handleApproveSubmit}>
                APPROVE
              </Button>)}
              
              </TabPanel>
              <TabPanel value="2">
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
                  <div className="text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                    Shares Balance: {farm.to === 'USDT'? shareBalance1 : farm.to === 'FRAX' ? shareBalance2 : farm.to === 'MIMATIC' ? shareBalance3 : "0.00"}
                  </div>
                  <div className="flex flex-col gap-3 text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                    <span>Your Position: {farm.to === "USDT" ? poolPos1 : farm.to === "FRAX" ? poolPos2 : farm.to === "MIMATIC" ? poolPos3 : '0.00'}</span>
                    <span>{farm.to === "USDT" ? v1P1 : farm.to === "FRAX" ? v2P1 : farm.to === "MIMATIC" ? v3P1  : '0.00'} {farm.from} + {farm.to === "USDT" ? v1P2 : farm.to === "FRAX" ? v2P2 : farm.to === "MIMATIC" ? v3P2 : '0.00'} {farm.to}</span>
                  </div>
                  
                </div>
                <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6">
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
                  <div className="mb-4 grid grid-cols-2 gap-4 sm:mb-6 sm:gap-6">
                    <Button onClick={switchTab1} shape="rounded" fullWidth size="large">
                      DEPOSIT
                    </Button>
                  
                    <Button shape="rounded" fullWidth size="large">
                        WITHDRAW
                    </Button>
                    
                  </div>
                  <Button shape="rounded" fullWidth size="large" onClick={handleWithdrawSubmit}>
                    WITHDRAW
                  </Button>
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
