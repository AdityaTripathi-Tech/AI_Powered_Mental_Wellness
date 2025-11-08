// Unique Features JavaScript
class UniqueFeatures {
    constructor() {
        this.initializeFeatures();
        this.initializePredictionChart();
        this.setupDemoData();
    }

    initializeFeatures() {
        console.log('Unique Features initialized');
    }

    initializePredictionChart() {
        const ctx = document.getElementById('predictionChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Prediction Accuracy',
                    data: [75, 82, 88, 91, 94, 96],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'User Satisfaction',
                    data: [70, 78, 85, 89, 92, 95],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
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
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }

    setupDemoData() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateMetrics();
        }, 5000);
    }

    updateMetrics() {
        // Update various metrics with slight variations
        const elements = [
            { id: 'totalUsers', base: 1247, variation: 10 },
            { id: 'activeSessions', base: 89, variation: 5 },
            { id: 'totalTherapists', base: 156, variation: 2 },
            { id: 'blockchainTxns', base: 2341, variation: 20 }
        ];

        elements.forEach(element => {
            const el = document.getElementById(element.id);
            if (el) {
                const newValue = element.base + Math.floor(Math.random() * element.variation);
                el.textContent = newValue.toLocaleString();
            }
        });
    }
}

// Feature Modal Functions
function openModal() {
    document.getElementById('featureModal').classList.add('active');
}

function closeModal() {
    document.getElementById('featureModal').classList.remove('active');
}

// Individual Feature Functions
function openPrediction() {
    document.getElementById('modalTitle').textContent = '🔮 AI Mental Health Prediction';
    document.getElementById('modalContent').innerHTML = `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
                <h3 class="text-xl font-bold mb-4">Predictive Analytics Dashboard</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white bg-opacity-20 rounded-lg p-4">
                        <div class="text-2xl font-bold">7 Days</div>
                        <div class="text-sm">Prediction Window</div>
                    </div>
                    <div class="bg-white bg-opacity-20 rounded-lg p-4">
                        <div class="text-2xl font-bold">94%</div>
                        <div class="text-sm">Accuracy Rate</div>
                    </div>
                    <div class="bg-white bg-opacity-20 rounded-lg p-4">
                        <div class="text-2xl font-bold">Medium</div>
                        <div class="text-sm">Current Risk</div>
                    </div>
                </div>
            </div>
            
            <div class="space-y-4">
                <h4 class="font-bold text-lg">Upcoming Predictions:</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center p-3 bg-yellow-100 rounded-lg">
                        <span>Anxiety Episode Risk</span>
                        <span class="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">Medium - 3 days</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                        <span>Mood Improvement</span>
                        <span class="px-3 py-1 bg-green-500 text-white rounded-full text-sm">High - 5 days</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
                        <span>Sleep Quality</span>
                        <span class="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Stable - 7 days</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-100 rounded-lg p-4">
                <h5 class="font-semibold mb-2">How it works:</h5>
                <ul class="text-sm space-y-1 list-disc list-inside">
                    <li>Analyzes your behavioral patterns, sleep, mood, and activity data</li>
                    <li>Uses machine learning to identify early warning signs</li>
                    <li>Provides personalized recommendations to prevent episodes</li>
                    <li>Continuously learns and improves accuracy over time</li>
                </ul>
            </div>
        </div>
    `;
    openModal();
}

function startVR() {
    document.getElementById('modalTitle').textContent = '🥽 VR Therapy Sessions';
    document.getElementById('modalContent').innerHTML = `
        <div class="space-y-6">
            <div class="text-center">
                <div class="text-6xl mb-4">🌄</div>
                <h3 class="text-xl font-bold mb-2">Virtual Reality Therapy</h3>
                <p class="text-gray-600">Immersive environments for healing and relaxation</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition">
                    <div class="text-3xl mb-2">🏔️</div>
                    <h4 class="font-bold">Mountain Meditation</h4>
                    <p class="text-sm text-gray-600">Peaceful mountain scenery for mindfulness practice</p>
                </div>
                <div class="bg-green-50 rounded-lg p-4 cursor-pointer hover:bg-green-100 transition">
                    <div class="text-3xl mb-2">🌊</div>
                    <h4 class="font-bold">Ocean Therapy</h4>
                    <p class="text-sm text-gray-600">Calming ocean waves for anxiety relief</p>
                </div>
                <div class="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition">
                    <div class="text-3xl mb-2">🌌</div>
                    <h4 class="font-bold">Space Relaxation</h4>
                    <p class="text-sm text-gray-600">Cosmic environments for deep meditation</p>
                </div>
                <div class="bg-yellow-50 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 transition">
                    <div class="text-3xl mb-2">🌸</div>
                    <h4 class="font-bold">Garden Therapy</h4>
                    <p class="text-sm text-gray-600">Serene garden setting for stress relief</p>
                </div>
            </div>
            
            <div class="bg-gray-100 rounded-lg p-4">
                <h5 class="font-semibold mb-2">VR Requirements:</h5>
                <ul class="text-sm space-y-1">
                    <li>• Compatible VR headset (Oculus, HTC Vive, etc.)</li>
                    <li>• Stable internet connection</li>
                    <li>• Comfortable seating area</li>
                    <li>• 15-30 minutes of uninterrupted time</li>
                </ul>
            </div>
            
            <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Start VR Session (Demo)
            </button>
        </div>
    `;
    openModal();
}

