// Import the nav.js file
document.write('<script src="../homePage/nav.js"></script>');

// Add any profile page specific JavaScript here
document.addEventListener('DOMContentLoaded', function() {
    const profileInfo = document.getElementById('profile-info');
    const deleteAccountBtn = document.getElementById('delete-account');
    
    // Get user data from sessionStorage
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        // Display user information
        profileInfo.innerHTML = `
            <p><strong>Full Name:</strong> ${loggedInUser.fullName}</p>
            <p><strong>Email:</strong> ${loggedInUser.userEmail}</p>
        `;
        
        // Add event listener for delete account button
        deleteAccountBtn.addEventListener('click', deleteAccount);
    } else {
        // If no user is logged in, redirect to login page
        window.location.href = 'https://mahmoud-riad00.github.io/Skymart/login&REGISTER/Login.html';
    }
});

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        if (loggedInUser) {
            // Remove user data from localStorage
            localStorage.removeItem(`user_${loggedInUser.userEmail}`);
            
            // Clear session storage
            sessionStorage.removeItem('loggedInUser');
            
            // Redirect to home page
            alert('Your account has been deleted successfully.');
            window.location.href = 'https://mahmoud-riad00.github.io/Skymart/homePage/index.html';
        }
    }
}
