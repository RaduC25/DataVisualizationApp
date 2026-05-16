import { useState, useMemo, useEffect } from 'react';
import './CountryTable.css';
import DualRangeSlider from '../DualRangeSlider/DualRangeSlider';

const formatPop = (val) => {
  if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
  if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
  if (val >= 1e3) return (val / 1e3).toFixed(0) + 'K';
  return val.toString();
};

const formatArea = (val) => {
  if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M km²';
  if (val >= 1e3) return (val / 1e3).toFixed(0) + 'K km²';
  return val + ' km²';
};

const CountryTable = ({ countries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('population');
  const [sortOrder, setSortOrder] = useState('desc');
  const [displayCount, setDisplayCount] = useState(20);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const maxPop = useMemo(() => Math.max(...countries.map(c => c.population), 0), [countries]);
  const maxArea = useMemo(() => Math.max(...countries.map(c => c.area), 0), [countries]);

  const [popMin, setPopMin] = useState(0);
  const [popMax, setPopMax] = useState(0);
  const [areaMin, setAreaMin] = useState(0);
  const [areaMax, setAreaMax] = useState(0);

  useEffect(() => {
    if (maxPop > 0) setPopMax(maxPop);
    if (maxArea > 0) setAreaMax(maxArea);
  }, [maxPop, maxArea]);

  const regions = useMemo(() => {
    return [...new Set(countries.map(c => c.region))].sort();
  }, [countries]);

  const filteredAndSortedCountries = useMemo(() => {
    let filtered = countries;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter(c => c.region === regionFilter);
    }

    if (popMin > 0) filtered = filtered.filter(c => c.population >= popMin);
    if (popMax > 0 && popMax < maxPop) filtered = filtered.filter(c => c.population <= popMax);
    if (areaMin > 0) filtered = filtered.filter(c => c.area >= areaMin);
    if (areaMax > 0 && areaMax < maxArea) filtered = filtered.filter(c => c.area <= areaMax);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return sortOrder === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    });
  }, [countries, searchTerm, regionFilter, sortBy, sortOrder, popMin, popMax, areaMin, areaMax, maxPop, maxArea]);

  const displayedCountries = filteredAndSortedCountries.slice(0, displayCount);

  const hasActiveFilters = regionFilter !== 'all' || popMin > 0 || popMax < maxPop || areaMin > 0 || areaMax < maxArea;

  const clearFilters = () => {
    setRegionFilter('all');
    setPopMin(0); setPopMax(maxPop);
    setAreaMin(0); setAreaMax(maxArea);
  };

  return (
    <div className="country-table-container">
      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ maxWidth: '300px' }}
        />

        <div className="dropdown-container">
          <button
            className={`dropdown-button ${hasActiveFilters ? 'dropdown-button--active' : ''}`}
            onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowSortDropdown(false); }}
          >
            Filter by {hasActiveFilters ? '●' : '▼'}
          </button>
          {showFilterDropdown && (
            <div className="dropdown-menu filter-dropdown-menu">
              <div className="filter-dd-section">
                <div className="filter-dd-label">Region</div>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="all">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {maxPop > 0 && (
                <DualRangeSlider
                  label="Population"
                  min={0} max={maxPop}
                  valueMin={popMin} valueMax={popMax}
                  onChangeMin={setPopMin} onChangeMax={setPopMax}
                  formatValue={formatPop}
                />
              )}

              {maxArea > 0 && (
                <DualRangeSlider
                  label="Area (km²)"
                  min={0} max={maxArea}
                  valueMin={areaMin} valueMax={areaMax}
                  onChangeMin={setAreaMin} onChangeMax={setAreaMax}
                  formatValue={formatArea}
                />
              )}

              {hasActiveFilters && (
                <button className="filter-clear-btn" onClick={clearFilters}>
                  ✕ Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <button
            className="dropdown-button"
            onClick={() => { setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false); }}
          >
            Sort by ▼
          </button>
          {showSortDropdown && (
            <div className="dropdown-menu sort-dropdown-menu">
              <div className="sort-group-label">Name</div>
              <div className="sort-row">
                <button className={`dropdown-item sort-dir-btn ${sortBy === 'name' && sortOrder === 'asc' ? 'active' : ''}`} onClick={() => { setSortBy('name'); setSortOrder('asc'); }}>↑ A → Z</button>
                <button className={`dropdown-item sort-dir-btn ${sortBy === 'name' && sortOrder === 'desc' ? 'active' : ''}`} onClick={() => { setSortBy('name'); setSortOrder('desc'); }}>↓ Z → A</button>
              </div>
              <div className="sort-group-label">Population</div>
              <div className="sort-row">
                <button className={`dropdown-item sort-dir-btn ${sortBy === 'population' && sortOrder === 'asc' ? 'active' : ''}`} onClick={() => { setSortBy('population'); setSortOrder('asc'); }}>↑ Lowest first</button>
                <button className={`dropdown-item sort-dir-btn ${sortBy === 'population' && sortOrder === 'desc' ? 'active' : ''}`} onClick={() => { setSortBy('population'); setSortOrder('desc'); }}>↓ Highest first</button>
              </div>
              <div className="sort-group-label">Area</div>
              <div className="sort-row">
                <button className={`dropdown-item sort-dir-btn ${sortBy === 'area' && sortOrder === 'asc' ? 'active' : ''}`} onClick={() => { setSortBy('area'); setSortOrder('asc'); }}>↑ Smallest first</button>
                <button className={`dropdown-item sort-dir-btn ${sortBy === 'area' && sortOrder === 'desc' ? 'active' : ''}`} onClick={() => { setSortBy('area'); setSortOrder('desc'); }}>↓ Largest first</button>
              </div>
              <div className="sort-group-label">Density</div>
              <div className="sort-row">
                <button className={`dropdown-item sort-dir-btn ${sortBy === 'populationDensity' && sortOrder === 'asc' ? 'active' : ''}`} onClick={() => { setSortBy('populationDensity'); setSortOrder('asc'); }}>↑ Lowest first</button>
                <button className={`dropdown-item sort-dir-btn ${sortBy === 'populationDensity' && sortOrder === 'desc' ? 'active' : ''}`} onClick={() => { setSortBy('populationDensity'); setSortOrder('desc'); }}>↓ Highest first</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="results-info">
        Showing {displayedCountries.length} of {filteredAndSortedCountries.length} countries
      </div>

      <div className="country-grid">
        {displayedCountries.map(country => (
          <div key={country.name} className="country-card">
            <h3>{country.name}</h3>
            <div className="info-row">
              <span className="label">Population:</span>
              <span className="value">{country.population.toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="label">Area:</span>
              <span className="value">{country.area.toLocaleString()} km²</span>
            </div>
            <div className="info-row">
              <span className="label">Density:</span>
              <span className="value">{country.populationDensity} per km²</span>
            </div>
            <span className={`region-badge region-${country.region.toLowerCase().replace(' ', '-')}`}>
              {country.region}
            </span>
          </div>
        ))}
      </div>

      {displayedCountries.length < filteredAndSortedCountries.length && (
        <div className="load-more-container">
          <button className="load-button" onClick={() => setDisplayCount(displayCount + 20)}>Load More</button>
          <button className="load-button load-all" onClick={() => setDisplayCount(filteredAndSortedCountries.length)}>Load All</button>
        </div>
      )}

      {filteredAndSortedCountries.length === 0 && (
        <div className="no-results">No countries found matching your criteria</div>
      )}
    </div>
  );
};

export default CountryTable;
