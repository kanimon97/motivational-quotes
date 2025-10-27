# Architecture Documentation

## System Architecture Overview

The Motivational Quotes Generator is a client-server web application that leverages AI to generate contextual motivational quotes.

```
┌─────────────────┐
│   Web Browser   │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST API
         │
         ▼
┌─────────────────┐
│  Express Server │
│    (Backend)    │
└────────┬────────┘
         │ API Call
         │
         ▼
┌─────────────────┐
│  Google Gemini  │
│      API        │
└─────────────────┘
```

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Files:** `index.html`, `style.css`, `script.js`

**Responsibilities:**
- User interface rendering
- User interaction handling
- API request management
- State management (loading, error, success states)
- Visual feedback (animations, loading spinners)

**Key Components:**
- **HTML Structure** (`index.html`): Semantic markup for UI elements
- **Styling** (`style.css`): Visual design, animations, responsive layouts
- **Logic** (`script.js`): Business logic, event handling, API calls

### 2. Application Layer (Backend)

**File:** `server.js`

**Responsibilities:**
- HTTP request handling
- API routing
- Request validation
- Error handling
- Logging and monitoring
- Security headers

**Key Components:**
- **Express Server**: HTTP request handling
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Request Logging**: Performance monitoring

### 3. Integration Layer

**Responsibilities:**
- External API communication
- Data transformation
- Error handling for external services

**Integration:**
- **Google Gemini API**: AI quote generation

### 4. Data Layer

**Current:** Stateless (no database)

**Future Enhancements:**
- Database storage for quote history
- User authentication
- Caching layer

## Technology Stack

### Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5 | Structure | Latest |
| CSS3 | Styling & Animations | Latest |
| JavaScript ES6+ | Logic | Latest |

### Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ |
| Express.js | Web Framework | ^5.1.0 |
| dotenv | Configuration | ^17.2.3 |
| CORS | Cross-origin | ^2.8.5 |
| Helmet | Security | ^8.1.0 |

### AI Integration

| Technology | Purpose | Version |
|------------|---------|---------|
| Google Generative AI | Quote Generation | ^0.21.0 |
| Gemini Flash | Model | Latest |

## Data Flow

### Quote Generation Flow

```
1. User Action
   ↓
2. Frontend sends POST request to /generate
   ↓
3. Express server receives request
   ↓
4. Server validates category parameter
   ↓
5. Server constructs category-specific prompt
   ↓
6. Server calls Google Gemini API
   ↓
7. Gemini API processes request
   ↓
8. Server receives quote from Gemini
   ↓
9. Server validates quote response
   ↓
10. Server returns JSON response to frontend
   ↓
11. Frontend displays quote to user
```

### Error Handling Flow

```
Error Occurs
   ↓
Server catches error
   ↓
Server logs error details
   ↓
Server formats error response
   ↓
Server sends error to frontend
   ↓
Frontend displays user-friendly error message
```

## Security Architecture

### Client-Side Security

- No sensitive data stored
- API key never exposed to client
- Input sanitization for category selection
- XSS prevention (Helmet.js)
- HTTPS recommended for production

### Server-Side Security

- **Helmet.js**: Security headers
- **Environment Variables**: API key protection
- **Input Validation**: Category parameter validation
- **Error Sanitization**: No sensitive data in error messages
- **Rate Limiting**: Client-side request throttling

### Security Headers (via Helmet)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: ...
```

## Scalability Considerations

### Current State

- Stateless architecture
- No database dependency
- Single-threaded Node.js
- Suitable for low-to-medium traffic

### Future Enhancements

- **Horizontal Scaling**: Load balancer with multiple instances
- **Database**: MongoDB or PostgreSQL for quote storage
- **Caching**: Redis for frequently accessed quotes
- **CDN**: Static asset delivery
- **Rate Limiting**: Server-side rate limiting
- **Monitoring**: Application performance monitoring (APM)

## Deployment Architecture

### Development Environment

```
User Browser → Localhost:3000 (Express) → Google Gemini API
```

### Production Environment (Recommended)

```
User Browser → CDN (Static Files) → Load Balancer → Express Cluster → Google Gemini API
                              ↓
                         Redis Cache
                              ↓
                         Database
```

## Component Interactions

### Frontend Components

```
index.html
├── Category Selector → script.js (get category)
└── Generate Button → script.js (generateQuote())
     ↓
script.js
├── Fetch API → POST /generate
├── Toggle Spinner
├── Handle Response
└── Display Quote
```

### Backend Components

```
server.js
├── Express App
├── Middleware (helmet, cors, json)
├── Request Logger
├── /generate Endpoint
│   ├── Validate category
│   ├── Select prompt
│   ├── Call Gemini API
│   └── Return response
└── /health Endpoint
```

## Request-Response Cycle

### POST /generate

**Request:**
```http
POST /generate HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "category": "success"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "quote": "The only way to do great work is to love what you do. — Steve Jobs"
}
```

## Logging and Monitoring

### Request Logging

Every request is logged with:
- Timestamp
- Method
- Path
- Status Code
- Duration

Example:
```
[2024-01-20T10:30:00.000Z] POST /generate - 200 - 1234ms
```

### Error Logging

Errors are logged with:
- Error message
- Stack trace
- Request details

### Health Monitoring

Health endpoint available at `/health` for:
- Uptime monitoring
- Load balancer health checks
- Service availability verification

## Environment Configuration

### Development

```env
GEMINI_API_KEY=your_dev_key_here
NODE_ENV=development
PORT=3000
```

### Production

```env
GEMINI_API_KEY=your_prod_key_here
NODE_ENV=production
PORT=3000
```

## Dependencies Graph

```
motivational-quotes
├── express (web framework)
├── cors (cross-origin)
├── dotenv (environment)
├── helmet (security)
└── @google/generative-ai (AI integration)
```

## File Structure and Responsibilities

```
project/
├── index.html          # UI structure
├── style.css           # Visual design
├── script.js           # Frontend logic
├── server.js           # Backend API
├── package.json        # Dependencies
├── .env               # Configuration (not in git)
├── README.md          # User documentation
├── REQUIREMENTS.md    # Requirements spec
├── TRACEABILITY.md    # Requirements mapping
├── API.md            # API documentation
└── ARCHITECTURE.md   # This file
```

## Future Architecture Enhancements

1. **Database Layer**: Add MongoDB/PostgreSQL
2. **Authentication**: JWT-based auth
3. **Caching Layer**: Redis for quote caching
4. **Queue System**: Bull or Agenda for async processing
5. **Microservices**: Separate quote generation service
6. **Monitoring**: Prometheus/Grafana integration
7. **Logging**: Winston or Pino for structured logging