function connectDevice() {
    document.getElementById('modalTitle').textContent = '❤️ Biometric Integration';
    document.getElementById('modalContent').innerHTML = `
        <div class="space-y-6">
            <div class="text-center">
                <div class="text-6xl mb-4 animate-pulse">❤️</div>
                <h3 class="text-xl font-bold mb-2">Connect Your Devices</h3>
                <p class="text-gray-600">Sync your health data for better insights</p>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">⌚</div>
                        <div>
                            <div class="font-semibold">Apple Watch</div>
                            <div class="text-sm text-gray-600">Heart rate, activity, sleep</div>
                        </div>
                    </div>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Connect
                    </button>
                </div>
                
                <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">📱</div>
                        <div>
                            <div class="font-semibold">Fitbit</div>
                            <div class="text-sm text-gray-600">Steps, heart rate, sleep quality</div>
                        </div>
                    </div>
                    <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        Connect
                    </button>
                </div>
                
                <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">🩺</div>
                        <div>
                            <div class="font-semibold">Blood Pressure Monitor</div>
                            <div class="text-sm text-gray-600">Blood pressure, pulse</div>
                        </div>
                    </div>
                    <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                        Connect
                    </button>
                </div>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
                <h5 class="font-semibold mb-2">Current Readings:</h5>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>Heart Rate: <span class="font-bold">72 BPM</span></div>
                    <div>Stress Level: <span class="font-bold text-green-600">Low</span></div>
                    <div>Sleep Quality: <span class="font-bold">8.2/10</span></div>
                    <div>Activity: <span class="font-bold">7,543 steps</span></div>
                </div>
            </div>
        </div>
    `;
    openModal();
}

function recordDream() {
    document.getElementById('modalTitle').textContent = '💭 AI Dream Analysis';
    document.getElementById('modalContent').innerHTML = `
        <div class="space-y-6">
            <div class="text-center">
                <div class="text-6xl mb-4">💭</div>
                <h3 class="text-xl font-bold mb-2">Dream Journal & Analysis</h3>
                <p class="text-gray-600">Record your dreams for psychological insights</p>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Describe your dream:</label>
                    <textarea class="w-full p-3 border border-gray-300 rounded-lg h-32" placeholder="I dreamed that I was flying over a beautiful landscape..."></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">How did you feel in the dream?</label>
                    <select class="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Happy and free</option>
                        <option>Anxious or worried</option>
                        <option>Confused</option>
                        <option>Peaceful</option>
                        <option>Excited</option>
                        <option>Scared</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Dream vividness (1-10):</label>
                    <input type="range" min="1" max="10" value="5" class="w-full">
                </div>
            </div>
            
            <div class="bg-purple-50 rounded-lg p-4">
                <h5 class="font-semibold mb-2">Previous Dream Analysis:</h5>
                <div class="text-sm space-y-2">
                    <p><strong>Theme:</strong> Growth and transformation</p>
                    <p><strong>Symbols:</strong> Flying (freedom), Landscape (life journey)</p>
                    <p><strong>Insight:</strong> You may be experiencing personal growth and seeking new perspectives</p>
                </div>
            </div>
            
            <button class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
                Analyze Dream
            </button>
        </div>
    `;
    openModal();
}

function joinSupport() {
    alert('Joining Anonymous Support Network... This would connect you with others facing similar challenges while maintaining complete privacy.');
}

function testCrisis() {
    alert('Crisis Intervention System Test: All emergency protocols are functioning correctly. In a real crisis, this system would immediately connect you with professional help.');
}

function manageMeds() {
    alert('Smart Medication Assistant would help you track medications, set reminders, and correlate with mood improvements.');
}

function viewCorrelations() {
    alert('Environmental Mood Sync would show detailed correlations between weather, location, air quality and your mood patterns.');
}

function customizeAI() {
    alert('AI Personality Customization would allow you to adjust the therapeutic approach and communication style of your AI companion.');
}

function viewCertificates() {
    alert('Blockchain Certificates would display your verifiable mental health progress achievements stored securely on the blockchain.');
}

function analyzeVoice() {
    alert('Voice Emotion Analysis would analyze your speech patterns to detect emotional states and stress levels in real-time.');
}

function quantumAnalysis() {
    alert('Quantum Mood Engine would use advanced quantum computing algorithms to analyze complex mood patterns and predict optimal intervention times.');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.uniqueFeatures = new UniqueFeatures();
});
