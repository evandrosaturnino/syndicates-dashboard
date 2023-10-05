import Image from "next/image";
import Card from "./Card";
import Tooltip from "./Tooltip";

type TopDashboardCardProps = {
  title: string
  imageUrl: string
  imageAlt: string
  data: string | number
  tooltipInfo: string
};

function TopDashboardCard({ 
  title,
  imageUrl,
  imageAlt,
  data,
  tooltipInfo,
}: TopDashboardCardProps) {
  return <Card className="w-full py-9 px-10">
  <div className="flex items-center justify-between">
    <div className="relative w-16 h-16">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill={true}
        sizes="(min-width: 1rem) 24vw"
        loading="lazy"
      />
    </div>
    <div className="flex flex-col justify-between gap-3">
      <div className="flex items-center gap-3">
        <span>{title}</span>
        <Tooltip content={tooltipInfo} />
      </div>
      <span className="text-3xl font-medium self-end pr-6 text-green">
        {data}
      </span>
    </div>
  </div>
</Card>
}

export default TopDashboardCard;
