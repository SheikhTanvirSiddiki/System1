function toggleForms() {
    let loginForm = document.getElementById("loginForm");
    let signupForm = document.getElementById("signupForm");
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
    }
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    if (result.success) {
        window.location.href = '/dashboard';
    } else {
        alert(result.message);
    }
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("signupEmail").value;
    let phoneNo = document.getElementById("phoneNo").value;
    let password = document.getElementById("signupPassword").value;

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phoneNo, password })
    });

    const result = await response.json();
    if (result.success) {
        alert("Signup successful! Please login.");
        toggleForms();
    } else {
        alert(result.message);
    }
});
