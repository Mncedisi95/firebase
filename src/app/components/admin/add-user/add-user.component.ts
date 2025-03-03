import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-user',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  /**
  * @property {FormGroup} addUserForm 
  */
  addUserForm: FormGroup

  private _snackbar = inject(MatSnackBar)

  /**
  * @constructor
  * @description
  * @param {FormBuilder} fb 
  */
  constructor(private fb: FormBuilder,private userService : UserService) {

    this.addUserForm = this.fb.group({

      // Full Name : Required
      fname: ['', [Validators.required]],
      // Email : Required
      email: ['',[Validators.required,Validators.email]],
      // User Type : Required
      userType: ['', [Validators.required]],
      // Profile : Required
      profile: ['', [Validators.required]],
      //Address : Required
      address: ['', [Validators.required]],
      // Phone Number: required
      phone: ['', [Validators.required]]
    })
  }

 /**
 * @method handleFileInput 
 * @description Handles file input and updates the profile picture field in the form with
 *  the base64 representation of the file.
 * @param {event} event - The file input event.
 */
  async handleFileInput(event: any): Promise<void> {

    // Validate that a file has been selected
    const file: File = event.target.files?.[0]

    if (!file) {
      console.error('No file selected.');
      return;
    }

    try {
      // Read the file as a Base64 string
      const profile = await this.readFile(file)

      if (profile) {
        // Update the FormGroup control with the Base64 string
        this.addUserForm.get('profile')?.setValue(profile)
      } else {
        console.error('Failed to read the file.')
      }
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

 /**
 * @method readFile
 * @description Reads a file and converts it to a Base64-encoded string or an ArrayBuffer.
 * This function uses the FileReader API to asynchronously read the file and resolve the result.
 *
 * @param {File} file - The file object to be read. Must be a valid File instance.
 * @returns {Promise<string | ArrayBuffer | null>} A promise that resolves with the file content 
 * as a Base64 string or an ArrayBuffer, or `null` if no data is read. Rejects with an error in case of failure.
 */
  private readFile(file: File): Promise<string | ArrayBuffer | null> {

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      // Resolve the promise with the file content when the read operation is complete
      reader.onload = () => resolve(reader.result)
      // Reject the promise in case of an error during the read operation
      reader.onerror = (error) => reject(error)
      // Initiate reading the file as a Base64-encoded string
      reader.readAsDataURL(file)
    })
  }

  /**
  * @method onRegisterUser 
  * @returns 
  */
  async onRegisterUser(): Promise<void> {

    if (this.addUserForm.invalid) {

      this._snackbar.open('Please fill in all required fields correctly!', 'Close', {
        duration: 3500, // Auto-close after 3.5 seconds
        panelClass: ['error-snackbar']
      })
      return
    }

    // Step 2: Extract admin input for adding a user from the form
    const name = this.addUserForm.get('fname')?.value
    const email = this.addUserForm.get('email')?.value
    const role = this.addUserForm.get('userType')?.value
    const profile = this.addUserForm.get('profile')?.value
    const phone = this.addUserForm.get('phone')?.value 
    const address = this.addUserForm.get('address')?.value

    try {

      // Step 4: Attempt to add the user using the service
      await this.userService.registerUser(name,phone,email,address,profile,role)

    } catch (error) {

      console.log('Error registering user:',error)
    }
  }

}
