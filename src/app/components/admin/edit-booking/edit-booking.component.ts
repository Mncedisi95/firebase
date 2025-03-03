import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-booking',
  imports: [ReactiveFormsModule,NgIf,RouterLink],
  templateUrl: './edit-booking.component.html',
  styleUrl: './edit-booking.component.css'
})
export class EditBookingComponent {

   /**
    * @property {FormGroup} EditForm
    * Represents the reactive form for edit booking form.Contains form controls for check in, check out date
    * room type and number of guests with associated validation rules.
    */
    editForm: FormGroup
  
    /**
    *  Represents the current error message to display.
    * @property {string} errorMessage 
    */
    errorMessage: string = ''
  
    /**
    * @property {boolean} isErrorVisible
    * Represents whether to display an error message on the book page. Set to true to show the 
    * error message and false to hide it.
    * Default value: false.
    */
    isErrorVisible: boolean = false
  
    /**
    * @constructor
    * @description Initializes the component by injecting necessary services 
    * and setting up the reactive form for room booking or actions.
    * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
    * @param {Router} router - Angular router service for navigation between routes.
    */
    constructor(private formBuilder: FormBuilder, private router: Router){
  
      // Initialize the book room form with validation rules
      this.editForm = this.formBuilder.group({
  
        // Check In: Required
        checkIn:['',[Validators.required]],
        // Check Out: Required
        checkOut:['',[Validators.required]],
        // Room Type: Required
        roomType: ['',[Validators.required]],
        // Guest : Required
        guest:['',[Validators.required]]
      }, { validators : this.dateValidator})
    }
   
    /**
    * @method dateValidator
    * @description Validates that the checkOut date is later than the checkIn date in a form group.
    * This validator should be applied to the parent FormGroup containing checkIn and checkOut controls.
    * @param {AbstractControl} control - The form group to validate, typically passed automatically by Angular.
    * @returns {ValidationErrors | null} - Returns an error object { dateInvalid: true } if validation fails, or null if validation passes.
    */
    dateValidator(control: AbstractControl){
  
      const checkIn = control.get('checkIn')?.value ? new Date(control.get('checkIn')?.value) : null
      const checkOut = control.get('checkOut')?.value ? new Date(control.get('checkOut')?.value) : null
  
      if(!checkIn || !checkOut) {
        return null
      }
  
      return checkOut > checkIn ? null : { dateInvalid: true }  
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
     * @method bookRoom
     * @description 
     * @returns 
     */
    editBooking(){
  
      // Step 1: Validate form inputs
      if(this.editForm.invalid){
        this.showError('Please fill out all required fields.')
        return
      }
  
      // Step 2: Extract user input from the form
      const checkIn = this.editForm.get('checkIn')?.value
      const checkOut = this.editForm.get('checkOut')?.value
      const roomType = this.editForm.get('roomType')?.value
      const guest = this.editForm.get('guest')?.value
  
    }
  

}
