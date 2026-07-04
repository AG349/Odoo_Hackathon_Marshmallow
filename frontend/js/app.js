// ================= FRONTEND STATE MANAGEMENT =================
const state = {
  user: null,               // Logged-in user: { id, email, role, employeeId, profile }
  view: 'dashboard',        // Active panel view ID
  viewedUserId: 'self',     // Selected user context: 'self' or a specific employee's UUID
  profiles: [],             // Cached employee profiles (HR only)
  attendance: [],           // Attendance logs for current viewedUserId
  leaves: [],               // Leave requests (all for HR, self for Employee)
  payroll: null,            // Payroll details for current viewedUserId
  stopwatchInterval: null,  // Interval ID for stopwatch tracking
  calendar: {
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  }
};

// ================= DOM TARGETS =================
const DOM = {
  authContainer: document.getElementById('auth-container'),
  appContainer: document.getElementById('app-container'),
  
  // Auth Forms
  tabLoginBtn: document.getElementById('tab-login-btn'),
  tabRegisterBtn: document.getElementById('tab-register-btn'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  loginFeedback: document.getElementById('login-feedback'),
  registerFeedback: document.getElementById('register-feedback'),
  
  // Sidebar
  userName: document.getElementById('user-name'),
  userRoleBadge: document.getElementById('user-role-badge'),
  userAvatar: document.getElementById('user-avatar'),
  navItems: document.querySelectorAll('.nav-item'),
  logoutBtn: document.getElementById('logout-btn'),
  
  // Topbar Switcher
  viewTitle: document.getElementById('view-title'),
  adminSwitcherContainer: document.getElementById('admin-switcher-container'),
  employeeSwitcher: document.getElementById('employee-switcher'),
  
  // Dashboard
  liveTime: document.getElementById('live-time'),
  liveDate: document.getElementById('live-date'),
  stopwatchDisplay: document.getElementById('stopwatch-display'),
  stopwatchTime: document.getElementById('stopwatch-time'),
  checkInBtn: document.getElementById('checkin-btn'),
  checkOutBtn: document.getElementById('checkout-btn'),
  clockingStatus: document.getElementById('clocking-status'),
  statPresent: document.getElementById('stat-present'),
  statLeaveDays: document.getElementById('stat-leave-days'),
  statPendingLeaves: document.getElementById('stat-pending-leaves'),
  statNetSalary: document.getElementById('stat-net-salary'),
  activityTimeline: document.getElementById('activity-timeline'),
  
  // Profile
  profileFullName: document.getElementById('profile-full-name'),
  profileTitle: document.getElementById('profile-title'),
  profileDept: document.getElementById('profile-dept'),
  profilePicDisplay: document.getElementById('profile-picture-display'),
  profileEditForm: document.getElementById('profile-edit-form'),
  profEmpId: document.getElementById('prof-emp-id'),
  profEmail: document.getElementById('prof-email'),
  profFirstName: document.getElementById('prof-first-name'),
  profLastName: document.getElementById('prof-last-name'),
  profJob: document.getElementById('prof-job'),
  profDeptInput: document.getElementById('prof-dept-input'),
  profPhone: document.getElementById('prof-phone'),
  profAddress: document.getElementById('prof-address'),
  profileFormFeedback: document.getElementById('profile-form-feedback'),
  
  // Profile Admin Override Fields
  profileAdminFields: document.getElementById('profile-admin-fields'),
  profAdminFirst: document.getElementById('prof-admin-first'),
  profAdminLast: document.getElementById('prof-admin-last'),
  profAdminJob: document.getElementById('prof-admin-job'),
  profAdminDept: document.getElementById('prof-admin-dept'),
  
  // Avatar Picker Modal
  avatarModal: document.getElementById('avatar-picker-modal'),
  avatarSelectorBtn: document.getElementById('avatar-selector-btn'),
  closeAvatarModal: document.getElementById('close-avatar-modal'),
  avatarSeedOpts: document.querySelectorAll('.avatar-seed-opt'),
  
  // Attendance View
  calendarMonthTitle: document.getElementById('calendar-month-title'),
  calPrevMonth: document.getElementById('cal-prev-month'),
  calNextMonth: document.getElementById('cal-next-month'),
  calendarGrid: document.getElementById('calendar-grid'),
  attendanceTableBody: document.getElementById('attendance-table-body'),
  
  // Leave Request View
  leaveRequestForm: document.getElementById('leave-request-form'),
  leaveStart: document.getElementById('leave-start'),
  leaveEnd: document.getElementById('leave-end'),
  leaveType: document.getElementById('leave-type'),
  leaveRemarks: document.getElementById('leave-remarks'),
  leaveFormFeedback: document.getElementById('leave-form-feedback'),
  leaveHistoryTitle: document.getElementById('leave-history-title'),
  leaveListContainer: document.getElementById('leave-list-container'),
  
  // Payroll View
  payBaseSalary: document.getElementById('pay-base-salary'),
  payAllowances: document.getElementById('pay-allowances'),
  payDeductions: document.getElementById('pay-deductions'),
  payNetSalary: document.getElementById('pay-net-salary'),
  payrollAdminPanel: document.getElementById('payroll-admin-panel'),
  payrollAdminForm: document.getElementById('payroll-admin-form'),
  payAdminBase: document.getElementById('pay-admin-base'),
  payAdminAllowances: document.getElementById('pay-admin-allowances'),
  payAdminDeductions: document.getElementById('pay-admin-deductions'),
  payrollFormFeedback: document.getElementById('payroll-form-feedback')
};

// ================= UTILITIES & HELPERS =================
const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,}$/;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateObjOrString) {
  const d = new Date(dateObjOrString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getLocalDateString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
}

// Display error messages underneath form inputs
function setInputError(inputId, errorMsg) {
  const errSpan = document.getElementById(`${inputId}-error`);
  if (errSpan) {
    errSpan.textContent = errorMsg;
  }
}

function clearAllErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

// ================= LIVE CLOCK & STOPWATCH =================
function initLiveClock() {
  setInterval(() => {
    const now = new Date();
    DOM.liveTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    DOM.liveDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, 1000);
}

function startStopwatch(checkInTimeStr) {
  if (state.stopwatchInterval) clearInterval(state.stopwatchInterval);
  
  DOM.stopwatchDisplay.classList.remove('hidden');
  const checkInTime = new Date(checkInTimeStr).getTime();
  
  const updateStopwatch = () => {
    const diff = Date.now() - checkInTime;
    if (diff < 0) return; // Prevent negative times if sync offset
    
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    
    DOM.stopwatchTime.textContent = `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };
  
  updateStopwatch();
  state.stopwatchInterval = setInterval(updateStopwatch, 1000);
}

function stopStopwatch() {
  if (state.stopwatchInterval) {
    clearInterval(state.stopwatchInterval);
    state.stopwatchInterval = null;
  }
  DOM.stopwatchDisplay.classList.add('hidden');
}

// ================= REAL-TIME PASSWORD STRENGTH CHECKS =================
const regPassInput = document.getElementById('reg-password');
if (regPassInput) {
  regPassInput.addEventListener('input', () => {
    const p = regPassInput.value;
    
    // Check lengths
    const lenValid = p.length >= 8;
    const upValid = /[A-Z]/.test(p);
    const lowValid = /[a-z]/.test(p);
    const numValid = /\d/.test(p);
    const specValid = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p);
    
    updateRequirementTag('req-len', lenValid);
    updateRequirementTag('req-up', upValid);
    updateRequirementTag('req-low', lowValid);
    updateRequirementTag('req-num', numValid);
    updateRequirementTag('req-spec', specValid);
  });
}

function updateRequirementTag(elemId, isValid) {
  const el = document.getElementById(elemId);
  if (el) {
    if (isValid) {
      el.classList.add('valid');
    } else {
      el.classList.remove('valid');
    }
  }
}

// ================= LOGIN / REGISTER TABS =================
DOM.tabLoginBtn.addEventListener('click', () => {
  DOM.tabLoginBtn.classList.add('active');
  DOM.tabRegisterBtn.classList.remove('active');
  DOM.loginForm.classList.add('active');
  DOM.registerForm.classList.remove('active');
  clearAllErrors();
});

DOM.tabRegisterBtn.addEventListener('click', () => {
  DOM.tabRegisterBtn.classList.add('active');
  DOM.tabLoginBtn.classList.remove('active');
  DOM.registerForm.classList.add('active');
  DOM.loginForm.classList.remove('active');
  clearAllErrors();
});

// ================= API FETCH GATEWAY =================
async function apiCall(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Server error occurred.');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${url}]:`, error);
    throw error;
  }
}

// ================= SESSION ROUTINE =================
async function checkSession() {
  try {
    const data = await apiCall('/api/auth/me');
    state.user = data.user;
    initDashboardLayout();
  } catch (err) {
    // Session expired or missing - display auth form
    DOM.authContainer.classList.remove('hidden');
    DOM.appContainer.classList.add('hidden');
  }
}

// ================= INITIALIZE LOGGED-IN SYSTEM =================
async function initDashboardLayout() {
  DOM.authContainer.classList.add('hidden');
  DOM.appContainer.classList.remove('hidden');
  
  // Render User Card Badge
  DOM.userName.textContent = `${state.user.profile.firstName} ${state.user.profile.lastName}`;
  DOM.userRoleBadge.textContent = state.user.role;
  DOM.userRoleBadge.className = `role-badge ${state.user.role.toLowerCase()}`;
  
  const avatarSeed = state.user.profile.profilePicture || state.user.profile.firstName;
  DOM.userAvatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;
  DOM.profilePicDisplay.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

  // Configure HR Controls
  if (state.user.role === 'HR') {
    DOM.adminSwitcherContainer.classList.remove('hidden');
    DOM.profileAdminFields.classList.remove('hidden');
    DOM.payrollAdminPanel.classList.remove('hidden');
    
    // Enable input fields for Admin profile editing
    DOM.profFirstName.removeAttribute('disabled');
    DOM.profLastName.removeAttribute('disabled');
    DOM.profJob.removeAttribute('disabled');
    DOM.profDeptInput.removeAttribute('disabled');
    
    await loadEmployeeSwitcher();
  } else {
    DOM.adminSwitcherContainer.classList.add('hidden');
    DOM.profileAdminFields.classList.add('hidden');
    DOM.payrollAdminPanel.classList.add('hidden');
    
    DOM.profFirstName.setAttribute('disabled', 'true');
    DOM.profLastName.setAttribute('disabled', 'true');
    DOM.profJob.setAttribute('disabled', 'true');
    DOM.profDeptInput.setAttribute('disabled', 'true');
  }

  // Pre-fill profile forms
  fillProfileDetails(state.user.profile, state.user.email, state.user.employeeId);

  // Trigger main data load
  await refreshActiveViewData();
}

// Fill profile inputs
function fillProfileDetails(profile, email, employeeId) {
  DOM.profileFullName.textContent = `${profile.firstName} ${profile.lastName}`;
  DOM.profileTitle.textContent = profile.jobTitle;
  DOM.profileDept.textContent = profile.department;
  
  DOM.profEmpId.value = employeeId;
  DOM.profEmail.value = email;
  DOM.profFirstName.value = profile.firstName;
  DOM.profLastName.value = profile.lastName;
  DOM.profJob.value = profile.jobTitle;
  DOM.profDeptInput.value = profile.department;
  DOM.profPhone.value = profile.phone || '';
  DOM.profAddress.value = profile.address || '';

  // HR admin fields values
  if (state.user.role === 'HR') {
    DOM.profAdminFirst.value = profile.firstName;
    DOM.profAdminLast.value = profile.lastName;
    DOM.profAdminJob.value = profile.jobTitle;
    DOM.profAdminDept.value = profile.department;
  }
}

// HR Only: Load Dropdown Employee Switcher
async function loadEmployeeSwitcher() {
  try {
    const list = await apiCall('/api/profile/all');
    state.profiles = list;
    
    // Clear other options except self
    DOM.employeeSwitcher.innerHTML = '<option value="self">Self (Logged-In User)</option>';
    
    list.forEach(emp => {
      if (emp.id !== state.user.id) {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `${emp.profile.firstName} ${emp.profile.lastName} (${emp.employeeId})`;
        DOM.employeeSwitcher.appendChild(opt);
      }
    });
  } catch (error) {
    console.error('Failed to load switcher:', error);
  }
}

// ================= EMPLOYEE VIEW SWITCHING =================
DOM.employeeSwitcher.addEventListener('change', async () => {
  state.viewedUserId = DOM.employeeSwitcher.value;
  await refreshActiveViewData();
});

// ================= NAVIGATION HANDLERS =================
DOM.navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    DOM.navItems.forEach(n => n.classList.remove('active'));
    btn.classList.add('active');
    
    const viewName = btn.getAttribute('data-view');
    state.view = viewName;
    
    // Toggle view panels
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`view-${viewName}`).classList.add('active');
    
    // Update Title
    DOM.viewTitle.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
    
    refreshActiveViewData();
  });
});

