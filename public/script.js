// Toggle between Login and Signup forms
document.getElementById('showSignup').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
});

// Handle Signup Form
document.getElementById('signupFormElement').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('signupPassword').value;

    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Signup successful!');
            document.getElementById('showLogin').click(); // Switch to login
        } else {
            alert(data.message);
        }
    });
});

// Handle Login Form
document.getElementById('loginFormElement').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            alert(data.message);
        }
    });
});
