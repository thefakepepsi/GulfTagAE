// Firebase config (your values)
const firebaseConfig = {
  apiKey: "AIzaSyD_VRKBB-nuIIZ3jfrOkuq8tO1rcIEjcR8",
  authDomain: "gulftag.firebaseapp.com",
  projectId: "gulftag",
  storageBucket: "gulftag.firebasestorage.app",
  messagingSenderId: "525444624271",
  appId: "1:525444624271:web:2df5887ba2fbdedc7025fa"
};

// Init Firebase + Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Helper: generate a simple GulfTag ID
function generateGulfTagId() {
  const prefix = "GULFTAG";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}-${digits}`;
}

// Helper: 1 year from now
function oneYearFromNow() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

// DOM
const form = document.getElementById("gulfTagForm");
const formMessage = document.getElementById("formMessage");
const generatedSection = document.getElementById("generated");
const generatedIdEl = document.getElementById("generatedId");
const generatedIdInlineEl = document.getElementById("generatedIdInline");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function showFormMessage(text, type = "success") {
  formMessage.classList.remove("hidden", "success", "error");
  formMessage.classList.add(type);
  formMessage.textContent = text;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentName = document.getElementById("studentName").value.trim();
  const grade = document.getElementById("grade").value.trim();
  const schoolName = document.getElementById("schoolName").value.trim();
  const parentContact = document.getElementById("parentContact").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!studentName || !grade || !schoolName || !parentContact) {
    showFormMessage("Please fill in all required fields.", "error");
    return;
  }

  const id = generateGulfTagId();
  const now = new Date();
  const expiresAt = oneYearFromNow();

  try {
    await db.collection("qrcodes").doc(id).set({
      status: "active",
      studentName,
      grade,
      schoolName,
      parentContact,
      notes: notes || null,
      createdAt: firebase.firestore.Timestamp.fromDate(now),
      expiresAt: firebase.firestore.Timestamp.fromDate(expiresAt)
    });

    showFormMessage("GulfTag created successfully. Share this ID with the printing team.", "success");

    generatedIdEl.textContent = id;
    generatedIdInlineEl.textContent = id;
    generatedSection.classList.remove("hidden");

    form.reset();
  } catch (err) {
    console.error(err);
    showFormMessage("Something went wrong while creating this GulfTag. Please try again.", "error");
  }
});
