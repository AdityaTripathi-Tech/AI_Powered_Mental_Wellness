// Floating Dr. Mira Chat Widget
class FloatingChat {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.aiAvatar = null;
        this.createFloatingWidget();
        this.initializeChat();
    }

    createFloatingWidget() {
        // Create floating chat button
        const chatButton = document.createElement('div');
        chatButton.id = 'floating-chat-btn';
        chatButton.innerHTML = `
            <div class="chat-avatar">
                <span class="avatar-face">🤖</span>
                <div class="pulse-ring"></div>
                <div class="notification-badge" id="chat-notification" style="display: none;">1</div>
            </div>
        `;
        
        // Create floating chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'floating-chat-window';
        chatWindow.style.display = 'none';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="header-left">
                    <div class="dr-mira-avatar">🤖</div>
                    <div class="header-info">
                        <div class="dr-name">Dr. Mira</div>
                        <div class="status">
                            <span class="status-dot"></span>
                            Online - AI Therapist
                        </div>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="minimize-btn" onclick="floatingChat.minimize()">−</button>
                    <button class="close-btn" onclick="floatingChat.close()">×</button>
                </div>
            </div>
            
            <div class="chat-body" id="floating-chat-messages">
                <div class="welcome-message">
                    <div class="welcome-avatar">👋</div>
                    <div class="welcome-text">
                        <h4>Hello! I'm Dr. Mira</h4>
                        <p>Your AI mental health companion. How can I support you today?</p>
                    </div>
                </div>
            </div>
            
            <div class="chat-footer">
                <div class="input-container">
                    <input type="text" id="floating-chat-input" placeholder="Type your message..." maxlength="500">
                    <button class="voice-btn" id="floating-voice-btn" onclick="floatingChat.toggleVoice()">🎤</button>
                    <button class="send-btn" id="floating-send-btn" onclick="floatingChat.sendMessage()">➤</button>
                </div>
                <div class="quick-actions">
                    <button class="quick-btn" onclick="floatingChat.quickMessage('I need help with anxiety')">😰 Anxiety</button>
                    <button class="quick-btn" onclick="floatingChat.quickMessage('I feel sad today')">😢 Sadness</button>
                    <button class="quick-btn" onclick="floatingChat.quickMessage('I need motivation')">💪 Motivation</button>
                </div>
                <div class="text-center mt-2 pt-2 border-t border-gray-200">
                    <p class="text-xs text-gray-500">
                        Created by <strong>Aditya Tripathi</strong> • 
                        <a href="https://linktr.ee/adityatripathi007" target="_blank" class="text-blue-500 hover:text-blue-600 underline">Portfolio</a>
                    </p>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            /* Floating Chat Button */
            #floating-chat-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                animation: gentle-bounce 3s ease-in-out infinite;
            }

            #floating-chat-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0,0,0,0.4);
            }

            .chat-avatar {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .avatar-face {
                font-size: 24px;
                z-index: 2;
            }

            .pulse-ring {
                position: absolute;
                width: 60px;
                height: 60px;
                border: 2px solid rgba(255,255,255,0.5);
                border-radius: 50%;
                animation: pulse 2s ease-out infinite;
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            /* Floating Chat Window */
            #floating-chat-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease-out;
            }

            .chat-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .header-left {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .dr-mira-avatar {
                font-size: 20px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .header-info .dr-name {
                font-weight: bold;
                font-size: 14px;
            }

            .status {
                font-size: 11px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .status-dot {
                width: 6px;
                height: 6px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            .header-actions {
                display: flex;
                gap: 5px;
            }

            .minimize-btn, .close-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .minimize-btn:hover, .close-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .chat-body {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #f8fafc;
            }

            .welcome-message {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }

            .welcome-avatar {
                font-size: 20px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .welcome-text h4 {
                margin: 0 0 5px 0;
                font-size: 14px;
                color: #1f2937;
            }

            .welcome-text p {
                margin: 0;
                font-size: 12px;
                color: #6b7280;
                line-height: 1.4;
            }

            .chat-message {
                margin-bottom: 10px;
                display: flex;
                gap: 8px;
            }

            .chat-message.user {
                flex-direction: row-reverse;
            }

            .message-bubble {
                max-width: 70%;
                padding: 8px 12px;
                border-radius: 12px;
                font-size: 13px;
                line-height: 1.4;
            }

            .chat-message.user .message-bubble {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
            }

            .chat-message.avatar .message-bubble {
                background: white;
                color: #1f2937;
                border: 1px solid #e5e7eb;
            }

            .message-avatar {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                flex-shrink: 0;
            }

            .chat-message.user .message-avatar {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            }

            .chat-message.avatar .message-avatar {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }

            .chat-footer {
                padding: 15px;
                background: white;
                border-top: 1px solid #e5e7eb;
            }

            .input-container {
                display: flex;
                gap: 8px;
                margin-bottom: 10px;
            }

            #floating-chat-input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                font-size: 13px;
                outline: none;
            }

            #floating-chat-input:focus {
                border-color: #3b82f6;
            }

            .voice-btn, .send-btn {
                width: 35px;
                height: 35px;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .voice-btn {
                background: #f3f4f6;
                color: #6b7280;
            }

            .voice-btn:hover, .voice-btn.active {
                background: #3b82f6;
                color: white;
            }

            .send-btn {
                background: #3b82f6;
                color: white;
            }

            .send-btn:hover {
                background: #1d4ed8;
            }

            .quick-actions {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
            }

            .quick-btn {
                background: #f3f4f6;
                border: none;
                padding: 5px 8px;
                border-radius: 12px;
                font-size: 11px;
                cursor: pointer;
                color: #6b7280;
                transition: all 0.2s ease;
            }

            .quick-btn:hover {
                background: #e5e7eb;
                color: #374151;
            }

            /* Animations */
            @keyframes gentle-bounce {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
            }

            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            /* Minimized state */
            #floating-chat-window.minimized {
                height: 60px;
            }

            #floating-chat-window.minimized .chat-body,
            #floating-chat-window.minimized .chat-footer {
                display: none;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                #floating-chat-window {
                    width: calc(100vw - 40px);
                    height: 400px;
                    bottom: 90px;
                    right: 20px;
                    left: 20px;
                }
            }
        `;

        // Append to document
        document.head.appendChild(styles);
        document.body.appendChild(chatButton);
        document.body.appendChild(chatWindow);

        // Add click event to button
        chatButton.addEventListener('click', () => this.toggle());
    }

    initializeChat() {
        // Initialize AI Avatar for the floating chat
        this.aiAvatar = {
            geminiApiKey: 'AIzaSyCnNCvI05E3p4wCTLkeASEJHadt7QhSKeY',
            geminiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            synthesis: window.speechSynthesis,
            isVoiceEnabled: false,
            isMuted: false
        };

        // Add event listeners
        const input = document.getElementById('floating-chat-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const window = document.getElementById('floating-chat-window');
        const notification = document.getElementById('chat-notification');
        
        window.style.display = 'flex';
        notification.style.display = 'none';
        this.isOpen = true;
        this.isMinimized = false;
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('floating-chat-input');
            if (input) input.focus();
        }, 300);
    }

    close() {
        const window = document.getElementById('floating-chat-window');
        window.style.display = 'none';
        this.isOpen = false;
        this.isMinimized = false;
    }

    minimize() {
        const window = document.getElementById('floating-chat-window');
        if (this.isMinimized) {
            window.classList.remove('minimized');
            this.isMinimized = false;
        } else {
            window.classList.add('minimized');
            this.isMinimized = true;
        }
    }

    async sendMessage() {
        const input = document.getElementById('floating-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        try {
            const response = await this.generateResponse(message);
            this.hideTyping();
            this.addMessage(response, 'avatar');
            
            // Speak response if voice is enabled
            if (this.aiAvatar.isVoiceEnabled && !this.aiAvatar.isMuted) {
                this.speakText(response);
            }
        } catch (error) {
            this.hideTyping();
            this.addMessage("I'm sorry, I'm having trouble responding right now. Please try again.", 'avatar');
        }
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('floating-chat-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble">${message}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async generateResponse(userMessage) {
        try {
            const response = await fetch(`${this.aiAvatar.geminiEndpoint}?key=${this.aiAvatar.geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are Dr. Mira, a compassionate AI therapist. Respond to: "${userMessage}" 
                            Keep it brief (1-2 sentences), warm, and supportive.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150,
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.candidates?.[0]?.content) {
                    return data.candidates[0].content.parts[0].text.trim();
                }
            }
        } catch (error) {
            console.warn('Gemini AI unavailable');
        }
        
        // Fallback responses
        const responses = [
            "I'm here to listen and support you. Can you tell me more about how you're feeling?",
            "Thank you for sharing that with me. What would feel most helpful right now?",
            "I understand this might be difficult. You're not alone in this journey.",
            "That takes courage to share. How can I best support you today?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    quickMessage(message) {
        document.getElementById('floating-chat-input').value = message;
        this.sendMessage();
    }

    toggleVoice() {
        const voiceBtn = document.getElementById('floating-voice-btn');
        this.aiAvatar.isVoiceEnabled = !this.aiAvatar.isVoiceEnabled;
        
        if (this.aiAvatar.isVoiceEnabled) {
            voiceBtn.classList.add('active');
            this.addMessage("🎤 Voice responses enabled! Dr. Mira will speak back to you.", 'avatar');
        } else {
            voiceBtn.classList.remove('active');
            this.addMessage("Voice responses disabled.", 'avatar');
        }
    }

    speakText(text) {
        if (!this.aiAvatar.synthesis || this.aiAvatar.isMuted) return;
        
        this.aiAvatar.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.2;
        utterance.volume = 0.9;
        
        // Try to find a female voice
        const voices = this.aiAvatar.synthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('karen')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        this.aiAvatar.synthesis.speak(utterance);
    }

    showTyping() {
        const messagesContainer = document.getElementById('floating-chat-messages');
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'floating-typing';
        typingDiv.className = 'chat-message avatar';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble" style="font-style: italic; color: #6b7280;">
                Dr. Mira is typing...
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('floating-typing');
        if (typing) typing.remove();
    }

    showNotification() {
        if (!this.isOpen) {
            const notification = document.getElementById('chat-notification');
            notification.style.display = 'flex';
        }
    }
}

// Initialize floating chat when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not on the main ai-avatar page
    if (!window.location.pathname.includes('ai-avatar.html')) {
        window.floatingChat = new FloatingChat();
    }
});