// Refresh view data depending on selected user
async function refreshActiveViewData() {
  // Clear stopwatch interval if we navigate away from dashboard
  if (state.view !== 'dashboard') {
    // Keep it ticking but don't show the timer updates if not on screen
  }

  const queryUser = state.viewedUserId === 'self' ? state.user.id : state.viewedUserId;

  try {
    switch (state.view) {
      case 'dashboard':
        await loadDashboardData(queryUser);
        break;
      case 'profile':
        await loadProfileData(queryUser);
        break;
      case 'attendance':
        await loadAttendanceData(queryUser);
        break;
      case 'leave':
        await loadLeaveData(queryUser);
        break;
      case 'payroll':
        await loadPayrollData(queryUser);
        break;
    }
  } catch (error) {
    console.error("View Refresh Error:", error);
  }
}

// ================= DATA LOADER ACTIONS =================

// 1. DASHBOARD LOADER
async function loadDashboardData(userId) {
  // Fetch viewed user's attendance records to compute present counts
  const attendance = await apiCall(`/api/attendance?userId=${userId}`);
  state.attendance = attendance;
  
  // Fetch leaves
  const leaves = await apiCall('/api/leaves');
  state.leaves = leaves;

  // Filter leaves for this specific user
  const userLeaves = state.user.role === 'HR' && state.viewedUserId !== 'self'
    ? leaves.filter(l => l.userId === userId)
    : leaves.filter(l => l.userId === state.user.id);
  
  // Calculate Stats
  const currentMonth = new Date().getMonth();
  const presentDays = attendance.filter(r => new Date(r.date).getMonth() === currentMonth && (r.status === 'PRESENT' || r.status === 'HALF_DAY')).length;
  const leaveDays = attendance.filter(r => r.status === 'LEAVE').length;
  const pendingLeaves = userLeaves.filter(r => r.status === 'PENDING').length;
  
  // Fetch payroll for stats
  let salaryText = "$0.00";
  try {
    const payroll = await apiCall(`/api/payroll?userId=${userId === state.user.id ? '' : userId}`);
    salaryText = formatCurrency(payroll.netSalary || payroll.baseSalary);
  } catch (e) {
    console.error("Failed to load payroll for dashboard stats", e);
  }

  DOM.statPresent.textContent = presentDays;
  DOM.statLeaveDays.textContent = leaveDays;
  DOM.statPendingLeaves.textContent = pendingLeaves;
  DOM.statNetSalary.textContent = salaryText;

  // Setup Clocking Panel
  const todayStr = getLocalDateString();
  const todayRecord = attendance.find(r => getLocalDateString(new Date(r.date)) === todayStr);

  if (!todayRecord) {
    DOM.checkInBtn.removeAttribute('disabled');
    DOM.checkOutBtn.setAttribute('disabled', 'true');
    DOM.clockingStatus.textContent = "Not Checked In";
    DOM.clockingStatus.className = "clock-status-tag";
    stopStopwatch();
  } else if (todayRecord.checkIn && !todayRecord.checkOut) {
    DOM.checkInBtn.setAttribute('disabled', 'true');
    DOM.checkOutBtn.removeAttribute('disabled');
    DOM.clockingStatus.textContent = `Checked In at ${new Date(todayRecord.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    DOM.clockingStatus.className = "clock-status-tag success";
    startStopwatch(todayRecord.checkIn);
  } else {
    DOM.checkInBtn.setAttribute('disabled', 'true');
    DOM.checkOutBtn.setAttribute('disabled', 'true');
    DOM.clockingStatus.textContent = `Shift ended. Time: ${formatDate(todayRecord.date)}`;
    DOM.clockingStatus.className = "clock-status-tag";
    stopStopwatch();
  }

  // Populate Activity Timeline (mocking system updates from leaves and attendance)
  DOM.activityTimeline.innerHTML = '';
  
  const timelineEvents = [];
  
  attendance.slice(0, 5).forEach(r => {
    const checkInStr = r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
    const desc = r.status === 'LEAVE' ? `On Approved Time-Off` : `Clocked in at ${checkInStr} (${r.status})`;
    timelineEvents.push({
      date: new Date(r.date),
      time: 'Attendance',
      desc
    });
  });

  userLeaves.slice(0, 5).forEach(l => {
    timelineEvents.push({
      date: new Date(l.createdAt || l.startDate),
      time: 'Request',
      desc: `Leave request of category ${l.leaveType} is ${l.status.toLowerCase()}`
    });
  });

  // Sort events
  timelineEvents.sort((a, b) => b.date - a.date);

  if (timelineEvents.length === 0) {
    DOM.activityTimeline.innerHTML = '<div class="timeline-empty">No recent activity logged.</div>';
  } else {
    timelineEvents.slice(0, 5).forEach(ev => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-time">${ev.time}</div>
        <div class="timeline-desc">${ev.desc}</div>
      `;
      DOM.activityTimeline.appendChild(item);
    });
  }
}

