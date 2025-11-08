// Therapist Matching System
class TherapistMatcher {
    constructor() {
        this.therapists = this.generateTherapistData();
        this.userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
        this.quizAnswers = {};
        this.currentQuestionIndex = 0;
        
        this.initializeEventListeners();
        this.displayTherapists(this.therapists);
    }

    generateTherapistData() {
        return [
            {
                id: 1,
                name: "Dr. Sarah Johnson",
                title: "Licensed Clinical Psychologist",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
                specialties: ["anxiety", "depression", "cbt"],
                rating: 4.9,
                reviews: 127,
                experience: 8,
                price: 120,
                sessionTypes: ["video", "audio", "chat"],
                availability: ["morning", "afternoon"],
                bio: "Dr. Johnson specializes in Cognitive Behavioral Therapy with over 8 years of experience helping clients overcome anxiety and depression. She uses evidence-based techniques tailored to each individual's needs.",
                education: "PhD in Clinical Psychology, Harvard University",
                languages: ["English", "Spanish"],
                approach: "CBT, Mindfulness-Based Therapy, Solution-Focused Therapy",
                matchScore: 95
            },
            {
                id: 2,
                name: "Dr. Michael Chen",
                title: "Psychiatrist & CBT Specialist",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
                specialties: ["ocd", "ptsd", "anxiety"],
                rating: 4.8,
                reviews: 89,
                experience: 12,
                price: 150,
                sessionTypes: ["video", "in-person"],
                availability: ["afternoon", "evening"],
                bio: "Dr. Chen is a board-certified psychiatrist specializing in OCD and PTSD treatment. He combines medication management with intensive CBT techniques for comprehensive care.",
                education: "MD, Johns Hopkins School of Medicine",
                languages: ["English", "Mandarin"],
                approach: "CBT, ERP (Exposure and Response Prevention), EMDR",
                matchScore: 92
            },
            {
                id: 3,
                name: "Dr. Emily Rodriguez",
                title: "Licensed Marriage & Family Therapist",
                image: "https://images.unsplash.com/photo-1594824804732-ca8db5ac6b4e?w=300&h=300&fit=crop&crop=face",
                specialties: ["relationships", "depression", "anxiety"],
                rating: 4.7,
                reviews: 156,
                experience: 6,
                price: 95,
                sessionTypes: ["video", "audio", "chat", "in-person"],
                availability: ["evening", "weekend"],
                bio: "Dr. Rodriguez focuses on relationship dynamics and their impact on mental health. She helps individuals and couples develop healthier communication patterns and coping strategies.",
                education: "MA in Marriage & Family Therapy, UCLA",
                languages: ["English", "Spanish"],
                approach: "CBT, Emotionally Focused Therapy, Gottman Method",
                matchScore: 88
            },
            {
                id: 4,
                name: "Dr. James Wilson",
                title: "Clinical Psychologist",
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
                specialties: ["eating", "anxiety", "depression"],
                rating: 4.6,
                reviews: 73,
                experience: 10,
                price: 110,
                sessionTypes: ["video", "audio"],
                availability: ["morning", "weekend"],
                bio: "Dr. Wilson specializes in eating disorders and body image issues. He uses a compassionate, evidence-based approach to help clients develop a healthy relationship with food and their bodies.",
                education: "PsyD in Clinical Psychology, Pepperdine University",
                languages: ["English"],
                approach: "CBT, Dialectical Behavior Therapy, Acceptance and Commitment Therapy",
                matchScore: 85
            },
            {
                id: 5,
                name: "Dr. Lisa Thompson",
                title: "Trauma Specialist",
                image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&crop=face",
                specialties: ["ptsd", "anxiety", "depression"],
                rating: 4.9,
                reviews: 94,
                experience: 15,
                price: 140,
                sessionTypes: ["video", "in-person"],
                availability: ["morning", "afternoon"],
                bio: "Dr. Thompson is a trauma specialist with extensive experience in PTSD treatment. She provides a safe, supportive environment for healing from traumatic experiences.",
                education: "PhD in Clinical Psychology, University of Pennsylvania",
                languages: ["English", "French"],
                approach: "EMDR, CBT, Somatic Experiencing, Trauma-Focused CBT",
                matchScore: 90
            },
            {
                id: 6,
                name: "Dr. Robert Kim",
                title: "Anxiety & OCD Specialist",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
                specialties: ["ocd", "anxiety", "phobias"],
                rating: 4.8,
                reviews: 112,
                experience: 9,
                price: 125,
                sessionTypes: ["video", "audio", "chat"],
                availability: ["afternoon", "evening"],
                bio: "Dr. Kim specializes in anxiety disorders and OCD treatment using evidence-based approaches. He's known for his patient, methodical approach to exposure therapy.",
                education: "PhD in Clinical Psychology, Stanford University",
                languages: ["English", "Korean"],
                approach: "CBT, ERP, Acceptance and Commitment Therapy",
                matchScore: 87
            }
        ];
    }

