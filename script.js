// FOOTER YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// SMOOTH SCROLL FOR NAVBAR LINKS
document.querySelectorAll(".navbar nav a").forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// SCROLL TO PRICING BUTTON
document.getElementById("scrollToPricing").addEventListener("click", () => {
  document.getElementById("pricing").scrollIntoView({ behavior: "smooth" });
});

// CAPTCHA
let captchaCorrectAnswer = null;

function generateCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  captchaCorrectAnswer = a + b;
  document.getElementById("captchaQuestion").textContent =
    `Prove you’re human: What is ${a} + ${b}?`;
  document.getElementById("captchaAnswer").value = "";
}

generateCaptcha();

// FREE TRIAL STATE
const FREE_TRIAL_KEY = "gulfTagFreeTrialUsed";
const REGISTERED_DATA_KEY = "gulfTagRegisteredData";

const trialMessageEl = document.getElementById("trialMessage");
const registerBtn = document.getElementById("registerBtn");
const printBtn = document.getElementById("printBtn");
const qrInfoEl = document.getElementById("qrInfo");
const codeBox = document.getElementById("codeBox");

function generateRandomCode() {
  const num = Math.floor(1000000 + Math.random() * 9000000);
  return `GULFTAG-${num}`;
}

function checkFreeTrialState() {
  const used = localStorage.getItem(FREE_TRIAL_KEY) === "true";
  const storedData = localStorage.getItem(REGISTERED_DATA_KEY);

  if (used) {
    registerBtn.disabled = true;
    trialMessageEl.textContent = "You have already used your free trial.";
    trialMessageEl.style.color = "#b91c1c";

    if (storedData) {
      const data = JSON.parse(storedData);
      codeBox.textContent = data.code;
      qrInfoEl.textContent = "This is your saved GulfTag code.";
      printBtn.disabled = false;
    }
  } else {
    registerBtn.disabled = false;
    trialMessageEl.textContent =
      "You have 1 free trial. Register once to generate a GulfTag code.";
    trialMessageEl.style.color = "#6b7280";
  }
}

checkFreeTrialState();

// REGISTRATION FORM
document.getElementById("registrationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const used = localStorage.getItem(FREE_TRIAL_KEY) === "true";
  if (used) {
    trialMessageEl.textContent = "Free trial already used.";
    trialMessageEl.style.color = "#b91c1c";
    return;
  }

  const studentName = document.getElementById("studentName").value.trim();
  const grade = document.getElementById("grade").value.trim();
  const schoolName = document.getElementById("schoolName").value.trim();
  const parentContact = document.getElementById("parentContact").value.trim();
  const captchaAnswer = parseInt(document.getElementById("captchaAnswer").value, 10);

  if (!studentName || !grade || !schoolName || !parentContact) {
    trialMessageEl.textContent = "Please fill in all fields.";
    trialMessageEl.style.color = "#b91c1c";
    return;
  }

  if (isNaN(captchaAnswer) || captchaAnswer !== captchaCorrectAnswer) {
    trialMessageEl.textContent = "CAPTCHA incorrect.";
    trialMessageEl.style.color = "#b91c1c";
    generateCaptcha();
    return;
  }

  const code = generateRandomCode();
  const data = {
    studentName,
    grade,
    schoolName,
    parentContact,
    code,
    createdAt: Date.now()
  };

  localStorage.setItem(FREE_TRIAL_KEY, "true");
  localStorage.setItem(REGISTERED_DATA_KEY, JSON.stringify(data));

  codeBox.textContent = code;
  qrInfoEl.textContent = "Your GulfTag code has been generated.";
  printBtn.disabled = false;

  trialMessageEl.textContent = "Free trial used.";
  trialMessageEl.style.color = "#16a34a";

  generateCaptcha();
  checkFreeTrialState();
});

// PRINT STICKER WITH QR
printBtn.addEventListener("click", () => {
  const storedData = localStorage.getItem(REGISTERED_DATA_KEY);
  if (!storedData) return;

  const data = JSON.parse(storedData);

  const qrURL =
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=` +
    encodeURIComponent(
      `https://thefakepepsi.github.io/GulfTagAE/?code=${data.code}#identify`
    );

  const w = window.open("", "_blank");
  w.document.write(`
    <html>
      <head>
        <title>Print GulfTag Sticker</title>
        <style>
          body { font-family: system-ui; padding: 1.5rem; }
          .sticker {
            border: 2px solid #000;
            border-radius: 8px;
            padding: 1rem;
            width: 260px;
            text-align: center;
          }
          .code {
            font-size: 20px;
            font-weight: bold;
            margin-top: 0.5rem;
          }
          img { margin-bottom: 0.5rem; }
        </style>
      </head>
      <body>
        <div class="sticker">
          <img src="${qrURL}" width="200" height="200">
          <div class="code">${data.code}</div>
          <div><strong>Student:</strong> ${data.studentName}</div>
          <div><strong>Grade:</strong> ${data.grade}</div>
          <div><strong>School:</strong> ${data.schoolName}</div>
        </div>

        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `);
  w.document.close();
});

