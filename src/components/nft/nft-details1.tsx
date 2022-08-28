import cn from 'classnames';
import { StaticImageData } from 'next/image';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import Image from '@/components/ui/image';
import FeaturedCard from '@/components/nft/featured-card';
import ListCard from '@/components/ui/list-card';
import AuctionCountdown from '@/components/nft/auction-countdown';
import AnchorLink from '@/components/ui/links/anchor-link';
import Button from '@/components/ui/button';
import { ArrowLinkIcon } from '@/components/icons/arrow-link-icon';
import { DotsIcon } from '@/components/icons/dots-icon';
import { useModal } from '@/components/modal-views/context';
import { nftData } from '@/data/static/single-nft';
import NftDropDown from './nft-dropdown';
import Avatar from '@/components/ui/avatar';
import { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { poolChart1 } from '@/data/static/poolChart1';
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"
import { LiquidityData } from '@/data/static/liquidity';

function CustomAxis({ x, y, payload }: any) {
  const date = format(new Date(payload.value * 1000), 'd');
  return (
    <g
      transform={`translate(${x},${y})`}
      className="text-xs text-gray-500 md:text-sm"
    >
      <text x={0} y={0} dy={10} textAnchor="end" fill="currentColor">
        {date}
      </text>
    </g>
  );
}

const numberAbbr = (number: any) => {
  if (number < 1e3) return number;
  if (number >= 1e3 && number < 1e6) return +(number / 1e3).toFixed(1) + 'K';
  if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(1) + 'M';
  if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(1) + 'B';
  if (number >= 1e12) return +(number / 1e12).toFixed(1) + 'T';
};

export function TVLChart() {
  const {tvl1} = useContext(WalletContext);
  let [date, setDate] = useState(1624147200);
  let [liquidity, setLiquidity] = useState('547792029');
  const formattedDate = format(new Date(date * 1000), 'MMMM d, yyyy');
  const dailyLiquidity = numberAbbr(liquidity);

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
      <h3 className="mb-1.5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 sm:mb-2 sm:text-base">
        TOTAL VALUE LOCKED
      </h3>
      <div className="mb-1 text-base font-medium text-gray-900 dark:text-white sm:text-xl">
        {dailyLiquidity}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
        {formattedDate}
      </div>
      <div className="w-full mt-5 sm:mt-8 h-64 2xl:h-72 3xl:h-[340px] 4xl:h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart className='w-full'
            data={LiquidityData}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onMouseMove={(data) => {
              if (data.isTooltipActive) {
                setDate(
                  data.activePayload && data.activePayload[0].payload.date
                );
                setLiquidity(
                  data.activePayload &&
                    data.activePayload[0].payload.dailyVolumeUSD
                );
              }
            }}
          >
            <defs>
              <linearGradient
                id="liquidity-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#bc9aff" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#7645D9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={<CustomAxis />}
              interval={0}
              tickMargin={5}
            />
            <Tooltip content={<></>} cursor={{ stroke: '#7645D9' }} />
            <Area
              type="linear"
              dataKey="dailyVolumeUSD"
              stroke="#7645D9"
              strokeWidth={1.5}
              fill="url(#liquidity-gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export function UsdcCard() {
  return (
    <div className='w-full bg-txnLightMagenta rounded-lg'>
      <div className="w-full p-4">
        <div className='text-sm text-gray-600 dark:text-gray-400'>
          ASSET DETAILS
        </div>
        <h3 className='font-medium'>USDC</h3>
        <div className="flex flex-row gap-2">
          <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.circle.com/en/usdc"
          className="p-1 mt-1.5 inline-flex items-center text-xs -tracking-wider rounded-md tracking-tight bg-txnLightMagenta2">
          Website<ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
          </a>
          <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
          className='p-1 mt-1.5 inline-flex items-center text-xs -tracking-wider rounded-md tracking-tighter bg-txnLightMagenta2'>
          Token Contract<ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
          </a>
        </div>

      </div>
      <div className='w-full text-xs text-gray-600 dark:text-gray-400 bg-txnLightMagenta2 p-4 rounded-b-lg'>
          USDC is a fully collaterized US dollar stablecoin. USDC is issued by regulated financial institutions redeemable on a 1:1 basis for US dollars.
      </div>
    </div>
  )
}
export function UsdtCard() {
  return (
    <div className='w-full bg-txnLightMagenta rounded-lg'>
      <div className="w-full p-4">
        <div className='text-sm text-gray-600 dark:text-gray-400'>
          ASSET DETAILS
        </div>
        <h3 className='font-medium'>USDT</h3>
        <div className="flex flex-row gap-2">
          <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://tether.to/en/"
          className="p-1 mt-1.5 inline-flex items-center text-xs -tracking-wider rounded-md tracking-tight bg-txnLightMagenta2">
          Website<ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
          </a>
          <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
          className='p-1 mt-1.5 inline-flex items-center text-xs -tracking-wider rounded-md tracking-tighter bg-txnLightMagenta2'>
          Token Contract<ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
          </a>
        </div>

      </div>
      <div className='w-full text-xs text-gray-600 dark:text-gray-400 bg-txnLightMagenta2 p-4 rounded-b-lg'>
        Tether converts cash into digital currency, to anchor or tether the value to the price of national currencies like the US dollar, the Euro and the offshore chinese yuan.
      </div>
    </div>
  )
}
interface NftFooterProps {
  className?: string;
  currentBid: any;
  auctionTime: Date | string | number;
  isAuction?: boolean;
  price?: number;
}

function NftFooter({
  className = 'md:hidden',
  currentBid,
  auctionTime,
  isAuction,
  price,
}: NftFooterProps) {
  const { openModal } = useModal();
  const {LiquidityData} = poolChart1()
  
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 bg-body dark:bg-dark md:-mx-2',
        className
      )}
    >
      <div className="-mx-4 border-t-2 border-gray-900 px-4 pt-4 pb-5 dark:border-gray-700 sm:-mx-6 sm:px-6 md:mx-2 md:px-0 md:pt-5 lg:pt-6 lg:pb-7">
        {isAuction && (
          <div className="flex gap-4 pb-3.5 md:pb-4 xl:gap-5">
            <div className="block w-1/2 shrink-0 md:w-2/5">
              <h3 className="mb-1 truncate text-13px font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-1.5 sm:text-sm">
                Blockchain
                <AnchorLink
                  href=""
                  className="normal-case text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden"
                >
                  
                </AnchorLink>
              </h3>
              <AnchorLink href="https://polygonscan.com" className="inline-block">
                  <div className="rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Button className="rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >Polygon</Button>
                  </div>
              </AnchorLink>
            </div>
            <div className="block w-1/2 shrink-0 md:w-3/5">
              <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                  View Vault Performance
              </div>
              <div className="rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <AnchorLink href="https://dune.com/sharpeai/sharpe-vault" className="inline-block">
                  <div className="rounded-full p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Button className="rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >View</Button>
                  </div>
              </AnchorLink>
              </div>
            </div>
          </div>
        )}
        
          <AnchorLink href="https://polygonscan.com/address/0x2f1A893f4b42D49bE8C98AAF2EF61532A10Ec1Cf" className="inline-flex items-center -tracking-wider">
            <div className="text-sm leading-6 -tracking-wider text-white-600 dark:black-gray-400">
                Vault Address
            </div>
            <ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
          </AnchorLink><br></br>

          <AnchorLink href="https://polygonscan.com/address/0xb6F27E1e09B1a8440d72D548Fb6c23073ab9A101" className="inline-flex items-center -tracking-wider">
            <div className="text-sm leading-6 -tracking-wider text-white-600 dark:black-gray-400">
                Strategy Address
            </div>
            <ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
          </AnchorLink>
        
        <div className="mt-5 block w-1/2 shrink-0 md:w-3/5">
          <Button
            onClick={()=>{window.location.href = "../taurus"}}
            size="large"
            shape="rounded"
            fullWidth={true}
            className="w-36 bg-buttonMagenta"
          >
            Invest
          </Button>
            </div>
        
      </div>
    </div>
  );
}

