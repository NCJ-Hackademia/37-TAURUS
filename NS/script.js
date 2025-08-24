// Navi Soch - Digital Platform for Farmers
// Main JavaScript file

// Product data
const products = [
    {
        id: 1,
        name: "पालक / Spinach",
        price: 25,
        unit: "per KG",
        emoji: "🥬",
        category: "leafy",
        description: "Fresh organic spinach, rich in iron and vitamins"
    },
    {
        id: 2,
        name: "गाजर / Carrots",
        price: 40,
        unit: "per KG",
        emoji: "🥕",
        category: "root",
        description: "Sweet, crunchy carrots grown without pesticides"
    },
    {
        id: 3,
        name: "टमाटर / Tomatoes",
        price: 30,
        unit: "per KG",
        emoji: "🍅",
        category: "fruit",
        description: "Juicy red tomatoes, ideal for cooking and sauces"
    },
    {
        id: 4,
        name: "बैंगन / Eggplant",
        price: 35,
        unit: "per KG",
        emoji: "🍆",
        category: "herbs",
        description: "Fresh brinjal for your cooking needs"
    },
    {
        id: 5,
        name: "पत्ता गोभी / Cabbage",
        price: 20,
        unit: "per KG",
        emoji: "🥬",
        category: "leafy",
        description: "Fresh cabbage heads, rich in vitamins and minerals"
    },
    {
        id: 6,
        name: "मिर्च / Chilli",
        price: 60,
        unit: "per KG",
        emoji: "🌶️",
        category: "fruit",
        description: "Hot green chillies for adding spice to your dishes"
    },
    {
        id: 7,
        name: "आलू / Potatoes",
        price: 30,
        unit: "per KG",
        emoji: "🥔",
        category: "root",
        description: "Fresh potatoes, perfect for all cooking methods"
    },
    {
        id: 8,
        name: "प्याज / Onion",
        price: 25,
        unit: "per KG",
        emoji: "🧅",
        category: "herbs",
        description: "Fresh onions to add flavor to your dishes"
    }
];

// Global state
let currentScreen = 'landing';
let currentLanguage = 'hi';
let voiceEnabled = true;
let cart = [];
let currentFilter = 'all';
let isLoggedIn = false;
let otpTimer = null;
let resendCountdown = 30;

// Language translations
const translations = {
    hi: {
        startNow: 'Start Now',
        seeHow: 'See How It Works',
        tagline: 'सरल. भरोसेमंद. आपके लिए.',
        greeting: 'नमस्ते रमू भैया!',
        searchPlaceholder: 'Search crops... / फसल खोजें...'
    },
    en: {
        startNow: 'Start Now',
        seeHow: 'See How It Works',
        tagline: 'Simple. Reliable. For You.',
        greeting: 'Hello Ramu Bhaiya!',
        searchPlaceholder: 'Search crops...'
    }
};

// Utility functions
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${isError ? 'error' : ''}`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function playSound(type) {
    // Simulate sound effects
    console.log(`Playing ${type} sound`);
}

// Screen management
function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    document.getElementById(screenName).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="showScreen('${screenName}')"]`)?.classList.add('active');
    
    currentScreen = screenName;
    
    // Initialize screen-specific content
    if (screenName === 'marketplace') {
        renderProducts();
    }
    
    playSound('navigate');
}

