# 📝 Laravel TodoList API

Backend API REST per una Todo List, sviluppato con **Laravel 13**, **MySQL** e **Docker**.

Questo progetto è una riscrittura della mia precedente [Todo List in Node.js](https://github.com/Barbagallo2296/todo-list-app), realizzata per imparare l'**architettura MVC**, **Eloquent ORM** e le best practice di **Laravel**.

---

## 🚀 Stack Tecnologico

| Layer | Tecnologia |
|-------|-----------|
| Backend | Laravel 13 (PHP) |
| Database | MySQL 8.0 |
| ORM | Eloquent |
| Autenticazione | Laravel Sanctum |
| Ambiente | Docker + Docker Compose |
| Client DB | PHPMyAdmin |

---

## 📦 Funzionalità

- ✅ CRUD completo per **Liste** e **Task**
- ✅ Relazione One-to-Many (una lista ha molti task)
- ✅ Validazione degli input su tutti gli endpoint
- ✅ API REST con risposte JSON
- ✅ Autenticazione API con **Laravel Sanctum** (register, login, logout)
- ✅ Route protette da token Bearer
- ✅ Migration del database
- ✅ Route Model Binding
- ✅ Cascade delete (eliminando una lista si eliminano i suoi task)
- ✅ **Isolamento dei dati per utente** (ogni utente vede e gestisce solo le proprie liste e task)
- ✅ **Sessione persistente nel frontend** tramite `localStorage` (il Bearer Token viene salvato e riutilizzato tra le sessioni)
- ✅ Frontend HTML/JS con gestione token e autenticazione

---

## 🗄️ Schema del Database

```
users
├── id (PK)
├── name
├── email (unique)
├── password
├── created_at
└── updated_at

todolists
├── id (PK)
├── name (obbligatorio)
├── description (opzionale)
├── user_id (FK → users.id)
├── created_at
└── updated_at

items
├── id (PK)
├── name (obbligatorio)
├── stato (Todo | Done)
├── list_id (FK → todolists.id)
├── created_at
└── updated_at
```

---

## 🔗 Endpoint API

### Autenticazione (pubbliche)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/register` | Registra un nuovo utente |
| POST | `/api/login` | Login e generazione token |

### Autenticazione (protette)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/me` | Dati utente autenticato |
| POST | `/api/logout` | Logout e invalidazione token |

### Liste (protette — filtrate per utente autenticato)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/todolists` | Restituisce solo le liste dell'utente autenticato |
| POST | `/api/todolists` | Crea una lista associata all'utente autenticato |
| GET | `/api/todolists/{id}` | Mostra una lista (solo se appartiene all'utente) con i suoi task |
| PUT | `/api/todolists/{id}` | Aggiorna una lista (solo se appartiene all'utente) |
| DELETE | `/api/todolists/{id}` | Elimina una lista (cascade, solo se appartiene all'utente) |
| GET | `/api/todolists/{id}/items` | Task di una lista specifica (solo se appartiene all'utente) |

### Task (protette)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/items` | Lista tutti i task dell'utente autenticato |
| POST | `/api/items` | Crea un task |
| GET | `/api/items/{id}` | Mostra un task |
| PUT | `/api/items/{id}` | Aggiorna un task (testo o stato) |
| DELETE | `/api/items/{id}` | Elimina un task |

Tutte le route protette richiedono l'header `Authorization: Bearer {token}`.

---

## ⚙️ Installazione

### Requisiti

- Docker
- Docker Compose

### Avvio

```bash
# 1. Clona la repository
git clone https://github.com/Barbagallo2296/laravel-todolist-api.git
cd laravel-todolist-api

# 2. Configura l'ambiente
cp app/.env.example app/.env

# 3. Avvia i container
docker compose up -d

# 4. Genera la chiave dell'applicazione
docker compose exec app php artisan key:generate

# 5. Esegui le migration
docker compose exec app php artisan migrate
```

Il file `.env.example` contiene già i valori corretti per il setup Docker incluso in questo repo (MySQL su host `db`, database `laravel`, utente `laravel`) — non serve modificarlo per l'avvio standard.

### Accesso

- **API**: http://localhost:8000/api
- **Frontend**: apri `frontend/index.html` — meglio con un server locale (es. estensione **Live Server** di VS Code) piuttosto che con doppio click diretto, per evitare problemi di CORS
- **PHPMyAdmin**: http://localhost:8080

---

## 🪟 Setup su Windows (WSL2 consigliato)

Docker Desktop su Windows funziona, ma se tieni il progetto su un percorso Windows classico (`C:\Users\...`) le richieste API possono diventare **molto lente** — comandi che dovrebbero girare in pochi millisecondi possono impiegare 3-4 secondi, e con più richieste in coda si arriva anche a 20-30 secondi. La causa è l'overhead del filesystem quando Docker (che sotto usa un motore Linux) deve leggere file che stanno fisicamente su NTFS.

**Soluzione: sposta il progetto dentro WSL2**

1. Installa Ubuntu su WSL2 (da PowerShell):
   ```powershell
   wsl --install -d Ubuntu
   ```
   Riavvia se richiesto, poi crea utente e password Linux al primo avvio.

2. In Docker Desktop vai su **Settings → Resources → WSL Integration**, attiva il toggle per Ubuntu, poi **Apply & Restart**.

3. Apri il terminale Ubuntu e clona il progetto **dentro il filesystem Linux** (non su `/mnt/c/...`):
   ```bash
   cd ~
   git clone https://github.com/Barbagallo2296/laravel-todolist-api.git
   ```

4. Se `docker` dà errore di permessi (`permission denied ... docker.sock`):
   ```bash
   sudo usermod -aG docker $USER
   ```
   poi da PowerShell `wsl --shutdown` e riapri il terminale Ubuntu.

5. Prosegui con i normali comandi di avvio (`.env`, `docker compose up -d`, `key:generate`, `migrate`).

6. (Facoltativo) Apri il progetto in VS Code direttamente da Ubuntu per lavorare sui file nativamente:
   ```bash
   code .
   ```

Con questo setup si passa da 3-4 secondi a circa **200ms** per le stesse operazioni.

---

## 🛠️ Troubleshooting

**L'app è lentissima / le richieste impiegano diversi secondi**
Problema di filesystem su Windows: sposta il progetto dentro WSL2 (vedi sezione sopra).

**`permission denied` connettendosi a Docker dentro WSL2**
```bash
sudo usermod -aG docker $USER
wsl --shutdown   # da PowerShell, poi riapri il terminale Ubuntu
```

**Conflitto di porta 3306 (MySQL) all'avvio dei container**
Probabilmente hai un servizio MySQL locale già in ascolto su quella porta (es. XAMPP). Fermalo, oppure cambia il mapping nel `docker-compose.yml` (es. `"3307:3306"`) — non serve modificare `DB_HOST`/`DB_PORT` nel `.env`, perché i container comunicano tra loro internamente sulla rete Docker.

---

## 📁 Struttura del Progetto

```
laravel-todolist-api/
├── app/                          # Applicazione Laravel
│   ├── app/
│   │   ├── Http/Controllers/     # Controller API
│   │   └── Models/               # Model Eloquent
│   ├── database/migrations/      # Migration del database
│   ├── routes/api.php            # Route API
│   └── .env.example              # Template configurazione
├── frontend/                     # Frontend HTML/JS
│   ├── index.html
│   ├── main.js
│   ├── api.js
│   └── css/
└── docker-compose.yml            # Configurazione Docker
```

---

## 👤 Autore

**Manuel Barbagallo**
- GitHub: [@Barbagallo2296](https://github.com/Barbagallo2296)
- Corso: Full Stack Developer — ITS Prodigi Pisa