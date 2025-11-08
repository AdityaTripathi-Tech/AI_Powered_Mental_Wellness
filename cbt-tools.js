// 24/7 CBT Tools System
class CBTTools {
    constructor() {
        this.toolsUsage = JSON.parse(localStorage.getItem('cbtToolsUsage')) || {
            breathing: 0, thoughtReframing: 0, positiveJournaling: 0,
            meditation: 0, moodTracking: 0, crisisSupport: 0
        };
        this.streak = this.calculateStreak();
        this.chart = null;
        
        this.initializeTools();
        this.updateStats();
        this.initializeChart();
    }

    initializeTools() {
        this.updateStreakDisplay();
        this.updateToolStats();
    }

    calculateStreak() {
        const lastUsed = localStorage.getItem('lastCBTToolUsed');
        if (!lastUsed) return 0;
        
        const today = new Date().toDateString();
        const lastUsedDate = new Date(lastUsed).toDateString();
        
        if (lastUsedDate === today) {
            return parseInt(localStorage.getItem('cbtStreak') || '1');
        }
        return 0;
    }

    updateStreakDisplay() {
        document.getElementById('streakCount').textContent = this.streak;
    }

    updateToolStats() {
        document.getElementById('breathingSessions').textContent = this.toolsUsage.breathing;
        document.getElementById('thoughtsReframed').textContent = this.toolsUsage.thoughtReframing;
        document.getElementById('positiveEntries').textContent = this.toolsUsage.positiveJournaling;
        document.getElementById('meditationMinutes').textContent = this.toolsUsage.meditation * 5;
        document.getElementById('moodDays').textContent = this.toolsUsage.moodTracking;
    }

