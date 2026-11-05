const form = document.getElementById("registerForm");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Collect information from the form
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {

        // Send information to the backend
        const response = await fetch("http://localhost:3000/api/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullname: fullname,
                email: email,
                username: username,
                password: password,
                confirmPassword: confirmPassword
            })

        });

        const result = await response.json();

        if (response.ok) {

            alert(result.message);

            form.reset();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error("Connection error:", error);

        alert("Cannot connect to the server. Please check your backend.");

    }

});