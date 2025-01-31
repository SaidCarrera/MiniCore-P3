export interface Expense {
  id: number;
  date: Date;
  description: string;
  amount: number;
  employeeId: number;
  departmentId: number;
}