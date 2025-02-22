import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../models/users';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;

  splitType: { label: string, value: string }[] = [
    { label: 'Equal', value: 'equal' },
    { label: 'Unequal', value: 'unequal' }
  ];

  users: User[] = []; // ✅ List of users from backend
  splitAmounts: any[] = []; // ✅ Store calculated split details
  splitValid: boolean = true; // ✅ Track if the split is valid

  @Output() expenseAdded = new EventEmitter<any>(); // ✅ Ensure event emitter is properly defined

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      userIds: [[], Validators.required], // ✅ Multiple user selection
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: [0, [Validators.required, Validators.min(1)]],
      type: [null, Validators.required],
      splitDetails: this.fb.array([]) // ✅ For unequal split amounts
    });

    this.fetchUsers();
  }

  /**
   * ✅ Fetch users from backend and populate dropdown
   */
  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        console.log("✅ Users Fetched:", this.users);
      },
      error: (err) => {
        console.error('❌ Error fetching users:', err);
      }
    });
  }

  /**
   * ✅ Getters for form controls
   */
  get userIds() {
    return this.expenseForm.get('userIds')!;
  }

  get description() {
    return this.expenseForm.get('description')!;
  }

  get amount() {
    return this.expenseForm.get('amount')!;
  }

  get type() {
    return this.expenseForm.get('type')!;
  }

  get splitDetails() {
    return this.expenseForm.get('splitDetails') as FormArray;
  }

  /**
   * ✅ Update split amounts dynamically when users, amount, or split type changes
   */
  updateSplitAmounts(): void {
    const selectedUserIds = this.expenseForm.value.userIds;
    const totalAmount = this.expenseForm.value.amount;
    this.splitAmounts = [];

    if (selectedUserIds.length === 0 || totalAmount <= 0) {
      return;
    }

    if (this.expenseForm.value.type === 'equal') {
      // ✅ Equal Split: Divide amount among users
      const splitValue = totalAmount / selectedUserIds.length;
      selectedUserIds.forEach((userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          this.splitAmounts.push({ userId, username: user.username, amount: splitValue });
        }
      });
    } else if (this.expenseForm.value.type === 'unequal') {
      // ✅ Unequal Split: Initialize with zeroes
      this.splitDetails.clear();
      selectedUserIds.forEach((userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          this.splitAmounts.push({ userId, username: user.username, amount: 0 });
          this.splitDetails.push(this.fb.group({ userId, amount: [0, Validators.required] }));
        }
      });
    }

    this.validateUnequalSplit();
  }

  /**
   * ✅ Validate that custom split amounts sum correctly for "unequal" split
   */
  validateUnequalSplit(): void {
    if (this.expenseForm.value.type !== 'unequal') {
      this.splitValid = true;
      return;
    }

    const totalAmount = this.expenseForm.value.amount;
    const enteredTotal = this.splitDetails.controls.reduce(
      (sum, control) => sum + Number(control.value.amount),
      0
    );

    this.splitValid = enteredTotal === totalAmount;
    console.log(`💰 Total Entered: ${enteredTotal}, Expected: ${totalAmount}, Valid: ${this.splitValid}`);
  }

  /**
   * ✅ Handle expense form submission
   */
  onSubmit(): void {
    if (this.expenseForm.valid) {
      const selectedUsers = this.expenseForm.value.userIds;
      let splitDetails = [];

      if (selectedUsers.length === 0) {
        alert("❌ Please select at least one user!");
        console.error("❌ userIds array is EMPTY:", selectedUsers);
        return;
      }

      if (this.expenseForm.value.type === 'equal') {
        const splitValue = this.expenseForm.value.amount / selectedUsers.length;
        splitDetails = selectedUsers.map((userId: number) => ({  // ✅ Explicitly define userId type
          userId,
          amount: splitValue
        }));
      } else if (this.expenseForm.value.type === 'unequal') {
        splitDetails = this.splitDetails.value; // ✅ Ensure unequal split details are populated
      }

      const formData = {
        userIds: selectedUsers,
        description: this.expenseForm.value.description,
        amount: this.expenseForm.value.amount,
        type: this.expenseForm.value.type,
        splitDetails: splitDetails // ✅ Ensure split details are sent
      };

      console.log("🚀 Form Submission Data:", formData);

      console.log('Selected Users BEFORE submission:', this.expenseForm.value.userIds);
      this.expenseAdded.emit(formData);
      console.log("✅ Expense Event Emitted:", formData);

      this.expenseForm.reset({ userIds: [], type: null, amount: 0 });
    } else {
      console.warn("⚠️ Form is invalid, please check inputs.");
    }
  }
}
