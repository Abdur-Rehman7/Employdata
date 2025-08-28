const STORAGE_KEY = "employeeData";
function loadEmployees() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch {
      return defaultEmployees();
    }
  }
  return defaultEmployees();
}
function defaultEmployees() {
  return {
    101: {
      name: "John Doe",
      officeOnline: true,
      address: "123 Main St",
      tehsil: "Tehsil A",
      district: "District X",
      role: "matchmaker",
      knowMatchmaker: false,
      workedWithMatchmaker: false,
      alreadyMatchmaking: true,
      wantMatchmaking: true,
      feedbacks: [],
    },
  };
}
function saveEmployees(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
let employees = loadEmployees();
let selectedRating = null;
document.querySelectorAll(".star").forEach((star) => {
  star.addEventListener("click", function () {
    selectedRating = this.dataset.color;
    updateSpecialNote(selectedRating);
  });
});
function updateSpecialNote(rating) {
  const noteBox = document.getElementById("specialNote");
  if (["green", "blue", "yellow"].includes(rating)) {
    noteBox.textContent =
      "✅ If the rating is Green, Blue or Yellow, you can work with this matchmaker.";
    noteBox.style.color = "green";
  } else {
    noteBox.textContent =
      "❌ If the rating is Gray, Black or Red, company does not recommend working with them.";
    noteBox.style.color = "red";
  }
}
function submitFeedback() {
  if (!selectedRating) {
    alert("Please select a rating first!");
    return;
  }
  const feedback = {
    rating: selectedRating,
    q1: document.getElementById("q1").value,
    q2: document.getElementById("q2").value,
    q3: document.getElementById("q3").value,
    q4: document.getElementById("q4").value,
    q5: document.getElementById("q5").value,
    q6: document.getElementById("q6").value,
    q7: document.getElementById("q7").value,
    q8: document.getElementById("q8").value,
    q9: document.getElementById("q9").value,
    q10: document.getElementById("q10").value,
    q11: document.getElementById("q11").value,
  };
  const code = document.getElementById("codeInput").value.trim();
  if (employees.hasOwnProperty(code)) {
    if (!employees[code].feedbacks) employees[code].feedbacks = [];
    employees[code].feedbacks.push(feedback);
    saveEmployees(employees);
    document.getElementById("feedbackMessage").textContent =
      "Feedback submitted successfully!";
    document.getElementById("feedbackMessage").style.color = "green";
    searchPerson();
  }
}
function renderFeedbackSummary(p) {
  const box = document.getElementById("feedbackSummary");
  if (!p.feedbacks || p.feedbacks.length === 0) {
    box.innerHTML = "<p>No feedback submitted yet.</p>";
    return;
  }
  const ratingMap = { green: 5, blue: 4, yellow: 3, gray: 2, black: 1, red: 0 };
  const avg =
    p.feedbacks.reduce((a, f) => a + ratingMap[f.rating], 0) /
    p.feedbacks.length;
  let avgColor =
    avg >= 4.5
      ? "green"
      : avg >= 3.5
      ? "blue"
      : avg >= 2.5
      ? "yellow"
      : avg >= 1.5
      ? "gray"
      : avg >= 0.5
      ? "black"
      : "red";
  let html = `<div class='feedback-summary'><strong>Feedback Summary:</strong><br>Average Rating: <span style="color:${avgColor}; font-weight:bold;">${avg.toFixed(
    1
  )}</span><br>Total Feedbacks: ${p.feedbacks.length}</div>`;
  html += "<div class='feedback-list'><h4>Feedbacks:</h4>";
  p.feedbacks.forEach((f, i) => {
    html += `<div class='feedback-item' onclick="toggleDetails(${i})"><strong>${
      f.q6 || "Anonymous"
    }</strong> - <span style='color:${
      f.rating
    };'>&#9733;</span><div class='feedback-details' id='details-${i}'><p>Q1: ${
      f.q1
    }</p><p>Q2: ${f.q2}</p><p>Q3: ${f.q3}</p><p>Q4: ${f.q4}</p><p>Q5: ${
      f.q5
    }</p><p>Q6: ${f.q6}</p><p>Q7: ${f.q7}</p><p>Q8: ${f.q8}</p><p>Q9: ${
      f.q9
    }</p><p>Q10: ${f.q10}</p><p>Q11: ${f.q11}</p></div></div>`;
  });
  html += "</div>";
  box.innerHTML = html;
}
function toggleDetails(i) {
  const el = document.getElementById(`details-${i}`);
  el.style.display = el.style.display === "block" ? "none" : "block";
}
function searchPerson() {
  const code = document.getElementById("codeInput").value.trim();
  const resultBox = document.getElementById("resultBox");
  const notFound = document.getElementById("notFound");
  const details = document.getElementById("personDetails");
  if (!code) {
    alert("Please enter an employee code to search.");
    return;
  }
  if (employees.hasOwnProperty(code)) {
    const p = employees[code];
    const detailsText = `Name: ${p.name || "N/A"}\nOffice Online: ${
      p.officeOnline ? "Yes" : "No"
    }\nAddress: ${p.address || "N/A"}\nTehsil: ${
      p.tehsil || "N/A"
    }\nDistrict: ${p.district || "N/A"}\nRole: ${
      p.role || "N/A"
    }\nDo you know this Matchmaker?: ${
      p.knowMatchmaker ? "Yes" : "No"
    }\nHave you worked with this Matchmaker?: ${
      p.workedWithMatchmaker ? "Yes" : "No"
    }\nAlready matchmaking with this person?: ${
      p.alreadyMatchmaking ? "Yes" : "No"
    }\nWant matchmaking with this person?: ${p.wantMatchmaking ? "Yes" : "No"}`;
    details.textContent = detailsText;
    resultBox.style.display = "block";
    notFound.style.display = "none";
    document.getElementById("feedbackSection").style.display = "block";
    renderFeedbackSummary(p);
  } else {
    resultBox.style.display = "none";
    notFound.style.display = "block";
    document.getElementById("feedbackSection").style.display = "none";
  }
}
function addEmployee() {
  const name = document.getElementById("newName").value.trim();
  const code = document.getElementById("newCode").value.trim();
  const officeOnline = document.getElementById("officeOnline").checked;
  const address = document.getElementById("newAddress").value.trim();
  const tehsil = document.getElementById("newTehsil").value.trim();
  const district = document.getElementById("newDistrict").value.trim();
  const role = document.getElementById("role").value;
  const knowMatchmaker = document.getElementById("knowMatchmaker").checked;
  const workedWithMatchmaker = document.getElementById(
    "workedWithMatchmaker"
  ).checked;
  const alreadyMatchmaking =
    document.getElementById("alreadyMatchmaking").checked;
  const wantMatchmaking = document.getElementById("wantMatchmaking").checked;
  const messageBox = document.getElementById("addMessage");
  messageBox.style.display = "none";
  messageBox.textContent = "";
  if (!name || !code) {
    messageBox.textContent = "Please fill out at least Name and Code.";
    messageBox.className = "message error";
    messageBox.style.display = "block";
    return;
  }
  if (!/^\d+$/.test(code)) {
    messageBox.textContent = "Code must be numeric only.";
    messageBox.className = "message error";
    messageBox.style.display = "block";
    return;
  }
  if (employees.hasOwnProperty(code)) {
    messageBox.textContent = "Employee code already exists.";
    messageBox.className = "message error";
    messageBox.style.display = "block";
    return;
  }
  employees[code] = {
    name,
    officeOnline,
    address,
    tehsil,
    district,
    role,
    knowMatchmaker,
    workedWithMatchmaker,
    alreadyMatchmaking,
    wantMatchmaking,
    feedbacks: [],
  };
  saveEmployees(employees);
  messageBox.textContent = `Employee ${name} added successfully!`;
  messageBox.className = "message success";
  messageBox.style.display = "block";
  document.getElementById("newName").value = "";
  document.getElementById("newCode").value = "";
  document.getElementById("officeOnline").checked = false;
  document.getElementById("newAddress").value = "";
  document.getElementById("newTehsil").value = "";
  document.getElementById("newDistrict").value = "";
  document.getElementById("role").value = "matchmaker";
  document.getElementById("knowMatchmaker").checked = false;
  document.getElementById("workedWithMatchmaker").checked = false;
  document.getElementById("alreadyMatchmaking").checked = false;
  document.getElementById("wantMatchmaking").checked = false;
  document.getElementById("codeInput").value = code;
  searchPerson();
}
