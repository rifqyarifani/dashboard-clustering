"use client";

import { useState, useEffect } from "react";
import Cluster3DPlot from "./components/Cluster3DPlot";

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

export default function Dashboard() {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error("Failed to load data");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError("Error loading data. Please try again.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D Cluster Visualization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            3D Cluster Visualization Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Visualisasi data klaster negara G20 berdasarkan PCA dengan ukuran
            titik berdasarkan variabel tertentu
          </p>
        </div>

        <Cluster3DPlot data={data} />
      </div>
    </div>
  );
}
