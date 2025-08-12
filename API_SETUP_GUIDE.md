# API Setup Guide for VERONIKA Chatbot

## Quick Start

1. Open `config.js` in a text editor
2. Replace `YOUR_API_KEY_HERE` with your actual API key
3. Save the file and refresh the chatbot page

## Supported AI Providers

### 1. OpenAI (ChatGPT)

**Get API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create an account or sign in
3. Click "Create new secret key"
4. Copy the key

**Configure in config.js:**
```javascript
const ACTIVE_CONFIG = {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'sk-YOUR_OPENAI_KEY_HERE',
    model: 'gpt-3.5-turbo',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-YOUR_OPENAI_KEY_HERE'
    }
};
```

### 2. Anthropic (Claude)

**Get API Key:**
1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API keys section
4. Generate a new key

**Configure in config.js:**
```javascript
const ACTIVE_CONFIG = {
    endpoint: 'https://api.anthropic.com/v1/messages',
    apiKey: 'YOUR_ANTHROPIC_KEY',
    model: 'claude-3-opus-20240229',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_ANTHROPIC_KEY',
        'anthropic-version': '2023-06-01'
    }
};
```

### 3. Google Gemini

**Get API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"

**Configure in config.js:**
```javascript
const ACTIVE_CONFIG = {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY',
    apiKey: 'YOUR_GEMINI_KEY',
    headers: {
        'Content-Type': 'application/json'
    }
};
```

### 4. Local/Custom API

**For your own API server:**
```javascript
const ACTIVE_CONFIG = {
    endpoint: 'http://localhost:8000/api/chat',
    apiKey: 'YOUR_CUSTOM_KEY',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'YOUR_CUSTOM_KEY'
    }
};
```

## API Response Format

### Expected Response Format for Custom APIs:
```json
{
    "response": "The AI's response text here",
    // OR
    "message": "The AI's response text here",
    // OR
    "text": "The AI's response text here"
}
```

### Custom API Implementation Example (Node.js):
```javascript
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    // Your AI logic here
    const aiResponse = await generateResponse(message);
    
    res.json({
        response: aiResponse
    });
});
```

## Troubleshooting

### API Status Indicators:
- 🟢 **Green (API Connected)**: API is working correctly
- 🟡 **Yellow (Demo Mode)**: No API key configured, using demo responses
- 🔴 **Red (API Error/Offline)**: Check your API key and internet connection

### Common Issues:

1. **"Authentication failed"**
   - Check if your API key is correct
   - Ensure the key is active and has proper permissions
   - Verify you're using the correct header format

2. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Check your API provider's rate limits
   - Consider upgrading your API plan

3. **"Request timed out"**
   - Check your internet connection
   - The API server might be experiencing high load
   - Try again in a few moments

4. **CORS Errors (in browser console)**
   - This happens when calling APIs directly from browser
   - Solutions:
     - Use a proxy server
     - Configure CORS on your API server
     - Use a serverless function as middleware

## Security Best Practices

1. **Never commit API keys to version control**
   - Add `config.js` to `.gitignore`
   - Use environment variables in production

2. **Use a backend proxy for production**
   - Don't expose API keys in frontend code
   - Create a backend endpoint that forwards requests

3. **Implement rate limiting**
   - Protect against abuse
   - Monitor API usage

## Testing Your API

1. Open the chatbot in your browser
2. Check the API status indicator (top right)
3. Send a test message like "Hello"
4. If working, you'll get a real AI response
5. If not configured, you'll get demo responses

## Need Help?

- Check browser console for detailed error messages (F12)
- Verify API endpoint URLs are correct
- Ensure API keys have necessary permissions
- Check API provider's documentation for updates

---

Remember: The chatbot works in demo mode without API configuration, so you can test the interface first before setting up the API!
