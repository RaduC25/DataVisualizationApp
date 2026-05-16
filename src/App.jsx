import { useState, useEffect } from 'react';
import './App.css';
import { fetchCountriesData } from './services/api';
import PopulationBarChart from './components/Charts/PopulationBarChart';
import PopulationAreaScatter from './components/Charts/PopulationAreaScatter';
import RegionPieChart from './components/Charts/RegionPieChart';
import PopulationDensityLine from './components/Charts/PopulationDensityLine';
import CountryTable from './components/CountryTable/CountryTable';

export const REGION_COLORS = {
  'Africa':    { bg: 'rgba(255, 99, 132, 0.6)',  border: 'rgba(255, 99, 132, 1)' },
  'Americas':  { bg: 'rgba(54, 162, 235, 0.6)',  border: 'rgba(54, 162, 235, 1)' },
  'Asia':      { bg: 'rgba(255, 206, 86, 0.6)',  border: 'rgba(255, 206, 86, 1)' },
  'Europe':    { bg: 'rgba(75, 192, 192, 0.6)',  border: 'rgba(75, 192, 192, 1)' },
  'Oceania':   { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' },
  'Antarctic': { bg: 'rgba(255, 159, 64, 0.6)',  border: 'rgba(255, 159, 64, 1)' },
  'Unknown':   { bg: 'rgba(201, 203, 207, 0.6)', border: 'rgba(201, 203, 207, 1)' }
};

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCountriesData();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError('Failed to load countries data. Please try again later.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalPopulation = countries.reduce((sum, country) => sum + country.population, 0);
  const totalArea = countries.reduce((sum, country) => sum + country.area, 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading countries data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Countries Statistics Visualization</h1>
        <p className="subtitle">Interactive exploration of countries data whole around the world</p>
      </header>

      <section className="data-section">
        <div className="data-section-inner">
          <h2>Country Data</h2>
          <CountryTable countries={countries} />
        </div>
      </section>

      <section className="charts-section">
        <h2>Interactive Charts</h2>

        <div className="charts-grid">
          <div className="chart-container">
            <h3>Top 10 Most Populated Countries</h3>
            <PopulationBarChart countries={countries} />
          </div>

          <div className="chart-container">
            <h3>Population vs Area Analysis</h3>
            <PopulationAreaScatter countries={countries} regionColors={REGION_COLORS} />
          </div>

          <div className="chart-container">
            <h3>Countries by Region</h3>
            <RegionPieChart countries={countries} regionColors={REGION_COLORS} />
          </div>

          <div className="chart-container">
            <h3>Population Density Trend</h3>
            <PopulationDensityLine countries={countries} />
          </div>
        </div>
      </section>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>{countries.length}</h3>
          <p>Total Countries</p>
        </div>
        <div className="stat-card">
          <h3>{(totalPopulation / 1000000000).toFixed(2)}B</h3>
          <p>Total Population</p>
        </div>
        <div className="stat-card">
          <h3>{(totalArea / 1000000).toFixed(2)}M</h3>
          <p>Total Area (km²)</p>
        </div>
      </div>

      <footer className="footer">
        <p>Data source: <a href="https://restcountries.com/" target="_blank" rel="noopener noreferrer">REST Countries API</a></p>
      </footer>
    </div>
  );
}

export default App;
