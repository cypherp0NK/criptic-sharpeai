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
import Avatar1 from '@/assets/images/avatar/3.png';
import { useModal } from '@/components/modal-views/context';
import { nftData } from '@/data/static/single-nft';
import NftDropDown from './nft-dropdown';
import Avatar from '@/components/ui/avatar';
import LiquidityChart from '@/components/ui/chats/liquidity-chart';

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
                Blockchain <span className="md:hidden">Blockchain</span>{' '}
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
              <AnchorLink href="" className="inline-block">
                  <div className="rounded-full p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Button className="rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >View</Button>
                  </div>
              </AnchorLink>
              </div>
            </div>
          </div>
        )}
        
          <AnchorLink href="https://polygonscan.com/address/0x9db685d9E4f2e5A7fAEC5760F2946C32c8422b91" className="inline-flex items-center -tracking-wider">
            <div className="text-sm leading-6 -tracking-wider text-white-600 dark:black-gray-400">
                Vault Address
            </div>
            <ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
          </AnchorLink><br></br>

          <AnchorLink href="https://polygonscan.com/address/0x2a97AB4a6b195a986bF19a6c333Df10f25436c35" className="inline-flex items-center -tracking-wider">
            <div className="text-sm leading-6 -tracking-wider text-white-600 dark:black-gray-400">
                Strategy Address
            </div>
            <ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
          </AnchorLink>
        
        <div className="mt-5 block w-1/2 shrink-0 md:w-3/5">
              <h3 className="mb-1 truncate text-13px font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-1.5 sm:text-sm">
                  Next rebalance in
              </h3>
              <AuctionCountdown date={auctionTime} />
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
  creator: Avatar;
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
    price,
    creator,
    collection,
    owner,
    block_chains,
  } = product;
  return (
    <div className="flex flex-grow">
      <div className="mx-auto flex w-full flex-grow flex-col transition-all xl:max-w-[1360px] 4xl:max-w-[1760px]">
        <div className="relative mb-5 flex flex-grow items-center justify-center md:pb-7 md:pt-4 ltr:md:left-0 ltr:md:pl-6 rtl:md:right-0 rtl:md:pr-6 lg:fixed lg:mb-0 lg:h-[calc(100%-96px)] lg:w-[calc(100%-492px)] ltr:lg:pl-8 rtl:lg:pr-8 xl:w-[calc(100%-550px)] ltr:xl:pr-12 ltr:xl:pl-[340px] rtl:xl:pl-12 rtl:xl:pr-[340px] ltr:2xl:pl-96 rtl:2xl:pr-96 3xl:w-[calc(100%-632px)] ltr:4xl:pl-0 rtl:4xl:pr-0">
        <LiquidityChart />
        </div>

        <div className="relative flex w-full flex-grow flex-col justify-between ltr:md:ml-auto ltr:md:pl-8 rtl:md:mr-auto rtl:md:pr-8 lg:min-h-[calc(100vh-96px)] lg:w-[460px] ltr:lg:pl-12 rtl:lg:pr-12 xl:w-[592px] ltr:xl:pl-20 rtl:xl:pr-20">
          <div className="block">
            <div className="block">
              <div className="flex justify-between">
                <h2 className="text-xl font-medium leading-[1.45em] -tracking-wider text-gray-900 dark:text-white md:text-2xl xl:text-3xl">
                  USDC-MIMATIC POOL
                </h2>
              </div>
              <AnchorLink
                href="https://polygonscan.com/address/0x9db685d9E4f2e5A7fAEC5760F2946C32c8422b91"
                className="mt-1.5 inline-flex items-center text-sm -tracking-wider text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white xl:mt-2.5"
              >
                Started on June 27, 2022
                <ArrowLinkIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
              </AnchorLink>
              
              <div className="mt-2 flex flex-wrap gap-6 pt-0.5 lg:-mx-6 lg:mt-2 lg:gap-0">
                <div className="shrink-0 lg:px-6 ">
                  
                  <AnchorLink href="https://uniswap.org" className="inline-flex">
                    <ListCard
                      item={creator}
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
                  }
                ]}
              >
                <TabPanel className="focus:outline-none">
                  <div className="space-y-6">
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                      USDC-MIMATIC VAULT AUTOMATICALLY MANAGES LIQUIDITY ON UNISWAP V3. IT CONCENTRATES ITS LIQUIDITY TO EARN HIGHER YIELDS AND AUTOMATICALLY ADJUSTS ITS RANGE ORDERS AS THE UNDERLYING PRICE MOVES IN ORDER TO CONTINUE CAPTURING FEES.
                      </h3>
                      {/* className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400" */}
                      <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                        Performance:<br></br>
                        This strategy works best in both bull and bear markets, collecting premiums earned for supplying concentrated range orders on Uni v3 pools. 
                        Check out our vault’s performance on Dune.<br></br><br></br>
                        Risk:<br></br>
                        • Smart contract risk: The smart contracts are audit pending.<br></br>
                        • Stablecoin risk: This strategy could have an impermanent loss if the stablecoin loses its peg.
                      </div>
                    </div>
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                        Fee structure
                      </h3>
                      <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                      The vault fee structure includes a 0% annualised management fee and a 10% performance fee.
                      </div>
                    </div>
                    {/* <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                        Block Chain
                      </h3>
                      <div className="flex flex-col gap-2">
                        {block_chains?.map((item: any) => (
                          <AnchorLink
                            href="#"
                            className="inline-flex"
                            key={item?.id}
                          >
                            <ListCard
                              item={item}
                              className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            />
                          </AnchorLink>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </TabPanel>
                <TabPanel className="focus:outline-none">
                  <div className="flex flex-col-reverse">
                    {nftData?.bids?.map((bid) => (
                      <FeaturedCard
                        item={bid}
                        key={bid?.id}
                        className="mb-3 first:mb-0"
                      />
                    ))}
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
