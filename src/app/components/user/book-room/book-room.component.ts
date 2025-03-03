import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-book-room',
  imports: [ReactiveFormsModule,NgIf,RouterLink],
  templateUrl: './book-room.component.html',
  styleUrl: './book-room.component.css'
})
export class BookRoomComponent {

  /**
  * @property {FormGroup} bookRoomForm
  * Represents the reactive form for room booking form.Contains form controls for check in, check out date
  * room type and number of guests with associated validation rules.
  */
  bookRoomForm: FormGroup

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
  * @property {any} userId
  */
  userId: any 

  /**
  * @property {boolean} isRoomBooked
  */
  isRoomBooked : boolean = false

  /**
  * @property {any} bookingId
  */
  bookingId: any

  /**
  * @property {any} roomToBook
  */
  roomToBook: any

  /**
   * @property {number} 
   */
  bookingHoldTime  : number = 15

  /**
  * @constructor
  * @description Initializes the component by injecting necessary services 
  * and setting up the reactivse form for room booking or actions.
  * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
  * @param {Router} router - Angular router service for navigation between routes.
  * @param {RoomService} roomService 
  * @param {ActivatedRoute} route
  * @param {AuthService} authService
  */
  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private authService: AuthService 
  ){

    // Initialize the book room form with validation rules
    this.bookRoomForm = this.formBuilder.group({

      // Check In: Required
      checkIn:['',[Validators.required]],
      // Check Out: Required
      checkOut:['',[Validators.required]],
      // Guest : Required
      guest:['',[Validators.required]],

      specialRequest:['',[Validators.required]]
    }, { validators : this.dateValidator})
  }

  ngOnInit(){

    this.authService.currentUser$.subscribe((user) => {
      this.userId = user.uid
    })
  
    // Get the current navigation object from the router
    const navigation = this.router.getCurrentNavigation()
    // Extract the state object from navigation extras, expecting an 'id' property
    const state = navigation?.extras?.state as { id?:any}

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
  * @method bookRoom
  * @description Handles the booking process, including form validation, capacity checks, room status updates, and booking confirmation.
  * @returns {Promise<void>}
  */
  async bookRoom(): Promise<void>{

    // Step 1: Validate form inputs
    if(this.bookRoomForm.invalid){
      this.showError('Please fill out all required fields.')
      return
    }

    // Step 2: Extract user input from the form
    const checkIn = this.bookRoomForm.get('checkIn')?.value
    const checkOut = this.bookRoomForm.get('checkOut')?.value
    const guest = parseInt(this.bookRoomForm.get('guest')?.value, 10)
    const specialRequest = this.bookRoomForm.get('specialRequest')?.value

    // Step 3: Validate check-in and check-out dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to simplify date comparisons

    try {

      // Step 4: Validate room capacity
      const room = await this.roomService.getRoomById(this.id)

      if(guest > room.capacity){
        this.showError('Selected room has a capacity of ' + room.capacity + '.Please adjust the number of guests.')
        return
      }
      
      // Step 5: Attempt to book the room using the service
      this.roomToBook = await this.roomService.bookRoom(this.userId,this.id,checkIn,checkOut,guest,specialRequest)

     // Step 6: Update room status to 'Booked'
     await this.roomService.updateRoomStatus(this.id, 'Booked');
     console.log('Room status updated to Booked')

     // Step 7: Provide success feedback to the user
     this.showSuccess('New booking added successfully.')
    
     // Assuming bookingResponse contains bookingId
     this.bookingId = this.roomToBook.id
     
     // Enable the Pay Now button
     this.isRoomBooked = true
    
    } catch (error) {

      // Step 8: Handle errors and provide feedback to the user
      console.log('Error adding booking:',error)
      this.showError('Error booking room. Please try again')
    }
  }

  /**
  * @method goToPayment
  */
  processPayment() {
   
   const id = this.bookingId

   sessionStorage.setItem('id', id)
    
   this.router.navigate(['/payment'], {state: {id}})
  }

}
