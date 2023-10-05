import { 
  processTotalPayout, 
  processPayoutData, 
  processTotalNumbers, 
  processComissionAverage, 
  processPayoutStats, 
  processSyndicates,
  ISyndicate
} from '../utils/processData';
import MyChart from '../components/Chart';
import { GetStaticProps } from 'next';
import { fetchSyndicateData } from './api/syndicateData';
import { useConnectWallet } from '@web3-onboard/react';
import { WalletState } from "@web3-onboard/core";
import { shortenAddress } from '@/utils/shortenAddress';
import Card from '@/components/Card';
import TopDashboardCard from '@/components/TopDashboardCard';
import Image from 'next/image';
import StatsCard from '@/components/StatsCard';
import Link from 'next/link';

type HomeProps = { 
  syndicates: any
  dailyPayouts: number
  totalPayout: string
  totalNodeOperatorsPayout: string
  totalFeesAndMevPayout: string
  totalStakedValidators: number
  totalRageQuittedKnots: number
  formattedAverageComission: string
  totalPayoutLast30Days: string
  percentChange: string,
  syndicatesSelectedData: ISyndicate[]
};

function Home({ 
  syndicates, 
  dailyPayouts, 
  totalPayout, 
  totalNodeOperatorsPayout,
  totalFeesAndMevPayout,
  totalStakedValidators, 
  totalRageQuittedKnots,
  formattedAverageComission,
  totalPayoutLast30Days,
  percentChange,
  syndicatesSelectedData
}: HomeProps) {
  const [{ wallet }, connect, disconnect] = useConnectWallet();

  const disconnectWallet = (wallet: WalletState) => {
    localStorage.removeItem('walletLabel')
    disconnect(wallet)
  }

  return (
    <div className="flex flex-wrap w-full justify-center text-white text-ssm">
      <div className="flex bg-grey w-full h-[6rem] justify-center items-center">
        <div className="flex w-[1180px] items-center justify-between px-4 lg:px-0">
          <div className="relative w-48 h-16">
            <Image
              src="/icons/logo.svg"
              alt="blockswap"
              fill={true}
              sizes="(min-width: 1rem) 24vw"
              loading="lazy"
            />
          </div>
          <div className="border border-grey2 rounded-xl cursor-pointer py-2 px-5 text-xs">
            {wallet?.accounts[0] 
              ? <div
                className="flex items-center gap-3"  
                onClick={() => disconnectWallet(wallet)}
              >
                <div className="relative w-[1rem] h-[0.9rem]">
                  <Image
                    src="/icons/metamask.png"
                    alt="blockswap"
                    fill={true}
                    sizes="(min-width: 1rem) 24vw"
                    loading="lazy"
                  />
                </div>
                <span>{wallet?.accounts[0].address ?  shortenAddress(wallet?.accounts[0].address) : 'Connect Wallet'}</span>
            </div> 
              : <div 
                className="flex items-center gap-3" 
                onClick={() => connect()}
              >
                <div className="relative w-[1rem] h-[0.9rem]">
                  <Image
                    src="/icons/metamask.png"
                    alt="blockswap"
                    fill={true}
                    sizes="(min-width: 1rem) 24vw"
                    loading="lazy"
                  />
                </div>
                <span>Connect Wallet</span>
              </div>
            }
          </div>
        </div>
      </div>
      <div className="flex w-[1180px] px-4 lg:px-0">
        <div className="flex flex-col gap-6 w-full mt-10">
          <h1>
            Syndicates Dashboard
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopDashboardCard 
              title="Total Syndicates"
              imageUrl="/icons/total-syndicates.svg"
              imageAlt="tooltip"
              data={syndicates.length}
              tooltipInfo="dada"
            />
            <TopDashboardCard 
              title="Total Payout"
              imageUrl="/icons/total-payout.svg"
              imageAlt="tooltip"
              data={totalPayout}
              tooltipInfo="dada"
            />
            <TopDashboardCard 
              title="Node Operators Payout"
              imageUrl="/icons/node-operators.svg"
              imageAlt="tooltip"
              data={totalNodeOperatorsPayout}
              tooltipInfo="dada"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCard
              totalFeesAndMevPayout={totalFeesAndMevPayout}
              totalStakedValidators={totalStakedValidators} 
              totalRageQuittedKnots={totalRageQuittedKnots} 
              formattedAverageComission={formattedAverageComission} 
              totalPayoutLast30Days={totalPayoutLast30Days}
              percentChange={percentChange} 
            />
            <div className="w-full lg:col-span-2 bg-gray-900">
              <MyChart data={dailyPayouts} />
            </div>
          </div>
          <h1 className="mt-2">
            Syndicates
          </h1>
          <Card className="mb-20">
            <div className="grid grid-cols-11 border-b border-b-grey2 pl-12 py-4">
              <span className="col-span-2">Ticker</span>
              <span className="col-span-2">Staking Validators</span>
              <span className="col-span-2">Total Payout</span>
              <span className="col-span-2">LSD Index</span>
              <span className="col-span-2">Address</span>
              <span></span>
            </div>
            {syndicatesSelectedData.map(({
                ticker,
                numberOfStakedValidators,
                lsdIndex,
                wallet,
                totalPayout,
                etherscanUrl
            }) => 
                <div key={lsdIndex} className="grid grid-cols-11 pl-12 py-4 text-grey3 font-medium">
                  <span className="col-span-2">{ticker}</span>
                  <span className="col-span-2">{numberOfStakedValidators}</span>
                  <span className="col-span-2">{totalPayout}</span>
                  <span className="col-span-2">{lsdIndex}</span>
                  <span className="col-span-2">{wallet}</span>
                  <Link href={etherscanUrl} target="_blank">
                    <div className="relative w-4 h-4">
                      <Image
                        src="/icons/external-link.svg"
                        alt="external-link"
                        fill={true}
                        sizes="(min-width: 1rem) 24vw"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                </div>
              )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await fetchSyndicateData();
  const dailyPayouts = processPayoutData(data);
  const { totalPayout, totalNodeOperatorsPayout, totalFeesAndMevPayout  } = processTotalPayout(data)
  const { totalStakedValidators, totalRageQuittedKnots } = processTotalNumbers(data)
  const { formattedAverageComission } = processComissionAverage(data)
  const { totalPayoutLast30Days, percentChange } = processPayoutStats(data)
  const syndicatesSelectedData = processSyndicates(data)
  
  return {
    props: { 
      ...data, 
      dailyPayouts, 
      totalPayout, 
      totalNodeOperatorsPayout,
      totalFeesAndMevPayout, 
      totalStakedValidators, 
      totalRageQuittedKnots,
      formattedAverageComission,
      totalPayoutLast30Days,
      percentChange,
      syndicatesSelectedData
    },
    revalidate: 60,
  };
};
