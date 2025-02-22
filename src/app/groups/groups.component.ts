import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../group.service';
import { Group } from '../models/groups';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  groupForm!: FormGroup;
  groupExpenseForm!: FormGroup;
  groups: Group[] = [];
  groupOptions: any[] = [];
  loading: boolean = false;
  message: string = '';

  splitOptions = [
    { label: 'Equal', value: 'equal' },
    { label: 'Percentage', value: 'percentage' },
    { label: 'Custom', value: 'custom' }
  ];

  constructor(private fb: FormBuilder, private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      groupName: ['', Validators.required]
    });

    this.groupExpenseForm = this.fb.group({
      groupId: [null, Validators.required],
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      splitType: ['equal', Validators.required]
    });

    this.loadGroups();
  }

  loadGroups() {
    this.loading = true;
    this.groupService.getGroups().subscribe({
      next: (data: Group[]) => {
        this.groups = data;
        this.groupOptions = this.groups.map(group => ({ label: group.name, value: group.id }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmitGroup() {
    if (this.groupForm.valid) {
      const newGroup: Group = { name: this.groupForm.value.groupName };
      this.groupService.addGroup(newGroup).subscribe({
        next: (res: Group) => {
          this.groups.push(res);
          this.groupOptions.push({ label: res.name, value: res.id });
          this.groupForm.reset();
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  onSubmitGroupExpense() {
    if (this.groupExpenseForm.valid) {
      // Integration for group expense creation can be added here.
      // For now, simply log and show a message.
      console.log(this.groupExpenseForm.value);
      this.message = 'Group expense submitted (API integration pending).';
      this.groupExpenseForm.reset({ splitType: 'equal', amount: 0 });
    }
  }
}
