document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector(".wrapper");
    const signupHeader = document.querySelector(".signup header");
    const loginHeader = document.querySelector(".login header");
    const signupForm = document.querySelector(".signup form");
    const loginForm = document.querySelector(".login form");

    // Toggle between login and signup forms
    loginHeader.addEventListener("click", () => {
        wrapper.classList.add("active");
    });
    signupHeader.addEventListener("click", () => {
        wrapper.classList.remove("active");
    });

    // Helper functions
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isStrongPassword = (password) => {
        return password.length >= 8;
    };

    const showError = (message) => {
        alert(message); // In a real app, use a more user-friendly error display method
    };

    const saveUserData = (userData) => {
        let existingUsers = JSON.parse(localStorage.getItem('userData')) || [];
        existingUsers.push(userData);
        localStorage.setItem('userData', JSON.stringify(existingUsers));
    };

    // Signup form submission
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = signupForm.querySelector('.fullName').value.trim();
        const email = signupForm.querySelector('.Email').value.trim().toLowerCase();
        const password = signupForm.querySelector('.password').value.trim();
        const checkbox = signupForm.querySelector('#signupCheck');

        if (!fullName || !email || !password) {
            return showError('Please complete all details');
        }

        if (!isValidEmail(email)) {
            return showError('Please enter a valid email address');
        }

        if (!isStrongPassword(password)) {
            return showError('Password should be at least 8 characters long');
        }

        if (!checkbox.checked) {
            return showError('Please agree to the terms and conditions');
        }

        const existingUsers = JSON.parse(localStorage.getItem('userData')) || [];
        if (existingUsers.some(user => user.userEmail === email)) {
            return showError('Email already exists, try another');
        }

        const newUser = {
            userName: fullName,
            userEmail: email,
            userPassword: password // In a real app, never store passwords in plain text
        };

        saveUserData(newUser);
        console.log('User registered:', newUser);
        wrapper.classList.add("active"); 
        signupForm.reset();
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = loginForm.querySelector('.loginEmail').value.trim().toLowerCase();
        const password = loginForm.querySelector('.loginPassword').value.trim();

        if (!email || !password) {
            return showError('Please enter both email and password');
        }

        const userData = JSON.parse(localStorage.getItem('userData')) || [];
        const user = userData.find(user => user.userEmail.toLowerCase() === email);

        if (!user) {
            return showError('Email not registered yet');
        }

        if (user.userPassword !== password) {
            return showError('Incorrect password');
        }


        console.log('Login successful:', user.userName);

        window.location.assign(`https://mahmoud-riad00.github.io/Skymart/products/products.html?username=${encodeURIComponent(user.userName)}`);
    });
});