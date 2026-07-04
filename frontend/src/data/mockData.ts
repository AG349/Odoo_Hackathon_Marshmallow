import type { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  LeaveBalance, 
  PayrollRecord, 
  SystemNotification, 
  RecentActivity,
  DepartmentStats
} from '../types';

export const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    role: 'Software Engineer',
    position: 'L3 Software Engineer',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2023-04-12',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (Hybrid)',
    managerName: 'Alex Rivera',
    salary: 115000,
    bio: 'Frontend enthusiast with 4+ years of experience building responsive web applications. Lover of clean code, motion design, and double-shot espressos.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion', 'GraphQL'],
    emergencyContact: {
      name: 'David Jenkins',
      relationship: 'Spouse',
      phone: '+1 (555) 234-5670',
      email: 'david.j@gmail.com'
    },
    documents: [
      { id: 'DOC001', name: 'Employment_Agreement.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2023-04-10' },
      { id: 'DOC002', name: 'W4_Form_2023.pdf', type: 'PDF', size: '1.1 MB', uploadedAt: '2023-04-11' },
      { id: 'DOC003', name: 'Direct_Deposit_Authorization.pdf', type: 'PDF', size: '840 KB', uploadedAt: '2023-04-12' }
    ],
    timeline: [
      { id: 'TM001', title: 'Joined Aurora Corp', date: '2023-04-12', description: 'Started as L2 Software Engineer in the Core UX Team.', category: 'joining' },
      { id: 'TM002', title: 'Outstanding Performer H1', date: '2024-06-30', description: 'Received high-performer rating for redesigning the billing dashboard.', category: 'award' },
      { id: 'TM003', title: 'Promoted to L3 Software Engineer', date: '2025-01-15', description: 'Promoted for leading the migration of the corporate portal to Next.js.', category: 'promotion' }
    ]
  },
  {
    id: 'EMP002',
    name: 'Alex Rivera',
    email: 'alex.rivera@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    role: 'HR Manager',
    position: 'Senior HR Operations Manager',
    department: 'HR',
    status: 'Active',
    joinDate: '2021-09-01',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY (On-site)',
    managerName: 'Elena Rostova (VP of People)',
    salary: 105000,
    bio: 'SHRM-certified HR professional with 8+ years of expertise in employee engagement, talent acquisition, and operations management.',
    skills: ['HR Operations', 'Conflict Resolution', 'Legal Compliance', 'Payroll Admin', 'Talent Acquisition'],
    emergencyContact: {
      name: 'Maria Rivera',
      relationship: 'Mother',
      phone: '+1 (555) 987-6540'
    },
    documents: [
      { id: 'DOC004', name: 'Contract_HR_Rivera.pdf', type: 'PDF', size: '3.1 MB', uploadedAt: '2021-08-25' }
    ],
    timeline: [
      { id: 'TM004', title: 'Joined Aurora Corp', date: '2021-09-01', description: 'Began as HR Generalist.', category: 'joining' },
      { id: 'TM005', title: 'HR Manager Promotion', date: '2023-10-01', description: 'Assumed full management of employee lifecycle events.', category: 'promotion' }
    ]
  },
  {
    id: 'EMP003',
    name: 'Elena Rostova',
    email: 'elena.r@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    role: 'HR Manager',
    position: 'VP of People Operations',
    department: 'HR',
    status: 'Active',
    joinDate: '2020-01-10',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY (On-site)',
    salary: 165000,
    skills: ['Strategic HR', 'Executive Leadership', 'Compensation Plans', 'Public Relations'],
    emergencyContact: { name: 'Mikhail Rostov', relationship: 'Father', phone: '+1 (555) 123-4560' },
    documents: [],
    timeline: []
  },
  {
    id: 'EMP004',
    name: 'Marcus Chen',
    email: 'marcus.c@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    role: 'Product Designer',
    position: 'Senior UI/UX Designer',
    department: 'Design',
    status: 'Active',
    joinDate: '2022-02-15',
    phone: '+1 (555) 345-6789',
    location: 'Los Angeles, CA (Remote)',
    managerName: 'Alex Rivera',
    salary: 120000,
    bio: 'Passionate designer mapping out intuitive and sleek digital interfaces. Specialized in visual design systems and user-centric prototyping.',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research', 'Adobe Suite'],
    emergencyContact: { name: 'Linda Chen', relationship: 'Mother', phone: '+1 (555) 345-6780' },
    documents: [],
    timeline: []
  },
  {
    id: 'EMP005',
    name: 'Emily Watson',
    email: 'emily.w@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    role: 'QA Lead',
    position: 'Lead Quality Assurance Engineer',
    department: 'Engineering',
    status: 'On Leave',
    joinDate: '2022-07-22',
    phone: '+1 (555) 456-7890',
    location: 'San Francisco, CA (Hybrid)',
    managerName: 'Alex Rivera',
    salary: 108000,
    bio: 'Busting bugs and designing rigorous test plans to ensure seamless product experiences. Automated testing enthusiast.',
    skills: ['Selenium', 'Cypress', 'Playwright', 'Jest', 'CI/CD', 'API Testing'],
    emergencyContact: { name: 'Tom Watson', relationship: 'Brother', phone: '+1 (555) 456-7899' },
    documents: [],
    timeline: []
  },
  {
    id: 'EMP006',
    name: 'David Kojo',
    email: 'david.k@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    role: 'DevOps Engineer',
    position: 'Senior Infrastructure Engineer',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2021-11-10',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, WA (Remote)',
    managerName: 'Alex Rivera',
    salary: 130000,
    bio: 'Cloud architecture expert. Keeping servers humming, scaling clusters, and building pipelines that deploy at lightspeed.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Linux'],
    emergencyContact: { name: 'Ama Kojo', relationship: 'Sister', phone: '+1 (555) 567-8900' },
    documents: [],
    timeline: []
  },
  {
    id: 'EMP007',
    name: 'Sophia Martinez',
    email: 'sophia.m@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    role: 'Sales Executive',
    position: 'Account Executive',
    department: 'Sales',
    status: 'Active',
    joinDate: '2024-01-08',
    phone: '+1 (555) 678-9012',
    location: 'Chicago, IL (Hybrid)',
    managerName: 'Robert Vance',
    salary: 85000,
    bio: 'Connecting clients with the future of HR operations. Focused on enterprise deals and custom solution designs.',
    skills: ['Enterprise Sales', 'Negotiation', 'CRM', 'Salesforce', 'Presentations'],
    emergencyContact: { name: 'Pedro Martinez', relationship: 'Father', phone: '+1 (555) 678-9010' },
    documents: [],
    timeline: []
  },
  {
    id: 'EMP008',
    name: 'Robert Vance',
    email: 'robert.v@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    role: 'Sales Executive',
    position: 'VP of Global Sales',
    department: 'Sales',
    status: 'Active',
    joinDate: '2020-05-15',
    phone: '+1 (555) 789-0123',
    location: 'Chicago, IL (On-site)',
    salary: 150000,
    skills: ['Sales Strategy', 'Partnerships', 'Leadership', 'Sales Expansion'],
    emergencyContact: { name: 'Karen Vance', relationship: 'Spouse', phone: '+1 (555) 789-0120' },
    documents: [],
    timeline: []
  },
  {
    id: 'EMP009',
    name: 'Aisha Rahman',
    email: 'aisha.r@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=150',
    role: 'Marketing Lead',
    position: 'Brand & Growth Marketing Lead',
    department: 'Marketing',
    status: 'Active',
    joinDate: '2023-08-01',
    phone: '+1 (555) 890-1234',
    location: 'Boston, MA (Remote)',
    managerName: 'Alex Rivera',
    salary: 110000,
    bio: 'Creating viral brand awareness campaigns and optimizing digital funnels to drive SaaS user adoption.',
    skills: ['Growth Hacking', 'SEO', 'PPC', 'Copywriting', 'Brand Identity', 'Product Marketing'],
    emergencyContact: { name: 'Tariq Rahman', relationship: 'Father', phone: '+1 (555) 890-1230' },
    documents: [],
    timeline: []
  },
  {
    id: 'EMP010',
    name: 'Jordan Finch',
    email: 'jordan.f@aurora.io',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    role: 'Software Engineer',
    position: 'L1 Backend Engineer',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2024-05-16',
    phone: '+1 (555) 901-2345',
    location: 'Austin, TX (Remote)',
    managerName: 'David Kojo',
    salary: 92000,
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    emergencyContact: { name: 'Gail Finch', relationship: 'Mother', phone: '+1 (555) 901-2340' },
    documents: [],
    timeline: []
  }
];

