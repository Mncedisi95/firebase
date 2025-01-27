import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {

  /**
    * @property {FormGroup} addRoomForm
    */
  editProfileForm: FormGroup

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
  * @property {any} guestDetails
  */
  guestDetails: any

  /**
  * @constructor
  * @description Initializes the component by injecting necessary services 
  * and setting up the reactive form for room booking or actions.
  * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
  */
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private userService: UserService,private router: Router) {

    // Initialize the book room form with validation rules
    this.editProfileForm = this.formBuilder.group({

      //Required : Full Name
      fname: ['', Validators.required],
      //Required : Email
      email: ['', [Validators.required, Validators.email]],
      //Required : Phone
      phone: ['', Validators.required],
      // Required : profile
      profile: ['', Validators.required],
      //Required:  address 
      address: ['', Validators.required]
    })
  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id')

    if(this.id){
      this.fetchGuestDetails()
    }

    console.log(this.id)

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
  * @async
  * @method fetchGuestDetails
  * @description Fetches guest details from the database based on the provided guest ID. 
  *              Logs an error if the ID is missing or the request fails.
  * @returns {Promise<void>} Resolves when guest details are fetched and assigned successfully.
  */
  async fetchGuestDetails(): Promise<void> {

    if (!this.id) {
      console.error('Guest ID is undefined. Cannot fetch guest details.');
      return
    }

    try {
    
      // Fetch guest details from the service
      this.guestDetails = await this.userService.getGuestById(this.id)

      // Log the fetched details for debugging
      console.log('Guest Details:', this.guestDetails);
    } catch (error) {
      // Handle potential errors gracefully
      console.log('Error fetching guest details:', error);
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
      const profile = await this.readFile(file);
      if (profile) {
        // Update the FormGroup control with the Base64 string
        this.editProfileForm.get('profile')?.setValue(profile);
        console.log('Room image successfully read:', profile);
      } else {
        console.error('Failed to read the file.');
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  /**
  * @async
  * @method onEditProfile
  * @description Handles the editing of a user profile by collecting form data and updating the Firestore document.
  * @returns {Promise<void>} Resolves when the profile is successfully updated or rejects if an error occurs.
  */
  async onEditProfile() : Promise<void> { 

    // Prepare data for update
    const rawData = {
      name: this.editProfileForm.get('fname')?.value.trim(),
      email: this.editProfileForm.get('email')?.value,
      phone: this.editProfileForm.get('phone')?.value,
      profile: this.editProfileForm.get('profile')?.value.trim(),
      address: this.editProfileForm.get('address')?.value.trim()
    }

    const updateData = Object.fromEntries(
      Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== '')
    )

    try {

      // Update the user profile via the userService
      await this.userService.updateUserProfile(this.id, updateData)

      // Display success message to the user
      this.showSuccess('Profile updated successfully!')
  
      this.editProfileForm.reset()
      setTimeout(() => {

        this.router.navigate(['/view-profile'])
      }, 3500)
      
    } catch (error) {

      // Log the error and show an error message to the user
      console.log('Failed to update profile:', error)
      this.showError('Failed to update profile. Please try again.')
    }
  }

}
