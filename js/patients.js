/* Patient Management Functions */

let patientsData = [
    {
        id: 'P001',
        name: 'Thabo Mthembu',
        email: 'thabo@email.com',
        phone: '+268 7612 3456',
        age: 35,
        gender: 'Male',
        bloodType: 'O+',
        address: 'Mbabane, Eswatini',
        dateOfBirth: '1989-03-15',
        emergencyContact: 'Sipho Mthembu'
    },
    {
        id: 'P002',
        name: 'Nalini Singh',
        email: 'nalini@email.com',
        phone: '+268 7634 5678',
        age: 28,
        gender: 'Female',
        bloodType: 'A+',
        address: 'Manzini, Eswatini',
        dateOfBirth: '1996-07-22'
    },
    {
        id: 'P003',
        name: 'Vusi Khumalo',
        email: 'vusi@email.com',
        phone: '+268 7645 2345',
        age: 45,
        gender: 'Male',
        bloodType: 'B+',
        address: 'Ezulwini, Eswatini',
        dateOfBirth: '1979-11-08'
    },
    {
        id: 'P004',
        name: 'Mpho Ngubeni',
        email: 'mpho@email.com',
        phone: '+268 7656 7890',
        age: 32,
        gender: 'Female',
        bloodType: 'AB+',
        address: 'Mbabane, Eswatini',
        dateOfBirth: '1992-05-30'
    },
    {
        id: 'P005',
        name: 'Mandla Dlamini',
        email: 'mandla@email.com',
        phone: '+268 7667 1234',
        age: 50,
        gender: 'Male',
        bloodType: 'O-',
        address: 'Manzini, Eswatini',
        dateOfBirth: '1974-09-12'
    }
];

let medicalRecords = [
    {
        id: 'MR001',
        patientId: 'P001',
        date: '2026-08-15',
        diagnosis: 'Hypertension',
        treatment: 'Medication prescribed',
        doctor: 'Dr. Lekhanya Zwane',
        notes: 'Patient advised to reduce salt intake'
    },
    {
        id: 'MR002',
        patientId: 'P002',
        date: '2026-08-20',
        diagnosis: 'Common Cold',
        treatment: 'Rest and fluids',
        doctor: 'Dr. Bongani Khumalo',
        notes: 'Follow-up in 3 days if symptoms persist'
    },
    {
        id: 'MR003',
        patientId: 'P003',
        date: '2026-08-22',
        diagnosis: 'Diabetes Type 2',
        treatment: 'Insulin injection + diet control',
        doctor: 'Dr. Lekhanya Zwane',
        notes: 'Regular blood sugar monitoring required'
    }
];

function getCurrentPatient() {
    const patientId = localStorage.getItem('currentPatientId') || 'P001';
    return patientsData.find(p => p.id === patientId) || patientsData[0];
}

function setCurrentPatient(patientId) {
    localStorage.setItem('currentPatientId', patientId);
}

function displayPatientProfile() {
    const patient = getCurrentPatient();
    const profileDiv = document.getElementById('patientProfile');
    
    if (!profileDiv) return;

    profileDiv.innerHTML = `
        <div class="profile-item">
            <span class="profile-label">Name:</span>
            <span class="profile-value">${patient.name}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Patient ID:</span>
            <span class="profile-value">${patient.id}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Age:</span>
            <span class="profile-value">${patient.age}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Gender:</span>
            <span class="profile-value">${patient.gender}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Blood Type:</span>
            <span class="profile-value">${patient.bloodType}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Email:</span>
            <span class="profile-value">${patient.email}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Phone:</span>
            <span class="profile-value">${patient.phone}</span>
        </div>
        <div class="profile-item">
            <span class="profile-label">Address:</span>
            <span class="profile-value">${patient.address}</span>
        </div>
    `;
}

function displayPatientRecords() {
    const patient = getCurrentPatient();
    const recordsDiv = document.getElementById('myRecords');
    
    if (!recordsDiv) return;

    const patientRecords = medicalRecords.filter(r => r.patientId === patient.id);
    
    if (patientRecords.length === 0) {
        recordsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No medical records found</p>
            </div>
        `;
        return;
    }

    recordsDiv.innerHTML = patientRecords.map(record => `
        <div class="record-item">
            <div class="item-header">
                <span class="item-title">${record.diagnosis}</span>
                <span class="item-status status-completed">${formatDate(record.date)}</span>
            </div>
            <div class="item-details">
                <strong>Doctor:</strong> ${record.doctor}
            </div>
            <div class="item-details">
                <strong>Treatment:</strong> ${record.treatment}
            </div>
            <div class="item-details">
                <strong>Notes:</strong> ${record.notes}
            </div>
        </div>
    `).join('');
}

function addPatient(patientData) {
    const newPatient = {
        id: generateId(),
        ...patientData
    };
    patientsData.push(newPatient);
    localStorage.setItem('patientsData', JSON.stringify(patientsData));
    return newPatient;
}

function updatePatient(patientId, updateData) {
    const patient = patientsData.find(p => p.id === patientId);
    if (patient) {
        Object.assign(patient, updateData);
        localStorage.setItem('patientsData', JSON.stringify(patientsData));
        return true;
    }
    return false;
}

function getAllPatients() {
    return patientsData;
}

function getPatientById(patientId) {
    return patientsData.find(p => p.id === patientId);
}

function getPatientMedicalRecords(patientId) {
    return medicalRecords.filter(r => r.patientId === patientId);
}

function addMedicalRecord(patientId, recordData) {
    const newRecord = {
        id: generateId(),
        patientId: patientId,
        date: new Date().toISOString().split('T')[0],
        ...recordData
    };
    medicalRecords.push(newRecord);
    localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));
    return newRecord;
}

function searchPatients(query) {
    const searchTerm = query.toLowerCase();
    return patientsData.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.id.toLowerCase().includes(searchTerm) ||
        p.email.toLowerCase().includes(searchTerm) ||
        p.phone.includes(query)
    );
}

function getPatientStats() {
    return {
        total: patientsData.length,
        active: patientsData.length,
        new: Math.floor(patientsData.length * 0.2)
    };
}

function initPatientData() {
    const savedPatients = localStorage.getItem('patientsData');
    if (savedPatients) {
        patientsData = JSON.parse(savedPatients);
    }
    
    const savedRecords = localStorage.getItem('medicalRecords');
    if (savedRecords) {
        medicalRecords = JSON.parse(savedRecords);
    }
}

function loadPatientPortal() {
    displayPatientProfile();
    displayPatientRecords();
    displayPatientAppointments();
    displayAvailableDoctors();
    populateDoctorSelect();
}