// 2. PROFILE LOADER
async function loadProfileData(userId) {
  const profile = await apiCall(`/api/profile/${userId}`);
  
  let targetUserEmail = state.user.email;
  let targetUserEmpId = state.user.employeeId;
  
  if (userId !== state.user.id) {
    const matchedProfile = state.profiles.find(p => p.id === userId);
    if (matchedProfile) {
      targetUserEmail = matchedProfile.email;
      targetUserEmpId = matchedProfile.employeeId;
    }
  }

  fillProfileDetails(profile, targetUserEmail, targetUserEmpId);
}

// 3. ATTENDANCE LOADER
async function loadAttendanceData(userId) {
  const attendance = await apiCall(`/api/attendance?userId=${userId}`);
  state.attendance = attendance;
  
  renderCalendarGrid();
  renderAttendanceTable();
}

// 4. LEAVE LOADER
async function loadLeaveData(userId) {
  const leaves = await apiCall('/api/leaves');
  state.leaves = leaves;

  DOM.leaveListContainer.innerHTML = '';

  let filteredLeaves = leaves;
  if (state.user.role === 'HR') {
    DOM.leaveHistoryTitle.textContent = "All Employee Leave Applications";
    if (state.viewedUserId !== 'self') {
      filteredLeaves = leaves.filter(l => l.userId === userId);
    }
  } else {
    DOM.leaveHistoryTitle.textContent = "My Leave History";
    filteredLeaves = leaves.filter(l => l.userId === state.user.id);
  }

  if (filteredLeaves.length === 0) {
    DOM.leaveListContainer.innerHTML = '<div class="leave-empty">No leave requests found.</div>';
    return;
  }

  filteredLeaves.forEach(req => {
    const card = document.createElement('div');
    card.className = 'leave-item-card';

    const applicantName = req.user ? `${req.user.profile.firstName} ${req.user.profile.lastName}` : 'Self';
    const statusClass = req.status.toLowerCase();
    
    let adminCommentHtml = '';
    if (req.adminComment) {
      adminCommentHtml = `<div class="leave-admin-comments"><strong>HR Feedback:</strong> ${req.adminComment}</div>`;
    }

    let approvalBlockHtml = '';
    // Show approval actions to HR admin only if status is PENDING and it is not self's leave request
    if (state.user.role === 'HR' && req.status === 'PENDING' && req.userId !== state.user.id) {
      approvalBlockHtml = `
        <div class="leave-actions-block">
          <textarea id="comment-${req.id}" placeholder="Provide HR justification comment (optional)..."></textarea>
          <div class="action-buttons-row">
            <button class="btn-action success" onclick="handleLeaveApproval('${req.id}', 'APPROVED')">Approve</button>
            <button class="btn-action danger" onclick="handleLeaveApproval('${req.id}', 'REJECTED')">Reject</button>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="leave-item-header">
        <h4>${applicantName} — ${req.leaveType}</h4>
        <span class="status-pill ${statusClass}">${req.status}</span>
      </div>
      <div class="leave-item-dates">
        📅 ${formatDate(req.startDate)} to ${formatDate(req.endDate)}
      </div>
      ${req.remarks ? `<div class="leave-item-remarks">${req.remarks}</div>` : ''}
      ${adminCommentHtml}
      ${approvalBlockHtml}
    `;

    DOM.leaveListContainer.appendChild(card);
  });
}

// Global approval click dispatcher
window.handleLeaveApproval = async function (requestId, status) {
  const commentBox = document.getElementById(`comment-${requestId}`);
  const adminComment = commentBox ? commentBox.value : '';

  try {
    const res = await apiCall(`/api/leaves/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminComment })
    });
    alert(res.message);
    await loadLeaveData(state.viewedUserId === 'self' ? state.user.id : state.viewedUserId);
  } catch (error) {
    alert(error.message);
  }
};

// 5. PAYROLL LOADER
async function loadPayrollData(userId) {
  const queryParam = userId === state.user.id ? '' : `?userId=${userId}`;
  const payroll = await apiCall(`/api/payroll${queryParam}`);
  state.payroll = payroll;

  DOM.payBaseSalary.textContent = formatCurrency(payroll.baseSalary);
  DOM.payAllowances.textContent = `+${formatCurrency(payroll.allowances)}`;
  DOM.payDeductions.textContent = `-${formatCurrency(payroll.deductions)}`;
  DOM.payNetSalary.textContent = formatCurrency(payroll.netSalary);

  if (state.user.role === 'HR') {
    DOM.payAdminBase.value = payroll.baseSalary;
    DOM.payAdminAllowances.value = payroll.allowances;
    DOM.payAdminDeductions.value = payroll.deductions;
  }
}

// ================= CALENDAR UI RENDERING ENGINE =================
function renderCalendarGrid() {
  const year = state.calendar.year;
  const month = state.calendar.month;

  // Month names array
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  DOM.calendarMonthTitle.textContent = `${months[month]} ${year}`;

  DOM.calendarGrid.innerHTML = '';

  // Render headers
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(d => {
    const el = document.createElement('div');
    el.className = 'calendar-day-header';
    el.textContent = d;
    DOM.calendarGrid.appendChild(el);
  });

  // Calculate days mapping
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDayDate = new Date(year, month + 1, 0).getDate();
  const prevLastDayDate = new Date(year, month, 0).getDate();

  // Create grid cells
  // A. Previous month padding cells
  for (let i = firstDayIndex; i > 0; i--) {
    const day = prevLastDayDate - i + 1;
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.innerHTML = `<span>${day}</span>`;
    DOM.calendarGrid.appendChild(cell);
  }

  // B. Current month active cells
  const todayStr = getLocalDateString();
  for (let day = 1; day <= lastDayDate; day++) {
    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cellDate = new Date(cellDateStr);
    
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    
    // Check if cell corresponds to today
    if (cellDateStr === todayStr) {
      cell.classList.add('today');
    }

    cell.innerHTML = `<span>${day}</span>`;

    // Map matched attendance records
    const record = state.attendance.find(r => getLocalDateString(new Date(r.date)) === cellDateStr);
    if (record) {
      const statusClass = `status-${record.status.toLowerCase().replace('_', '-')}`;
      cell.classList.add(statusClass);
      
      const indicator = document.createElement('span');
      indicator.className = 'status-indicator';
      cell.appendChild(indicator);

      // Tooltip/Click interaction: Show times logged on dates
      cell.title = `Status: ${record.status}${record.checkIn ? `\nIn: ${new Date(record.checkIn).toLocaleTimeString()}` : ''}${record.checkOut ? `\nOut: ${new Date(record.checkOut).toLocaleTimeString()}` : ''}`;
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', () => {
        alert(
          `Date: ${formatDate(cellDateStr)}\n` +
          `Status: ${record.status}\n` +
          `Check In: ${record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}\n` +
          `Check Out: ${record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}`
        );
      });
    }

    DOM.calendarGrid.appendChild(cell);
  }

  // C. Next month padding cells
  const totalCells = DOM.calendarGrid.children.length - 7; // subtract header row
  const remainingCells = 42 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.innerHTML = `<span>${i}</span>`;
    DOM.calendarGrid.appendChild(cell);
  }
}

// Calendar Navigation
DOM.calPrevMonth.addEventListener('click', () => {
  state.calendar.month--;
  if (state.calendar.month < 0) {
    state.calendar.month = 11;
    state.calendar.year--;
  }
  renderCalendarGrid();
});

DOM.calNextMonth.addEventListener('click', () => {
  state.calendar.month++;
  if (state.calendar.month > 11) {
    state.calendar.month = 0;
    state.calendar.year++;
  }
  renderCalendarGrid();
});

// Render Attendance table records
function renderAttendanceTable() {
  DOM.attendanceTableBody.innerHTML = '';

  if (state.attendance.length === 0) {
    DOM.attendanceTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">No attendance records found for this period.</td>
      </tr>
    `;
    return;
  }

  state.attendance.forEach(rec => {
    const tr = document.createElement('tr');
    
    const checkInTime = rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
    const checkOutTime = rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
    
    const statusClass = rec.status.toLowerCase().replace('_', '-');

    tr.innerHTML = `
      <td>${formatDate(rec.date)}</td>
      <td>${checkInTime}</td>
      <td>${checkOutTime}</td>
      <td><span class="status-pill ${statusClass}">${rec.status}</span></td>
    `;
    DOM.attendanceTableBody.appendChild(tr);
  });
}

// ================= CLOCK IN & OUT INTERACTIONS =================
DOM.checkInBtn.addEventListener('click', async () => {
  try {
    const res = await apiCall('/api/attendance/checkin', { method: 'POST' });
    alert(res.message);
    await refreshActiveViewData();
  } catch (error) {
    alert(error.message);
  }
});

DOM.checkOutBtn.addEventListener('click', async () => {
  try {
    const res = await apiCall('/api/attendance/checkout', { method: 'POST' });
    alert(res.message);
    await refreshActiveViewData();
  } catch (error) {
    alert(error.message);
  }
});

// ================= FORM SUBMISSION HANDLERS =================

// 1. SIGN IN SUBMISSION
DOM.loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllErrors();
  DOM.loginFeedback.className = 'auth-feedback';
  DOM.loginFeedback.textContent = '';

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Client side validation
  let hasErrors = false;
  if (!email || !RFC5322_EMAIL_REGEX.test(email)) {
    setInputError('login-email', 'Please enter a valid email address.');
    hasErrors = true;
  }
  if (!password) {
    setInputError('login-password', 'Password is required.');
    hasErrors = true;
  }
  if (hasErrors) return;

  DOM.loginForm.querySelector('.auth-submit-btn').classList.add('loading');

  try {
    const res = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    DOM.loginFeedback.className = 'auth-feedback success';
    DOM.loginFeedback.textContent = res.message;
    state.user = res.user;
    
    setTimeout(() => {
      DOM.loginForm.querySelector('.auth-submit-btn').classList.remove('loading');
      initDashboardLayout();
    }, 800);
  } catch (error) {
    DOM.loginForm.querySelector('.auth-submit-btn').classList.remove('loading');
    DOM.loginFeedback.className = 'auth-feedback error';
    DOM.loginFeedback.textContent = error.message;
  }
});

