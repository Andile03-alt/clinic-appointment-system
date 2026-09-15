/* Staff Management Functions */

let staffData = [
    {
        id: 'D001',
        name: 'Dr. Lekhanya Zwane',
        position: 'Doctor',
        email: 'lekhanya@clinic.com',
        phone: '+268 7600 1111',
        specialization: 'General Practitioner',
        available: true
    },
    {
        id: 'D002',
        name: 'Dr. Bongani Khumalo',
        position: 'Doctor',
        email: 'bongani@clinic.com',
        phone: '+268 7600 2222',
        specialization: 'Pediatrician',
        available: true
    },
    {
        id: 'N001',
        name: 'Sipho Mthembu',
        position: 'Nurse',
        email: 'sipho@clinic.com',
        phone: '+268 7600 3333',
        specialization: 'General Nursing',
        available: true
    },
    {
        id: 'N002',
        name: 'Nalini Singh',
        position: 'Nurse',
        email: 'nalini@clinic.com',
        phone: '+268 7600 4444',
        specialization: 'Maternal Health',
        available: true
    },
    {
        id: 'R001',
        name: 'Mandla Dlamini',
        position: 'Receptionist',
        email: 'mandla@clinic.com',
        phone: '+268 7600 5555',
        specialization: 'Administration',
        available: true
    }
];

let clinicSettings = {
    name: 'Central Clinic Mbabane',
    phone: '+268 2404 2000',
    hours: '8:00 AM - 5:00 PM',
    address: 'Mbabane, Eswatini'
};

function loadStaffDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('staffDate');
    if (dateInput) {
        dateInput.value = today;
    }
    updateStaffSchedule();
    displayPendingConsultations();
    displayRecentRecords();
}

function displayPendingConsultations() {
    const consultDiv = document.getElementById('pendingConsultations');
    if (!consultDiv) return;

    const pending = appointmentsData.filter(a => a.status === 'pending');
    
    if (pending.length === 0) {
        consultDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <p>No pending consultations</p>
            </div>
        `;
        return;
    }

    consultDiv.innerHTML = pending.map(apt => `
        <div class="consultation-item">
            <div class="item-header">
                <span class="item-title">${apt.patientName}</span>
                <span class="item-status status-pending">PENDING</span>
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

function displayRecentRecords() {
    const recordsDiv = document.getElementById('recentRecords');
    if (!recordsDiv) return;

    const recent = medicalRecords.slice(-3).reverse();
    
    if (recent.length === 0) {
        recordsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No recent records</p>
            </div>
        `;
        return;
    }

    recordsDiv.innerHTML = recent.map(record => `
        <div class="record-item">
            <div class="item-header">
                <span class="item-title">${record.diagnosis}</span>
                <span class="item-status status-completed">${formatDate(record.date)}</span>
            </div>
            <div class="item-details">
                <strong>Patient:</strong> ${getPatientById(record.patientId)?.name || 'Unknown'}
            </div>
            <div class="item-details">
                <strong>Doctor:</strong> ${record.doctor}
            </div>
        </div>
    `).join('');
}

function updatePatientRecord(event) {
    event.preventDefault();
    
    const patientId = document.getElementById('recordPatientId').value;
    const diagnosis = document.getElementById('recordDiagnosis').value;
    const treatment = document.getElementById('recordTreatment').value;
    const notes = document.getElementById('recordNotes').value;

    if (!patientId || !diagnosis || !treatment) {
        showError('Please fill in all required fields');
        return;
    }

    const patient = getPatientById(patientId);
    if (!patient) {
        showError('Patient not found');
        return;
    }

    addMedicalRecord(patientId, {
        diagnosis: diagnosis,
        treatment: treatment,
        doctor: 'Dr. Current',
        notes: notes
    });

    showSuccess('Patient record updated successfully');
    closeModal('updateRecordModal');
    document.getElementById('recordForm').reset();
    displayRecentRecords();
}

function addStaff(event) {
    event.preventDefault();
    
    const name = document.getElementById('staffName').value;
    const position = document.getElementById('staffPosition').value;
    const email = document.getElementById('staffEmail').value;
    const phone = document.getElementById('staffPhone').value;

    if (!name || !position || !email || !phone) {
        showError('Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError('Please enter a valid email');
        return;
    }

    if (!validatePhone(phone)) {
        showError('Please enter a valid phone number');
        return;
    }

    const newStaff = {
        id: generateId(),
        name: name,
        position: position,
        email: email,
        phone: phone,
        specialization: position,
        available: true
    };

    staffData.push(newStaff);
    localStorage.setItem('staffData', JSON.stringify(staffData));

    showSuccess('Staff member added successfully');
    closeModal('addStaffModal');
    document.getElementById('staffForm').reset();
    displayStaffManagement();
}

function displayStaffManagement() {
    const staffDiv = document.getElementById('staffManagementList');
    if (!staffDiv) return;

    staffDiv.innerHTML = staffData.map(staff => `
        <div class="staff-item">
            <div class="staff-info">
                <h4>${staff.name}</h4>
                <div class="staff-details">
                    <p><strong>Position:</strong> ${staff.position}</p>
                    <p><strong>Email:</strong> ${staff.email}</p>
                    <p><strong>Phone:</strong> ${staff.phone}</p>
                </div>
            </div>
            <div class="staff-actions">
                <button class="btn-secondary btn-small" onclick="editStaff('${staff.id}')">Edit</button>
                <button class="btn-secondary btn-small" onclick="removeStaff('${staff.id}')">Remove</button>
            </div>
        </div>
    `).join('');
}

function removeStaff(staffId) {
    if (confirm('Are you sure you want to remove this staff member?')) {
        const index = staffData.findIndex(s => s.id === staffId);
        if (index > -1) {
            staffData.splice(index, 1);
            localStorage.setItem('staffData', JSON.stringify(staffData));
            showSuccess('Staff member removed');
            displayStaffManagement();
        }
    }
}

function editStaff(staffId) {
    showSuccess('Edit functionality coming soon');
}

function initStaffData() {
    const savedStaff = localStorage.getItem('staffData');
    if (savedStaff) {
        staffData = JSON.parse(savedStaff);
    }
    
    const savedSettings = localStorage.getItem('clinicSettings');
    if (savedSettings) {
        clinicSettings = JSON.parse(savedSettings);
    }
}

function saveClinicSettings() {
    clinicSettings.name = document.getElementById('settingClinicName').value;
    clinicSettings.phone = document.getElementById('settingClinicPhone').value;
    clinicSettings.hours = document.getElementById('settingClinicHours').value;
    
    localStorage.setItem('clinicSettings', JSON.stringify(clinicSettings));
    showSuccess('Clinic settings saved successfully');
    loadAdminPanel();
}