    initializeChart() {
        const ctx = document.getElementById('activityChart').getContext('2d');
        const weekData = this.generateWeeklyData();
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weekData.labels,
                datasets: [{
                    label: 'Daily Activities',
                    data: weekData.data,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    generateWeeklyData() {
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            data.push(Math.floor(Math.random() * 10) + 1);
        }
        
        return { labels, data };
    }

    openTool(toolName) {
        const modal = document.getElementById('toolModal');
        const title = document.getElementById('toolTitle');
        const content = document.getElementById('toolContent');
        
        modal.classList.remove('hidden');
        
        switch(toolName) {
            case 'breathing':
                title.textContent = '🫁 Breathing Practice';
                content.innerHTML = this.getBreathingTool();
                break;
            case 'thought-reframing':
                title.textContent = '🧠 Thought Reframing';
                content.innerHTML = this.getThoughtReframingTool();
                break;
            case 'positive-journaling':
                title.textContent = '📝 Positive Journaling';
                content.innerHTML = this.getPositiveJournalingTool();
                break;
            case 'meditation':
                title.textContent = '🧘 Meditation Guide';
                content.innerHTML = this.getMeditationTool();
                break;
            case 'mood-tracker':
                title.textContent = '📊 Mood Tracker';
                content.innerHTML = this.getMoodTrackerTool();
                break;
            case 'crisis-support':
                title.textContent = '🆘 Crisis Support';
                content.innerHTML = this.getCrisisSupportTool();
                break;
        }
    }

    getBreathingTool() {
        return `
            <div class="text-center">
                <div class="breathing-animation w-32 h-32 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span class="text-4xl text-white">🫁</span>
                </div>
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-2">4-7-8 Breathing Technique</h3>
                    <p class="text-gray-600 mb-4">Inhale for 4, hold for 7, exhale for 8</p>
                    <div class="text-2xl font-bold text-blue-600" id="breathingTimer">Ready</div>
                </div>
                <button onclick="startBreathingExercise()" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                    Start Exercise
                </button>
            </div>
        `;
    }

    getThoughtReframingTool() {
        return `
            <div class="max-w-2xl mx-auto">
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4">Challenge Your Negative Thoughts</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">What negative thought are you having?</label>
                            <textarea id="negativeThought" class="w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="Write your negative thought here..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">What evidence supports this thought?</label>
                            <textarea id="supportingEvidence" class="w-full p-3 border border-gray-300 rounded-lg" rows="2"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">What evidence contradicts this thought?</label>
                            <textarea id="contradictingEvidence" class="w-full p-3 border border-gray-300 rounded-lg" rows="2"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">What would you tell a friend in this situation?</label>
                            <textarea id="friendAdvice" class="w-full p-3 border border-gray-300 rounded-lg" rows="2"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Reframe your thought in a more balanced way:</label>
                            <textarea id="reframedThought" class="w-full p-3 border border-gray-300 rounded-lg bg-green-50" rows="3" placeholder="Your balanced thought will appear here..."></textarea>
                        </div>
                    </div>
                    <button onclick="generateReframedThought()" class="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                        Generate Reframed Thought
                    </button>
                </div>
            </div>
        `;
    }

    getPositiveJournalingTool() {
        return `
            <div class="max-w-2xl mx-auto">
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4">Daily Gratitude & Positivity</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Three things I'm grateful for today:</label>
                            <div class="space-y-2">
                                <input type="text" id="gratitude1" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="1. I'm grateful for...">
                                <input type="text" id="gratitude2" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="2. I'm grateful for...">
                                <input type="text" id="gratitude3" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="3. I'm grateful for...">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">One positive thing that happened today:</label>
                            <textarea id="positiveEvent" class="w-full p-3 border border-gray-300 rounded-lg" rows="3"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">One thing I did well today:</label>
                            <textarea id="accomplishment" class="w-full p-3 border border-gray-300 rounded-lg" rows="2"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tomorrow I will focus on:</label>
                            <textarea id="tomorrowFocus" class="w-full p-3 border border-gray-300 rounded-lg" rows="2"></textarea>
                        </div>
                    </div>
                    <button onclick="savePositiveEntry()" class="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                        Save Entry
                    </button>
                </div>
            </div>
        `;
    }

    getMeditationTool() {
        return `
            <div class="text-center">
                <div class="w-32 h-32 bg-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span class="text-4xl text-white">🧘</span>
                </div>
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4">Guided Meditation Sessions</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onclick="startMeditation('mindfulness', 5)" class="p-4 border border-gray-300 rounded-lg hover:bg-indigo-50 transition">
                            <div class="font-semibold">Mindfulness</div>
                            <div class="text-sm text-gray-600">5 minutes</div>
                        </button>
                        <button onclick="startMeditation('body-scan', 10)" class="p-4 border border-gray-300 rounded-lg hover:bg-indigo-50 transition">
                            <div class="font-semibold">Body Scan</div>
                            <div class="text-sm text-gray-600">10 minutes</div>
                        </button>
                        <button onclick="startMeditation('loving-kindness', 7)" class="p-4 border border-gray-300 rounded-lg hover:bg-indigo-50 transition">
                            <div class="font-semibold">Loving Kindness</div>
                            <div class="text-sm text-gray-600">7 minutes</div>
                        </button>
                        <button onclick="startMeditation('anxiety-relief', 8)" class="p-4 border border-gray-300 rounded-lg hover:bg-indigo-50 transition">
                            <div class="font-semibold">Anxiety Relief</div>
                            <div class="text-sm text-gray-600">8 minutes</div>
                        </button>
                    </div>
                </div>
                <div id="meditationTimer" class="text-2xl font-bold text-indigo-600 mb-4" style="display: none;">
                    <div id="timerDisplay">5:00</div>
                    <div class="text-sm text-gray-600">Breathe deeply and relax</div>
                </div>
            </div>
        `;
    }

    getMoodTrackerTool() {
        return `
            <div class="max-w-2xl mx-auto">
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4">How are you feeling today?</h3>
                    <div class="grid grid-cols-5 gap-4 mb-6">
                        <button onclick="selectMood(1)" class="mood-option p-4 border-2 border-gray-200 rounded-lg hover:border-red-400 transition text-center">
                            <div class="text-3xl mb-2">😢</div>
                            <div class="text-sm">Very Sad</div>
                        </button>
                        <button onclick="selectMood(2)" class="mood-option p-4 border-2 border-gray-200 rounded-lg hover:border-orange-400 transition text-center">
                            <div class="text-3xl mb-2">😔</div>
                            <div class="text-sm">Sad</div>
                        </button>
                        <button onclick="selectMood(3)" class="mood-option p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-400 transition text-center">
                            <div class="text-3xl mb-2">😐</div>
                            <div class="text-sm">Neutral</div>
                        </button>
                        <button onclick="selectMood(4)" class="mood-option p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 transition text-center">
                            <div class="text-3xl mb-2">🙂</div>
                            <div class="text-sm">Happy</div>
                        </button>
                        <button onclick="selectMood(5)" class="mood-option p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition text-center">
                            <div class="text-3xl mb-2">😊</div>
                            <div class="text-sm">Very Happy</div>
                        </button>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">What's influencing your mood today?</label>
                        <textarea id="moodNotes" class="w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="Optional: Share what's affecting your mood..."></textarea>
                    </div>
                    <button onclick="saveMoodEntry()" class="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition">
                        Save Mood Entry
                    </button>
                </div>
            </div>
        `;
    }

    getCrisisSupportTool() {
        return `
            <div class="max-w-2xl mx-auto">
                <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <h3 class="text-lg font-semibold text-red-800 mb-4">🆘 Immediate Crisis Support</h3>
                    <p class="text-red-700 mb-4">If you're having thoughts of self-harm or suicide, please reach out for help immediately.</p>
                    
                    <div class="space-y-4">
                        <div class="bg-white rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-2">Emergency Hotlines</h4>
                            <div class="space-y-2 text-sm">
                                <div><strong>National Suicide Prevention Lifeline:</strong> 988</div>
                                <div><strong>Crisis Text Line:</strong> Text HOME to 741741</div>
                                <div><strong>Emergency Services:</strong> 911</div>
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-2">Immediate Coping Strategies</h4>
                            <ul class="text-sm space-y-1 list-disc list-inside">
                                <li>Take slow, deep breaths</li>
                                <li>Call a trusted friend or family member</li>
                                <li>Remove yourself from harmful situations</li>
                                <li>Use the 5-4-3-2-1 grounding technique</li>
                                <li>Practice progressive muscle relaxation</li>
                            </ul>
                        </div>
                        
                        <div class="bg-white rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-2">Professional Resources</h4>
                            <div class="space-y-2 text-sm">
                                <div><strong>Find a Therapist:</strong> <a href="therapist-matching.html" class="text-blue-600 hover:underline">Browse our therapist directory</a></div>
                                <div><strong>Online Support Groups:</strong> Connect with others who understand</div>
                                <div><strong>Mental Health Apps:</strong> Additional tools for daily support</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <button onclick="startEmergencyBreathing()" class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition mr-4">
                        Start Emergency Breathing
                    </button>
                    <button onclick="contactSupport()" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                        Contact Support Now
                    </button>
                </div>
            </div>
        `;
    }

    updateUsage(toolName) {
        this.toolsUsage[toolName]++;
        localStorage.setItem('cbtToolsUsage', JSON.stringify(this.toolsUsage));
        localStorage.setItem('lastCBTToolUsed', new Date().toISOString());
        
        // Update streak
        const currentStreak = parseInt(localStorage.getItem('cbtStreak') || '0') + 1;
        localStorage.setItem('cbtStreak', currentStreak.toString());
        
        this.updateToolStats();
        this.updateStreakDisplay();
        
        // Store on blockchain if available
        if (window.privacyManager) {
            window.privacyManager.storeGameProgress({
                gameName: `CBT-${toolName}`,
                score: this.toolsUsage[toolName],
                progress: 'completed',
                timestamp: new Date().toISOString()
            });
        }
    }

    closeTool() {
        document.getElementById('toolModal').classList.add('hidden');
    }
}

// Global functions for tool interactions
function openTool(toolName) {
    window.cbtTools.openTool(toolName);
}

function closeTool() {
    window.cbtTools.closeTool();
}

function startBreathingExercise() {
    let phase = 0; // 0: inhale, 1: hold, 2: exhale
    let count = 0;
    const phases = [
        { name: 'Inhale', duration: 4, color: 'text-blue-600' },
        { name: 'Hold', duration: 7, color: 'text-yellow-600' },
        { name: 'Exhale', duration: 8, color: 'text-green-600' }
    ];
    
    const timer = document.getElementById('breathingTimer');
    
    function nextPhase() {
        const currentPhase = phases[phase];
        count = currentPhase.duration;
        timer.className = `text-2xl font-bold ${currentPhase.color}`;
        
        const interval = setInterval(() => {
            timer.textContent = `${currentPhase.name} ${count}`;
            count--;
            
            if (count < 0) {
                clearInterval(interval);
                phase = (phase + 1) % 3;
                if (phase === 0) {
                    // Completed one cycle
                    setTimeout(nextPhase, 1000);
                } else {
                    nextPhase();
                }
            }
        }, 1000);
    }
    
    nextPhase();
    window.cbtTools.updateUsage('breathing');
}

function generateReframedThought() {
    const negative = document.getElementById('negativeThought').value;
    const supporting = document.getElementById('supportingEvidence').value;
    const contradicting = document.getElementById('contradictingEvidence').value;
    const friendAdvice = document.getElementById('friendAdvice').value;
    
    if (!negative.trim()) {
        alert('Please enter your negative thought first.');
        return;
    }
    
    // Simple reframing logic (in real app, this would use AI)
    let reframed = "While I'm experiencing some challenges, ";
    
    if (contradicting.trim()) {
        reframed += `I recognize that ${contradicting.toLowerCase()}. `;
    }
    
    if (friendAdvice.trim()) {
        reframed += `I would tell a friend that ${friendAdvice.toLowerCase()}. `;
    }
    
    reframed += "This situation is temporary and I have the strength to work through it.";
    
    document.getElementById('reframedThought').value = reframed;
    window.cbtTools.updateUsage('thoughtReframing');
}

function savePositiveEntry() {
    const gratitude1 = document.getElementById('gratitude1').value;
    const gratitude2 = document.getElementById('gratitude2').value;
    const gratitude3 = document.getElementById('gratitude3').value;
    const positiveEvent = document.getElementById('positiveEvent').value;
    const accomplishment = document.getElementById('accomplishment').value;
    const tomorrowFocus = document.getElementById('tomorrowFocus').value;
    
    if (!gratitude1.trim() || !gratitude2.trim() || !gratitude3.trim()) {
        alert('Please fill in all three gratitude items.');
        return;
    }
    
    const entry = {
        date: new Date().toISOString(),
        gratitude: [gratitude1, gratitude2, gratitude3],
        positiveEvent,
        accomplishment,
        tomorrowFocus
    };
    
    const entries = JSON.parse(localStorage.getItem('positiveJournalEntries') || '[]');
    entries.unshift(entry);
    localStorage.setItem('positiveJournalEntries', JSON.stringify(entries));
    
    window.cbtTools.updateUsage('positiveJournaling');
    alert('Positive journal entry saved! 🌟');
}

function startMeditation(type, minutes) {
    let timeLeft = minutes * 60;
    const timerDisplay = document.getElementById('timerDisplay');
    const timerContainer = document.getElementById('meditationTimer');
    
    timerContainer.style.display = 'block';
    
    const interval = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(interval);
            timerDisplay.textContent = 'Complete! 🧘';
            window.cbtTools.updateUsage('meditation');
            setTimeout(() => {
                timerContainer.style.display = 'none';
            }, 3000);
        }
    }, 1000);
}

let selectedMood = null;

function selectMood(mood) {
    selectedMood = mood;
    document.querySelectorAll('.mood-option').forEach(btn => {
        btn.classList.remove('border-blue-500', 'bg-blue-50');
    });
    event.target.closest('.mood-option').classList.add('border-blue-500', 'bg-blue-50');
}

function saveMoodEntry() {
    if (!selectedMood) {
        alert('Please select your mood first.');
        return;
    }
    
    const notes = document.getElementById('moodNotes').value;
    const entry = {
        date: new Date().toISOString(),
        mood: selectedMood,
        notes: notes
    };
    
    const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    entries.unshift(entry);
    localStorage.setItem('moodEntries', JSON.stringify(entries));
    
    window.cbtTools.updateUsage('moodTracking');
    alert('Mood entry saved! 📊');
}

function startEmergencyBreathing() {
    alert('Starting emergency breathing exercise. Focus on slow, deep breaths.');
    startBreathingExercise();
}

function contactSupport() {
    alert('In a real implementation, this would connect you with crisis support services.');
}

// Initialize CBT Tools when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.cbtTools = new CBTTools();
});
