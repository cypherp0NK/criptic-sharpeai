// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencySwapIcons from '@/components/ui/currency-swap-icons';
import { CoinList } from '@/components/ui/currency-swap-icons';
import TransactionInfo from '@/components/ui/transaction-info';
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"

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
  const { UY1, UY2, UY3, vol1, vol2, vol3, tvl1, tvl2, tvl3} = useContext(WalletContext);

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
            <div className="border-t border-dashed border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-8 sm:py-6">
              <div className="mb-6 flex items-center justify-center rounded-lg bg-gray-100 p-3 text-center text-xs font-medium uppercase tracking-wider text-gray-900 dark:bg-gray-900 dark:text-white sm:h-13 sm:text-sm">
                THIS VAULT AUTOMATICALLY MANAGES LIQUIDITY ON THE {from}/{to} POOL ON UNISWAP V3 PROVIDING CONCENTRATED LIQUIDITY TO EARN THE MAXIMUM YIELD.
              </div>
              <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
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
