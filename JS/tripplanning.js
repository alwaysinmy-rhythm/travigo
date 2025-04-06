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

// -------------------------------------------------------------------------------------------------------------------

// DOM Elements
const tripNameElement = document.getElementById('tripName');
const editTripNameBtn = document.getElementById('editTripNameBtn');
const saveTrip = document.getElementById('saveTrip');
const daysList = document.getElementById('daysList');
const addDayBtn = document.getElementById('addDayBtn');
const activityModal = document.getElementById('activityModal');
const modalTitle = document.getElementById('modalTitle');
const activityForm = document.getElementById('activityForm');
const editDayIndex = document.getElementById('editDayIndex');
const editActivityIndex = document.getElementById('editActivityIndex');
const activityName = document.getElementById('activityName');
const activityTime = document.getElementById('activityTime');
const placeName = document.getElementById('placeName');
const placeType = document.getElementById('placeType');
const closeModalBtn = document.querySelector('.close-modal');
const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Trip data state
var tripName = '';
var days = [];
var currentDeleteDay = null;
var currentDeleteActivity = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Get trip name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tripNameParam = urlParams.get('tripname');
    
    if (tripNameParam) {
        tripName = decodeURIComponent(tripNameParam);
        tripNameElement.textContent = tripName;
    }
    
    saveTrip.addEventListener('click', saveTripData);
    addDayBtn.addEventListener('click', addNewDay);
    
    closeModalBtn.addEventListener('click', function() {
        activityModal.style.display = 'none';
    });
    
    activityForm.addEventListener('submit', saveActivityData);
    
    window.addEventListener('click', function(e) {
        if (e.target === activityModal) {
            activityModal.style.display = 'none';
        }
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
    
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', function() {
        confirmModal.style.display = 'none';
    });
    
    // Load trip data from backend
    loadTripData();
});

// Load trip data from backend
function loadTripData() {
    const urlParams = new URLSearchParams(window.location.search);
    const tripNameParam = urlParams.get('tripname');
    
    if (!tripNameParam) {
        // If no trip name, just add initial day
        if (days.length === 0) {
            addNewDay();
        }
        renderTrip();
        return;
    }
    
    // Create request data
    const requestData = {
        username: currentUser ? currentUser.name : '',
        tripName: decodeURIComponent(tripNameParam)
    };
    console.log(requestData)
    // Send request to backend
    fetch('./backend/getTripdetails.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            // throw new Error('Network response was not ok');
            return response.json(); 
        }
        return response.json();
    })
    .then(data => {
        console.log('Trip data from server:', data);
        if (data && Array.isArray(data) && data.length > 0) {
            // Process the trip data
            processTripData(data);
        } else {
            // If no data or empty array, add initial day
            if (days.length === 0) {
                addNewDay();
            }
        }
        
        // Render the trip
        renderTrip();
    })
    .catch(error => {
        console.error('Error loading trip data:', error);
        console.log(error);
        // On error, just add initial day
        if (days.length === 0) {
            addNewDay();
        }
        renderTrip();
    });
}

// Process trip data from backend
function processTripData(tripDataArray) {
    // Clear existing days
    days = [];
    
    // Group activities by day
    const activitiesByDay = {};
    
    tripDataArray.forEach(item => {
        if (!activitiesByDay[item.day]) {
            activitiesByDay[item.day] = [];
        }
        
        activitiesByDay[item.day].push({
            name: item.name || 'Activity',
            time: item.time || '',
            placeName: item.place_name || '',
            placeType: item.place_type || 'other'
        });
    });
    
    // Create days array from grouped activities
    Object.keys(activitiesByDay).forEach(dayTitle => {
        days.push({
            title: dayTitle,
            activities: activitiesByDay[dayTitle]
        });
    });
    
    // If no days were created, add an initial day
    if (days.length === 0) {
        addNewDay();
    }
}

// Add a new day to the trip
function addNewDay() {
    const dayNumber = days.length + 1;
    days.push({
        title: `Day ${dayNumber}`,
        activities: []
    });
    
    renderTrip();
}

