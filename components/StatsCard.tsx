import Tooltip from "./Tooltip";

type StatsCardProps = { 
  totalFeesAndMevPayout: string
  totalStakedValidators: number
  totalRageQuittedKnots: number
  formattedAverageComission: string
  totalPayoutLast30Days: string
  percentChange: string
};

function StatsCard({ 
  totalFeesAndMevPayout,
  totalStakedValidators,
  totalRageQuittedKnots,
  formattedAverageComission,
  totalPayoutLast30Days,
  percentChange
}: StatsCardProps) {
  return <div className="w-full bg-grey rounded-xl border border-green py-16 px-7">
    <div className="flex flex-col gap-4">
      <div className="border-b border-b-grey4 pb-3">
        <div className="flex items-center gap-3">
          <span>Network Stats</span>
          <Tooltip content="All the network stats related to the syndicates" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>Total Fees and MEV Payout</span>
          <Tooltip content="Produced fees and MEV payout tips generated." />
        </div>
        <span className="text-grey3">{totalFeesAndMevPayout}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>Validators Instances</span>
          <Tooltip content="Total Validator instances running simultaneously in all syndicates (Some validators might be running multiple instances)." />
        </div>
        <span className="text-grey3">{totalStakedValidators}</span>
      </div>
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
          <span>Rage Quitted Knots</span>
          <Tooltip content="Total Knots that have rage quitted the system." />
        </div>
        <span className="text-grey3">{totalRageQuittedKnots}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>Avg. Commission</span>
          <Tooltip content="Total commission average in the system, this number has been generated by the total of the commissions divided by the amount of syndicates" />
        </div>
        <span className="text-grey3">{formattedAverageComission}</span>
      </div>
      <div className="border-b border-b-grey4 pb-3 mt-6">
        <span>Payout Historically (1m)</span>
      </div>
      <div className="flex items-center gap-3 items-center">
        <span>{totalPayoutLast30Days}</span>
        <span className="text-grey3">({percentChange}%)</span>
      </div>
    </div>
  </div>
}

export default StatsCard;
