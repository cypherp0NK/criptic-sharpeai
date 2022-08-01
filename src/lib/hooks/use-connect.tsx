import { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import {vaultData} from '../../data/utils/vaultData'
import { setPriority } from 'os';
import { IncomingMessage } from 'http';

const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';

export const WalletContext = createContext<any>({});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deposits, setDeposits] = useState<string>('0')
  const [earnings, setEarnings] = useState<string>('0')
  const [roi, setRoi] = useState<string>('0%')
  const [vE1, setVE1] = useState<string>('0')
  const [vE2, setVE2] = useState<string>('0')
  const [vE3, setVE3] = useState<string>('0')
  const [vol1, setVol1] = useState<string>('0')
  const [vol2, setVol2] = useState<string>('0')
  const [vol3, setVol3] = useState<string>('0')
  const [totalVol, setTotalVol] = useState<string>('0')
  const [tvl1, setTVL1] = useState<string>('0')
  const [tvl2, setTVL2] = useState<string>('0')
  const [tvl3, setTVL3] = useState<string>('0')
  const [totalTvl, setTotalTVL] = useState<string>('0')
  const [ UY1, setUY1 ] = useState<string>('0')
  const [ UY2, setUY2 ] = useState<string>('0')
  const [ UY3, setUY3] = useState<string>('0')
  const [poolPos1, setPoolPos1] = useState<string>('0')
  const [poolPos2, setPoolPos2] = useState<string>('0')
  const [poolPos3, setPoolPos3] = useState<string>('0')
  const [poolApy1, setPoolApy1] = useState<string>('0%')
  const [poolApy2, setPoolApy2] = useState<string>('0%')
  const [poolApy3, setPoolApy3] = useState<string>('0%')
  const [totalPoolApy, setTotalPoolApy] = useState<string>('0%')
  const [monthlyApy, setMonthlyApy] = useState<string>('0%')

  const [shareBalance1, setShareBalance1] = useState<string>('0.00')
  const [shareBalance2, setShareBalance2] = useState<string>('0.00')
  const [shareBalance3, setShareBalance3] = useState<string>('0.00')
  const [tB1, setTB1] = useState<string>('0.00')
  const [tB2, setTB2] = useState<string>('0.00')
  const [tB3, setTB3] = useState<string>('0.00')
  const [tB4, setTB4] = useState<string>('0.00')

  const [v1P1, setV1P1] = useState<string>('0.00')
  const [v1P2, setV1P2] = useState<string>('0.00')

  const [v2P1, setV2P1] = useState<string>('0.00')
  const [v2P2, setV2P2] = useState<string>('0.00')

  const [v3P1, setV3P1] = useState<string>('0')
  const [v3P2, setV3P2] = useState<string>('0')





  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });

  
  /* This effect will fetch wallet address if user has already connected his/her wallet */
  useEffect(() => {
    async function checkConnection() {
      try {
        
        const {income, fetchVolume, singleTVL} = vaultData('a','a','a')
        const [fee1, fee2, fee3, fee4, fee5, fee6 ] = await income()
        const [volume1, volume2, volume3, totalVolume] = await fetchVolume()
        const [t1, t2, t3, totalTVL] = await singleTVL()
        
        setVE1(((fee1 + fee2).toFixed(2)).toString())
        setVE2(((fee3 + fee4).toFixed(2)).toString())
        setVE3(((fee5 + fee6).toFixed(2)).toString())
        setVol1(('$').concat((volume1.toFixed(2)).toString()))
        setVol2(('$').concat((volume2.toFixed(2)).toString()))
        setVol3(('$').concat((volume3.toFixed(2)).toString()))
        setTotalVol(('$').concat((totalVolume.toFixed(2)).toString()))
        setTVL1(('$').concat((t1.toFixed(2)).toString()))
        setTVL2(('$').concat((t2.toFixed(2)).toString()))
        setTVL3(('$').concat((t3.toFixed(2)).toString()))
        setTotalTVL(('$').concat((totalTVL.toFixed(2)).toString()))
        if (window && window.ethereum) {
          // Check if web3modal wallet connection is available on storage
          if (localStorage.getItem(web3modalStorageKey)) {
            await connectToWallet();
          }
        } else {
          console.log('window or window.ethereum is not available');
        }
      } catch (error) {
        const {income, fetchVolume, singleTVL} = vaultData('a','a','a')
        const [fee1, fee2, fee3, fee4, fee5, fee6 ] = await income()
        const [volume1, volume2, volume3, totalVolume] = await fetchVolume()
        const [t1, t2, t3, totalTVL] = await singleTVL()
        
        setVE1(((fee1 + fee2).toFixed(2)).toString())
        setVE2(((fee3 + fee4).toFixed(2)).toString())
        setVE3(((fee5 + fee6).toFixed(2)).toString())
        setVol1(('$').concat((volume1.toFixed(2)).toString()))
        setVol2(('$').concat((volume2.toFixed(2)).toString()))
        setVol3(('$').concat((volume3.toFixed(2)).toString()))
        setTotalVol(('$').concat((totalVolume.toFixed(2)).toString()))
        setTVL1(('$').concat((t1.toFixed(2)).toString()))
        setTVL2(('$').concat((t2.toFixed(2)).toString()))
        setTVL3(('$').concat((t3.toFixed(2)).toString()))
        setTotalTVL(('$').concat((totalTVL.toFixed(2)).toString()))
        console.log(error, 'Catch error Account is not connected');
      }
    }
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setWalletAddress = async (provider: any) => {
    try {

      const signer = provider.getSigner();

      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        getBalance(provider, web3Address);
        const {allBalances, allEarnings, allPositions, fetchAPY, singleBalances, fetchTokenBalances} = vaultData('a','a','a')
        const [b, roi] = await allBalances(web3Address)
        const [userYield1, userYield2, userYield3, e] = await allEarnings(web3Address)
        const [pos1, pos2, pos3, p1, p2, p3, p4, p5, p6] = await allPositions(web3Address)
        const [apy1, apy2, apy3, totalAPY, monthlyAPY] = await fetchAPY(web3Address)
        const [sBal1, sBal2, sBal3] = await singleBalances(web3Address)
        const [tBal1, tBal2, tBal3, tBal4] = await fetchTokenBalances(web3Address)
        setDeposits(('$').concat((b.toFixed(2)).toString()))
        setEarnings(('$').concat((e.toFixed(2)).toString()))
        setRoi(((roi.toFixed(2)).toString()).concat('%'))
        setUY1((userYield1.toFixed(2)).toString())
        setUY2((userYield2.toFixed(2)).toString())
        setUY3((userYield3.toFixed(2)).toString())
        setPoolPos1((pos1.toFixed(2)).toString())
        setPoolPos2((pos2.toFixed(2)).toString())
        setPoolPos3((pos3.toFixed(2)).toString())
        setPoolApy1(((apy1.toFixed(2)).toString()).concat('%'))
        setPoolApy2(((apy2.toFixed(2)).toString()).concat('%'))
        setPoolApy3(((apy3.toFixed(2)).toString()).concat('%'))
        setTotalPoolApy(((totalAPY.toFixed(2)).toString()).concat('%'))
        setMonthlyApy(((monthlyAPY.toFixed(2)).toString()).concat('%'))

        setTB1((tBal1.toFixed(2)).toString())
        setTB2((tBal2.toFixed(2)).toString())
        setTB3((tBal3.toFixed(2)).toString())
        setTB4((tBal4.toFixed(2)).toString())
        setShareBalance1((sBal1.toFixed(2)).toString())
        setShareBalance2((sBal2.toFixed(2)).toString())
        setShareBalance3((sBal3.toFixed(2)).toString())
        setV1P1((p1.toFixed(2)).toString())
        setV1P2((p2.toFixed(2)).toString())
        setV2P1((p3.toFixed(2)).toString())
        setV2P2((p4.toFixed(2)).toString())
        setV3P1((p5.toFixed(2)).toString())
        setV3P2((p6.toFixed(2)).toString())
      }
    } catch (error) {
      console.log(
        'Account not connected; logged from setWalletAddress function'
      );
    }
  };

  const getBalance = async (provider: any, walletAddress: string) => {
    const walletBalance = await provider.getBalance(walletAddress);
    const balanceInEth = ethers.utils.formatEther(walletBalance);
    setBalance(balanceInEth);
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    web3Modal && web3Modal.clearCachedProvider();
  };

  const checkIfExtensionIsAvailable = () => {
    if (
      (window && window.web3 === undefined) ||
      (window && window.ethereum === undefined)
    ) {
      setError(true);
      web3Modal && web3Modal.toggleModal();
    }
  };

  const connectToWallet = async () => {
    try {
      setLoading(true);
      checkIfExtensionIsAvailable();
      const connection = web3Modal && (await web3Modal.connect());
      const provider = new ethers.providers.Web3Provider(connection);
      await subscribeProvider(connection);

      setWalletAddress(provider);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(
        error,
        'got this error on connectToWallet catch block while connecting the wallet'
      );
    }
  };

  const subscribeProvider = async (connection: any) => {
    connection.on('close', () => {
      disconnectWallet();
    });
    connection.on('accountsChanged', async (accounts: string[]) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(connection);
        getBalance(provider, accounts[0]);
      } else {
        disconnectWallet();
      }
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        loading,
        error,
        deposits,
        earnings,
        roi,
        monthlyApy,
        vE1,
        vE2,
        vE3,
        vol1,
        vol2,
        vol3,
        totalVol,
        tvl1,
        tvl2,
        tvl3,
        totalTvl,
        UY1,
        UY2,
        UY3,
        poolPos1,
        poolPos2,
        poolPos3,
        poolApy1,
        poolApy2,
        poolApy3,
        totalPoolApy,
        shareBalance1,
        shareBalance2,
        shareBalance3,
        v1P1,
        v1P2,
        v2P1,
        v2P2,
        v3P1,
        v3P2,
        tB1,
        tB2,
        tB3,
        tB4,
        connectToWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
