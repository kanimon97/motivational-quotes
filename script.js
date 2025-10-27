const quoteText = document.getElementById("quote");
const newQuoteButton = document.getElementById("new-quote");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("error-message");
const copyButton = document.getElementById("copy-btn");
const categorySelect = document.getElementById("category");

let isLoading = false;
let currentQuote = "";

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
function showQuote(quote) {
  currentQuote = quote;
  quoteText.textContent = quote;
  quoteText.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  copyButton.classList.remove("hidden");
  
  // Add animation effect
  quoteText.classList.add("fade-in");
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

async function generateQuote() {
  if (isLoading) return; // Prevent multiple simultaneous requests
  
  isLoading = true;
  newQuoteButton.disabled = true;
  newQuoteButton.textContent = "Generating...";
  
  toggleSpinner(true);
  
  const category = categorySelect.value;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch("http://localhost:3000/generate", {
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
      showQuote(data.quote);
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