// Open modal to add a new activity
function openAddActivityModal(dayIndex) {
    modalTitle.textContent = 'Add Activity';
    editDayIndex.value = dayIndex;
    editActivityIndex.value = '-1';
    
    // Clear form
    activityForm.reset();
    
    // Set default time
    const now = new Date();
    activityTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Show modal
    activityModal.style.display = 'block';
}

// Open modal to edit an existing activity
function openEditActivityModal(dayIndex, activityIndex) {
    const activity = days[dayIndex].activities[activityIndex];
    
    modalTitle.textContent = 'Edit Activity';
    editDayIndex.value = dayIndex;
    editActivityIndex.value = activityIndex;
    
    // Fill form with activity data
    activityName.value = activity.name;
    activityTime.value = activity.time;
    placeName.value = activity.placeName;
    placeType.value = activity.placeType;
    
    // Show modal
    activityModal.style.display = 'block';
}

// Save activity data from the form
function saveActivityData(e) {
    e.preventDefault();
    
    const dayIndex = parseInt(editDayIndex.value);
    const activityIndex = parseInt(editActivityIndex.value);
    
    const activity = {
        name: activityName.value,
        time: activityTime.value,
        placeName: placeName.value,
        placeType: placeType.value
    };
    
    if (activityIndex === -1) {
        // Add new activity
        days[dayIndex].activities.push(activity);
    } else {
        // Update existing activity
        days[dayIndex].activities[activityIndex] = activity;
    }
    
    // Close modal and update UI
    activityModal.style.display = 'none';
    renderTrip();
}

// Update day title when edited
function updateDayTitle(dayIndex, event) {
    const newTitle = event.target.textContent.trim();
    if (newTitle) {
        days[dayIndex].title = newTitle;
    } else {
        event.target.textContent = days[dayIndex].title;
    }
}

// Delete a day (with confirmation)
function deleteDay(dayIndex) {
    currentDeleteDay = dayIndex;
    currentDeleteActivity = null;
    confirmModal.style.display = 'block';
}

// Delete an activity (with confirmation)
function deleteActivity(dayIndex, activityIndex) {
    currentDeleteDay = dayIndex;
    currentDeleteActivity = activityIndex;
    confirmModal.style.display = 'block';
}

// Confirm deletion of day or activity
function confirmDelete() {
    if (currentDeleteActivity === null) {
        // Delete day
        days.splice(currentDeleteDay, 1);
    } else {
        // Delete activity
        days[currentDeleteDay].activities.splice(currentDeleteActivity, 1);
    }
    
    confirmModal.style.display = 'none';
    renderTrip();
}

// Format time for display (24h to 12h)
function formatTime(time) {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
}

// Get readable place type
function getPlaceType(type) {
    const types = {
        'museum': 'Museum',
        'restaurant': 'Restaurant', 
        'park': 'Park',
        'landmark': 'Landmark',
        'hotel': 'Hotel',
        'shopping': 'Shopping',
        'beach': 'Beach',
        'other': 'Other'
    };
    return types[type] || 'Place';
}

