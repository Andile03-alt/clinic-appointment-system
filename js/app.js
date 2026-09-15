/* Main Application Logic */

function loadHomePage() {
    const stats = getPatientStats();
    const appointments = getAppointmentStats();
    
    document.getElementById('patientCount').textContent = stats.total;
    document.getElementById('appointmentCount').textContent = appointments.total;
    document.getElementById('staffCount').textContent = staffData.length;
}

function loadAdminPanel() {
    // Update overview tab
    const patientStats = getPatientStats();
    const appointmentStats = getAppointmentStats();
    
    document.getElementById('adminPatientCount').textContent = patientStats.total;
    document.getElementById('adminAppointmentCount').textContent = appointmentStats.total;
    document.getElementById('adminStaffCount').textContent = staffData.length;
    
    // Update clinic info
    document.getElementById('clinicName').textContent = clinicSettings.name;
    document.getElementById('clinicPhone').textContent = clinicSettings.phone;
    document.getElementById('clinicHours').textContent = clinicSettings.hours;
    
    // Populate settings form
    document.getElementById('settingClinicName').value = clinicSettings.name;
    document.getElementById('settingClinicPhone').value = clinicSettings.phone;
    document.getElementById('settingClinicHours').value = clinicSettings.hours;
    
    // Display activity log
    displayActivityLog();
    
    // Display staff management
    displayStaffManagement();
}

function displayActivityLog() {
    const activityDiv = document.getElementById('recentActivity');
    if (!activityDiv) return;

    const activities = [
        'New appointment booked by Thabo Mthembu',
        'Patient record updated for Nalini Singh',
        'Dr. Bongani Khumalo completed 5 consultations',
        'New staff member added: Mandla Dlamini',
        'System backup completed successfully'
    ];

    activityDiv.innerHTML = activities.map(activity => `
        <div class="activity-item">• ${activity}</div>
    `).join('');
}

function switchAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tab = document.getElementById(tabName + 'Tab');
    if (tab) {
        tab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function loadAnalyticsDashboard() {
    displayAnalyticsCharts();
    displayAnalyticsMetrics();
}

function displayAnalyticsCharts() {
    const appointmentStats = getAppointmentStats();
    
    // Appointment Status Chart
    const statusCtx = document.getElementById('appointmentStatusChart');
    if (statusCtx) {
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Scheduled', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [
                        appointmentStats.scheduled,
                        appointmentStats.completed,
                        appointmentStats.cancelled
                    ],
                    backgroundColor: ['#3498db', '#27ae60', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
    
    // Patient Demographics Chart
    const demoCtx = document.getElementById('patientDemographicsChart');
    if (demoCtx) {
        new Chart(demoCtx, {
            type: 'bar',
            data: {
                labels: ['Males', 'Females'],
                datasets: [{
                    label: 'Patients',
                    data: [3, 2],
                    backgroundColor: ['#3498db', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Appointments Trend Chart
    const trendCtx = document.getElementById('appointmentTrendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Appointments',
                    data: [5, 8, 12, 10],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Staff Workload Chart
    const workloadCtx = document.getElementById('staffWorkloadChart');
    if (workloadCtx) {
        new Chart(workloadCtx, {
            type: 'bar',
            data: {
                labels: ['Dr. Zwane', 'Dr. Khumalo', 'Nurse Sipho', 'Nurse Nalini'],
                datasets: [{
                    label: 'Consultations',
                    data: [12, 8, 10, 7],
                    backgroundColor: '#27ae60'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function displayAnalyticsMetrics() {
    document.getElementById('totalConsultations').textContent = appointmentsData.length;
    document.getElementById('avgWaitTime').textContent = '15 mins';
    document.getElementById('patientSatisfaction').textContent = '92%';
    document.getElementById('noShowRate').textContent = '5%';
}

// Load home page on initial load
window.addEventListener('load', function() {
    if (!document.querySelector('.page.active')) {
        loadHomePage();
    }
});