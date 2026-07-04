export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  employeeId?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export interface CareerMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'promotion' | 'joining' | 'award' | 'transfer';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'HR Manager' | 'Software Engineer' | 'Product Designer' | 'QA Lead' | 'Sales Executive' | 'Marketing Lead' | 'DevOps Engineer';
  position: string;
  department: 'Engineering' | 'Design' | 'Product' | 'HR' | 'Sales' | 'Marketing';
  status: 'Active' | 'On Leave' | 'Suspended';
  joinDate: string;
  phone: string;
  location: string;
  managerName?: string;
  salary: number;
  bio?: string;
  skills: string[];
  emergencyContact: EmergencyContact;
  documents: Document[];
  timeline: CareerMilestone[];
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:MM AM/PM
  checkOut?: string; // HH:MM AM/PM
  status: 'Present' | 'Absent' | 'Half Day' | 'Leave';
  workingHours?: number;
}

export type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Study';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeRole: string;
  type: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  comments?: string;
  days: number;
  appliedDate: string;
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  available: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeRole: string;
  month: string; // e.g. "June"
  year: number;
  baseSalary: number;
  allowances: {
    housing: number;
    transport: number;
    medical: number;
  };
  deductions: {
    tax: number;
    providentFund: number;
    insurance: number;
  };
  bonus?: number;
  netSalary: number;
  status: 'Paid' | 'Processing' | 'On Hold';
  paymentDate?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  category: 'system' | 'leave' | 'attendance' | 'payroll';
}

export interface RecentActivity {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  action: string;
  target: string;
  time: string;
  type: 'leave' | 'attendance' | 'profile' | 'system';
}

export interface DepartmentStats {
  name: string;
  count: number;
  budget: number;
}