// 2. SIGN UP SUBMISSION
DOM.registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllErrors();
  DOM.registerFeedback.className = 'auth-feedback';
  DOM.registerFeedback.textContent = '';

  const employeeId = document.getElementById('reg-emp-id').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;

  let hasErrors = false;
  if (!employeeId) {
    setInputError('reg-emp-id', 'Employee ID is required.');
    hasErrors = true;
  }
  if (!email || !RFC5322_EMAIL_REGEX.test(email)) {
    setInputError('reg-email', 'Entered email is invalid. Must match RFC 5322 regex.');
    hasErrors = true;
  }
  if (!password || !PASSWORD_REGEX.test(password)) {
    setInputError('reg-password', 'Password requirements not met.');
    hasErrors = true;
  }
  if (hasErrors) return;

  DOM.registerForm.querySelector('.auth-submit-btn').classList.add('loading');

  try {
    const res = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ employeeId, email, password, role })
    });
    DOM.registerFeedback.className = 'auth-feedback success';
    DOM.registerFeedback.textContent = res.message;

    // Reset Form
    DOM.registerForm.reset();
    updateRequirementTag('req-len', false);
    updateRequirementTag('req-up', false);
    updateRequirementTag('req-low', false);
    updateRequirementTag('req-num', false);
    updateRequirementTag('req-spec', false);

    setTimeout(() => {
      DOM.registerForm.querySelector('.auth-submit-btn').classList.remove('loading');
      DOM.tabLoginBtn.click(); // Switch to login screen
    }, 2500);
  } catch (error) {
    DOM.registerForm.querySelector('.auth-submit-btn').classList.remove('loading');
    DOM.registerFeedback.className = 'auth-feedback error';
    DOM.registerFeedback.textContent = error.message;
  }
});

