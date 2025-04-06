// Login and Signup form handling
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginPanel = document.getElementById('loginPanel');
    const signupPanel = document.getElementById('signupPanel');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');
    
    // Check if we should show signup based on URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signup') === 'true') {
        showSignupForm();
    }
    
    // Switch between forms
    showSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSignupForm();
    });
    
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
    function showSignupForm() {
        loginPanel.classList.add('hidden');
        signupPanel.classList.remove('hidden');
        // Reset form when switching
        loginForm.reset();
        // Clear any messages
        loginMessage.classList.add('hidden');
        loginMessage.textContent = '';
        // Add animation class
        signupPanel.style.animation = 'none';
        setTimeout(() => {
            signupPanel.style.animation = 'fadeIn 0.5s ease forwards';
        }, 10);
    }
    
    function showLoginForm() {
        signupPanel.classList.add('hidden');
        loginPanel.classList.remove('hidden');
        // Reset form when switching
        signupForm.reset();
        // Clear any messages
        signupMessage.classList.add('hidden');
        signupMessage.textContent = '';
        // Add animation class
        loginPanel.style.animation = 'none';
        setTimeout(() => {
            loginPanel.style.animation = 'fadeIn 0.5s ease forwards';
        }, 10);
    }
    
    // Login form submission with authentication
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('loginRemember').checked;
        
        // Basic validation
        if (!username || !password) {
            showLoginMessage('error', 'Please fill in all required fields');
            return;
        }
        
        // Show loading message
        showLoginMessage('info', 'Logging in...');
        
        // Create FormData object
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('remember', remember);
        
        // Send data to server using fetch API
        fetch('./backend/authenticate.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Show success message
                showLoginMessage('success', data.message || 'Login successful!');
                
                // Store user info in localStorage if remember is checked or as a default
                localStorage.setItem('currentUser', username);
                
                // Store complete user data if available
                if (data.userData) {
                    localStorage.setItem('userData', JSON.stringify(data.userData));
                }
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 1000);
            } else {
                // Show error message
                showLoginMessage('error', data.message || 'Invalid username or password');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showLoginMessage('error', 'A server error occurred. Please try again later.');
        });
    });
    
    // Signup form submission with database insertion
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const street = document.getElementById('signupStreet').value;
        const city = document.getElementById('signupCity').value;
        const zip = document.getElementById('signupZip').value;
        const terms = document.getElementById('signupTerms').checked;
        
        // Basic validation
        if (!username || !name || !email || !password || !street || !city || !zip) {
            showSignupMessage('error', 'Please fill in all required fields');
            return;
        }
        
        // Terms validation
        if (!terms) {
            showSignupMessage('error', 'You must agree to the Terms and Conditions');
            return;
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showSignupMessage('error', 'Please enter a valid email address');
            return;
        }
        
        // Show loading message
        showSignupMessage('info', 'Creating your account...');
        
        // Create FormData object
        const formData = new FormData();
        formData.append('username', username);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('street', street);
        formData.append('city', city);
        formData.append('zip', zip);
        
        // Send data to server using fetch API
        fetch('./backend/register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Show success message
                showSignupMessage('success', data.message || 'Account created successfully!');
                
                // Store user info in localStorage
                localStorage.setItem('currentUser', username);
                localStorage.setItem('userData', JSON.stringify({
                    username,
                    name,
                    email,
                    address: {
                        street,
                        city,
                        zip
                    }
                }));
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 1500);
            } else {
                // Show error message
                showSignupMessage('error', data.message || 'An error occurred. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showSignupMessage('error', 'A server error occurred. Please try again later.');
        });
    });
    
    // Helper function to show login messages
    function showLoginMessage(type, text) {
        loginMessage.textContent = text;
        loginMessage.className = 'message ' + type;
        loginMessage.classList.remove('hidden');
    }
    
    // Helper function to show signup messages
    function showSignupMessage(type, text) {
        signupMessage.textContent = text;
        signupMessage.className = 'message ' + type;
        signupMessage.classList.remove('hidden');
    }
    
    // Enhanced field validation with visual feedback
    const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    allInputs.forEach(input => {
        // Add blur event for validation
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '';
            }
            
            // Specific validation for email
            if (this.type === 'email' && this.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.style.borderColor = '#e74c3c';
                }
            }
        });
        
        // Reset validation on focus
        input.addEventListener('focus', function() {
            this.style.borderColor = '';
        });
    });
});