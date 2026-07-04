import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockEmployees } from '../../data/mockData';
import { 
  User, 
  Briefcase, 
  PhoneCall, 
  BadgeDollarSign, 
  FileText, 
  History,
  Edit3,
  Check,
  X,
  Plus
} from 'lucide-react';

export const EmployeeProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const mockEmployee = mockEmployees.find(e => e.id === user?.id) || mockEmployees[0];
  const [profile, setProfile] = useState(mockEmployee);
  
  // Edit mode toggles
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio || '');

  // Emergency contact edits
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContact.phone);

  // Skills edits
  const [skillInput, setSkillInput] = useState('');

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      phone,
      location,
      bio,
      emergencyContact: {
        ...prev.emergencyContact,
        name: emergencyName,
        phone: emergencyPhone
      }
    }));
    setIsEditing(false);
    toast('Profile Updated', 'Your profile adjustments have been securely saved.', 'success');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (profile.skills.includes(skillInput.trim())) {
      setSkillInput('');
      return;
    }
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()]
    }));
    setSkillInput('');
    toast('Skill Added', `${skillInput.trim()} added to your profile.`, 'success');
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Profile Header Card */}
      <Card className="relative overflow-hidden border border-border">
        {/* Dynamic header background gradient */}
        <div className="h-32 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500" />
        
        <CardContent className="relative pt-0 px-6 pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="h-24 w-24 rounded-full object-cover border-4 border-card shadow-lg"
            />
            <div className="space-y-1 mb-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl md:text-2xl font-extrabold text-foreground">{profile.name}</h1>
                <Badge variant="status" status={profile.status}>{profile.status}</Badge>
              </div>
              <p className="text-xs text-indigo-500 font-bold">{profile.position}</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{profile.department} Department</p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9 text-xs rounded-xl flex items-center gap-1.5 font-bold"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4" />
                <span>Adjust Info</span>
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 text-xs rounded-xl flex items-center gap-1.5"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="h-9 text-xs rounded-xl flex items-center gap-1.5 font-bold"
                  onClick={handleSave}
                >
                  <Check className="h-4 w-4" />
                  <span>Save Info</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Tab panel */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto justify-start border-none">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Personal</span>
          </TabsTrigger>
          <TabsTrigger value="job" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Job & Work</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span>Emergency</span>
          </TabsTrigger>
          <TabsTrigger value="salary" className="flex items-center gap-2">
            <BadgeDollarSign className="h-4 w-4" />
            <span>Compensation</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Timeline</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Personal Details */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your personal information metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About Bio</label>
                {!isEditing ? (
                  <p className="text-sm font-medium leading-relaxed text-foreground bg-secondary/20 p-4 border border-border rounded-xl">
                    {profile.bio || 'Add a bio to introduce yourself...'}
                  </p>
                ) : (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full min-h-[90px] p-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                />
                <Input
                  label="Primary Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {/* Skills Area */}
              <div className="space-y-3 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills Matrix</p>
                
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1.5 px-3 py-1 text-xs">
                      <span>{skill}</span>
                      {isEditing && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                {isEditing && (
                  <form onSubmit={handleAddSkill} className="flex gap-2 w-full max-w-sm pt-2">
                    <input
                      placeholder="Add a new skill (e.g. Docker)..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      className="flex-1 h-9 px-3.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <Button type="submit" variant="secondary" size="sm" className="h-9 px-3 rounded-xl flex items-center justify-center">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Job Contract Details */}
        <TabsContent value="job">
          <Card>
            <CardHeader>
              <CardTitle>Employment Parameters</CardTitle>
              <CardDescription>Official job contract variables.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Position Title</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{profile.position}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Reporting Manager</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{profile.managerName || 'Operations Board'}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Corporate Email</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{profile.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Employment Department</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{profile.department}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Contract Commencement</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{profile.joinDate}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Internal Employee ID</p>
                  <p className="font-bold text-sm text-indigo-500 font-mono mt-0.5">{profile.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Emergency Contacts */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact Records</CardTitle>
              <CardDescription>Primary contacts to reach during crisis scenarios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  disabled={!isEditing}
                />
                <Input
                  label="Emergency Phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Relationship Status"
                  value={profile.emergencyContact.relationship}
                  disabled
                  helperText="Relationship status changes require admin approval."
                />
                <Input
                  label="Contact Corporate Email"
                  value={profile.emergencyContact.email || 'None registered'}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Salary & Compensation */}
        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle>Salary Information</CardTitle>
              <CardDescription>Breakdown of annual cash and base salaries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-4 bg-secondary/30 border border-border/60 rounded-2xl">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Gross Annual Base</p>
                  <p className="text-2xl font-black text-foreground mt-1">${(profile.salary).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-secondary/30 border border-border/60 rounded-2xl">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Monthly Base Yield</p>
                  <p className="text-2xl font-black text-foreground mt-1">${(profile.salary / 12).toFixed(0)}</p>
                </div>
                <div className="p-4 bg-secondary/30 border border-border/60 rounded-2xl col-span-2 md:col-span-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Estimated Deductions</p>
                  <p className="text-2xl font-black text-rose-500 mt-1">-$24,800/yr</p>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 text-xs space-y-2">
                <p className="font-bold text-muted-foreground text-[10px] uppercase">Compliance Disclosures</p>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Salary statements are strictly confidential. For disputes, please raise a payroll ticket in Settings or contact the operations desks directly.
                </p>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Documents list */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Contracts & Forms</CardTitle>
              <CardDescription>View, audit, or upload document templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {profile.documents.length === 0 ? (
                <p className="text-center py-6 text-xs text-muted-foreground">No documents uploaded.</p>
              ) : (
                profile.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/50 hover:bg-secondary/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center font-bold">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8.5 text-[10px] font-bold rounded-lg"
                      onClick={() => toast('File Download', `Simulating download of ${doc.name}`, 'info')}
                    >
                      Download
                    </Button>
                  </div>
                ))
              )}

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Milestones Timeline */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Milestone Career Timelines</CardTitle>
              <CardDescription>Major career achievements and promotions onboarded.</CardDescription>
            </CardHeader>
            <CardContent className="relative pl-6 space-y-6">
              
              {/* Vertical timeline connector */}
              <div className="absolute left-3 top-2 bottom-2 w-[1.5px] bg-border" />

              {profile.timeline.length === 0 ? (
                <p className="text-center py-6 text-xs text-muted-foreground">No milestones archived.</p>
              ) : (
                profile.timeline.map((item) => (
                  <div key={item.id} className="relative space-y-1">
                    
                    {/* Circle icon marker */}
                    <div className="absolute -left-[18.5px] top-1.5 h-3.5 w-3.5 rounded-full border border-card bg-primary shadow-sm" />
                    
                    <div className="pl-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                        <span className="text-[10px] text-muted-foreground font-semibold">{item.date}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{item.description}</p>
                    </div>

                  </div>
                ))
              )}

            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

    </div>
  );
};
export default EmployeeProfile;
