import { ArrowUp } from '@/components/icons/arrow-up';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"

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
  const { address, deposits, earnings, totalPoolApy, monthlyApy, poolPos1, poolPos2, poolPos3, poolApy1, poolApy2, poolApy3 } = useContext(WalletContext);
  
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
          {id === '0' ? deposits : id === '1' ? earnings : id === '2' ? totalPoolApy : id === '3' ? monthlyApy : '--' }
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
