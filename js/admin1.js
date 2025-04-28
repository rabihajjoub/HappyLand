// Admin credentials (in a real app, use server-side authentication)
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "happyland123" // Change this to a strong password
};

// Check authentication status
function checkAuth() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Login function
function login(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.reload();
}

// Show status message
function showMessage(message, type) {
    const existingMessage = document.querySelector('.status-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.textContent = message;
    
    const adminContainer = document.getElementById('adminContainer');
    adminContainer.insertBefore(messageDiv, adminContainer.querySelector('.admin-actions'));
    
    setTimeout(() => messageDiv.remove(), 3000);
}

// Process menu file
function processMenuFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(e.target.result, 'text/html');
            extractMenuData(doc);
            showMessage('Menu loaded successfully!', 'success');
        } catch (error) {
            console.error('Error parsing menu:', error);
            showMessage('Error loading menu file', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Extract menu data from HTML
function extractMenuData(doc) {
    const menuData = {
        starters: [],
        mains: [],
        desserts: [],
        drinks: []
    };

    ['starters', 'mains', 'desserts', 'drinks'].forEach(category => {
        const items = doc.querySelectorAll(`#${category} .menu-item`);
        
        items.forEach((item, index) => {
            const title = item.querySelector('.menu-item-title h3')?.textContent || 'Untitled';
            const price = item.querySelector('.menu-item-price')?.textContent || '$0.00';
            
            menuData[category].push({
                title,
                price,
                index
            });
        });
    });

    localStorage.setItem('menuData', JSON.stringify(menuData));
    displayMenuData(menuData);
}

// Display menu data in editors
function displayMenuData(menuData) {
    ['starters', 'mains', 'desserts', 'drinks'].forEach(category => {
        const container = document.getElementById(`${category}Editor`);
        container.innerHTML = '';
        
        menuData[category].forEach(item => {
            const priceItem = document.createElement('div');
            priceItem.className = 'price-item';
            priceItem.innerHTML = `
                <div class="price-item-name">${item.title}</div>
                <input type="text" class="price-input" value="${item.price}" 
                       data-category="${category}" data-index="${item.index}">
            `;
            container.appendChild(priceItem);
        });
    });
}

// Save all price changes
function savePrices() {
    const priceInputs = document.querySelectorAll('.price-input');
    const updates = [];
    
    priceInputs.forEach(input => {
        updates.push({
            category: input.dataset.category,
            index: parseInt(input.dataset.index),
            newPrice: input.value
        });
    });
    
    localStorage.setItem('menuPriceUpdates', JSON.stringify(updates));
    showMessage('Prices saved successfully!', 'success');
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuth()) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminContainer').style.display = 'block';
        
        // Load saved data if exists
        const savedData = localStorage.getItem('menuData');
        if (savedData) {
            displayMenuData(JSON.parse(savedData));
        }

        // Set up file loading
        document.getElementById('loadMenuBtn').addEventListener('click', () => {
            document.getElementById('menuFileInput').click();
        });
        
        document.getElementById('menuFileInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processMenuFile(e.target.files[0]);
            }
        });

        // Set up logout button
        document.getElementById('logoutBtn').addEventListener('click', logout);
        
        // Set up save prices button
        document.getElementById('savePricesBtn').addEventListener('click', savePrices);
    } else {
        // Set up login form
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (login(username, password)) {
                window.location.reload();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }
});