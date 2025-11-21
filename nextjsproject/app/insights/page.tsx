"use client";
import React from 'react';

export default function InsightsPage() {
  let stored: any = null;
  try { stored = JSON.parse(localStorage.getItem('uploadedData') ?? 'null'); } catch (e) { stored = null; }
  const fileName = stored?.fileName ?? 'No file uploaded';

  return (
    <main>
      <h1>AI Insights</h1>
      <p>File: {fileName}</p>

      <section style={{ marginTop: 16 }} className="card">
        <h2>Summary</h2>
        <p>This panel will show human-readable AI explanations about the dataset, prioritized recommendations, and example SQL/data-cleaning steps.</p>
      </section>

      <section style={{ marginTop: 24 }} className="card">
        <h2>Example Recommendations</h2>
        <ol>
          <li>Fill missing `email` values from alternate source or mark as unknown.</li>
          <li>Standardize date formats in `date_joined` column to ISO 8601.</li>
          <li>Detect and remove obvious duplicate rows by `id`.</li>
        </ol>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Download</h2>
        <p>Downloadable recommendations report will be available here.</p>
        <button className="btn" onClick={() => alert('Download placeholder')}>Download Report</button>
      </section>
    </main>
  );
}
