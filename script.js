let sortDirection = {
  institution: true,
  fee: true,
  openDate: true,
  closeDate: true
};

function saveNotices() {
  const notices = [];
  document.querySelectorAll("#noticeTable tr").forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 4) {
      notices.push({
        institution: cells[0].textContent,
        fee: cells[1].textContent,
        openDate: cells[2].textContent,
        closeDate: cells[3].textContent
      });
    }
  });
  localStorage.setItem("notices", JSON.stringify(notices));
}

function loadNotices(isAdmin) {
  const noticeTable = document.getElementById("noticeTable");
  noticeTable.innerHTML = "";

  const notices = JSON.parse(localStorage.getItem("notices")) || [];
  notices.forEach(n => addNotice(n, isAdmin));
}

function addNotice(data, isAdmin) {
  const noticeTable = document.getElementById("noticeTable");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${data.institution}</td>
    <td>${data.fee}</td>
    <td>${data.openDate}</td>
    <td>${data.closeDate}</td>
  `;

  if (isAdmin) {
    const actions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => {
      const newInstitution = prompt("Institution Name:", data.institution) || data.institution;
      const newFee = prompt("Application Fee:", data.fee) || data.fee;
      const newOpen = prompt("Opening Date (YYYY-MM-DD):", data.openDate) || data.openDate;
      const newClose = prompt("Closing Date (YYYY-MM-DD):", data.closeDate) || data.closeDate;

      data.institution = newInstitution;
      data.fee = newFee;
      data.openDate = newOpen;
      data.closeDate = newClose;

      row.cells[0].textContent = newInstitution;
      row.cells[1].textContent = newFee;
      row.cells[2].textContent = newOpen;
      row.cells[3].textContent = newClose;

      saveNotices();
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      row.remove();
      saveNotices();
    };

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    row.appendChild(actions);
  }

  noticeTable.appendChild(row);
}

function enableNoticeForm() {
  const noticeForm = document.getElementById("noticeForm");
  noticeForm.addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      institution: document.getElementById("institution").value.trim(),
      fee: document.getElementById("fee").value.trim(),
      openDate: document.getElementById("openDate").value,
      closeDate: document.getElementById("closeDate").value
    };

    if (data.institution && data.fee && data.openDate && data.closeDate) {
      addNotice(data, true);
      saveNotices();
      noticeForm.reset();
    }
  });
}

function sortTable(column) {
  let notices = JSON.parse(localStorage.getItem("notices")) || [];

  notices.sort((a, b) => {
    if (column === "fee") {
      let feeA = parseFloat(a.fee.replace(/[^0-9.]/g, "")) || 0;
      let feeB = parseFloat(b.fee.replace(/[^0-9.]/g, "")) || 0;
      return sortDirection[column] ? feeA - feeB : feeB - feeA;
    } else if (column === "openDate" || column === "closeDate") {
      let dateA = new Date(a[column]);
      let dateB = new Date(b[column]);
      return sortDirection[column] ? dateA - dateB : dateB - dateA;
    } else {
      let valA = a[column].toLowerCase();
      let valB = b[column].toLowerCase();
      if (valA < valB) return sortDirection[column] ? -1 : 1;
      if (valA > valB) return sortDirection[column] ? 1 : -1;
      return 0;
    }
  });

  sortDirection[column] = !sortDirection[column];
  localStorage.setItem("notices", JSON.stringify(notices));

  const isAdmin = document.querySelector("h1").textContent.includes("Admin");
  loadNotices(isAdmin);
}
