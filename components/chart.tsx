import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  ChartTypeRegistry,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  registerables as registerablesJS,
  Title,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const plugin = {
  id: "custom_canvas_background_color",
  beforeDraw: (chart: any) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

export const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];
const colors = [
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#3B3EAC",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
  "#994499",
  "#22AA99",
  "#AAAA11",
  "#6633CC",
  "#E67300",
  "#8B0707",
  "#329262",
  "#5574A6",
  "#3B3EAC",
];

export const datasets = [
  {
    label: "Dataset 1",
    data: labels.map(() => Math.random()),
  },
  {
    label: "Dataset 2",
    data: labels.map(() => Math.random()),
  },
];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => Math.random()),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => Math.random()),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export interface RasendeChartProps {
  charts: {
    type: keyof ChartTypeRegistry;
    title: string;
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string | string[];
      backgroundColor?: string | string[];
    }[];
  }[];
}

const makeOptions = (title: string): ChartOptions => {
  return {
    responsive: true,

    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
};

export const RasendeChart: React.FC<RasendeChartProps> = (props) => {
  props.charts.forEach((chart) => {
    if (chart.type === "doughnut" || chart.type === "pie") {
      chart.datasets[0].borderColor = [];
      chart.datasets[0].backgroundColor = [];
      chart.labels.forEach((label, i) => {
        if (Array.isArray(chart.datasets[0].borderColor)) {
          chart.datasets[0].borderColor.push(colors[i % colors.length]);
        }
        if (Array.isArray(chart.datasets[0].backgroundColor)) {
          chart.datasets[0].backgroundColor.push(colors[i % colors.length]);
        }
      });
    } else {
      chart.datasets.forEach((dataset, i) => {
        if (!dataset.borderColor && !dataset.backgroundColor) {
          dataset.borderColor = colors[i];
          dataset.backgroundColor = colors[i];
        }
      });
    }
  });
  return (
    <div className="flex flex-row flex-wrap">
      {props.charts.map((chart) => (
        <div key={chart.title} className="m-4">
          <Chart
            height={400}
            width={400}
            type={chart.type}
            plugins={[plugin]}
            options={{ ...makeOptions(chart.title) }}
            data={{
              labels: chart.labels,
              datasets: chart.datasets,
            }}
          />
        </div>
      ))}
    </div>
  );
};
