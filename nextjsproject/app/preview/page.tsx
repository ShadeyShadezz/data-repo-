"use client";
import React from 'react';
import Link from 'next/link';

function computeColumnStats(rows: any[]) {
  if (!rows || rows.length === 0) return [];
  const headers = Object.keys(rows[0]);
  return headers.map(h => {
    const values = rows.map(r => r[h]);
    const missing = values.filter(v => v === '' || v === null || v === undefined).length;
    const unique = new Set(values.filter(v => v !== '' && v != null)).size;
    const sampleType = values.every(v => !isNaN(Number(v))) ? 'number' : 'text';
    return { column: h, missing, unique, sampleType };
  });
}

export default function PreviewPage() {
  let stored: any = null;
  try { stored = JSON.parse(localStorage.getItem('uploadedData') ?? 'null'); } catch (e) { stored = null; }
  const rows = stored?.data ?? [];
  const fileName = stored?.fileName ?? 'No file';
  const stats = computeColumnStats(rows);

  return (
    <main>
      <h1>Data Preview</h1>
      <p>File: {fileName} ({rows.length} rows)</p>

      <section style={{ marginTop: 16 }}>
        <h2>Column Summary</h2>
        <table className="data-table card">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Column</th>
              <th style={{ textAlign: 'right' }}>Type</th>
              <th style={{ textAlign: 'right' }}>Missing</th>
              <th style={{ textAlign: 'right' }}>Unique</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(s => (
              <tr key={s.column}>
                <td>{s.column}</td>
                <td style={{ textAlign: 'right' }}>{s.sampleType}</td>
                <td style={{ textAlign: 'right' }}>{s.missing}</td>
                <td style={{ textAlign: 'right' }}>{s.unique}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Data (first 20 rows)</h2>
        <div style={{ overflowX: 'auto', maxWidth: 1000 }}>
          <table className="data-table">
            <thead>
              <tr>
                {Object.keys(rows[0] ?? {}).map((h: string) => (
                  <th key={h} style={{ textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 20).map((r: any, i: number) => (
                <tr key={i}>
                  {Object.keys(r).map(k => <td key={k}>{r[k]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{ marginTop: 24 }}>
        <Link href="/results"><button className="btn">Analyze & View Results</button></Link>
      </div>
    </main>
  );
}
