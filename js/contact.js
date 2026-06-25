document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = {
        fullName: document.getElementById("fullname").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        title: document.getElementById("title").value.trim(),
        organization: document.getElementById("organization").value.trim(),
        createdAt: new Date().toISOString()
    };

    if (!formData.fullName || !formData.email) {
        alert("Please fill in the required fields (Full Name and Email).");
        return;
    }

    try {
        const response = await fetch("https://api.jour-news.com/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Registration successful!");
            document.getElementById("registerForm").reset();
        } else {
            alert("Server Error: " + result.error);
        }

    } catch (error) {
        console.error("Submission error:", error);
        alert("Could not connect to backend server. Please try again.");
    }
});
