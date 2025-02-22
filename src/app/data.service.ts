import { Injectable } from '@angular/core';

export interface Group {
  id: number;
  name: string;
  users: string[];
  expenses: any[];
}

export interface User {
  id: number;
  name: string;
  groupIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  groups: Group[] = [];
  users: User[] = [];

  constructor() {}

  addGroup(name: string): Group {
    const newGroup: Group = {
      id: this.groups.length + 1,
      name,
      users: [],
      expenses: []
    };
    this.groups.push(newGroup);
    return newGroup;
  }

  addUser(name: string, groupId: number): User {
    const user: User = {
      id: this.users.length + 1,
      name,
      groupIds: [groupId]
    };
    this.users.push(user);
    // Also add the user to the specified group's user list
    const group = this.groups.find(g => g.id === groupId);
    if (group) {
      group.users.push(name);
    }
    return user;
  }

  addGroupExpense(groupId: number, expense: any): boolean {
    const group = this.groups.find(g => g.id === groupId);
    if (group && group.users.length > 0) {
      // Equal split logic
      expense.splitDetails = group.users.map(user => ({
        user,
        share: expense.amount / group.users.length
      }));
      group.expenses.push(expense);
      return true;
    }
    return false;
  }
}
