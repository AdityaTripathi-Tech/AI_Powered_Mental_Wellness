// Mind Gym Games JavaScript
class MindGym {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem('mindGymScores')) || {
            breathing: 0,
            emotionMaze: 0,
            focus: 0,
            sleep: 0,
            memory: 1,
            colorBoard: 0
        };
        this.updateStats();
    }

    updateStats() {
        const totalGames = Object.values(this.scores).reduce((a, b) => a + b, 0);
        const avgScore = totalGames > 0 ? Math.round(totalGames / Object.keys(this.scores).length) : 0;
        
        document.getElementById('totalGamesPlayed').textContent = totalGames;
        document.getElementById('averageScore').textContent = avgScore;
        document.getElementById('streakDays').textContent = this.getStreak();
        
        // Update individual scores
        document.getElementById('breathingBest').textContent = this.scores.breathing;
        document.getElementById('emotionBest').textContent = this.scores.emotionMaze;
        document.getElementById('focusBest').textContent = this.scores.focus;
        document.getElementById('sleepSessions').textContent = this.scores.sleep;
        document.getElementById('memoryLevel').textContent = this.scores.memory;
        document.getElementById('colorArtworks').textContent = this.scores.colorBoard;
    }

    getStreak() {
        const lastPlayed = localStorage.getItem('lastPlayedDate');
        const today = new Date().toDateString();
        if (lastPlayed === today) return parseInt(localStorage.getItem('currentStreak') || '1');
        return 0;
    }

    saveScore(game, score) {
        this.scores[game] = Math.max(this.scores[game], score);
        localStorage.setItem('mindGymScores', JSON.stringify(this.scores));
        localStorage.setItem('lastPlayedDate', new Date().toDateString());
        
        const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0') + 1;
        localStorage.setItem('currentStreak', currentStreak.toString());
        
        this.updateStats();
    }
}

const mindGym = new MindGym();

function openGame(gameType) {
    const modal = document.getElementById('gameModal');
    const title = document.getElementById('gameTitle');
    const content = document.getElementById('gameContent');
    
    modal.classList.remove('hidden');
    
    switch(gameType) {
        case 'breathing':
            title.textContent = '🫁 Breathing Sync';
            content.innerHTML = getBreathingGame();
            startBreathingGame();
            break;
        case 'emotion-maze':
            title.textContent = '🎭 Emotion Maze';
            content.innerHTML = getEmotionMazeGame();
            startEmotionMaze();
            break;
        case 'focus':
            title.textContent = '🎯 Focus Challenge';
            content.innerHTML = getFocusGame();
            startFocusGame();
            break;
        case 'sleep':
            title.textContent = '🌙 Sleep Relaxation';
            content.innerHTML = getSleepGame();
            startSleepGame();
            break;
        case 'memory':
            title.textContent = '🧩 Memory Pattern';
            content.innerHTML = getMemoryGame();
            startMemoryGame();
            break;
        case 'color-board':
            title.textContent = '🎨 Emotion Color Board';
            content.innerHTML = getColorBoardGame();
            startColorBoard();
            break;
    }
}

function closeGame() {
    document.getElementById('gameModal').classList.add('hidden');
}

function getBreathingGame() {
    return `
        <div class="breathing-container">
            <div class="breathing-circle mx-auto mb-6"></div>
            <div class="text-lg mb-4">Follow the circle's rhythm</div>
            <div class="text-sm text-gray-600 mb-6">Inhale as it grows, exhale as it shrinks</div>
            <div class="flex justify-center space-x-4">
                <button onclick="startBreathingSession()" class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">Start Session</button>
                <div class="text-lg">Score: <span id="breathingScore">0</span></div>
            </div>
        </div>
    `;
}

