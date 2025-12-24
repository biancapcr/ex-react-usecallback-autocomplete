// importazione degli hook necessari
import { useState, useEffect } from "react";

function App() {
  // stato che contiene il testo digitato dall’utente
  const [query, setQuery] = useState("");

  // stato che contiene i prodotti suggeriti dall’API
  const [suggestions, setSuggestions] = useState([]);

  // useEffect = gestione della ricerca con debounce
  useEffect(() => {
    // se il campo di ricerca è vuoto
    // la lista dei suggerimenti viene svuotata
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    // creazione del timer per il debounce
    const timerId = setTimeout(() => {
      // chiamata API ritardata
      fetch(`http://localhost:3333/products?search=${query}`)
        // conversione della risposta in JSON
        .then((response) => response.json())
        // salvataggio dei risultati nello stato
        .then((data) => {
          setSuggestions(data);
        })
        // gestione eventuali errori
        .catch((error) => {
          console.error("Errore nella ricerca prodotti:", error);
        });
    }, 300); // tempo di attesa del debounce
    // cleanup dell’effetto
    // annulla il timer se la query cambia prima dei 300ms
    return () => {
      clearTimeout(timerId);
    };
  }, [query]); // l’effetto dipende dal valore della query

  // render del componente
  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      {/* campo di input per la ricerca */}
      <input
        type="text"
        placeholder="Cerca un prodotto"
        value={query}
        // aggiornamento dello stato ad ogni digitazione
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
        }}
      />

      {/* tendina dei suggerimenti */}
      {suggestions.length > 0 && (
        <ul
          style={{
            border: "1px solid #ccc",
            borderTop: "none",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {/* mappatura dei prodotti suggeriti */}
          {suggestions.map((product) => (
            <li
              key={product.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// esportazione del componente
export default App;
