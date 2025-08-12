from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from datetime import datetime
import json

app = Flask(__name__)

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyAHDyynI_EveM7Aic2gVleGv9JBJebARNU"
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the Gemini model
model = genai.GenerativeModel('gemini-1.5-flash')

# Store conversation history
conversation_history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Add user message to history
        conversation_history.append({
            'role': 'user',
            'content': user_message,
            'timestamp': datetime.now().isoformat()
        })
        
        # Create context from conversation history
        context = "You are VERONIKA, a helpful and engaging BABE AI chatbot powered by the AV Ecosystem. "
        context += "You should be friendly, informative, and provide helpful responses. "
        
        # Add recent conversation context
        recent_context = ""
        for msg in conversation_history[-10:]:  # Last 10 messages for context
            role = "User" if msg['role'] == 'user' else "VERONIKA"
            recent_context += f"{role}: {msg['content']}\n"
        
        full_prompt = context + "\nConversation history:\n" + recent_context + f"\nUser: {user_message}\nVERONIKA:"
        
        # Generate response using Gemini
        response = model.generate_content(full_prompt)
        bot_response = response.text
        
        # Add bot response to history
        conversation_history.append({
            'role': 'assistant',
            'content': bot_response,
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'response': bot_response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'response': "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/clear_chat', methods=['POST'])
def clear_chat():
    global conversation_history
    conversation_history = []
    return jsonify({'status': 'Chat cleared successfully'})

@app.route('/export_chat', methods=['GET'])
def export_chat():
    return jsonify({
        'conversation': conversation_history,
        'exported_at': datetime.now().isoformat()
    })

@app.route('/health', methods=['GET'])
def health_check():
    try:
        # Test the API connection
        test_response = model.generate_content("Hello")
        return jsonify({
            'status': 'healthy',
            'api_connected': True,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'api_connected': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
