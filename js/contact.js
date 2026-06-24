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
        console.log("Submitting data:", formData);
        
        alert("Registration successful!");
        document.getElementById("registerForm").reset();

    } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred. Please try again.");
    }
});