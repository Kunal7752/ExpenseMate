import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { Expense } from '../models/expense';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  expenses: any[] = []; // ✅ Store transformed expenses
  loading: boolean = true;
  deletingExpenseId: number | null = null; // ✅ Track which expense is being deleted
  error: string = '';

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  /**
   * ✅ Fetch all expenses and format data
   */
  loadExpenses(): void {
    console.log('🚀 Fetching expenses from backend...');
    this.loading = true; // ✅ Show loading state
    this.error = ''; // ✅ Clear previous errors

    this.expenseService.getAllExpenses().subscribe(
      (data: Expense[]) => {
        console.log('✅ Expenses received:', data);

        this.expenses = data.map(expense => ({
          ...expense,

          // ✅ Show users involved (Fallback: Expense owner)
          usersInvolved: expense.splitDetails && expense.splitDetails.length > 0 
            ? expense.splitDetails
                .map(split => split.username ? split.username : "Unknown") // ✅ Handle missing usernames
                .join(', ') 
            : (expense.users && expense.users.length > 0
              ? expense.users.map(user => user.username ? user.username : "Unknown").join(', ')
              : 'N/A'), // ✅ Fallback if no users found

          // ✅ Format owed amounts properly
          owedAmounts: expense.splitDetails && expense.splitDetails.length > 0
            ? expense.splitDetails
                .map(split => `${split.username ? split.username : "Unknown"}: $${split.amount?.toFixed(2)}`)
                .join(', ')
            : 'N/A' // ✅ Fallback if no split details found
        }));

        this.loading = false;
      },
      (error: any) => {
        this.error = 'Failed to load expenses. Please try again later.';
        console.error('❌ Error loading expenses:', error);
        this.loading = false;
      }
    );
  }

  /**
   * ✅ Deletes an expense by ID (Handles UI updates & prevents duplicate actions)
   */
  deleteExpense(id: number): void {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    this.deletingExpenseId = id; // ✅ Disable UI while deleting
    console.log(`🗑️ Attempting to delete expense ID: ${id}`);

    this.expenseService.deleteExpense(id).subscribe(
      () => {
        console.log(`✅ Expense ID ${id} deleted successfully.`);
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.deletingExpenseId = null;
        this.loadExpenses(); // ✅ Auto-refresh expenses after deletion
      },
      (error: any) => {
        console.error('❌ Error deleting expense:', error);
        this.deletingExpenseId = null;
        alert('Failed to delete expense. Please try again later.');
      }
    );
  }
}
