// Initialize map
const map = L.map("map").setView([20, 0], 2);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Landmark storage
let landmarks = [];
let markers = [];

// Modal elements
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const form = document.getElementById("form");
const closeModalBtn = document.getElementsByClassName("close")[0];

// Field groups
const noteFields = document.getElementById("noteFields");
const planFields = document.getElementById("planFields");
const landmarkNotesList = document.getElementById("landmarkNotesList"); // NEW

// Button references
const addNotesBtn = document.getElementById("addNotesBtn");
const createPlanBtn = document.getElementById("createPlanBtn");

// Handle modal open/close
function openModal(title, mode) {
  modalTitle.textContent = title;
  form.reset();
  modal.style.display = "block";

  if (mode === "notes") {
    noteFields.style.display = "block";
    planFields.style.display = "none";
    landmarkNotesList.style.display = "none";
    setFormSubmitForNotes();
  } else if (mode === "plan") {
    noteFields.style.display = "none";
    planFields.style.display = "block";
    landmarkNotesList.style.display = "block";
    generateNotesInputs();
    setFormSubmitForPlan();
  }
}

function closeModal() {
  modal.style.display = "none";
}

closeModalBtn.onclick = closeModal;
window.onclick = function (event) {
  if (event.target == modal) closeModal();
};

// Map click event: add marker
map.on("click", function (e) {
  const lat = e.latlng.lat.toFixed(6);
  const lng = e.latlng.lng.toFixed(6);

  const marker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
    .openPopup();

  markers.push(marker);
  landmarks.push({ latitude: lat, longitude: lng, note: "" });
  updateLandmarkList();
});

// Update landmark list
function updateLandmarkList() {
  const list = document.getElementById("landmarkList");
  list.innerHTML = "";
  landmarks.forEach((point, index) => {
    const li = document.createElement("li");
    li.textContent = `Landmark ${index + 1}: Lat ${point.latitude}, Lng ${
      point.longitude
    }`;
    list.appendChild(li);
  });

  addNotesBtn.disabled = createPlanBtn.disabled = landmarks.length === 0;
}

// Add Notes Button
addNotesBtn.addEventListener("click", () => {
  if (landmarks.length === 0) {
    alert("Please select at least one landmark first!");
    return;
  }
  openModal("Add Notes to Landmarks", "notes");
});

// Create Visiting Plans Button
createPlanBtn.addEventListener("click", () => {
  if (landmarks.length === 0) {
    alert("Please select landmarks first!");
    return;
  }
  openModal("Create Visiting Plan", "plan");
});

// Visited Landmarks Button
document
  .getElementById("visitedLandmarksBtn")
  .addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:5000/api/visited");
      const visits = await res.json();
      console.log(visits);
      alert("Visited Landmarks: " + JSON.stringify(visits, null, 2));
    } catch (error) {
      console.error(error);
      alert("Error fetching visited landmarks.");
    }
  });

// Set form submit for Notes
function setFormSubmitForNotes() {
  form.onsubmit = async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    try {
      for (const landmark of landmarks) {
        const data = {
          name,
          latitude: landmark.latitude,
          longitude: landmark.longitude,
          description,
          category,
        };
        await fetch("http://localhost:5000/api/landmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      alert("Landmarks with notes added successfully!");
      clearLandmarks();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Error saving notes.");
    }
  };
}

// Generate Notes Inputs inside Modal
function generateNotesInputs() {
  landmarkNotesList.innerHTML = "";
  landmarks.forEach((landmark, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>Landmark ${index + 1}:</strong> Lat ${
      landmark.latitude
    }, Lng ${landmark.longitude}</p>
      <textarea placeholder="Add a note..." onchange="updateLandmarkNote(${index}, this.value)"></textarea>
      <hr/>
    `;
    landmarkNotesList.appendChild(div);
  });
}

// Update landmark note
function updateLandmarkNote(index, value) {
  landmarks[index].note = value;
}

// Set form submit for Visiting Plan
function setFormSubmitForPlan() {
  form.onsubmit = async function (e) {
    e.preventDefault();
    const visitor_name =
      document.getElementById("visitor_name").value || "Anonymous";

    try {
      const landmarkRes = await fetch("http://localhost:5000/api/landmarks");
      const allLandmarks = await landmarkRes.json();

      for (const landmark of landmarks) {
        const matchedLandmark = allLandmarks.find(
          (lm) =>
            lm.latitude.toFixed(6) == landmark.latitude &&
            lm.longitude.toFixed(6) == landmark.longitude
        );
        if (matchedLandmark) {
          await fetch("http://localhost:5000/api/visited", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              landmark_id: matchedLandmark.id,
              visitor_name,
              note: landmark.note,
            }),
          });
        }
      }
      alert("Visiting plan created successfully!");
      clearLandmarks();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Error creating visiting plan.");
    }
  };
}

// Clear landmarks and markers
function clearLandmarks() {
  landmarks = [];
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
  updateLandmarkList();
}
