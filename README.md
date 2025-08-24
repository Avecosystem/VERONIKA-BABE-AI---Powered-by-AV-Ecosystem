# VERONIKA - BABE AI Chatbot 🌈

A fully functional AI chatbot named 'VERONIKA' powered by Google's Gemini API with a beautiful neon rainbow UI.

## Features ✨

- **Rainbow Color Transition UI**: Beautiful animated rainbow text for the VERONIKA title
- **Neon & Black Theme**: Modern dark theme with neon accents and glass morphism effects
- **Interactive Features**:
  - Edit user messages
  - Resend messages
  - Copy messages to clipboard
  - Voice input support (browser dependent)
  - Export chat history
  - Clear chat functionality
  - Theme toggle
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Status**: API connection status indicator
- **Smooth Animations**: Fade-in effects and hover animations

## Setup Instructions 🚀

### Prerequisites
- Python 3.7+
- Babe ai

### Local Development

1. **Clone or Download** the project files to your local machine

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application**
   ```bash
   python app.py
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:5000`
   - Start chatting with VERONIKA!

### Deployment on Netlify 🌐

1. **Create a new site** on Netlify
2. **Upload your project folder** or connect your GitHub repository
3. **Build Settings**:
   - Build command: `pip install -r requirements.txt`
   - Publish directory: `/`
4. **Environment Variables**: The API key is already included in the code
5. **Deploy!**

### Deployment on Heroku 🚀

1. **Create a new Heroku app**
2. **Connect your repository** or upload files
3. **The app will automatically detect** Python and use the Procfile
4. **Deploy and enjoy!**

### Deployment on Railway/Render 🚂

1. **Connect your GitHub repository**
2. **Select Python environment**
3. **The platform will auto-detect** requirements.txt and Procfile
4. **Deploy automatically**

## File Structure 📁

```
VERONIKA-Chatbot/
├── app.py                 # Flask backend application
├── templates/
│   └── index.html        # Main HTML template with UI
├── requirements.txt      # Python dependencies
├── Procfile             # Deployment configuration
└── README.md            # This file
```

## Features Breakdown 🔧

### Backend (app.py)
- Flask web server
- Babe AI integration with API key: `AIzaSyAHDyynI_EveM7Aic2gVleGv9JBJebARNU`
- Conversation history management
- RESTful API endpoints for chat, clear, and export
- Uses Gemini 1.5 Flash model for fast, intelligent responses

### Frontend (index.html)
- Responsive design with CSS Grid and Flexbox
- Animated rainbow gradient for VERONIKA title
- Glass morphism effects and neon styling
- JavaScript chatbot class with full functionality
- Voice recognition support
- Message actions (edit, resend, copy)
- Smooth animations and transitions

## API Endpoints 📡

- `GET /` - Main chatbot interface
- `POST /chat` - Send message to VERONIKA
- `POST /clear_chat` - Clear conversation history
- `GET /export_chat` - Export chat history as JSON

## Customization 🎨

### Changing Colors
Modify the CSS gradient in the `.logo` class:
```css
background: linear-gradient(
    45deg,
    #ff0080, #ff8c00, #ffd700, #32cd32, 
    #00bfff, #8a2be2, #ff69b4, #ff0080
);
```

### Modifying AI Behavior
Edit the context in the `chat()` function in `app.py`:
```python
context = "You are VERONIKA, a helpful and engaging BABE AI chatbot powered by the AV Ecosystem."
```

## Browser Compatibility 🌐

- ✅ Chrome/Edge (full voice support)
- ✅ Firefox (limited voice support)
- ✅ Safari (basic functionality)
- ✅ Mobile browsers

## Troubleshooting 🔧

1. **API Issues**: The Babe ai API key is pre-configured
2. **Voice Not Working**: Voice recognition requires HTTPS in production
3. **Styling Issues**: Clear browser cache and reload

## Support 💬

For technical support or questions about the AV Ecosystem, please contact the development team.

---

**© 2025 AV Ecosystem. All rights reserved.**

*BABE AI - Powered by AV Ecosystem* 🌈
