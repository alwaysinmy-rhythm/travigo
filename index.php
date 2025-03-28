<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TraviGo</title>
    <link rel="stylesheet" href="index.css">
    
</head>
<body>
    <header>
        <div class="logo">
            <h1>TraviGo</h1>
        </div>
        <nav>
            <ul>
                <li><a href="#" class="active">Home</a></li>
                <li><a href="#dashboard">Itineraries</a></li>
                <li><a href="#bookings">Bookings</a></li>
                <li><a href="explore.php">Explore</a></li>
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
        <!-- Dashboard Section -->
        <section class="dashboard" id="dashboard">
            <div class="welcome-banner">
                <h2>Plan Your Dream Journey</h2>
                <p>Create personalized itineraries, book accommodations, and discover amazing attractions</p>
                <button id="createItineraryBtn">Create New Itinerary</button>
            </div>

            <div class="search-section" id="bookings">
                <h3>Search Destinations</h3>
                <form id="searchForm">
                    <div class="search-row">
                        <div class="form-group">
                            <label for="destination">Destination</label>
                            <input type="text" id="destination" placeholder="City, Country">
                        </div>
                        <div class="form-group">
                            <label for="dates">Dates</label>
                            <input type="text" id="dates" placeholder="MM/DD/YYYY - MM/DD/YYYY">
                        </div>
                        <div class="form-group">
                            <label for="travelers">Travelers</label>
                            <select id="travelers">
                                <option value="1">1 Person</option>
                                <option value="2">2 People</option>
                                <option value="3">3 People</option>
                                <option value="4">4 People</option>
                                <option value="5+">5+ People</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <button type="submit">Search</button>
                    </div>
                </form>
            </div>

            <!-- Itinerary Builder Section -->
            <div class="itinerary-builder hidden" id="itineraryBuilder">
                <div class="itinerary-header">
                    <input type="text" id="itineraryTitle" placeholder="My Dream Vacation">
                    <div class="date-range">
                        <input type="date" id="startDate">
                        <span>to</span>
                        <input type="date" id="endDate">
                    </div>
                    <button id="saveItineraryBtn">Save Itinerary</button>
                </div>
                
                <div class="itinerary-content">
                    <div class="days-container">
                        <div class="day-tabs" id="dayTabs">
                            <!-- Day tabs will be generated here -->
                        </div>
                        <button id="addDayBtn">+ Add Day</button>
                    </div>
                    
                    <div class="day-activities" id="dayActivities">
                        <!-- Activities for the selected day -->
                        <div class="timeline">
                            <!-- Timeline items will be added here -->
                        </div>
                        <button id="addActivityBtn">+ Add Activity</button>
                    </div>
                    
                    <div class="map-container">
                        <div id="map">
                            <!-- Map will be rendered here -->
                            <img src="https://via.placeholder.com/400x600?text=Map+View" alt="Map placeholder">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search Results Section -->
            <div class="search-results hidden" id="searchResults">
                <div class="filters">
                    <div class="filter-group">
                        <h4>Accommodation Type</h4>
                        <label><input type="checkbox" value="hotel"> Hotels</label>
                        <label><input type="checkbox" value="hostel"> Hostels</label>
                        <label><input type="checkbox" value="apartment"> Apartments</label>
                    </div>
                    <div class="filter-group">
                        <h4>Price Range</h4>
                        <input type="range" min="0" max="1000" value="500" id="priceRange">
                        <div class="range-labels">
                            <span>$0</span>
                            <span id="priceValue">$500</span>
                            <span>$1000+</span>
                        </div>
                    </div>
                    <div class="filter-group">
                        <h4>Rating</h4>
                        <label><input type="checkbox" value="5"> 5+ Stars</label>
                        <label><input type="checkbox" value="4"> 4+ Stars</label>
                        <label><input type="checkbox" value="3"> 3+ Stars</label>
                    </div>
                </div>
                <div class="results-list" id="resultsList">
                    <!-- Results will be loaded here -->
                </div>
            </div>

            <!-- My Itineraries Section -->
            <div class="my-itineraries hidden" id="myItineraries">
                <h3>My Itineraries</h3>
                <div class="itinerary-cards" id="itineraryCards">
                    <!-- Itinerary cards will be loaded here -->
                </div>
            </div>
        </section>
    </main>

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

  
    <script src="index.js"></script>
</body>
</html>