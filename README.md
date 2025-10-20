# Books App 📚

A Node.js/TypeScript REST API for managing a personal book collection with user authentication and book tracking.

## Features

- 🔐 **User Authentication** - JWT-based signup/signin with secure password hashing
- 📚 **Book Management** - Search and update books with author information  
- 👥 **User Profiles** - View user profiles and their book collections
- 🔗 **Book Tracking** - Add/remove books from personal collections
- 🔍 **Advanced Search** - Search books by title or author name
- 🧪 **Well Tested** - 50%+ test coverage with unit tests for all layers

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Koa.js with Router
- **Database**: PostgreSQL with Knex.js query builder
- **Authentication**: JWT + bcrypt
- **Validation**: Zod schemas
- **Testing**: Jest with comprehensive mocking
- **DevOps**: Docker Compose for local development

## Quick Start

### 1. Prerequisites
```bash
node >= 18
npm >= 9
docker & docker-compose
```

### 2. Setup
```bash
# Clone and install dependencies
git clone <repo>
cd books-app
npm install

# Setup environment
cp .env.example .env
# Edit .env if needed (default values work for local dev)

# Start database
npm run db:up

# Run migrations and seeds
npm run migrate:latest
npm run seed:run
```

### 3. Development
```bash
# Start dev server (auto-reload)
npm run dev

# Run tests
npm test
npm run test:coverage
npm run test:watch

# Database management
npm run db:logs    # View database logs
npm run db:reset   # Reset database (data loss!)
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication
```
POST /signup      - Create new user account
POST /signin      - Login user (returns JWT)
PUT  /change-password  - Change password (auth required)
```

### Books
```
GET  /books/search?title=...&authorName=...  - Search books
PUT  /books/:id   - Update book information
```

### Users
```
GET  /users       - List all users
GET  /users/search?authorName=...&bookTitle=...  - Search users by books
GET  /users/:id   - Get user profile
GET  /users/:id/books  - Get user's book collection
```

### Personal Collection (Authentication Required)
```
GET    /me         - Get my profile
GET    /me/books   - Get my book collection
POST   /me/books/add    - Add book to my collection
DELETE /me/books/:bookId/remove  - Remove book from collection
```

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

## Database Schema

**Users**: id, username, password, first_name, last_name, birth_date  
**Authors**: id, name, birth_year, death_year  
**Books**: id, title, author_id  
**UserBooks**: id, user_id, book_id, acquired_at  

## Project Structure

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── repository/      # Data access layer
├── middleware/      # Auth middleware
├── models/          # Zod schemas & types
├── utils/           # Helper functions
├── migrations/      # Database migrations
├── seeds/           # Sample data
└── __tests__/       # Unit tests (mirrors src/)
```

## Testing

- **52 tests** across all layers
- **50.7% overall coverage**
- Focused on business logic, controllers, and auth
- Run with `npm test` or `npm run test:coverage`

## Development Notes

- Uses dependency injection pattern for testability
- Repository pattern for clean data access
- JWT tokens expire in 7 days
- Passwords hashed with bcrypt (10 rounds)
- Comprehensive input validation with Zod
- Error handling with consistent response format

## Environment Variables

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=books_app
DB_USER=postgres
DB_PASSWORD=password
DATABASE_URL=postgresql://postgres:password@localhost:5432/books_app
JWT_SECRET=your-secret-key-here
```

## Scripts Reference

```bash
npm run dev          # Start development server
npm test             # Run all tests
npm run test:coverage  # Test coverage report
npm run db:up        # Start PostgreSQL container
npm run db:down      # Stop database
npm run db:reset     # Reset database (⚠️ data loss)
npm run migrate:latest  # Run database migrations
npm run seed:run     # Insert sample data
```

---

Built with ❤️ using Node.js, TypeScript, and PostgreSQL