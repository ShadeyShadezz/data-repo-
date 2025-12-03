// preview/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function computeColumnStats(rows: any[]) {
  if (!rows || rows.length === 0) return [];
  const headers = Object.keys(rows[0]);
  return headers.map((h) => {
    const values = rows.map((r) => r[h]);
    const missing = values.filter((v) => v === "" || v === null || v === undefined).length;
    const unique = new Set(values.filter((v) => v !== "" && v != null)).size;
    const isNumberLike = values.every((v) => v === "" || v == null || !Number.isNaN(Number(v)));
    const sampleType = isNumberLike ? "number" : "text";
    return { column: h, missing, unique, sampleType };
  });
}

export default function PreviewPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState("No file");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("uploadedData") ?? "null");
      setRows(stored?.data ?? []);
      setFileName(stored?.fileName ?? "No file");
    } catch {
      setRows([]);
      setFileName("No file");
    }
  }, []);

  const stats = computeColumnStats(rows);

  return (
    <main>
      <div className="container">
        <div className="two-column">
          <div>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>File:</strong> {fileName}
                  <div className="muted">{rows.length} rows</div>
                </div>
                <div>
                  <Link href="/results">
                    <button className="btn">Continue to Analysis</button>
                  </Link>
                </div>
              </div>
            </div>

            <section style={{ marginTop: 16 }}>
              <h2>Column Summary</h2>
              <div className="card table-wrapper">
                <table className="data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Column</th>
                      <th style={{ textAlign: "right" }}>Type</th>
                      <th style={{ textAlign: "right" }}>Missing</th>
                      <th style={{ textAlign: "right" }}>Unique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s: any) => (
                      <tr key={s.column}>
                        <td>{s.column}</td>
                        <td style={{ textAlign: "right" }}>{s.sampleType}</td>
                        <td style={{ textAlign: "right" }}>{s.missing}</td>
                        <td style={{ textAlign: "right" }}>{s.unique}</td>
                      </tr>
                    ))}
                    {stats.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          No data to show
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section style={{ marginTop: 24 }}>
              <h2>Data (first 20 rows)</h2>
              <div className="card table-wrapper">
                <table className="data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      {Object.keys(rows[0] ?? {}).map((h: string) => (
                        <th key={h} style={{ textAlign: "left" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 20).map((r: any, i: number) => (
                      <tr key={i}>
                        {Object.keys(r).map((k) => (
                          <td key={k}>{String(r[k] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={Object.keys(rows[0] ?? {}).length || 1} style={{ textAlign: "center" }}>
                          No rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside>
            <div className="card panel">
              <h3>Quick Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href="/results">
                  <button className="btn">Analyze & View Results</button>
                </Link>
                <button className="btn secondary">Download Sample</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
