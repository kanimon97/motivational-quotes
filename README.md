# Motivational Quotes Generator

A full-stack web application that generates AI-powered motivational quotes using Google's Gemini AI. Users can select from various categories (Success, Courage, Happiness, Wisdom, Perseverance, Hope) to generate personalized inspirational quotes.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This application provides users with instant access to inspirational and motivational quotes tailored to their preferences. By leveraging Google's Gemini AI, the app generates unique, contextually relevant quotes across different themes, making it perfect for daily motivation, social media sharing, or personal reflection.

## ✨ Features

- **AI-Powered Quotes**: Generate unique motivational quotes using Google Gemini AI
- **Category Selection**: Choose from 7 different themes:
  - General
  - Success
  - Courage
  - Happiness
  - Wisdom
  - Perseverance
  - Hope
- **Copy to Clipboard**: One-click copy functionality for easy sharing
- **Beautiful UI**: Modern gradient design with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during quote generation
- **Security**: Helmet.js integration for enhanced security headers

## 📋 Requirements

### System Requirements
- Node.js 18 or higher
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### API Requirements
- Google Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kanimon97/motivational-quotes.git
   cd motivational-quotes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory with your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Open in browser**
   Open `index.html` in your browser or use a live server extension

## 📖 Usage

### Generating Quotes

1. Open the application in your web browser
2. Select a category from the dropdown (optional - defaults to "General")
3. Click "Generate Quote" button
4. Wait for the AI to generate your quote
5. Copy the quote using the "📋 Copy" button if desired
6. Click "Generate Quote" again for a new quote

### API Usage

```javascript
// Generate a quote
fetch('http://localhost:3000/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ category: 'success' })
})
  .then(res => res.json())
  .then(data => console.log(data.quote));
```

## 🌐 API Documentation

### POST /generate

Generates a motivational quote based on the specified category.

**Request**
```json
{
  "category": "success"
}
```

**Response**
```json
{
  "quote": "The only way to do great work is to love what you do. — Steve Jobs"
}
```

**Categories Available:**
- `general`
- `success`
- `courage`
- `happiness`
- `wisdom`
- `perseverance`
- `hope`

### GET /health

Health check endpoint for monitoring server status.

**Response**
```json
{
  "status": "ok",
  "service": "Motivational Quotes Generator",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

For detailed API documentation, see [API.md](API.md)

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations and gradients
- **JavaScript (ES6+)**: Client-side logic and API interaction

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Google Generative AI**: AI quote generation
- **dotenv**: Environment variable management
- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing

### Development
- **ES Modules**: Modern JavaScript module system

## 📁 Project Structure

```
motivational-quotes/
├── index.html          # Main HTML file
├── style.css           # Styles and animations
├── script.js           # Client-side JavaScript
├── server.js           # Express server and API endpoints
├── package.json        # Dependencies and project metadata
├── .env                # Environment variables (create this)
├── README.md           # This file
├── REQUIREMENTS.md     # Detailed requirements
├── TRACEABILITY.md     # Requirements traceability matrix
├── API.md             # Detailed API documentation
└── ARCHITECTURE.md     # System architecture documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Support

For support, please open an issue in the [GitHub repository](https://github.com/kanimon97/motivational-quotes/issues).

## 🙏 Acknowledgments

- Google Gemini AI for quote generation
- All the inspirational figures whose quotes inspire us daily