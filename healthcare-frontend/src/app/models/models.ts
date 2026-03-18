export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  departmentId?: number | null;
  departmentName?: string;
  certifications: any[];
}

export interface Certification {
  id: number;
  name: string;
  validityPeriodMonth: number;
}

export interface EmployeeCertification {
  employeeId: number;
  certificationId: number;
  dateCompleted: string;
  expirationDate: string;
  status: string;
  employee: Employee;
  certification: Certification;
}

export interface Department {
  id: number;
  name: string;
  requiredCerts?: any[];
}

export interface User {
  employeeId: number;
  username: string;
  password: string;
}