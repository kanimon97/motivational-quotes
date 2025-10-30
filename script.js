const quoteText = document.getElementById("quote");
const newQuoteButton = document.getElementById("new-quote");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("error-message");
const copyButton = document.getElementById("copy-btn");
const speakButton = document.getElementById("speak-btn");
const downloadButton = document.getElementById("download-btn");
const categorySelect = document.getElementById("category");
const quoteImage = document.getElementById("quote-image");
const quoteImageWrapper = document.getElementById("quote-image-wrapper");
const mainContainer = document.getElementById("main-container");

let isLoading = false;
let currentQuote = "";
let currentImageUrl = "";
let currentCategory = "general";
let speechSynthesis = window.speechSynthesis;
let isSpeaking = false;

// Show/hide spinner
function toggleSpinner(show) {
  if (show) {
    spinner.classList.remove("hidden");
    quoteText.classList.add("hidden");
    errorMessage.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    quoteText.classList.remove("hidden");
  }
}

// Show error message
function showError(message) {
  errorMessage.textContent = `❌ Error: ${message}`;
  errorMessage.classList.remove("hidden");
  quoteText.classList.add("hidden");
  copyButton.classList.add("hidden");
}

// Show quote with animation
function showQuote(quote, imageUrl = null, category = "general") {
  currentQuote = quote;
  currentCategory = category;
  currentImageUrl = imageUrl;
  
  quoteText.textContent = quote;
  quoteText.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  copyButton.classList.remove("hidden");
  speakButton.classList.remove("hidden");
  downloadButton.classList.remove("hidden");
  
  // Add animation effect
  quoteText.classList.add("fade-in");
  
  // Apply category theming
  mainContainer.className = `container category-${category}`;
  
  // Handle background image
  if (imageUrl) {
    quoteImage.src = imageUrl;
    quoteImageWrapper.classList.remove("hidden");
    quoteImage.onload = () => {
      quoteImage.style.opacity = "0.2";
    };
  } else {
    quoteImageWrapper.classList.add("hidden");
  }
}

// Copy to clipboard functionality
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentQuote);
    
    // Show success feedback
    const originalText = copyButton.textContent;
    copyButton.textContent = "✓ Copied!";
    copyButton.style.backgroundColor = "#4CAF50";
    
    setTimeout(() => {
      copyButton.textContent = originalText;
      copyButton.style.backgroundColor = "";
    }, 2000);
  } catch (error) {
    console.error("Failed to copy:", error);
    showError("Failed to copy to clipboard");
  }
});

// Text-to-speech functionality
speakButton.addEventListener("click", () => {
  if (isSpeaking) {
    speechSynthesis.cancel();
    speakButton.textContent = "🔊 Speak";
    isSpeaking = false;
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(currentQuote);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  
  speakButton.textContent = "⏸ Pause";
  isSpeaking = true;
  
  utterance.onend = () => {
    speakButton.textContent = "🔊 Speak";
    isSpeaking = false;
  };
  
  utterance.onerror = () => {
    speakButton.textContent = "🔊 Speak";
    isSpeaking = false;
    showError("Text-to-speech failed");
  };
  
  speechSynthesis.speak(utterance);
});

// Download quote as image functionality
downloadButton.addEventListener("click", () => {
  if (!currentQuote) return;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1600;
  canvas.height = 900;
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  
  // Category-based gradients
  const categoryGradients = {
    general: ['#667eea', '#764ba2'],
    success: ['#4CAF50', '#45a049'],
    courage: ['#f44336', '#d32f2f'],
    happiness: ['#FFC107', '#F57C00'],
    wisdom: ['#2196F3', '#1976D2'],
    perseverance: ['#9C27B0', '#7B1FA2'],
    hope: ['#FF9800', '#F57C00']
  };
  
  const colors = categoryGradients[currentCategory] || categoryGradients.general;
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add quote text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Wrap text
  const maxWidth = 1400;
  const lineHeight = 90;
  const words = currentQuote.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  
  // Draw lines
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, 
      canvas.height / 2 + (index - lines.length / 2) * lineHeight);
  });
  
  // Convert to blob and download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${currentCategory}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success feedback
    const originalText = downloadButton.textContent;
    downloadButton.textContent = "✓ Downloaded!";
    setTimeout(() => {
      downloadButton.textContent = originalText;
    }, 2000);
  });
});

async function generateQuote() {
  if (isLoading) return; // Prevent multiple simultaneous requests
  
  isLoading = true;
  newQuoteButton.disabled = true;
  newQuoteButton.textContent = "Generating...";
  speakButton.classList.add("hidden");
  downloadButton.classList.add("hidden");
  copyButton.classList.add("hidden");
  
  toggleSpinner(true);
  
  const category = categorySelect.value;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    // Use the new endpoint that includes background images
    const response = await fetch("http://localhost:3000/generate-with-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: category }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      showError(data.error);
    } else if (!data.quote || data.quote.trim() === "") {
      showError("No quote received from server");
    } else {
      showQuote(data.quote, data.imageUrl, data.category);
    }
  } catch (error) {
    console.error("Quote generation error:", error);
    
    if (error.name === "AbortError") {
      showError("Request timeout - please try again");
    } else if (error.message.includes("Failed to fetch")) {
      showError("Cannot connect to server. Make sure the server is running on port 3000");
    } else {
      showError(error.message || "Could not generate quote. Please try again.");
    }
  } finally {
    isLoading = false;
    newQuoteButton.disabled = false;
    newQuoteButton.textContent = "Generate Quote";
    toggleSpinner(false);
  }
}

newQuoteButton.addEventListener("click", generateQuote);
