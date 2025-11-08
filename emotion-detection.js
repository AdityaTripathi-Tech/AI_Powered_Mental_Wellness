// AI Emotion Detection System
class EmotionDetector {
    constructor() {
        this.video = document.getElementById('webcam');
        this.canvas = document.getElementById('overlay');
        this.ctx = this.canvas.getContext('2d');
        this.isDetecting = false;
        this.emotionHistory = JSON.parse(localStorage.getItem('emotionHistory')) || [];
        this.moodData = JSON.parse(localStorage.getItem('moodData')) || this.initializeMoodData();
        this.chart = null;
        
        this.emotions = {
            happy: 0, sad: 0, angry: 0, anxious: 0, calm: 0
        };
        
        this.initializeEventListeners();
        this.initializeMoodChart();
        this.updateEmotionHistory();
        this.updateMoodStats();
    }

    initializeMoodData() {
        const data = {
            labels: [],
            datasets: [{
                label: 'Mood Score',
                data: [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        };
        
        // Initialize with sample data for demo
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.labels.push(date.toLocaleDateString());
            data.datasets[0].data.push(Math.floor(Math.random() * 40) + 60); // 60-100 range
        }
        
        return data;
    }

    initializeEventListeners() {
        document.getElementById('startCamera').addEventListener('click', () => this.startCamera());
        document.getElementById('stopCamera').addEventListener('click', () => this.stopCamera());
        document.getElementById('captureEmotion').addEventListener('click', () => this.captureEmotion());
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            this.video.srcObject = stream;
            this.video.play();
            
            document.getElementById('startCamera').disabled = true;
            document.getElementById('stopCamera').disabled = false;
            document.getElementById('captureEmotion').disabled = false;
            
            // Start emotion detection simulation
            this.startEmotionDetection();
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Camera access denied. Using simulation mode.');
            this.startSimulationMode();
        }
    }

    stopCamera() {
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
        }
        
        this.isDetecting = false;
        document.getElementById('startCamera').disabled = false;
        document.getElementById('stopCamera').disabled = true;
        document.getElementById('captureEmotion').disabled = true;
    }

    startEmotionDetection() {
        this.isDetecting = true;
        this.detectEmotions();
    }

    startSimulationMode() {
        // Simulate camera for demo purposes
        this.video.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        this.video.style.display = 'flex';
        this.video.style.alignItems = 'center';
        this.video.style.justifyContent = 'center';
        this.video.innerHTML = '<div style="color: white; font-size: 24px;">📹 Simulation Mode</div>';
        
        document.getElementById('startCamera').disabled = true;
        document.getElementById('stopCamera').disabled = false;
        document.getElementById('captureEmotion').disabled = false;
        
        this.startEmotionDetection();
    }

    detectEmotions() {
        if (!this.isDetecting) return;

        // Simulate emotion detection with realistic patterns
        const emotionPatterns = this.generateRealisticEmotions();
        this.emotions = emotionPatterns;
        
        this.updateEmotionBars();
        this.updateCurrentEmotion();
        this.generateAIRecommendations();
        
        // Continue detection
        setTimeout(() => this.detectEmotions(), 2000);
    }

    generateRealisticEmotions() {
        const baseTime = Date.now();
        const timeOfDay = new Date().getHours();
        
        // Simulate realistic emotion patterns based on time of day
        let emotions = { happy: 0, sad: 0, angry: 0, anxious: 0, calm: 0 };
        
        if (timeOfDay >= 6 && timeOfDay <= 12) {
            // Morning - generally more positive
            emotions.happy = Math.random() * 60 + 30;
            emotions.calm = Math.random() * 40 + 20;
            emotions.anxious = Math.random() * 20;
            emotions.sad = Math.random() * 15;
            emotions.angry = Math.random() * 10;
        } else if (timeOfDay >= 13 && timeOfDay <= 18) {
            // Afternoon - mixed emotions
            emotions.happy = Math.random() * 50 + 20;
            emotions.calm = Math.random() * 30 + 15;
            emotions.anxious = Math.random() * 30 + 10;
            emotions.sad = Math.random() * 20;
            emotions.angry = Math.random() * 15;
        } else {
            // Evening/Night - more calm or tired
            emotions.calm = Math.random() * 50 + 25;
            emotions.happy = Math.random() * 40 + 15;
            emotions.anxious = Math.random() * 25;
            emotions.sad = Math.random() * 30;
            emotions.angry = Math.random() * 10;
        }
        
        // Add some randomness
        Object.keys(emotions).forEach(key => {
            emotions[key] += (Math.random() - 0.5) * 20;
            emotions[key] = Math.max(0, Math.min(100, emotions[key]));
        });
        
        return emotions;
    }

