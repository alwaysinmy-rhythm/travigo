// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn')

// const authModal = document.getElementById('authModal');
// const closeBtn = document.querySelector('.close');
// const loginForm = document.getElementById('loginForm');
// const signupForm = document.getElementById('signupForm');

const createItineraryBtn = document.getElementById('createItineraryBtn');
const itineraryBuilder = document.getElementById('itineraryBuilder');
const searchForm = document.getElementById('searchForm');
const searchResults = document.getElementById('searchResults');
const myItineraries = document.getElementById('myItineraries');
const saveItineraryBtn = document.getElementById('saveItineraryBtn');
const addDayBtn = document.getElementById('addDayBtn');
const addActivityBtn = document.getElementById('addActivityBtn');
const dayTabs = document.getElementById('dayTabs');
const dayActivities = document.getElementById('dayActivities');
const itineraryTitle = document.getElementById('itineraryTitle');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const resultsList = document.getElementById('resultsList');
const itineraryCards = document.getElementById('itineraryCards');

// Sample data for demo purposes
var currentUser = null;     //this var will contain the details about the logged in user.
var currentItinerary = null;
var searchResultsData =  [
    {
        id: 1,
        name: 'Grand Hotel',
        type: 'hotel',
        price: 120,
        rating: 4.5,
        image: 'https://placehold.co/300x200',
        location: 'Downtown'
    },
    {
        id: 2,
        name: 'Seaside Resort',
        type: 'hotel',
        price: 200,
        rating: 4.8,
        image: 'https://placehold.co/300x200',
        location: 'Beachfront'
    },
    {
        id: 3,
        name: 'Budget Hostel',
        type: 'hostel',
        price: 50,
        rating: 3.8,
        image: 'https://placehold.co/300x200',
        location: 'City Center'
    },
    {
        id: 4,
        name: 'Luxury Apartment',
        type: 'apartment',
        price: 180,
        rating: 4.6,
        image: 'https://placehold.co/300x200',
        location: 'Historic District'
    }
];

