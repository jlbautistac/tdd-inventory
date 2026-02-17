# tdd-inventory
Test Drive Development (TDD) Inventory Practice

## Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **dotenv** - Environment variables management
- **Jest** - Testing framework

---

## Fork and Install

### 1) Fork the repository on GitHub
1. Open this repository in your browser.
2. Click **Fork** (top-right).
3. Choose your account (or organization) as destination.

### 2) Clone your fork

Use one of the following options:

- HTTPS

```bash
git clone https://github.com/<your-username>/tdd-inventory.git
```

- SSH

```bash
git clone git@github.com:<your-username>/tdd-inventory.git
```

### 3) Enter the project folder

```bash
cd tdd-inventory
```

### 4) Install dependencies

```bash
npm install
```

### 5) Configure PostgreSQL Database

#### 5.1) Create the database

Make sure PostgreSQL is installed and running on your system. Then create a database:

```bash
psql -U postgres
CREATE DATABASE tdd_inventory;
\q
```

#### 5.2) Configure environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tdd_inventory
DB_USER=postgres
DB_PASSWORD=your_password
```

#### 5.3) Initialize the database schema

Run the initialization script to create the required tables:

```bash
npm run init-db
```

**Note:** The init script will automatically create the database if it doesn't exist, so you can skip step 5.1 if you prefer.

---

## Database Configuration

### Connection Pool

The application uses a PostgreSQL connection pool (`pg` library) to efficiently manage database connections. The pool configuration is located in [src/config/database.js](src/config/database.js).

**Features:**
- Automatically handles connection creation and reuse
- Manages connection limits
- Handles reconnection on errors
- Cleans up idle connections

### Environment Variables

The database connection requires the following environment variables (defined in `.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | tdd_inventory |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |

### Database Schema

**Table: `ubications`**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | SERIAL | PRIMARY KEY |
| `code` | VARCHAR(50) | UNIQUE NOT NULL |
| `name` | VARCHAR(255) | NOT NULL |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Database Scripts

Available npm scripts for database management:

```bash
# Initialize database and create tables
npm run init-db

# Clean database (drop and recreate tables)
npm run clean-db
```

### Usage in Code

```javascript
const pool = require('./config/database');

// Execute a query
const result = await pool.query('SELECT * FROM ubications');

// Execute with parameters
const result = await pool.query('SELECT * FROM ubications WHERE code = $1', ['A-1-1']);
```

### Error Handling

The database module logs connection events:
- **On successful connection**: "Connected to PostgreSQL database"
- **On error**: Logs error details and exits the process

---

### 6) Run tests

```bash
npm test
```

### 7) Start the server

```bash
npm start
```

The server will run at `http://localhost:3000`

## Optional: add upstream remote

If you want to keep your fork updated with the original repository:

```bash
git remote add upstream https://github.com/<original-owner>/tdd-inventory.git
git fetch upstream
git checkout main
git merge upstream/main
```

---

## About Express Framework

This project uses **Express.js**, a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications.

### Why Express?

Express helps us expose the API endpoints by:

- **Routing** - Simplifies the creation of HTTP routes (GET, POST, PUT, DELETE) with clean and intuitive syntax
- **Middleware** - Handles request parsing (JSON, URL-encoded), authentication, logging, and error handling
- **HTTP Utilities** - Provides easy access to request parameters, body, headers, and response methods
- **Server Management** - Manages the HTTP server lifecycle and handles incoming requests efficiently
- **Scalability** - Allows modular organization of routes and business logic

In this project, Express serves as the HTTP layer that:
1. Listens for incoming HTTP requests on port 3000
2. Routes requests to the appropriate handlers (ubication routes)
3. Parses JSON request bodies automatically
4. Formats and sends HTTP responses with proper status codes
5. Handles errors gracefully with custom error middleware

The Express server ([src/server.js](src/server.js)) integrates with our service layer, allowing external clients to interact with the Ubication inventory through standard REST API endpoints.

---

## API REST Endpoints

### Available Endpoints

#### 1. Health Check
**GET** `/health`

Verifica que el servidor esté funcionando.

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

#### 2. API Information
**GET** `/`

Obtiene información sobre los endpoints disponibles.

```bash
curl http://localhost:3000/
```

---

#### 3. Create Ubication
**POST** `/api/ubications`

Crea una nueva ubicación en el inventario.

**Body:**
```json
{
  "code": "A-1-1",
  "name": "Main Warehouse"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/ubications \
  -H "Content-Type: application/json" \
  -d '{"code":"A-1-1","name":"Main Warehouse"}'
```

