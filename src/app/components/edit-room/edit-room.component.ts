import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-edit-room',
  imports: [ReactiveFormsModule,NgIf,RouterLink],
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
    * @property {any} id
    */
    id: any

    /**
    * @property {any} roomDetails
    */
    roomDetails: any

    bedTypes = [
      'Single Bed',
      'Double Bed',
      'King Bed',
      'Queen Bed',
      'Suite Bed',
      'Murphy Bed',
      'Sofa Bed',
      'Bunk Bed',
      'Canopy Bed',
      'Four-Poster Bed'
    ]
  
    /**
    * @constructor
    * @description Initializes the component by injecting necessary services 
    * and setting up the reactive form for room booking or actions.
    * @param {FormBuilder} formBuilder - Angular service to create reactive forms.
    */
    constructor(private formBuilder: FormBuilder,private route:ActivatedRoute,private router:Router, private roomService: RoomService) {
  
      // Initialize the book room form with validation rules
      this.editRoomForm = this.formBuilder.group({
        //Room Number: Required
        roomNumber: ['',[Validators.required]],
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

    ngOnInit(){

      this.id = this.route.snapshot.paramMap.get('id') || ''

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
  async fetchRoomDetails(): Promise<void>{

    try {
      // Attempt to fetch room details from the RoomService
      this.roomDetails = await this.roomService.getRoomById(this.id)

      // Log success for debugging purposes
      console.log('Room details fetched successfully:', this.roomDetails)

    } catch (error) {

      // Log the error in the console
      console.log('Error fetching room details:', error);
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
     * @method 
     * @description 
     */
    onEditRoom(){

      // Step 1: Validate form inputs
      if(this.editRoomForm.invalid){
        this.showError('Please fill out all required fields.')
        return 
      }
    }

}