function startBreathingGame() {
    let score = 0;
    let sessionActive = false;
    
    window.startBreathingSession = function() {
        sessionActive = true;
        score = 0;
        let cycles = 0;
        const maxCycles = 10;
        
        const interval = setInterval(() => {
            cycles++;
            score += 10;
            document.getElementById('breathingScore').textContent = score;
            
            if (cycles >= maxCycles) {
                clearInterval(interval);
                sessionActive = false;
                mindGym.saveScore('breathing', score);
                alert(`Great job! You completed ${cycles} breathing cycles. Score: ${score}`);
            }
        }, 4000);
    };
}

function getEmotionMazeGame() {
    return `
        <div class="emotion-maze-container">
            <div class="grid grid-cols-4 gap-4 mb-6" id="emotionGrid">
                ${generateEmotionBubbles()}
            </div>
            <div class="text-lg mb-4">Click emotions in the correct order: Happy → Calm → Confident → Peaceful</div>
            <div class="flex justify-center space-x-4">
                <div class="text-lg">Level: <span id="mazeLevel">1</span></div>
                <div class="text-lg">Score: <span id="mazeScore">0</span></div>
            </div>
        </div>
    `;
}

function generateEmotionBubbles() {
    const emotions = [
        {emoji: '😊', name: 'Happy', color: 'bg-yellow-400'},
        {emoji: '😌', name: 'Calm', color: 'bg-blue-400'},
        {emoji: '😎', name: 'Confident', color: 'bg-purple-400'},
        {emoji: '😇', name: 'Peaceful', color: 'bg-green-400'},
        {emoji: '😟', name: 'Worried', color: 'bg-orange-400'},
        {emoji: '😢', name: 'Sad', color: 'bg-gray-400'},
        {emoji: '😠', name: 'Angry', color: 'bg-red-400'},
        {emoji: '😰', name: 'Anxious', color: 'bg-pink-400'}
    ];
    
    return emotions.map((emotion, index) => 
        `<div class="emotion-bubble ${emotion.color} text-white" onclick="selectEmotion('${emotion.name}', ${index})" data-emotion="${emotion.name}">
            ${emotion.emoji}
        </div>`
    ).join('');
}

function startEmotionMaze() {
    let currentSequence = ['Happy', 'Calm', 'Confident', 'Peaceful'];
    let playerSequence = [];
    let score = 0;
    let level = 1;
    
    window.selectEmotion = function(emotion, index) {
        playerSequence.push(emotion);
        
        if (playerSequence[playerSequence.length - 1] === currentSequence[playerSequence.length - 1]) {
            score += 25;
            document.getElementById('mazeScore').textContent = score;
            
            if (playerSequence.length === currentSequence.length) {
                level++;
                document.getElementById('mazeLevel').textContent = level;
                playerSequence = [];
                mindGym.saveScore('emotionMaze', score);
                
                if (level <= 3) {
                    setTimeout(() => alert(`Level ${level-1} complete! Moving to next level.`), 100);
                } else {
                    alert(`Congratulations! You mastered emotional navigation! Final Score: ${score}`);
                }
            }
        } else {
            alert('Wrong sequence! Try again.');
            playerSequence = [];
        }
    };
}

function getFocusGame() {
    return `
        <div class="focus-game-container relative bg-gray-100 rounded-lg" style="height: 400px;" id="focusArea">
            <div class="text-lg mb-4">Click the moving dots as quickly as possible!</div>
            <div class="flex justify-center space-x-4 mb-4">
                <button onclick="startFocusChallenge()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Start Challenge</button>
                <div class="text-lg">Score: <span id="focusScore">0</span></div>
                <div class="text-lg">Time: <span id="focusTime">30</span>s</div>
            </div>
        </div>
    `;
}

