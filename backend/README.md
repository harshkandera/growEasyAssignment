# Todo API - Backend

A FastAPI backend for a todo application with user authentication and CRUD operations.

## 🚀 Features

- **User Authentication**: Signup and Login with JWT tokens
- **Password Security**: Passwords hashed with bcrypt
- **Protected Routes**: JWT-based authentication for todo operations
- **User Isolation**: Each user can only access their own todos
- **RESTful API**: Clean API design with proper status codes
- **Auto Documentation**: Interactive API docs at `/docs`

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## 🛠️ Setup Instructions

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)

```bash
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Server

```bash
uvicorn main:app --reload
```

The server will start at **http://localhost:8000**

### 5. Access API Documentation

Open your browser and navigate to:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI app entry point, CORS config
├── database.py          # SQLAlchemy setup and database connection
├── models.py            # User and Todo database models
├── schemas.py           # Pydantic schemas for validation
├── auth.py              # JWT and password utilities
├── requirements.txt     # Python dependencies
└── routers/
    ├── auth.py          # Authentication endpoints
    └── todos.py         # Todo CRUD endpoints
```

## 🗄️ Database Schema

The application uses SQLite with two tables:

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | Primary Key |
| name | String | Not Null |
| email | String | Unique, Indexed, Not Null |
| hashed_password | String | Not Null |
| created_at | DateTime | Default: Now |

### Todos Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | Primary Key |
| title | String | Not Null |
| completed | Boolean | Default: False |
| user_id | Integer | Foreign Key (users.id) |
| created_at | DateTime | Default: Now |

## 🔌 API Endpoints

### Authentication Routes

#### 1. **Signup** - Create New User

**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-12-01T09:30:00"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

---

#### 2. **Login** - Authenticate User

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-12-01T09:30:00"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

---

#### 3. **Get Profile** - Get User Details

**Endpoint**: `GET /api/auth/profile`

**Headers**: 
```
Authorization: Bearer <your_token_here>
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-12-01T09:30:00",
  "todo_count": 3
}
```

**cURL Command**:
```bash
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Todo Routes

> **Note**: All todo routes require authentication. Include the JWT token in the `Authorization` header.

#### 4. **Get All Todos** - List User's Todos

**Endpoint**: `GET /api/todos`

**Headers**: 
```
Authorization: Bearer <your_token_here>
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "created_at": "2025-12-01T10:00:00"
  },
  {
    "id": 2,
    "title": "Finish assignment",
    "completed": true,
    "created_at": "2025-12-01T11:30:00"
  }
]
```

**cURL Command**:
```bash
curl -X GET http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

#### 5. **Create Todo** - Add New Todo

**Endpoint**: `POST /api/todos`

**Headers**: 
```
Authorization: Bearer <your_token_here>
```

**Request Body**:
```json
{
  "title": "Complete project documentation"
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "title": "Complete project documentation",
  "completed": false,
  "created_at": "2025-12-01T12:00:00"
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete project documentation"}'
```

---

#### 6. **Update Todo** - Toggle Completion Status

**Endpoint**: `PATCH /api/todos/{todo_id}`

**Headers**: 
```
Authorization: Bearer <your_token_here>
```

**Request Body**:
```json
{
  "completed": true
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": true,
  "created_at": "2025-12-01T10:00:00"
}
```

**cURL Command**:
```bash
curl -X PATCH http://localhost:8000/api/todos/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

---

#### 7. **Delete Todo** - Remove a Todo

**Endpoint**: `DELETE /api/todos/{todo_id}`

**Headers**: 
```
Authorization: Bearer <your_token_here>
```

**Response** (200 OK):
```json
{
  "message": "Todo deleted"
}
```

**cURL Command**:
```bash
curl -X DELETE http://localhost:8000/api/todos/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔒 Authentication Flow

1. **Signup/Login**: User provides credentials
2. **Server**: Validates credentials and generates JWT token
3. **Client**: Stores token (localStorage/cookies)
4. **Protected Requests**: Client includes token in `Authorization` header
5. **Server**: Validates token and processes request

## ⚠️ Error Responses

The API returns appropriate HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error, duplicate email) |
| 401 | Unauthorized (invalid credentials or token) |
| 404 | Not Found (todo doesn't exist) |
| 500 | Internal Server Error |

**Example Error Response**:
```json
{
  "detail": "Email already registered"
}
```

## 🧪 Testing the API

### Complete Test Flow

```bash
# 1. Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Save the token from the response

# 2. Create a todo
curl -X POST http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test todo"}'

# 3. Get all todos
curl -X GET http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Mark todo as complete (use the todo ID from response)
curl -X PATCH http://localhost:8000/api/todos/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# 5. Get profile
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Delete todo
curl -X DELETE http://localhost:8000/api/todos/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Configuration

### Security Settings (auth.py)

- **SECRET_KEY**: Change this in production! Use environment variables.
- **ALGORITHM**: HS256 (default)
- **TOKEN_EXPIRY**: 7 days

### CORS Settings (main.py)

Currently allows requests from `http://localhost:3000`. Update for production:

```python
allow_origins=["https://your-production-domain.com"]
```

## 📝 Notes

- The SQLite database file (`todos.db`) is created automatically on first run
- All passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- Each user can only access their own todos (enforced by user_id filtering)

## 🐛 Troubleshooting

**Issue**: `ModuleNotFoundError`
- **Solution**: Ensure virtual environment is activated and dependencies are installed

**Issue**: Port 8000 already in use
- **Solution**: Use a different port: `uvicorn main:app --reload --port 8001`

**Issue**: Database errors
- **Solution**: Delete `todos.db` file and restart the server to recreate tables

## 📦 Dependencies

- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation
- **python-jose**: JWT token handling
- **passlib**: Password hashing with bcrypt

## 🎯 Next Steps

Connect this backend to the Next.js frontend to build a complete full-stack application!