// Language management
function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="setLanguage('${lang}')"]`).classList.add('active');
    
    // Update content based on language
    updateContent();
    showToast(`Language changed to ${lang.toUpperCase()}`);
}

function updateContent() {
    const trans = translations[currentLanguage] || translations['hi'];
    // Update UI elements with translations
    // This would be expanded for full internationalization
}

// Voice functionality
function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    const status = document.getElementById('voiceStatus');
    status.textContent = voiceEnabled ? 'Voice ON' : 'Voice OFF';
    showToast(`Voice assistant ${voiceEnabled ? 'enabled' : 'disabled'}`);
}

function startVoiceInput() {
    const voiceBot = document.getElementById('voiceBot');
    voiceBot.classList.add('listening');
    
    // Simulate voice recognition
    setTimeout(() => {
        voiceBot.classList.remove('listening');
        showToast('Voice input received');
    }, 2000);
}

// Login functionality
function startLogin() {
    if (isLoggedIn) {
        showScreen('dashboard');
    } else {
        showScreen('otp-login');
    }
}

function validatePhone() {
    const phone = document.getElementById('phoneInput').value;
    const getOtpBtn = document.getElementById('getOtpBtn');
    
    if (phone.length === 10 && /^\d+$/.test(phone)) {
        getOtpBtn.disabled = false;
        getOtpBtn.style.opacity = '1';
    } else {
        getOtpBtn.disabled = true;
        getOtpBtn.style.opacity = '0.6';
    }
}

function sendOTP() {
    const phone = document.getElementById('phoneInput').value;
    if (phone.length !== 10) {
        showToast('Please enter a valid 10-digit mobile number', true);
        return;
    }
    
    document.getElementById('otpSection').classList.remove('hidden');
    startResendTimer();
    showToast('OTP sent successfully!');
    
    // Auto-focus first OTP box
    document.querySelector('.otp-box').focus();
}

function moveToNext(current, nextIndex) {
    if (current.value.length === 1 && nextIndex <= 6) {
        const nextInput = document.querySelectorAll('.otp-box')[nextIndex - 1];
        if (nextInput) {
            nextInput.focus();
        }
    }
    
    // Check if all OTP boxes are filled
    const otpBoxes = document.querySelectorAll('.otp-box');
    const allFilled = Array.from(otpBoxes).every(box => box.value.length === 1);
    
    if (allFilled) {
        verifyOTP();
    }
}

function startResendTimer() {
    resendCountdown = 30;
    const timerElement = document.getElementById('resendTimer');
    const resendBtn = document.getElementById('resendBtn');
    
    timerElement.classList.remove('hidden');
    resendBtn.classList.add('hidden');
    
    otpTimer = setInterval(() => {
        resendCountdown--;
        timerElement.textContent = `Resend OTP in ${resendCountdown}s`;
        
        if (resendCountdown <= 0) {
            clearInterval(otpTimer);
            timerElement.classList.add('hidden');
            resendBtn.classList.remove('hidden');
        }
    }, 1000);
}

function resendOTP() {
    startResendTimer();
    showToast('OTP resent successfully!');
}

function callForOTP() {
    showToast('You will receive a call with OTP shortly');
}

function verifyOTP() {
    const otpBoxes = document.querySelectorAll('.otp-box');
    const otp = Array.from(otpBoxes).map(box => box.value).join('');
    
    if (otp.length !== 3) {
        showToast('Please enter complete OTP', true);
        return;
    }
    
    // Simulate OTP verification
    if (otp === '123' || otp.length === 3) {
        isLoggedIn = true;
        showToast('Login successful! Welcome to Navi Soch');
        setTimeout(() => {
            showScreen('dashboard');
        }, 1000);
    } else {
        showToast('Invalid OTP. Please try again.', true);
    }

}


// Marketplace functionality
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentFilter === 'all' || product.category === currentFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.emoji}
                <div class="product-badge">Fresh</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    ₹${product.price.toFixed(2)} <span class="price-unit">${product.unit}</span>
                </div>
                <div class="product-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                        <span class="quantity-display" id="qty-${product.id}">1</span>
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderProducts();
}

function changeQuantity(productId, change) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyElement.textContent);
    currentQty = Math.max(1, currentQty + change);
    qtyElement.textContent = currentQty;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).textContent);
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    document.getElementById(`qty-${productId}`).textContent = '1';
    showToast(`${product.name.split(' / ')[0]} added to cart!`);
    
    // Cart animation
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const totalAmount = document.getElementById('totalAmount');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--muted-taupe);">
                <div style="font-size: 4rem; margin-bottom: 20px;">🛒</div>
                <p>Your cart is empty / आपकी गाड़ी खाली है</p>
            </div>
        `;
        cartTotal.classList.add('hidden');
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid var(--border-light);">
                <div style="font-size: 2rem; width: 60px; height: 60px; background: var(--sand); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    ${item.emoji}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 5px; color: var(--text-dark);">${item.name.split(' / ')[0]}</div>
                    <div style="color: var(--success-olive); font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = total.toFixed(2);
        cartTotal.classList.remove('hidden');
    }
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    updateCartDisplay();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (sidebar.style.right === '0px') {
        closeCart();
    } else {
        sidebar.style.right = '0px';
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    }
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.style.right = '-400px';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
}

