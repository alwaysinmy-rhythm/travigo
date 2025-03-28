<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TraviGo - Login/Signup</title>
    <link rel="stylesheet" href="./CSS/login.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>TraviGo</h1>
            <p>Your journey begins here</p>
        </div>
        
        <div class="forms-container">
            <!-- Login Form -->
            <div class="form-panel" id="loginPanel">
                <div class="form-header">
                    <h2>Login</h2>
                    <p>Welcome back, traveler!</p>
                </div>
                <form id="loginForm">
                    <div id="loginMessage" class="message hidden"></div>
                    <div class="form-group">
                        <label for="loginUsername">Username</label>
                        <input type="text" id="loginUsername" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" name="password" required>
                    </div>
                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" name="remember" id="loginRemember">
                            <span class="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#" class="forgot-link">Forgot password?</a>
                    </div>
                    <button type="submit" class="btn-submit">Login</button>
                </form>
                <div class="form-switch">
                    <p>Don't have an account? <a href="#" id="showSignup">Create one</a></p>
                </div>
            </div>
            
            <!-- Signup Form -->
            <div class="form-panel hidden" id="signupPanel">
                <div class="form-header">
                    <h2>Sign Up</h2>
                    <p>Join our travel community</p>
                </div>
                <form id="signupForm">
                    <div id="signupMessage" class="message hidden"></div>
                    <div class="form-group">
                        <label for="signupUsername">Username</label>
                        <input type="text" id="signupUsername" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="signupName">Full Name</label>
                        <input type="text" id="signupName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="signupEmail">Email</label>
                        <input type="email" id="signupEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="signupPassword">Password</label>
                        <input type="password" id="signupPassword" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="signupStreet">Street Address</label>
                        <input type="text" id="signupStreet" name="street" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group half">
                            <label for="signupCity">City</label>
                            <input type="text" id="signupCity" name="city" required>
                        </div>
                        <div class="form-group half">
                            <label for="signupZip">Zip Code</label>
                            <input type="text" id="signupZip" name="zip" required>
                        </div>
                    </div>
                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" name="terms" id="signupTerms" required>
                            <span class="checkmark"></span>
                            I agree to the <a href="#">Terms and Conditions</a>
                        </label>
                    </div>
                    <button type="submit" class="btn-submit">Create Account</button>
                </form>
                <div class="form-switch">
                    <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <a href="index.php" class="back-link">Back to Home</a>
            <p>&copy; 2025 TraviGo. All rights reserved.</p>
        </div>
    </div>

    <script src="./JS/login.js"></script>
</body>
</html>