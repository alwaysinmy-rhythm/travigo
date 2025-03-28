<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TraviGo - Explore Destinations</title>
    <link rel="stylesheet" href="./CSS/explore.css">
</head>
<body>
    <header>
        <div class="logo">
            <h1>TraviGo</h1>
        </div>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="index.php#dashboard">Itineraries</a></li>
                <li><a href="index.php#bookings">Bookings</a></li>
                <li><a href="explore.php" class="active">Explore</a></li>
                <li><a href="aboutus.php">About Us</a></li>

            </ul>
        </nav>
        <div class="user-auth">
            <a href="login.php" id="loginBtn">Login</a>
            <a href="login.php?signup=true" id="signupBtn">Sign Up</a>
            <div class="user-profile hidden">
                <img src="./images/maleProfile.png" alt="Profile">
                <span>Username</span>
            </div>
        </div>
    </header>

    <main>
        <section class="explore-container">
            <div class="explore-header">
                <h2>Explore Tourist Attractions</h2>
                <p>Discover amazing places to visit in your next destination</p>
            </div>

            <div class="search-box">
                <form id="exploreForm">
                    <div class="input-group">
                        <input type="text" name="city" id="city" placeholder="Enter a city name (e.g., Paris, Rome, Tokyo)" required>
                        <button type="submit" class="btn-search">Explore</button>
                    </div>
                </form>
            </div>

            <div id="searchInfo" class="search-info hidden">
                <h3>Tourist Attractions in <span id="cityName"></span></h3>
                <div id="searchSpinner" class="spinner">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div>
            </div>

            <div id="resultsContainer">
                <!-- Results will be loaded here -->
                <div id="attractionsGrid" class="attractions-grid hidden"></div>
                <div id="noResults" class="no-results hidden"></div>
            </div>

            <!-- Popular destinations section - shown when no search is performed -->
            <div id="popularDestinations" class="popular-destinations">
                <h3>Popular Destinations</h3>
                <div class="destinations-grid">
                    <div class="destination-card">
                        <img src="./images/paris.png" alt="Paris">
                        <h4>Paris</h4>
                        <button class="btn-explore" data-city="Paris">Explore</button>
                    </div>
                    <div class="destination-card">
                        <img src="./images/rome.png" alt="Rome">
                        <h4>Rome</h4>
                        <button class="btn-explore" data-city="Rome">Explore</button>
                    </div>
                    <div class="destination-card">
                        <img src="./images/tokyo.png" alt="Tokyo">
                        <h4>Tokyo</h4>
                        <button class="btn-explore" data-city="Tokyo">Explore</button>
                    </div>
                    <div class="destination-card">
                        <img src="./images/newyork.png" alt="New York">
                        <h4>New York</h4>
                        <button class="btn-explore" data-city="New York">Explore</button>
                    </div>
                    <div class="destination-card">
                        <img src="./images/barcelona.png" alt="Barcelona">
                        <h4>Barcelona</h4>
                        <button class="btn-explore" data-city="Barcelona">Explore</button>
                    </div>
                    <div class="destination-card">
                        <img src="./images/dubai.png" alt="Dubai">
                        <h4>Dubai</h4>
                        <button class="btn-explore" data-city="Dubai">Explore</button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Attraction Info Modal -->
    <div id="attractionModal" class="modal hidden">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modalContent">
                <!-- Modal content will be loaded dynamically -->
                <div id="modalSpinner" class="spinner">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h4>Travel Planner</h4>
                <p>Plan your dream journey with ease</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Connect With Us</h4>
                <div class="social-icons">
                    <a href="#" class="social-icon">FB</a>
                    <a href="#" class="social-icon">TW</a>
                    <a href="#" class="social-icon">IG</a>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p>&copy; 2025 Travel Planner. All rights reserved.</p>
        </div>
    </footer>

    <script src="./JS/explore.js"></script>
</body>
</html>