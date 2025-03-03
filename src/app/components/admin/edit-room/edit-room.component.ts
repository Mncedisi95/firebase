import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-edit-room',
  imports: [ReactiveFormsModule, NgIf, RouterLink,MatProgressSpinnerModule],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.css'
})
export class EditRoomComponent {

  /**
    * @property {FormGroup} editRoomForm
    */
  editRoomForm: FormGroup

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
  * @property {any} id
  */
  id: any

  /**
  * @property {any} roomDetails
  */
  roomDetails: any

  /** @property {boolean} isLoading */

  isLoading : boolean = false

  /**
  * @constructor
  * @description Initializes the component by injecting necessary services 
  * and setting up the reactive form for room booking or actions.
  * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
  * @param {Router} Router
  * @param {ActivatedRoute} route
  * @param {RoomService} roomService
  */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private roomService: RoomService) {

    // Initialize the book room form with validation rules
    this.editRoomForm = this.formBuilder.group({
      //Room Number: Required
      roomNumber: ['', [Validators.required]],
      // Room Type: Required
      roomType: ['', [Validators.required]],
      // Room Status : Required,
      status: ['', [Validators.required]],
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

  ngOnInit() {

    // Get the current navigation object from the router
    const navigation = this.router.getCurrentNavigation()
    // Extract the state object from navigation extras, expecting an 'id' property
    const state = navigation?.extras?.state as { id?: any }

    // Check if 'id' is available in the navigation state
    if (state?.id) {
      // Assign the retrieved ID to the component property
      this.id = state.id
      // Store the ID in sessionStorage to persist across refreshes
      sessionStorage.setItem('id', this.id)
    } else {
      // Retrieve the ID from sessionStorage if the page was refreshed
      this.id = sessionStorage.getItem('id')
    }

    // If 'id' is still not available, redirect to the home page
    if (!this.id) {
      // Redirect user to the home page to prevent access without a valid ID
      this.router.navigate(['/'])
    }

    // Fetch room details using the ID
    this.fetchRoomDetails()
  }

 /**
 * Fetches the details of a specific room by its ID.
 * @async
 * @method fetchRoomDetails
 * @description Retrieves room details from the RoomService using the room's unique ID.
 * If an error occurs, it logs the error and provides appropriate feedback.
 * @returns {Promise<void>} A promise that resolves when the room details are successfully fetched.
 */
  async fetchRoomDetails(): Promise<void> {

    try {

      // Set loading state to true before starting the fetch process
      this.isLoading = true

      // Simulate lazy loading delay
      setTimeout(async () => {

      // Attempt to fetch room details from the RoomService
      this.roomDetails = await this.roomService.getRoomById(this.id)

      // Hide spinner after data is loaded
      this.isLoading = false

      }, 1000) // 1-second delay for effect

    } catch (error) {

      // Log the error in the console
      console.log('Error fetching room details:', error)
      // Ensure spinner is hidden on error
      this.isLoading = false
    }
  }

  /**
  * @method showError 
  * @description Displays an error message for a specified duration.
  * @param {string} message - The error message to be displayed. 
  * @param {number} [duration=3000] - Optional duration for the error message display in milliseconds.
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
      const roomImage = await this.readFile(file);
      if (roomImage) {
        // Update the FormGroup control with the Base64 string
        this.editRoomForm.get('roomImage')?.setValue(roomImage);
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
  * Handles the logic for editing a room's details.
  *
  * @async
  * @method onEditRoom
  * @description 
  * Validates the input form, prepares the data, and updates the room information in the backend.
  * Displays success or error messages based on the operation result.
  * @returns {Promise<void>} Resolves when the operation completes successfully.
  */
  async onEditRoom(): Promise<void> {

    // Step 1: Prepare data for update
    const rawData = {
      roomNumber: this.editRoomForm.get('roomNumber')?.value.trim(),
      bedType: this.editRoomForm.get('bedType')?.value.trim(),
      capacity: this.editRoomForm.get('capacity')?.value,
      description: this.editRoomForm.get('description')?.value,
      price: this.editRoomForm.get('price')?.value,
      roomImage: this.editRoomForm.get('roomImage')?.value,
      roomType: this.editRoomForm.get('roomType')?.value.trim(),
      services: this.editRoomForm.get('services')?.value.trim(),
      size: this.editRoomForm.get('size')?.value,
      status: this.editRoomForm.get('status')?.value
    }

    // Step 2: Filter empty or undefined data
    const updateData = Object.fromEntries(
      Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== '')
    )

    try {

      // Step 3: Update the room via the room service
      await this.roomService.updateRoom(this.id, updateData)

      // Step 4: Display success message and reset the form
      this.showSuccess('Room updated successfully!')
      this.editRoomForm.reset()

      // Step 5: Redirect to the admin rooms page after a short delay
      setTimeout(() => {

        this.router.navigate(['/rooms-admin'])
      }, 3500)


    } catch (error) {

      // Log the error and show an error message to the user
      console.log('Failed to update room information:', error)
      this.showError('Failed to room information. Please try again.')
    }
  }

}
