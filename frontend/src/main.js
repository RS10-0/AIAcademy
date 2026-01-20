console.log("System Initialized...");

/* --- NAVIGATION & SYSTEM --- */
function switchView(viewName) {
    // Hide all views
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('courses-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('bot-builder-view').classList.add('hidden');
    
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

    // Set Active State on Button (if applicable)
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
    // Simple frontend toggle
    document.getElementById('login-gate').classList.add('hidden');
    document.getElementById('user-dashboard').classList.remove('hidden');
    document.getElementById('user-name-display').innerText = username;
}

// Terminal Visuals
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


/* --- BOT BUILDER LOGIC --- */

// State Variables
let currentBotConfig = {
    name: "AI Assistant",
    personality: "You are a helpful assistant."
};

// 1. Initialize the Bot (Unlock the chat)
function initializeBot() {
    const nameInput = document.getElementById('bot-name-input').value;
    const personaInput = document.getElementById('bot-persona-input').value;

    if (!nameInput || !personaInput) {
        alert("Please provide both a Name and Instructions.");
        return;
    }

    // Update State
    currentBotConfig.name = nameInput;
    currentBotConfig.personality = personaInput;

    // Update UI
    document.getElementById('chat-header-name').innerText = currentBotConfig.name;
    
    // Unlock Chat Panel
    const chatPanel = document.getElementById('chat-panel');
    chatPanel.style.opacity = "1";
    chatPanel.style.pointerEvents = "all";
    
    // Unlock Inputs
    document.getElementById('user-chat-input').disabled = false;
    document.getElementById('send-btn').disabled = false;

    // Add System Welcome Message
    addMessageToChat('bot', `System: ${currentBotConfig.name} is online. Personality loaded.`);
}

// 2. Handle Sending Messages
async function sendBotMessage() {
    const inputField = document.getElementById('user-chat-input');
    const userText = inputField.value;

    if (!userText.trim()) return;

    // A. Display User Message
    addMessageToChat('user', userText);
    inputField.value = ""; // Clear input

    // B. Show "Thinking" indicator
    const loadingId = addMessageToChat('bot', 'Thinking...');

    // C. SEND TO BACKEND (Simulation Mode)
    try {
        const botResponse = await simulateBackendResponse(userText, currentBotConfig);
        
        // Remove "Thinking" and add real response
        document.getElementById(loadingId).remove(); 
        addMessageToChat('bot', botResponse);
        
    } catch (error) {
        console.error("Bot Error:", error);
        document.getElementById(loadingId).innerText = "Error: Connection to AI Core failed.";
    }
}

// 3. Helper: Add Bubble to DOM
function addMessageToChat(sender, text) {
    const chatWindow = document.getElementById('chat-window');
    const msgDiv = document.createElement('div');
    
    // Assign classes based on sender
    msgDiv.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
    msgDiv.innerText = text;
    
    // Create unique ID
    const msgId = 'msg-' + Date.now();
    msgDiv.id = msgId;

    chatWindow.appendChild(msgDiv);
    
    // Auto-scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    return msgId;
}

// 4. BACKEND SIMULATION (The Fake Server)
function simulateBackendResponse(userMessage, config) {
    return new Promise((resolve) => {
        // Fake network delay (1.5 seconds)
        setTimeout(() => {
            // Simple logic to mimic personality
            let reply = `[${config.name}]: I heard you say "${userMessage}". `;
            
            if (config.personality.toLowerCase().includes("pizza")) {
                reply += " But honestly, I'd rather be eating pizza right now.";
            } else if (config.personality.toLowerCase().includes("sarcastic")) {
                reply += " Wow, what a fascinating observation. Not.";
            } else {
                reply += " I am processing this based on my instructions.";
            }
            
            resolve(reply);
        }, 1500);
    });
}

// Allow "Enter" key to send in chat
document.getElementById('user-chat-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendBotMessage();
});
