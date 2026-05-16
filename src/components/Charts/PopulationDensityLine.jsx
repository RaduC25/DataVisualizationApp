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

  // Filter out countries with zero or very small area
  const validCountries = useMemo(() =>
    countries.filter(c => c.area > 1 && c.population > 0),
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

  // Sort by density, take top 50 for global or all for a region
  const sortedByDensity = useMemo(() => {
    const sorted = [...filteredCountries].sort(
      (a, b) => parseFloat(b.populationDensity) - parseFloat(a.populationDensity)
    );
    return selectedRegion === 'all' ? sorted.slice(0, 50) : sorted;
  }, [filteredCountries, selectedRegion]);

  // Pick the line color from regionColors prop if a region is selected
  const lineColor = selectedRegion === 'all'
    ? 'rgba(59, 130, 246, 1)'
    : (regionColors?.[selectedRegion]?.border ?? 'rgba(59, 130, 246, 1)');

  const fillColor = selectedRegion === 'all'
    ? 'rgba(59, 130, 246, 0.15)'
    : (regionColors?.[selectedRegion]?.bg?.replace('0.6', '0.15') ?? 'rgba(59, 130, 246, 0.15)');

  const xAxisLabel = selectedRegion === 'all'
    ? 'Countries (Top 50 by Density)'
    : `${selectedRegion} Countries (sorted by density)`;

  const data = {
    labels: sortedByDensity.map(c => c.name),
    datasets: [
      {
        label: 'Population Density (people per km²)',
        data: sortedByDensity.map(c => parseFloat(c.populationDensity)),
        borderColor: lineColor,
        backgroundColor: fillColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: lineColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#f1f5f9', font: { size: 12 } }
      },
      title: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => sortedByDensity[items[0].dataIndex]?.name ?? '',
          label: (context) => {
            const country = sortedByDensity[context.dataIndex];
            return [
              `Density: ${context.parsed.y.toFixed(2)} people/km²`,
              `Population: ${country.population.toLocaleString()}`,
              `Area: ${country.area.toLocaleString()} km²`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: xAxisLabel,
          font: { size: 13, weight: 'bold' },
          color: '#f1f5f9'
        },
        ticks: { display: false, color: '#94a3b8' },
        grid: { display: false }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Population Density (people per km²)',
          font: { size: 13, weight: 'bold' },
          color: '#f1f5f9'
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value.toFixed(0)
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    },
    interaction: { intersect: false, mode: 'index' }
  };

  return (
    <div>
      {/* Region filter buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {regions.map(r => (
          <button
            key={r}
            onClick={() => setSelectedRegion(r)}
            style={btnStyle(selectedRegion === r)}
          >
            {r === 'all' ? 'All regions' : r}
          </button>
        ))}
      </div>

      {/* Country count info */}
      <div style={{ color: '#475569', fontSize: '0.75rem', marginBottom: '8px' }}>
        Showing {sortedByDensity.length} countries
        {selectedRegion === 'all' ? ' (top 50 globally by density)' : ` in ${selectedRegion} sorted by density`}
      </div>

      <div style={{ height: '420px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PopulationDensityLine;
