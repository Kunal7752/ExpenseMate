export interface Expense {
  id?: number;
  description: string;
  amount: number;
  users?: { id: number, username: string }[]; // ✅ Ensure 'users' exist
  userIds?: number[]; // ✅ Added userIds for backend API compatibility
  splitDetails?: { userId: number, username: string, amount: number }[];
}
