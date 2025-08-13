const stationsData = {
    CNG: [
        { name: 'GreenFuel Station', price: 80 },
        { name: 'EcoGas Pump', price: 78 }
    ],
    EV: [
        { name: 'ChargeX Hub', price: 15 },
        { name: 'VoltFast Charging', price: 18 }
    ],
    Petrol: [
        { name: 'PetroFast Station', price: 110 },
        { name: 'SpeedFuel Pump', price: 108 }
    ],
    Diesel: [
        { name: 'DieselGo Hub', price: 95 },
        { name: 'MaxDiesel Pump', price: 92 }
    ]
};

function showStations(type) {
    const stationList = document.getElementById('station-list');
    stationList.innerHTML = '';
    stationsData[type].forEach(station => {
        const div = document.createElement('div');
        div.className = 'station-item';
        div.innerHTML = `<h3>${station.name}</h3><p>₹${station.price} per unit</p>`;
        div.onclick = () => {
            localStorage.setItem('selectedStation', JSON.stringify({ name: station.name, price: station.price, type }));
            window.location.href = 'booking.html';
        };
        stationList.appendChild(div);
    });
}

function calculateAmount() {
    const liters = document.getElementById('liters').value;
    const station = JSON.parse(localStorage.getItem('selectedStation'));
    if (liters && station) {
        document.getElementById('amount').value = '₹' + (liters * station.price).toFixed(2);
    }
}

// Booking page logic
if (document.getElementById('bookingForm')) {
    const station = JSON.parse(localStorage.getItem('selectedStation'));
    if (station) {
        document.getElementById('stationName').value = station.name;
    }
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const vehicleNumber = document.getElementById('vehicleNumber').value;
        const date = document.getElementById('date').value;
        const timeSlot = document.getElementById('timeSlot').value;
        const liters = document.getElementById('liters').value;
        const amount = document.getElementById('amount').value;

        let history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
        history.push({
            station: station.name,
            type: station.type,
            vehicle: vehicleNumber,
            date,
            time: timeSlot,
            liters,
            amount
        });
        localStorage.setItem('bookingHistory', JSON.stringify(history));
        alert('Booking Confirmed!');
        window.location.href = 'history.html';
    });
}

// History page logic
if (document.getElementById('historyTable')) {
    let history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    const tbody = document.querySelector('#historyTable tbody');

    history.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${b.station}</td><td>${b.type}</td><td>${b.vehicle}</td><td>${b.date}</td><td>${b.time}</td><td>${b.liters}</td><td>${b.amount}</td>`;
        tbody.appendChild(tr);
    });

    // Create "Clear All History" button
    const clearBtn = document.createElement('button');
    clearBtn.textContent = "Clear All History";
    clearBtn.style.margin = "15px 0";
    clearBtn.style.padding = "10px 15px";
    clearBtn.style.background = "#d9534f";
    clearBtn.style.color = "white";
    clearBtn.style.border = "none";
    clearBtn.style.borderRadius = "5px";
    clearBtn.style.cursor = "pointer";
    clearBtn.onclick = function() {
        if (confirm("Are you sure you want to clear all booking history?")) {
            localStorage.removeItem('bookingHistory');
            location.reload();
        }
    };

    document.getElementById('historyTable').insertAdjacentElement("beforebegin", clearBtn);
}
