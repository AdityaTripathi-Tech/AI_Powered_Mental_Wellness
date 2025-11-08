// AI Avatar Companion System with Gemini AI Integration
class AIAvatar {
    constructor() {
        this.isVoiceEnabled = false;
        this.isMuted = false;
        this.isListening = false;
        this.sessionStartTime = new Date();
        this.messageCount = 0;
        this.conversationHistory = JSON.parse(localStorage.getItem('avatarConversations')) || [];
        
        // Gemini AI Configuration
        this.geminiApiKey = 'AIzaSyCnNCvI05E3p4wCTLkeASEJHadt7QhSKeY';
        this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        // Speech Recognition and Synthesis
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voicesLoaded = false;
        
        // Wait for voices to load
        this.loadVoices();
        
        this.initializeSpeechRecognition();
        this.responses = this.initializeResponses();
        this.currentMood = 'neutral';
        
        this.initializeEventListeners();
        this.startSessionTimer();
        this.loadConversationHistory();
        
        // Add welcome message
        setTimeout(() => {
            this.addMessage("Hello! I'm Dr. Mira, your AI companion. I'm here to support you with your mental health journey. How can I help you today?", 'avatar');
        }, 1000);
    }

    loadVoices() {
        // Load voices and handle the voiceschanged event
        const loadVoicesWhenAvailable = () => {
            const voices = this.synthesis.getVoices();
            if (voices.length > 0) {
                this.voicesLoaded = true;
                console.log('Voices loaded:', voices.length);
            } else {
                // Try again in 100ms
                setTimeout(loadVoicesWhenAvailable, 100);
            }
        };
        
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = loadVoicesWhenAvailable;
        }
        
