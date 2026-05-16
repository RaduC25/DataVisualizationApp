import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BAR_COLORS = [
  ['rgba(255, 99, 132, 0.7)',  'rgba(255, 99, 132, 1)'],
  ['rgba(54, 162, 235, 0.7)',  'rgba(54, 162, 235, 1)'],
  ['rgba(255, 206, 86, 0.7)',  'rgba(255, 206, 86, 1)'],
  ['rgba(75, 192, 192, 0.7)',  'rgba(75, 192, 192, 1)'],
  ['rgba(153, 102, 255, 0.7)', 'rgba(153, 102, 255, 1)'],
  ['rgba(255, 159, 64, 0.7)',  'rgba(255, 159, 64, 1)'],
  ['rgba(199, 199, 199, 0.7)', 'rgba(199, 199, 199, 1)'],
  ['rgba(83, 102, 255, 0.7)',  'rgba(83, 102, 255, 1)'],
  ['rgba(255, 99, 255, 0.7)',  'rgba(255, 99, 255, 1)'],
  ['rgba(99, 255, 132, 0.7)',  'rgba(99, 255, 132, 1)'],
];

const PopulationBarChart = ({ countries }) => {
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = useMemo(() => {
    return ['all', ...[...new Set(countries.map(c => c.region))].sort()];
  }, [countries]);

  const top10 = useMemo(() => {
    const pool = selectedRegion === 'all'
      ? countries
      : countries.filter(c => c.region === selectedRegion);
    return [...pool].sort((a, b) => b.population - a.population).slice(0, 10);
  }, [countries, selectedRegion]);

  const data = {
    labels: top10.map(c => c.name),
    datasets: [{
      label: 'Population',
      data: top10.map(c => c.population),
      backgroundColor: top10.map((_, i) => BAR_COLORS[i % BAR_COLORS.length][0]),
      borderColor: top10.map((_, i) => BAR_COLORS[i % BAR_COLORS.length][1]),
      borderWidth: 2,
      borderRadius: 4,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Population: ${context.parsed.y.toLocaleString()}`,
          afterLabel: (context) => `Region: ${top10[context.dataIndex].region}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', maxRotation: 30, minRotation: 0 },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          callback: (value) => {
            if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
            if (value >= 1e6) return (value / 1e6).toFixed(0) + 'M';
            return value.toLocaleString();
          }
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    }
  };

  return (
    <div>
      {/* Region filter buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {regions.map(region => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            style={{
              padding: '5px 14px',
              borderRadius: '6px',
              border: '1.5px solid',
              borderColor: selectedRegion === region ? '#3b82f6' : '#334155',
              background: selectedRegion === region ? '#3b82f6' : 'transparent',
              color: '#f1f5f9',
              fontSize: '0.82rem',
              fontWeight: selectedRegion === region ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {region === 'all' ? 'All' : region}
          </button>
        ))}
      </div>

      <div style={{ height: '370px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PopulationBarChart;
