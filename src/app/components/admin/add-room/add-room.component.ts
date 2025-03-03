import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-add-room',
  imports: [NgIf, ReactiveFormsModule,RouterLink],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.css'
})
export class AddRoomComponent {

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
  * and setting up the reactive form for room booking or actions.
  * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
  * @param {RoomService} roomService - 
  * @param {Router} router -
  */
  constructor(private formBuilder: FormBuilder,private roomService: RoomService,private router: Router) {

    // Initialize the book room form with validation rules
    this.addRoomForm = this.formBuilder.group({
      //Room Number: Required
      roomNumber:['',[Validators.required]],
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
  * @param {number} [duration= 3000] - Optional duration for the error message display in milliseconds.
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
  * @param {number} [duration= 3000] - Optional duration for the error message display in milliseconds.
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
 * @description Handles file input and updates the room image field in the form with
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
      const roomImage = await this.readFile(file);
      if (roomImage) {
        // Update the FormGroup control with the Base64 string
        this.addRoomForm.get('roomImage')?.setValue(roomImage);
        console.log('Room image successfully read:', roomImage);
      } else {
        console.error('Failed to read the file.');
      }
    } catch (error) {
      console.error('Error reading file:', error);
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
  private readFile(file:File):Promise<string | ArrayBuffer | null>{

    return new Promise((resolve,reject) =>{
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
  * Handles the submission of the Add Room form and validates the inputs.
  * 
  * @async
  * @method onAddRoom
  * @description Extracts data from the form, validates inputs, and calls the service to add a new room.
  * Provides user feedback on success or failure.
  * 
  * @returns {Promise<void>} A promise that resolves when the room has been successfully added or rejects with an error.
  */
  async onAddRoom(): Promise<void>{

    // Step 1: Validate form inputs
    if(this.addRoomForm.invalid){
      this.showError('Please fill out all required fields.')
      return 
    }

    // Step 2: Extract admin input for adding a room from the form
    const roomNumber = this.addRoomForm.get('roomNumber')?.value
    const roomType = this.addRoomForm.get('roomType')?.value
    const roomImage = this.addRoomForm.get('roomImage')?.value
    const price = this.addRoomForm.get('price')?.value
    const capacity = this.addRoomForm.get('capacity')?.value
    const size = this.addRoomForm.get('size')?.value
    const bedType = this.addRoomForm.get('bedType')?.value
    const services = this.addRoomForm.get('services')?.value
    const description = this.addRoomForm.get('description')?.value

    try {

      // Step 3: Validate the room image
      const maxSizeInMB = 5;
      if (roomImage.size > maxSizeInMB * 1024 * 1024) {
        this.showError(`File size exceeds ${maxSizeInMB} MB.`);
        return;
      }

      // Step 4: Attempt to add the room using the service
      await this.roomService.addRoom(
        roomNumber,
        roomType,
        roomImage,
        price,
        capacity,
        size,
        bedType,
        services,
        description)

      // Step 5: Provide success feedback to the user
      this.addRoomForm.reset()
      this.showSuccess('New Room added successfully')
      console.log('New Room added successfully.')

      // Step 6: Navigate to the rooms page after a short delay
       setTimeout(() => {
        this.router.navigate(['/rooms-admin'])
      }, 3500)
      
    } catch (error) {

      // Step 7: Handle errors and provide feedback to the user
      console.log('Error adding room:',error)
      this.showError('Error adding room. Please try again')
      this.addRoomForm.reset()
    }
  }

}
