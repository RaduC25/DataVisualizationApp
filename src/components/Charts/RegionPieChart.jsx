import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Colors are now passed as a prop from App.jsx

const MODES = [
  { key: 'countries', label: 'Number of countries' },
  { key: 'population', label: 'Population' },
  { key: 'area', label: 'Area' }
];

const formatValue = (mode, value) => {
  if (mode === 'countries') return `${value}`;
  if (mode === 'population') {
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(0) + 'K';
    return value.toString();
  }
  if (mode === 'area') {
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M km²';
    if (value >= 1e3) return (value / 1e3).toFixed(0) + 'K km²';
    return value + ' km²';
  }
  return value;
};

const RegionPieChart = ({ countries, regionColors }) => {
  const [mode, setMode] = useState('countries');

  // Aggregate by region for each mode
  const regionData = {};
  countries.forEach(country => {
    const r = country.region || 'Unknown';
    if (!regionData[r]) regionData[r] = { countries: 0, population: 0, area: 0 };
    regionData[r].countries += 1;
    regionData[r].population += country.population || 0;
    regionData[r].area += country.area || 0;
  });

  const sorted = Object.entries(regionData).sort(([, a], [, b]) => b[mode] - a[mode]);
  const labels = sorted.map(([region]) => region);
  const values = sorted.map(([, v]) => v[mode]);
  const total = values.reduce((a, b) => a + b, 0);

  const bgColors = labels.map(label => (regionColors[label] || regionColors['Unknown']).bg.replace('0.6', '0.8'));
  const borderColors = labels.map(label => (regionColors[label] || regionColors['Unknown']).border);

  const data = {
    labels,
    datasets: [{
      label: mode,
      data: values,
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 16,
          font: { size: 12 },
          color: '#f1f5f9',
          boxWidth: 14,
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            const vals = dataset.data;
            const tot = vals.reduce((a, b) => a + b, 0);
            return chart.data.labels.map((label, i) => {
              const colorObj = regionColors[label] || regionColors['Unknown'];
              return {
                text: `${label}  ${formatValue(mode, vals[i])}  (${((vals[i] / tot) * 100).toFixed(1)}%)`,
                fillStyle: colorObj.bg.replace('0.6', '0.8'),
                strokeStyle: colorObj.border,
                lineWidth: 2,
                fontColor: '#f1f5f9',
                hidden: false,
                index: i
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const pct = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatValue(mode, value)} (${pct}%)`;
          }
        }
      }
    }
  };

  return (
    <div>
      {/* Mode toggle buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {MODES.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1.5px solid',
              borderColor: mode === m.key ? '#3b82f6' : '#334155',
              background: mode === m.key ? '#3b82f6' : 'transparent',
              color: '#f1f5f9',
              fontSize: '0.85rem',
              fontWeight: mode === m.key ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ height: '380px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default RegionPieChart;
