const instructions = [
  {
    brand: "Fiat",
    model: "500",
    title: "Montaggio cruscotto e sistema elettronico",
    description: "Guida passo passo al montaggio del cruscotto, connessione dei cablaggi e installazione del sistema infotainment.",
    steps: [
      "Rimuovere il pannello anteriore esistente.",
      "Collegare i cablaggi principali alla centralina.",
      "Posizionare il cruscotto e fissare con le viti di serie.",
      "Eseguire il test del sistema elettronico e dei display.",
    ],
  },
  {
    brand: "Alfa Romeo",
    model: "Giulia",
    title: "Installazione del sistema frenante anteriore",
    description: "Istruzioni di montaggio per pastiglie, dischi e pinze sui freni anteriori.",
    steps: [
      "Sollevare il veicolo e rimuovere la ruota anteriore.",
      "Svitare la pinza freno e rimuovere le pastiglie usurate.",
      "Montare il nuovo disco e reinserire le pastiglie fresche.",
      "Stringere i bulloni della pinza secondo coppia prescritta.",
    ],
  },
  {
    brand: "Volkswagen",
    model: "Golf",
    title: "Assemblaggio dell'impianto di scarico",
    description: "Procedure per installare il collettore, il silenziatore e il terminale di scarico.",
    steps: [
      "Posizionare il collettore di scarico e fissarlo al motore.",
      "Collegare il tubo di scarico al silenziatore.",
      "Allineare il terminale e montare i supporti elastici.",
      "Controllare l'assenza di perdite e vibrazioni dopo l'installazione.",
    ],
  },
];

const resultsElement = document.getElementById("results");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const renderResults = (items) => {
  if (!items.length) {
    resultsElement.innerHTML = `
      <p class="empty-state">Nessuna istruzione trovata. Prova un'altra marca, modello o parte.</p>
    `;
    return;
  }

  resultsElement.innerHTML = items
    .map(
      (item) => `
      <article class="card">
        <h2>${item.brand} ${item.model}</h2>
        <p class="meta">${item.title}</p>
        <p>${item.description}</p>
        <ul>
          ${item.steps.map((step) => `<li>${step}</li>`).join("")}
        </ul>
      </article>
    `
    )
    .join("");
};

const searchInstructions = (query) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    renderResults([]);
    return;
  }

  const matches = instructions.filter((item) => {
    return [item.brand, item.model, item.title, item.description]
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });

  renderResults(matches);
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchInstructions(searchInput.value);
});

searchInput.addEventListener("input", () => {
  if (!searchInput.value.trim()) {
    resultsElement.innerHTML = `
      <p class="empty-state">Inserisci un termine di ricerca per visualizzare le istruzioni.</p>
    `;
  }
});
