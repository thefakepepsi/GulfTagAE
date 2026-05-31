// -------------------------------
// Smooth Scrolling for Navbar
// -------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// -------------------------------
// Footer Year Auto-Update
// -------------------------------
document.getElementById("year").textContent = new Date().getFullYear();

// -------------------------------
// Scroll Buttons (Experience + Founder)
// -------------------------------
const founderBtn = document.getElementById("founderBtn");
const experienceBtn = document.getElementById("experienceBtn");

if (founderBtn) {
    founderBtn.addEventListener("click", () => {
        document.querySelector("#founder").scrollIntoView({ behavior: "smooth" });
    });
}

if (experienceBtn) {
    experienceBtn.addEventListener("click", () => {
        document.querySelector("#experience").scrollIntoView({ behavior: "smooth" });
    });
}

// -------------------------------
// CAPTCHA Generator
// -------------------------------
function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("captchaText").textContent = captcha;
}
generateCaptcha();

document.getElementById("refreshCaptcha").addEventListener("click", generateCaptcha);

// -------------------------------
// Free Trial System
// -------------------------------
let trialUsed = localStorage.getItem("trialUsed") === "true";

document.getElementById("startTrial").addEventListener("click", () => {
    if (trialUsed) {
        alert("You have already used your free trial.");
        return;
    }
    trialUsed = true;
    localStorage.setItem("trialUsed", "true");
    alert("Your free trial has started!");
});

// -------------------------------
// Registration Form
// -------------------------------
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const captchaInput = document.getElementById("captchaInput").value;
    const captchaReal = document.getElementById("captchaText").textContent;

    if (captchaInput !== captchaReal) {
        alert("Incorrect CAPTCHA. Try again.");
        generateCaptcha();
        return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    alert("Registration successful!");
});

// -------------------------------
// QR Code Generator
// -------------------------------
document.getElementById("generateQR").addEventListener("click", () => {
    const studentName = document.getElementById("qrName").value;
    const studentClass = document.getElementById("qrClass").value;

    if (!studentName || !studentClass) {
        alert("Please enter both name and class.");
        return;
    }

    const qrData = `Name: ${studentName}\nClass: ${studentClass}`;
    const qrContainer = document.getElementById("qrContainer");
    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
        text: qrData,
        width: 200,
        height: 200
    });
});

// -------------------------------
// Print Sticker
// -------------------------------
document.getElementById("printSticker").addEventListener("click", () => {
    const qrArea = document.getElementById("qrContainer").innerHTML;

    if (!qrArea.trim()) {
        alert("Generate a QR code first.");
        return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
        <head><title>Print QR Sticker</title></head>
        <body>${qrArea}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
});

// -------------------------------
// Validity Checker
// -------------------------------
document.getElementById("checkValidity").addEventListener("click", () => {
    const code = document.getElementById("validityInput").value;

    if (!code.trim()) {
        alert("Enter a code to check.");
        return;
    }

    alert("This GulfTag is valid and registered.");
});

// -------------------------------
// Fake Payment Modal
// -------------------------------
const paymentModal = document.getElementById("paymentModal");
const closePayment = document.getElementById("closePayment");

document.querySelectorAll(".pricing-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        paymentModal.style.display = "flex";
    });
});

closePayment.addEventListener("click", () => {
    paymentModal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === paymentModal) {
        paymentModal.style.display = "none";
    }
});
