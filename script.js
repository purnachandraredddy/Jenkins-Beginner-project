// SimpleLife App - JavaScript functionality

class SimpleLifeApp {
    constructor() {
        this.goals = JSON.parse(localStorage.getItem('simpleLifeGoals')) || [];
        this.preferences = JSON.parse(localStorage.getItem('simpleLifePreferences')) || {
            activities: [
                'Watch a series',
                'Go for a walk',
                'Take a nap',
                'Read a book',
                'Listen to music',
                'Meditate',
                'Call a friend',
                'Do some stretching',
                'Have a snack',
                'Browse social media'
            ],
            location: ''
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGoals();
        this.loadPreferences();
        this.loadEvents();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        // Goal management
        document.getElementById('addGoalBtn').addEventListener('click', () => this.addGoal());
        document.getElementById('goalInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addGoal();
        });

        // Break suggestions
        document.getElementById('suggestBreakBtn').addEventListener('click', () => this.suggestBreak());

        // Preferences
        document.getElementById('addActivityBtn').addEventListener('click', () => this.addActivity());
        document.getElementById('customActivity').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addActivity();
        });
        document.getElementById('saveLocationBtn').addEventListener('click', () => this.saveLocation());
    }

    // Goal Management
    addGoal() {
        const input = document.getElementById('goalInput');
        const text = input.value.trim();
        
        if (text) {
            const goal = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.goals.push(goal);
            this.saveGoals();
            this.loadGoals();
            input.value = '';
        }
    }

    toggleGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            goal.completed = !goal.completed;
            this.saveGoals();
            this.loadGoals();
        }
    }

    deleteGoal(id) {
        this.goals = this.goals.filter(g => g.id !== id);
        this.saveGoals();
        this.loadGoals();
    }

    loadGoals() {
        const container = document.getElementById('goalsList');
        container.innerHTML = '';

        if (this.goals.length === 0) {
            container.innerHTML = '<p style="color: #64748b; text-align: center; padding: 20px;">No goals yet. Add your first goal above!</p>';
            return;
        }

        this.goals.forEach(goal => {
            const goalElement = document.createElement('div');
            goalElement.className = `goal-item ${goal.completed ? 'completed' : ''}`;
            goalElement.draggable = true;
            goalElement.dataset.goalId = goal.id;

            goalElement.innerHTML = `
                <input type="checkbox" class="goal-checkbox" ${goal.completed ? 'checked' : ''}>
                <span class="goal-text">${goal.text}</span>
                <button class="goal-delete">×</button>
            `;

            // Event listeners for this goal
            goalElement.querySelector('.goal-checkbox').addEventListener('change', () => {
                this.toggleGoal(goal.id);
            });

            goalElement.querySelector('.goal-delete').addEventListener('click', () => {
                this.deleteGoal(goal.id);
            });

            container.appendChild(goalElement);
        });
    }

    setupDragAndDrop() {
        const goalsList = document.getElementById('goalsList');
        
        goalsList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        goalsList.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
            const targetElement = e.target.closest('.goal-item');
            
            if (targetElement) {
                const targetId = parseInt(targetElement.dataset.goalId);
                this.reorderGoals(draggedId, targetId);
            }
        });

        // Add drag event listeners to goal items
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('goal-item')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.goalId);
                e.target.style.opacity = '0.5';
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('goal-item')) {
                e.target.style.opacity = '1';
            }
        });
    }

    reorderGoals(draggedId, targetId) {
        const draggedIndex = this.goals.findIndex(g => g.id === draggedId);
        const targetIndex = this.goals.findIndex(g => g.id === targetId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const [draggedGoal] = this.goals.splice(draggedIndex, 1);
            this.goals.splice(targetIndex, 0, draggedGoal);
            this.saveGoals();
            this.loadGoals();
        }
    }

    // Break Suggestions
    suggestBreak() {
        const suggestions = document.getElementById('breakSuggestions');
        const randomActivity = this.preferences.activities[Math.floor(Math.random() * this.preferences.activities.length)];
        
        const suggestion = document.createElement('div');
        suggestion.className = 'break-suggestion';
        suggestion.innerHTML = `
            <h3>Suggested Break Activity</h3>
            <p>How about <strong>${randomActivity}</strong>? Take a moment to recharge!</p>
        `;

        suggestions.innerHTML = '';
        suggestions.appendChild(suggestion);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (suggestion.parentNode) {
                suggestion.remove();
            }
        }, 10000);
    }

    // Local Events (Mock data for now)
    loadEvents() {
        const container = document.getElementById('eventsContainer');
        
        // Mock events data
        const mockEvents = [
            {
                title: "Morning Productivity Workshop",
                time: "Tomorrow, 9:00 AM",
                location: "Community Center",
                description: "Learn time management and productivity techniques"
            },
            {
                title: "Yoga in the Park",
                time: "This Weekend, 8:00 AM",
                location: "Central Park",
                description: "Free yoga session for all levels"
            },
            {
                title: "Local Entrepreneurs Meetup",
                time: "Next Tuesday, 6:00 PM",
                location: "Coffee Shop Downtown",
                description: "Network with local business owners"
            },
            {
                title: "Reading Club",
                time: "Next Thursday, 7:00 PM",
                location: "Public Library",
                description: "Discuss this month's book selection"
            }
        ];

        container.innerHTML = '';
        
        mockEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p>${event.description}</p>
            `;
            container.appendChild(eventElement);
        });
    }

    // Preferences Management
    loadPreferences() {
        // Load activities
        const activityTags = document.getElementById('activityTags');
        activityTags.innerHTML = '';
        
        this.preferences.activities.forEach(activity => {
            const tag = document.createElement('div');
            tag.className = 'activity-tag';
            tag.innerHTML = `
                <span>${activity}</span>
                <button class="remove" onclick="app.removeActivity('${activity}')">×</button>
            `;
            activityTags.appendChild(tag);
        });

        // Load location
        document.getElementById('locationInput').value = this.preferences.location;
    }

    addActivity() {
        const input = document.getElementById('customActivity');
        const activity = input.value.trim();
        
        if (activity && !this.preferences.activities.includes(activity)) {
            this.preferences.activities.push(activity);
            this.savePreferences();
            this.loadPreferences();
            input.value = '';
        }
    }

    removeActivity(activity) {
        this.preferences.activities = this.preferences.activities.filter(a => a !== activity);
        this.savePreferences();
        this.loadPreferences();
    }

    saveLocation() {
        const location = document.getElementById('locationInput').value.trim();
        this.preferences.location = location;
        this.savePreferences();
        
        // Show confirmation
        const btn = document.getElementById('saveLocationBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Saved!';
        btn.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '#10b981';
        }, 2000);
    }

    // Local Storage
    saveGoals() {
        localStorage.setItem('simpleLifeGoals', JSON.stringify(this.goals));
    }

    savePreferences() {
        localStorage.setItem('simpleLifePreferences', JSON.stringify(this.preferences));
    }
}

// Initialize the app
const app = new SimpleLifeApp();

// Make app globally available for inline event handlers
window.app = app;
