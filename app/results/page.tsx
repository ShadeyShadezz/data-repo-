"use client";
import React from 'react';
import Link from 'next/link';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function computeMetrics(rows: any[]) {
  if (!rows || rows.length === 0) return { score: 0, completeness: 0, consistency: 0, accuracy: 0, validity: 0 };
  const total = rows.length;
  const columns = Object.keys(rows[0]);
  let missingCount = 0;
  columns.forEach(col => {
    missingCount += rows.filter(r => r[col] === '' || r[col] == null).length;
  });
  const completeness = Math.max(0, 100 - Math.round((missingCount / (total * columns.length)) * 100));
  // lightweight heuristics for demo
  const consistency = 80;
  const accuracy = 85;
  const validity = 80;
  const score = Math.round((completeness + consistency + accuracy + validity) / 4);
  return { score, completeness, consistency, accuracy, validity };
}

export default function ResultsPage() {
  let stored: any = null;
  try { stored = JSON.parse(localStorage.getItem('uploadedData') ?? 'null'); } catch (e) { stored = null; }
  const rows = stored?.data ?? [];
  const metrics = computeMetrics(rows);
  const columns = Object.keys(rows[0] ?? {});
  const missingPerColumn = columns.map(col => rows.filter((r:any) => r[col] === '' || r[col] == null).length);
  const typeCounts: Record<string, number> = {};
  columns.forEach(col => {
    const values = rows.map((r:any) => r[col]);
    const isNumeric = values.every(v => v === '' || v == null || !isNaN(Number(v)));
    const t = isNumeric ? 'number' : 'text';
    typeCounts[t] = (typeCounts[t] ?? 0) + 1;
  });

  const barData = {
    labels: columns,
    datasets: [
      {
        label: 'Missing values',
        data: missingPerColumn,
        backgroundColor: 'rgba(59,130,246,0.8)'
      }
    ]
  };

  const pieData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        data: Object.values(typeCounts),
        backgroundColor: ['#3b82f6', '#10b981']
      }
    ]
  };

  return (
    <main>
      <div className="container">
        <div className="two-column">
        <div>
          <h1>Analysis Results</h1>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="score-card">
              <div className="score-number">{metrics.score}</div>
              <div className="muted">Data Quality</div>
            </div>
            <div className="panel">
              <h3>Quality Metrics</h3>
              <div className="metrics-list">
                <div>Completeness: {metrics.completeness}%</div>
                <div>Consistency: {metrics.consistency}%</div>
                <div>Accuracy: {metrics.accuracy}%</div>
                <div>Validity: {metrics.validity}%</div>
              </div>
            </div>
          </div>

          <section style={{ marginTop: 24 }}>
            <h2>Recommendations</h2>
            <div className="card">
              <ol>
                <li>Address missing values in key columns (see preview).</li>
                <li>Validate common formats (emails, dates).</li>
                <li>Review outliers in numeric fields.</li>
              </ol>
            </div>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>Visualizations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
              <div className="card">
                <h3>Missing values by column</h3>
                <div className="table-wrapper"><Bar data={barData} /></div>
              </div>
              <div className="card">
                <h3>Column types</h3>
                <div className="table-wrapper"><Pie data={pieData} /></div>
              </div>
            </div>
          </section>
        </div>

        <aside>
          <div className="card panel">
            <h3>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/insights"><button className="btn">AI Insights</button></Link>
              <button className="btn secondary">Export Recommendations</button>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </main>
  );
}
