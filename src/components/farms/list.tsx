// @ts-nocheck
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencySwapIcons from '@/components/ui/currency-swap-icons';
import { CoinList } from '@/components/ui/currency-swap-icons';
import TransactionInfo from '@/components/ui/transaction-info';
import {WalletContext} from "@/lib/hooks/use-connect"
import { ethers, providers } from "ethers"
import {vaultData} from '@/data/utils/vaultData'
import Web3Modal from 'web3modal';
interface FarmListTypes {
  from: string;
  to: string;
  earned: string;
  apr: string;
  liquidity: string;
  multiplier: string;
}

export default function FarmList({
  from,
  to,
  earned,
  apr,
  liquidity,
  multiplier,
  children,
}: React.PropsWithChildren<FarmListTypes>) {
  const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
  const { address } = useContext(WalletContext);
  const [ UY1, setUY1 ] = useState<string>('--')
  const [ UY2, setUY2 ] = useState<string>('--')
  const [ UY3, setUY3] = useState<string>('--')
  const [vol1, setVol1] = useState<string>('--')
  const [vol2, setVol2] = useState<string>('--')
  const [vol3, setVol3] = useState<string>('--')
  const [tvl1, setTVL1] = useState<string>('--')
  const [tvl2, setTVL2] = useState<string>('--')
  const [tvl3, setTVL3] = useState<string>('--')
  useEffect(() => {
    if (address){
      if (
        (window && window.web3 === undefined) ||
        (window && window.ethereum === undefined)
      ) {
        console.log('window not available; logged from transaction-table')
      }
      else{
        let distributedProvider = new ethers.providers.Web3Provider(window.ethereum);
        poolList(distributedProvider);
        poolEarnedList(distributedProvider);
        }
    }
    else if (address === undefined){
      let privateProvider = new providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/2VsZl1VcrmWJ44CvrD9pt1HFieK6TQfZ')
      poolList(privateProvider)
    }
    
  }, [address, UY1, UY2, UY3, vol1, vol2, vol3, tvl1, tvl2, tvl3, setUY1,setUY2,setUY3,setVol1,setVol2,setVol3,setTVL1,setTVL2,setTVL3]);
  
  async function poolList(p: any) {
    const {fetchVolume, singleTVL} = vaultData(p)
    const [volume1, volume2, volume3, totalVolume] = await fetchVolume()
    const [t1, t2, t3, totalTVL] = await singleTVL()
    
    setVol1(('$').concat((volume1.toFixed(2)).toString()))
    setVol2(('$').concat((volume2.toFixed(2)).toString()))
    setVol3(('$').concat((volume3.toFixed(2)).toString()))
    setTVL1(('$').concat((t1.toFixed(2)).toString()))
    setTVL2(('$').concat((t2.toFixed(2)).toString()))
    setTVL3(('$').concat((t3.toFixed(2)).toString()))
  }
  async function poolEarnedList(p: any) {
    const {allEarnings} = vaultData(p)
    const [userYield1, userYield2, userYield3, e] = await allEarnings(address)
    setUY1((userYield1.toFixed(2)).toString())
    setUY2((userYield2.toFixed(2)).toString())
    setUY3((userYield3.toFixed(2)).toString())
  }

  let [isExpand, setIsExpand] = useState(false);
  const setFrom = from as CoinList;
  const setTo = to as CoinList;
  return (
    <div className="relative mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark">
      <div
        className="relative grid h-auto cursor-pointer grid-cols-2 items-center gap-3 py-4 sm:h-20 sm:grid-cols-3 sm:gap-6 sm:py-0 lg:grid-cols-5"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="col-span-2 px-4 sm:col-auto sm:px-8">
          <CurrencySwapIcons from={setFrom} to={setTo} />
        </div>
        <div className="px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            Earned
          </span>
          {to === 'USDT'? UY1 : to === 'FRAX' ? UY2 : to === 'MIMATIC' ? UY3 : "0.00"}
        </div>
        <div className="px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            APY
          </span>
          {to === 'USDT' ? '8.21%' : to === 'FRAX' ? '20.39%' : to === 'MIMATIC' ? '24.57%' : 0}
          <span className="hidden font-normal text-gray-600 dark:text-gray-400 sm:block">
            Annualized
          </span>
        </div>
        <div className="hidden px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm lg:block">
          {to === 'USDT'? vol1 : to === 'FRAX' ? vol2 : to === 'MIMATIC' ? vol3 : 0}
        </div>
        <div className="hidden px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm lg:block">
          {to === 'USDT'? tvl1 : to === 'FRAX' ? tvl2 : to === 'MIMATIC' ? tvl3 : 0}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isExpand && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="border-t border-dashed border-gray-200 px-4 pt-4 pb-0 dark:border-gray-700 sm:px-8 sm:pt-6 sm:pb-0">
              <div className="mb-2 flex items-center justify-center rounded-lg bg-gray-100 p-3 text-center text-xs font-medium uppercase tracking-wider text-gray-900 dark:bg-gray-900 dark:text-white sm:h-13 sm:text-sm">
                THIS VAULT AUTOMATICALLY MANAGES LIQUIDITY ON THE {from}/{to} POOL ON UNISWAP V3 PROVIDING CONCENTRATED LIQUIDITY TO EARN THE MAXIMUM YIELD.
              </div>
              <div className="mt-1 mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <TransactionInfo
                    label="Liquidity:"
                    value={to === 'USDT'? vol1 : to === 'FRAX' ? vol2 : to === 'MIMATIC' ? vol3 : 0}
                    className="text-xs sm:text-sm"
                  />
                  <TransactionInfo
                    label="TVL:"
                    value={to === 'USDT'? tvl1 : to === 'FRAX' ? tvl2 : to === 'MIMATIC' ? tvl3 : 0}
                    className="text-xs sm:text-sm"
                  />
                  
                </div>
              </div>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