    updateEmotionBars() {
        Object.keys(this.emotions).forEach(emotion => {
            const score = Math.round(this.emotions[emotion]);
            const bar = document.getElementById(`${emotion}Bar`);
            const scoreElement = document.getElementById(`${emotion}Score`);
            
            if (bar && scoreElement) {
                bar.style.width = `${score}%`;
                scoreElement.textContent = `${score}%`;
            }
        });
    }

    updateCurrentEmotion() {
        const dominantEmotion = Object.keys(this.emotions).reduce((a, b) => 
            this.emotions[a] > this.emotions[b] ? a : b
        );
        
        const emotionEmojis = {
            happy: '😊', sad: '😢', angry: '😠', anxious: '😰', calm: '😌'
        };
        
        const emotionNames = {
            happy: 'Happy', sad: 'Sad', angry: 'Angry', anxious: 'Anxious', calm: 'Calm'
        };
        
        const confidence = Math.round(this.emotions[dominantEmotion]);
        
        document.getElementById('currentEmotion').textContent = 
            `${emotionEmojis[dominantEmotion]} ${emotionNames[dominantEmotion]}`;
        document.getElementById('emotionConfidence').textContent = 
            `Confidence: ${confidence}%`;
    }

    generateAIRecommendations() {
        const dominantEmotion = Object.keys(this.emotions).reduce((a, b) => 
            this.emotions[a] > this.emotions[b] ? a : b
        );
        
        const recommendations = {
            happy: [
                "Great mood detected! Try the Memory Pattern game to enhance your cognitive abilities.",
                "You're feeling positive! This is a perfect time for journaling about your achievements.",
                "Consider sharing your positive energy by connecting with a therapist for others."
            ],
            sad: [
                "I notice you might be feeling down. Try the Breathing Sync exercise to help regulate your mood.",
                "The Color Board therapy can help you express and process these feelings creatively.",
                "Consider writing in your journal about what's troubling you - it can provide clarity."
            ],
            angry: [
                "Anger detected. The Focus Challenge game can help redirect this energy positively.",
                "Try progressive muscle relaxation in the Sleep section to release tension.",
                "Deep breathing exercises are highly recommended right now."
            ],
            anxious: [
                "Anxiety levels seem elevated. The Breathing Sync game is specifically designed for this.",
                "Consider the Sleep Relaxation module for immediate anxiety relief.",
                "Journaling your worries can help identify triggers and solutions."
            ],
            calm: [
                "You're in a great state of mind! This is perfect for the Memory Pattern challenge.",
                "Your calmness makes this an ideal time for self-reflection through journaling.",
                "Consider exploring advanced CBT techniques while you're feeling centered."
            ]
        };
        
        const randomRec = recommendations[dominantEmotion][
            Math.floor(Math.random() * recommendations[dominantEmotion].length)
        ];
        
        document.getElementById('aiRecommendations').textContent = randomRec;
    }

    captureEmotion() {
        const timestamp = new Date();
        const dominantEmotion = Object.keys(this.emotions).reduce((a, b) => 
            this.emotions[a] > this.emotions[b] ? a : b
        );
        
        const emotionEntry = {
            timestamp: timestamp.toISOString(),
            emotion: dominantEmotion,
            confidence: Math.round(this.emotions[dominantEmotion]),
            scores: { ...this.emotions }
        };
        
        this.emotionHistory.unshift(emotionEntry);
        this.emotionHistory = this.emotionHistory.slice(0, 50); // Keep last 50 entries
        
        localStorage.setItem('emotionHistory', JSON.stringify(this.emotionHistory));
        
        // Update mood data for chart
        this.updateMoodData(emotionEntry);
        this.updateEmotionHistory();
        this.updateMoodStats();
        
        // Show success message
        this.showCaptureSuccess();
    }

