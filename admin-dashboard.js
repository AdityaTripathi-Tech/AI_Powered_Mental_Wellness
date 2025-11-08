// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.checkAuthentication();
        this.initializeDashboard();
        this.loadDashboardData();
        this.setupRealTimeUpdates();
    }

    checkAuthentication() {
        const token = localStorage.getItem('adminToken');
        const email = localStorage.getItem('adminEmail');
        
        if (!token || !email) {
            alert('Please login to access the admin dashboard.');
            window.location.href = 'index.html';
            return;
        }
        
        // Display admin info
        document.getElementById('adminEmail').textContent = email;
        document.getElementById('adminName').textContent = this.getAdminName(email);
    }

    getAdminName(email) {
        const names = {
            'admin@mentality.com': 'Admin User',
            'aditya@mentality.com': 'Aditya Tripathi',
            'demo@mentality.com': 'Demo User'
        };
        return names[email] || 'Admin User';
    }

    initializeDashboard() {
        this.updateCurrentTime();
        this.initializeCharts();
        this.loadRecentUsers();
        
        // Update time every minute
        setInterval(() => this.updateCurrentTime(), 60000);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('currentTime').textContent = timeString;
    }

    loadDashboardData() {
        // Simulate loading real data
        this.updateStats();
    }

    updateStats() {
        // Generate realistic stats
        const baseUsers = 1200;
        const randomUsers = Math.floor(Math.random() * 100) + baseUsers;
        document.getElementById('totalUsers').textContent = randomUsers.toLocaleString();
        
        const activeSessions = Math.floor(Math.random() * 50) + 70;
        document.getElementById('activeSessions').textContent = activeSessions;
        
        const therapists = Math.floor(Math.random() * 20) + 150;
        document.getElementById('totalTherapists').textContent = therapists;
        
        const blockchainTxns = Math.floor(Math.random() * 500) + 2000;
        document.getElementById('blockchainTxns').textContent = blockchainTxns.toLocaleString();
    }

    initializeCharts() {
        this.createUserGrowthChart();
        this.createSessionTypesChart();
    }

    createUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart').getContext('2d');
        
        // Generate sample data for the last 7 days
        const labels = [];
        const data = [];
        const baseValue = 1000;
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            data.push(baseValue + Math.floor(Math.random() * 200) + (i * 10));
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Users',
                    data: data,
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
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
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

    createSessionTypesChart() {
        const ctx = document.getElementById('sessionTypesChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['AI Journal', 'Mind Gym', 'Therapist Chat', 'CBT Tools', 'Emotion Detection'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
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

    loadRecentUsers() {
        const users = [
            { name: 'Sarah Johnson', email: 'sarah.j@email.com', joinDate: '2 hours ago', status: 'active' },
            { name: 'Michael Chen', email: 'mike.chen@email.com', joinDate: '5 hours ago', status: 'active' },
            { name: 'Emily Rodriguez', email: 'emily.r@email.com', joinDate: '1 day ago', status: 'inactive' },
            { name: 'David Wilson', email: 'david.w@email.com', joinDate: '2 days ago', status: 'active' },
            { name: 'Lisa Thompson', email: 'lisa.t@email.com', joinDate: '3 days ago', status: 'active' }
        ];

        const container = document.getElementById('recentUsers');
        container.innerHTML = users.map(user => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        ${user.name.charAt(0)}
                    </div>
                    <div>
                        <div class="font-medium text-gray-800">${user.name}</div>
                        <div class="text-sm text-gray-500">${user.email}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-600">${user.joinDate}</div>
                    <div class="text-xs">
                        <span class="px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}">
                            ${user.status}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateStats();
        }, 30000);
    }
}

// Navigation functions
function switchTab(tabName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    event.target.classList.add('active');
    
    // Here you would typically load different content based on the tab
    console.log('Switching to tab:', tabName);
}

// Quick action functions
function addUser() {
    alert('Add User functionality would open a modal or new page to add users.');
}

function addTherapist() {
    alert('Add Therapist functionality would open a form to register new therapists.');
}

function viewReports() {
    alert('Reports section would show detailed analytics and reports.');
}

function backupData() {
    alert('Backup process initiated. This would typically backup all user data securely.');
}

function systemSettings() {
    alert('System settings would allow configuration of platform parameters.');
}

function exportData() {
    // Create sample export data
    const exportData = {
        exportDate: new Date().toISOString(),
        totalUsers: document.getElementById('totalUsers').textContent,
        activeSessions: document.getElementById('activeSessions').textContent,
        totalTherapists: document.getElementById('totalTherapists').textContent,
        blockchainTransactions: document.getElementById('blockchainTxns').textContent,
        systemHealth: 'All systems operational',
        exportedBy: localStorage.getItem('adminEmail')
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mentality-admin-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Data exported successfully!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('loginTime');
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    }
}

// Add click handlers for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    window.adminDashboard = new AdminDashboard();
    
    // Add navigation click handlers
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the section name from href
            const section = this.getAttribute('href').substring(1);
            console.log('Navigating to:', section);
            
            // Here you would typically load different content
            // For now, we'll just show an alert
            if (section !== 'dashboard') {
                alert(`${section.charAt(0).toUpperCase() + section.slice(1)} section would be loaded here in a full implementation.`);
            }
        });
    });
});
