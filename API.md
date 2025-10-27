# API Documentation

## Base URL

```
http://localhost:3000
```

## Endpoints

### 1. Generate Quote

Generate a motivational quote based on category.

**Endpoint:** `POST /generate`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "category": "success"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| category | string | No | "general" | Quote category |

**Available Categories:**
- `general` - General motivational quotes
- `success` - Success and achievement focused
- `courage` - Courage and bravery
- `happiness` - Happiness and joy
- `wisdom` - Wisdom and learning
- `perseverance` - Persistence and determination
- `hope` - Hope and optimism

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "quote": "The only way to do great work is to love what you do. — Steve Jobs"
}
```

**Error Responses:**

**Status Code:** `401 Unauthorized`

```json
{
  "error": "Invalid API key. Please check your GEMINI_API_KEY.",
  "details": "[detailed error message in development mode]"
}
```

**Status Code:** `429 Too Many Requests`

```json
{
  "error": "API quota exceeded. Please try again later.",
  "details": "[detailed error message in development mode]"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Generated quote is empty",
  "details": "The API returned an empty response"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"category": "success"}'
```

**JavaScript Example:**
```javascript
fetch('http://localhost:3000/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    category: 'success'
  })
})
  .then(response => response.json())
  .then(data => console.log(data.quote))
  .catch(error => console.error('Error:', error));
```

---

### 2. Health Check

Check server status and availability.

**Endpoint:** `GET /health`

**Request:** No body required

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "status": "ok",
  "service": "Motivational Quotes Generator",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**cURL Example:**
```bash
curl http://localhost:3000/health
```

**JavaScript Example:**
```javascript
fetch('http://localhost:3000/health')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## Request Timeout

The client implements a 30-second timeout for all requests. If a request exceeds this time, a timeout error will be returned.

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 401 | Unauthorized | Invalid or missing API key |
| 429 | Too Many Requests | API rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |

## Rate Limiting

Currently, there are no server-side rate limits implemented. However, the Google Gemini API has its own rate limits that apply. Client-side request throttling prevents multiple simultaneous requests.

## Request Logging

All requests are logged to the console with:
- Timestamp (ISO format)
- HTTP Method
- Request Path
- Status Code
- Duration in milliseconds

Example log output:
```
[2024-01-20T10:30:00.000Z] POST /generate - 200 - 1234ms
```

## Security Headers

The API implements Helmet.js for security headers:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- And more...

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all origins. This allows the frontend to communicate with the backend from any domain.

## API Authentication

Authentication is handled via the Google Gemini API key stored in environment variables (`GEMINI_API_KEY`). The server validates the API key on startup and returns appropriate errors if the key is invalid or missing.

## Development Mode

When `NODE_ENV=development`, the API returns detailed error messages in responses. In production, only user-friendly messages are returned.

Set environment variable:
```bash
export NODE_ENV=development
```

Or in `.env` file:
```
NODE_ENV=development
```

## Testing the API

### Using Postman

1. Import the following as a POST request:
   - URL: `http://localhost:3000/generate`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body (JSON):
   ```json
   {
     "category": "success"
   }
   ```

### Using Thunder Client (VS Code)

1. Create new request
2. Set method to POST
3. URL: `http://localhost:3000/generate`
4. Add header: `Content-Type: application/json`
5. Body: Select "JSON" and add:
   ```json
   {
     "category": "success"
   }
   ```

### Health Check

Test the health endpoint to verify the server is running:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "Motivational Quotes Generator",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```
