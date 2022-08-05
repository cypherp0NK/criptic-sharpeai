import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import CoinSlider from '@/components/ui/coin-card';
import OverviewChart from '@/components/ui/chats/overview-chart';
import LiquidityChart from '@/components/ui/chats/liquidity-chart';
import VolumeChart from '@/components/ui/chats/volume-chart';
import TopPools from '@/components/ui/top-pools';
import TransactionTable from '@/components/transaction/transaction-table';
import TopCurrencyTable from '@/components/top-currency/currency-table';
import { coinSlideData } from '@/data/static/coin-slide-data';
import Avatar from '@/components/ui/avatar';
import TopupButton from '@/components/ui/topup-button';
//images
import AuthorImage from '@/assets/images/author.jpg';

import PriceFeedSlider from '@/components/ui/live-price-feed';
import { priceFeedData } from '@/data/static/price-feed';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import WalletCard from '@/components/ui/wallet-card';
import { ExportIcon } from '@/components/icons/export-icon';
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"


export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const HomePage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { address } = useContext(WalletContext)
  return (
    <>
      <NextSeo
        title="Sharpe "
        description="Sharpe - Structured Investment Products, For the World."
      />
      <div className="flex flex-wrap">
        { address ? <div 
              className="mb-8 w-full"
        >
          {/* <CoinSlider coins={coinSlideData} /> */}
          <PriceFeedSlider priceFeeds={priceFeedData} />
        </div> :
        <div className="w-full flex flex-col items-center justify-center rounded-lg bg-white px-4 py-16 text-center shadow-card dark:bg-light-dark h-40 sm:h-6 xs:px-6 md:px-5 md:py-24">
            <div className="w-full mb-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white shadow-card md:h-24 md:w-24">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-auto w-8 md:w-10"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  d="M1,13 L6,2 L18,2 L23,13 L23,22 L1,22 L1,13 Z M1,13 L8,13 L8,16 L16,16 L16,13 L23,13"
                />
              </svg>
            </div>
            <h2 className="mb-1 text-sm font-large leading-relaxed dark:text-gray-100 md:text-xl xl:text-xl">
              There is no wallet connected at the moment
            </h2>
            <p className="leading-relaxed text-xs text-gray-600 dark:text-gray-400 md:text-sm xl:text-sm">
              To learn more, join our amazing community on{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.com/invite/tFAvMTw6Hx"
                className="inline-flex items-center gap-1 text-xs md:text-sm text-gray-900 underline transition-opacity duration-200 hover:no-underline hover:opacity-90 dark:text-gray-100"
              >
                Discord<ExportIcon className="h-auto w-3" />
              </a>
            </p>
          </div> }
        
      </div>

      <div className="mt-8 grid gap-6 sm:my-10 md:grid-cols-2">
        <LiquidityChart />
        <VolumeChart />
      </div>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-[calc(100%-288px)] ltr:lg:pr-6 rtl:lg:pl-6 2xl:w-[calc(100%-320px)] 3xl:w-[calc(100%-358px)]">
            <TransactionTable />
        </div>
        <div className="order-first mt-8 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 3xl:mt-0 mb-8 grid w-full grid-cols-1 gap-6 sm:mb-10 sm:grid-cols-2 lg:order-1 lg:mb-0 lg:flex lg:w-72 lg:flex-col 2xl:w-80 3xl:w-[358px]">
            <WalletCard/>
        </div>
      </div>
    </>
  );
};

HomePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default HomePage;
