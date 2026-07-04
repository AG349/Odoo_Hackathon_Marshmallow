import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog } from '../../components/ui/Dialog';
import { useToast } from '../../context/ToastContext';
import { mockEmployees } from '../../data/mockData';
import type { Employee } from '../../types';
import { 
  Search, 
  LayoutGrid, 
  List, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';

export const EmployeeDirectory: React.FC = () => {
  const { toast } = useToast();
  
  // States
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [viewType, setViewType] = useState<'grid' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Employee Form States
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Employee['role']>('Software Engineer');
  const [newDept, setNewDept] = useState<Employee['department']>('Engineering');
  const [newSalary, setNewSalary] = useState('');

  const itemsPerPage = 5;

  const departments = ['All', 'Engineering', 'Design', 'Product', 'HR', 'Sales', 'Marketing'];

  // Filtering and Searching
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                            emp.email.toLowerCase().includes(search.toLowerCase()) ||
                            emp.position.toLowerCase().includes(search.toLowerCase());
      
      const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
      
      return matchesSearch && matchesDept;
    });
  }, [employees, search, deptFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newSalary) {
      toast('Input Required', 'Please fill in name, email, and salary fields.', 'warning');
      return;
    }

    const newEmp: Employee = {
      id: `EMP0${employees.length + 1}`,
      name: newName,
      email: newEmail,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=150`,
      role: newRole,
      position: newRole,
      department: newDept,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      phone: '+1 (555) 000-0000',
      location: 'San Francisco, CA (Hybrid)',
      salary: Number(newSalary),
      skills: ['HTML', 'JavaScript'],
      emergencyContact: { name: 'Emergency Contact', relationship: 'Guardian', phone: '911' },
      documents: [],
      timeline: []
    };

    setEmployees(prev => [newEmp, ...prev]);
    toast('Employee Added', `${newName} has been onboarded successfully.`, 'success');
    setIsAddOpen(false);
    
    // Clear form
    setNewName('');
    setNewEmail('');
    setNewSalary('');
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Employee Directory</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage, search, and audit your core workforce directory.</p>
        </div>
        
        <Button 
          variant="primary" 
          className="flex items-center gap-2 text-xs font-bold rounded-xl"
          onClick={() => setIsAddOpen(true)}
        >
          <UserPlus className="h-4.5 w-4.5" />
          <span>Onboard Employee</span>
        </Button>
      </div>

      {/* Filter and search toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-3.5 top-3.5 text-muted-foreground/60">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search name, position, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Department pills scrollable list */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setDeptFilter(dept);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  deptFilter === dept 
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                    : 'bg-card border-border/80 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Grid/Table layout view selector */}
          <div className="flex items-center gap-1 bg-secondary/80 p-1 border border-border/50 rounded-xl select-none">
            <button
              onClick={() => setViewType('table')}
              className={`p-2 rounded-lg transition-colors ${viewType === 'table' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-lg transition-colors ${viewType === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

        </div>
      </Card>

      {/* Grid or Table Layout representation */}
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEmployees.map((emp) => (
            <Card hoverEffect key={emp.id} className="relative overflow-hidden group">
              <CardContent className="pt-6">
                
                {/* Active/Leave Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant="status" status={emp.status}>{emp.status}</Badge>
                </div>

                <div className="flex items-start gap-4">
                  <img src={emp.avatar} alt={emp.name} className="h-14 w-14 rounded-full object-cover border border-border/40" />
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-foreground leading-none">{emp.name}</h3>
                    <p className="text-xs text-primary font-semibold">{emp.position}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{emp.department}</p>
                  </div>
                </div>

                <div className="border-t border-border/30 my-4" />

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    <span>{emp.phone || 'No phone logs'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    <span className="truncate">{emp.location}</span>
                  </div>
                </div>

                <div className="border-t border-border/30 my-4 pt-4 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase font-semibold">Join Date</p>
                    <p className="font-bold mt-0.5">{emp.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase font-semibold">Salary Load</p>
                    <p className="font-bold mt-0.5">${(emp.salary / 1000).toFixed(0)}k/yr</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse select-none">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-bold pb-2 uppercase tracking-wider">
                <th className="py-4.5 px-6">Name</th>
                <th>Department</th>
                <th>Role/Position</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Salary</th>
                <th className="px-6 text-right">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-6 flex items-center gap-3.5">
                    <img src={emp.avatar} alt={emp.name} className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-foreground">{emp.name}</p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-1">{emp.email}</p>
                    </div>
                  </td>
                  <td className="font-semibold text-foreground/80">{emp.department}</td>
                  <td className="font-semibold text-primary">{emp.position}</td>
                  <td>
                    <Badge variant="status" status={emp.status}>{emp.status}</Badge>
                  </td>
                  <td className="text-muted-foreground font-medium">{emp.joinDate}</td>
                  <td className="font-extrabold text-foreground">${(emp.salary / 1000).toFixed(0)}k/yr</td>
                  <td className="px-6 text-right text-muted-foreground font-medium">{emp.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Pagination Footer controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/40 select-none">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-foreground">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> of{' '}
            <span className="font-bold text-foreground">{filteredEmployees.length}</span> employees
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 p-0 rounded-lg flex items-center justify-center"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 p-0 rounded-lg flex items-center justify-center"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty Search State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">No employees matching search criteria</p>
          <Button variant="secondary" size="sm" onClick={() => { setSearch(''); setDeptFilter('All'); }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Onboard Employee Dialog Form */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Onboard New Employee"
        description="Populate employee parameters to create system record."
      >
        <form onSubmit={handleAddEmployee} className="space-y-4 text-xs select-none">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            label="Corporate Email Address"
            placeholder="jane.doe@aurora.io"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Department</label>
              <select
                value={newDept}
                onChange={(e) => setNewDept(e.target.value as any)}
                className="w-full h-11 px-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Role Title</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full h-11 px-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Designer">Product Designer</option>
                <option value="QA Lead">QA Lead</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Marketing Lead">Marketing Lead</option>
                <option value="HR Manager">HR Manager</option>
              </select>
            </div>
          </div>

          <Input
            label="Base Annual Salary ($)"
            placeholder="120000"
            type="number"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
          />

          <div className="flex gap-2 justify-end pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Onboard
            </Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
};
export default EmployeeDirectory;