export const mockLeaveBalances: Record<string, LeaveBalance[]> = {
  'EMP001': [
    { type: 'Annual', total: 25, used: 8, available: 17 },
    { type: 'Sick', total: 10, used: 2, available: 8 },
    { type: 'Maternity', total: 90, used: 0, available: 90 },
    { type: 'Paternity', total: 15, used: 0, available: 15 },
    { type: 'Unpaid', total: 10, used: 0, available: 10 },
    { type: 'Study', total: 5, used: 1, available: 4 }
  ],
  'EMP002': [
    { type: 'Annual', total: 25, used: 15, available: 10 },
    { type: 'Sick', total: 10, used: 4, available: 6 },
    { type: 'Paternity', total: 15, used: 12, available: 3 },
    { type: 'Unpaid', total: 10, used: 2, available: 8 }
  ]
};

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR001',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'Software Engineer',
    type: 'Annual',
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    status: 'Pending',
    reason: 'Family summer trip to Hawaii. All deliverables for Sprint 14 will be handed over to Jordan Finch.',
    days: 5,
    appliedDate: '2026-07-02'
  },
  {
    id: 'LR002',
    employeeId: 'EMP004',
    employeeName: 'Marcus Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'Product Designer',
    type: 'Annual',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    status: 'Pending',
    reason: 'Attending Figma Config 2026 in San Francisco. Handing over design review files.',
    days: 5,
    appliedDate: '2026-07-03'
  },
  {
    id: 'LR003',
    employeeId: 'EMP005',
    employeeName: 'Emily Watson',
    employeeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'QA Lead',
    type: 'Sick',
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    status: 'Approved',
    reason: 'Medical wisdom tooth extraction and recovery.',
    comments: 'Approved by HR. Get well soon!',
    days: 3,
    appliedDate: '2026-06-28'
  },
  {
    id: 'LR004',
    employeeId: 'EMP007',
    employeeName: 'Sophia Martinez',
    employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'Sales Executive',
    type: 'Study',
    startDate: '2026-06-15',
    endDate: '2026-06-16',
    status: 'Approved',
    reason: 'SaaS Sales Masterclass Certification Exams.',
    comments: 'Great initiative. Approved.',
    days: 2,
    appliedDate: '2026-06-10'
  },
  {
    id: 'LR005',
    employeeId: 'EMP009',
    employeeName: 'Aisha Rahman',
    employeeAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'Marketing Lead',
    type: 'Unpaid',
    startDate: '2026-05-10',
    endDate: '2026-05-20',
    status: 'Rejected',
    reason: 'Extended personal leave for hobby photography workshop.',
    comments: 'Cannot approve due to crunch campaigns launch schedule. Please reschedule to H2.',
    days: 10,
    appliedDate: '2026-04-20'
  }
];

