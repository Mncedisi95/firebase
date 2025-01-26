import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-room-details',
  imports: [RouterLink,NgIf],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent {

  /**
  * @property {any} id
  */
  id: any = ''

  /**
  * @property {any} roomDetails
  */
  roomDetails: any

  /**
  * @property {boolean} isLoggedIn
  */
  isLoggedIn: boolean = false
  
  /**
  * @constructor
  * @description
  * @param {Router} router 
  * @param {ActivatedRoute} route
  * @param {RoomService} roomService
  * @param {AuthService} authService
  */
  constructor(private router: Router,private route: ActivatedRoute,private roomService: RoomService,private authService: AuthService){}

  /**
   * @description 
   */
  ngOnInit(){

    
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user
    })

    // Get the room ID from the route parameters
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
  * Navigates to the "Book Room" page with the provided room ID.
  * @method goToBookRoom
  * @description Redirects the user to the booking page for the specified room. Ensures the `id` is valid and handles navigation errors.
  * @param { string: number } id - The unique identifier of the room to be booked.
  * @throws {Error} Throws an error if the navigation fails or the `id` is invalid.
  */
  goToBookRoom(): void {

    if (!this.id) {
      console.log("Invalid room ID provided.");
      throw new Error("Room ID is required to navigate to the booking page.");
    }

    try {

      this.router.navigate(['/book-room', this.id])
      console.log('Navigating to booking page for room ID:' + this.id)

    } catch (error) {

      console.log("Navigation to the booking page failed:", error);
      throw new Error("Failed to navigate to the booking page. Please try again.");
    }
  }

}
