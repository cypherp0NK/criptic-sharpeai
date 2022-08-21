import Button from '@/components/ui/button';
import { WalletContext } from '@/lib/hooks/use-connect';
import { Menu } from '@/components/ui/menu';
import { Transition } from '@/components/ui/transition';
import ActiveLink from '@/components/ui/links/active-link';
import { ChevronForward } from '@/components/icons/chevron-forward';
import { PowerIcon } from '@/components/icons/power';
import { useModal } from '@/components/modal-views/context';
import { useState, useContext, useEffect } from 'react';
import Listbox, { ListboxOption } from '@/components/ui/list-box';
import { useEthers } from "@usedapp/core"
import {ethers} from 'ethers'

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
  const [chain, setChain] = useState(chains[0]);
  const [network, setNetwork] = useState<number>();
  const { address, disconnectWallet, balance } = useContext(WalletContext);

  const fetchNetwork = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const {chainId} = await provider.getNetwork()
    setNetwork(chainId)
  }

  useEffect(() => {
    try {
      if (chain.value === "polygon"){
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: '0x89',
              rpcUrls: ['https://polygon-rpc.com/'],
              chainName: 'Polygon Mainnet'
            }
          ]
        });
        setNetwork(137)
      }
      else if (chain.value === "bsc"){
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: '0x38',
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
              chainName: 'BSC Mainnet'
            }
          ]
        });
        setNetwork(56)
      }
      else if (chain.value === "mainnet"){
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: '0x1',
              
            }
          ]
        });
        setNetwork(1)
      }
      else if (chain.value === "fantom"){
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: '0xFA',
              rpcUrls: ['https://rpc.ftm.tools'],
              chainName: 'Fantom Opera'
            }
          ]
        });
        setNetwork(250)
      }
      else if (chain.value === "avalanche"){
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: '0xA86A',
              rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
              chainName: 'Avalanche C-Chain'
            }
          ]
        });
        setNetwork(43113)
      }
      
    }
    catch {
      console.log('No wallet detected')
    }
  }, [chain]);
  return (
    <>
      {address ? (
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="relative">
            <Listbox
              className="w-full sm:w-55"
              options={chains}
              selectedOption={chain}
              onChange={setChain}
            />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-txngreen shadow-light sm:h-3 sm:w-3" />
          </div>

          {network === 137 ? (
            <Button className="bg-txngreen shadow-main hover:shadow-large">CONNECTED {address.slice(0, 5)}
            {'...'}
            {address.slice(address.length - 4)}
                </Button>
          ) : 
          <Button className="bg-txnError shadow-main hover:shadow-large">WRONG NETWORK {address.slice(0, 5)}
            {'...'}
            {address.slice(address.length - 4)}
                </Button>
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
