#!/usr/bin/env python3
"""
Simple test script to verify VERONIKA API functionality
"""

import google.generativeai as genai

# Configure API key
API_KEY = "AIzaSyAHDyynI_EveM7Aic2gVleGv9JBJebARNU"
genai.configure(api_key=API_KEY)

def test_gemini_api():
    """Test the Gemini API connection and basic functionality"""
    try:
        # Initialize the model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Test simple generation
        print("🔍 Testing Gemini API Connection...")
        response = model.generate_content("Hello! I am VERONIKA. Please respond as VERONIKA from the AV Ecosystem.")
        
        print("✅ API Connection: SUCCESS")
        print(f"🤖 VERONIKA Response: {response.text}")
        return True
        
    except Exception as e:
        print(f"❌ API Connection: FAILED")
        print(f"Error: {str(e)}")
        return False

def test_conversation():
    """Test a simple conversation flow"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        print("\n💬 Testing Conversation Flow...")
        
        # Create context
        context = "You are VERONIKA, a helpful and engaging BABE AI chatbot powered by the AV Ecosystem. "
        context += "You should be friendly, informative, and provide helpful responses."
        
        messages = [
            "What is your name?",
            "What can you help me with?",
            "Tell me about the AV Ecosystem"
        ]
        
        for i, message in enumerate(messages, 1):
            full_prompt = f"{context}\n\nUser: {message}\nVERONIKA:"
            response = model.generate_content(full_prompt)
            
            print(f"\n{i}. User: {message}")
            print(f"   VERONIKA: {response.text[:100]}...")
            
        print("\n✅ Conversation Flow: SUCCESS")
        return True
        
    except Exception as e:
        print(f"\n❌ Conversation Flow: FAILED")
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🌈 VERONIKA API Test Suite")
    print("=" * 50)
    
    # Run tests
    api_test = test_gemini_api()
    
    if api_test:
        conversation_test = test_conversation()
        
        if conversation_test:
            print("\n" + "=" * 50)
            print("🎉 ALL TESTS PASSED! VERONIKA is ready to chat!")
            print("Run 'python app.py' to start the chatbot.")
        else:
            print("\n" + "=" * 50)
            print("⚠️  Some tests failed. Check your API quota.")
    else:
        print("\n" + "=" * 50)
        print("❌ API tests failed. Please check your API key.")
