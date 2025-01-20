import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-room',
  imports: [ReactiveFormsModule,NgIf],
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
  * @constructor
  * @description Initializes the component by injecting necessary services 
  * and setting up the reactive form for room booking or actions.
  * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
  * @param {Router} router - Angular router service for navigation between routes.
  * @param {RoomService} roomService 
  * @param {ActivatedRoute} route
  * @param {AuthService} authService
  */
  constructor(private formBuilder: FormBuilder, private router: Router,private roomService: RoomService,private route: ActivatedRoute,private authService: AuthService ){

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
  
    // Get the room ID from the route parameters
    this.id = this.route.snapshot.paramMap.get('id')

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

    try {

      // Step 3: Validate room capacity
      const room = await this.roomService.getRoomById(this.id)

      if(guest > room.capacity){
        this.showError('Selected room has a capacity of ' + room.capacity + '.Please adjust the number of guests.')
        return
      }
      
      // Step 4: Attempt to book the room using the service
     await this.roomService.bookRoom(this.userId,this.id,checkIn,checkOut,guest,specialRequest)

     // Step 5: Update room status to 'Booked'
     await this.roomService.updateRoomStatus(this.id, 'Booked');
     console.log('Room status updated to Booked')

     // Step 6: Provide success feedback to the user
     this.showSuccess('New booking added successfully.')
     console.log('New booking added successfully.')

     // Step 7: Navigate to the view booking page after a short delay
     setTimeout(() => {
      this.router.navigate(['/view-booking'])
    }, 3500)

    } catch (error) {

      // Step 8: Handle errors and provide feedback to the user
      console.log('Error adding booking:',error)
      this.showError('Error booking room. Please try again')
    }

  }

}
