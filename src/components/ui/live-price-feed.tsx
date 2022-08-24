import { ArrowUp } from '@/components/icons/arrow-up';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import {useContext, useState, useEffect} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"
import { ethers } from "ethers"
import {vaultData} from '../../data/utils/vaultData'
import Web3Modal from 'web3modal';
type Price = {
  name: number;
  value: number;
};

type LivePriceFeedProps = {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactElement;
  balance: string;
  usdBalance: string;
  change: string;
  isChangePositive: boolean;
  prices: Price[];
};
const styles={
  container: {
    background: "white"
  }
}

export function LivePriceFeed({
  id,
  name,
  symbol,
  icon,
  balance,
  usdBalance,
  change,
  isChangePositive,
  prices,
}: LivePriceFeedProps) {
  const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
  const {address} = useContext(WalletContext);
  const [deposits, setDeposits] = useState<string>('--')
  const [earnings, setEarnings] = useState<string>('--')
  const [totalAPY, setTotalAPY] = useState<string>('--')
  const [monthlyAPY, setMonthlyAPY] = useState<string>('--')
  useEffect(() => {
    if (address){
      if (
        (window && window.web3 === undefined) ||
        (window && window.ethereum === undefined)
      ) {
        console.log('window not available; logged from live-price-feed')
      }
      else{
        userDashboard();
        }
    }
    
  }, [address, deposits, earnings, totalAPY, monthlyAPY, setDeposits, setEarnings, setTotalAPY, setMonthlyAPY]);

  async function userDashboard() {
    let distributedProvider = new ethers.providers.Web3Provider(window.ethereum);
    const {forROI, allEarnings, allPositions, fetchAPY} = vaultData(distributedProvider)
    const [b, roi] = await forROI(address)
    const [userYield1, userYield2, userYield3, e] = await allEarnings(address)
    const [pos1, pos2, pos3, p1, p2, p3, p4, p5, p6] = await allPositions(address)
    const [apy1, apy2, apy3, tA, mA] = await fetchAPY(address)
    let d = (pos1 + pos2 + pos3) - (e)
    setDeposits(('$').concat((d.toFixed(2)).toString()))
    setEarnings(('$').concat((e.toFixed(2)).toString()))
    setTotalAPY(((tA.toFixed(2)).toString()).concat('%'))
    setMonthlyAPY(((mA.toFixed(2)).toString()).concat('%'))
  } 
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-card dark:bg-light-dark lg:flex-row">
      <div className="w-full flex-col">
        <div className="mb-3 flex items-center">
          {/* {icon} */}
          <h4 className="text-sm font-medium text-gray-900 ltr:ml-3 rtl:mr-3 dark:text-white">
            {name}
          </h4>
        </div>

        <div className="mb-2 text-sm font-medium tracking-tighter text-gray-900 dark:text-white lg:text-lg 2xl:text-xl 3xl:text-2xl">
          <span className="ml-3"></span>
          {id === '0' ? deposits : id === '1' ? earnings : id === '2' ? totalAPY : id === '3' ? monthlyAPY : '--' }
        </div>        
      </div>
    </div>
  );
}

interface PriceFeedSliderProps {
  priceFeeds: LivePriceFeedProps[];
}

export default function PriceFeedSlider({ priceFeeds }: PriceFeedSliderProps) {
  return  (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-4">
      {priceFeeds.map((item) => (
        <LivePriceFeed key={item.id} {...item} />
      ))}
    </div>
  
  )
}
