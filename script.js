// -------------------------------
// TAB SWITCHING
// -------------------------------
const tabButtons = document.querySelectorAll(".tab-btn");
const tabSections = document.querySelectorAll(".tab-section");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");

        tabSections.forEach(sec => sec.classList.remove("active"));
        document.getElementById(target).classList.add("active");

        tabButtons.forEach(b => b.classList.remove("active-btn"));
        btn.classList.add("active-btn");
    });
});

// -------------------------------
// CAPTCHA
// -------------------------------
function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const captchaText = document.getElementById("captchaText");
    if (captchaText) captchaText.textContent = captcha;
}
generateCaptcha();

const refreshCaptcha = document.getElementById("refreshCaptcha");
if (refreshCaptcha) {
    refreshCaptcha.addEventListener("click", generateCaptcha);
}

// -------------------------------
// FREE TRIAL (SPECIAL CODE)
// -------------------------------
const SPECIAL_CODE = "GULFTAG-0123457";

let trialUsed = localStorage.getItem("trialUsed") === "true";

const startTrialBtn = document.getElementById("startTrial");
const trialCodeBox = document.getElementById("trialCodeBox");

if (startTrialBtn) {
    startTrialBtn.addEventListener("click", () => {
        if (trialUsed) {
            alert("You have already used your free trial.");
            return;
        }
        trialUsed = true;
        localStorage.setItem("trialUsed", "true");

        if (trialCodeBox) {
            trialCodeBox.textContent = `Your free trial code is: ${SPECIAL_CODE}`;
        }
        alert(`Your free trial has started!\nYour code: ${SPECIAL_CODE}`);

        const v1 = document.getElementById("validityInput");
        const v2 = document.getElementById("validityInput2");
        if (v1) v1.value = SPECIAL_CODE;
        if (v2) v2.value = SPECIAL_CODE;
    });
}

// -------------------------------
// REGISTRATION
// -------------------------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const captchaInput = document.getElementById("captchaInput").value.trim();
        const captchaReal = document.getElementById("captchaText").textContent.trim();

        if (captchaInput !== captchaReal) {
            alert("Incorrect CAPTCHA. Try again.");
            generateCaptcha();
            return;
        }

        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);

        alert("Registration successful!");
    });
}

// -------------------------------
// QR CODE GENERATOR
// -------------------------------
const generateQRBtn = document.getElementById("generateQR");
if (generateQRBtn) {
    generateQRBtn.addEventListener("click", () => {
        const studentName = document.getElementById("qrName").value.trim();
        const studentClass = document.getElementById("qrClass").value.trim();

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
}

// -------------------------------
// PRINT STICKER
// -------------------------------
const printStickerBtn = document.getElementById("printSticker");
if (printStickerBtn) {
    printStickerBtn.addEventListener("click", () => {
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
}

// -------------------------------
// RANDOM VALIDITY DETAILS
// -------------------------------
function getRandomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomValidityDetails(code) {
    // Special fixed code
    if (code === SPECIAL_CODE) {
        return {
            valid: true,
            name: "Madhav Hissaria",
            className: "7E",
            school: "GEMS Modern Academy",
            registered: "12 May 2026",
            expiresIn: 30
        };
    }

    const names = [
        "Rayan M.", "Fatima A.", "Zayed K.", "Mariam S.",
        "Ethan R.", "Sofia L.", "Liam P.", "Aanya K."
    ];
    const classes = ["5A", "6B", "7C", "7E", "8D", "9A", "10C"];

    const name = getRandomFrom(names);
    const className = getRandomFrom(classes);

    const now = new Date();
    const pastDays = Math.floor(Math.random() * 60); // registered within last 60 days
    const regDate = new Date(now.getTime() - pastDays * 24 * 60 * 60 * 1000);
    const regStr = regDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const expiresIn = Math.floor(Math.random() * 45) + 5; // 5–50 days

    return {
        valid: true,
        name,
        className,
        school: "GEMS Modern Academy",
        registered: regStr,
        expiresIn
    };
}

function renderValidityResult(targetElement, code) {
    if (!code) {
        alert("Enter a code to check.");
        return;
    }

    const details = generateRandomValidityDetails(code);

    targetElement.innerHTML = `
        <strong>Status:</strong> ${details.valid ? "Valid" : "Invalid"}<br>
        <strong>Name:</strong> ${details.name}<br>
        <strong>Class:</strong> ${details.className}<br>
        <strong>School:</strong> ${details.school}<br>
        <strong>Registered on:</strong> ${details.registered}<br>
        <strong>Expires in:</strong> ${details.expiresIn} days
    `;
}

// -------------------------------
// VALIDITY CHECKERS (TWO INPUTS)
// -------------------------------
const checkValidityBtn = document.getElementById("checkValidity");
if (checkValidityBtn) {
    checkValidityBtn.addEventListener("click", () => {
        const code = document.getElementById("validityInput").value.trim();
        const result = document.getElementById("validityResult");
        renderValidityResult(result, code);
    });
}

const checkValidityBtn2 = document.getElementById("checkValidity2");
if (checkValidityBtn2) {
    checkValidityBtn2.addEventListener("click", () => {
        const code = document.getElementById("validityInput2").value.trim();
        const result = document.getElementById("validityResult2");
        renderValidityResult(result, code);
    });
}

// -------------------------------
// PAYMENT MODAL SYSTEM
// -------------------------------
const paymentModal = document.getElementById("paymentModal");
const closePayment = document.getElementById("closePayment");
const continueToPayment = document.getElementById("continueToPayment");
const finishPayment = document.getElementById("finishPayment");
const paymentStep = document.getElementById("paymentStep");

// Open modal from pricing buttons
document.querySelectorAll(".pricing-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (paymentModal) {
            paymentModal.style.display = "flex";
            if (paymentStep) paymentStep.style.display = "none";
        }
    });
});

// Close modal (X)
if (closePayment) {
    closePayment.addEventListener("click", () => {
        if (paymentModal) paymentModal.style.display = "none";
    });
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === paymentModal) {
        paymentModal.style.display = "none";
    }
});

// Continue to payment step
if (continueToPayment) {
    continueToPayment.addEventListener("click", () => {
        if (paymentStep) paymentStep.style.display = "block";
    });
}

// Finish payment
if (finishPayment) {
    finishPayment.addEventListener("click", () => {
        alert("Demo payment successful!");
        if (paymentModal) paymentModal.style.display = "none";
    });
});