function checkout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showToast(`Order placed successfully! Total: ₹${total.toFixed(2)}`);
    
    cart = [];
    updateCartDisplay();
    closeCart();
}

// Feature functions
function showDemo() {
    showToast('Demo video will open shortly');
}

function addNewCrop() {
    showToast('Add new crop wizard opening...');
}

function showSmartPrice() {
    showToast('Smart price analysis with APMC/eNAM data');
}

function bookTransport() {
    showToast('Transport booking system opening...');
}

function coldStorage() {
    showToast('Cold storage booking available');
}

function digitalContract() {
    showToast('Digital contract generator opening...');
}

function applyScheme() {
    showToast('Government scheme application form opening...');
}

function trackApplication() {
    showToast('Application tracking system loading...');
}

function learnRights() {
    showToast('Legal rights learning module opening...');
}

function reportScam() {
    showToast('Scam reporting form opening...');
}

function compareLoans() {
    showToast('Loan comparison tool opening...');
}

function savingsLessons() {
    showToast('Financial literacy lessons starting...');
}

function verifyUPIID() {
    const upiInput = document.getElementById('upiInput');
    const upiResult = document.getElementById('upiResult');
    
    if (!upiInput || !upiInput.value) {
        showToast('Please enter UPI ID to verify', true);
        return;
    }
    
    // Simulate UPI verification
    const isValid = upiInput.value.includes('@') && upiInput.value.length > 5;
    
    upiResult.innerHTML = `
        <div style="background: ${isValid ? 'rgba(107, 138, 76, 0.1)' : 'rgba(215, 48, 39, 0.1)'}; color: ${isValid ? 'var(--success-olive)' : 'var(--error-red)'}; padding: 15px; border-radius: 8px;">
            <strong>${isValid ? '✅ Valid UPI ID' : '❌ Invalid UPI ID'}</strong><br>
            <small>${isValid ? 'This UPI ID is verified and safe to use' : 'This UPI ID appears to be invalid or suspicious'}</small>
        </div>
    `;
    upiResult.classList.remove('hidden');
}

function scamChoice(choice) {
    const isCorrect = choice === 'scam';
    showToast(isCorrect ? 
        '✅ Correct! This is a scam. Government never asks for fees to claim benefits.' : 
        '❌ This is actually a scam. Government schemes are free and never ask for processing fees.',
        !isCorrect
    );
}

function safetyCourse() {
    showToast('Mobile safety course starting...');
}

function protectedBrowser() {
    showToast('Protected browser opening with fraud site blocking...');
}

function uploadDiseasePhoto() {
    showToast('Camera opening for plant disease detection...');
}

function weatherAlerts() {
    showToast('Weather and Bhuvan satellite alerts loading...');
}

function expertQA() {
    showToast('Weekly expert Q&A session details loading...');
}

function playVoicePreview() {
    showToast('🔊 नमस्ते, मैं आपका सहायक हूँ');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Phone input validation
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', validatePhone);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', renderProducts);
    }
    
    // Voice bot click handler
    document.getElementById('voiceBot').addEventListener('click', function() {
        const phrases = [
            'Apply for Fasal Bima',
            'आज का दाम दिखाओ',
            'UPI verify करो',
            'Weather update chahiye',
            'Loan ke baare mein batao'
        ];
        
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        showToast(`Voice command: "${randomPhrase}"`);
        
        // Simulate voice command processing
        this.classList.add('listening');
        setTimeout(() => {
            this.classList.remove('listening');
            
            if (randomPhrase.includes('दाम') || randomPhrase.includes('price')) {
                showScreen('marketplace');
            } else if (randomPhrase.includes('Fasal')) {
                showScreen('legal');
            } else if (randomPhrase.includes('UPI')) {
                showScreen('cyber');
            } else if (randomPhrase.includes('Weather')) {
                showScreen('community');
            } else if (randomPhrase.includes('Loan')) {
                showScreen('finance');
            }
        }, 2000);
    });
    
    // Initialize cart display
    updateCartDisplay();
    
    // PWA installation prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install prompt after a delay
        setTimeout(() => {
            if (deferredPrompt) {
                showToast('Install Navi Soch app for offline access!');
            }
        }, 5000);
    });
});

