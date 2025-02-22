import { Component, OnInit } from '@angular/core';
import { ExpenseService } from './expense.service';
import { Expense } from './models/expense';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  activeIndex: number = 0;
  expenses: Expense[] = [];
  usersList: any[] = [];  // ✅ List of available users
  selectedUsers: number[] = [];  // ✅ Stores selected user IDs
  userId: number = 1; // ✅ Hardcoded for now, should come from authentication

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadExpenses();
    this.loadUsers();
  }

  /**
   * ✅ Load all expenses from the backend
   */
  loadExpenses() {
    this.expenseService.getAllExpenses().subscribe({
      next: (data: Expense[]) => {
        this.expenses = data;
        console.log("✅ Expenses Loaded:", this.expenses);
      },
      error: (err: any) => console.error("❌ Error fetching expenses:", err)
    });
  }

  /**
   * ✅ Fetch users from backend to populate dropdown
   */
  loadUsers() {
    this.expenseService.getUsers().subscribe({
      next: (users: any[]) => {
        this.usersList = users;
        console.log("✅ Users Loaded:", this.usersList);
      },
      error: (err: any) => console.error("❌ Error fetching users:", err)
    });
  }

  /**
   * ✅ Updates the selected users when changed in dropdown
   */
  onUsersSelected(event: any) {
    const selectedOptions = event.target.selectedOptions;
    this.selectedUsers = Array.from(selectedOptions).map((option: any) => Number(option.value));

    console.log("✅ Users Selected:", this.selectedUsers); // DEBUGGING LOG
}


  /**
   * ✅ Add an expense with selected users
   */
  onExpenseAdded(expense: Expense) {
    console.log("🚀 Preparing expense data...");
    
    // ✅ Debugging - Ensure users are selected before submission
    console.log("Selected Users BEFORE submission:", this.selectedUsers);

    this.selectedUsers = expense.userIds || [];

    // if (!this.selectedUsers || this.selectedUsers.length === 0) {
    //     alert("❌ Please select at least one user!");
    //     return;
    // }

    const expensePayload = {
        ...expense,
        userIds: expense.userIds,
        splitDetails: expense.splitDetails || []
    };

    console.log("📤 Sending expense to API:", expensePayload);

    this.expenseService.addExpense(expensePayload, this.selectedUsers).subscribe({
        next: (res: Expense) => {
            console.log("✅ Expense Added Successfully:", res);
            this.expenses = [...this.expenses, res];
        },
        error: (err: any) => {
            console.error("❌ Error adding expense:", err);
            alert("Error adding expense. Please try again.");
        }
    });
}


}
