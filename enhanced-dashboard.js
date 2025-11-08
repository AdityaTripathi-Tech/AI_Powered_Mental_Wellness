// Enhanced Dashboard System
class EnhancedDashboard {
    constructor() {
        this.userData = this.loadUserData();
        this.charts = {};
        
        this.initializeDashboard();
        this.loadRecentData();
        this.updateStats();
        this.setupRealTimeUpdates();
    }

    loadUserData() {
        return {
            journalEntries: JSON.parse(localStorage.getItem('journalEntries')) || [],
            emotionHistory: JSON.parse(localStorage.getItem('emotionHistory')) || [],
            mindGymScores: JSON.parse(localStorage.getItem('mindGymScores')) || {},
            cbtToolsUsage: JSON.parse(localStorage.getItem('cbtToolsUsage')) || {},
            therapistInteractions: JSON.parse(localStorage.getItem('therapistInteractions')) || [],
            achievements: JSON.parse(localStorage.getItem('achievements')) || []
        };
    }

    initializeDashboard() {
        this.initializeMoodTrendChart();
        this.initializeToolsUsageChart();
        this.updateBlockchainStatus();
        this.loadRecommendedTherapists();
    }

    initializeMoodTrendChart() {
        const ctx = document.getElementById('moodTrendChart').getContext('2d');
        
        // Generate mood data for the last 7 days
        const moodData = this.generateMoodTrendData();
        
        this.charts.moodTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: moodData.labels,
                datasets: [{
                    label: 'Mood Score',
                    data: moodData.scores,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Anxiety Level',
                    data: moodData.anxiety,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
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

    initializeToolsUsageChart() {
        const ctx = document.getElementById('toolsUsageChart').getContext('2d');
        
        const toolsData = {
            labels: ['Breathing', 'Journaling', 'Meditation', 'Games', 'Therapy'],
            data: [25, 30, 15, 20, 10]
        };
        
        this.charts.toolsUsage = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: toolsData.labels,
                datasets: [{
                    data: toolsData.data,
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#8b5cf6',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    generateMoodTrendData() {
        const labels = [];
        const scores = [];
        const anxiety = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            // Generate realistic mood data with some correlation
            const baseScore = 70 + Math.random() * 20;
            const anxietyLevel = Math.max(0, 100 - baseScore + (Math.random() - 0.5) * 20);
            
            scores.push(Math.round(baseScore));
            anxiety.push(Math.round(anxietyLevel));
        }
        
        return { labels, scores, anxiety };
    }

    updateStats() {
        // Update main metrics
        const totalSessions = this.calculateTotalSessions();
        const averageMood = this.calculateAverageMood();
        const gamesPlayed = this.calculateGamesPlayed();
        const journalEntries = this.userData.journalEntries.length;
        
        document.getElementById('totalSessions').textContent = totalSessions;
        document.getElementById('averageMood').textContent = averageMood.toFixed(1);
        document.getElementById('gamesPlayed').textContent = gamesPlayed;
        document.getElementById('journalEntries').textContent = journalEntries;
        
        // Update streak
        const streak = this.calculateStreak();
        document.getElementById('currentStreak').textContent = streak;
        
        // Update last active
        document.getElementById('lastActive').textContent = this.getLastActiveTime();
    }

    calculateTotalSessions() {
        let total = 0;
        total += this.userData.journalEntries.length;
        total += this.userData.emotionHistory.length;
        total += Object.values(this.userData.mindGymScores).reduce((sum, score) => sum + (score || 0), 0);
        total += Object.values(this.userData.cbtToolsUsage).reduce((sum, usage) => sum + (usage || 0), 0);
        return Math.min(total, 999); // Cap at 999 for display
    }

    calculateAverageMood() {
        if (this.userData.emotionHistory.length === 0) return 7.5;
        
        const recentEmotions = this.userData.emotionHistory.slice(0, 10);
        const moodScores = recentEmotions.map(emotion => {
            // Convert emotion confidence to mood score
            const positiveEmotions = ['happy', 'calm', 'confident'];
            const negativeEmotions = ['sad', 'angry', 'anxious'];
            
            if (positiveEmotions.includes(emotion.emotion)) {
                return 7 + (emotion.confidence / 100) * 3;
            } else if (negativeEmotions.includes(emotion.emotion)) {
                return 5 - (emotion.confidence / 100) * 2;
            }
            return 6.5;
        });
        
        return moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
    }

    calculateGamesPlayed() {
        return Object.values(this.userData.mindGymScores).reduce((sum, score) => sum + Math.floor((score || 0) / 10), 0);
    }

    calculateStreak() {
        const today = new Date();
        let streak = 0;
        
        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateString = checkDate.toDateString();
            
            const hasActivity = this.hasActivityOnDate(dateString);
            if (hasActivity) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    hasActivityOnDate(dateString) {
        // Check journal entries
        const hasJournal = this.userData.journalEntries.some(entry => 
            new Date(entry.date).toDateString() === dateString
        );
        
        // Check emotion history
        const hasEmotion = this.userData.emotionHistory.some(entry => 
            new Date(entry.timestamp).toDateString() === dateString
        );
        
        return hasJournal || hasEmotion;
    }

    getLastActiveTime() {
        const now = new Date();
        const lastActivity = Math.max(
            this.userData.journalEntries.length > 0 ? new Date(this.userData.journalEntries[0].date).getTime() : 0,
            this.userData.emotionHistory.length > 0 ? new Date(this.userData.emotionHistory[0].timestamp).getTime() : 0
        );
        
        if (lastActivity === 0) return 'Never';
        
        const diffMs = now.getTime() - lastActivity;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours === 0) {
            return `${diffMinutes} minutes ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else {
            return new Date(lastActivity).toLocaleDateString();
        }
    }

    loadRecentData() {
        this.loadRecentJournalEntries();
    }

    loadRecentJournalEntries() {
        const container = document.getElementById('recentJournalEntries');
        const recentEntries = this.userData.journalEntries.slice(0, 3);
        
        if (recentEntries.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">No journal entries yet. <a href="ai-journal.html" class="text-blue-600 hover:underline">Start writing!</a></p>';
            return;
        }
        
        container.innerHTML = recentEntries.map(entry => {
            const date = new Date(entry.date);
            const preview = entry.text.substring(0, 100) + (entry.text.length > 100 ? '...' : '');
            
            let sentimentColor = 'gray';
            let sentimentText = 'Neutral';
            
            if (entry.sentiment) {
                if (entry.sentiment.score > 10) {
                    sentimentColor = 'green';
                    sentimentText = 'Positive';
                } else if (entry.sentiment.score < -10) {
                    sentimentColor = 'red';
                    sentimentText = 'Negative';
                }
            }
            
            return `
                <div class="border-l-4 border-${sentimentColor}-400 pl-4 py-2">
                    <div class="flex justify-between items-start mb-1">
                        <div class="text-sm font-medium text-gray-800">${date.toLocaleDateString()}</div>
                        <span class="text-xs px-2 py-1 bg-${sentimentColor}-100 text-${sentimentColor}-800 rounded-full">${sentimentText}</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">${preview}</p>
                    <div class="text-xs text-gray-500 mt-1">${entry.wordCount} words</div>
                </div>
            `;
        }).join('');
    }

    updateBlockchainStatus() {
        if (window.privacyManager) {
            const stats = window.privacyManager.getPrivacyStats();
            document.getElementById('walletAddress').textContent = stats.walletAddress;
        }
    }

    loadRecommendedTherapists() {
        const container = document.getElementById('recommendedTherapists');
        
        // Sample therapist data (in real app, this would come from the therapist matching system)
        const therapists = [
            {
                name: "Dr. Sarah Johnson",
                specialty: "Anxiety & CBT",
                rating: 4.9,
                match: 95
            },
            {
                name: "Dr. Michael Chen",
                specialty: "PTSD & Trauma",
                rating: 4.8,
                match: 92
            }
        ];
        
        container.innerHTML = therapists.map(therapist => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                    <div class="font-semibold text-gray-800 text-sm">${therapist.name}</div>
                    <div class="text-xs text-gray-600">${therapist.specialty}</div>
                    <div class="text-xs text-yellow-600">★ ${therapist.rating}</div>
                </div>
                <div class="text-right">
                    <div class="text-xs font-semibold text-green-600">${therapist.match}% Match</div>
                    <button class="text-xs text-blue-600 hover:underline mt-1">View Profile</button>
                </div>
            </div>
        `).join('');
    }

    setupRealTimeUpdates() {
        // Update dashboard every 30 seconds
        setInterval(() => {
            this.userData = this.loadUserData();
            this.updateStats();
            this.loadRecentData();
        }, 30000);
        
        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key && (e.key.includes('journal') || e.key.includes('emotion') || e.key.includes('mindGym'))) {
                this.userData = this.loadUserData();
                this.updateStats();
                this.loadRecentData();
            }
        });
    }

    // Method to refresh all data (called when user performs actions)
    refreshDashboard() {
        this.userData = this.loadUserData();
        this.updateStats();
        this.loadRecentData();
        
        // Update charts with new data
        const moodData = this.generateMoodTrendData();
        this.charts.moodTrend.data.labels = moodData.labels;
        this.charts.moodTrend.data.datasets[0].data = moodData.scores;
        this.charts.moodTrend.data.datasets[1].data = moodData.anxiety;
        this.charts.moodTrend.update();
    }

    // Export dashboard data for analysis
    exportDashboardData() {
        const exportData = {
            userData: this.userData,
            stats: {
                totalSessions: this.calculateTotalSessions(),
                averageMood: this.calculateAverageMood(),
                streak: this.calculateStreak()
            },
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `mentality-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// Notification system for dashboard
class DashboardNotifications {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('dashboardNotifications')) || [];
        this.updateNotificationBadge();
    }

    addNotification(type, title, message) {
        const notification = {
            id: Date.now(),
            type: type, // 'success', 'info', 'warning', 'error'
            title: title,
            message: message,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        this.notifications.unshift(notification);
        this.notifications = this.notifications.slice(0, 50); // Keep last 50
        
        localStorage.setItem('dashboardNotifications', JSON.stringify(this.notifications));
        this.updateNotificationBadge();
        this.showToast(notification);
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 max-w-sm bg-white border-l-4 border-${this.getColorForType(notification.type)}-500 rounded-lg shadow-lg z-50 p-4 transition-all duration-300`;
        
        toast.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <span class="text-${this.getColorForType(notification.type)}-500 text-xl">${this.getIconForType(notification.type)}</span>
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-gray-900">${notification.title}</p>
                    <p class="text-sm text-gray-500 mt-1">${notification.message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                    <span class="sr-only">Close</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
    }

    getColorForType(type) {
        const colors = {
            success: 'green',
            info: 'blue',
            warning: 'yellow',
            error: 'red'
        };
        return colors[type] || 'blue';
    }

    getIconForType(type) {
        const icons = {
            success: '✅',
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || 'ℹ️';
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new EnhancedDashboard();
    window.notifications = new DashboardNotifications();
    
    // Add some sample notifications for demo
    setTimeout(() => {
        window.notifications.addNotification('success', 'Welcome Back!', 'Your mental wellness journey continues.');
        window.notifications.addNotification('info', 'New Achievement', 'You\'ve maintained a 7-day streak!');
        window.notifications.addNotification('info', 'Blockchain Update', 'Your data has been securely stored on the blockchain.');
    }, 2000);
});

// Global functions for dashboard interactions
function exportData() {
    if (window.dashboard) {
        window.dashboard.exportDashboardData();
    }
}

function refreshDashboard() {
    if (window.dashboard) {
        window.dashboard.refreshDashboard();
    }
}
