import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useSortBy,
  usePagination,
} from 'react-table';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import { ChevronDown } from '@/components/icons/chevron-down';
import { LongArrowRight } from '@/components/icons/long-arrow-right';
import { LongArrowLeft } from '@/components/icons/long-arrow-left';
import { LinkIcon } from '@/components/icons/link-icon';
import { TransactionData } from '@/data/static/transaction-data';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import {useContext} from "react"
import {WalletContext} from "@/lib/hooks/use-connect"
import AnchorLink from '@/components/ui/links/anchor-link';
import { ethers } from "ethers"
import {vaultData} from '@/data/utils/vaultData'
import Web3Modal from 'web3modal';


export default function TransactionTable() {
  const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
  const {address} = useContext(WalletContext);
  const [poolPos1, setPoolPos1] = useState<string>('--')
  const [poolPos2, setPoolPos2] = useState<string>('--')
  const [poolPos3, setPoolPos3] = useState<string>('--')
  const [poolApy1, setPoolApy1] = useState<string>('--')
  const [poolApy2, setPoolApy2] = useState<string>('--')
  const [poolApy3, setPoolApy3] = useState<string>('--')

  useEffect(() => {
    try{
      if (address){
        if (
          (window && window.web3 === undefined) ||
          (window && window.ethereum === undefined)
        ) {
          console.log('window not available; logged from transaction-table')
        }
        else{
          userPositions();
          }
    }}catch{
      console.log('error logged from transaction-table;')
    }
    
  }, [address, poolPos1, poolPos2, poolPos3, poolApy1, poolApy2, poolApy3, setPoolPos1, setPoolPos2, setPoolPos3, setPoolApy1, setPoolApy2, setPoolApy3]);
  async function userPositions() {
    let distributedProvider = new ethers.providers.Web3Provider(window.ethereum);
    const {allPositions, fetchAPY} = vaultData(distributedProvider)
    const [pos1, pos2, pos3, p1, p2, p3, p4, p5, p6] = await allPositions(address)
    const [apy1, apy2, apy3, tA, mA] = await fetchAPY(address)
    setPoolPos1((pos1.toFixed(2)).toString())
    setPoolPos2((pos2.toFixed(2)).toString())
    setPoolPos3((pos3.toFixed(2)).toString())
    setPoolApy1(((apy1.toFixed(2)).toString()).concat('%'))
    setPoolApy2(((apy2.toFixed(2)).toString()).concat('%'))
    setPoolApy3(((apy3.toFixed(2)).toString()).concat('%'))
    
  }

  const COLUMNS = [
    {
      Header: '#',
      accessor: 'id',
      minWidth: 20,
      maxWidth: 20,
    },
    {
      Header: () => <div className="ltr:ml-auto rtl:mr-auto">POOL</div>,
      accessor: 'transactionType',
      // @ts-ignore
      Cell: ({ cell: { value } }) => (
        'a'
      ),
      minWidth: 70,
      maxWidth: 70,
    },
    {
      Header: () => <div className="ltr:ml-auto rtl:mr-auto">VALUE</div>,
      accessor: 'createdAt',
      // @ts-ignore
      Cell: ({ cell: { value } }) => (
        address ? <div className="ltr:text-right rtl:text-left">{value === "USDC-USDT" ? poolPos1 : value === "USDC-FRAX" ? poolPos2 : value === "USDC-MIMATIC" ? poolPos3 : '0'}</div> : <div className="ltr:text-right rtl:text-left">--</div>
      ),
      minWidth: 50,
      maxWidth: 50,
    },
    
    {
      Header: () => <div className="ltr:ml-auto rtl:mr-auto">APY</div>,
      accessor: 'apy',
      // @ts-ignore
      Cell: ({ cell: { value } }) => (
        address ? <div className="ltr:text-right rtl:text-left">{value === "USDC-USDT" ? poolApy1 : value === "USDC-FRAX" ? poolApy2 : value === "USDC-MIMATIC" ? poolApy3 : '0'}</div> : <div className="ltr:text-right rtl:text-left">--</div>
      ),
      minWidth: 60,
      maxWidth: 60,
    },
    {
      Header: () => <div className="ltr:ml-auto rtl:mr-auto">ACTIONS</div>,
      accessor: 'actionable',
      // @ts-ignore
      Cell: ({ cell: { value } }) => (
        <div className="ltr:text-right rtl:text-left">{value === "USDC-USDT" ? <a href="/usdc-usdt"><b>VIEW</b></a> : value === "USDC-FRAX" ? <a href="/usdc-frax"><b>VIEW</b></a> : value === "USDC-MIMATIC" ? <a href="/usdc-mimatic"><b>VIEW</b></a> : <b>VIEW</b>}</div>
        // <div className="flex items-center justify-end">
        //   <LinkIcon className="h-[18px] w-[18px] ltr:mr-2 rtl:ml-2" /> {value}
        // </div>
      ),
      minWidth: 75,
      maxWidth: 90,
    },
  ];
  const data = React.useMemo(() => TransactionData, []);
  const columns = React.useMemo(() => COLUMNS, []);

  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      data,
      initialState: { pageSize: 3 },
    },
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination
  );

  const { pageIndex } = state;

  return (
    <div className="">
      <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
        <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
          <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
            YOUR POSITIONS
          </h2>
        </div>
      </div>
      <div className="-mx-0.5">
        {poolPos1 !== '--' ? 
          <div className="px-0.5">
            <table
              
              className="w-full border-collapse border-0"
            >
              <thead className="rounded-lg bg-white uppercase shadow-card dark:bg-light-dark text-sm lg:text-base text-gray-500 dark:text-gray-300">
                <th className='py-4 !important'>#</th>
                <th>POOL</th>
                <th>VALUE</th>
                <th>APY</th>
                <th>ACTIONS</th>
              </thead>
              <tbody
                
                className="rounded-lg bg-white uppercase shadow-card dark:bg-light-dark text-xs lg:text-sm text-center font-medium text-gray-900 dark:text-white 3xl:text-base"
              >
                
                <tr>
      <td className='py-3.5 !important'>0</td>
      <td>USDC-USDT</td>
      <td>{poolPos1}</td>
      <td>{poolApy1}</td>
      <td><a href="/usdc-usdt"><b>VIEW</b></a></td>
    </tr>
    <tr>
      <td className='py-3.5 !important' >1</td>
      <td>USDC-FRAX</td>
      <td>{poolPos2}</td>
      <td>{poolApy2}</td>
      <td><a href="/usdc-frax"><b>VIEW</b></a></td>
    </tr>
    <tr>
    <td className='py-3.5 !important'>2</td>
      <td>USDC-MIMATIC</td>
      <td>{poolPos3}</td>
      <td>{poolApy3}</td>
      <td><a href="/usdc-mimatic"><b>VIEW</b></a></td>
    </tr>
                
              </tbody>
            </table>
          </div>
         : <div></div>}
      </div>
      <div className="mt-3 flex items-center justify-center rounded-lg bg-white px-5 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6">
        <div className="flex items-center gap-5">
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            title="Previous"
            shape="circle"
            variant="transparent"
            size="small"
            className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
          >
            <LongArrowLeft className="h-auto w-4 rtl:rotate-180" />
          </Button>
          <div>
            Page{' '}
            <strong className="font-semibold">
              {/* {pageIndex + 1} of {pageOptions.length} */}
              1 of 1
            </strong>{' '}
          </div>
          <Button
            onClick={() => {/*nextPage()*/}}
            disabled={!canNextPage}
            title="Next"
            shape="circle"
            variant="transparent"
            size="small"
            className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
          >
            <LongArrowRight className="h-auto w-4 rtl:rotate-180 " />
          </Button>
        </div>
      </div>
    </div>
  );
}
