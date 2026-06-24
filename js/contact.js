document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    
    
    const formData = {
        fullName: document.getElementById("fullname").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        createdAt: new Date().toISOString()
    };

    if (!formData.fullName || !formData.email) {
        alert("Please fill in the required fields (Full Name and Email).");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.value = "Sending...";

    try {
        const response = await fetch("https://jour-news.com/api/save-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Registration successful!");
            document.getElementById("registerForm").reset();
        } else {
            throw new Error("Server error.");
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred. Please try again.");
    } finally {
        // Uğurlu və ya uğursuz olmasından asılı olmayaraq düyməni bərpa edirik
        submitBtn.disabled = false;
        submitBtn.value = "Submit";
    }
});
