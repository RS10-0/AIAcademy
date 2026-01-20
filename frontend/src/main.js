/* ai-academy/frontend/src/main.js */

console.log("System Initialized...");

function switchView(viewName) {
    // Hide all views
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('courses-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.add('hidden');
    
    // Update Nav Buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Show Target View
    const target = document.getElementById(viewName + '-view');
    if (target) {
        target.classList.remove('hidden');
        target.classList.remove('animate-view');
        // Trigger Reflow for animation restart
        void target.offsetWidth; 
        target.classList.add('animate-view');
    }

    // Set Active State on Button
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn'))
        .find(btn => btn.getAttribute('onclick').includes(viewName));
    if(activeBtn) activeBtn.classList.add('active');
}

function handleRegister() {
    const username = document.getElementById('username-input').value;
    if (!username) { 
        alert("Please enter a username."); 
        return; 
    }
    // Simple frontend toggle (later this will connect to Backend)
    document.getElementById('login-gate').classList.add('hidden');
    document.getElementById('user-dashboard').classList.remove('hidden');
    document.getElementById('user-name-display').innerText = username;
}

// Terminal Logic
document.addEventListener('DOMContentLoaded', () => {
    const termInput = document.querySelector('.term-input');
    if(termInput) {
        termInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const val = this.value;
                this.value = ''; 
                this.placeholder = "Processing: " + val + "...";
                setTimeout(() => { 
                    this.placeholder = "Output generated! Try another..."; 
                }, 1500);
            }
        });
    }
});
