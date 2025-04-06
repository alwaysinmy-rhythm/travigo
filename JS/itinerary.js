const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const tempdiv= document.getElementById('temp');
const newtripBtn = document.getElementById('newtripBtn');
const openBtn = document.getElementById("openModalBtn");


var currentUser = null;     //this var will contain the details about the logged in user.
var Trips = null;


document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in via localStorage
    logoutBtn.addEventListener('click', handleLogout); 
    newtripBtn.addEventListener('click', handlenewTrip); 
    // First check login status, then get trips only if user is logged in
    checkUserLoginStatus();
    

    // Set up modal close button
  const closeModalBtn = document.querySelector(".close-modal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }
  
  // Set up form submission
  const newTripForm = document.getElementById("newTripForm");
  if (newTripForm) {
    newTripForm.addEventListener("submit", handleCreateTrip);
  }
  
  // Close modal if user clicks outside of it
  window.addEventListener("click", function(event) {
    const modal = document.getElementById("newTripModal");
    if (event.target === modal) {
      closeModal();
    }
  });
  
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
                    name: parsedUserData.username || storedUsername,
                    email: parsedUserData.email || '',
                    avatar: './images/maleProfile.png'
                };
            } catch (e) {
                console.error('Error parsing user data from localStorage', e);
            }
        }
        
        // Set current user
        currentUser = userData;
        
        // Update UI to show username if user is logged in
        updateUserInterface();
        
        // Now that we have confirmed the user is logged in, we can fetch their trips
        console.log("Fetching trips for user:", currentUser.name);
        getUserTrips(currentUser.name);
    } else {
        // No user logged in
        console.log("No user logged in, skipping trip fetch");
        
        // Clear the trips container if it exists
        const tripsContainer = document.getElementById('trips-container');
        if (tripsContainer) {
            tripsContainer.innerHTML = '<h2 style="margin: auto; width: fit-content;">Please log in to see your trips.</h2>';
        }
        
        // Update UI for logged out state
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
    
    // Clear the trips container if it exists
    const tripsContainer = document.getElementById('trips-container');
    if (tripsContainer) {
        tripsContainer.innerHTML = '<p>Please log in to see your trips.</p>';
    }
    
    // Redirect to home
    window.location.href = '';
}


function getUserTrips(username) {
    // Create the URL with parameters
    const url = `./backend/userTrips.php?username=${encodeURIComponent(username)}`;
    
    // Show loading state
    const tripsContainer = document.getElementById('trips-container');
    if (tripsContainer) {
      tripsContainer.innerHTML = '<p class="loading-message">Loading your trips...</p>';
    }
    
    // Fetch the data from the server
    fetch(url)
      .then(response => {
        // Check if the response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(trips => {
        // Store the trips in a variable
        const userTrips = trips;
        Trips = trips;
        
        // Display the trips in HTML
        displayTrips(userTrips);
      })
      .catch(error => {
        console.error('Error fetching trips:', error);
        if (tripsContainer) {
          tripsContainer.innerHTML = `<p class="error-message">Error loading trips: ${error.message}</p>`;
        }
      });
  }
  
  // Function to display trips as styled links
  function displayTrips(trips) {
    const tripsContainer = document.getElementById('trips-container');
    
    if (!tripsContainer) {
      console.error('Trips container element not found!');
      return;
    }
    
    // Clear previous content
    tripsContainer.innerHTML = '';
    
    // Create a header for the trips section
    const header = document.createElement('h2');
    header.className = 'trips-header';
    header.textContent = 'Your Itineraries';
    tripsContainer.appendChild(header);
    
    // Check if there are any trips
    if (!trips || trips.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-trips-message';
      emptyMessage.textContent = 'You have no saved itineraries yet. Create your first trip!';
      tripsContainer.appendChild(emptyMessage);
      return;
    }
    
    // Create a container for the trips
    const tripsList = document.createElement('div');
    tripsList.className = 'trips-list';
    
    // Add each trip to the list
    trips.forEach(trip => {
      // Create trip item container
      const tripItem = document.createElement('a');
      tripItem.className = 'trip-item';
      tripItem.href = `./tripplanning.html?tripname=${encodeURIComponent(typeof trip === 'string' ? trip : trip.tripname || '')}`;
      
      // Create trip content
      const tripContent = document.createElement('div');
      tripContent.className = 'trip-content';
      
      // Add trip icon
      const tripIcon = document.createElement('div');
      tripIcon.className = 'trip-icon';
      tripIcon.innerHTML = '<i class="fas fa-map-marked-alt"></i>';
      
      // Add trip details
      const tripDetails = document.createElement('div');
      tripDetails.className = 'trip-details';
      
      // Add trip name
      const tripName = document.createElement('span');
      tripName.className = 'trip-name';
      tripName.textContent = typeof trip === 'string' ? trip : trip.tripname || 'Unnamed Trip';
      
      // Add arrow icon
      const tripArrow = document.createElement('div');
      tripArrow.className = 'trip-arrow';
      tripArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
      
      // Assemble the trip item
      tripDetails.appendChild(tripName);
      tripContent.appendChild(tripIcon);
      tripContent.appendChild(tripDetails);
      tripItem.appendChild(tripContent);
      tripItem.appendChild(tripArrow);
      tripsList.appendChild(tripItem);
    });
    
    // Add the list to the container
    tripsContainer.appendChild(tripsList);

  }

function handlenewTrip() {
  // Get the modal
  const modal = document.getElementById("newTripModal");
  
  // Show the modal
  modal.style.display = "block";
  
  // Focus on the input field
  document.getElementById("tripName").focus();
}

// Add these functions for modal functionality
function closeModal() {
  const modal = document.getElementById("newTripModal");
  modal.style.display = "none";
  // Reset form
  document.getElementById("newTripForm").reset();
}

function handleCreateTrip(e) {
  e.preventDefault();
  
  // Get the trip name value
  const tripNameInput = document.getElementById("tripName");
  const tripName = tripNameInput.value.trim();
  
  // Validate
  if (!tripName) {
    alert("Please enter a trip name");
    tripNameInput.focus();
    return;
  }
  // Check if trip name already exists in the Trip array
  if (Trips && Array.isArray(Trips)) {
    // Check if the trip name already exists (case insensitive)
    const tripExists = Trips.some(existingTrip => {
      // Handle both string and object formats
      const existingTripName = typeof existingTrip === 'string' 
        ? existingTrip 
        : (existingTrip.tripname || existingTrip.name || '');
        
      return existingTripName.toLowerCase() === tripName.toLowerCase();
    });
    
    if (tripExists) {
      alert("This trip name already exists. Please choose a different name.");
      tripNameInput.focus();
      return;
    }
  }
  // Close the modal
  closeModal();
  
  // Redirect to the create trip page with the trip name as a parameter
  window.location.href = `./tripplanning.html?tripname=${encodeURIComponent(tripName)}`;
}