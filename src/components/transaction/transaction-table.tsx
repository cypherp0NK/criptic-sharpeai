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


export default function TransactionTable() {
  const { poolPos1, poolPos2, poolPos3, poolApy1, poolApy2, poolApy3 } = useContext(WalletContext);

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
        <div className="ltr:text-right rtl:text-left">{value}</div>
      ),
      minWidth: 70,
      maxWidth: 70,
    },
    {
      Header: () => <div className="ltr:ml-auto rtl:mr-auto">VALUE</div>,
      accessor: 'createdAt',
      // @ts-ignore
      Cell: ({ cell: { value } }) => (
        <div className="ltr:text-right rtl:text-left">{value === "USDC-USDT" ? poolPos1 : value === "USDC-FRAX" ? poolPos2 : value === "USDC-MIMATIC" ? poolPos3 : '--'}</div>
      ),
      minWidth: 50,
      maxWidth: 50,
    },
    
    // {
    //   Header: () => <div className="ltr:ml-auto rtl:mr-auto">Asset</div>,
    //   accessor: 'symbol',
    //   // @ts-ignore
    //   Cell: ({ cell: { value } }) => (
    //     <div className="ltr:text-right rtl:text-left">{value}</div>
    //   ),
    //   minWidth: 80,
    //   maxWidth: 120,
    // },
    // {
    //   Header: () => <div className="ltr:ml-auto rtl:mr-auto">STATUS</div>,
    //   accessor: 'status',
    //   // @ts-ignore
    //   Cell: ({ cell: { value } }) => (
    //     <div className="ltr:text-right rtl:text-left">{value}</div>
    //   ),
    //   minWidth: 60,
    //   maxWidth: 80,
    // },
    {
      Header: () => <div className="ltr:ml-auto rtl:mr-auto">APY</div>,
      accessor: 'apy',
      // @ts-ignore
      Cell: ({ cell: { value } }) => (
        <div className="ltr:text-right rtl:text-left">{value === "USDC-USDT" ? poolApy1 : value === "USDC-FRAX" ? poolApy2 : value === "USDC-MIMATIC" ? poolApy3 : '--'}</div>
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
        <Scrollbar style={{ width: '100%' }}>
          <div className="px-0.5">
            <table
              {...getTableProps()}
              className="transaction-table w-full border-separate border-0"
            >
              <thead className="text-sm text-gray-500 dark:text-gray-300">
                {headerGroups.map((headerGroup, idx) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                    {headerGroup.headers.map((column, idx) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        key={idx}
                        className="group bg-white px-2 py-5 font-normal first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4"
                      >
                        <div className="flex items-center">
                          {column.render('Header')}
                          {column.canResize && (
                            <div
                              {...column.getResizerProps()}
                              className={`resizer ${
                                column.isResizing ? 'isResizing' : ''
                              }`}
                            />
                          )}
                          <span className="ltr:ml-1 rtl:mr-1">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDown />
                              ) : (
                                <ChevronDown className="rotate-180" />
                              )
                            ) : (
                              <ChevronDown className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm"
              >
                {page.map((row, idx) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={idx}
                      className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 dark:bg-light-dark"
                    >
                      {row.cells.map((cell, idx) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={idx}
                            className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8 3xl:py-5"
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Scrollbar>
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
