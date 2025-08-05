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
  const [clusterStats, setClusterStats] = useState<any>({});

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
    // Calculate cluster statistics
    const calculateClusterStats = () => {
      const stats: any = {};
      [0, 1, 2].forEach((cluster) => {
        const clusterData = data.filter(
          (country) => country.cluster === cluster
        );
        if (clusterData.length > 0) {
          stats[cluster] = {
            count: clusterData.length,
            countries: clusterData.map((c) => c.negara),
            avgInflation:
              clusterData.reduce((sum, c) => sum + c.inflation_rate, 0) /
              clusterData.length,
            avgPolicyRate:
              clusterData.reduce((sum, c) => sum + c.policy_rate, 0) /
              clusterData.length,
            avgUnemployment:
              clusterData.reduce((sum, c) => sum + c.unemployment_rate, 0) /
              clusterData.length,
            avgGdpGrowth:
              clusterData.reduce((sum, c) => sum + c.gdp_growth, 0) /
              clusterData.length,
          };
        }
      });
      setClusterStats(stats);
    };

    calculateClusterStats();

    const texts = data.map(
      (country) =>
        `<b>${country.negara}</b><br>` +
        `<b>Cluster ${country.cluster}</b><br><br>` +
        `📊 <b>Economic Indicators:</b><br>` +
        `• Inflation Rate: ${(country.inflation_rate * 100).toFixed(1)}%<br>` +
        `• Policy Rate: ${(country.policy_rate * 100).toFixed(2)}%<br>` +
        `• Unemployment Rate: ${(country.unemployment_rate * 100).toFixed(
          1
        )}%<br>` +
        `• GDP Growth: ${(country.gdp_growth * 100).toFixed(2)}%<br><br>` +
        `📈 <b>Additional Metrics:</b><br>` +
        `• Producer Inflation: ${(country.producer_inflation * 100).toFixed(
          1
        )}%<br>` +
        `• Real Effective Exchange Rate: ${country.real_effective_exchange_rates.toFixed(
          2
        )}<br>` +
        `• Equity Risk Premium: ${country.equity_risk_premium.toFixed(2)}<br>` +
        `• Government Debt: ${country.gov_debt.toFixed(2)}<br>` +
        `• Political Risk: ${country.political_risk.toFixed(2)}`
    );

    // Create custom colorscale with better contrast
    const customColorscale = [
      [0, "rgb(128, 0, 128)"], // Purple for cluster 0
      [0.5, "rgb(0, 150, 136)"], // Teal for cluster 1
      [1, "rgb(255, 193, 7)"], // Amber for cluster 2
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
          title: {
            text: "Cluster Groups",
            font: { size: 12, color: "#2c3e50" },
          },
          titleside: "right",
          thickness: 15,
          len: 0.5,
          tickvals: [0, 1, 2],
          ticktext: ["Cluster 0", "Cluster 1", "Cluster 2"],
          tickfont: { size: 10, color: "#2c3e50" },
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
        text: "3D Cluster Analysis - Principal Component Visualization",
        font: {
          size: 20,
          color: "#2c3e50",
        },
        x: 0.5,
        xanchor: "center",
      },
      scene: {
        xaxis: {
          title: {
            text: "PC1",
            font: { size: 14, color: "#2c3e50" },
          },
          gridcolor: "#e0e0e0",
          zerolinecolor: "#b0b0b0",
          showbackground: true,
          backgroundcolor: "#f8f9fa",
          tickfont: { size: 12, color: "#2c3e50" },
        },
        yaxis: {
          title: {
            text: "PC2",
            font: { size: 14, color: "#2c3e50" },
          },
          gridcolor: "#e0e0e0",
          zerolinecolor: "#b0b0b0",
          showbackground: true,
          backgroundcolor: "#f8f9fa",
          tickfont: { size: 12, color: "#2c3e50" },
        },
        zaxis: {
          title: {
            text: "PC3",
            font: { size: 14, color: "#2c3e50" },
          },
          gridcolor: "#e0e0e0",
          zerolinecolor: "#b0b0b0",
          showbackground: true,
          backgroundcolor: "#f8f9fa",
          tickfont: { size: 12, color: "#2c3e50" },
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
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Plot Area */}
        <div className="lg:col-span-3">
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
                displayModeBar: false,
              }}
            />
          </div>
        </div>

        {/* Cluster Statistics Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Cluster Statistics
            </h3>
            <div className="space-y-4">
              {Object.keys(clusterStats).map((cluster) => {
                const stats = clusterStats[cluster];
                const clusterColors: Record<string, string> = {
                  "0": "rgb(128, 0, 128)",
                  "1": "rgb(0, 150, 136)",
                  "2": "rgb(255, 193, 7)",
                };

                return (
                  <div
                    key={cluster}
                    className="bg-white rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: clusterColors[cluster] }}
                      ></div>
                      <h4 className="font-medium text-gray-800">
                        Cluster {cluster} ({stats.count} countries)
                      </h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        📈 Avg Inflation:{" "}
                        {(stats.avgInflation * 100).toFixed(1)}%
                      </div>
                      <div>
                        🏦 Avg Policy Rate:{" "}
                        {(stats.avgPolicyRate * 100).toFixed(2)}%
                      </div>
                      <div>
                        👥 Avg Unemployment:{" "}
                        {(stats.avgUnemployment * 100).toFixed(1)}%
                      </div>
                      <div>
                        💰 Avg GDP Growth:{" "}
                        {(stats.avgGdpGrowth * 100).toFixed(2)}%
                      </div>
                    </div>
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                        View Countries ({stats.countries.length})
                      </summary>
                      <div className="mt-1 text-xs text-gray-500 max-h-20 overflow-y-auto">
                        {stats.countries.join(", ")}
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
