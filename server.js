import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Environment Validation
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY is not set in environment variables");
  console.error("Please create a .env file with: GEMINI_API_KEY=your_api_key");
  process.exit(1);
}

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Category-specific prompts
const categoryPrompts = {
  general: "Generate a general motivational quote with the author name. Format: quote text — Author Name. Do NOT use markdown bold formatting (no ** or __). Make it concise and powerful (maximum 100 words).",
  success: "Generate a motivational quote about success, achievement, and reaching goals with the author name. Format: quote text — Author Name. Do NOT use markdown bold formatting (no ** or __). Make it concise and powerful (maximum 100 words).",
  courage: "Generate a motivational quote about courage, bravery, and overcoming fear with the author name. Format: quote text — Author Name. Do NOT use markdown bold formatting (no ** or __). Make it concise and powerful (maximum 100 words).",
  happiness: "Generate a motivational quote about happiness, joy, and living life to the fullest with the author name. Format: quote text — Author Name. Do NOT use markdown bold formatting (no ** or __). Make it concise and powerful (maximum 100 words).",
  wisdom: "Generate a motivational quote about wisdom, learning, and knowledge with the author name. Format: quote text — Author Name. Do NOT use markdown bold formatting (no ** or __). Make it concise and powerful (maximum 100 words).",
  perseverance: "Generate a motivational quote about perseverance, persistence, and never giving up with the author name. Format: quote text — Author Name. Do NOT use markdown bold formatting (no ** or __). Make it concise and powerful (maximum 100 words).",
  hope: "Generate a motivational quote about hope, optimism, and looking forward to the future with the author name. Format: quote text — Author Name. Do NOT use markdown bold formatting (no ** or __). Make it concise and powerful (maximum 100 words)."
};

app.post("/generate", async (req, res) => {
  try {
    const { category = "general" } = req.body;
    
    // Validate category
    const validCategories = Object.keys(categoryPrompts);
    const selectedCategory = validCategories.includes(category) ? category : "general";
    
    // Get prompt for selected category
    const prompt = categoryPrompts[selectedCategory];
    
    console.log(`Generating quote for category: ${selectedCategory}`);
    
    // Generate content with Gemini AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quote = response.text().trim();

    if (!quote || quote.length === 0) {
      return res.status(500).json({ 
        error: "Generated quote is empty",
        details: "The API returned an empty response"
      });
    }

    res.json({ quote });
  } catch (error) {
    console.error("Error generating quote:", error);
    
    // Handle specific error types
    let errorMessage = "Failed to generate quote";
    let statusCode = 500;
    
    if (error.message?.includes("API key")) {
      errorMessage = "Invalid API key. Please check your GEMINI_API_KEY.";
      statusCode = 401;
    } else if (error.message?.includes("quota") || error.message?.includes("rate")) {
      errorMessage = "API quota exceeded. Please try again later.";
      statusCode = 429;
    } else if (error.message?.includes("429")) {
      errorMessage = "Too many requests. Please wait a moment and try again.";
      statusCode = 429;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok",
    service: "Motivational Quotes Generator",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server running on http://localhost:" + PORT);
  console.log("📝 Environment: " + (process.env.NODE_ENV || "development"));
  console.log("🔑 API Key configured: " + (process.env.GEMINI_API_KEY ? "Yes" : "No"));
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
