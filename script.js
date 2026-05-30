// PRINT STICKER (TEXT ONLY)
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
          body { 
            font-family: system-ui; 
            padding: 1.5rem; 
          }
          .sticker {
            border: 2px solid #000;
            border-radius: 8px;
            padding: 1rem;
            width: 240px;
            font-size: 16px;
            line-height: 1.4;
          }
          .code {
            font-size: 20px;
            font-weight: bold;
            margin-top: 0.5rem;
          }
        </style>
      </head>
      <body>
        <div class="sticker">
          <div><strong>Student:</strong> ${data.studentName}</div>
          <div><strong>Grade:</strong> ${data.grade}</div>
          <div><strong>School:</strong> ${data.schoolName}</div>
          <div class="code">${data.code}</div>
        </div>

        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `);
  w.document.close();
});
