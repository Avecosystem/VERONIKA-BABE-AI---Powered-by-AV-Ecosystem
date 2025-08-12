// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const featureToggle = document.getElementById('featureToggle');
const featureMenu = document.getElementById('featureMenu');

// State
let messages = [];
let isTyping = false;
let currentTheme = 'dark';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeTextareaAutoResize();
    loadMessages();
    applyTheme(currentTheme);
});

// Event Listeners
function initializeEventListeners() {
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Feature menu
    featureToggle.addEventListener('click', toggleFeatureMenu);
    document.addEventListener('click', (e) => {
        if (!featureMenu.contains(e.target)) {
            featureMenu.classList.remove('active');
        }
    });

    // Feature items
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('click', (e) => {
            handleFeatureClick(e.currentTarget.dataset.feature);
        });
    });

    // Action buttons
    document.getElementById('editBtn').addEventListener('click', handleEdit);
    document.getElementById('copyBtn').addEventListener('click', handleCopy);
    document.getElementById('linkBtn1').addEventListener('click', () => window.open('https://link3.to/av_babecoin', '_blank'));
    document.getElementById('linkBtn2').addEventListener('click', () => window.open('https://link3.to/VY5JG29F', '_blank'));
    document.getElementById('resendBtn').addEventListener('click', handleResend);
}

// Auto-resize textarea
function initializeTextareaAutoResize() {
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// Send Message
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
        // Use Flask API
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        
        hideLoading();
        if (response.ok) {
            addMessage(data.response, 'bot', true);
        } else {
            addMessage(data.response || 'Sorry, I encountered an error. Please try again.', 'bot');
        }
        isTyping = false;
        
    } catch (error) {
        hideLoading();
        console.error('Error:', error);
        addMessage('Sorry, I encountered a connection error. Please try again.', 'bot');
        isTyping = false;
    }
}

// Add message to chat
function addMessage(content, sender, animate = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    if (animate && sender === 'bot') {
        typeMessage(contentDiv, content);
    } else {
        contentDiv.innerHTML = `<p>${content}</p>`;
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Save message
    messages.push({ content, sender, timestamp: new Date() });
    saveMessages();
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Type message animation
function typeMessage(element, text) {
    let index = 0;
    const p = document.createElement('p');
    element.appendChild(p);
    
    function type() {
        if (index < text.length) {
            p.textContent += text.charAt(index);
            index++;
            setTimeout(type, 20 + Math.random() * 30);
        }
    }
    
    type();
}

// Generate AI Response
function generateAIResponse(input) {
    const responses = [
        "That's an interesting question! Let me help you with that.",
        "I understand what you're looking for. Here's what I think...",
        "Great question! Based on my knowledge, I can tell you that...",
        "I'm analyzing your request. Here's my response...",
        "Thanks for asking! Let me provide you with some insights...",
    ];
    
    const keywords = {
        hello: "Hello! I'm VERONIKA, your AI assistant. How can I help you today?",
        help: "I'm here to help! I can assist you with various tasks, answer questions, and provide information on a wide range of topics.",
        features: "I come with many advanced features including voice input, theme customization, chat export, and more. Click the menu button to explore!",
        about: "I'm VERONIKA, a BABE AI chatbot powered by the AV Ecosystem. I'm designed to be helpful, engaging, and user-friendly.",
    };
    
    // Check for keywords
    const lowerInput = input.toLowerCase();
    for (const [key, response] of Object.entries(keywords)) {
        if (lowerInput.includes(key)) {
            return response;
        }
    }
    
    // Return random response
    return responses[Math.floor(Math.random() * responses.length)];
}

// Loading indicator
function showLoading() {
    loadingIndicator.classList.add('active');
}

function hideLoading() {
    loadingIndicator.classList.remove('active');
}

// Feature menu
function toggleFeatureMenu() {
    featureMenu.classList.toggle('active');
}

// Handle feature clicks
function handleFeatureClick(feature) {
    switch(feature) {
        case 'voice':
            initVoiceInput();
            break;
        case 'theme':
            toggleTheme();
            break;
        case 'export':
            exportChat();
            break;
        case 'clear':
            clearChat();
            break;
    }
    featureMenu.classList.remove('active');
}

// Voice input
function initVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Voice input is not supported in your browser.');
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        messageInput.placeholder = 'Listening...';
        messageInput.classList.add('listening');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        messageInput.value = transcript;
        messageInput.placeholder = 'Type your message here...';
        messageInput.classList.remove('listening');
    };
    
    recognition.onerror = () => {
        messageInput.placeholder = 'Type your message here...';
        messageInput.classList.remove('listening');
    };
    
    recognition.start();
}

// Theme toggle
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('theme-light');
    } else {
        document.body.classList.remove('theme-light');
    }
    localStorage.setItem('theme', theme);
}

// Export chat
function exportChat() {
    const chatContent = messages.map(msg => 
        `[${new Date(msg.timestamp).toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veronika-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        messages = [];
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

// Action button handlers
function handleEdit() {
    if (messages.length > 0) {
        const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
        if (lastUserMessage) {
            messageInput.value = lastUserMessage.content;
            messageInput.focus();
        }
    }
}

function handleCopy() {
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        navigator.clipboard.writeText(lastMessage.content).then(() => {
            // Visual feedback
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('success');
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}

function handleLink(linkNumber) {
    addMessage(`You clicked Link ${linkNumber}. This feature can be customized to perform specific actions.`, 'bot');
}

function handleResend() {
    if (messages.length > 0) {
        const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
        if (lastUserMessage) {
            messageInput.value = lastUserMessage.content;
            sendMessage();
        }
    }
}

// Local storage
function saveMessages() {
    localStorage.setItem('veronika-messages', JSON.stringify(messages));
}

function loadMessages() {
    const saved = localStorage.getItem('veronika-messages');
    if (saved) {
        messages = JSON.parse(saved);
        messages.forEach(msg => {
            addMessage(msg.content, msg.sender);
        });
    }
    
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
    }
}

// Add visual effects
function addGlowEffect(element) {
    element.classList.add('glow');
    setTimeout(() => element.classList.remove('glow'), 2000);
}

// Particle effect (optional advanced feature)
function createParticleEffect(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
}

// Add click effect to send button
sendBtn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});
