/* ---------- SECTION SWITCHING ---------- */
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

/* ---------- LOCAL STORAGE HELPERS ---------- */
function getItems() {
  const data = localStorage.getItem("gulfTagItems");
  return data ? JSON.parse(data) : {};
}

function saveItems(items) {
  localStorage.setItem("gulfTagItems", JSON.stringify(items));
}

/* ---------- REGISTER ITEM ---------- */
function registerItem() {
  const parentName = document.getElementById("parentName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const childName = document.getElementById("childName").value.trim();
  const className = document.getElementById("class").value.trim();
  const itemName = document.getElementById("itemName").value.trim();

  if (!parentName || !phone || !childName || !className || !itemName) {
    document.getElementById("registerResult").innerText =
      "Please fill in all fields.";
    return;
  }

  const items = getItems();
  const itemId = "item_" + Date.now();

  items[itemId] = {
    parentName,
    phone,
    childName,
    className,
    itemName
  };

  saveItems(items);

  document.getElementById("registerResult").innerHTML =
    `Item registered!<br><strong>Item ID:</strong> ${itemId}<br>` +
    `Use this ID to generate a QR code.`;

  document.getElementById("registerForm").reset();
}

/* ---------- GENERATE QR CODE ---------- */
function generateQR() {
  const itemId = document.getElementById("qrItemId").value.trim();
  const qrDiv = document.getElementById("qrCode");
  qrDiv.innerHTML = "";

  if (!itemId) {
    qrDiv.innerText = "Please enter an Item ID.";
    return;
  }

  const items = getItems();
  if (!items[itemId]) {
    qrDiv.innerText = "Item ID not found.";
    return;
  }

  // YOUR GITHUB REPOSITORY URL (as requested)
  const baseUrl = "https://github.com/thefakepepsi/GulfTagAE";

  const itemUrl = `${baseUrl}?item=${encodeURIComponent(itemId)}`;

  console.log("QR URL:", itemUrl);

  const qrImg = document.createElement("img");
  qrImg.src =
    "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=" +
    encodeURIComponent(itemUrl);

  const info = document.createElement("p");
  info.innerHTML = `Scan this QR to view item details:<br>${itemUrl}`;

  qrDiv.appendChild(qrImg);
  qrDiv.appendChild(info);
}

/* ---------- LOAD ITEM DETAILS FROM URL ---------- */
function loadItemFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("item");

  if (!itemId) return;

  const items = getItems();
  const item = items[itemId];
  if (!item) return;

  showSection("item");

  document.getElementById("itemDetails").innerHTML = `
    <h2>This item belongs to:</h2>
    <p><strong>Child:</strong> ${item.childName}</p>
    <p><strong>Class:</strong> ${item.className}</p>
    <p><strong>Item:</strong> ${item.itemName}</p>
    <p><strong>Parent Contact:</strong> ${item.phone}</p>
    <p>Please contact the parent to return this item.</p>
  `;
}

/* ---------- INIT ---------- */
window.onload = loadItemFromUrl;