var userItineraries = [
    {
        id: 1,
        title: 'Summer in Paris',
        startDate: '2025-06-15',
        endDate: '2025-06-22',
        days: [
            {
                id: 1,
                activities: [
                    { id: 1, time: '09:00', title: 'Eiffel Tower', type: 'attraction' },
                    { id: 2, time: '13:00', title: 'Lunch at Cafe de Paris', type: 'food' },
                    { id: 3, time: '15:00', title: 'Louvre Museum', type: 'attraction' }
                ]
            },
            {
                id: 2,
                activities: [
                    { id: 4, time: '10:00', title: 'Notre Dame Cathedral', type: 'attraction' },
                    { id: 5, time: '13:30', title: 'Seine River Cruise', type: 'activity' }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Weekend in New York',
        startDate: '2025-04-10',
        endDate: '2025-04-12',
        days: [
            {
                id: 1,
                activities: [
                    { id: 1, time: '10:00', title: 'Central Park', type: 'attraction' },
                    { id: 2, time: '14:00', title: 'Metropolitan Museum', type: 'attraction' }
                ]
            },
            {
                id: 2,
                activities: [
                    { id: 3, time: '09:00', title: 'Statue of Liberty', type: 'attraction' },
                    { id: 4, time: '13:00', title: 'Lunch in Brooklyn', type: 'food' },
                    { id: 5, time: '16:00', title: 'Times Square', type: 'attraction' }
                ]
            }
        ]
    }
];

// When the page loads first this portion of code is executed.
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in via localStorage
    checkUserLoginStatus();
    
    logoutBtn.addEventListener('click', handleLogout); 
    // searchForm.addEventListener('submit', handleSearch);
    
    // Itinerary builder
    createItineraryBtn.addEventListener('click', openItineraryBuilder);
    saveItineraryBtn.addEventListener('click', saveItinerary);
    addDayBtn.addEventListener('click', addNewDay);
    addActivityBtn.addEventListener('click', addNewActivity);
    
    // Price range filter
    priceRange.addEventListener('input', updatePriceValue);
});

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
        
        // Show user itineraries
        // showUserItineraries();
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



/*
------------------------------------------------------------
Till here the code is about login,signup and authentication
to show username and avatar in navbar if user has logged in
other wise show login singup button  
------------------------------------------------------------
*/


// Itinerary Builder Functions
function openItineraryBuilder() {
    if( !currentUser){
        alert("You need to login/Signup First") ;
        window.location.href = 'login.html'
    }
    // Hide other sections
    searchResults.classList.add('hidden');
    myItineraries.classList.add('hidden');
    
    // Reset and show itinerary builder
    resetItineraryBuilder();
    itineraryBuilder.classList.remove('hidden');
    
    // Set default dates if not already set
    var today = new Date();
    var nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    startDate.value = today.toISOString().split('T')[0];
    endDate.value = nextWeek.toISOString().split('T')[0];
    
    // Initialize with one day
    addNewDay();
}

function resetItineraryBuilder() {
    itineraryTitle.value = 'My New Trip';
    dayTabs.innerHTML = '';
    dayActivities.querySelector('.timeline').innerHTML = '';
    currentItinerary = {
        id: Date.now(),
        title: 'My New Trip',
        days: []
    };
}

function addNewDay() {
    var dayCount = currentItinerary.days.length + 1;
    
    // Create new day in data model
    var newDay = {
        id: dayCount,
        activities: []
    };
    
    currentItinerary.days.push(newDay);
    
    // Create UI element for day tab
    var dayTab = document.createElement('button');
    dayTab.textContent = 'Day ' + dayCount;
    dayTab.dataset.dayId = dayCount;
    dayTab.addEventListener('click', function() {
        selectDay(dayCount);
    });
    
    // Make it active if it's the first day
    if (dayCount === 1) {
        dayTab.classList.add('active');
    }
    
    dayTabs.appendChild(dayTab);
    
    // Select the new day
    selectDay(dayCount);
}

function selectDay(dayId) {
    // Update active tab
    var tabs = dayTabs.querySelectorAll('button');
    for (var i = 0; i < tabs.length; i++) {
        if (parseInt(tabs[i].dataset.dayId) === dayId) {
            tabs[i].classList.add('active');
        } else {
            tabs[i].classList.remove('active');
        }
    }
    
    // Display activities for selected day
    var day = null;
    for (var i = 0; i < currentItinerary.days.length; i++) {
        if (currentItinerary.days[i].id === dayId) {
            day = currentItinerary.days[i];
            break;
        }
    }
    
    var timeline = dayActivities.querySelector('.timeline');
    timeline.innerHTML = '';
    
    if (day && day.activities.length > 0) {
        for (var i = 0; i < day.activities.length; i++) {
            var activityElement = createActivityElement(day.activities[i]);
            timeline.appendChild(activityElement);
        }
    } else {
        timeline.innerHTML = '<p class="empty-message">No activities planned yet. Click "+ Add Activity" to get started.</p>';
    }
}

function addNewActivity() {
    // Find which day is currently selected
    var activeTab = dayTabs.querySelector('button.active');
    if (!activeTab) return;
    
    var dayId = parseInt(activeTab.dataset.dayId);
    
    var day = null;
    for (var i = 0; i < currentItinerary.days.length; i++) {
        if (currentItinerary.days[i].id === dayId) {
            day = currentItinerary.days[i];
            break;
        }
    }
    
    // Create activity modal (simplified for demo)
    var time = prompt('Enter time (e.g., 09:00):', '09:00');
    var title = prompt('Enter activity name:', '');
    var type = prompt('Enter activity type (attraction, food, transport):', 'attraction');
    
    if (time && title) {
        var newActivity = {
            id: Date.now(),
            time: time,
            title: title,
            type: type || 'attraction'
        };
        
        // Add to data model
        day.activities.push(newActivity);
        
        // Sort activities by time (simple bubble sort)
        for (var i = 0; i < day.activities.length; i++) {
            for (var j = 0; j < day.activities.length - 1; j++) {
                if (day.activities[j].time > day.activities[j + 1].time) {
                    var temp = day.activities[j];
                    day.activities[j] = day.activities[j + 1];
                    day.activities[j + 1] = temp;
                }
            }
        }
        
        // Refresh the day view
        selectDay(dayId);
    }
}

function createActivityElement(activity) {
    var activityElement = document.createElement('div');
    activityElement.className = 'activity-item';
    
    // Create different styling based on activity type
    var typeIcon = '🏛️'; // Default for attraction
    if (activity.type === 'food') typeIcon = '🍽️';
    if (activity.type === 'transport') typeIcon = '🚕';
    if (activity.type === 'hotel') typeIcon = '🏨';
    
    activityElement.innerHTML = `
        <div class="activity-time">${activity.time}</div>
        <div class="activity-content">
            <div class="activity-icon">${typeIcon}</div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <div class="activity-actions">
                    <button class="edit-btn" data-id="${activity.id}">Edit</button>
                    <button class="delete-btn" data-id="${activity.id}">Delete</button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for edit and delete
    var editBtn = activityElement.querySelector('.edit-btn');
    var deleteBtn = activityElement.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', function() {
        editActivity(activity.id);
    });
    
    deleteBtn.addEventListener('click', function() {
        deleteActivity(activity.id);
    });
    
    return activityElement;
}

function editActivity(activityId) {
    // Find which day is currently selected
    var activeTab = dayTabs.querySelector('button.active');
    if (!activeTab) return;
    
    var dayId = parseInt(activeTab.dataset.dayId);
    
    var day = null;
    for (var i = 0; i < currentItinerary.days.length; i++) {
        if (currentItinerary.days[i].id === dayId) {
            day = currentItinerary.days[i];
            break;
        }
    }
    
    var activityIndex = -1;
    for (var i = 0; i < day.activities.length; i++) {
        if (day.activities[i].id === activityId) {
            activityIndex = i;
            break;
        }
    }
    
    if (activityIndex !== -1) {
        var activity = day.activities[activityIndex];
        
        // Simple prompt-based editing for demo
        var time = prompt('Edit time:', activity.time);
        var title = prompt('Edit activity name:', activity.title);
        var type = prompt('Edit activity type (attraction, food, transport):', activity.type);
        
        if (time && title) {
            // Update the activity
            day.activities[activityIndex].time = time;
            day.activities[activityIndex].title = title;
            day.activities[activityIndex].type = type || activity.type;
            
            // Sort activities by time (simple bubble sort)
            for (var i = 0; i < day.activities.length; i++) {
                for (var j = 0; j < day.activities.length - 1; j++) {
                    if (day.activities[j].time > day.activities[j + 1].time) {
                        var temp = day.activities[j];
                        day.activities[j] = day.activities[j + 1];
                        day.activities[j + 1] = temp;
                    }
                }
            }
            
            // Refresh the day view
            selectDay(dayId);
        }
    }
}

function deleteActivity(activityId) {
    // Find which day is currently selected
    var activeTab = dayTabs.querySelector('button.active');
    if (!activeTab) return;
    
    var dayId = parseInt(activeTab.dataset.dayId);
    
    var day = null;
    for (var i = 0; i < currentItinerary.days.length; i++) {
        if (currentItinerary.days[i].id === dayId) {
            day = currentItinerary.days[i];
            break;
        }
    }
    
    // Remove the activity
    var newActivities = [];
    for (var i = 0; i < day.activities.length; i++) {
        if (day.activities[i].id !== activityId) {
            newActivities.push(day.activities[i]);
        }
    }
    day.activities = newActivities;
    
    // Refresh the day view
    selectDay(dayId);
}

function saveItinerary() {
    // Update itinerary details
    if (itineraryTitle.value) {
        currentItinerary.title = itineraryTitle.value;
    } else {
        currentItinerary.title = 'My Trip';
    }
    
    currentItinerary.startDate = startDate.value;
    currentItinerary.endDate = endDate.value;
    
    // Check if this is an edit or a new itinerary
    var existingIndex = -1;
    for (var i = 0; i < userItineraries.length; i++) {
        if (userItineraries[i].id === currentItinerary.id) {
            existingIndex = i;
            break;
        }
    }
    
    if (existingIndex !== -1) {
        userItineraries[existingIndex] = currentItinerary;
    } else {
        userItineraries.push(currentItinerary);
    }
    
    alert('Itinerary saved successfully!');
    showUserItineraries();
}

// Search Functions
function handleSearch(e) {
    e.preventDefault();
    
    var destination = document.getElementById('destination').value;
    var dates = document.getElementById('dates').value;
    var travelers = document.getElementById('travelers').value;
    
    //  this would search via API
    // For demo, just show sample results
    
    // Hide other sections
    itineraryBuilder.classList.add('hidden');
    myItineraries.classList.add('hidden');
    
    // Show search results
    searchResults.classList.remove('hidden');
    
    // Render results
    renderSearchResults();
}

function renderSearchResults() {
    resultsList.innerHTML = '';
    
    for (var i = 0; i < searchResultsData.length; i++) {
        var result = searchResultsData[i];
        var resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        
        resultCard.innerHTML = `
            <img src="${result.image}" alt="${result.name}">
            <div class="result-details">
                <h3>${result.name}</h3>
                <div class="result-meta">
                    <span class="result-type">${result.type}</span>
                    <span class="result-rating">★ ${result.rating}</span>
                    <span class="result-location">${result.location}</span>
                </div>
                <div class="result-price">$${result.price} / night</div>
                <button class="book-btn" data-id="${result.id}">Book Now</button>
                <button class="add-to-itinerary-btn" data-id="${result.id}">Add to Itinerary</button>
            </div>
        `;
        
        // Add event listeners
        var bookBtn = resultCard.querySelector('.book-btn');
        var addBtn = resultCard.querySelector('.add-to-itinerary-btn');
        
        // Using a closure to capture the correct id
        (function(id) {
            bookBtn.addEventListener('click', function() {
                bookAccommodation(id);
            });
            
            addBtn.addEventListener('click', function() {
                addToItinerary(id);
            });
        })(result.id);
        
        resultsList.appendChild(resultCard);
    }
}

function updatePriceValue() {
    priceValue.textContent = '$' + priceRange.value;
    
    // this would filter results
    // For demo, we're just updating the displayed value
}

function bookAccommodation(accommodationId) {
    // In a real app, this would handle the booking process
    alert('Booking accommodation');
}

function addToItinerary(accommodationId) {
    alert('Added Successfully');
}

// User Itineraries Functions
function showUserItineraries() {
    // Hide other sections
    itineraryBuilder.classList.add('hidden');
    searchResults.classList.add('hidden');
    
    // Show itineraries section
    myItineraries.classList.remove('hidden');
    
    // Render itineraries
    renderUserItineraries();
}

function renderUserItineraries() {
    itineraryCards.innerHTML = '';
    
    if (userItineraries.length === 0) {
        itineraryCards.innerHTML = '<p>You don\'t have any itineraries yet. Click "Create New Itinerary" to get started.</p>';
        return;
    }
    
    for (var i = 0; i < userItineraries.length; i++) {
        var itinerary = userItineraries[i];
        var card = document.createElement('div');
        card.className = 'itinerary-card';
        
        // Calculate duration
        var start = new Date(itinerary.startDate);
        var end = new Date(itinerary.endDate);
        var duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        // Count total activities
        var totalActivities = 0;
        for (var j = 0; j < itinerary.days.length; j++) {
            totalActivities += itinerary.days[j].activities.length;
        }
        
        card.innerHTML = `
            <h3>${itinerary.title}</h3>
            <div class="itinerary-dates">
                ${formatDate(itinerary.startDate)} - ${formatDate(itinerary.endDate)}
            </div>
            <div class="itinerary-summary">
                <span>${duration} days</span>
                <span>${itinerary.days.length} day plans</span>
                <span>${totalActivities} activities</span>
            </div>
            <div class="itinerary-actions">
                <button class="edit-itinerary-btn" data-id="${itinerary.id}">Edit</button>
                <button class="view-itinerary-btn" data-id="${itinerary.id}">View</button>
                <button class="delete-itinerary-btn" data-id="${itinerary.id}">Delete</button>
            </div>
        `;
        
        // Add event listeners
        var editBtn = card.querySelector('.edit-itinerary-btn');
        var viewBtn = card.querySelector('.view-itinerary-btn');
        var deleteBtn = card.querySelector('.delete-itinerary-btn');
        
        // Using a closure to capture the correct id
        (function(id) {
            editBtn.addEventListener('click', function() {
                editItinerary(id);
            });
            
            viewBtn.addEventListener('click', function() {
                viewItinerary(id);
            });
            
            deleteBtn.addEventListener('click', function() {
                deleteItinerary(id);
            });
        })(itinerary.id);
        
        itineraryCards.appendChild(card);
    }
}

function formatDate(dateString) {
    var date = new Date(dateString);
    
    var month = date.toLocaleString('default', { month: 'short' });
    var day = date.getDate();
    var year = date.getFullYear();
    
    return month + ' ' + day + ', ' + year;
}

function editItinerary(itineraryId) {
    var itinerary = null;
    for (var i = 0; i < userItineraries.length; i++) {
        if (userItineraries[i].id === itineraryId) {
            itinerary = userItineraries[i];
            break;
        }
    }
    
    if (!itinerary) return;
    
    // Set current itinerary - create a deep copy
    currentItinerary = {
        id: itinerary.id,
        title: itinerary.title,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        days: []
    };
    
    // Copy days and activities
    for (var i = 0; i < itinerary.days.length; i++) {
        var day = {
            id: itinerary.days[i].id,
            activities: []
        };
        
        for (var j = 0; j < itinerary.days[i].activities.length; j++) {
            var act = itinerary.days[i].activities[j];
            day.activities.push({
                id: act.id,
                time: act.time,
                title: act.title,
                type: act.type
            });
        }
        
        currentItinerary.days.push(day);
    }
    
    // Show itinerary builder
    itineraryBuilder.classList.remove('hidden');
    myItineraries.classList.add('hidden');
    
    // Populate fields
    itineraryTitle.value = itinerary.title;
    startDate.value = itinerary.startDate;
    endDate.value = itinerary.endDate;
    
    // Populate days tabs
    dayTabs.innerHTML = '';
    for (var i = 0; i < itinerary.days.length; i++) {
        var day = itinerary.days[i];
        var dayTab = document.createElement('button');
        dayTab.textContent = 'Day ' + day.id;
        dayTab.dataset.dayId = day.id;
        
        // Using a closure to capture the correct id
        (function(id) {
            dayTab.addEventListener('click', function() {
                selectDay(id);
            });
        })(day.id);
        
        dayTabs.appendChild(dayTab);
    }
    
    // Select first day
    if (itinerary.days.length > 0) {
        selectDay(itinerary.days[0].id);
    }
}

function viewItinerary(itineraryId) {
    var itinerary = null;
    for (var i = 0; i < userItineraries.length; i++) {
        if (userItineraries[i].id === itineraryId) {
            itinerary = userItineraries[i];
            break;
        }
    }
    
    if (!itinerary) return;
    
    // In a real app, this would open a detailed view
    alert('Viewing itinerary: ' + itinerary.title + '. This would show a detailed view in a real app.');
}

function deleteItinerary(itineraryId) {
    if (confirm('Are you sure you want to delete this itinerary?')) {
        var newItineraries = [];
        for (var i = 0; i < userItineraries.length; i++) {
            if (userItineraries[i].id !== itineraryId) {
                newItineraries.push(userItineraries[i]);
            }
        }
        userItineraries = newItineraries;
        renderUserItineraries();
    }
}