// VALIDITY CHECKER
document.getElementById("checkBtn").addEventListener("click", () => {
  const input = document.getElementById("checkInput").value.trim();
  const result = document.getElementById("checkResult");

  const storedData = JSON.parse(localStorage.getItem(REGISTERED_DATA_KEY) || "{}");
  const freeTrialCode = storedData.code;
  const createdAt = storedData.createdAt;

  // Free trial code
  if (input === freeTrialCode) {
    const now = Date.now();
    const daysPassed = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, 30 - daysPassed);

    result.textContent =
      `This GulfTag is a free trial. It is valid. It will expire in ${daysLeft} days.`;
    result.style.color = "#16a34a";
    return;
  }

  // Hardcoded valid
  if (input === "GULFTAG-1234567") {
    result.textContent = "This GulfTag is valid and currently in use.";
    result.style.color = "#16a34a";
    return;
  }

  // Hardcoded invalid
  if (input === "GULFTAG-0000000") {
    result.textContent = "This tag is invalid. Please purchase a new GulfTag.";
    result.style.color = "#b91c1c";
    return;
  }

  result.textContent = "Code not recognized.";
  result.style.color = "#6b7280";
});

// IDENTIFICATION
document.getElementById("identifyBtn").addEventListener("click", () => {
  const input = document.getElementById("identifyInput").value.trim();
  const result = document.getElementById("identifyResult");

  const storedData = JSON.parse(localStorage.getItem(REGISTERED_DATA_KEY) || "{}");
  const freeTrialCode = storedData.code;

  // Free trial identification
  if (input === freeTrialCode) {
    result.innerHTML = `
      <h3>GulfTag Owner Information</h3>
      <p><strong>Name:</strong> ${storedData.studentName}</p>
      <p><strong>Grade:</strong> ${storedData.grade}</p>
      <p><strong>School:</strong> ${storedData.schoolName}</p>
      <p><strong>Type:</strong> Free Trial (30 days)</p>
    `;
    result.style.color = "#111827";
    return;
  }

  // Hardcoded student
  if (input === "GULFTAG-1234567") {
    result.innerHTML = `
      <h3>GulfTag Owner Information</h3>
      <p><strong>Name:</strong> Madhav H.</p>
      <p><strong>Age:</strong> 12</p>
      <p><strong>Class:</strong> 7E</p>
      <p><strong>School:</strong> GEMS Modern Academy</p>
      <p><strong>Days Left:</strong> 29 days</p>
    `;
    result.style.color = "#111827";
    return;
  }

  result.textContent = "Tag not found.";
  result.style.color = "#b91c1c";
});

// AUTO‑IDENTIFY FROM QR URL
const urlParams = new URLSearchParams(window.location.search);
const autoCode = urlParams.get("code");

if (autoCode) {
  document.getElementById("identifyInput").value = autoCode;
  document.getElementById("identifyBtn").click();
  document.getElementById("identify").scrollIntoView({ behavior: "smooth" });
}

// PAYMENT MODAL
const paymentModal = document.getElementById("paymentModal");
const selectedPlanEl = document.getElementById("selectedPlan");
const paymentStatusEl = document.getElementById("paymentStatus");

const addressForm = document.getElementById("addressForm");
const paymentForm = document.getElementById("paymentForm");

// Open modal
document.querySelectorAll(".open-payment").forEach(btn => {
  btn.addEventListener("click", () => {
    const plan = btn.getAttribute("data-plan");
    selectedPlanEl.textContent = `Selected plan: ${plan}`;
    paymentStatusEl.textContent = "";

    addressForm.style.display = "block";
    paymentForm.style.display = "none";

    addressForm.reset();
    paymentForm.reset();

    paymentModal.classList.add("active");
  });
});

// Close modal
document.getElementById("closePayment").addEventListener("click", () => {
  paymentModal.classList.remove("active");
});

// Click outside closes modal
paymentModal.addEventListener("click", e => {
  if (e.target === paymentModal) paymentModal.classList.remove("active");
});

// STEP 1 → STEP 2
addressForm.addEventListener("submit", e => {
  e.preventDefault();
  addressForm.style.display = "none";
  paymentForm.style.display = "block";
});

// STEP 2 → SUCCESS
paymentForm.addEventListener("submit", e => {
  e.preventDefault();
  paymentStatusEl.textContent = "Payment successful (demo).";
});

document.getElementById("scrollToFounder").addEventListener("click", () => {
  document.getElementById("founder").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("scrollToExperience").addEventListener("click", () => {
  document.getElementById("experience").scrollIntoView({ behavior: "smooth" });
});
