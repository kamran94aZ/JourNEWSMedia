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
        console.log("Submitting data to jour-news.com/data.json:", formData);

        const response = await fetch("https://jour-news.com/api/save-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Registration successful and data updated!");
            document.getElementById("registerForm").reset();
        } else {
            throw new Error("Server responded with an error.");
        }

    } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred. Please try again.");
    }
});
