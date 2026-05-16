const API_URL = 'https://restcountries.com/v3.1/all?fields=name,population,area,region';

export const fetchCountriesData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch countries data');
    }
    const data = await response.json();

    // Transform the data to a more usable format
    return data.map(country => ({
      name: country.name.common,
      officialName: country.name.official,
      population: country.population || 0,
      area: country.area || 0,
      region: country.region || 'Unknown',
      populationDensity: country.area ? (country.population / country.area).toFixed(2) : 0
    }));
  } catch (error) {
    console.error('Error fetching countries data:', error);
    throw error;
  }
};

export const getTop10PopulatedCountries = (countries) => {
  return [...countries]
    .sort((a, b) => b.population - a.population)
    .slice(0, 10);
};

export const getCountriesByRegion = (countries) => {
  const regionCounts = {};
  countries.forEach(country => {
    regionCounts[country.region] = (regionCounts[country.region] || 0) + 1;
  });
  return regionCounts;
};

export const getAllRegions = (countries) => {
  const regions = new Set(countries.map(country => country.region));
  return Array.from(regions).sort();
};
