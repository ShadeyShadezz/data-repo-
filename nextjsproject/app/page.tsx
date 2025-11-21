"use client";

import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Papa from "papaparse";

export default function Home() {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<{ fileName: string; rows: number } | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("uploadedData") ?? "null");
      if (stored && stored.fileName) {
        setRecent({ fileName: stored.fileName, rows: (stored.data ?? []).length });
      }
    } catch {}
  }, []);

  const handleFile = useCallback((file: File | null) => {
    setError(null);
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large (max 50MB)");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          localStorage.setItem("uploadedData", JSON.stringify({ fileName: file.name, data }));
          // Navigate to preview
          window.location.href = '/preview';
        } catch (e) {
          setError("Failed to save file in browser");
        }
      },
      error: (err) => setError("Parse error: " + String(err?.message ?? err)),
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  return (
    <main className="page-hero">
      <div className="container">
        <div className="card" style={{ marginBottom: 20 }}>
          <h1>Upload Your Dataset</h1>
          <p className="muted">Instant AI-powered data quality analysis — privacy-first, client-side parsing</p>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <div className={`dropzone ${dragOver ? 'dragover' : ''}`} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { const input = (e.currentTarget as HTMLElement).querySelector('input[type=file]') as HTMLInputElement | null; input?.click(); } }}>
            <div className="center" style={{ fontSize: 18 }}>📤 Drag & Drop File Here</div>
            <div className="muted">or</div>
            <input aria-label="Choose file" type="file" accept=".csv,text/csv,application/json,application/vnd.ms-excel,text/plain" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            <div className="muted" style={{ marginTop: 8 }}>Supported: CSV, JSON, Excel (max 50MB)</div>
            {error && <div className="error" role="alert" style={{ marginTop: 8 }}>{error}</div>}
          </div>

          <div className="two-column">
            <div className="panel">
              <h3>Recent Analyses</h3>
              {recent ? (
                <div className="card recent-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{recent.fileName}</div>
                      <div className="muted">{recent.rows} rows — analyzed earlier</div>
                    </div>
                    <div>
                      <Link href="/preview"><button className="btn">Open</button></Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="muted">No recent analyses</div>
              )}
            </div>

            <aside className="panel">
              <h3>About this website</h3>
              <p className="muted">Agentic Data Quality is a lightweight, client-first tool for quick dataset inspection and AI-assisted recommendations. Files are parsed in your browser; no data leaves your machine unless you choose to export or share.</p>
              <p style={{ marginTop: 8 }}><strong>How it works:</strong></p>
              <ul>
                <li>Upload a CSV/JSON/Excel file.</li>
                <li>Preview data and column statistics.</li>
                <li>Run analysis to get quality scores, charts and AI recommendations.</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}