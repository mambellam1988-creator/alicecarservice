'use client';

import { useEffect, useMemo, useState } from 'react';

const exampleQueries = [
  'Come smonto la radio del Tiguan 2012?',
  'Come rimuovo il volante della Golf 7?',
  'Come cambio le pastiglie freni BMW Serie 3?',
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('Come smonto la radio del Tiguan 2012?');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const text = 'Come smonto la radio del Tiguan 2012?';
    let index = 0;
    setPlaceholder('');
    const interval = setInterval(() => {
      setPlaceholder((prev) => prev + text[index]);
      index += 1;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  const chips = useMemo(
    () => exampleQueries.map((item) => item),
    []
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Errore durante la richiesta');
      }
      setResponse(data);
    } catch (err) {
      setError(err.message || 'Errore interno');
    } finally {
      setLoading(false);
    }
  };

  const selectExample = (item) => {
    setQuery(item);
    setResponse(null);
    setError('');
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span>AutoDoc AI</span>
          <h1>La tua guida meccanica digitale per auto sportive</h1>
          <p>
            Scrivi una domanda di smontaggio o montaggio e ricevi istruzioni strutturate con passi numerati, attrezzi, difficoltà e consigli.
          </p>

          <form className="search-panel" onSubmit={handleSubmit}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              aria-label="Inserisci la tua domanda di montaggio"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Elaborazione...' : 'Chiedi ad AutoDoc'}
            </button>
          </form>

          <div className="chip-list">
            {chips.map((item) => (
              <button key={item} type="button" className="chip" onClick={() => selectExample(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="results-section">
        <div className="results-header">
          <h2>Risposta</h2>
          <p>Ricevi una guida completa con difficoltà, tempo stimato, attrezzi necessari, avvertenze e consigli finali.</p>
        </div>

        <div className="results-grid">
          {error && (
            <div className="result-card error-card">
              <p>{error}</p>
            </div>
          )}

          {response ? (
            <article className="result-card">
              <div className="result-badge">{response.difficolta || 'Difficoltà sconosciuta'}</div>
              <h3>{response.titolo || 'Istruzione meccanica'}</h3>
              <div className="meta-row">
                <span>Tempo: {response.tempo || 'N/D'}</span>
                <span>Consiglio: {response.consiglio || 'Nessun consiglio disponibile'}</span>
              </div>

              {response.attrezzi?.length > 0 && (
                <div className="info-block">
                  <h4>Attrezzi necessari</h4>
                  <div className="tag-group">
                    {response.attrezzi.map((attrezzo) => (
                      <span key={attrezzo} className="tag">
                        {attrezzo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {response.avvertenze?.length > 0 && (
                <div className="info-block">
                  <h4>Avvertenze</h4>
                  <ul>
                    {response.avvertenze.map((warn) => (
                      <li key={warn}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {response.passi?.length > 0 && (
                <div className="info-block">
                  <h4>Passaggi</h4>
                  <ol>
                    {response.passi.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </article>
          ) : (
            <div className="result-card empty-state">
              <p>Inserisci una domanda e premi “Chiedi ad AutoDoc” per vedere la risposta strutturata.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
