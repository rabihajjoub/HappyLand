document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.getElementById('navbar');
    
    mobileMenuBtn.addEventListener('click', function() {
        navbar.classList.toggle('active');
    });
    
    // Menu category tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active tab
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected category
            menuCategories.forEach(cat => cat.classList.remove('active'));
            document.getElementById(category).classList.add('active');
        });
    });
    
    // Load menu data
    loadMenuData();
    
    // Apply price updates
    applyPriceUpdates();
});

// Sample menu data (in a real app, this would come from a database)
const menuData = {
    starters: [
        {
            name: "Classic Bruschetta",
            price: "$8.99",
            description: "Toasted bread topped with tomatoes, garlic, and basil",
            image: "images/bruschetta.jpg"
        },
        {
            name: "Crispy Calamari",
            price: "$12.99",
            description: "Tender squid lightly battered and fried",
            image: "images/calamari.jpg"
        }
    ],
    mains: [
        {
            name: "Filet Mignon",
            price: "$29.99",
            description: "8oz tender beef filet with red wine reduction",
            image: "images/steak.jpg"
        },
        {
            name: "Grilled Salmon",
            price: "$22.99",
            description: "Fresh Atlantic salmon with lemon butter sauce",
            image: "images/salmon.jpg"
        }
    ],
    desserts: [
        {
            name: "Chocolate Lava Cake",
            price: "$8.99",
            description: "Warm chocolate cake with molten center",
            image: "images/chocolate-cake.jpg"
        },
        {
            name: "Tiramisu",
            price: "$7.99",
            description: "Classic Italian dessert with coffee flavor",
            image: "images/tiramisu.jpg"
        }
    ],
    drinks: [
        {
            name: "House Wine",
            price: "$8.99/glass",
            description: "Selection of premium wines",
            image: "images/wine.jpg"
        },
        {
            name: "Signature Cocktail",
            price: "$12.99",
            description: "Our special mix of premium spirits",
            image: "images/cocktail.jpg"
        }
    ]
};

function loadMenuData() {
    const categories = ['starters', 'mains', 'desserts', 'drinks'];
    
    categories.forEach(category => {
        const container = document.getElementById(category);
        container.innerHTML = '';
        
        menuData[category].forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <div class="menu-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-title">
                        <h3>${item.name}</h3>
                        <span class="menu-item-price">${item.price}</span>
                    </div>
                    <p class="menu-item-desc">${item.description}</p>
                </div>
            `;
            container.appendChild(menuItem);
        });
    });
}

function applyPriceUpdates() {
    const updates = JSON.parse(localStorage.getItem('menuPriceUpdates') || [];
    
    updates.forEach(update => {
        const categoryItems = document.querySelectorAll(`#${update.category} .menu-item`);
        if (categoryItems.length > update.index) {
            const priceElement = categoryItems[update.index].querySelector('.menu-item-price');
            if (priceElement) {
                priceElement.textContent = update.newPrice;
            }
        }
    });
}