import { useState, useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

// regionColors now passed as prop from App

const fmt = (v) => {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
  return v;
};

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

const PopulationAreaScatter = ({ countries, regionColors }) => {
  const [zoom, setZoom] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('all');

  const validCountries = countries.filter(c => c.area > 0 && c.population > 0);

  const regions = useMemo(() => {
    return ['all', ...[...new Set(validCountries.map(c => c.region))].sort()];
  }, [validCountries]);

  const filteredCountries = useMemo(() => {
    return selectedRegion === 'all'
      ? validCountries
      : validCountries.filter(c => c.region === selectedRegion);
  }, [validCountries, selectedRegion]);

  const fullXMax = useMemo(() => Math.max(...filteredCountries.map(c => c.area)), [filteredCountries]);
  const fullYMax = useMemo(() => Math.max(...filteredCountries.map(c => c.population)), [filteredCountries]);

  const zoomFactor = Math.pow(0.01, zoom / 100);
  // Add 5% headroom so edge points aren't clipped at the boundary
  const xMax = fullXMax * zoomFactor * 1.05;
  const yMax = fullYMax * zoomFactor * 1.05;

  // Build datasets — one per region (or one if filtered)
  const activeRegions = selectedRegion === 'all'
    ? Object.keys(regionColors)
    : [selectedRegion];

  const data = {
    datasets: activeRegions.map(region => {
      const color = regionColors[region] || regionColors['Unknown'];
      return {
        label: region,
        data: filteredCountries
          .filter(c => c.region === region)
          .map(c => ({ x: c.area, y: c.population, label: c.name })),
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 1,
        clip: false,
        pointRadius: selectedRegion === 'all' ? 4 : 5,
        pointHoverRadius: 8
      };
    }).filter(ds => ds.data.length > 0)
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    plugins: {
      legend: {
        display: selectedRegion === 'all',
        position: 'top',
        labels: { color: '#f1f5f9', usePointStyle: true, padding: 14 }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => [
            `Country: ${ctx.raw.label}`,
            `Area: ${ctx.parsed.x.toLocaleString()} km²`,
            `Population: ${ctx.parsed.y.toLocaleString()}`,
            `Density: ${(ctx.parsed.y / ctx.parsed.x).toFixed(2)} per km²`
          ]
        }
      }
    },
    scales: {
      x: {
        type: 'linear', min: 0, max: xMax,
        title: { display: true, text: 'Area (km²)', color: '#f1f5f9', font: { size: 13, weight: 'bold' } },
        ticks: { color: '#94a3b8', callback: fmt },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      y: {
        type: 'linear', min: 0, max: yMax,
        title: { display: true, text: 'Population', color: '#f1f5f9', font: { size: 13, weight: 'bold' } },
        ticks: { color: '#94a3b8', callback: fmt },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    }
  };

  return (
    <div>
      {/* Region filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {regions.map(r => (
          <button
            key={r}
            onClick={() => { setSelectedRegion(r); setZoom(0); }}
            style={btnStyle(selectedRegion === r)}
          >
            {r === 'all' ? 'All regions' : r}
          </button>
        ))}
      </div>

      {/* Zoom slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
        <span style={{ color: '#60a5fa', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
          Zoom into dense area
        </span>
        <div style={{ flex: 1, position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', width: '100%', height: '4px', background: '#334155', borderRadius: '2px' }} />
          <div style={{ position: 'absolute', left: 0, width: `${zoom}%`, height: '4px', background: '#3b82f6', borderRadius: '2px' }} />
          <input
            type="range" min={0} max={100} step={1} value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="scatter-zoom-slider"
            style={{ position: 'absolute', width: '100%', background: 'transparent', cursor: 'pointer', margin: 0 }}
          />
        </div>
        <span style={{ color: '#94a3b8', fontSize: '0.82rem', minWidth: '32px', textAlign: 'right' }}>{zoom}%</span>
        {zoom > 0 && (
          <button onClick={() => setZoom(0)} style={{ padding: '4px 10px', background: 'transparent', color: '#60a5fa', border: '1.5px solid #3b82f6', borderRadius: '5px', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Reset
          </button>
        )}
      </div>

      {/* Range info */}
      <div style={{ color: '#475569', fontSize: '0.75rem', marginBottom: '8px' }}>
        Showing {filteredCountries.length} countries · Area 0 – {fmt(Math.round(xMax))} km² · Population 0 – {fmt(Math.round(yMax))}
      </div>

      <div style={{ height: '400px' }}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};

export default PopulationAreaScatter;
