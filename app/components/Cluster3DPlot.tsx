/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
}) as React.ComponentType<any>;

interface CountryData {
  country_code: string;
  negara: string;
  PC1: number;
  PC2: number;
  PC3: number;
  cluster: number;
  inflation_rate: number;
  policy_rate: number;
  unemployment_rate: number;
  gdp_growth: number;
  producer_inflation: number;
  real_effective_exchange_rates: number;
  equity_risk_premium: number;
  gov_debt: number;
  political_risk: number;
}

interface Cluster3DPlotProps {
  data: CountryData[];
}

export default function Cluster3DPlot({ data }: Cluster3DPlotProps) {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});
  const [isClient, setIsClient] = useState(false);
  const [sizeVariable, setSizeVariable] = useState<string>("inflation_rate");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (data.length === 0 || !isClient) return;

    // Prepare data for 3D scatter plot - all points in one trace
    const x = data.map((country) => country.PC1);
    const y = data.map((country) => country.PC2);
    const z = data.map((country) => country.PC3);
    // Calculate sizes based on selected variable
    const getSizeValue = (country: CountryData) => {
      switch (sizeVariable) {
        case "policy_rate":
          return Math.max(8, country.policy_rate * 250);
        case "inflation_rate":
          return Math.max(8, country.inflation_rate * 250);
        case "producer_inflation":
          return Math.max(8, country.producer_inflation * 250);
        case "unemployment_rate":
          return Math.max(8, country.unemployment_rate * 250);
        case "gdp_growth":
          return Math.max(8, Math.abs(country.gdp_growth) * 250);
        case "real_effective_exchange_rate":
          return Math.max(
            8,
            Math.abs(country.real_effective_exchange_rates) * 250
          );
        case "equity_risk_premium":
          return Math.max(8, Math.abs(country.equity_risk_premium) * 2);
        case "gov_debt":
          return Math.max(8, Math.abs(country.gov_debt) * 25);
        case "political_risk":
          return Math.max(8, Math.abs(country.political_risk) * 25);
        default:
          return Math.max(8, country.inflation_rate * 250);
      }
    };

    const sizes = data.map(getSizeValue);
    const colors = data.map((country) => country.cluster);
    const texts = data.map(
      (country) =>
        `${country.negara}<br>Inflation: ${(
          country.inflation_rate * 100
        ).toFixed(1)}%<br>Policy Rate: ${(country.policy_rate * 100).toFixed(
          2
        )}%<br>Unemployment: ${(country.unemployment_rate * 100).toFixed(
          1
        )}%<br>GDP Growth: ${(country.gdp_growth * 100).toFixed(
          2
        )}%<br>Cluster: ${
          country.cluster
        }<br>Real Effective Exchange Rates: ${country.real_effective_exchange_rates.toFixed(
          2
        )}<br>Equity Risk Premium: ${country.equity_risk_premium.toFixed(
          2
        )}<br>Gov Debt: ${country.gov_debt.toFixed(
          2
        )}<br>Political Risk: ${country.political_risk.toFixed(2)}
        `
    );

    // Create custom colorscale based on the image
    const customColorscale = [
      [0, "rgb(75, 0, 130)"], // Dark purple for cluster 0
      [0.5, "rgb(0, 128, 128)"], // Teal for cluster 1
      [1, "rgb(255, 255, 0)"], // Yellow for cluster 2
    ];

    const trace = {
      x,
      y,
      z,
      mode: "markers",
      type: "scatter3d",
      marker: {
        size: sizes,
        color: colors,
        colorscale: customColorscale,
        colorbar: {
          title: "Cluster",
          titleside: "right",
          thickness: 15,
          len: 0.5,
          tickvals: [0, 1, 2],
          ticktext: ["Cluster 0", "Cluster 1", "Cluster 2"],
        },
        line: {
          color: "rgba(0,0,0,0.3)",
          width: 1,
        },
        opacity: 0.9,
      },
      text: texts,
      hoverinfo: "text",
      showlegend: false,
    };

    setPlotData([trace]);

    // Set layout
    setLayout({
      title: {
        text: "Visualisasi Klaster dalam PCA 3D (Ukuran Titik: Inflation Rate)",
        font: {
          size: 18,
          color: "#2c3e50",
        },
      },
      scene: {
        xaxis: {
          title: "PC1",
          gridcolor: "gray",
          zerolinecolor: "gray",
          showbackground: true,
          backgroundcolor: "#f5f5f5",
        },
        yaxis: {
          title: "PC2",
          gridcolor: "gray",
          zerolinecolor: "gray",
          showbackground: true,
          backgroundcolor: "#f5f5f5",
        },
        zaxis: {
          title: "PC3",
          gridcolor: "gray",
          zerolinecolor: "gray",
          showbackground: true,
          backgroundcolor: "#f5f5f5",
        },
        camera: {
          eye: {
            x: 1.5,
            y: 1.5,
            z: 1.5,
          },
        },
      },
      width: 800,
      height: 600,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 50,
        pad: 4,
      },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
    });
  }, [data, isClient, sizeVariable]);

  if (data.length === 0 || !isClient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">3D Cluster Visualization</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">3D Cluster Visualization</h3>

      {/* Size Variable Control */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <label
          htmlFor="sizeVariable"
          className="text-sm font-medium text-gray-700"
        >
          Point Size Based On:
        </label>
        <select
          id="sizeVariable"
          value={sizeVariable}
          onChange={(e) => setSizeVariable(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="inflation_rate">Inflation Rate</option>
          <option value="policy_rate">Policy Rate</option>
          <option value="unemployment_rate">Unemployment Rate</option>
          <option value="gdp_growth">GDP Growth</option>
          <option value="real_effective_exchange_rates">
            Real Effective Exchange Rates
          </option>
          <option value="equity_risk_premium">Equity Risk Premium</option>
          <option value="gov_debt">Gov Debt</option>
          <option value="political_risk">Political Risk</option>
        </select>
      </div>

      <div className="flex justify-center">
        <Plot
          data={plotData}
          layout={layout}
          config={{
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ["pan2d", "lasso2d", "select2d"],
          }}
        />
      </div>
    </div>
  );
}
