// insights/page.tsx
"use client";
import React, { useEffect, useState } from "react";

export default function InsightsPage() {
  const [stored, setStored] = useState<{ fileName?: string } | null>(null);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("uploadedData") ?? "null");
      setStored(s);
    } catch {
      setStored(null);
    }
  }, []);

  const fileName = stored?.fileName ?? "No file uploaded";

  return (
    <main>
      <div className="container">
        <div className="two-column">
          <div>
            <h1>AI Insights</h1>
            <p>File: {fileName}</p>

            <section style={{ marginTop: 16 }} className="card">
              <h2>Summary</h2>
              <p>
                This panel shows human-readable AI explanations about the dataset, prioritized recommendations,
                and example SQL/data-cleaning steps.
              </p>
            </section>

            <section style={{ marginTop: 24 }}>
              <h2>Insights (expand for details)</h2>
              <div style={{ display: "grid", gap: 12 }}>
                <details className="card">
                  <summary>
                    <strong>Key Recommendation — Address Missing Emails</strong>
                  </summary>
                  <div style={{ marginTop: 8 }}>
                    <p>
                      Missing values were detected in the <code>email</code> column (approx. 2% of rows). Consider
                      imputation strategies or marking as unknown.
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn" onClick={() => navigator.clipboard?.writeText("Address missing emails")}>
                        Copy Recommendation
                      </button>
                      <button className="btn secondary">Show Sources</button>
                    </div>
                  </div>
                </details>

                <details className="card">
                  <summary>
                    <strong>Standardize Date Formats</strong>
                  </summary>
                  <div style={{ marginTop: 8 }}>
                    <p>Detected multiple date formats in <code>date_joined</code>. Convert to ISO 8601 using parsing.</p>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                      <code>UPDATE table SET date = TO_CHAR(TO_DATE(date, 'MM/DD/YYYY'), 'YYYY-MM-DD');</code>
                    </pre>
                  </div>
                </details>

                <details className="card">
                  <summary>
                    <strong>Duplicate Row Detection</strong>
                  </summary>
                  <div style={{ marginTop: 8 }}>
                    <p>Potential duplicates found by <code>id</code> field — review duplicates and choose dedup strategy.</p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          <aside>
            <div className="card">
              <h3>Export & Utilities</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn">Download Report</button>
                <button className="btn secondary">Copy Recommendations</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
