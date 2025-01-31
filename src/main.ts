import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ExpenseListComponent } from './app/components/expense-list/expense-list.component';
import { ExpenseFormComponent } from './app/components/expense-form/expense-form.component';
import { DepartmentDashboardComponent } from './app/components/department-dashboard/department-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpenseListComponent, ExpenseFormComponent, DepartmentDashboardComponent],
  template: `
    <div class="container">
      <h1>Expense Management System</h1>
      <app-department-dashboard></app-department-dashboard>
      <app-expense-form></app-expense-form>
      <app-expense-list></app-expense-list>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
  `]
})
export class App {
  name = 'Expense Management System';
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(ReactiveFormsModule)
  ]
});