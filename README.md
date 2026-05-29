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
- ✅ Frontend HTML/JS con gestione token e autenticazione

---

## 🗄️ Schema del Database

```
todolists
├── id (PK)
├── name (obbligatorio)
├── description (opzionale)
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

### Liste (protette)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/todolists` | Lista tutte le liste |
| POST | `/api/todolists` | Crea una lista |
| GET | `/api/todolists/{id}` | Mostra una lista con i suoi task |
| PUT | `/api/todolists/{id}` | Aggiorna una lista |
| DELETE | `/api/todolists/{id}` | Elimina una lista (cascade) |
| GET | `/api/todolists/{id}/items` | Task di una lista specifica |

### Task (protette)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/items` | Lista tutti i task |
| POST | `/api/items` | Crea un task |
| GET | `/api/items/{id}` | Mostra un task |
| PUT | `/api/items/{id}` | Aggiorna un task (testo o stato) |
| DELETE | `/api/items/{id}` | Elimina un task |

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
docker compose up

# 4. Esegui le migration
docker compose exec app php artisan migrate
```

### Accesso

- **API**: http://localhost:8000/api
- **Frontend**: apri `frontend/index.html` nel browser
- **PHPMyAdmin**: http://localhost:8080

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

## 🔄 Da Node.js a Laravel

Questo progetto è una riscrittura di [todo-list-app](https://github.com/Barbagallo2296/todo-list-app) (Node.js + Express + SQLite).

| | Versione Node.js | Versione Laravel |
|-|-----------------|-----------------|
| Linguaggio | JavaScript | PHP |
| Framework | Express | Laravel 13 |
| Database | SQLite | MySQL 8 |
| ORM | Nessuno (SQL puro) | Eloquent |
| Validazione | Manuale | Integrata |
| Autenticazione | Nessuna | Sanctum |
| Ambiente | Nativo | Docker |

---

## 👤 Autore

**Manuel Barbagallo**
- GitHub: [@Barbagallo2296](https://github.com/Barbagallo2296)
- Corso: Full Stack Developer — ITS Prodigi Pisa
