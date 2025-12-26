// importazione degli hook necessari
import { useState, useEffect } from "react";

function App() {
  // stato che contiene il testo digitato dall’utente
  const [query, setQuery] = useState("");

  // stato che contiene i prodotti suggeriti dall’API
  const [suggestions, setSuggestions] = useState([]);

  // stato che contiene il prodotto selezionato con i dettagli completi
  const [selectedProduct, setSelectedProduct] = useState(null);

  // useEffect = gestione della ricerca con debounce
  useEffect(() => {
    // se il campo di ricerca è vuoto
    // vengono svuotati suggerimenti e prodotto selezionato
    if (query.trim() === "") {
      setSuggestions([]);
      setSelectedProduct(null);
      return;
    }

    // creazione del timer per il debounce
    const timerId = setTimeout(() => {
      // chiamata API per la ricerca prodotti
      fetch(`http://localhost:3333/products?search=${query}`)
        // conversione della risposta in JSON
        .then((response) => response.json())
        // salvataggio dei suggerimenti nello stato
        .then((data) => {
          setSuggestions(data);
        })
        // gestione errori
        .catch((error) => {
          console.error("Errore nella ricerca prodotti:", error);
        });
    }, 300); // tempo di debounce

    // cleanup dell’effetto
    // annulla il timer se la query cambia prima dei 300ms
    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  // gestione del click su un prodotto suggerito
  function handleSelectProduct(productId) {
    // svuotamento della tendina dei suggerimenti
    setSuggestions([]);

    // chiamata API per ottenere i dettagli completi del prodotto
    fetch(`http://localhost:3333/products/${productId}`)
      // conversione della risposta in JSON
      .then((response) => response.json())
      // salvataggio del prodotto selezionato nello stato
      .then((data) => {
        setSelectedProduct(data);
      })
      // gestione errori
      .catch((error) => {
        console.error("Errore nel recupero del prodotto:", error);
      });
  }

  // render del componente
  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
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
              // click sul suggerimento
              onClick={() => handleSelectProduct(product.id)}
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

      {/* dettagli del prodotto selezionato */}
      {selectedProduct && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          {/* immagine prodotto */}
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            style={{ width: "100%", marginBottom: "16px" }}
          />

          {/* nome prodotto */}
          <h2>{selectedProduct.name}</h2>

          {/* descrizione */}
          <p>{selectedProduct.description}</p>

          {/* prezzo */}
          <p>
            <strong>Prezzo:</strong> € {selectedProduct.price}
          </p>
        </div>
      )}
    </div>
  );
}

// esportazione del componente
export default App;
