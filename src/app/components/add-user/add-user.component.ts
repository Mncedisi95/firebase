import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  imports: [RouterLink,ReactiveFormsModule,NgIf],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  /**
  * @property {FormGroup} addUserForm 
  */
  addUserForm: FormGroup

  constructor(private fb: FormBuilder,private snackbar: MatSnackBar ) {

    this.addUserForm = this.fb.group({

      // Full Name : Required
      fname : ['',[Validators.required]],
      // User Type : Required
      userType: ['',[Validators.required]],
      // Profile : Required
      profile :['',[Validators.required]],
      //Address : Required
      address : ['',[Validators.required]],
      // Phone Number: required
      phone : ['',[Validators.required]]
    })
  }

  async registerUser(): Promise<void> {

    if(this.addUserForm.invalid){

      this.snackbar.open('Please fill in all required fields correctly!', 'Close', {
        duration: 3500, // Auto-close after 3.5 seconds
      })
      return
    }
  }

}
