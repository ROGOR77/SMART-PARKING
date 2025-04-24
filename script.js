const form = document.getElementById("reservation-form");
const spotSelect = document.getElementById("spot");

const updateSpotAvailability = () => {
  const now = new Date();
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");

  for (let option of spotSelect.options) {
    if (option.value === "") continue; // Skip placeholder

    const spot = option.value;
    const isReserved = reservations.some(r => 
      r.spot === spot && new Date(r.end) > now
    );

    option.disabled = isReserved;
    option.textContent = isReserved ? `${spot} (Reserved)` : spot;
  }
};

document.addEventListener("DOMContentLoaded", updateSpotAvailability);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = form.name.value.trim();
  const carNumber = form.car.value.trim();
  const spot = form.spot.value;
  const start = new Date(form.start.value);
  const end = new Date(form.end.value);

  if (!name || !carNumber || !spot || !form.start.value || !form.end.value) {
    alert("Please fill out all fields.");
    return;
  }

  if (start >= end) {
    alert("End time must be after start time.");
    return;
  }

  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");

  const conflict = reservations.find(r => 
    r.spot === spot &&
    ((start < new Date(r.end)) && (end > new Date(r.start)))
  );

  if (conflict) {
    alert("This parking spot is already reserved for the selected time.");
    return;
  }

  const newReservation = { name, car: carNumber, spot, start: start.toISOString(), end: end.toISOString() };
  reservations.push(newReservation);
  localStorage.setItem("reservations", JSON.stringify(reservations));

  window.location.href = `confirmation.html?name=${encodeURIComponent(name)}&car=${encodeURIComponent(carNumber)}&spot=${spot}&start=${start.toISOString()}&end=${end.toISOString()}`;
});

document.getElementById('toggleMap').addEventListener('click', function () {
  const map = document.getElementById('gpsMap');
  if (map.classList.contains('hidden')) {
    map.classList.remove('hidden');
    this.textContent = 'Hide Parking Map';
  } else {
    map.classList.add('hidden');
    this.textContent = 'Show Parking Map';
  }
});
