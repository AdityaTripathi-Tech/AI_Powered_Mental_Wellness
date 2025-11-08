// Simple AI Avatar System - Clean Version
class AIAvatar {
    constructor() {
        this.isVoiceEnabled = false;
        this.isMuted = false;
        this.isListening = false;
        this.messageCount = 0;
        
        // Gemini AI Configuration
        this.geminiApiKey = 'AIzaSyCnNCvI05E3p4wCTLkeASEJHadt7QhSKeY';
        this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        // Speech setup
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        
        this.initializeSpeech();
        this.initializeEventListeners();
        
        // Welcome message
        setTimeout(() => {
            this.addMessage("Hello! I'm Dr. Mira, your AI therapist companion. How can I help you today?", 'avatar');
        }, 1000);
    }

    initializeSpeech() {
        // Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatInput').value = transcript;
                this.sendMessage();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceButton();
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton();
            };
        }
    }

    initializeEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const voiceBtn = document.getElementById('voiceBtn');
        const muteBtn = document.getElementById('muteBtn');

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                if (this.isVoiceEnabled && !this.isListening) {
                    this.startListening();
                } else {
                    this.toggleVoice();
                }
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate AI response
        setTimeout(async () => {
            this.hideTypingIndicator();
            try {
                const response = await this.generateResponse(message);
                this.addMessage(response, 'avatar');
                
                // Speak the response if voice is enabled
                if (this.isVoiceEnabled && !this.isMuted) {
                    this.speakText(response);
                }
            } catch (error) {
                console.error('Error generating response:', error);
                this.addMessage("I'm sorry, I'm having trouble responding right now. Please try again.", 'avatar');
            }
        }, 1500);
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-bubble ${sender}`;
        
        if (sender === 'avatar') {
            messageDiv.innerHTML = `<div class="flex items-start space-x-2">
                <span class="text-lg">🤖</span>
                <p class="flex-1">${message}</p>
            </div>`;
        } else {
            messageDiv.innerHTML = `<p>${message}</p>`;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messageCount++;
        const messageCountEl = document.getElementById('messageCount');
        if (messageCountEl) {
            messageCountEl.textContent = this.messageCount;
        }
    }

    async generateResponse(userMessage) {
        try {
            // Try Gemini AI first
            const response = await fetch(`${this.geminiEndpoint}?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are Dr. Mira, a compassionate AI therapist specializing in CBT. 
                            Respond to: "${userMessage}"
                            Keep your response warm, supportive, and under 3 sentences.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 200,
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text.trim();
                }
            }
        } catch (error) {
            console.warn('Gemini AI unavailable, using fallback');
        }
        
        // Fallback responses
        const fallbackResponses = [
            "I hear you, and I want you to know that your feelings are valid. Can you tell me more about what you're experiencing?",
            "Thank you for sharing that with me. It takes courage to open up. How can I best support you right now?",
            "I'm here to listen and help. What would feel most helpful for you in this moment?",
            "That sounds challenging. Remember that you're not alone in this. What's one small step we could work on together?"
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    speakText(text) {
        if (!this.synthesis || this.isMuted) return;
        
        try {
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.85;
            utterance.pitch = 1.2;
            utterance.volume = 0.9;
            
            // Try to find a female voice
            const voices = this.synthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('female') ||
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('zira')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            utterance.onstart = () => {
                const avatarFace = document.getElementById('avatarFace');
                if (avatarFace) avatarFace.textContent = '🗣️';
            };
            
            utterance.onend = () => {
                const avatarFace = document.getElementById('avatarFace');
                if (avatarFace) avatarFace.textContent = '🤖';
            };
            
            this.synthesis.speak(utterance);
        } catch (error) {
            console.error('Speech error:', error);
        }
    }

    toggleVoice() {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        this.updateVoiceButton();
        
        if (this.isVoiceEnabled && this.recognition) {
            this.addMessage("🎤 Voice chat activated! Click the microphone to speak.", 'system');
        } else if (this.isVoiceEnabled) {
            this.addMessage("❌ Voice recognition not supported in this browser.", 'system');
        } else {
            this.addMessage("Voice chat deactivated.", 'system');
        }
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (!voiceBtn) return;
        
        if (this.isListening) {
            voiceBtn.textContent = '⏹️ Stop Listening';
            voiceBtn.className = 'bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition';
        } else if (this.isVoiceEnabled) {
            voiceBtn.textContent = '🎤 Click to Speak';
            voiceBtn.className = 'bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition';
        } else {
            voiceBtn.textContent = '🎤 Start Voice Chat';
            voiceBtn.className = 'bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition';
        }
    }

    startListening() {
        if (this.recognition && this.isVoiceEnabled && !this.isListening) {
            this.isListening = true;
            this.updateVoiceButton();
            this.recognition.start();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const muteBtn = document.getElementById('muteBtn');
        if (!muteBtn) return;
        
        if (this.isMuted) {
            muteBtn.textContent = '🔊 Unmute Voice';
            muteBtn.className = 'bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition';
        } else {
            muteBtn.textContent = '🔇 Mute Voice';
            muteBtn.className = 'bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition';
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'chat-bubble avatar';
        typingDiv.innerHTML = '<p class="text-gray-500 italic">Dr. Mira is typing...</p>';
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Global functions
function sendSuggested(message) {
    if (window.aiAvatar) {
        document.getElementById('chatInput').value = message;
        window.aiAvatar.sendMessage();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Initializing AI Avatar...');
        window.aiAvatar = new AIAvatar();
        console.log('AI Avatar initialized successfully');
    } catch (error) {
        console.error('Error initializing AI Avatar:', error);
    }
});
