import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  /**
  * @property {FormGroup} resetForm
  * Represents the reactive form for user reset password.Contains form controls for email and confirm password
  * with associated validation rules.
  */
  resetForm: FormGroup

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
  * @property {boolean} showSuccessMessage
  */
  showSuccessMessage: boolean = false

  /**
  * @constructor
  * @description Initializes the component by injecting necessary services 
  * and setting up the reactive form for reset password or actions.
  * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
  * @param {AuthService} authService - Service for authentication-related operations.
  * @param {Router} router - Angular router service for navigation between routes.
  */
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialize the reset form with validation rules
    this.resetForm = formBuilder.group({
      //Email field with required validation
      email: ['', [Validators.required, Validators.email]],
    })
  }

  /**
   * @method showError 
   * @description Displays an error message for a specified duration.
   * @param {string} message - The error message to be displayed. 
   * @param {number} [duration=3000] - Optional duration for the error message display in milliseconds.
   */
  showError(message: string, duration = 3000): void {

    // Prevent multiple overlapping error messages
    if (this.isErrorVisible) return

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
    if (this.showSuccessMessage) return

    // Set the error message and display state
    this.successMessage = message
    this.showSuccessMessage = true

    setTimeout(() => {
      this.showSuccessMessage = false
      this.successMessage = ''
    }, duration);
  }

  /**
  * @method resetPassword
  * @description Handles the password reset process by validating the form, 
  * sending a reset email using AuthService, and managing user feedback (success or error).
  */
  async resetPassword(): Promise<void> {

    // Step 1: Validate form inputs
    if (this.resetForm.invalid) {
      this.showError('Please fill out all required fields.')
      return
    }

    // Step 2: Extract email from the form
    const email = this.resetForm.get('email')?.value

    try {
      // Step 3: Trigger password reset email
      await this.authService.resetPassword(email)

       // Step 4: Provide feedback to the user
       this.showSuccess('Password reset email sent. Please check your inbox')
       this.resetForm.reset() // Clear the form after success
       console.log('Password reset email sent successfully.')

       // Step 5: Navigate to the login page after a short delay
       setTimeout(() => {
         this.router.navigate(['/login']);
       }, 3500);
        
    } catch (error) {

        // Step 6: Map specific error codes to user-friendly messages
        const errorMessage = this.mapResetPasswordError(error)
        // Step 7: Display the error message to the user
        this.showError(errorMessage)
        this.resetForm.reset()
        console.log('Error', error)
    }   
  }

    /**
    * @method mapResetPasswordError
    * @description  Map specific Reset Password errors to user-friendly messages
    * @param {any} error - The error object returned from the registration process.
    * @returns  A user-friendly error message.
    */
    mapResetPasswordError(error: any): string {

      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-email': 'Invalid email address format.',
        'auth/too-many-requests': 'Too many requests. Please try again later.',
      }

      // Fallback for unexpected errors
      return errorMessages[error.code as string] || 'An unexpected error occurred. Please try again.'
    }

}
