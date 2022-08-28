import Button from '@/components/ui/button';
import { WalletContext } from '@/lib/hooks/use-connect';
import { useModal } from '@/components/modal-views/context';
import { useState, useContext, useEffect } from 'react';
import Listbox, { ListboxOption } from '@/components/ui/list-box';
import {ethers} from 'ethers'
import Web3Modal from 'web3modal';

const chains = [
  // {
  //   value: "mainnet",
  //   name: "Ethereum"
  // },
  // {
  //   value: "fantom",
  //   name: "Fantom"
  // },
  {
    value: "polygon",
    name: "Polygon"
    
  },
  // {
  //   value: "bsc",
  //   name: "BNB Chain"
  // },
  // {
  //   value: "avalanche",
  //   name: "Avalanche"
  // }
]

export default function WalletConnect() {
  const { openModal } = useModal();
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
  const [chain, setChain] = useState(chains[0]);
  const { address , network} = useContext(WalletContext);
  const [network2, setNetwork2] = useState<number>();

  const fetchNetwork = async () => {
    if (address) {
      try {
        if (
            (window && window.web3 === undefined) ||
            (window && window.ethereum === undefined)
          ) {
            return('window or window.web3 not available; logged from select-wallet while fetching network')
          }
        else{
          window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: '0x89',
              rpcUrls: ['https://polygon-rpc.com/'],
              chainName: 'Polygon Mainnet'
            }
          ]
        })
      }
        
      }
      catch{
        console.log('No wallet detected')
      }
    }
  }

  useEffect(() => {

    async function checkNetwork(){
      try{
        if (window && window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const {chainId} = await provider.getNetwork()
          setNetwork2(chainId)
        } else {
          console.log('no window; log from wallet-connect');
          }
        }
      catch{
        console.log('No wallet detected; log from wallet-connect')
      }
    }
    checkNetwork()
  }, []);
  return (
    <>
      {address ? (
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="relative">
            <Listbox
              className="w-full sm:w-55"
              options={chains}
              selectedOption={chain}
              onChange={fetchNetwork}
            />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-txngreen shadow-light sm:h-3 sm:w-3" />
          </div>

          {
          network == ['0x89'] || network2 === 137 ? (
            <Button className="bg-txngreen shadow-main hover:shadow-large">CONNECTED {address.slice(0, 5)}
            {'...'}
            {address.slice(address.length - 4)}
                </Button>
          ) 
           : 
            (<Button className="bg-txnError shadow-main hover:shadow-large">WRONG NETWORK {address.slice(0, 5)}
            {'...'}
            {address.slice(address.length - 4)}
                </Button>)
          }
            
          
        </div>
      ) : (
        <Button
          onClick={() => openModal('WALLET_CONNECT_VIEW')}
          className="bg-txngreen shadow-main hover:shadow-large"
        >
          CONNECT
        </Button>
      )}
    </>
  );
}
