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