function startFocusGame() {
    window.startFocusChallenge = function() {
        let score = 0;
        let timeLeft = 30;
        let gameActive = true;
        
        const focusArea = document.getElementById('focusArea');
        const scoreElement = document.getElementById('focusScore');
        const timeElement = document.getElementById('focusTime');
        
        const timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                gameActive = false;
                mindGym.saveScore('focus', score);
                alert(`Time's up! Final score: ${score}`);
            }
        }, 1000);
        
        function createDot() {
            if (!gameActive) return;
            
            const dot = document.createElement('div');
            dot.className = 'focus-dot bg-red-500 hover:bg-red-600';
            dot.style.left = Math.random() * (focusArea.offsetWidth - 20) + 'px';
            dot.style.top = Math.random() * (focusArea.offsetHeight - 100) + 50 + 'px';
            
            dot.onclick = function() {
                score += 10;
                scoreElement.textContent = score;
                focusArea.removeChild(dot);
            };
            
            focusArea.appendChild(dot);
            
            setTimeout(() => {
                if (focusArea.contains(dot)) {
                    focusArea.removeChild(dot);
                }
            }, 2000);
            
            if (gameActive) {
                setTimeout(createDot, Math.random() * 1000 + 500);
            }
        }
        
        createDot();
    };
}

function getSleepGame() {
    return `
        <div class="sleep-game-container text-center">
            <div class="mb-6">
                <div class="text-lg mb-4">Progressive Muscle Relaxation</div>
                <div class="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center text-white text-4xl">
                    🌙
                </div>
            </div>
            <div class="mb-6">
                <div class="text-lg mb-2" id="relaxationInstruction">Click Start to begin relaxation</div>
                <div class="text-sm text-gray-600" id="relaxationStep"></div>
            </div>
            <button onclick="startRelaxation()" class="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 mb-4">Start Relaxation</button>
            <div class="text-lg">Sessions Completed: <span id="relaxationSessions">0</span></div>
        </div>
    `;
}

function startSleepGame() {
    const steps = [
        "Close your eyes and take a deep breath",
        "Tense your toes for 5 seconds, then relax",
        "Tense your leg muscles, then release",
        "Tense your arms and hands, then let go",
        "Scrunch your face muscles, then relax",
        "Take three deep, calming breaths",
        "Feel the relaxation flow through your body",
        "You are now completely relaxed"
    ];
    
    window.startRelaxation = function() {
        let currentStep = 0;
        const instruction = document.getElementById('relaxationInstruction');
        const stepElement = document.getElementById('relaxationStep');
        
        function nextStep() {
            if (currentStep < steps.length) {
                instruction.textContent = steps[currentStep];
                stepElement.textContent = `Step ${currentStep + 1} of ${steps.length}`;
                currentStep++;
                setTimeout(nextStep, 8000);
            } else {
                instruction.textContent = "Relaxation complete! Well done.";
                stepElement.textContent = "";
                mindGym.saveScore('sleep', mindGym.scores.sleep + 1);
                document.getElementById('relaxationSessions').textContent = mindGym.scores.sleep + 1;
            }
        }
        
        nextStep();
    };
}

function getMemoryGame() {
    return `
        <div class="memory-game-container">
            <div class="grid grid-cols-4 gap-4 mb-6" id="memoryGrid">
                ${generateMemoryCards()}
            </div>
            <div class="flex justify-center space-x-4 mb-4">
                <button onclick="startMemoryChallenge()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">New Game</button>
                <div class="text-lg">Matches: <span id="memoryMatches">0</span></div>
                <div class="text-lg">Moves: <span id="memoryMoves">0</span></div>
            </div>
        </div>
    `;
}