export const mockNotifications: SystemNotification[] = [
  {
    id: 'NF001',
    title: 'Leave Request Approved',
    description: 'Your Sick leave request for July 1st - 5th has been approved by HR.',
    time: '2 hours ago',
    read: false,
    category: 'leave'
  },
  {
    id: 'NF002',
    title: 'Payroll Generated',
    description: 'Your payslip for the month of June 2026 is now available.',
    time: '1 day ago',
    read: false,
    category: 'payroll'
  },
  {
    id: 'NF003',
    title: 'New Policy Update',
    description: 'The updated Hybrid Work Guidelines for H2 2026 have been published.',
    time: '3 days ago',
    read: true,
    category: 'system'
  },
  {
    id: 'NF004',
    title: 'Attendance Reminder',
    description: 'You missed checking out yesterday. Please update your logs.',
    time: '4 days ago',
    read: true,
    category: 'attendance'
  }
];

export const mockActivities: RecentActivity[] = [
  {
    id: 'AC001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    action: 'applied for',
    target: 'Annual Leave (5 days)',
    time: '10 mins ago',
    type: 'leave'
  },
  {
    id: 'AC002',
    employeeName: 'Marcus Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    action: 'checked in at',
    target: '08:52 AM (On-site)',
    time: '30 mins ago',
    type: 'attendance'
  },
  {
    id: 'AC003',
    employeeName: 'David Kojo',
    employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    action: 'updated',
    target: 'emergency contact info',
    time: '2 hours ago',
    type: 'profile'
  },
  {
    id: 'AC004',
    employeeName: 'Emily Watson',
    employeeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    action: 'marked status as',
    target: 'On Leave',
    time: '1 day ago',
    type: 'system'
  },
  {
    id: 'AC005',
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    action: 'approved',
    target: 'Emily Watson\'s sick leave',
    time: '1 day ago',
    type: 'leave'
  }
];

