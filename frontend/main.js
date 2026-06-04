const host = 'http://localhost:8000/api';

const getListsButton = document.getElementById('get-lists');
const getListsResult = document.getElementById('get-lists-result');

let selectedListId = null;

// Elementi del DOM per l'autenticazione
const authSection = document.getElementById('auth-section');
const appContent = document.getElementById('app-content');
const userSection = document.getElementById('user-section');
const userInfo = document.getElementById('user-info');

// Switch schermate Login / Registrazione
document.getElementById('show-login').addEventListener('click', () => {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('show-login').style.fontWeight = 'bold';
  document.getElementById('show-register').style.fontWeight = 'normal';
});

document.getElementById('show-register').addEventListener('click', () => {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('show-login').style.fontWeight = 'normal';
  document.getElementById('show-register').style.fontWeight = 'bold';
});

// Funzione per controllare lo stato dell'utente all'avvio della pagina
function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    apiRequest(host + "/me", "GET", {})
      .then(user => {
        userInfo.innerText = "Utente: " + user.name;
        authSection.style.display = 'none';
        userSection.style.display = 'block';
        appContent.style.display = 'block';
        loadLists(); // Carica subito le liste in stile Keep
      })
      .catch(() => {
        logoutLocal();
      });
  } else {
    authSection.style.display = 'block';
    userSection.style.display = 'none';
    appContent.style.display = 'none';
  }
}

// Azione di Login
document.getElementById('btn-login').addEventListener('click', () => {
  const emailInput = document.getElementById('login-email').value;
  const passwordInput = document.getElementById('login-password').value;

  apiRequest(host + "/login", "POST", { email: emailInput, password: passwordInput })
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        checkAuth();
      }
    })
    .catch(err => alert("Credenziali errate o errore di connessione"));
});

// Azione di Registrazione
document.getElementById('btn-register').addEventListener('click', () => {
  const nameInput = document.getElementById('register-name').value;
  const emailInput = document.getElementById('register-email').value;
  const passwordInput = document.getElementById('register-password').value;

  apiRequest(host + "/register", "POST", { name: nameInput, email: emailInput, password: passwordInput })
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        checkAuth();
      }
    })
    .catch(err => alert("Errore durante la registrazione"));
});

// Azione di Logout
document.getElementById('btn-logout').addEventListener('click', () => {
  apiRequest(host + "/logout", "POST", {})
    .then(() => { logoutLocal(); })
    .catch(() => { logoutLocal(); });
});

function logoutLocal() {
  localStorage.removeItem('token');
  getListsResult.innerHTML = "";
  document.getElementById("tasks-container").innerHTML = "";
  selectedListId = null;
  checkAuth();
}

checkAuth();

// Genera e inserisce la singola Card nell'interfaccia (Stile Google Keep)
function appendSingleCard(list) {
  const card = document.createElement("div");
  card.className = "keep-card";
  card.dataset.id = list.id;

  // Contenuto testuale della card
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.innerHTML = `
    <h3 class="card-title">${list.name}</h3>
    <p class="card-desc">${list.description || ''}</p>
  `;
  card.appendChild(cardBody);

  // Contenitore per le azioni
  const cardActions = document.createElement("div");
  cardActions.className = "card-actions";

  // Vedi Tasks (📋)
  const viewBtn = document.createElement("span");
  viewBtn.innerHTML = "📋";
  viewBtn.className = "icon view-btn";
  viewBtn.addEventListener("click", () => {
    selectedListId = list.id;
    loadItems();
  });

  // Modifica Lista (✏️)
  const updateBtn = document.createElement("span");
  updateBtn.innerHTML = "✏️";
  updateBtn.className = "icon update-btn";
  updateBtn.addEventListener("click", () => {
    const newName = prompt("Modifica titolo della lista:", list.name);
    const newDesc = prompt("Modifica descrizione della lista:", list.description);
    if (newName) {
      apiRequest(host + "/todolists/" + list.id, "PUT", {
        name: newName,
        description: newDesc
      }).then(loadLists);
    }
  });

  // Elimina Lista (❌)
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "❌";
  deleteBtn.className = "icon delete-btn";
  deleteBtn.addEventListener("click", () => {
    card.remove(); // Rimuove subito l'elemento visivo dallo schermo

    if (selectedListId === list.id) {
      document.getElementById("tasks-container").innerHTML = "";
      selectedListId = null;
    }

    apiRequest(host + "/todolists/" + list.id, "DELETE", {})
      .catch(err => {
        alert("Impossibile eliminare la lista");
        loadLists();
      });
  });

  cardActions.appendChild(viewBtn);
  cardActions.appendChild(updateBtn);
  cardActions.appendChild(deleteBtn);
  card.appendChild(cardActions);

  getListsResult.appendChild(card);
}

// Funzione Carica Tutte le Liste
function loadLists() {
  apiRequest(host + "/todolists", 'GET', {})
    .then(data => {
      getListsResult.innerHTML = ""; // Svuota il contenitore
      for (const list of data) {
        appendSingleCard(list);
      }
    });
}

