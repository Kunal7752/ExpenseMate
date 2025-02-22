import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../models/users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userForm!: FormGroup;
  message: string = '';
  errorMessage: string = ''; // ✅ Added error message handling
  isLoading: boolean = false; // ✅ Added loading state

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // ✅ Minimum 3 chars
      password: ['', [Validators.required, Validators.minLength(3)]] // ✅ Minimum 6 chars
    });
  }

  onSubmitUser(): void {
    if (this.userForm.valid) {
      this.isLoading = true; // ✅ Show loading state
      const user: User = this.userForm.value;

      this.userService.registerUser(user).subscribe({
        next: (res: { username: any }) => {
          this.message = `✅ User ${res.username} registered successfully!`;
          this.errorMessage = '';
          this.userForm.reset();
        },
        error: (err: { error: string }) => {
          console.error('❌ Registration failed:', err);
          this.errorMessage = err.error ? err.error : 'Registration failed.';
          this.message = '';
        },
        complete: () => {
          this.isLoading = false; // ✅ Hide loading state
        }
      });
    }
  }
}
