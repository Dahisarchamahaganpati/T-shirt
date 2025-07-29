document.getElementById("tshirtForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const mobile = this.mobile.value.trim();
  const quantity = parseInt(this.quantity.value);
  const sizes = [];

  if (!name || !email || !mobile || !quantity) {
    alert("Please fill in all fields.");
    return;
  }

  for (let i = 1; i <= quantity; i++) {
    const sizeSelect = document.querySelector(`select[name="size_${i}"]`);
    if (!sizeSelect || !sizeSelect.value) {
      alert(`Please select size for T-shirt ${i}`);
      return;
    }
    sizes.push(sizeSelect.value);
  }

  const submissions = JSON.parse(localStorage.getItem("tshirtSubmissions") || "[]");

  submissions.push({ name, email, mobile, quantity, sizes });


  localStorage.setItem("tshirtSubmissions", JSON.stringify(submissions));

  this.reset();
  document.getElementById("sizesContainer").innerHTML = ""; // Clear dynamic selects
  alert("✅ Order submitted successfully!");
});






function verifyAdmin() {
  const password = document.getElementById("adminPassword").value;
  const ADMIN_PASSWORD = "admin123";

  if (password === ADMIN_PASSWORD) {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("exportSection").style.display = "block";
    loadSubmissions();

    // ✅ Attach search event AFTER exportSection is visible
    document.getElementById("searchInput").addEventListener("input", filterSubmissions);

  } else {
    alert("❌ Incorrect password");
  }
  
}

function loadSubmissions() {
  const table = document.getElementById("submissionsTable");
  const data = JSON.parse(localStorage.getItem("tshirtSubmissions") || "[]");

  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Mobile</th>
      <th>Quantity</th>
      <th>Sizes</th>
      <th>Action</th>
    </tr>
  `;

  data.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.email}</td>
      <td>${entry.mobile}</td>
      <td>${entry.quantity}</td>
      <td>${Array.isArray(entry.sizes) ? entry.sizes.join(", ") : ""}</td>
      <td><button class="delete-btn" onclick="deleteEntry(${index})">Delete</button></td>
    `;
    table.appendChild(row);
  });
}




function filterSubmissions() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#submissionsTable tr");

  rows.forEach((row, index) => {
    if (index === 0) return; // skip header row
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

function deleteEntry(index) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  const data = JSON.parse(localStorage.getItem("tshirtSubmissions") || "[]");
  data.splice(index, 1); // remove the entry
  localStorage.setItem("tshirtSubmissions", JSON.stringify(data));
  loadSubmissions(); // refresh the table
}

function exportToExcel() {
  const data = JSON.parse(localStorage.getItem('tshirtSubmissions') || '[]');

  if (data.length === 0) {
    alert("⚠️ No data found to export.");
    return;
  }

  const formatted = data.map(entry => ({
    "Name": entry.name,
    "Email": entry.email,
    "Mobile": entry.mobile,
    "Quantity": entry.quantity || "",
    "Sizes": Array.isArray(entry.sizes) ? entry.sizes.join(", ") : ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TShirt Orders List");

  XLSX.writeFile(workbook, "Festival_TShirt_Orders.xlsx");
}


document.getElementById('quantity').addEventListener('input', () => {
  const quantity = parseInt(document.getElementById('quantity').value);
  const sizesContainer = document.getElementById('sizesContainer');
  sizesContainer.innerHTML = '';

  if (quantity > 0) {
    for (let i = 1; i <= quantity; i++) {
      const label = document.createElement('label');
      label.textContent = `Size for T-shirt ${i}`;
      const select = document.createElement('select');
      select.name = `size_${i}`;
      select.required = true;

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select Size';
      select.appendChild(defaultOption);

      ['S', 'M', 'L', 'XL'].forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        select.appendChild(option);
      });

      sizesContainer.appendChild(label);
      sizesContainer.appendChild(select);
      sizesContainer.appendChild(document.createElement('br'));
    }
  }
});


    