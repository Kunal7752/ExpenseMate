import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Required for PrimeNG animations

// ✅ Import PrimeNG Modules
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect'; // ✅ Added MultiSelectModule
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';

import { AppComponent } from './app.component';
import { GroupsComponent } from './groups/groups.component';
import { UsersComponent } from './users/users.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupsComponent,
    UsersComponent,
    ExpenseFormComponent,
    ExpenseListComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule, // ✅ Required for template-driven forms if needed
    HttpClientModule,
    RouterModule.forRoot([]), // ✅ Ensure RouterModule is included
    BrowserAnimationsModule, // ✅ Required for PrimeNG animations

    // ✅ PrimeNG Modules
    MenubarModule,
    TabViewModule,
    CardModule,
    InputTextModule,
    PaginatorModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule, // ✅ MultiSelect module for selecting multiple users
    TableModule,
    MessageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
