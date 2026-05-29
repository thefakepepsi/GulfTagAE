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

// SIMPLE CAPTCHA
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
    trialMessageEl.textContent =
      "You have already used your free trial.";
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
  const data = { studentName, grade, schoolName, parentContact, code };

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

// PRINT STICKER
printBtn.addEventListener("click", () => {
  const storedData = localStorage.getItem(REGISTERED_DATA_KEY);
  if (!storedData) return;

  const data = JSON.parse(storedData);

  const w = window.open("", "_blank");
  w.document.write(`
    <html>
      <head>
        <title>Print GulfTag Sticker</title>
        <style>
          body { font-family: system-ui; padding: 1rem; }
          .sticker {
            margin-top: 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            padding: 0.5rem;
            width: 180px;
          }
        </style>
      </head>
      <body>
        <h1>GulfTag AE – Student Sticker</h1>
        <p><strong>Student:</strong> ${data.studentName}</p>
        <p><strong>Grade:</strong> ${data.grade}</p>
        <p><strong>School:</strong> ${data.schoolName}</p>
        <div class="sticker">
          <strong>${data.code}</strong>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  w.document.close();
});

// TAG CHECKER
document.getElementById("checkBtn").addEventListener("click", () => {
  const input = document.getElementById("checkInput").value.trim();
  const result = document.getElementById("checkResult");

  if (input === "GULFTAG-1234567") {
    result.textContent = "This GulfTag is valid and currently in use.";
    result.style.color = "#16a34a";
  } else if (input === "GULFTAG-0000000") {
    result.textContent = "This tag is invalid. Please purchase a new GulfTag.";
    result.style.color = "#b91c1c";
  } else {
    result.textContent = "Code not recognized.";
    result.style.color = "#6b7280";
  }
});

// PAYMENT MODAL
const paymentModal = document.getElementById("paymentModal");
const selectedPlanEl = document.getElementById("selectedPlan");
const paymentStatusEl = document.getElementById("paymentStatus");

document.querySelectorAll(".open-payment").forEach(btn => {
  btn.addEventListener("click", () => {
    const plan = btn.getAttribute("data-plan");
    selectedPlanEl.textContent = `Selected plan: ${plan}`;
    paymentStatusEl.textContent = "";
    paymentModal.classList.add("active");
  });
});

document.getElementById("closePayment").addEventListener("click", () => {
  paymentModal.classList.remove("active");
});

paymentModal.addEventListener("click", e => {
  if (e.target === paymentModal) paymentModal.classList.remove("active");
});

document.getElementById("paymentForm").addEventListener("submit", e => {
  e.preventDefault();
  paymentStatusEl.textContent = "Payment successful (demo).";
});
