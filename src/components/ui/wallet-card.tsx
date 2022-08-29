import cn from 'classnames';
import {useContext, useEffect, useState} from "react"
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUp } from '@/components/icons/arrow-up';
import { LongArrowUp } from '@/components/icons/long-arrow-up';
import { walletCurrencies } from '@/data/static/wallet-currencies';
import {WalletContext} from "@/lib/hooks/use-connect"

const data = [
  {
    name: 'Bitcoin',
    value: 400,
    volume: '12.5%',
    isChangePositive: true,
  },
  {
    name: 'Tether',
    value: 300,
    volume: '8.47%',
    isChangePositive: true,
  },
  {
    name: 'Cardano',
    value: 300,
    volume: '5.63%',
    isChangePositive: true,
  },
  {
    name: 'Binance Coin',
    value: 15,
    volume: '3.02%',
    isChangePositive: true,
  },
];

export default function WalletCard() {
  const [isChangePositive, setChangeStatus] = useState(true);
  const [percentage, setPercentage] = useState(data[0].volume);
  return (
    <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
      <h3 className="mb-6 text-base font-medium uppercase">ALLOCATION</h3>

      <div className="relative flex h-[290px] justify-center">
        <ResponsiveContainer width={290} height="100%">
          <PieChart width={290} height={290}>
            <Pie
              data={data}
              cx={140}
              cy={140}
              innerRadius={98}
              outerRadius={135}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              onMouseMove={(data) => {
                setChangeStatus(
                  data.payload.payload && data.payload.payload.isChangePositive
                );
                setPercentage(
                  data.payload.payload && data.payload.payload.volume
                );
              }}
            >
              {walletCurrencies.map((currency) => (
                <Cell
                  key={`cell-${currency.code}`}
                  fill={currency.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<></>} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute left-2/4 top-2/4 flex h-[156px] w-[156px] -translate-x-2/4 -translate-y-2/4 transform items-center justify-center rounded-full border border-dashed border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-gray-900">
          <span
            className={cn(
              'flex items-center text-base font-medium',
              isChangePositive ? 'text-green-500' : 'text-green-500'
            )}
          >
            {/* {percentage} */}
            --
          </span>
        </div>
      </div>

      
    </div>
  );
}