    updateMoodData(emotionEntry) {
        const today = new Date().toLocaleDateString();
        const moodScore = this.calculateMoodScore(emotionEntry.scores);
        
        // Update today's data or add new entry
        const todayIndex = this.moodData.labels.indexOf(today);
        if (todayIndex !== -1) {
            this.moodData.datasets[0].data[todayIndex] = moodScore;
        } else {
            this.moodData.labels.push(today);
            this.moodData.datasets[0].data.push(moodScore);
            
            // Keep only last 7 days
            if (this.moodData.labels.length > 7) {
                this.moodData.labels.shift();
                this.moodData.datasets[0].data.shift();
            }
        }
        
        localStorage.setItem('moodData', JSON.stringify(this.moodData));
        this.chart.update();
    }

    calculateMoodScore(emotions) {
        // Calculate overall mood score (0-100)
        const positiveScore = (emotions.happy + emotions.calm) * 0.6;
        const negativeScore = (emotions.sad + emotions.angry + emotions.anxious) * 0.4;
        return Math.max(0, Math.min(100, positiveScore - negativeScore + 50));
    }

    initializeMoodChart() {
        const ctx = document.getElementById('moodChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: this.moodData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    updateEmotionHistory() {
        const historyContainer = document.getElementById('emotionHistory');
        
        if (this.emotionHistory.length === 0) {
            historyContainer.innerHTML = '<p class="text-gray-500 text-center">No emotion data captured yet. Start the camera and capture your emotions!</p>';
            return;
        }
        
        const emotionEmojis = {
            happy: '😊', sad: '😢', angry: '😠', anxious: '😰', calm: '😌'
        };
        
        historyContainer.innerHTML = this.emotionHistory.slice(0, 10).map(entry => {
            const date = new Date(entry.timestamp);
            return `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${emotionEmojis[entry.emotion]}</span>
                        <div>
                            <div class="font-semibold capitalize">${entry.emotion}</div>
                            <div class="text-sm text-gray-600">${date.toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-semibold">${entry.confidence}%</div>
                        <div class="text-sm text-gray-600">Confidence</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateMoodStats() {
        // Calculate today's average
        const today = new Date().toDateString();
        const todayEntries = this.emotionHistory.filter(entry => 
            new Date(entry.timestamp).toDateString() === today
        );
        
        if (todayEntries.length > 0) {
            const avgMood = todayEntries.reduce((sum, entry) => 
                sum + this.calculateMoodScore(entry.scores), 0
            ) / todayEntries.length;
            
            const moodEmoji = avgMood >= 80 ? '😊' : avgMood >= 60 ? '😐' : avgMood >= 40 ? '😔' : '😢';
            const moodText = avgMood >= 80 ? 'Excellent' : avgMood >= 60 ? 'Good' : avgMood >= 40 ? 'Fair' : 'Needs Care';
            
            document.getElementById('todayAverage').textContent = `${moodEmoji} ${moodText}`;
        }
        
        // Calculate weekly trend
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const recentEntries = this.emotionHistory.filter(entry => 
            new Date(entry.timestamp) >= weekAgo
        );
        
        if (recentEntries.length >= 2) {
            const firstHalf = recentEntries.slice(recentEntries.length / 2);
            const secondHalf = recentEntries.slice(0, recentEntries.length / 2);
            
            const firstAvg = firstHalf.reduce((sum, entry) => 
                sum + this.calculateMoodScore(entry.scores), 0
            ) / firstHalf.length;
            
            const secondAvg = secondHalf.reduce((sum, entry) => 
                sum + this.calculateMoodScore(entry.scores), 0
            ) / secondHalf.length;
            
            const trend = secondAvg > firstAvg ? '📈 Improving' : secondAvg < firstAvg ? '📉 Declining' : '➡️ Stable';
            document.getElementById('weeklyTrend').textContent = trend;
        }
        
        // Update streak
        const streak = this.calculateMoodStreak();
        document.getElementById('moodStreak').textContent = `${streak} Days`;
    }

    calculateMoodStreak() {
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateString = checkDate.toDateString();
            
            const dayEntries = this.emotionHistory.filter(entry => 
                new Date(entry.timestamp).toDateString() === dateString
            );
            
            if (dayEntries.length > 0) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    showCaptureSuccess() {
        const button = document.getElementById('captureEmotion');
        const originalText = button.textContent;
        button.textContent = '✅ Captured!';
        button.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Initialize emotion detector when page loads
document.addEventListener('DOMContentLoaded', function() {
    new EmotionDetector();
});