export const mockPayroll: PayrollRecord[] = [
  {
    id: 'PR001',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'Software Engineer',
    month: 'June',
    year: 2026,
    baseSalary: 9583, // 115k / 12
    allowances: { housing: 800, transport: 300, medical: 200 },
    deductions: { tax: 1850, providentFund: 480, insurance: 150 },
    bonus: 500,
    netSalary: 8903,
    status: 'Paid',
    paymentDate: '2026-06-28'
  },
  {
    id: 'PR002',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'Software Engineer',
    month: 'May',
    year: 2026,
    baseSalary: 9583,
    allowances: { housing: 800, transport: 300, medical: 200 },
    deductions: { tax: 1850, providentFund: 480, insurance: 150 },
    netSalary: 8403,
    status: 'Paid',
    paymentDate: '2026-05-28'
  },
  {
    id: 'PR003',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'Software Engineer',
    month: 'April',
    year: 2026,
    baseSalary: 9583,
    allowances: { housing: 800, transport: 300, medical: 200 },
    deductions: { tax: 1850, providentFund: 480, insurance: 150 },
    netSalary: 8403,
    status: 'Paid',
    paymentDate: '2026-04-28'
  },
  {
    id: 'PR004',
    employeeId: 'EMP002',
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'HR Manager',
    month: 'June',
    year: 2026,
    baseSalary: 8750, // 105k / 12
    allowances: { housing: 750, transport: 250, medical: 200 },
    deductions: { tax: 1620, providentFund: 430, insurance: 130 },
    bonus: 200,
    netSalary: 7970,
    status: 'Paid',
    paymentDate: '2026-06-28'
  },
  {
    id: 'PR005',
    employeeId: 'EMP004',
    employeeName: 'Marcus Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    employeeRole: 'Product Designer',
    month: 'June',
    year: 2026,
    baseSalary: 10000, // 120k / 12
    allowances: { housing: 850, transport: 350, medical: 200 },
    deductions: { tax: 1980, providentFund: 500, insurance: 150 },
    netSalary: 8770,
    status: 'Processing'
  }
];

export const mockDepartmentStats: DepartmentStats[] = [
  { name: 'Engineering', count: 4, budget: 445000 },
  { name: 'HR', count: 2, budget: 270000 },
  { name: 'Design', count: 1, budget: 120000 },
  { name: 'Sales', count: 2, budget: 235000 },
  { name: 'Marketing', count: 1, budget: 110000 }
];

export const mockAttendanceTrend = [
  { day: 'Mon', Present: 9, Absent: 1, Late: 0 },
  { day: 'Tue', Present: 8, Absent: 1, Late: 1 },
  { day: 'Wed', Present: 9, Absent: 0, Late: 1 },
  { day: 'Thu', Present: 10, Absent: 0, Late: 0 },
  { day: 'Fri', Present: 7, Absent: 2, Late: 1 }
];

export const mockEmployeeGrowth = [
  { month: 'Jan', count: 6 },
  { month: 'Feb', count: 7 },
  { month: 'Mar', count: 7 },
  { month: 'Apr', count: 8 },
  { month: 'May', count: 9 },
  { month: 'Jun', count: 10 }
];

export const mockLeaveStats = [
  { name: 'Annual', count: 12 },
  { name: 'Sick', count: 5 },
  { name: 'Maternity', count: 1 },
  { name: 'Study', count: 2 },
  { name: 'Unpaid', count: 1 }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 'AT001', employeeId: 'EMP001', date: '2026-07-03', checkIn: '08:45 AM', checkOut: '05:30 PM', status: 'Present', workingHours: 8.75 },
  { id: 'AT002', employeeId: 'EMP001', date: '2026-07-02', checkIn: '09:02 AM', checkOut: '05:15 PM', status: 'Present', workingHours: 8.21 },
  { id: 'AT003', employeeId: 'EMP001', date: '2026-07-01', checkIn: '08:50 AM', checkOut: '06:05 PM', status: 'Present', workingHours: 9.25 },
  { id: 'AT004', employeeId: 'EMP001', date: '2026-06-30', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'Present', workingHours: 8.58 },
  { id: 'AT005', employeeId: 'EMP001', date: '2026-06-29', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'Present', workingHours: 8.5 },
  { id: 'AT006', employeeId: 'EMP001', date: '2026-06-26', checkIn: '08:40 AM', checkOut: '05:00 PM', status: 'Present', workingHours: 8.33 },
  { id: 'AT007', employeeId: 'EMP001', date: '2026-06-25', checkIn: '08:45 AM', checkOut: '05:30 PM', status: 'Present', workingHours: 8.75 },
  { id: 'AT008', employeeId: 'EMP001', date: '2026-06-24', status: 'Absent' },
  { id: 'AT009', employeeId: 'EMP001', date: '2026-06-23', checkIn: '08:52 AM', checkOut: '12:45 PM', status: 'Half Day', workingHours: 3.88 },
  { id: 'AT010', employeeId: 'EMP001', date: '2026-06-22', checkIn: '09:00 AM', checkOut: '05:30 PM', status: 'Present', workingHours: 8.5 }
];
