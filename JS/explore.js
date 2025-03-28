// OpenTripMap API Key
const apiKey = "5ae2e3f221c38a28845f05b6aae87712eb7920f523b7cc7ab07e88c3";

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const exploreForm = document.getElementById('exploreForm');
    const cityInput = document.getElementById('city');
    const cityNameSpan = document.getElementById('cityName');
    const searchInfo = document.getElementById('searchInfo');
    const searchSpinner = document.getElementById('searchSpinner');
    const attractionsGrid = document.getElementById('attractionsGrid');
    const noResults = document.getElementById('noResults');
    const popularDestinations = document.getElementById('popularDestinations');
    const attractionModal = document.getElementById('attractionModal');
    const modalContent = document.getElementById('modalContent');
    const modalSpinner = document.getElementById('modalSpinner');
    const closeBtn = document.querySelector('.close');
    const popularButtons = document.querySelectorAll('.btn-explore');

    // Initialize CORS proxy settings - required to bypass CORS issues with OpenTripMap API
    // For production use, consider setting up your own proxy server
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    
    // Handle URL parameters for city
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    
    if (cityParam) {
        cityInput.value = cityParam;
        // Submit the form programmatically
        setTimeout(() => {
            exploreForm.dispatchEvent(new Event('submit'));
        }, 500);
    }
    
    // Form submission
    exploreForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        
        if (city) {
            searchForCity(city);
        }
    });
    
    // Popular destination buttons
    popularButtons.forEach(button => {
        button.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            cityInput.value = city;
            searchForCity(city);
        });
    });
    
    // Close modal when clicking the X
    closeBtn.addEventListener('click', function() {
        attractionModal.classList.add('hidden');
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === attractionModal) {
            attractionModal.classList.add('hidden');
        }
    });
    
    // Main function to search for a city
    function searchForCity(city) {
        // Update UI to show we're searching
        cityNameSpan.textContent = city;
        searchInfo.classList.remove('hidden');
        searchSpinner.classList.remove('hidden');
        attractionsGrid.classList.add('hidden');
        noResults.classList.add('hidden');
        popularDestinations.classList.add('hidden');
        
        // Clear previous results
        attractionsGrid.innerHTML = '';
        
        // Step 1: Get coordinates for the city
        const geoUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(city)}&apikey=${apiKey}`;
        
        fetch(geoUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(geoData => {
                if (geoData.status === 'NOT_FOUND' || !geoData.lat || !geoData.lon) {
                    throw new Error('City not found');
                }
                
                // Step 2: Get attractions near these coordinates
                return fetchAttractions(geoData.lat, geoData.lon);
            })
            .then(attractions => {
                if (attractions.length === 0) {
                    throw new Error('No attractions found');
                }
                
                // Step 3: Get details for each attraction
                return processAttractions(attractions);
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Handle errors
                searchSpinner.classList.add('hidden');
                noResults.classList.remove('hidden');
                
                if (error.message === 'City not found') {
                    noResults.innerHTML = `<p>We couldn't find "${city}" in our database. Please check the spelling or try another city.</p>`;
                } else if (error.message === 'No attractions found') {
                    noResults.innerHTML = `<p>No attractions found in ${city}. Please try another city.</p>`;
                } else {
                    noResults.innerHTML = `<p>Sorry, something went wrong. Please try again later.</p>`;
                }
            });
    }
    
    // Fetch attractions near coordinates
    function fetchAttractions(lat, lon) {
        // Set parameters for attractions search
        const radius = 5000; // 5km radius
        const limit = 20;    // Limit to 20 results
        
        const placesUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=cultural,historic,architecture,religion,natural&limit=${limit}&rate=2&format=json&apikey=${apiKey}`;
        
        return fetch(placesUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }
    
    // Process attractions data
    async function processAttractions(attractions) {
        searchSpinner.classList.add('hidden');
        attractionsGrid.classList.remove('hidden');
        
        // Counter for successfully loaded attractions
        let loadedCount = 0;
        const minAttractions = 4;  // Minimum number of attractions to show
        
        // Process each attraction - limit to top 12 to avoid too many API calls
        const limitedAttractions = attractions.slice(0, 12);
        
        // Create a container for promises
        const detailPromises = limitedAttractions.map(place => {
            if (!place.xid) {
                return Promise.resolve(null);  // Skip items without xid
            }
            
            const detailsUrl = `https://api.opentripmap.com/0.1/en/places/xid/${place.xid}?apikey=${apiKey}`;
            
            // Fetch details for this attraction
            return fetch(detailsUrl)
                .then(response => {
                    if (!response.ok) {
                        return null;  // Skip if we can't get details
                    }
                    return response.json();
                })
                .then(details => {
                    if (!details || !details.name) {
                        return null;  // Skip if no useful details
                    }
                    
                    // Successfully fetched details, increment counter
                    loadedCount++;
                    
                    // Create attraction card
                    createAttractionCard(details);
                    
                    return details;
                })
                .catch(error => {
                    console.error(`Error fetching details for ${place.xid}:`, error);
                    return null;
                });
        });
        
        // Wait for all detail requests to complete
        await Promise.all(detailPromises);
        
        // Check if we loaded enough attractions
        if (loadedCount < minAttractions) {
            if (loadedCount === 0) {
                // No attractions loaded
                attractionsGrid.classList.add('hidden');
                noResults.classList.remove('hidden');
                noResults.innerHTML = `<p>Sorry, we couldn't load any attractions for this location. Please try another city.</p>`;
            } else {
                // Some attractions loaded, but not enough - still show them
                const infoMessage = document.createElement('div');
                infoMessage.className = 'info-message';
                infoMessage.innerHTML = `<p>We found a limited number of attractions for this location. Try exploring a different city for more options.</p>`;
                attractionsGrid.parentNode.insertBefore(infoMessage, attractionsGrid.nextSibling);
            }
        }
    }
    
    // Create an attraction card and add it to the grid
    function createAttractionCard(details) {
        // Set default image if none available
        let imageUrl = "https://placehold.co/300x200?text=No+Image";
        
        // Check if there's a preview image
        if (details.preview && details.preview.source) {
            imageUrl = details.preview.source;
        }
        
        // Get place name and description
        const name = details.name;
        
        let description = '';
        if (details.wikipedia_extracts && details.wikipedia_extracts.text) {
            description = details.wikipedia_extracts.text;
        } else if (details.info && details.info.descr) {
            description = details.info.descr;
        } else {
            description = "No description available.";
        }
        
        // Limit description length
        if (description.length > 150) {
            description = description.substring(0, 147) + '...';
        }
        
        // Determine category/kind
        const kinds = details.kinds ? details.kinds.split(',') : ['tourist'];
        const primaryKind = kinds[0].charAt(0).toUpperCase() + kinds[0].slice(1).replace('_', ' ');
        
        // Create the card element
        const card = document.createElement('div');
        card.className = 'attraction-card';
        
        card.innerHTML = `
            <div class="attraction-image">
                <img src="${imageUrl}" alt="${name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            </div>
            <div class="attraction-details">
                <h4>${name}</h4>
                <span class="attraction-type">${primaryKind}</span>
                <p>${description}</p>
                <div class="attraction-actions">
                    <button class="btn-add-itinerary" data-xid="${details.xid}">Add to Itinerary</button>
                    <button class="btn-more-info" data-xid="${details.xid}">More Info</button>
                </div>
            </div>
        `;
        
        // Add event listeners to buttons
        const addBtn = card.querySelector('.btn-add-itinerary');
        const infoBtn = card.querySelector('.btn-more-info');
        
        addBtn.addEventListener('click', function() {
            addToItinerary(details.xid);
        });
        
        infoBtn.addEventListener('click', function() {
            showAttractionDetails(details);
        });
        
        // Add the card to the grid
        attractionsGrid.appendChild(card);
    }
    
    // Show attraction details in modal
    function showAttractionDetails(details) {
        // Open modal
        attractionModal.classList.remove('hidden');
        modalSpinner.classList.remove('hidden');
        
        // Set a timeout to simulate loading if we already have the details
        setTimeout(() => {
            modalSpinner.classList.add('hidden');
            
            // Handle potentially missing data with default values
            const name = details.name || 'Attraction Details';
            
            const kinds = details.kinds ? 
                details.kinds.split(',').map(kind => 
                    kind.charAt(0).toUpperCase() + kind.slice(1).replace('_', ' ')
                ).join(', ') : 
                'Tourist Attraction';
            
            let address = 'Address not available';
            if (details.address) {
                const addressParts = [];
                if (details.address.road) addressParts.push(details.address.road);
                if (details.address.city) addressParts.push(details.address.city);
                if (details.address.country) addressParts.push(details.address.country);
                
                if (addressParts.length > 0) {
                    address = addressParts.join(', ');
                }
            }
            
            let description = 'No detailed description available.';
            if (details.wikipedia_extracts && details.wikipedia_extracts.html) {
                description = details.wikipedia_extracts.html;
            } else if (details.wikipedia_extracts && details.wikipedia_extracts.text) {
                description = `<p>${details.wikipedia_extracts.text}</p>`;
            } else if (details.info && details.info.descr) {
                description = `<p>${details.info.descr}</p>`;
            }
            
            const imageUrl = (details.preview && details.preview.source) ? 
                details.preview.source : 
                'https://via.placeholder.com/600x400?text=No+Image+Available';
            
            let modalHTML = `
                <div class="attraction-modal-content">
                    <div class="attraction-modal-image">
                        <img src="${imageUrl}" alt="${name}" onerror="this.src='https://via.placeholder.com/600x400?text=No+Image+Available'">
                    </div>
                    <div class="attraction-modal-details">
                        <h2>${name}</h2>
                        <div class="attraction-modal-meta">
                            <span class="attraction-modal-type">${kinds}</span>
                            <span class="attraction-modal-address">${address}</span>
                        </div>
                        <div class="attraction-modal-description">
                            ${description}
                        </div>
                        <div class="attraction-modal-actions">
                            <button class="btn-add-to-plan" data-xid="${details.xid || ''}">Add to My Itinerary</button>
                            ${details.point ? `<a href="https://www.google.com/maps/search/?api=1&query=${details.point.lat},${details.point.lon}" target="_blank" class="btn-view-map">View on Map</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            modalContent.innerHTML = modalHTML;
            
            // Add event listener to the "Add to My Itinerary" button in the modal
            const addToPlanBtn = modalContent.querySelector('.btn-add-to-plan');
            if (addToPlanBtn) {
                addToPlanBtn.addEventListener('click', function() {
                    addToItinerary(this.dataset.xid || 'unknown');
                    attractionModal.classList.add('hidden');
                });
            }
        }, 500);
    }
    
    // Add attraction to itinerary
    function addToItinerary(xid) {
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
        
        if (!currentUser) {
            alert('Please log in to add attractions to your itinerary.');
            window.location.href = '../login.php';
            return;
        }
        
        // In a real app, this would send data to your server to add to the user's itinerary
        // For demo purposes, we'll just show an alert
        alert('Attraction added to your itinerary successfully!');
        
        // Optionally, redirect to the itinerary builder page
        // window.location.href = 'index.html#dashboard';
    }
    
    // User auth status check
    function checkAuthStatus() {
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
            // User is logged in, update the UI
            document.getElementById('loginBtn').classList.add('hidden');
            document.getElementById('signupBtn').classList.add('hidden');
            
            const userProfile = document.querySelector('.user-profile');
            if (userProfile) {
                userProfile.classList.remove('hidden');
                const userName = userProfile.querySelector('span');
                if (userName) {
                    userName.textContent = currentUser;
                }
            }
        }
    }
    
    // Check auth status when page loads
    checkAuthStatus();
});