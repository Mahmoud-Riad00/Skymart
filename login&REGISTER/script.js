const wrapper = document.querySelector(".wrapper"),
      signupHeader = document.querySelector(".signup header"),
      loginHeader = document.querySelector(".login header");

loginHeader.addEventListener("click", () => {
    wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
    wrapper.classList.remove("active");
});


document.querySelector('.signUp-btn').addEventListener('click', (event) => {
    event.preventDefault(); 

    let fullName = document.querySelector('.fullName').value.trim();
    let email = document.querySelector('.Email').value.trim().toLowerCase(); // Store email as lowercase
    let password = document.querySelector('.password').value.trim();
    let checkbox = document.getElementById('signupCheck');
    let userData = JSON.parse(localStorage.getItem('userData')) || [];


    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName || !email || !password) {
        alert('Please complete all details');
    } else if (!emailPattern.test(email)) {
        alert('Please enter a valid email address');
    } else if (userData.some(user => user.userEmail === email)) {
        alert('Email already exists, try another');
    } else if (!checkbox.checked) {
        alert('Please agree to the terms and conditions');
    } else {
        userData.push({
            userName: fullName,
            userEmail: email,
            userPassword: password
        });
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('User registered:', userData); 
        wrapper.classList.add("active"); 
    }
});


document.querySelector('.login-btn').addEventListener('click', (event) => {
    event.preventDefault(); 

    let email = document.querySelector('.Email').value.trim().toLowerCase();  login
    let password = document.querySelector('.password').value.trim();
    let userData = JSON.parse(localStorage.getItem('userData')) || [];

    console.log("Login Attempt with email:", email); 
    console.log("Stored Users:", userData);

    let user = userData.find(user => user.userEmail.toLowerCase() === email); // Match email in lowercase

    if (!user) {
        alert('Email not registered yet');
    } else if (user.userPassword !== password) {
        alert('Incorrect password');
    } else {
        window.location.assign(`https://mahmoud-riad00.github.io/Skymart/products/products.html?username=${encodeURIComponent(user.userName)}`);
        console.log('done');
    }
});
