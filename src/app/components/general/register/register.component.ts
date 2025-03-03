import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

   /**
  * @property {FormGroup} registerForm
  * Represents the reactive form for user register form.Contains form controls for email, name
  * profile and password with associated validation rules.
  */
   registerForm: FormGroup

   /**
   *  Represents the current error message to display.
   * @property {string} errorMessage 
   */
   errorMessage: string = ''
 
   /**
   * @property {boolean} isErrorVisible
   * Represents whether to display an error message on the register page. Set to true to show the 
   * error message and false to hide it.
   * Default value: false.
   */
   isErrorVisible: boolean = false
 
   /**
   * Represents the current success message to display.
   * @property {string} successMessage
   */
   successMessage: string = ''
 
   /**
   * Controls visibility of success messages.
   * @property {boolean} isSuccessVisible
   */
   isSuccessVisible: boolean = false
 
   /**
   * @constructor
   * @description Initializes the component by injecting necessary services 
   * and setting up the reactive form for user registration or actions.
   * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
   * @param {AuthService} authService - Service for authentication-related operations.
   * @param {Router} router - Angular router service for navigation between routes.
   */
   constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
 
     // Define the password complexity pattern
     const PASSWORD_PATTERN: string = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
     // Define the phone number pattern (Regex for 10-digit phone number)
     //const PHONE_PATTERN  = new RegExp("^\\(\\+\\d{1,2}\\)?[0-9]{3}[0-9]{4}$")
 
     // Initialize the register form with validation rules
     this.registerForm = this.formBuilder.group({
       // Name : Required
       fname: ['', [Validators.required]],
       // Email: Required and must be a valid email format
       email: ['', [Validators.required, Validators.email]],
       // Phone Number: Required and must be 10 digits
       phone: ['', [Validators.required]],
       // Profile Picture: Required
       profile: ['', [Validators.required]],
       // Address: Required
       address: ['',[Validators.required]],
       // Password: Must meet complexity requirements
       password: [
         '',
         [
           Validators.required, Validators.pattern(PASSWORD_PATTERN)
         ]
       ],
       // Confirm Password: Same requirements as password
       confirmPassword: ['', [Validators.required]]
     }, {
       // create a password validator 
       validators: this.passwordMatchValidator,
     })
   }
 
   /**
    * @method passwordMatchValidator
    * @description Validates if the password and confirm password fields match.
    * @param {AbstractControl} control - - The parent form group control.
    * @returns A validation error object '{ mismatch: true }' if passwords don't match, otherwise 'null'.
    */
   passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
 
     const password = control.get('password')?.value
     const confirmPassword = control.get('confirmPassword')?.value
 
     // Return null if passwords match, otherwise return the mismatch error
     return password === confirmPassword ? null : { mismatch: true };
   }
 
   /**
    * @method showError 
    * @description Displays an error message for a specified duration.
    * @param {string} message - The error message to be displayed. 
    * @param {number} [duration=2500] - Optional duration for the error message display in milliseconds.
    */
   showError(message: string, duration = 3000): void {
 
     // Prevent multiple overlapping error messages
     if (this.isErrorVisible) return;
 
     // Set the error message and display state
     this.errorMessage = message
     this.isErrorVisible = true
 
     setTimeout(() => {
       this.isErrorVisible = false
       this.errorMessage = ''
     }, duration)
   }
 
   /**
   * @method showSuccess
   * @description Displays a success message for a specified duration. 
   * @param {string} message - The success message to be displayed.
   * @param {number} [duration=3000] - Optional duration for the error message display in milliseconds.
   */
   showSuccess(message: string, duration = 3000): void {
 
     // Prevent multiple overlapping error messages
     if (this.isSuccessVisible) return
 
     // Set the error message and display state
     this.successMessage = message
     this.isSuccessVisible = true
 
     setTimeout(() => {
       this.isSuccessVisible = false
       this.successMessage = ''
     }, duration);
   }
 
   /**
   * @method handleFileInput 
   * @description Handles file input and updates the profile picture field in the form with
   *  the base64 representation of the file.
   * @param {event} event - The file input event.
   */
   handleFileInput(event: any): void {
 
     const input = event.target.files[0]
 
     // Ensure a file is selected
     if(input?.files && input.files.length > 0){
 
       const reader = new FileReader()
 
       // Define the onload event handler for the FileReader
       reader.onload=() => {
 
          const base64String = reader.result as string 
          // Update the form control value with the base64 string
          this.registerForm.get('profile')?.setValue(base64String)
       }
       // Read the file as a data URL
       reader.readAsDataURL(input)
     }
   }
 
   /**
   * @method createAccount
   * @description Handles user account creation by validating form inputs, 
   * registering the user via AuthService, and providing user feedback (success or error)
   */
   async createAccount(): Promise<void> {
 
     // Step 1: Validate form inputs
     if (this.registerForm.invalid) {
       this.showError('Please fill out all required fields.')
       return
     }
 
     // Step 2: Extract user input from the form
     const name = this.registerForm.get('fname')?.value
     const email = this.registerForm.get('email')?.value
     const phone = this.registerForm.get('phone')?.value
     const profile = this.registerForm.get('profile')?.value
     const address = this.registerForm.get('address')?.value
     const password = this.registerForm.get('password')?.value
    
     try {
       // Step 3: Attempt to register the user
       await this.authService.register(name, email, phone, profile, address, password)
 
        // Step 4: Provide success feedback to the user
        this.showSuccess('Account created successfully')
        this.registerForm.reset()
        console.log('account created successfully')
 
        // Step 5: Navigate to the login page after a short delay
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 3500)
 
     } catch (error) {
 
         // Step 6: Map specific error codes to user-friendly messages
         const errorMessage = this.mapRegistrationError(error)
 
         // Step 7: Reset the form and display an error message
         this.registerForm.reset()
         this.showError(errorMessage)
         console.log(error)      
     }
   }
 
  /**
  * @method mapRegistrationError
  * @description Maps specific registration errors to user-friendly messages.
  * @param error The error object returned from the registration process.
  * @returns A user-friendly error message.
  */
   private mapRegistrationError(error: any): string {
 
     const errorMessages: Record<string, string> = {
       'auth/email-already-in-use': 'This email address is already in use.',
       'auth/invalid-email': 'The email address is not valid.',
     }
 
     return errorMessages[error.code as string] || 'An unexpected error occurred. Please try again.'
   }

}
