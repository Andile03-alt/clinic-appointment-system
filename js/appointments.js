/* Appointment Management Functions */

let appointmentsData = [
    {
        id: 'A001',
        patientId: 'P001',
        patientName: 'Thabo Mthembu',
        doctorId: 'D001',
        doctorName: 'Dr. Lekhanya Zwane',
        date: '2026-09-20',
        time: '09:00',
        reason: 'Follow-up consultation',
        status: 'scheduled'
    },
    {
        id: 'A002',
        patientId: 'P002',
        patientName: 'Nalini Singh',
        doctorId: 'D002',
        doctorName: 'Dr. Bongani Khumalo',
        date: '2026-09-21',
        time: '14:00',
        reason: 'General check-up',
        status: 'scheduled'
    },
    {
        id: 'A003',
        patientId: 'P003',
        patientName: 'Vusi Khumalo',
        doctorId: 'D001',
        doctorName: 'Dr. Lekhanya Zwane',
        date: '2026-09-19',
        time: '10:00',
        reason: 'Blood pressure check',
        status: 'pending'
    }
];

function displayPatientAppointments() {
    const patient = getCurrentPatient();
    const appointmentsDiv = document.getElementById('myAppointments');
    
    if (!appointmentsDiv) return;

    const patientAppointments = appointmentsData.filter(a => a.patientId === patient.id);
    
    if (patientAppointments.length === 0) {
        appointmentsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <p>No appointments scheduled</p>
            </div>
        `;
        return;
    }

    appointmentsDiv.innerHTML = patientAppointments.map(apt => `
        <div class="appointment-item">
            <div class="item-header">
                <span class="item-title">${apt.doctorName}</span>
                <span class="item-status ${getStatusColor(apt.status)}">${apt.status.toUpperCase()}</span>
            </div>
            <div class="item-details">
                <strong>Date:</strong> ${formatDate(apt.date)}
            </div>
            <div class="item-details">
                <strong>Time:</strong> ${formatTime(apt.time)}
            </div>
            <div class="item-details">
                <strong>Reason:</strong> ${apt.reason}
            </div>
        </div>
    `).join('');
}

function displayAvailableDoctors() {
    const doctorsDiv = document.getElementById('availableDoctors');
    
    if (!doctorsDiv) return;

    const doctors = [
        { id: 'D001', name: 'Dr. Lekhanya Zwane', specialization: 'General Practitioner', available: true },
        { id: 'D002', name: 'Dr. Bongani Khumalo', specialization: 'Pediatrician', available: true },
        { id: 'D003', name: 'Dr. Nalini Patel', specialization: 'Cardiologist', available: true }
    ];

    doctorsDiv.innerHTML = doctors.map(doc => `
        <div class="doctor-item">
            <div class="item-header">
                <span class="item-title">${doc.name}</span>
                <span class="item-status status-scheduled">Available</span>
            </div>
            <div class="item-details">
                <strong>Specialization:</strong> ${doc.specialization}
            </div>
        </div>
    `).join('');
}

function populateDoctorSelect() {
    const select = document.getElementById('appointmentDoctor');
    if (!select) return;

    const doctors = [
        { id: 'D001', name: 'Dr. Lekhanya Zwane' },
        { id: 'D002', name: 'Dr. Bongani Khumalo' },
        { id: 'D003', name: 'Dr. Nalini Patel' }
    ];

    doctors.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = doc.name;
        select.appendChild(option);
    });
}

function bookAppointment(event) {
    event.preventDefault();
    
    const patient = getCurrentPatient();
    const doctorId = document.getElementById('appointmentDoctor').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const reason = document.getElementById('appointmentReason').value;

    if (!doctorId || !date || !time || !reason) {
        showError('Please fill in all fields');
        return;
    }

    const doctors = {
        'D001': 'Dr. Lekhanya Zwane',
        'D002': 'Dr. Bongani Khumalo',
        'D003': 'Dr. Nalini Patel'
    };

    const appointment = {
        id: generateId(),
        patientId: patient.id,
        patientName: patient.name,
        doctorId: doctorId,
        doctorName: doctors[doctorId],
        date: date,
        time: time,
        reason: reason,
        status: 'scheduled'
    };

    appointmentsData.push(appointment);
    localStorage.setItem('appointmentsData', JSON.stringify(appointmentsData));
    
    showSuccess('Appointment booked successfully!');
    closeModal('newAppointmentModal');
    document.getElementById('appointmentForm').reset();
    displayPatientAppointments();
}

function cancelAppointment(appointmentId) {
    const index = appointmentsData.findIndex(a => a.id === appointmentId);
    if (index > -1) {
        appointmentsData[index].status = 'cancelled';
        localStorage.setItem('appointmentsData', JSON.stringify(appointmentsData));
        showSuccess('Appointment cancelled');
        displayPatientAppointments();
    }
}

function getAppointmentsByDate(date) {
    return appointmentsData.filter(a => a.date === date);
}

function getAppointmentsByDoctor(doctorId) {
    return appointmentsData.filter(a => a.doctorId === doctorId);
}

function getAppointmentStats() {
    return {
        total: appointmentsData.length,
        scheduled: appointmentsData.filter(a => a.status === 'scheduled').length,
        completed: appointmentsData.filter(a => a.status === 'completed').length,
        cancelled: appointmentsData.filter(a => a.status === 'cancelled').length
    };
}

function initAppointmentData() {
    const savedAppointments = localStorage.getItem('appointmentsData');
    if (savedAppointments) {
        appointmentsData = JSON.parse(savedAppointments);
    }
}

function updateStaffSchedule() {
    const dateInput = document.getElementById('staffDate');
    const selectedDate = dateInput.value;
    const scheduleDiv = document.getElementById('todaySchedule');
    
    if (!scheduleDiv) return;

    const dayAppointments = appointmentsData.filter(a => a.date === selectedDate);
    
    if (dayAppointments.length === 0) {
        scheduleDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <p>No appointments scheduled for this date</p>
            </div>
        `;
        return;
    }

    scheduleDiv.innerHTML = dayAppointments.map(apt => `
        <div class="schedule-item">
            <div class="schedule-time">${formatTime(apt.time)}</div>
            <div class="schedule-patient"><strong>${apt.patientName}</strong></div>
            <div class="schedule-patient">Reason: ${apt.reason}</div>
            <div class="schedule-patient" style="margin-top: 0.5rem;">
                <button class="btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="completeAppointment('${apt.id}')">Mark Complete</button>
            </div>
        </div>
    `).join('');
}

function completeAppointment(appointmentId) {
    const appointment = appointmentsData.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = 'completed';
        localStorage.setItem('appointmentsData', JSON.stringify(appointmentsData));
        showSuccess('Appointment marked as completed');
        updateStaffSchedule();
    }
}

function completeConsultation(event) {
    event.preventDefault();
    const appointmentId = document.getElementById('consultationAppointmentId').value;
    const status = document.getElementById('consultationStatus').value;
    
    const appointment = appointmentsData.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = status;
        localStorage.setItem('appointmentsData', JSON.stringify(appointmentsData));
        showSuccess('Consultation updated successfully');
        closeModal('completeConsultationModal');
        document.getElementById('consultationForm').reset();
        loadStaffDashboard();
    } else {
        showError('Appointment not found');
    }
}