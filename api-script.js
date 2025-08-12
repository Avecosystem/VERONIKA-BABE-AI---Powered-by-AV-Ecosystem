// API Integration Module
class ChatAPI {
    constructor(config) {
        this.config = config || ACTIVE_CONFIG;
        this.conversationHistory = [];
    }

    // Build request body based on provider
    buildRequestBody(message) {
        // OpenAI format
        if (this.config.endpoint.includes('openai')) {
            return {
                model: this.config.model,
                messages: [
                    {
                        role: "system",
                        content: "You are VERONIKA, an advanced AI assistant powered by the AV Ecosystem. You are helpful, engaging, and knowledgeable."
                    },
                    ...this.conversationHistory,
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: this.config.temperature || 0.7,
                max_tokens: this.config.max_tokens || 1000
            };
        }
        
        // Anthropic format
        if (this.config.endpoint.includes('anthropic')) {
            return {
                model: this.config.model,
                messages: [
                    ...this.conversationHistory,
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: this.config.max_tokens || 1000
            };
        }
        
        // Google Gemini format
        if (this.config.endpoint.includes('generativelanguage')) {
            return {
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            };
        }
        
        // Generic format
        return {
            message: message,
            history: this.conversationHistory,
            config: {
                temperature: this.config.temperature,
                max_tokens: this.config.max_tokens
            }
        };
    }

    // Parse response based on provider
    parseResponse(data) {
        // OpenAI format
        if (this.config.endpoint.includes('openai')) {
            return data.choices[0].message.content;
        }
        
        // Anthropic format
        if (this.config.endpoint.includes('anthropic')) {
            return data.content[0].text;
        }
        
        // Google Gemini format
        if (this.config.endpoint.includes('generativelanguage')) {
            try {
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                }
                // Handle error response
                if (data.error) {
                    console.error('Gemini API Error:', data.error);
                    return 'Sorry, I encountered an error with the AI service.';
                }
            } catch (e) {
                console.error('Error parsing Gemini response:', e);
                return 'Sorry, I had trouble understanding the response.';
            }
        }
        
        // Generic format
        return data.response || data.message || data.text || JSON.stringify(data);
    }

    // Make API request with retry logic
    async makeRequest(message, retryCount = 0) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                headers: this.config.headers,
                body: JSON.stringify(this.buildRequestBody(message)),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return this.parseResponse(data);

        } catch (error) {
            if (retryCount < this.config.maxRetries) {
                console.log(`Retrying... (${retryCount + 1}/${this.config.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                return this.makeRequest(message, retryCount + 1);
            }
            throw error;
        }
    }

    // Send message to API
    async sendMessage(message) {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: "user",
                content: message
            });

            // Make API request
            const response = await this.makeRequest(message);

            // Add assistant response to history
            this.conversationHistory.push({
                role: "assistant",
                content: response
            });

            // Limit conversation history size
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            return response;

        } catch (error) {
            console.error('API Error:', error);
            
            // Remove the failed user message from history
            this.conversationHistory.pop();
            
            // Return error message
            if (error.name === 'AbortError') {
                return "Request timed out. Please try again.";
            } else if (error.message.includes('API Error: 401')) {
                return "Authentication failed. Please check your API key in config.js";
            } else if (error.message.includes('API Error: 429')) {
                return "Rate limit exceeded. Please wait a moment and try again.";
            } else if (error.message.includes('API Error: 500')) {
                return "The AI service is currently experiencing issues. Please try again later.";
            } else {
                return `Error: ${error.message}. Please check your configuration and try again.`;
            }
        }
    }

    // Clear conversation history
    clearHistory() {
        this.conversationHistory = [];
    }
}

// Initialize API
const chatAPI = new ChatAPI();

// Override the sendMessage function in script.js
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;

    // Add user message
    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Show loading
    showLoading();
    isTyping = true;

    try {
        // Check if API is configured
        if (ACTIVE_CONFIG.apiKey === 'YOUR_API_KEY_HERE' || !ACTIVE_CONFIG.apiKey) {
            // Use mock response if API is not configured
            setTimeout(() => {
                hideLoading();
                const response = generateAIResponse(message);
                addMessage(response, 'bot', true);
                isTyping = false;
            }, 2000 + Math.random() * 2000);
        } else {
            // Use real API
            const response = await chatAPI.sendMessage(message);
            hideLoading();
            addMessage(response, 'bot', true);
            isTyping = false;
        }
    } catch (error) {
        hideLoading();
        addMessage("Sorry, I encountered an error. Please try again.", 'bot');
        isTyping = false;
    }
}

// Enhanced clear chat function
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        messages = [];
        chatAPI.clearHistory(); // Clear API conversation history
        saveMessages();
        chatMessages.innerHTML = `
            <div class="message bot-message welcome-message">
                <div class="message-content">
                    <p>I am VERONIKA, an BABE AI chatbot powered by the AV Ecosystem. I am designed to be helpful and engaging. Hi there! How can I help you today?</p>
                </div>
            </div>
        `;
    }
}

// API Status indicator
function addAPIStatus() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'apiStatus';
    statusDiv.className = 'api-status';
    statusDiv.innerHTML = `
        <span class="status-indicator"></span>
        <span class="status-text">API Status</span>
    `;
    document.querySelector('.header').appendChild(statusDiv);
}

// Check API connection
async function checkAPIConnection() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (ACTIVE_CONFIG.apiKey === 'YOUR_API_KEY_HERE' || !ACTIVE_CONFIG.apiKey) {
        statusIndicator.style.background = '#ffbe0b';
        statusText.textContent = 'Demo Mode';
        return;
    }
    
    try {
        // Simple ping to check if API is reachable
        const response = await fetch(ACTIVE_CONFIG.endpoint, {
            method: 'POST',
            headers: ACTIVE_CONFIG.headers,
            body: JSON.stringify({ test: true })
        });
        
        if (response.ok || response.status === 400) { // 400 might be expected for invalid request
            statusIndicator.style.background = '#06ffa5';
            statusText.textContent = 'API Connected';
        } else {
            statusIndicator.style.background = '#ff006e';
            statusText.textContent = 'API Error';
        }
    } catch (error) {
        statusIndicator.style.background = '#ff006e';
        statusText.textContent = 'API Offline';
    }
}

// Initialize API status on load
document.addEventListener('DOMContentLoaded', () => {
    addAPIStatus();
    checkAPIConnection();
    
    // Check API status every 30 seconds
    setInterval(checkAPIConnection, 30000);
});
