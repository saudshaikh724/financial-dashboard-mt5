import {
  Card,
} from "antd";
import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function DashboardChart ({onDataChange, onNameChange, onTimeChange}) {
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [],
  });

  // Assuming onDataChange is already a formatted array or dataset
  useEffect(() => {
      const labels = onTimeChange.map((curr_time) => {
        return curr_time;
      });
      const data = onDataChange.map((curr) =>{
        return curr;
      })
        const dataSource = {
          labels,
          datasets: [
            {
              label: onNameChange,
              data:  data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
            
          ],
        };
  
        setRevenueData(dataSource);


  }, [onTimeChange, onDataChange, onNameChange]);

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          font: {
            size: 12,
            family: 'Arial',
          },
          color: '#333',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
          font: {
            size: 12,
            family: 'Arial',
          },
          color: '#333',
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  return (
    <Card style={{ width: 620, height: 350 }}> {/* Increased width and height */}
      <Line options={options} data={revenueData} />
    </Card>
  );

}

export default DashboardChart;
