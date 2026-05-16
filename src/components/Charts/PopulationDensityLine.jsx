import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PopulationDensityLine = ({ countries }) => {
  // Filter out countries with zero or very small area to avoid extreme density values
  const validCountries = countries.filter(
    country => country.area > 1 && country.population > 0
  );

  // Sort by population density and take top 50 for better visualization
  const sortedByDensity = [...validCountries]
    .sort((a, b) => parseFloat(b.populationDensity) - parseFloat(a.populationDensity))
    .slice(0, 50);

  const data = {
    labels: sortedByDensity.map(country => country.name),
    datasets: [
      {
        label: 'Population Density (people per km²)',
        data: sortedByDensity.map(country => parseFloat(country.populationDensity)),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#f1f5f9',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Density: ${context.parsed.y.toFixed(2)} people/km²`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Countries (Top 50 by Density)',
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#f1f5f9'
        },
        ticks: {
          display: false,
          color: '#94a3b8'
        },
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Population Density (people per km²)',
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#f1f5f9'
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => {
            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
            return value.toFixed(0);
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div style={{ height: '450px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PopulationDensityLine;