function generateMemoryCards() {
    const symbols = ['🌟', '🌈', '🦋', '🌸', '🍀', '⭐', '🌺', '🌻'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    return cards.map((symbol, index) => 
        `<div class="memory-card bg-blue-500 text-white" onclick="flipCard(${index})" data-symbol="${symbol}" data-index="${index}">
            <div class="card-front">?</div>
            <div class="card-back hidden">${symbol}</div>
        </div>`
    ).join('');
}

function startMemoryGame() {
    let flippedCards = [];
    let matches = 0;
    let moves = 0;
    
    window.startMemoryChallenge = function() {
        document.getElementById('memoryGrid').innerHTML = generateMemoryCards();
        matches = 0;
        moves = 0;
        flippedCards = [];
        document.getElementById('memoryMatches').textContent = matches;
        document.getElementById('memoryMoves').textContent = moves;
    };
    
    window.flipCard = function(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        
        if (flippedCards.length < 2 && !flippedCards.includes(index)) {
            front.classList.add('hidden');
            back.classList.remove('hidden');
            flippedCards.push(index);
            
            if (flippedCards.length === 2) {
                moves++;
                document.getElementById('memoryMoves').textContent = moves;
                
                const card1 = document.querySelector(`[data-index="${flippedCards[0]}"]`);
                const card2 = document.querySelector(`[data-index="${flippedCards[1]}"]`);
                
                if (card1.dataset.symbol === card2.dataset.symbol) {
                    matches++;
                    document.getElementById('memoryMatches').textContent = matches;
                    flippedCards = [];
                    
                    if (matches === 8) {
                        mindGym.saveScore('memory', mindGym.scores.memory + 1);
                        alert(`Congratulations! You completed the memory game in ${moves} moves!`);
                    }
                } else {
                    setTimeout(() => {
                        card1.querySelector('.card-front').classList.remove('hidden');
                        card1.querySelector('.card-back').classList.add('hidden');
                        card2.querySelector('.card-front').classList.remove('hidden');
                        card2.querySelector('.card-back').classList.add('hidden');
                        flippedCards = [];
                    }, 1000);
                }
            }
        }
    };
}

function getColorBoardGame() {
    return `
        <div class="color-board-container">
            <div class="mb-6">
                <div class="text-lg mb-4">Express your emotions through colors</div>
                <canvas id="colorCanvas" width="600" height="400" class="border-2 border-gray-300 rounded-lg cursor-crosshair mx-auto block"></canvas>
            </div>
            <div class="flex justify-center space-x-4 mb-4">
                <div class="color-palette flex space-x-2">
                    <div class="w-8 h-8 bg-red-500 rounded cursor-pointer" onclick="selectColor('#ef4444')"></div>
                    <div class="w-8 h-8 bg-blue-500 rounded cursor-pointer" onclick="selectColor('#3b82f6')"></div>
                    <div class="w-8 h-8 bg-green-500 rounded cursor-pointer" onclick="selectColor('#10b981')"></div>
                    <div class="w-8 h-8 bg-yellow-500 rounded cursor-pointer" onclick="selectColor('#f59e0b')"></div>
                    <div class="w-8 h-8 bg-purple-500 rounded cursor-pointer" onclick="selectColor('#8b5cf6')"></div>
                    <div class="w-8 h-8 bg-pink-500 rounded cursor-pointer" onclick="selectColor('#ec4899')"></div>
                </div>
                <button onclick="clearCanvas()" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Clear</button>
                <button onclick="saveArtwork()" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Save Artwork</button>
            </div>
        </div>
    `;
}

function startColorBoard() {
    const canvas = document.getElementById('colorCanvas');
    const ctx = canvas.getContext('2d');
    let painting = false;
    let currentColor = '#3b82f6';
    
    window.selectColor = function(color) {
        currentColor = color;
    };
    
    window.clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    
    window.saveArtwork = function() {
        mindGym.saveScore('colorBoard', mindGym.scores.colorBoard + 1);
        alert('Artwork saved! Great job expressing your emotions through art.');
    };
    
    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mousemove', paint);
    
    function startPainting(e) {
        painting = true;
        paint(e);
    }
    
    function stopPainting() {
        painting = false;
        ctx.beginPath();
    }
    
    function paint(e) {
        if (!painting) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Auto-update stats every few seconds
    setInterval(() => {
        mindGym.updateStats();
    }, 5000);
});
