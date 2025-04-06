const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');

var currentUser = null;     //this var will contain the details about the logged in user.

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in via localStorage
    logoutBtn.addEventListener('click', handleLogout); 
    checkUserLoginStatus();
    
})

// Check localStorage for logged in user and update UI
function checkUserLoginStatus() {
    const storedUsername = localStorage.getItem('currentUser');
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUsername) {
        // User is logged in
        let userData = { name: storedUsername };
        
        // Try to get complete user data if available
        if (storedUserData) {
            try {
                const parsedUserData = JSON.parse(storedUserData);
                userData = {
                    name: parsedUserData.usernaname || storedUsername,
                    email: parsedUserData.email || '',
                    avatar: './images/maleProfile.png'
                };
            } catch (e) {
                console.error('Error parsing user data from localStorage', e);
            }
        }
        
        // Set current user
        currentUser = userData;
        
        // Update UI to show username if user is logged in. 
        updateUserInterface();
        
    }
}

function updateUserInterface() {
    if (currentUser) {
        // Hide login/signup buttons
        loginBtn.classList.add('hidden');
        signupBtn.classList.add('hidden');
        
        // Show user profile
        var userProfile = document.querySelector('.user-profile');
        userProfile.classList.remove('hidden');
        
        // Update user info
        var userImg = userProfile.querySelector('img');
        var userName = userProfile.querySelector('span');
        
        // userImg.src = currentUser.avatar;
        userName.textContent = currentUser.name;
    } else {
        // Show login/signup buttons
        loginBtn.classList.remove('hidden');
        signupBtn.classList.remove('hidden');
        
        // Hide user profile
        document.querySelector('.user-profile').classList.add('hidden');
    }
}

function handleLogout(e) {
    e.preventDefault();

    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userData');
    
    // Reset current user
    currentUser = null;
    
    // Update UI
    updateUserInterface();
    
    // Redirect to home
    window.location.href = '';
}


document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const noResults = document.getElementById('noResults');
    if(!currentUser)window.location.replace('login.html')
    // Add event listeners
    searchBtn.addEventListener('click', searchAccommodations);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchAccommodations();
        }
    });
    
    // Function to search accommodations
    function searchAccommodations() {
        const city = cityInput.value.trim();
        
        if (!city) {
            alert('Please enter a city name to search.');
            return;
        }
        
        // Show loading indicator
        resultsContainer.style.display = 'none';
        noResults.style.display = 'none';
        
        // Fetch data from backend
        fetch('./backend/getBookings.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city: city })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
                // return response.json();
            }
            return response.json();
        })
        .then(data => {
            // Process and display results
            displayResults(data, city);
        })
        .catch(error => {
            console.error('Error fetching accommodations:', error);
            // console.log(error)
            
            // Show error message
            noResults.style.display = 'block';
            resultsContainer.style.display = 'none';
        });
    }
    
    // Function to display search results
    function displayResults(accommodations, city) {
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Check if there are results
        if (accommodations.length === 0) {
            noResults.style.display = 'block';
            resultsContainer.style.display = 'none';
            return;
        }
        
        // Show results container
        resultsContainer.style.display = 'flex';
        noResults.style.display = 'none';
        
        // Add heading
        const heading = document.createElement('h2');
        heading.className = 'results-heading';
        heading.textContent = `Accommodations in ${city}`;
        resultsContainer.appendChild(heading);
        
        // Create card for each accommodation
        accommodations.forEach(accommodation => {
            // Create accommodation card
            const card = createAccommodationCard(accommodation);
            resultsContainer.appendChild(card);
        });
    }
    
    // Function to create accommodation card
    function createAccommodationCard(accommodation) {
        const card = document.createElement('div');
        card.className = 'accommodation-card';
        
        // Get icon based on accommodation type
        let typeIcon = 'fa-hotel';
        if (accommodation.acco_type === 'resort') typeIcon = 'fa-umbrella-beach';
        else if (accommodation.acco_type === 'apartment') typeIcon = 'fa-building';
        else if (accommodation.acco_type === 'villa') typeIcon = 'fa-home';
        else if (accommodation.acco_type === 'hostel') typeIcon = 'fa-users';
        
        // Create HTML for the card
        card.innerHTML = `
            <div class="accommodation-image">
                <i class="fas ${typeIcon}"></i>
            </div>
            <div class="accommodation-details">
                <div class="accommodation-header">
                    <div class="accommodation-title">
                        <h2>${accommodation.acco_name}</h2>
                        <div class="accommodation-type">${capitalizeFirstLetter(accommodation.acco_type)}</div>
                    </div>
                    <div class="accommodation-price">
                        $${accommodation.price}<span>/night</span>
                    </div>
                </div>
                <div class="accommodation-rating">
                    <div class="rating-stars">
                        ${generateStars(accommodation.rating)}
                    </div>
                    <div class="rating-value">${accommodation.rating}</div>
                </div>
                <div class="accommodation-description">
                    ${accommodation.acco_description}
                </div>
                <div class="accommodation-location">
                    <i class="fas fa-map-marker-alt"></i> ${accommodation.city}
                </div>
                <a href="#" class="booking-button">Book Now</a>
            </div>
        `;
        
        return card;
    }
    
    // Helper function to generate star rating
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Add half star
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Add empty stars
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});