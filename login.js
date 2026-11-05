const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Collect login information
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        // Connect to the backend
        const response = await fetch("http://localhost:3000/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });

        const result = await response.json();

        if (response.ok) {

            alert("Welcome back, " + result.user.fullname + "!");

            loginForm.reset();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error("Login error:", error);

        alert("Cannot connect to the server. Please check your backend.");

    }

});