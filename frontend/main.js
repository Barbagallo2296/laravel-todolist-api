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
    // Se c'è un token, recuperiamo i dati dell'utente per sicurezza
    apiRequest(host + "/me", "GET", {})
      .then(user => {
        userInfo.innerText = "Utente: " + user.name;
        authSection.style.display = 'none';
        userSection.style.display = 'block';
        appContent.style.display = 'block'; // Mostra l'applicazione originale
        loadLists(); // Carica subito le liste dell'utente loggato
      })
      .catch(() => {
        // Se il token è scaduto o non valido, ripulisci ed esci
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
        localStorage.setItem('token', data.token); // Salva il token nel browser
        checkAuth(); // Aggiorna l'interfaccia
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
    .then(() => {
      logoutLocal();
    })
    .catch(() => {
      // Se il server dà errore, facciamo comunque il logout locale per non bloccarsi
      logoutLocal();
    });
});

// Svuota i dati locali e torna alla schermata di login
function logoutLocal() {
  localStorage.removeItem('token');
  getListsResult.innerHTML = "";
  document.getElementById("tasks-container").innerHTML = "";
  selectedListId = null;
  checkAuth();
}

// Avvia il controllo iniziale non appena si apre la pagina
checkAuth();


// Funzione Carica Liste
function loadLists() {
  apiRequest(host + "/todolists", 'GET', {})
    .then(data => {
      getListsResult.innerHTML = "";
      const table = document.createElement("table");
      const headerRow = document.createElement("tr");
      headerRow.innerHTML = "<th>Titolo</th><th>Descrizione</th><th>Azioni</th>";
      table.appendChild(headerRow);

      for (const list of data) {
        const tr = document.createElement("tr");
        tr.className = "trlist";
        const td1 = document.createElement("td");
        td1.innerHTML = list.name;
        tr.appendChild(td1);
        const td2 = document.createElement("td");
        td2.innerHTML = list.description;
        tr.appendChild(td2);
        const tdActions = document.createElement("td");

        // Elimina Lista
        const deleteBtn = document.createElement("text");
        deleteBtn.innerHTML = "❌";
        deleteBtn.classList.add("delete-Btn", "icon");
        deleteBtn.addEventListener("click", () => {
          apiRequest(host + "/todolists/" + list.id, "DELETE", {})
            .then(loadLists);
        });

        // Aggiorna Lista
        const updateBtn = document.createElement("text");
        updateBtn.innerHTML = "✏️";
        updateBtn.classList.add("update-Btn", "icon");
        updateBtn.addEventListener("click", () => {
          const nameInput = document.createElement("input");
          nameInput.value = list.name;
          const descInput = document.createElement("input");
          descInput.value = list.description;
          td1.innerHTML = "";
          td2.innerHTML = "";
          td1.appendChild(nameInput);
          td2.appendChild(descInput);
          const saveBtn = document.createElement("button");
          saveBtn.innerText = "Salva";
          saveBtn.className = "save-Btn"
          saveBtn.addEventListener("click", () => {
            apiRequest(host + "/todolists/" + list.id, "PUT", {
              name: nameInput.value,
              description: descInput.value
            }).then(loadLists);
          });
          tdActions.innerHTML = "";
          tdActions.appendChild(saveBtn);
        });

        // VEDI TASKS
        const viewBtn = document.createElement("text");
        viewBtn.innerHTML = "📋";
        viewBtn.classList.add("view-Btn", "icon");
        viewBtn.addEventListener("click", () => {
          selectedListId = list.id;
          loadItems();
        });
        tdActions.appendChild(viewBtn);
        tdActions.appendChild(updateBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);
        table.appendChild(tr);
      }
      getListsResult.appendChild(table);
    });
}

// LISTE 
getListsButton.addEventListener('click', () => {
  if (getListsResult.innerHTML !== "") {
    getListsResult.innerHTML = "";
    return;
  }
  loadLists();
});


// Crea una nuova lista
const addNewList = document.getElementById('create-list');
const listInput = document.getElementById('list-id');
const descriptionInput = document.getElementById("description-input");
addNewList.addEventListener('click', () => {
  apiRequest(host + "/todolists", "POST", {
    name: listInput.value,
    description: descriptionInput.value
  })
    .then(() => {
      listInput.value = "";
      descriptionInput.value = "";
      loadLists();
    });
});

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

        // Cambia Stato
        const toggleBtn = document.createElement("text");
        toggleBtn.innerText = "✔";
        toggleBtn.classList.add("toggle-Btn", "icon");
        toggleBtn.addEventListener("click", () => {
          apiRequest(host + "/items/" + item.id, "PUT", {
            name: item.name,
            stato: item.stato === "Todo" ? "Done" : "Todo"
          }).then(loadItems);
        });

        // Modifica Tasks
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
          saveBtn.className = "save-Btn"
          saveBtn.addEventListener("click", () => {
            apiRequest(host + "/items/" + item.id, "PUT", {
              name: input.value,
              stato: item.stato
            }).then(loadItems);
          });
          tdActions.innerHTML = "";
          tdActions.appendChild(saveBtn);
        });

        // Elimina Tasks
        const deleteBtn = document.createElement("text");
        deleteBtn.innerText = "❌";
        deleteBtn.classList.add("delete-Btn", "icon");
        deleteBtn.addEventListener("click", () => {
          apiRequest(host + "/items/" + item.id, "DELETE", {})
            .then(loadItems);
        });
        tdActions.appendChild(toggleBtn);
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);
        table.appendChild(tr);
      }
      container.appendChild(table);
    });

}

// Crea una nuova tasks
const addTaskButton = document.getElementById("add-task");
const taskInput = document.getElementById("task-input");
addTaskButton.addEventListener("click", () => {
  if (!selectedListId) {
    alert("Seleziona prima una lista");
    return;
  }
  apiRequest(host + "/items", "POST", {
    name: taskInput.value,
    list_id: selectedListId,
    stato: "Todo"
  })
    .then(() => {
      taskInput.value = "";
      loadItems();
    });
});