export interface Employee {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  date: Date;
  description: string;
  amount: number;
  employeeId: string;
  departmentId: string;
}