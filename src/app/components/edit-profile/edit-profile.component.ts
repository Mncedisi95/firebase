import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {

  /**
    * @property {FormGroup} addRoomForm
    */
    addRoomForm: FormGroup
  
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
    */
    constructor(private formBuilder: FormBuilder) {
  
      // Initialize the book room form with validation rules
      this.addRoomForm = this.formBuilder.group({
  
        // Room Type: Required
        roomType: ['', [Validators.required]],
        // Room Image: Required 
        roomImage: ['', [Validators.required]],
        // Room Price: Required
        price: ['', [Validators.required]],
        // Room Capacity : Required
        capacity: ['', [Validators.required]],
        // Room Price : Required
        size: ['', [Validators.required]],
        // Bed Type : Required
        bedType: ['', [Validators.required]],
        // Room Services : Required 
        services: ['', [Validators.required]],
        // Room Description : Required
        description: ['', [Validators.required]]
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

}