// Bottone Mostra/Nascondi Liste
getListsButton.addEventListener('click', () => {
  if (getListsResult.innerHTML !== "") {
    getListsResult.innerHTML = "";
    return;
  }
  loadLists();
});

// Crea una nuova lista (Ottimizzazione: Istantanea senza ricaricare tutto)
const addNewList = document.getElementById('create-list');
const listInput = document.getElementById('list-id');
const descriptionInput = document.getElementById("description-input");

addNewList.addEventListener('click', () => {
  const nameVal = listInput.value;
  const descVal = descriptionInput.value;

  if (!nameVal.trim()) {
    alert("Inserisci almeno un titolo per la lista!");
    return;
  }

  // Svuota subito i campi di input nel browser
  listInput.value = "";
  descriptionInput.value = "";

  // Invia al server ed esegui il rendering istantaneo del risultato
  apiRequest(host + "/todolists", "POST", { name: nameVal, description: descVal })
    .then(newList => {
      appendSingleCard(newList); // Appende solo la nuova card senza fare una GET totale
    })
    .catch(err => {
      alert("Errore durante la creazione");
      loadLists();
    });
});

// Funzione helper per appendere un singolo task alla tabella istantaneamente
function appendSingleRow(item, table) {
  const tr = document.createElement("tr");
  tr.classList.add("trlist");
  
  const td1 = document.createElement("td");
  td1.innerText = item.name;
  tr.appendChild(td1);
  
  const td2 = document.createElement("td");
  td2.innerText = item.stato;
  td2.className = item.stato;
  tr.appendChild(td2);
  
  const tdActions = document.createElement("td");

  // Cambia Stato (✔)
  const toggleBtn = document.createElement("text");
  toggleBtn.innerText = "✔";
  toggleBtn.classList.add("toggle-Btn", "icon");
  toggleBtn.addEventListener("click", () => {
    apiRequest(host + "/items/" + item.id, "PUT", {
      name: item.name,
      stato: item.stato === "Todo" ? "Done" : "Todo"
    }).then(loadItems);
  });

  // Modifica Tasks (✏️)
  const editBtn = document.createElement("text");
  editBtn.innerText = "✏️";
  editBtn.classList.add("edit-Btn", "icon");
  editBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.value = item.name;
    td1.innerHTML = "";
    td1.appendChild(input);
    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Salva";
    saveBtn.className = "save-Btn";
    saveBtn.addEventListener("click", () => {
      apiRequest(host + "/items/" + item.id, "PUT", {
        name: input.value,
        stato: item.stato
      }).then(loadItems);
    });
    tdActions.innerHTML = "";
    tdActions.appendChild(saveBtn);
  });

  // Elimina Tasks (❌)
  const deleteBtn = document.createElement("text");
  deleteBtn.innerText = "❌";
  deleteBtn.classList.add("delete-Btn", "icon");
  deleteBtn.addEventListener("click", () => {
    tr.remove(); // Rimuove istantaneamente il task dallo schermo visivo
    apiRequest(host + "/items/" + item.id, "DELETE", {})
      .catch(err => {
        alert("Impossibile eliminare il task");
        loadItems();
      });
  });

  tdActions.appendChild(toggleBtn);
  tdActions.appendChild(editBtn);
  tdActions.appendChild(deleteBtn);
  tr.appendChild(tdActions);
  table.appendChild(tr);
}

// Funzione Carica Tasks
function loadItems() {
  apiRequest(host + "/todolists/" + selectedListId + "/items", "GET", {})
    .then(data => {
      const container = document.getElementById("tasks-container");
      container.innerHTML = "";
      const table = document.createElement("table");
      const header = document.createElement("tr");
      header.innerHTML = "<th>Testo</th><th>Stato</th><th>Azioni</th>";
      table.appendChild(header);

      for (const item of data) {
        appendSingleRow(item, table);
      }
      container.appendChild(table);
    });
}

// Crea una nuova task (Ottimizzata e Istantanea)
const addTaskButton = document.getElementById("add-task");
const taskInput = document.getElementById("task-input");

addTaskButton.addEventListener("click", () => {
  if (!selectedListId) {
    alert("Seleziona prima una lista");
    return;
  }

  const taskVal = taskInput.value;

  if (!taskVal.trim()) {
    alert("Il testo del task non può essere vuoto!");
    return;
  }

  // Svuota subito l'input nel browser per dare massima reattività
  taskInput.value = "";

  // Invia la richiesta POST in background
  apiRequest(host + "/items", "POST", {
    name: taskVal,
    list_id: selectedListId,
    stato: "Todo"
  })
    .then(newItem => {
      const table = document.querySelector("#tasks-container table");
      
      if (table) {
        // Se la tabella è già presente, aggiungiamo direttamente la riga al volo
        appendSingleRow(newItem, table);
      } else {
        // Se la tabella era vuota (primo task), ricostruiamo la struttura
        loadItems();
      }
    })
    .catch(err => {
      alert("Errore durante la creazione del task");
      loadItems();
    });
});