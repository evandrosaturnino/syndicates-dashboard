import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  ScriptableContext,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from "./Card";
import Tooltip from "./Tooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

ChartJS.register({
  id: 'uniqueid',
  beforeDraw: function (chart: any, _easing: any) {
    if (chart?.tooltip?._active && chart?.tooltip?._active.length) {
      const ctx = chart.ctx;
      const activePoint = chart.tooltip._active[0];
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#535353';
      ctx.stroke();
      ctx.restore();
    }
  }
});

const PayoutChart = ({ data }: { data: any }) => {
  const [payoutData, setPayoutData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [activeData, setActiveData] = useState<number | string>('-');
  const [activeLabel, setActiveLabel] = useState<string>('-');

  useEffect(() => {
      if (!data) return
      setLoading(true);
      try {
        setPayoutData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
  }, [data]);

  const chartData = {
    labels: Object.keys(payoutData),
    datasets: [
      {
        data: Object.values(payoutData),
        pointRadius: 0,
        fill: 'start',
        borderColor: "#00ED76",
        pointBackgroundColor: "#00ED76",
        tension: 0.2,  
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 220);
          gradient.addColorStop(0, "rgba(0, 255, 71, 0.4)");
          gradient.addColorStop(1, "rgba(0, 237, 137, 0)");
          return gradient;
        },
      },
    ],
  };

  const options = {
    locale: 'en-US',
    borderWidth: 2,
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point:{
        radius: 0,
      },
    },
    scales: {
      y: {
        display: false,
        drawTicks: false,
        min: -2,
        ticks: {
          padding: 8
        },
      }, 
      x: {
        ticks: {
          padding: 12,
          autoSkip: true,
          maxTicksLimit: 20,
          font: {
            size: 11,
            weight: 'bold'
          }
        },
        grid: {
          display: false,
          drawBorder: false,
          drawTicks: false,
        },
      },
    },
    grid: {
      display: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false,
      },
      title: {
        display: false,
      }
    },
    onHover: (event: any) => {
      const chart = event.chart
      const activePoint = chart.tooltip._active[0];
      const setIndex = activePoint?.datasetIndex;
      const index = activePoint?.index;
      const activeData = chart.data?.datasets[setIndex] && 
      chart.data?.datasets[setIndex]?.data[index];
      const labelIndex = Object.keys(payoutData)[index];
      const activeLabel = labelIndex;
      setActiveData(activeData);
      setActiveLabel(activeLabel ?? '-')
    }
  };

  return (
    <Card className="w-full pb-5 pt-4 pl-2 pr-6 h-[27.5rem]">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-3 mx-8 pb-3 border-b border-grey2">
            <span>Validors Payout Chart</span>
            <Tooltip content="test" />
          </div>
          <span className="text-2xl pl-8 pt-4 h-12">{activeData}</span>
          <span className="text-grey3 pl-8 mb-5 h-6">{activeLabel}</span>
          <div className="relative w-full h-[17rem]">
            <Line options={{ ...options, interaction: { mode: 'index', intersect: false } }}  data={chartData} />
          </div>
        </div>
      )}
    </Card>
  )
};

export default PayoutChart;
