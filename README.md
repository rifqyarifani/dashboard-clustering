# Data Visualization Dashboard

A modern, interactive data visualization dashboard built with Next.js, React, and Plotly.js. This dashboard provides powerful tools for creating correlation plots and heatmaps with customizable axes and data sources.

## Features

### 📊 Visualization Types

- **Correlation Plots**: Interactive scatter plots showing relationships between variables
- **Heatmaps**: Color-coded matrix visualizations for correlation analysis
- **Customizable Axes**: Full control over X and Y axis labels and data selection

### 🎛️ Interactive Controls

- **Data Source Toggle**: Switch between generated sample data and uploaded CSV files
- **Real-time Parameter Adjustment**:
  - Data size (50-500 points)
  - Correlation coefficient (-1.0 to 1.0)
  - Color schemes (Viridis, Plasma, Inferno, etc.)
  - Plot type selection (correlation, heatmap, or both)
- **Quick Presets**: Pre-configured settings for common scenarios

### 📁 Data Upload

- **CSV File Support**: Upload your own data files
- **Automatic Column Detection**: Numeric columns are automatically identified
- **Smart Axis Assignment**: Automatically suggests appropriate X and Y axes
- **Correlation Matrix Generation**: Creates heatmaps from uploaded data correlations

### 📈 Advanced Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Plots**: Zoom, pan, and hover for detailed data exploration
- **Real-time Statistics**: Live updates of data points, correlation coefficients, and more
- **Export Ready**: High-quality visualizations suitable for reports and presentations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dashboard-clustering
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Using Generated Data

1. Select "Generated Data" as the data source
2. Adjust the correlation coefficient slider to see different relationships
3. Change the data size to explore how sample size affects visualization
4. Customize axis labels and color schemes
5. Choose between correlation plot, heatmap, or both

### Using Uploaded Data

1. Select "Uploaded Data" as the data source
2. Click "Choose File" and select a CSV file
3. Click "Upload and Visualize" to process your data
4. The dashboard will automatically detect numeric columns
5. Select your desired X and Y axes from the dropdown menus
6. The correlation plot will show the relationship between selected variables
7. The heatmap will display correlation coefficients between all numeric columns

### Sample Data

A sample CSV file (`public/sample-data.csv`) is included with weather data containing:

- Temperature (°C)
- Humidity (%)
- Pressure (hPa)
- Wind Speed (m/s)
- Precipitation (mm)

## Technical Details

### Built With

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with hooks and modern patterns
- **Plotly.js**: Interactive plotting library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### Project Structure

```
dashboard-clustering/
├── app/
│   ├── components/
│   │   ├── DataUploader.tsx    # CSV upload component
│   │   └── PlotControls.tsx    # Plot customization controls
│   ├── page.tsx                # Main dashboard page
│   ├── layout.tsx              # App layout
│   └── globals.css             # Global styles
├── public/
│   └── sample-data.csv         # Sample data file
└── package.json
```

### Key Components

#### DataUploader

- Handles CSV file upload and parsing
- Validates file format and data types
- Provides user feedback during upload process

#### PlotControls

- Comprehensive control panel for plot customization
- Real-time parameter adjustment
- Quick preset buttons for common scenarios

#### Main Dashboard

- Orchestrates all components and data flow
- Manages state for both generated and uploaded data
- Handles correlation calculations and plot generation

## Customization

### Adding New Plot Types

1. Create a new component in `app/components/`
2. Add the plot type to the `plotType` state
3. Implement the plotting logic using Plotly.js
4. Add corresponding controls to `PlotControls.tsx`

### Styling

The dashboard uses Tailwind CSS for styling. Customize the appearance by:

- Modifying color schemes in the plot controls
- Adjusting the layout grid in the main component
- Updating the theme colors in `globals.css`

### Data Processing

Extend the data processing capabilities by:

- Adding support for other file formats (Excel, JSON, etc.)
- Implementing data filtering and transformation
- Adding statistical analysis features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on the GitHub repository.
