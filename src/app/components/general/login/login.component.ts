import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [NgIf, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  
  /**
  * @property {FormGroup} resetForm
  * Represents the reactive form for user login.Contains form controls for email and password
  * with associated validation rules.
  */
  loginForm: FormGroup

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
  * @constructor
  * @param formBuilder 
  */
  constructor(private formBuilder: FormBuilder,private authService: AuthService, private router:Router){
    // Initialize the login form with validation rules
    this.loginForm = formBuilder.group({
     // Email field with required validation
     email:['',[Validators.required, Validators.email]],
     // Password field with required validation
     password: ['',[Validators.required]]
    })
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
  * @method login
  * @description Handles user login by validating the form, 
  * retrieving user credentials, and calling the authentication service.
  * Navigates to the dashboard on success.
  */
  async login(): Promise<void>  {
    
    // Step 1: Validate form inputs
    if(this.loginForm.invalid){
      this.showError('Please fill out all required fields.')
      return
    }

    // Step 2: Extract user input from the form
    const email = this.loginForm.get('email')?.value
    const password = this.loginForm.get('password')?.value

    try {

      //Step 3: Call the authentication service to log in the user
      await this.authService.login(email,password)

      // Step 4 : Navigate to the dashboard upon successful login
      this.checkUserRole()
       
    } catch (error) {

      // Step 5: Map specific error codes to user-friendly messages
      const errorMessage = this.mapLoginErrors(error)

      // Step 6: Reset the form and display an error message
      this.loginForm.reset()
      this.showError(errorMessage)
      console.log(error)
    }
  }

  /**
   * @method mapLoginErrors
   * @description  Maps specific login errors to user-friendly messages.
   * @param {any} error - The error object returned from the registration process.
   * @returns A user-friendly error message.
   */
  mapLoginErrors(error: any): string {

    // Map Firebase errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    }

    // Get the error message or a default one
    return errorMessages[error.code as string] || 'An unexpected error occurred. Please try again.'

  }

  /**
   * @method checkUserRole
   * @description 
   */
  async checkUserRole(){

    // Fetch user role
    const role = await this.authService.hasRole()

    // Navigate based on role
    switch(role){

      case 'admin':
        this.router.navigate(['/dashboard'])
      break

      case 'staff':
        this.router.navigate(['/dashboard'])
      break

      case 'guest':
        this.router.navigate(['/rooms'])
      break 

      default:
        this.router.navigate(['/unauthorized'])
      break
    }
  }
}
