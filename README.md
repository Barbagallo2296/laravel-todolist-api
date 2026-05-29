# TodoList Laravel API

API REST sviluppata con Laravel per la gestione di liste e attività (todo items).  
Progetto realizzato come esercitazione scolastica presso ITS Prodigi Pisa.

## Tecnologie

- PHP 8.3
- Laravel 13
- MySQL
- Docker

## Installazione

```bash
git clone https://github.com/Barbagallo2296/laravel-todolist-api.git
cd laravel-todolist-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Endpoints

### Todolists

| Metodo | URL | Descrizione |
|--------|-----|-------------|
| GET | /api/todolists | Lista tutte le todolist |
| POST | /api/todolists | Crea una nuova todolist |
| GET | /api/todolists/{id} | Dettaglio todolist con i suoi item |
| PUT | /api/todolists/{id} | Aggiorna una todolist |
| DELETE | /api/todolists/{id} | Elimina una todolist |
| GET | /api/todolists/{id}/items | Lista gli item di una todolist |

### Items

| Metodo | URL | Descrizione |
|--------|-----|-------------|
| GET | /api/items | Lista tutti gli item |
| POST | /api/items | Crea un nuovo item |
| GET | /api/items/{id} | Dettaglio item con la sua todolist |
| PUT | /api/items/{id} | Aggiorna un item |
| DELETE | /api/items/{id} | Elimina un item |