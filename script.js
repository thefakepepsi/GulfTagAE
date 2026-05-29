// YEAR IN FOOTER
document.getElementById("year").textContent = new Date().getFullYear();

// SCROLL TO PRICING
document.getElementById("scrollToPricing").addEventListener("click", () => {
  document.getElementById("pricing").scrollIntoView({ behavior: "smooth" });
});

// SIMPLE CAPTCHA
let captchaCorrectAnswer = null;

function generateCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2; // 2–9
  const b = Math.floor(Math.random() * 8) + 2;
  captchaCorrectAnswer = a + b;
  const questionEl = document.getElementById("captchaQuestion");
  questionEl.textContent = `Prove you’re human: What is ${a} + ${b}?`;
  document.getElementById("captchaAnswer").value = "";
}

generateCaptcha();

// FREE TRIAL LOGIC
const FREE_TRIAL_KEY = "gulfTagFreeTrialUsed";
const REGISTERED_DATA_KEY = "gulfTagRegisteredData";

const trialMessageEl = document.getElementById("trialMessage");
const registerBtn = document.getElementById("registerBtn");
const printBtn = document.getElementById("printBtn");
const qrInfoEl = document.getElementById("qrInfo");
const qrContainer = document.getElementById("qrcode");

let qrInstance = null;

function checkFreeTrialState() {
  const used = localStorage.getItem(FREE_TRIAL_KEY) === "true";
  const storedData = localStorage.getItem(REGISTERED_DATA_KEY);

  if (used) {
    registerBtn.disabled = true;
    trialMessageEl.textContent =
      "You have already used your free trial. You can reprint your existing stickers or choose a school plan.";
    trialMessageEl.style.color = "#b91c1c";

    if (storedData) {
      const data = JSON.parse(storedData);
      generateQRCodeFromData(data);
      qrInfoEl.textContent = "This is your saved GulfTag from your free trial.";
      printBtn.disabled = false;
    }
  } else {
    registerBtn.disabled = false;
    trialMessageEl.textContent =
      "You have 1 free trial. Register once, generate a QR code, and print stickers.";
    trialMessageEl.style.color = "#6b7280";
  }
}

checkFreeTrialState();

// QR GENERATION
function generateQRCodeFromData(data) {
  // Clear previous QR
  qrContainer.innerHTML = "";

  const text = `GulfTag AE\nStudent: ${data.studentName}\nGrade: ${data.grade}\nSchool: ${data.schoolName}\nParent contact: ${data.parentContact}`;

  qrInstance = new QRCode(qrContainer, {
    text,
    width: 170,
    height: 170,
  });
}

// REGISTRATION FORM SUBMIT
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const used = localStorage.getItem(FREE_TRIAL_KEY) === "true";
    if (used) {
      trialMessageEl.textContent =
        "Your free trial is already used. Please choose a school plan to continue.";
      trialMessageEl.style.color = "#b91c1c";
      return;
    }

    const studentName = document.getElementById("studentName").value.trim();
    const grade = document.getElementById("grade").value.trim();
    const schoolName = document.getElementById("schoolName").value.trim();
    const parentContact = document
      .getElementById("parentContact")
      .value.trim();
    const captchaAnswer = parseInt(
      document.getElementById("captchaAnswer").value,
      10
    );

    if (!studentName || !grade || !schoolName || !parentContact) {
      trialMessageEl.textContent = "Please fill in all fields.";
      trialMessageEl.style.color = "#b91c1c";
      return;
    }

    if (isNaN(captchaAnswer) || captchaAnswer !== captchaCorrectAnswer) {
      trialMessageEl.textContent = "CAPTCHA incorrect. Please try again.";
      trialMessageEl.style.color = "#b91c1c";
      generateCaptcha();
      return;
    }

    const data = { studentName, grade, schoolName, parentContact };

    // Save to localStorage
    localStorage.setItem(FREE_TRIAL_KEY, "true");
    localStorage.setItem(REGISTERED_DATA_KEY, JSON.stringify(data));

    generateQRCodeFromData(data);
    qrInfoEl.textContent =
      "Your GulfTag QR code has been generated. You can now print your stickers.";
    printBtn.disabled = false;

    trialMessageEl.textContent =
      "Free trial used. You can reprint your stickers anytime on this device.";
    trialMessageEl.style.color = "#16a34a";

    generateCaptcha();
    checkFreeTrialState();
  });

// PRINT STICKERS
printBtn.addEventListener("click", () => {
  const storedData = localStorage.getItem(REGISTERED_DATA_KEY);
  if (!storedData) return;

  const data = JSON.parse(storedData);

  // Get QR canvas or img
  const img = qrContainer.querySelector("img") || qrContainer.querySelector("canvas");
  if (!img) return;

  let imgSrc;
  if (img.tagName.toLowerCase() === "canvas") {
    imgSrc = img.toDataURL("image/png");
  } else {
    imgSrc = img.src;
  }

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Print GulfTag Stickers</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            padding: 1rem;
          }
          h1 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }
          p {
            font-size: 0.9rem;
            margin: 0.15rem 0;
          }
          .info {
            margin-bottom: 0.75rem;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
            margin-top: 1rem;
          }
          .sticker {
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            padding: 0.4rem;
            text-align: center;
            font-size: 0.75rem;
          }
          .sticker img {
            width: 90px;
            height: 90px;
            margin-bottom: 0.25rem;
          }
        </style>
      </head>
      <body>
        <h1>GulfTag AE – Student Stickers</h1>
        <div class="info">
          <p><strong>Student:</strong> ${data.studentName}</p>
          <p><strong>Grade:</strong> ${data.grade}</p>
          <p><strong>School:</strong> ${data.schoolName}</p>
        </div>
        <div class="grid">
          ${Array.from({ length: 1 })
            .map(
              () => `
            <div class="sticker">
              <img src="${imgSrc}" />
              <div>${data.studentName}</div>
              <div>${data.schoolName}</div>
              <div>Grade ${data.grade}</div>
            </div>
          `
            )
            .join("")}
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
});

// FAKE PAYMENT MODAL
const paymentModal = document.getElementById("paymentModal");
const selectedPlanEl = document.getElementById("selectedPlan");
const paymentStatusEl = document.getElementById("paymentStatus");

document.querySelectorAll(".open-payment").forEach((btn) => {
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

paymentModal.addEventListener("click", (e) => {
  if (e.target === paymentModal) {
    paymentModal.classList.remove("active");
  }
});

// FAKE PAYMENT SUBMIT
document
  .getElementById("paymentForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    paymentStatusEl.textContent =
      "Payment successful (demo). Thank you for choosing GulfTag AE!";
  });
