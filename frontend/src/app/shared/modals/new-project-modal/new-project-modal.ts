import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { UserService } from '../../services/user-service';
import { Select } from '../../model/select';


@Component({
  selector: 'app-new-project-modal',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './new-project-modal.html',
  styleUrl: './new-project-modal.scss',
})
export class NewProjectModal {
  private dialogRef = inject(MatDialogRef<NewProjectModal>);

  private userService = inject(UserService);

  name: string = '';

  myControl = new FormControl('');

  options!: Observable<Select[]>;


  ngOnInit() {
    this.options = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.userService.searchUsers(value || ''))
    );
  }

  submit() {
    this.dialogRef.close('done');
  }
}