        // Also try to load immediately
        loadVoicesWhenAvailable();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceButton();
                this.addSystemMessage("🎤 Listening... Speak now!");
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatInput').value = transcript;
                this.sendMessage();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.addSystemMessage("❌ Voice recognition error. Please try again.");
                this.isListening = false;
                this.updateVoiceButton();
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton();
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
        }
    }

    initializeResponses() {
        return {
            greetings: [
                "Hello! I'm Dr. Mira. How can I support you today?",
                "Hi there! I'm here to help with whatever you're going through.",
                "Welcome! I'm glad you're here. What's on your mind?"
            ],
            anxiety: [
                "I understand you're feeling anxious. Let's try a quick breathing exercise together. Breathe in for 4 counts, hold for 4, then exhale for 6. Would you like me to guide you through this?",
                "Anxiety can feel overwhelming, but remember - you've gotten through difficult times before. Let's focus on what you can control right now. What's one small thing you can do to feel more grounded?",
                "When anxiety strikes, it helps to use the 5-4-3-2-1 technique. Can you name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste?"
            ],
            sad: [
                "I hear that you're feeling sad, and that's completely valid. Sadness is a natural human emotion. Can you tell me what might be contributing to these feelings?",
                "It's okay to feel sad sometimes. You don't have to rush through this feeling. What would bring you a small moment of comfort right now?",
                "Sadness can feel heavy, but it's also a sign that something matters to you. Would you like to explore what this sadness might be telling you?"
            ],
            overwhelmed: [
                "Feeling overwhelmed is like having too many browser tabs open in your mind. Let's close some of them together. What's the most urgent thing you need to address right now?",
                "When everything feels like too much, we need to break it down. Can you list three things that are making you feel overwhelmed? We'll tackle them one by one.",
                "Overwhelm often comes from trying to control too much at once. What's one thing you can let go of or delegate today?"
            ],
            motivation: [
                "Motivation isn't always about feeling ready - sometimes it's about taking the first small step. What's one tiny action you could take right now toward your goal?",
                "Remember why you started. What initially inspired you to pursue this? That spark is still inside you, even if it feels dim right now.",
                "Progress isn't always linear. You've already come so far, even if it doesn't feel like it. What's one thing you've accomplished recently that you can celebrate?"
            ],
            cbt_techniques: [
                "Let's try a thought record. What's the situation that's bothering you? What automatic thought came up? How did it make you feel? Now, what evidence supports or contradicts this thought?",
                "I notice some all-or-nothing thinking in what you shared. Life rarely exists in absolutes. What might be a more balanced way to view this situation?",
                "That sounds like a cognitive distortion called 'mind reading' - assuming you know what others are thinking. What evidence do you actually have for this belief?"
            ],
            encouragement: [
                "You're being incredibly brave by reaching out and working on yourself. That takes real courage.",
                "Every small step you take toward better mental health matters. You're doing important work.",
                "Healing isn't linear, and you're exactly where you need to be in your journey right now."
            ],
            default: [
                "I'm here to listen and support you. Can you tell me more about what you're experiencing?",
                "That sounds important. How does that make you feel?",
                "I want to understand better. Can you help me see this from your perspective?"
            ]
        };
    }

    initializeEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const voiceBtn = document.getElementById('voiceBtn');
        const muteBtn = document.getElementById('muteBtn');

        // Chat input events
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        chatInput.addEventListener('input', (e) => {
            const charCount = e.target.value.length;
            document.getElementById('charCount').textContent = `${charCount}/500`;
            
            if (charCount > 500) {
                e.target.value = e.target.value.substring(0, 500);
            }
        });

        sendBtn.addEventListener('click', () => this.sendMessage());
        voiceBtn.addEventListener('click', () => {
            if (this.isVoiceEnabled && !this.isListening) {
                this.startListening();
            } else {
                this.toggleVoice();
            }
        });
        muteBtn.addEventListener('click', () => this.toggleMute());
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        document.getElementById('charCount').textContent = '0/500';
        
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
                
                this.updateSuggestedResponses(message);
            } catch (error) {
                console.error('Error generating response:', error);
                this.addMessage("I'm sorry, I'm having trouble responding right now. Please try again.", 'avatar');
            }
        }, 1500 + Math.random() * 1000); // Realistic typing delay
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-bubble ${sender}`;
        
        if (sender === 'avatar') {
            // Add avatar emoji for AI messages
            messageDiv.innerHTML = `<div class="flex items-start space-x-2">
                <span class="text-lg">🤖</span>
                <p class="flex-1">${message}</p>
            </div>`;
        } else {
            messageDiv.innerHTML = `<p>${message}</p>`;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Update message count
        this.messageCount++;
        document.getElementById('messageCount').textContent = this.messageCount;
        
        // Save to conversation history
        this.conversationHistory.push({
            message: message,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('avatarConversations', JSON.stringify(this.conversationHistory));
        
        // Store on blockchain if available
        if (window.privacyManager && sender === 'user') {
            window.privacyManager.storeTherapistInteraction({
                therapistId: 'ai-avatar',
                type: 'chat_message',
                notes: message,
                timestamp: new Date().toISOString()
            });
        }
        
        // Update avatar expression based on message sentiment
        this.updateAvatarExpression(message, sender);
    }

    async generateResponse(userMessage) {
        try {
            // Try Gemini AI first
            const geminiResponse = await this.getGeminiResponse(userMessage);
            if (geminiResponse) {
                return geminiResponse;
            }
        } catch (error) {
            console.warn('Gemini AI unavailable, using fallback responses:', error);
        }
        
        // Fallback to local responses
        const message = userMessage.toLowerCase();
        
        // Analyze message for keywords and sentiment
        if (this.containsKeywords(message, ['anxious', 'anxiety', 'worried', 'panic', 'nervous'])) {
            return this.getRandomResponse('anxiety');
        } else if (this.containsKeywords(message, ['sad', 'depressed', 'down', 'upset', 'crying'])) {
            return this.getRandomResponse('sad');
        } else if (this.containsKeywords(message, ['overwhelmed', 'stressed', 'too much', 'can\'t handle'])) {
            return this.getRandomResponse('overwhelmed');
        } else if (this.containsKeywords(message, ['motivation', 'motivated', 'give up', 'quit', 'lazy'])) {
            return this.getRandomResponse('motivation');
        } else if (this.containsKeywords(message, ['thought', 'thinking', 'believe', 'assume'])) {
            return this.getRandomResponse('cbt_techniques');
        } else if (this.containsKeywords(message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
            return this.getRandomResponse('greetings');
        } else if (this.containsKeywords(message, ['thank', 'thanks', 'grateful', 'appreciate'])) {
            return this.getRandomResponse('encouragement');
        } else {
            return this.getRandomResponse('default');
        }
    }

    async getGeminiResponse(userMessage) {
        const prompt = `You are Dr. Mira, a compassionate AI therapist specializing in Cognitive Behavioral Therapy (CBT). 
        
        Your role:
        - Provide empathetic, professional mental health support
        - Use CBT techniques and principles in your responses
        - Keep responses concise (2-3 sentences max)
        - Be warm, understanding, and non-judgmental
        - Suggest practical coping strategies when appropriate
        - Never provide medical diagnoses or replace professional therapy
        
        User message: "${userMessage}"
        
        Respond as Dr. Mira would, offering support and guidance:`;

        try {
            const response = await fetch(`${this.geminiEndpoint}?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 200,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text.trim();
            }
            
            throw new Error('Invalid response format from Gemini API');
            
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getRandomResponse(category) {
        const responses = this.responses[category] || this.responses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    updateAvatarExpression(message, sender) {
        const avatarFace = document.getElementById('avatarFace');
        
        if (sender === 'user') {
            const message_lower = message.toLowerCase();
            
            if (this.containsKeywords(message_lower, ['happy', 'good', 'great', 'awesome', 'wonderful'])) {
                avatarFace.textContent = '😊';
                this.currentMood = 'happy';
            } else if (this.containsKeywords(message_lower, ['sad', 'upset', 'crying', 'depressed'])) {
                avatarFace.textContent = '😔';
                this.currentMood = 'concerned';
            } else if (this.containsKeywords(message_lower, ['anxious', 'worried', 'nervous', 'panic'])) {
                avatarFace.textContent = '😌';
                this.currentMood = 'calming';
            } else {
                avatarFace.textContent = '🤖';
                this.currentMood = 'neutral';
            }
        } else {
            // Avatar is responding - show thinking/speaking expression
            avatarFace.textContent = '💭';
            setTimeout(() => {
                avatarFace.textContent = '🤖';
            }, 2000);
        }
    }

    showTypingIndicator() {
        document.getElementById('typingIndicator').classList.remove('hidden');
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        document.getElementById('typingIndicator').classList.add('hidden');
    }

    updateSuggestedResponses(lastMessage) {
        const suggestionsContainer = document.getElementById('suggestedResponses');
        let suggestions = [];
        
        const message = lastMessage.toLowerCase();
        
        if (this.containsKeywords(message, ['anxious', 'anxiety', 'worried'])) {
            suggestions = [
                "Can you teach me a grounding technique?",
                "I want to try breathing exercises",
                "Help me challenge my anxious thoughts"
            ];
        } else if (this.containsKeywords(message, ['sad', 'depressed', 'down'])) {
            suggestions = [
                "What can I do to feel better?",
                "Help me find some hope",
                "I want to practice self-compassion"
            ];
        } else if (this.containsKeywords(message, ['overwhelmed', 'stressed'])) {
            suggestions = [
                "Help me prioritize my tasks",
                "I need to learn to say no",
                "Teach me stress management"
            ];
        } else {
            suggestions = [
                "Tell me about CBT techniques",
                "I want to work on my thoughts",
                "Help me set a goal"
            ];
        }
        
        suggestionsContainer.innerHTML = suggestions.map(suggestion => 
            `<button onclick="sendSuggested('${suggestion}')" class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition">
                ${suggestion}
            </button>`
        ).join('');
    }

    toggleVoice() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceVisualization = document.getElementById('voiceVisualization');
        
        if (this.isListening) {
            // Stop listening
            if (this.recognition) {
                this.recognition.stop();
            }
            this.isListening = false;
            this.updateVoiceButton();
            return;
        }
        
        this.isVoiceEnabled = !this.isVoiceEnabled;
        
        if (this.isVoiceEnabled) {
            voiceBtn.textContent = '🎤 Stop Voice Chat';
            voiceBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            voiceBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            voiceVisualization.classList.remove('hidden');
            
            if (this.recognition) {
                this.addSystemMessage("🎤 Voice chat activated! Click the microphone and speak when ready.");
            } else {
                this.addSystemMessage("❌ Voice recognition not supported in this browser. Please use text chat.");
            }
        } else {
            voiceBtn.textContent = '🎤 Start Voice Chat';
            voiceBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
            voiceBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            voiceVisualization.classList.add('hidden');
            this.addSystemMessage("Voice chat deactivated.");
        }
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        
        if (this.isListening) {
            voiceBtn.textContent = '⏹️ Stop Listening';
            voiceBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'bg-red-600', 'hover:bg-red-700');
            voiceBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700');
        } else if (this.isVoiceEnabled) {
            voiceBtn.textContent = '🎤 Click to Speak';
            voiceBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
            voiceBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        } else {
            voiceBtn.textContent = '🎤 Start Voice Chat';
            voiceBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700', 'bg-green-600', 'hover:bg-green-700');
            voiceBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
    }

    startListening() {
        if (this.recognition && this.isVoiceEnabled && !this.isListening) {
            this.recognition.start();
        }
    }

    speakText(text) {
        if (!this.synthesis || this.isMuted) return;
        
        try {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.85;  // Slightly slower for better clarity
            utterance.pitch = 1.2;  // Higher pitch for feminine voice
            utterance.volume = 0.9; // Slightly louder
            
            // Wait for voices to be loaded
            const speakWithVoice = () => {
                const voices = this.synthesis.getVoices();
                
                if (voices.length === 0) {
                    // Voices not loaded yet, try again
                    setTimeout(speakWithVoice, 100);
                    return;
                }
                
                // Priority order for female voices
                const femaleVoiceNames = [
                    'samantha',           // macOS
                    'karen',              // Windows
                    'zira',               // Windows
                    'hazel',              // Windows
                    'susan',              // macOS
                    'victoria',           // macOS
                    'female',             // Generic
                    'woman',              // Generic
                    'google us english female', // Chrome
                    'microsoft zira desktop', // Windows
                    'microsoft hazel desktop' // Windows
                ];
                
                let selectedVoice = null;
                
                // Try to find the best female voice
                for (const voiceName of femaleVoiceNames) {
                    selectedVoice = voices.find(voice => 
                        voice.name.toLowerCase().includes(voiceName)
                    );
                    if (selectedVoice) break;
                }
                
                // If no specific female voice found, try any voice with 'female' in name
                if (!selectedVoice) {
                    selectedVoice = voices.find(voice => 
                        voice.name.toLowerCase().includes('female') ||
                        voice.name.toLowerCase().includes('woman')
                    );
                }
                
                // Set the voice if found
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                    console.log(`Dr. Mira speaking with: ${selectedVoice.name}`);
                } else {
                    console.log('Dr. Mira speaking with default voice');
                }
                
                // Handle speech events
                utterance.onstart = () => {
                    const avatarFace = document.getElementById('avatarFace');
                    if (avatarFace) avatarFace.textContent = '🗣️';
                };
                
                utterance.onend = () => {
                    const avatarFace = document.getElementById('avatarFace');
                    if (avatarFace) avatarFace.textContent = '🤖';
                };
                
                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event.error);
                    const avatarFace = document.getElementById('avatarFace');
                    if (avatarFace) avatarFace.textContent = '🤖';
                };
                
                this.synthesis.speak(utterance);
            };
            
            speakWithVoice();
            
        } catch (error) {
            console.error('Error in speakText:', error);
        }
    }

    addSystemMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-bubble system';
        messageDiv.innerHTML = `<p class="text-sm text-gray-600 italic">${message}</p>`;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    toggleMute() {
        const muteBtn = document.getElementById('muteBtn');
        
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            muteBtn.textContent = '🔊 Unmute Voice';
            muteBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
            muteBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        } else {
            muteBtn.textContent = '🔇 Mute Voice';
            muteBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            muteBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
        }
    }

    startSessionTimer() {
        setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now - this.sessionStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            document.getElementById('sessionTime').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    loadConversationHistory() {
        // Load last few messages from history
        const recentMessages = this.conversationHistory.slice(-10);
        const messagesContainer = document.getElementById('chatMessages');
        
        // Clear existing messages except welcome message
        const welcomeMessage = messagesContainer.querySelector('.chat-bubble.avatar');
        messagesContainer.innerHTML = '';
        if (welcomeMessage) {
            messagesContainer.appendChild(welcomeMessage);
        }
        
        // Add recent messages
        recentMessages.forEach(msg => {
            if (msg.sender !== 'system') {
                this.addMessageToDOM(msg.message, msg.sender, false);
            }
        });
        
        this.messageCount = recentMessages.length;
        document.getElementById('messageCount').textContent = this.messageCount;
    }

    addMessageToDOM(message, sender, updateCount = true) {
        const messagesContainer = document.getElementById('chatMessages');
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
        
        if (updateCount) {
            this.messageCount++;
            document.getElementById('messageCount').textContent = this.messageCount;
        }
    }

    // Export conversation for analysis
    exportConversation() {
        const exportData = {
            sessionStart: this.sessionStartTime.toISOString(),
            sessionEnd: new Date().toISOString(),
            messageCount: this.messageCount,
            conversation: this.conversationHistory,
            mood: this.currentMood
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `ai-avatar-session-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// Global functions
function sendSuggested(message) {
    document.getElementById('chatInput').value = message;
    window.aiAvatar.sendMessage();
}

function quickHelp(type) {
    const messages = {
        anxiety: "I'm feeling anxious and need some help",
        sad: "I'm feeling sad and could use some support",
        overwhelmed: "I'm feeling overwhelmed with everything",
        motivation: "I'm struggling with motivation and need encouragement"
    };
    
    sendSuggested(messages[type]);
}

// Global functions for suggested responses
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
        // Show error message to user
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="chat-bubble system">
                    <p class="text-red-600">⚠️ Error loading Dr. Mira. Please refresh the page.</p>
                    <p class="text-sm text-gray-600">Error: ${error.message}</p>
                </div>
            `;
        }
    }
});    
    // Add welcome message after a short delay
    setTimeout(() => {
        if (window.aiAvatar && window.aiAvatar.conversationHistory.length === 0) {
            window.aiAvatar.addMessage("Welcome to your first session! I'm Dr. Mira, and I'm here to provide you with personalized CBT support. Feel free to share what's on your mind, or use the quick help buttons if you need immediate assistance with specific feelings.", 'avatar');
        }
});
