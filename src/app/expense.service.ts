import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Expense } from '../app/models/expense'; 
import { User } from '../app/models/users'; // ✅ Ensure correct import

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:8080/api/expenses'; 
  private usersApiUrl = 'http://localhost:8080/api/users'; 

  constructor(private http: HttpClient) {}

  /**
   * ✅ Generate Authentication headers dynamically
   */
  private getAuthHeaders(): HttpHeaders {
    const username = localStorage.getItem('username') || 'user';  
    const password = localStorage.getItem('password') || 'password'; 

    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json'
    });
  }

  /**
   * ✅ Fetch all expenses
   */
  getAllExpenses(): Observable<Expense[]> {
    console.log('🚀 Fetching all expenses from backend...');
    return this.http.get<Expense[]>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      map(response => response || []), 
      catchError(error => {
        console.error('❌ Error fetching all expenses:', error);
        return throwError(() => new Error('Error fetching all expenses.'));
      })
    );
  }

  /**
   * ✅ Fetch expenses by userId
   */
  getExpensesByUser(userId: number): Observable<Expense[]> {
    console.log(`🚀 Fetching expenses for user ID: ${userId}`);
    return this.http.get<Expense[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      map(response => response || []), 
      catchError(error => {
        console.error(`❌ Error fetching expenses for user ID ${userId}:`, error);
        return throwError(() => new Error('Error fetching expenses.'));
      })
    );
  }

  /**
   * ✅ Fetch all users (Fixed API URL handling)
   */
  getUsers(): Observable<User[]> {
    console.log("🚀 Fetching users from backend...");
    return this.http.get<User[]>(this.usersApiUrl, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error("❌ Error fetching users:", error);
        return throwError(() => new Error("Error fetching users."));
      })
    );
  }

  /**
   * ✅ Add a new expense (supports multiple users)
   */
  addExpense(expense: Expense, selectedUsers: number[]): Observable<Expense> {
    console.log('🚀 Preparing to send expense:', expense);
    console.log('✅ Selected Users:', selectedUsers); 

    if (!selectedUsers || selectedUsers.length === 0) {
      console.error('❌ No users selected!');
      return throwError(() => new Error('No users selected.'));
    }

    const requestBody = {
      description: expense.description,
      amount: expense.amount,
      userIds: selectedUsers, 
      splitDetails: expense.splitDetails || [] 
    };

    console.log("📤 Sending Expense Request:", requestBody);

    return this.http.post<Expense>(`${this.apiUrl}/add`, requestBody, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('❌ Error adding expense:', error);
        return throwError(() => new Error('Error adding expense.'));
      })
    );
  }

  /**
   * ✅ Delete an expense (Fixed URL)
   */
  deleteExpense(expenseId: number): Observable<void> {
    console.log(`🗑️ Deleting Expense ID: ${expenseId}`);  

    return this.http.delete<void>(`${this.apiUrl}/${expenseId}`, {  
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error(`❌ Error deleting expense ID ${expenseId}:`, error);
        return throwError(() => new Error('Error deleting expense. Please try again later.'));
      })
    );
  }
}