// 3. EDIT PROFILE SUBMISSION
DOM.profileEditForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  DOM.profileFormFeedback.className = 'form-feedback';
  DOM.profileFormFeedback.textContent = '';

  const queryUser = state.viewedUserId === 'self' ? state.user.id : state.viewedUserId;
  const payload = {
    address: DOM.profAddress.value.trim(),
    phone: DOM.profPhone.value.trim()
  };

  // If viewing self's avatar (or updating profile picture seed)
  // Let's check avatar picker updates

  // HR Admin override fields
  if (state.user.role === 'HR') {
    payload.firstName = DOM.profAdminFirst.value.trim();
    payload.lastName = DOM.profAdminLast.value.trim();
    payload.jobTitle = DOM.profAdminJob.value.trim();
    payload.department = DOM.profAdminDept.value.trim();
    
    if (!payload.firstName || !payload.lastName || !payload.jobTitle || !payload.department) {
      DOM.profileFormFeedback.className = 'form-feedback error';
      DOM.profileFormFeedback.textContent = 'Override details must not be empty.';
      return;
    }
  }

  try {
    const url = state.viewedUserId === 'self' ? '/api/profile' : `/api/profile/${queryUser}`;
    const res = await apiCall(url, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    DOM.profileFormFeedback.className = 'form-feedback success';
    DOM.profileFormFeedback.textContent = res.message;
    
    // Sync current session state if we updated self
    if (state.viewedUserId === 'self') {
      state.user.profile = res.profile;
      DOM.userName.textContent = `${res.profile.firstName} ${res.profile.lastName}`;
      DOM.profileFullName.textContent = `${res.profile.firstName} ${res.profile.lastName}`;
      DOM.profileTitle.textContent = res.profile.jobTitle;
      DOM.profileDept.textContent = res.profile.department;
    }

    if (state.user.role === 'HR') {
      await loadEmployeeSwitcher();
    }
  } catch (error) {
    DOM.profileFormFeedback.className = 'form-feedback error';
    DOM.profileFormFeedback.textContent = error.message;
  }
});