// PWA Service Worker Registration (simulated)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Simulate service worker registration
        console.log('Service Worker registered for offline functionality');
        showToast('App ready for offline use!');
    });
}

// Responsive cart for mobile
window.addEventListener('resize', function() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (window.innerWidth <= 768) {
        cartSidebar.style.width = '100%';
    } else {
        cartSidebar.style.width = '400px';
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCart();
    }
    
    // Alt + number keys for quick navigation
    if (e.altKey) {
        switch(e.key) {
            case '1': showScreen('landing'); break;
            case '2': showScreen('marketplace'); break;
            case '3': showScreen('legal'); break;
            case '4': showScreen('finance'); break;
            case '5': showScreen('cyber'); break;
            case '6': showScreen('community'); break;
            case '7': showScreen('elocker'); break;
            case '8': showScreen('settings'); break;
        }
    }
});

// Simulate offline/online status
function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    const statusIndicator = document.querySelector('.trust-chip');
    
    if (!isOnline) {
        showToast('You are offline. App functionality available via PWA mode.', true);
        // Show offline banner
        const offlineBanner = document.createElement('div');
        offlineBanner.style.cssText = `
            position: fixed; 
            top: 0; 
            left: 0; 
            right: 0; 
            background: var(--error-red); 
            color: white; 
            text-align: center; 
            padding: 10px; 
            z-index: 1002;
            font-size: 14px;
        `;
        offlineBanner.textContent = '📡 Offline Mode - Limited functionality available';
        offlineBanner.id = 'offline-banner';
        document.body.appendChild(offlineBanner);
    } else {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.remove();
        }
        showToast('Back online! Full functionality restored.');
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Accessibility improvements
function announceForScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Enhanced voice commands simulation
const voiceCommands = {
    'market': () => showScreen('marketplace'),
    'बाजार': () => showScreen('marketplace'),
    'legal': () => showScreen('legal'),
    'कानूनी': () => showScreen('legal'),
    'finance': () => showScreen('finance'),
    'वित्त': () => showScreen('finance'),
    'cyber': () => showScreen('cyber'),
    'सुरक्षा': () => showScreen('cyber'),
    'community': () => showScreen('community'),
    'समुदाय': () => showScreen('community'),
    'settings': () => showScreen('settings'),
    'सेटिंग्स': () => showScreen('settings'),
    'home': () => showScreen('landing'),
    'घर': () => showScreen('landing')
};

// Simulate geolocation for farmer location
function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Location detected:', position.coords);
                showToast('Location detected: Bengaluru, Karnataka');
            },
            (error) => {
                console.log('Location detection failed:', error);
                showToast('Using default location: Bengaluru, Karnataka');
            }
        );
    }
}

// Initialize app
function initializeApp() {
    detectLocation();
    updateOnlineStatus();
    
    // Show welcome message after a short delay
    setTimeout(() => {
        if (!isLoggedIn) {
            showToast('Welcome to Navi Soch! Your farming assistant is ready.');
        }
    }, 2000);
    
    // Preload critical resources
    const criticalScreens = ['otp-login', 'dashboard', 'marketplace'];
    criticalScreens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) {
            element.style.display = 'none';
            element.style.display = '';
        }
    });
}

// Start the app
initializeApp();

// Export functions for testing (in real app, these would be properly modularized)
window.NaviSoch = {
    showScreen,
    setLanguage,
    toggleVoice,
    sendOTP,
    verifyOTP,
    addToCart,
    checkout,
    updateCartDisplay,
    showToast
};