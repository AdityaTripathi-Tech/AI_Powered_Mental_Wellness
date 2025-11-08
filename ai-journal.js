// AI Journal System with Sentiment Analysis
class AIJournal {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        this.moodData = JSON.parse(localStorage.getItem('journalMoodData')) || this.initializeMoodData();
        this.currentMood = null;
        this.chart = null;
        
        this.initializeEventListeners();
        this.initializeMoodChart();
        this.updateStats();
        this.loadRecentEntries();
        this.setupWordCount();
    }

    initializeMoodData() {
        const data = {
            labels: [],
            datasets: [{
                label: 'Mood Score',
                data: [],
                borderColor: 'rgb(147, 51, 234)',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
        
        // Initialize with sample data
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.labels.push(date.toLocaleDateString());
            data.datasets[0].data.push(Math.floor(Math.random() * 30) + 70);
        }
        
        return data;
    }

    initializeEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeEntry());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveEntry());
        
        // Mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectMood(btn.dataset.mood));
        });
        
        // Writing prompts
        document.querySelectorAll('.prompt-btn').forEach(btn => {
            btn.addEventListener('click', () => this.usePrompt(btn.textContent));
        });
    }

    setupWordCount() {
        const textarea = document.getElementById('journalText');
        const wordCount = document.getElementById('wordCount');
        const charCount = document.getElementById('charCount');
        
        textarea.addEventListener('input', () => {
            const text = textarea.value;
            const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            const chars = text.length;
            
            wordCount.textContent = words;
            charCount.textContent = chars;
        });
    }

    selectMood(mood) {
        // Remove previous selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'bg-blue-50');
        });
        
        // Add selection to clicked button
        const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
        selectedBtn.classList.add('border-blue-500', 'bg-blue-50');
        
        this.currentMood = mood;
    }

    usePrompt(prompt) {
        const textarea = document.getElementById('journalText');
        const currentText = textarea.value;
        const newText = currentText + (currentText ? '\n\n' : '') + prompt + '\n\n';
        textarea.value = newText;
        textarea.focus();
        
        // Update word count
        textarea.dispatchEvent(new Event('input'));
    }

    async analyzeEntry() {
        const text = document.getElementById('journalText').value.trim();
        
        if (!text) {
            alert('Please write something in your journal first!');
            return;
        }
        
        // Show loading state
        const analyzeBtn = document.getElementById('analyzeBtn');
        const originalText = analyzeBtn.textContent;
        analyzeBtn.textContent = '🤖 Analyzing...';
        analyzeBtn.disabled = true;
        
        // Simulate AI analysis (in real implementation, this would call your Python backend)
        const analysis = await this.performSentimentAnalysis(text);
        
        // Display results
        this.displayAnalysisResults(analysis);
        
        // Reset button
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
        
        // Show analysis section
        document.getElementById('aiAnalysis').classList.remove('hidden');
    }

    async performSentimentAnalysis(text) {
        // Simulate AI sentiment analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simple sentiment analysis simulation
        const positiveWords = ['happy', 'good', 'great', 'amazing', 'wonderful', 'excited', 'grateful', 'love', 'joy', 'peaceful', 'calm', 'confident', 'hopeful', 'proud', 'satisfied'];
        const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'angry', 'frustrated', 'worried', 'anxious', 'depressed', 'lonely', 'scared', 'upset', 'disappointed', 'stressed', 'overwhelmed'];
        const stressWords = ['stress', 'pressure', 'overwhelmed', 'busy', 'deadline', 'worry', 'panic', 'rush', 'urgent', 'crisis'];
        
        const words = text.toLowerCase().split(/\W+/);
        
        let positiveCount = 0;
        let negativeCount = 0;
        let stressCount = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
            if (stressWords.includes(word)) stressCount++;
        });
        
        // Calculate sentiment score (-100 to 100)
        const totalEmotionalWords = positiveCount + negativeCount;
        let sentimentScore = 0;
        
        if (totalEmotionalWords > 0) {
            sentimentScore = Math.round(((positiveCount - negativeCount) / totalEmotionalWords) * 100);
        }
        
        // Determine emotional tone
        let emotionalTone = '😐';
        if (sentimentScore > 30) emotionalTone = '😊';
        else if (sentimentScore > 10) emotionalTone = '🙂';
        else if (sentimentScore < -30) emotionalTone = '😢';
        else if (sentimentScore < -10) emotionalTone = '😔';
        
        // Determine stress level
        let stressLevel = 'Low';
        if (stressCount > 3) stressLevel = 'High';
        else if (stressCount > 1) stressLevel = 'Medium';
        
        return {
            sentimentScore,
            emotionalTone,
            stressLevel,
            positiveCount,
            negativeCount,
            stressCount,
            wordCount: words.length
        };
    }

    displayAnalysisResults(analysis) {
        document.getElementById('sentimentScore').textContent = analysis.sentimentScore;
        document.getElementById('emotionalTone').textContent = analysis.emotionalTone;
        document.getElementById('stressLevel').textContent = analysis.stressLevel;
        
        // Generate AI suggestions based on analysis
        const suggestions = this.generateAISuggestions(analysis);
        const suggestionsContainer = document.getElementById('aiSuggestions');
        
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="ai-suggestion">
                <div class="font-semibold mb-2">${suggestion.title}</div>
                <div class="text-sm opacity-90">${suggestion.content}</div>
            </div>
        `).join('');
    }

    generateAISuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.sentimentScore < -20) {
            suggestions.push({
                title: '🌟 Cognitive Reframing Suggestion',
                content: 'I notice some negative thoughts in your entry. Try rewriting one negative thought in a more balanced way. What evidence supports and contradicts this thought?'
            });
            
            suggestions.push({
                title: '🫁 Breathing Exercise Recommendation',
                content: 'Your emotional tone suggests you might benefit from the Breathing Sync game in our Mind Gym. It can help regulate difficult emotions.'
            });
        }
        
        if (analysis.stressLevel === 'High') {
            suggestions.push({
                title: '🧘 Stress Management Technique',
                content: 'High stress detected. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.'
            });
            
            suggestions.push({
                title: '🎯 Priority Setting',
                content: 'Consider breaking down overwhelming tasks into smaller, manageable steps. What\'s the most important thing you can focus on right now?'
            });
        }
        
        if (analysis.sentimentScore > 20) {
            suggestions.push({
                title: '✨ Gratitude Amplification',
                content: 'Great positive energy! Consider writing down three specific things you\'re grateful for today to reinforce these positive feelings.'
            });
            
            suggestions.push({
                title: '🤝 Share the Positivity',
                content: 'Your positive mood could be contagious! Consider reaching out to someone who might benefit from your good energy today.'
            });
        }
        
        if (analysis.positiveCount === 0 && analysis.negativeCount === 0) {
            suggestions.push({
                title: '💭 Emotional Awareness',
                content: 'Your entry seems emotionally neutral. Try exploring: How are you really feeling right now? What emotions might be hiding beneath the surface?'
            });
        }
        
        // Always include a CBT technique
        const cbtTechniques = [
            {
                title: '🔍 Thought Record Practice',
                content: 'Try identifying the situation, your automatic thought, emotion, and a more balanced thought. This helps build emotional awareness.'
            },
            {
                title: '📝 Behavioral Experiment',
                content: 'If you mentioned avoiding something, consider a small step you could take toward facing that challenge. What would you advise a friend?'
            },
            {
                title: '🎭 Role Reversal',
                content: 'Imagine you\'re advising your best friend who wrote this entry. What compassionate, helpful advice would you give them?'
            }
        ];
        
        suggestions.push(cbtTechniques[Math.floor(Math.random() * cbtTechniques.length)]);
        
        return suggestions.slice(0, 3); // Return max 3 suggestions
    }

    saveEntry() {
        const text = document.getElementById('journalText').value.trim();
        
        if (!text) {
            alert('Please write something before saving!');
            return;
        }
        
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            text: text,
            mood: this.currentMood,
            wordCount: text.split(/\s+/).length,
            sentiment: null // Will be filled if analyzed
        };
        
        // If already analyzed, include sentiment data
        const analysisSection = document.getElementById('aiAnalysis');
        if (!analysisSection.classList.contains('hidden')) {
            entry.sentiment = {
                score: parseInt(document.getElementById('sentimentScore').textContent),
                tone: document.getElementById('emotionalTone').textContent,
                stress: document.getElementById('stressLevel').textContent
            };
        }
        
        this.entries.unshift(entry);
        localStorage.setItem('journalEntries', JSON.stringify(this.entries));
        
        // Update mood data
        this.updateMoodData(entry);
        
        // Clear form
        document.getElementById('journalText').value = '';
        document.getElementById('wordCount').textContent = '0';
        document.getElementById('charCount').textContent = '0';
        analysisSection.classList.add('hidden');
        
        // Reset mood selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'bg-blue-50');
        });
        this.currentMood = null;
        
        // Update displays
        this.updateStats();
        this.loadRecentEntries();
        
        // Show success message
        this.showSaveSuccess();
    }

    updateMoodData(entry) {
        const today = new Date().toLocaleDateString();
        let moodScore = 75; // Default neutral
        
        if (entry.sentiment) {
            moodScore = Math.max(0, Math.min(100, entry.sentiment.score + 50));
        } else if (entry.mood) {
            const moodScores = {
                happy: 90, excited: 85, calm: 80,
                anxious: 40, sad: 30, angry: 25
            };
            moodScore = moodScores[entry.mood] || 75;
        }
        
        // Update today's data
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
        
        localStorage.setItem('journalMoodData', JSON.stringify(this.moodData));
        this.chart.update();
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

    updateStats() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Weekly entries
        const weeklyEntries = this.entries.filter(entry => 
            new Date(entry.date) >= weekAgo
        ).length;
        document.getElementById('weeklyEntries').textContent = weeklyEntries;
        
        // Current streak
        const streak = this.calculateStreak();
        document.getElementById('journalStreak').textContent = `${streak} days`;
        
        // Average mood
        const recentEntries = this.entries.slice(0, 7);
        if (recentEntries.length > 0) {
            const avgMood = this.calculateAverageMood(recentEntries);
            document.getElementById('averageMood').textContent = avgMood;
        }
        
        // Total words
        const totalWords = this.entries.reduce((sum, entry) => sum + entry.wordCount, 0);
        document.getElementById('totalWords').textContent = totalWords.toLocaleString();
    }

    calculateStreak() {
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateString = checkDate.toDateString();
            
            const hasEntry = this.entries.some(entry => 
                new Date(entry.date).toDateString() === dateString
            );
            
            if (hasEntry) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    calculateAverageMood(entries) {
        const moodScores = {
            happy: 90, excited: 85, calm: 80,
            anxious: 40, sad: 30, angry: 25
        };
        
        let totalScore = 0;
        let count = 0;
        
        entries.forEach(entry => {
            if (entry.sentiment) {
                totalScore += entry.sentiment.score + 50;
                count++;
            } else if (entry.mood) {
                totalScore += moodScores[entry.mood] || 75;
                count++;
            }
        });
        
        if (count === 0) return '😊 Good';
        
        const avg = totalScore / count;
        if (avg >= 80) return '😊 Excellent';
        if (avg >= 65) return '🙂 Good';
        if (avg >= 50) return '😐 Fair';
        return '😔 Needs Care';
    }

    loadRecentEntries() {
        const container = document.getElementById('recentEntries');
        
        if (this.entries.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">No journal entries yet. Start writing to see your entries here!</p>';
            return;
        }
        
        const recentEntries = this.entries.slice(0, 5);
        
        container.innerHTML = recentEntries.map(entry => {
            const date = new Date(entry.date);
            const preview = entry.text.substring(0, 150) + (entry.text.length > 150 ? '...' : '');
            
            let sentimentClass = 'sentiment-neutral';
            if (entry.sentiment) {
                if (entry.sentiment.score > 10) sentimentClass = 'sentiment-positive';
                else if (entry.sentiment.score < -10) sentimentClass = 'sentiment-negative';
            }
            
            const moodEmoji = entry.mood ? this.getMoodEmoji(entry.mood) : '';
            
            return `
                <div class="journal-entry ${sentimentClass} bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="viewEntry(${entry.id})">
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-sm text-gray-500">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
                        <div class="flex items-center space-x-2">
                            ${moodEmoji ? `<span class="text-lg">${moodEmoji}</span>` : ''}
                            ${entry.sentiment ? `<span class="text-xs px-2 py-1 rounded-full ${entry.sentiment.score > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${entry.sentiment.score > 0 ? '+' : ''}${entry.sentiment.score}</span>` : ''}
                        </div>
                    </div>
                    <p class="text-gray-700 leading-relaxed">${preview}</p>
                    <div class="mt-2 text-xs text-gray-500">${entry.wordCount} words</div>
                </div>
            `;
        }).join('');
    }

    getMoodEmoji(mood) {
        const emojis = {
            happy: '😊', excited: '🤗', calm: '😌',
            anxious: '😰', sad: '😢', angry: '😠'
        };
        return emojis[mood] || '';
    }

    showSaveSuccess() {
        const button = document.getElementById('saveBtn');
        const originalText = button.textContent;
        button.textContent = '✅ Saved!';
        button.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Global function for viewing entries
function viewEntry(entryId) {
    const journal = new AIJournal();
    const entry = journal.entries.find(e => e.id === entryId);
    
    if (entry) {
        alert(`Entry from ${new Date(entry.date).toLocaleString()}:\n\n${entry.text}`);
    }
}

// Initialize journal when page loads
document.addEventListener('DOMContentLoaded', function() {
    new AIJournal();
});
