import { Decimal } from "./Decimal";

export interface ISyndicate {
  ticker: string
  numberOfStakedValidators: string
  lsdIndex: string
  wallet: string
  totalPayout: string
  etherscanUrl: string
}


export function processPayoutData({ syndicates }: any) {
  const dailyPayouts: { [key: string]: Decimal } = {};

  for (const syndicate of syndicates) {
    for (const payout of syndicate.payouts) {
      const date = new Date(Number(payout.timestamp) * 1000);
      const formattedDate = date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
      const payoutEth = Decimal.from(payout.amount).div(Decimal.from("1000000000000000000"));
      dailyPayouts[formattedDate] = (dailyPayouts[formattedDate] || Decimal.from(0)).add(payoutEth);
    };
  };

  const dailyPayoutsArray = Object.entries(dailyPayouts).map(([date, payout]) => ({ date, payout }));

  dailyPayoutsArray.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const dailyPayoutsFormatted: { [key: string]: number } = {};
  dailyPayoutsArray.forEach(({ date, payout }) => {
    dailyPayoutsFormatted[date] = parseFloat(payout.prettify(4));
  });

  return dailyPayoutsFormatted;
}

export function processTotalPayout({ syndicates }: any) {
  const payouts: Decimal[] = [];
  const nodeOperatorsPayouts: Decimal[] = [];
  const feesAndMevPayouts: Decimal[] = [];

  for (const { totalPayout, totalNodeOperatorPayout, totalFeesAndMevPayout } of syndicates) {
    const payoutEth = Decimal.from(totalPayout).div(Decimal.from("1000000000000000000"));
    const nodeOperatorPayoutEth = Decimal.from(totalNodeOperatorPayout).div(Decimal.from("1000000000000000000"));
    const feesAndMevPayoutEth = Decimal.from(totalFeesAndMevPayout).div(Decimal.from("1000000000000000000"));

    payouts.push(payoutEth);
    nodeOperatorsPayouts.push(nodeOperatorPayoutEth);
    feesAndMevPayouts.push(feesAndMevPayoutEth);
  };

  const totalPayoutInDecimal = payouts.reduce((acc, payout) => acc.add(payout), Decimal.from(0));
  const totalPayout = totalPayoutInDecimal.prettify(2)

  const totalNodeOperatorsPayoutInDecimal = nodeOperatorsPayouts.reduce((acc, payout) => acc.add(payout), Decimal.from(0));
  const totalNodeOperatorsPayout = totalNodeOperatorsPayoutInDecimal.prettify(2)

  const totalFeesAndMevPayoutInDecimal = feesAndMevPayouts.reduce((acc, payout) => acc.add(payout), Decimal.from(0));
  const totalFeesAndMevPayout = totalFeesAndMevPayoutInDecimal.prettify(2)

  return { totalPayout, totalNodeOperatorsPayout, totalFeesAndMevPayout };
}

export function processTotalNumbers({ syndicates }: any) {
  const listOfStakedValidators: number[] = [];
  const listOfTotalRageQuittedKnots: number[] = [];

  for (const { liquidStakingNetwork: { numberOfStakedValidators, numberOfKnotsThatHaveRageQuitted } } of syndicates) {
    listOfStakedValidators.push(parseFloat(numberOfStakedValidators));
    listOfTotalRageQuittedKnots.push(parseFloat(numberOfKnotsThatHaveRageQuitted));
  };

  const totalStakedValidators = listOfStakedValidators.reduce((acc, stakedValidator) => acc + stakedValidator, 0);
  const totalRageQuittedKnots = listOfTotalRageQuittedKnots.reduce((acc, rageQuittedKnots) => acc + rageQuittedKnots, 0);

  return { totalStakedValidators, totalRageQuittedKnots };
}

export function processComissionAverage({ syndicates }: any): { formattedAverageComission: string } {
  const listOfCommissions: number[] = [];

  for (const { liquidStakingNetwork: { commission } } of syndicates) {
    listOfCommissions.push(parseFloat(commission));
  };

  const totalCommission = listOfCommissions.reduce((acc, commission) => acc + commission, 0);
  const averageCommission = totalCommission / syndicates.length
  const formattedAverageComission = averageCommission.toFixed(2)

  return { formattedAverageComission };
}

export function processPayoutStats({ syndicates }: any) {
  const now = Date.now();
  const oneDayMilliseconds = 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - (30 * oneDayMilliseconds);
  const sixtyDaysAgo = now - (60 * oneDayMilliseconds);

  let totalPayoutLast30Days = 0;
  let totalPayoutPrevious30Days = 0;

  for (const syndicate of syndicates) {
    for (const payout of syndicate.payouts) {
      const payoutTimestamp = Number(payout.timestamp) * 1000;
      const payoutEth = parseFloat(payout.amount) / 10**18;  // Convert Wei to Ether

      if (payoutTimestamp >= thirtyDaysAgo) {
        totalPayoutLast30Days += payoutEth;
      } else if (payoutTimestamp >= sixtyDaysAgo && payoutTimestamp < thirtyDaysAgo) {
        totalPayoutPrevious30Days += payoutEth;
      }
    }
  }
  const percentChange = totalPayoutPrevious30Days === 0
    ? 0
    : ((totalPayoutLast30Days - totalPayoutPrevious30Days) / totalPayoutPrevious30Days) * 100;

  return {
    totalPayoutLast30Days: totalPayoutLast30Days.toFixed(2),
    percentChange: percentChange.toFixed(2),
  };
}

export function processSyndicates({ syndicates }: any): ISyndicate[] {
  const syndicatesSelectedData: ISyndicate[] = []

  for (const syndicate of syndicates) {
    const { liquidStakingNetwork: { 
      ticker, 
      numberOfStakedValidators,
      lsdIndex,
      id  
    }, 
    totalPayout } = syndicate

    const PayoutEth = parseFloat(totalPayout) / 10**18;

    syndicatesSelectedData.push({ 
      ticker, 
      numberOfStakedValidators, 
      lsdIndex, 
      wallet: `${id.slice(0, 6)}...${id.slice(-4)}`, 
      totalPayout: PayoutEth.toFixed(4), 
      etherscanUrl: `https://etherscan.io/address/${id}` 
    })
  }
  return syndicatesSelectedData;
}