type Avatar = {
  id: string | number;
  name: string;
  slug: string;
  logo: StaticImageData;
};
type NftDetailsProps = {
  isAuction?: boolean;
  image: StaticImageData;
  name: string;
  description: string;
  minted_date: string;
  minted_slug: string;
  price: number;
  amm: Avatar;
  collection: Avatar;
  owner: Avatar;
  block_chains: Avatar[];
};

export default function NftDetails({ product }: { product: NftDetailsProps }) {
  const {
    isAuction,
    image,
    name,
    description,
    minted_date,
    minted_slug,
    amm,
    price,
    collection,
    owner,
    block_chains,
  } = product;
  return (
    <div className="flex flex-grow">
      <div className="mx-auto flex w-full flex-grow flex-col transition-all xl:max-w-[1360px] 4xl:max-w-[1760px]">
        <div className="relative mb-5 flex flex-grow flex-col gap-2 items-center justify-center md:pb-7 md:pt-0 ltr:md:left-0 ltr:md:pl-6 rtl:md:right-0 rtl:md:pr-6 lg:fixed lg:mb-0 lg:h-[calc(100%-96px)] lg:w-[calc(100%-492px)] ltr:lg:pl-8 rtl:lg:pr-8 xl:w-[calc(100%-550px)] ltr:xl:pr-12 ltr:xl:pl-[340px] rtl:xl:pl-12 rtl:xl:pr-[340px] ltr:2xl:pl-96 rtl:2xl:pr-96 3xl:w-[calc(100%-632px)] ltr:4xl:pl-0 rtl:4xl:pr-0">
          <TVLChart />
          <div className='block lg:hidden xl:hidden 2xl:hidden xs:block sm:block md:block w-full gap-1 rounded-lg bg-white px-6 py-2 shadow-card dark:bg-light-dark sm:px-8 sm:py-2'>
            <UsdcCard/>
          </div>
          <div className='block lg:hidden xl:hidden 2xl:hidden xs:block sm:block md:block w-full gap-1 rounded-lg bg-white px-6 py-2 shadow-card dark:bg-light-dark sm:px-8 sm:py-2'>
            <UsdtCard/>
          </div>
        </div>

        <div className="relative flex w-full flex-grow flex-col justify-between ltr:md:ml-auto ltr:md:pl-8 rtl:md:mr-auto rtl:md:pr-8 lg:min-h-[calc(100vh-96px)] lg:w-[460px] ltr:lg:pl-12 rtl:lg:pr-12 xl:w-[592px] ltr:xl:pl-20 rtl:xl:pr-20">
          <div className="block">
            <div className="block">
              <div className="flex justify-between">
                <h2 className="text-xl font-medium leading-[1.45em] -tracking-wider text-gray-900 dark:text-white md:text-2xl xl:text-3xl">
                  {name}
                </h2>
              </div>
              <AnchorLink
                href="https://polygonscan.com/address/0x2f1A893f4b42D49bE8C98AAF2EF61532A10Ec1Cf"
                className="mt-1.5 inline-flex items-center text-sm -tracking-wider text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white xl:mt-2.5"
              >
                Started on June 27, 2022
                <ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
              </AnchorLink>
              
              <div className="mt-2 flex flex-wrap gap-6 pt-0.5 lg:-mx-6 lg:mt-2 lg:gap-0">
                <div className="shrink-0 lg:px-6 ">
                  
                  <AnchorLink href="https://uniswap.org" className="inline-flex">
                    <ListCard
                      item={amm}
                      className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    />
                  </AnchorLink>
                </div>
                <div className="shrink-0 lg:px-6">
                  
                  <AnchorLink href="#" className="inline-flex">
                    <ListCard
                      item={collection}
                      className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    />
                  </AnchorLink>
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-col pb-5 xl:mt-2">
              <ParamTab
                tabMenu={[
                  {
                    title: 'Details',
                    path: 'details',
                  },
                  {
                    title: 'Performance',
                    path: 'performance',
                  },
                  {
                    title: 'Fee Structure',
                    path: 'feeStructure',
                  },
                  {
                    title: 'Risk',
                    path: 'risk',
                  }
                ]}
              >
                <TabPanel className="focus:outline-none">
                  <div className="space-y-6">
                    <div className="block">
                      <h3 className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                      USDC-USDT vault automatically manages on uniswap V3. It concentrates its liquidity to earn higher yields and automatically adjusts its range orders as the underlying price moves in order to continue capturing fees.
                      </h3>
                      {/* className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400" */}
                    </div>
                    
                  </div>
                </TabPanel>
                <TabPanel className="focus:outline-none">
                  <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                  This strategy works best in both bull and bear markets, collecting premiums earned for supplying concentrated range orders on Uni v3 pools. 
                  Check out our vault’s performance on <a target="_blank" className="underline" href="https://dune.com/sharpeai/sharpe-vault">Dune</a>.<br></br><br></br>
                  
                  </div>
                </TabPanel>
                <TabPanel className="focus:outline-none">
                <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                      The vault fee structure includes a 0% annualised management fee and a 10% performance fee.
                      </div>
                </TabPanel>
                <TabPanel className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                  <div className="flex">
                  • Smart contract risk: The smart contracts are audit pending.<br></br>
                  • Stablecoin risk: This strategy could have an impermanent loss if the stablecoin loses its peg.
                  </div>
                </TabPanel>
                {/* <TabPanel className="focus:outline-none">
                  <div className="flex flex-col-reverse">
                    {nftData?.history?.map((item) => (
                      <FeaturedCard
                        item={item}
                        key={item?.id}
                        className="mb-3 first:mb-0"
                      />
                    ))}
                  </div>
                </TabPanel> */}
              </ParamTab>
            </div>
          </div>
          <NftFooter
            className="hidden md:block"
            currentBid={nftData?.bids[nftData?.bids?.length - 1]}
            auctionTime={Date.now() + 4000000 * 10}
            isAuction={isAuction}
            price={price}
          />
        </div>
        <NftFooter
          currentBid={nftData?.bids[nftData?.bids?.length - 1]}
          auctionTime={Date.now() + 4000000 * 10}
          isAuction={isAuction}
          price={price}
        />
      </div>
    </div>
  );
}
