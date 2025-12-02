"use client";
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const router = useRouter();

  const handleFile = useCallback((file: File | null) => {
    setError(null);
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError('File too large (max 50MB)');
      return;
    }

    setParsing(true);
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          localStorage.setItem('uploadedData', JSON.stringify({ fileName: file.name, data }));
          setParsing(false);
          router.push('/preview');
        } catch (e) {
          setParsing(false);
          setError('Failed to save file in the browser');
        }
      },
      error: (err) => {
        setParsing(false);
        setError('Failed to parse file: ' + String(err?.message ?? err));
      }
    });
  }, [router]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  return (
    <main className="page-hero">
      <div className="container">
        <div className="card">
          <h1>Data Quality Analysis — Upload</h1>
          <p className="muted">Drag & drop a CSV file (or click to choose). Max 50MB.</p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`dropzone ${dragOver ? 'dragover' : ''}`}
            >
              <p style={{ margin: 0, fontSize: 18 }}>📤 Drop file here</p>
              <p className="muted">or</p>
              <input
                aria-label="Choose file"
                type="file"
                accept=".csv,text/csv,application/json,application/vnd.ms-excel,text/plain"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              {parsing && <p className="muted">Parsing file…</p>}
            </div>
          </div>

          {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    </main>
  );
}
