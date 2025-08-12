// API Configuration
const API_CONFIG = {
    // Replace with your actual API endpoint
    endpoint: 'https://api.openai.com/v1/chat/completions',
    
    // Replace with your actual API key
    apiKey: 'YOUR_API_KEY_HERE',
    
    // Model configuration
    model: 'gpt-3.5-turbo',
    
    // Request settings
    temperature: 0.7,
    max_tokens: 1000,
    
    // Timeout in milliseconds
    timeout: 30000,
    
    // Retry settings
    maxRetries: 3,
    retryDelay: 1000,
    
    // Custom headers (if needed)
    headers: {
        'Content-Type': 'application/json',
        // Add any additional headers your API requires
    }
};

// Example configurations for different AI providers

// OpenAI Configuration
const OPENAI_CONFIG = {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'YOUR_OPENAI_API_KEY',
    model: 'gpt-3.5-turbo',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
    }
};

// Anthropic Claude Configuration
const ANTHROPIC_CONFIG = {
    endpoint: 'https://api.anthropic.com/v1/messages',
    apiKey: 'YOUR_ANTHROPIC_API_KEY',
    model: 'claude-3-opus-20240229',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_ANTHROPIC_API_KEY',
        'anthropic-version': '2023-06-01'
    }
};

// Google Gemini Configuration
const GEMINI_CONFIG = {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAHDyynI_EveM7Aic2gVleGv9JBJebARNU',
    apiKey: 'AIzaSyAHDyynI_EveM7Aic2gVleGv9JBJebARNU',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Local/Custom API Configuration
const CUSTOM_API_CONFIG = {
    endpoint: 'http://localhost:8000/api/chat',
    apiKey: 'YOUR_CUSTOM_API_KEY',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'YOUR_CUSTOM_API_KEY'
    }
};

// Export the configuration you want to use
// Change this to use different providers
const ACTIVE_CONFIG = GEMINI_CONFIG; // Using Google Gemini with the provided API key