// Render the entire trip UI
function renderTrip() {
    daysList.innerHTML = '';
    
    days.forEach((day, dayIndex) => {
        // Create day card
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        // Create day header
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        
        // Create day title
        const dayTitle = document.createElement('h2');
        dayTitle.className = 'day-title';
        dayTitle.contentEditable = true;
        dayTitle.textContent = day.title;
        dayTitle.addEventListener('blur', (e) => updateDayTitle(dayIndex, e));
        dayTitle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                dayTitle.blur();
            }
        });
        
        // Create day actions
        const dayActions = document.createElement('div');
        dayActions.className = 'day-actions';
        
        const deleteDayBtn = document.createElement('button');
        deleteDayBtn.className = 'delete-day-btn';
        deleteDayBtn.innerHTML = '<i class="fas fa-trash">Delete</i>';
        deleteDayBtn.addEventListener('click', () => deleteDay(dayIndex));
        
        dayActions.appendChild(deleteDayBtn);
        dayHeader.appendChild(dayTitle);
        dayHeader.appendChild(dayActions);
        dayCard.appendChild(dayHeader);
        
        // Create activities list
        const activitiesList = document.createElement('div');
        activitiesList.className = 'activities-list';
        
        if (day.activities.length === 0) {
            // Empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-activities';
            emptyState.textContent = 'No activities planned for this day yet.';
            activitiesList.appendChild(emptyState);
        } else {
            // Sort activities by time
            const sortedActivities = [...day.activities].sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
            });
            
            // Render each activity
            sortedActivities.forEach((activity, idx) => {
                const activityIndex = day.activities.indexOf(activity);
                
                // Create activity item
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                
                // Create activity info
                const activityInfo = document.createElement('div');
                activityInfo.className = 'activity-info';
                
                // Create activity header (name + time)
                const activityHeader = document.createElement('div');
                activityHeader.className = 'activity-header';
                
                const activityNameEl = document.createElement('div');
                activityNameEl.className = 'activity-name';
                activityNameEl.textContent = activity.name;
                
                const activityTimeEl = document.createElement('div');
                activityTimeEl.className = 'activity-time';
                activityTimeEl.textContent = formatTime(activity.time);
                
                activityHeader.appendChild(activityNameEl);
                activityHeader.appendChild(activityTimeEl);
                
                // Create place info
                const activityPlace = document.createElement('div');
                activityPlace.className = 'activity-place';
                activityPlace.textContent = activity.placeName;
                
                const activityType = document.createElement('div');
                activityType.className = 'activity-type';
                activityType.textContent = getPlaceType(activity.placeType);
                
                // Add all info to activity info container
                activityInfo.appendChild(activityHeader);
                activityInfo.appendChild(activityPlace);
                activityInfo.appendChild(activityType);
                
                // Create activity actions
                const activityActions = document.createElement('div');
                activityActions.className = 'activity-actions';
                
                const editActivityBtn = document.createElement('button');
                editActivityBtn.className = 'edit-activity-btn';
                editActivityBtn.innerHTML = '<i class="fas fa-edit">Edit</i>';
                editActivityBtn.addEventListener('click', () => openEditActivityModal(dayIndex, activityIndex));
                
                const deleteActivityBtn = document.createElement('button');
                deleteActivityBtn.className = 'delete-activity-btn';
                deleteActivityBtn.innerHTML = '<i class="fas fa-trash">Delete</i>';
                deleteActivityBtn.addEventListener('click', () => deleteActivity(dayIndex, activityIndex));
                
                activityActions.appendChild(editActivityBtn);
                activityActions.appendChild(deleteActivityBtn);
                
                // Add all components to activity item
                activityItem.appendChild(activityInfo);
                activityItem.appendChild(activityActions);
                activitiesList.appendChild(activityItem);
            });
        }
        
        // Add "Add Activity" button
        const addActivityBtn = document.createElement('button');
        addActivityBtn.className = 'add-activity-btn';
        addActivityBtn.innerHTML = '<i class="fas fa-plus"></i> Add Activity';
        addActivityBtn.addEventListener('click', () => openAddActivityModal(dayIndex));
        
        // Add all elements to day card
        dayCard.appendChild(activitiesList);
        dayCard.appendChild(addActivityBtn);
        daysList.appendChild(dayCard);
    });
}

// Save trip data to backend
function saveTripData() {
    // Create trip data object
    const tripData = {
        usernamae : currentUser.name, 
        tripName: tripName,
        days: days
    };
    console.log(tripData);
    // Send to backend
    fetch('./backend/tripplanning.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tripData)
    })
    .then(response => {
        console.log();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Trip saved successfully!';
        document.body.appendChild(successMessage);
        
        // Show message
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
        
        // Remove message after a few seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 500);
        }, 3000);
    })
    .catch(error => {
        console.log(error);
        alert('Error saving trip: ' + error.message);
    });
}