// 4. APPLY FOR LEAVE SUBMISSION
DOM.leaveRequestForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  DOM.leaveFormFeedback.className = 'form-feedback';
  DOM.leaveFormFeedback.textContent = '';

  const payload = {
    leaveType: DOM.leaveType.value,
    startDate: DOM.leaveStart.value,
    endDate: DOM.leaveEnd.value,
    remarks: DOM.leaveRemarks.value.trim()
  };

  if (!payload.startDate || !payload.endDate) {
    DOM.leaveFormFeedback.className = 'form-feedback error';
    DOM.leaveFormFeedback.textContent = "Start and End dates are required.";
    return;
  }

  try {
    const res = await apiCall('/api/leaves', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    DOM.leaveFormFeedback.className = 'form-feedback success';
    DOM.leaveFormFeedback.textContent = res.message;
    DOM.leaveRequestForm.reset();
    
    // Refresh leave table
    await loadLeaveData(state.viewedUserId === 'self' ? state.user.id : state.viewedUserId);
  } catch (error) {
    DOM.leaveFormFeedback.className = 'form-feedback error';
    DOM.leaveFormFeedback.textContent = error.message;
  }
});

// 5. UPDATE COMPENSATION SUBMISSION (HR ONLY)
DOM.payrollAdminForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  DOM.payrollFormFeedback.className = 'form-feedback';
  DOM.payrollFormFeedback.textContent = '';

  const queryUser = state.viewedUserId === 'self' ? state.user.id : state.viewedUserId;

  const payload = {
    baseSalary: DOM.payAdminBase.value,
    allowances: DOM.payAdminAllowances.value,
    deductions: DOM.payAdminDeductions.value
  };

  try {
    const res = await apiCall(`/api/payroll/${queryUser}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    DOM.payrollFormFeedback.className = 'form-feedback success';
    DOM.payrollFormFeedback.textContent = res.message;
    
    // Refresh salary cards
    await loadPayrollData(queryUser);
  } catch (error) {
    DOM.payrollFormFeedback.className = 'form-feedback error';
    DOM.payrollFormFeedback.textContent = error.message;
  }
});

// ================= AVATAR SELECTOR MODAL ROUTINES =================
DOM.avatarSelectorBtn.addEventListener('click', () => {
  if (state.viewedUserId !== 'self') return; // Profile pic seed is updateable for self only
  DOM.avatarModal.classList.remove('hidden');
});

DOM.closeAvatarModal.addEventListener('click', () => {
  DOM.avatarModal.classList.add('hidden');
});

DOM.avatarSeedOpts.forEach(img => {
  img.addEventListener('click', async () => {
    DOM.avatarSeedOpts.forEach(o => o.classList.remove('selected'));
    img.classList.add('selected');

    const seed = img.getAttribute('data-seed');
    
    try {
      const res = await apiCall('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ profilePicture: seed })
      });
      
      // Update local state and DOM elements
      state.user.profile = res.profile;
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
      DOM.userAvatar.src = avatarUrl;
      DOM.profilePicDisplay.src = avatarUrl;
      
      DOM.avatarModal.classList.add('hidden');
    } catch (error) {
      alert("Failed to update profile avatar: " + error.message);
    }
  });
});

// ================= LOGOUT ACTION =================
DOM.logoutBtn.addEventListener('click', async () => {
  try {
    await apiCall('/api/auth/logout', { method: 'POST' });
    stopStopwatch();
    state.user = null;
    DOM.authContainer.classList.remove('hidden');
    DOM.appContainer.classList.add('hidden');
    DOM.loginForm.reset();
  } catch (error) {
    console.error("Logout failed:", error);
  }
});

// ================= INITIALIZATION ENTRY POINT =================
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  checkSession();

  // If redirected with verification success query param, pre-fill login feedback
  const params = new URLSearchParams(window.location.search);
  if (params.get('verified') === 'true') {
    DOM.loginFeedback.className = 'auth-feedback success';
    DOM.loginFeedback.textContent = "Email verified successfully! You can now log in.";
  }
});