    initializeEventListeners() {
        document.getElementById('startQuiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('applyFilters').addEventListener('click', () => this.applyFilters());
        
        // Filter change listeners
        ['specialtyFilter', 'sessionFilter', 'priceFilter', 'availabilityFilter'].forEach(filterId => {
            document.getElementById(filterId).addEventListener('change', () => this.applyFilters());
        });
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.quizAnswers = {};
        document.getElementById('quizModal').classList.remove('hidden');
        this.showQuizQuestion();
    }

    showQuizQuestion() {
        const questions = [
            {
                question: "What is your primary concern you'd like to address?",
                type: "single",
                options: [
                    { value: "anxiety", text: "Anxiety and worry" },
                    { value: "depression", text: "Depression and low mood" },
                    { value: "ocd", text: "Obsessive thoughts and compulsive behaviors" },
                    { value: "ptsd", text: "Trauma and PTSD symptoms" },
                    { value: "eating", text: "Eating and body image issues" },
                    { value: "relationships", text: "Relationship problems" }
                ]
            },
            {
                question: "How would you prefer to have therapy sessions?",
                type: "multiple",
                options: [
                    { value: "video", text: "Video calls" },
                    { value: "audio", text: "Audio calls only" },
                    { value: "chat", text: "Text-based chat" },
                    { value: "in-person", text: "In-person meetings" }
                ]
            },
            {
                question: "What's your preferred session time?",
                type: "single",
                options: [
                    { value: "morning", text: "Morning (9 AM - 12 PM)" },
                    { value: "afternoon", text: "Afternoon (12 PM - 5 PM)" },
                    { value: "evening", text: "Evening (5 PM - 8 PM)" },
                    { value: "weekend", text: "Weekends" }
                ]
            },
            {
                question: "What's your budget per session?",
                type: "single",
                options: [
                    { value: "budget", text: "$50-80 per session" },
                    { value: "moderate", text: "$80-120 per session" },
                    { value: "premium", text: "$120+ per session" }
                ]
            },
            {
                question: "How important is it that your therapist speaks your native language?",
                type: "single",
                options: [
                    { value: "very", text: "Very important" },
                    { value: "somewhat", text: "Somewhat important" },
                    { value: "not", text: "Not important" }
                ]
            },
            {
                question: "Have you had therapy before?",
                type: "single",
                options: [
                    { value: "never", text: "Never had therapy" },
                    { value: "some", text: "Some experience with therapy" },
                    { value: "experienced", text: "Experienced with therapy" }
                ]
            }
        ];

        const question = questions[this.currentQuestionIndex];
        const isLast = this.currentQuestionIndex === questions.length - 1;

        const content = `
            <div class="mb-6">
                <div class="text-sm text-gray-500 mb-2">Question ${this.currentQuestionIndex + 1} of ${questions.length}</div>
                <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${((this.currentQuestionIndex + 1) / questions.length) * 100}%"></div>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">${question.question}</h3>
                
                <div class="space-y-3">
                    ${question.options.map(option => `
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                            <input type="${question.type === 'single' ? 'radio' : 'checkbox'}" 
                                   name="question${this.currentQuestionIndex}" 
                                   value="${option.value}" 
                                   class="mr-3 text-blue-600">
                            <span class="text-gray-700">${option.text}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="flex justify-between">
                <button onclick="previousQuestion()" 
                        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition ${this.currentQuestionIndex === 0 ? 'invisible' : ''}">
                    Previous
                </button>
                <button onclick="${isLast ? 'finishQuiz()' : 'nextQuestion()'}" 
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    ${isLast ? 'Get Matches' : 'Next'}
                </button>
            </div>
        `;

        document.getElementById('quizContent').innerHTML = content;
    }

    nextQuestion() {
        // Save current answers
        const questionInputs = document.querySelectorAll(`input[name="question${this.currentQuestionIndex}"]:checked`);
        const answers = Array.from(questionInputs).map(input => input.value);
        
        if (answers.length === 0) {
            alert('Please select an answer before continuing.');
            return;
        }
        
        this.quizAnswers[`question${this.currentQuestionIndex}`] = answers;
        this.currentQuestionIndex++;
        this.showQuizQuestion();
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuizQuestion();
        }
    }

    finishQuiz() {
        // Save final answer
        const questionInputs = document.querySelectorAll(`input[name="question${this.currentQuestionIndex}"]:checked`);
        const answers = Array.from(questionInputs).map(input => input.value);
        
        if (answers.length === 0) {
            alert('Please select an answer before finishing.');
            return;
        }
        
        this.quizAnswers[`question${this.currentQuestionIndex}`] = answers;
        
        // Calculate matches
        const matchedTherapists = this.calculateMatches();
        
        // Save preferences
        localStorage.setItem('userPreferences', JSON.stringify(this.quizAnswers));
        
        // Close quiz and show results
        this.closeQuiz();
        this.displayTherapists(matchedTherapists);
        
        // Show success message
        alert('Quiz completed! Therapists are now sorted by compatibility.');
    }

    calculateMatches() {
        const therapists = [...this.therapists];
        
        therapists.forEach(therapist => {
            let score = 0;
            
            // Primary concern match (weight: 40%)
            const primaryConcern = this.quizAnswers.question0?.[0];
            if (primaryConcern && therapist.specialties.includes(primaryConcern)) {
                score += 40;
            }
            
            // Session type match (weight: 20%)
            const sessionPrefs = this.quizAnswers.question1 || [];
            const sessionMatch = sessionPrefs.some(pref => therapist.sessionTypes.includes(pref));
            if (sessionMatch) {
                score += 20;
            }
            
            // Availability match (weight: 15%)
            const timePrefs = this.quizAnswers.question2?.[0];
            if (timePrefs && therapist.availability.includes(timePrefs)) {
                score += 15;
            }
            
            // Price match (weight: 15%)
            const budgetPref = this.quizAnswers.question3?.[0];
            if (budgetPref) {
                const priceMatch = this.checkPriceMatch(therapist.price, budgetPref);
                if (priceMatch) score += 15;
            }
            
            // Experience bonus (weight: 10%)
            if (therapist.experience >= 10) score += 5;
            if (therapist.rating >= 4.8) score += 5;
            
            therapist.matchScore = Math.min(100, score);
        });
        
        return therapists.sort((a, b) => b.matchScore - a.matchScore);
    }

    checkPriceMatch(price, budget) {
        switch (budget) {
            case 'budget': return price <= 80;
            case 'moderate': return price >= 80 && price <= 120;
            case 'premium': return price >= 120;
            default: return true;
        }
    }

    applyFilters() {
        const specialty = document.getElementById('specialtyFilter').value;
        const session = document.getElementById('sessionFilter').value;
        const price = document.getElementById('priceFilter').value;
        const availability = document.getElementById('availabilityFilter').value;
        
        let filtered = this.therapists.filter(therapist => {
            if (specialty && !therapist.specialties.includes(specialty)) return false;
            if (session && !therapist.sessionTypes.includes(session)) return false;
            if (availability && !therapist.availability.includes(availability)) return false;
            if (price && !this.checkPriceMatch(therapist.price, price)) return false;
            return true;
        });
        
        this.displayTherapists(filtered);
    }

    displayTherapists(therapists) {
        const grid = document.getElementById('therapistGrid');
        document.getElementById('therapistCount').textContent = therapists.length;
        
        if (therapists.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12">No therapists match your criteria. Try adjusting your filters.</div>';
            return;
        }
        
        grid.innerHTML = therapists.map(therapist => `
            <div class="therapist-card bg-white rounded-xl shadow-lg p-6 cursor-pointer" onclick="viewTherapist(${therapist.id})">
                <div class="flex items-start space-x-4 mb-4">
                    <img src="${therapist.image}" alt="${therapist.name}" class="w-16 h-16 rounded-full object-cover">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-800">${therapist.name}</h3>
                        <p class="text-sm text-gray-600">${therapist.title}</p>
                        <div class="flex items-center mt-1">
                            <div class="rating-stars text-sm">★★★★★</div>
                            <span class="text-sm text-gray-600 ml-2">${therapist.rating} (${therapist.reviews} reviews)</span>
                        </div>
                    </div>
                    ${therapist.matchScore ? `<div class="match-score text-sm">${therapist.matchScore}% Match</div>` : ''}
                </div>
                
                <div class="mb-4">
                    <div class="flex flex-wrap">
                        ${therapist.specialties.slice(0, 3).map(specialty => 
                            `<span class="specialty-tag">${this.formatSpecialty(specialty)}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="text-sm text-gray-600 mb-4">
                    <p class="line-clamp-2">${therapist.bio}</p>
                </div>
                
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        <span class="font-semibold">${therapist.experience} years exp.</span>
                    </div>
                    <div class="text-lg font-bold text-blue-600">
                        $${therapist.price}/session
                    </div>
                </div>
                
                <div class="mt-4 flex space-x-2">
                    <button onclick="event.stopPropagation(); bookSession(${therapist.id})" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm">
                        Book Session
                    </button>
                    <button onclick="event.stopPropagation(); viewTherapist(${therapist.id})" class="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition text-sm">
                        View Profile
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatSpecialty(specialty) {
        const specialtyNames = {
            anxiety: 'Anxiety',
            depression: 'Depression',
            ocd: 'OCD',
            ptsd: 'PTSD',
            eating: 'Eating Disorders',
            relationships: 'Relationships',
            cbt: 'CBT',
            phobias: 'Phobias'
        };
        return specialtyNames[specialty] || specialty;
    }

    viewTherapist(therapistId) {
        const therapist = this.therapists.find(t => t.id === therapistId);
        if (!therapist) return;
        
        document.getElementById('therapistModalTitle').textContent = therapist.name;
        document.getElementById('therapistModalContent').innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1">
                    <img src="${therapist.image}" alt="${therapist.name}" class="w-full rounded-lg mb-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-bold text-gray-800 mb-2">Quick Info</h4>
                        <div class="space-y-2 text-sm">
                            <div><strong>Experience:</strong> ${therapist.experience} years</div>
                            <div><strong>Rating:</strong> ${therapist.rating}/5 (${therapist.reviews} reviews)</div>
                            <div><strong>Price:</strong> $${therapist.price}/session</div>
                            <div><strong>Languages:</strong> ${therapist.languages.join(', ')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="lg:col-span-2">
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-2">${therapist.title}</h4>
                        <p class="text-gray-600 mb-4">${therapist.bio}</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 class="font-semibold text-gray-800 mb-2">Specialties</h5>
                                <div class="flex flex-wrap">
                                    ${therapist.specialties.map(specialty => 
                                        `<span class="specialty-tag">${this.formatSpecialty(specialty)}</span>`
                                    ).join('')}
                                </div>
                            </div>
                            
                            <div>
                                <h5 class="font-semibold text-gray-800 mb-2">Session Types</h5>
                                <div class="text-sm text-gray-600">
                                    ${therapist.sessionTypes.map(type => this.formatSessionType(type)).join(', ')}
                                </div>
                            </div>
                            
                            <div>
                                <h5 class="font-semibold text-gray-800 mb-2">Availability</h5>
                                <div class="text-sm text-gray-600">
                                    ${therapist.availability.map(time => this.formatAvailability(time)).join(', ')}
                                </div>
                            </div>
                            
                            <div>
                                <h5 class="font-semibold text-gray-800 mb-2">Education</h5>
                                <div class="text-sm text-gray-600">${therapist.education}</div>
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <h5 class="font-semibold text-gray-800 mb-2">Therapeutic Approach</h5>
                            <div class="text-sm text-gray-600">${therapist.approach}</div>
                        </div>
                    </div>
                    
                    <div class="flex space-x-4">
                        <button onclick="bookSession(${therapist.id})" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            📅 Book Session ($${therapist.price})
                        </button>
                        <button onclick="sendMessage(${therapist.id})" class="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
                            💬 Send Message
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('therapistModal').classList.remove('hidden');
    }

    formatSessionType(type) {
        const types = {
            video: 'Video Calls',
            audio: 'Audio Calls',
            chat: 'Text Chat',
            'in-person': 'In-Person'
        };
        return types[type] || type;
    }

    formatAvailability(time) {
        const times = {
            morning: 'Morning',
            afternoon: 'Afternoon',
            evening: 'Evening',
            weekend: 'Weekends'
        };
        return times[time] || time;
    }

    closeQuiz() {
        document.getElementById('quizModal').classList.add('hidden');
    }

    closeTherapistModal() {
        document.getElementById('therapistModal').classList.add('hidden');
    }
}

// Global functions
function closeQuiz() {
    document.getElementById('quizModal').classList.add('hidden');
}

function closeTherapistModal() {
    document.getElementById('therapistModal').classList.add('hidden');
}

function nextQuestion() {
    window.therapistMatcher.nextQuestion();
}

function previousQuestion() {
    window.therapistMatcher.previousQuestion();
}

function finishQuiz() {
    window.therapistMatcher.finishQuiz();
}

function viewTherapist(therapistId) {
    window.therapistMatcher.viewTherapist(therapistId);
}

function bookSession(therapistId) {
    const therapist = window.therapistMatcher.therapists.find(t => t.id === therapistId);
    alert(`Booking session with ${therapist.name}. In a real implementation, this would redirect to a booking system.`);
}

function sendMessage(therapistId) {
    const therapist = window.therapistMatcher.therapists.find(t => t.id === therapistId);
    alert(`Sending message to ${therapist.name}. In a real implementation, this would open a messaging interface.`);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.therapistMatcher = new TherapistMatcher();
});
