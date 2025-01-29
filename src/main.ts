import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { ExpenseFormComponent } from './app/components/expense-form/expense-form.component';
import { ExpenseListComponent } from './app/components/expense-list/expense-list.component';
import { DepartmentSummaryComponent } from './app/components/department-summary/department-summary.component';
import { EmployeeFormComponent } from './app/components/employee-form/employee-form.component';
import { DepartmentFormComponent } from './app/components/department-form/department-form.component';
import { IndexedDBService } from './app/services/indexeddb.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ExpenseFormComponent, 
    ExpenseListComponent, 
    DepartmentSummaryComponent,
    EmployeeFormComponent,
    DepartmentFormComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <h1>Sistema de Gestión de Gastos</h1>
      </header>
      
      <main>
        <div class="forms-container">
          <app-employee-form></app-employee-form>
          <app-department-form></app-department-form>
        </div>
        <app-expense-form></app-expense-form>
        <app-expense-list></app-expense-list>
        <app-department-summary></app-department-summary>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    h1 {
      color: #333;
    }
    
    main {
      display: grid;
      gap: 30px;
    }

    .forms-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
  `]
})
export class App {
  name = 'Sistema de Gestión de Gastos';
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    IndexedDBService
  ]
});