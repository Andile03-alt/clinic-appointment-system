/* Utility Functions */

// Language translations
const translations = {
    en: {
        home: "Home",
        patientPortal: "Patient Portal",
        staffDashboard: "Staff Dashboard",
        adminPanel: "Admin Panel",
        analytics: "Analytics",
        bookAppointment: "Book Appointment",
        myAppointments: "My Appointments",
        myRecords: "My Medical Records",
        myProfile: "My Profile",
        availableDoctors: "Available Doctors",
        todaySchedule: "Today's Schedule",
        pendingConsultations: "Pending Consultations",
        recentRecords: "Recent Patient Records",
        noData: "No data available"
    },
    ss: {
        home: "Ekhaya",
        patientPortal: "Ikheyidi Lekulinda",
        staffDashboard: "I-Dashboard Yebantfu",
        adminPanel: "Iphaneli Likaholi",
        analytics: "Ucwaningo Lwenombolo",
        bookAppointment: "Buka Umkhuluva",
        myAppointments: "Imikhuluva Yami",
        myRecords: "Irekhodhi Yentfucane Yami",
        myProfile: "Umprofayili Wami",
        availableDoctors: "Amadokotela Abile",
        todaySchedule: "Sikhelo Somhlalha",
        pendingConsultations: "Kukhutshwe Lokukhuluma",
        recentRecords: "Irekhodhi Yamakuhle Emacakile",
        noData: "Ayikho imininingwane"
    }
};

let currentLanguage = 'en';

// Change language
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
}

// Update UI language
function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            el.textContent = translations[currentLanguage][key];
        }
    });
}

// Theme Management
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton();
}

function updateThemeButton() {
    const btn = document.querySelector('.theme-toggle');
    const isDark = document.body.classList.contains('dark-theme');
    btn.textContent = isDark ? '☀️' : '🌙';
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateThemeButton();
}

// Initialize language
function initLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        currentLanguage = savedLang;
        document.getElementById('languageSelect').value = savedLang;
    }
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Navigation
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    const selectedPage = document.getElementById(page);
    if (selectedPage) {
        selectedPage.classList.add('active');
        window.scrollTo(0, 0);
        
        if (page === 'patient') {
            loadPatientPortal();
        } else if (page === 'staff') {
            loadStaffDashboard();
        } else if (page === 'admin') {
            loadAdminPanel();
        } else if (page === 'analytics') {
            loadAnalyticsDashboard();
        } else if (page === 'home') {
            loadHomePage();
        }
    }
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Format time
function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Generate unique ID
function generateId() {
    return 'ID_' + Math.random().toString(36).substr(2, 9);
}

// Get status badge color
function getStatusColor(status) {
    const statusMap = {
        'scheduled': 'status-scheduled',
        'completed': 'status-completed',
        'pending': 'status-pending',
        'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
}

// Show success message
function showSuccess(message) {
    alert('✅ ' + message);
}

// Show error message
function showError(message) {
    alert('❌ ' + message);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initLanguage();
    initPatientData();
    initStaffData();
    initAppointmentData();
    loadHomePage();
    
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});