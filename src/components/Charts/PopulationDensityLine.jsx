import { useState, useMemo } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const btnStyle = (active) => ({
  padding: '5px 14px',
  borderRadius: '6px',
  border: '1.5px solid',
  borderColor: active ? '#3b82f6' : '#334155',
  background: active ? '#3b82f6' : 'transparent',
  color: '#f1f5f9',
  fontSize: '0.82rem',
  fontWeight: active ? 700 : 400,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap'
});

const PopulationDensityLine = ({ countries, regionColors }) => {
  const [selectedRegion, setSelectedRegion] = useState('all');

  const validCountries = useMemo(() =>
    countries.filter(c => c.area > 1 && c.population > 0 && parseFloat(c.populationDensity) > 0),
    [countries]
  );

  const regions = useMemo(() =>
    ['all', ...[...new Set(validCountries.map(c => c.region))].sort()],
    [validCountries]
  );

  const filteredCountries = useMemo(() =>
    selectedRegion === 'all'
      ? validCountries
      : validCountries.filter(c => c.region === selectedRegion),
    [validCountries, selectedRegion]
  );

  // Ascending sort: low density → high density (left to right)
  const sorted = useMemo(() => {
    const s = [...filteredCountries].sort(
      (a, b) => parseFloat(a.populationDensity) - parseFloat(b.populationDensity)
    );
    return selectedRegion === 'all' ? s.slice(-50) : s;
  }, [filteredCountries, selectedRegion]);

  const lineColor = selectedRegion === 'all'
    ? 'rgba(59, 130, 246, 1)'
    : (regionColors?.[selectedRegion]?.border ?? 'rgba(59, 130, 246, 1)');

  const fillColor = selectedRegion === 'all'
    ? 'rgba(59, 130, 246, 0.12)'
    : (regionColors?.[selectedRegion]?.bg?.replace('0.6', '0.12') ?? 'rgba(59, 130, 246, 0.12)');

  const data = {
    labels: sorted.map(c => c.name),
    datasets: [{
      label: 'Population Density (people/km²)',
      data: sorted.map(c => parseFloat(c.populationDensity)),
      borderColor: lineColor,
      backgroundColor: fillColor,
      borderWidth: 2,
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 7,
      pointBackgroundColor: lineColor,
      pointBorderColor: '#1e293b',
      pointBorderWidth: 1.5
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#f1f5f9', font: { size: 12 }, usePointStyle: true }
      },
      tooltip: {
        callbacks: {
          title: (items) => sorted[items[0].dataIndex]?.name ?? '',
          label: (ctx) => {
            const c = sorted[ctx.dataIndex];
            return [
              `Density: ${ctx.parsed.y.toFixed(2)} people/km²`,
              `Population: ${c.population.toLocaleString()}`,
              `Area: ${c.area.toLocaleString()} km²`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: selectedRegion === 'all'
            ? 'Countries (top 50 by density, low → high)'
            : `${selectedRegion} countries (low → high density)`,
          color: '#f1f5f9',
          font: { size: 13, weight: 'bold' }
        },
        ticks: { display: false },
        grid: { display: false }
      },
      y: {
        type: 'linear',
        title: { display: false },
        ticks: {
          color: '#94a3b8',
          callback: (v) => v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    },
    interaction: { intersect: false, mode: 'index' }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {regions.map(r => (
          <button key={r} onClick={() => setSelectedRegion(r)} style={btnStyle(selectedRegion === r)}>
            {r === 'all' ? 'All regions' : r}
          </button>
        ))}
      </div>

      <div style={{ color: '#475569', fontSize: '0.75rem', marginBottom: '8px' }}>
        Showing {sorted.length} countries
        {selectedRegion === 'all' ? ' (top 50 globally by density)' : ` in ${selectedRegion}`}
      </div>

      <div style={{ height: '420px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PopulationDensityLine;