**Responses:**
- **201 Created** - Ubicación creada exitosamente
  ```json
  {
    "code": "A-1-1",
    "name": "Main Warehouse"
  }
  ```

- **400 Bad Request** - Campos faltantes
  ```json
  {
    "error": "Code/Name are required"
  }
  ```

- **409 Conflict** - Código duplicado
  ```json
  {
    "error": "Ubication code already exists"
  }
  ```

---

#### 4. Get All Ubications
**GET** `/api/ubications`

Obtiene la lista completa de ubicaciones.

**Example:**
```bash
curl http://localhost:3000/api/ubications
```

**Response (200 OK):**
```json
[
  {
    "code": "A-1-1",
    "name": "Main Warehouse"
  },
  {
    "code": "B-2-3",
    "name": "Secondary Warehouse"
  }
]
```

---

#### 5. Get Ubication by Code
**GET** `/api/ubications/:code`

Obtiene una ubicación específica por su código.

**Example:**
```bash
curl http://localhost:3000/api/ubications/A-1-1
```

**Responses:**
- **200 OK** - Ubicación encontrada
  ```json
  {
    "code": "A-1-1",
    "name": "Main Warehouse"
  }
  ```

- **404 Not Found** - Ubicación no existe
  ```json
  {
    "error": "Ubication not found"
  }
  ```

- **400 Bad Request** - Código no proporcionado
  ```json
  {
    "error": "Code parameter is required"
  }
  ```

---

### Usage Examples

#### Complete workflow:

```bash
# 1. Create ubications
curl -X POST http://localhost:3000/api/ubications \
  -H "Content-Type: application/json" \
  -d '{"code":"A-1-1","name":"Main Warehouse"}'

curl -X POST http://localhost:3000/api/ubications \
  -H "Content-Type: application/json" \
  -d '{"code":"B-2-3","name":"Secondary Warehouse"}'

curl -X POST http://localhost:3000/api/ubications \
  -H "Content-Type: application/json" \
  -d '{"code":"C-3-5","name":"Storage Room"}'

# 2. List all ubications
curl http://localhost:3000/api/ubications

# 3. Get specific ubication
curl http://localhost:3000/api/ubications/A-1-1

# 4. Try to create duplicate ubication (error 409)
curl -X POST http://localhost:3000/api/ubications \
  -H "Content-Type: application/json" \
  -d '{"code":"A-1-1","name":"Duplicate Warehouse"}'
```

---

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful operation (GET) |
| 201 | Created | Resource created successfully (POST) |
| 400 | Bad Request | Invalid or missing data |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Conflict (e.g., duplicate code) |
| 500 | Internal Server Error | Server error |

---

## Project Structure

```
tdd-inventory/
├── src/
│   ├── ubication.js                    # Domain model
│   ├── config/
│   │   └── database.js                 # PostgreSQL connection pool
│   ├── api/
│   │   ├── ubication.api.js            # API layer
│   │   └── routes/
│   │       └── ubication.routes.js     # Express routes
│   ├── services/
│   │   ├── ubication.service.js        # Business logic
│   │   └── database/
│   │       ├── initDatabase.js         # Database initialization script
│   │       └── cleanDatabase.js        # Database cleanup script
│   └── server.js                       # Express server
├── tests/
│   ├── ubication.test.js               # Domain tests
│   ├── ubication.service.test.js       # Service tests
│   ├── ubication.api.test.js           # API tests
│   └── helpers/
│       └── testHelper.js               # Test utilities
├── .env                                # Environment variables (not in repo)
├── .env.example                        # Environment variables template
├── package.json
└── README.md
```

---

## Testing

The project includes comprehensive tests following TDD methodology:

- **Domain Tests** ([tests/ubication.test.js](tests/ubication.test.js)) - Ubication model validation
- **Service Tests** ([tests/ubication.service.test.js](tests/ubication.service.test.js)) - Business logic and PostgreSQL integration
- **API Tests** ([tests/ubication.api.test.js](tests/ubication.api.test.js)) - REST API endpoints behavior

### Test Helpers

The test suite includes helper utilities ([tests/helpers/testHelper.js](tests/helpers/testHelper.js)) for:
- Database cleanup between tests
- Connection pool management
- Test isolation

Run all tests:
```bash
npm test
```

Run tests with verbose output:
```bash
npm test -- --verbose
```

Total test suite: **17 tests** covering all layers (Domain, Service, API)
