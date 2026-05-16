# World Countries Data Visualization

An interactive web application built with React and Chart.js that visualizes global country data from the REST Countries API.

## Features

- **Real-time Data Fetching**: Pulls live data from the REST Countries API
- **Interactive Charts**:
  - Bar Chart: Top 10 most populated countries
  - Pie Chart: Distribution of countries by region
  - Scatter Plot: Population vs Area analysis with color-coded regions
- **Data Table**:
  - Search countries by name
  - Filter by region
  - View detailed country information (population, area, density)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Summary Statistics**: Quick overview of total countries, population, and area

## Technologies Used

- **React** (v18) - UI framework
- **Vite** - Build tool and dev server
- **Chart.js** (v4) - Data visualization library
- **react-chartjs-2** - React wrapper for Chart.js
- **REST Countries API** - Data source

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Project Structure

```text
src/
├── components/
│   ├── Charts/
│   │   ├── PopulationBarChart.jsx    # Bar chart for top populations
│   │   ├── PopulationAreaScatter.jsx # Scatter plot for area vs population
│   │   ├── PopulationDensityLine.jsx # Line chart for density trends
│   │   └── RegionPieChart.jsx        # Pie chart for regional distribution
│   ├── CountryTable/
│   │   ├── CountryTable.jsx          # Interactive data grid
│   │   └── CountryTable.css          # Grid styles
│   └── DualRangeSlider/
│       ├── DualRangeSlider.jsx       # Custom dual-handle range input
│       └── DualRangeSlider.css       # Range slider styles
├── services/
│   └── api.js                    # API service for fetching country data
├── App.jsx                       # Main application component
├── App.css                       # Main application layout styles
├── index.css                     # Global reset, typography, and variables
└── main.jsx                      # React entry point
```

## Data Visualization Details

### Bar Chart - Top 10 Most Populated Countries
A responsive bar chart built with Chart.js that dynamically displays the 10 most populous countries.
- **Region Filtering**: Includes interactive buttons above the chart to filter the dataset by region (Africa, Americas, Asia, Europe, Oceania, Antarctic). When a region is selected, the chart instantly updates to show the top 10 most populated countries strictly within that specific region.
- **Smart Formatting**: Y-axis labels dynamically format large numbers (e.g., 1.4B instead of 1,400,000,000) for readability.
- **Custom Tooltips**: Hovering over a bar reveals the exact formatted population count and the country's region.

### Pie Chart - Countries by Region
A multi-metric pie chart that illustrates regional distributions across the globe.
- **Triple Metric Toggle**: Users can switch between three distinct analytical modes using interactive buttons:
  1. **# Countries**: Shows the raw count of sovereign states per region.
  2. **Population**: Shows the total combined population of all countries in a region.
  3. **Area**: Shows the total combined landmass of all countries in a region.
- **Dynamic Legends**: The legend automatically updates alongside the mode, appending the raw formatted value and the calculated percentage to the label (e.g., `Asia  4.75B (59.2%)`).

### Scatter Plot - Population vs Area Analysis
An advanced linear-scale scatter plot designed to handle extreme data variances without relying on logarithmic distortion.
- **Interactive Zoom Slider**: Features a custom-built, dual-handle-style zoom slider that exponentially zooms into the bottom-left corner of the chart. This allows users to easily separate and analyze the dense cluster of smaller, less populated European and African countries that are normally dwarfed by massive outliers like Russia or India.
- **Decluttering via Filters**: Includes a region toggle that reduces the visible dataset from ~250 points down to ~50, eliminating overlap and making individual data points distinct.
- **Density Tooltips**: Hovering over a point displays the country name, exact area, population, and calculates the specific Population Density on the fly.
- **Visual Clarity**: Uses semi-transparent point fills (`rgba(..., 0.5)`) so overlapping points compound their colors, visually representing density hotspots.

### Country Data Grid
A highly interactive, edge-to-edge responsive card grid that displays detailed statistics for every country.
- **Advanced Filtering**: Features a dropdown containing a region select and two custom-built `DualRangeSlider` components, allowing users to define strict minimum and maximum boundaries for both Population and Area.
- **Multi-Directional Sorting**: A dedicated sort dropdown allows explicit Ascending (↑) or Descending (↓) sorting across Name, Population, Area, and Density metrics.
- **Search & Pagination**: Includes a real-time text search and a "Load More" pagination system to maintain high rendering performance.

## API Information

Data is fetched from: `https://restcountries.com/v3.1/all?fields=name,population,area,region`

The API returns:
- Country names (common and official)
- Population figures
- Land area in km²
- Geographic region classification

## License

This project is open source and available for educational purposes.
