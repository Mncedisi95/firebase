import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-room-details',
  imports: [RouterLink, NgIf, NgFor, DatePipe],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
/**
* @author Mncedisi Masondo
* @class RoomDetailsComponent
* @description Component for displaying room details and reviews.
*/
export class RoomDetailsComponent {

  /**
  * @property {any}} id - Unique identifier for the current room, typically retrieved from route parameters.
  */
  id: any

  /**
  * @property {any} roomDetails - Object containing detailed information about the current room.
  * This may include fields like room type, amenities, and pricing. Defaults to `null` until fetched.
  */
  roomDetails: any

  /**
  * @property {any[]} roomReviews - Array of review objects associated with the current room.
  * Each review may include fields like `id`, `userId`, `rating`, and `comment`.
  * Defaults to an empty array until fetched and populated.
  */
  roomReviews: any[] = []

  /**
  * @property {boolean} isLoggedIn - Flag indicating whether the user is logged in.
  * Set to `true` if the user is authenticated, `false` otherwise.
  */
  isLoggedIn: boolean = false;

  /**
  * Initializes the RoomDetailsComponent with required services.
  *
  * @constructor
  * @param {Router} router - Angular Router service for navigation.
  * @param {ActivatedRoute} route - ActivatedRoute to access route parameters.
  * @param {RoomService} roomService - Service to fetch room data.
  * @param {AuthService} authService - Service to handle authentication state.
  * @param {UserService} userService - Service to fetch user data.
  */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private authService: AuthService,
    private userService: UserService
  ) { }


  /**
  * Angular lifecycle hook that is called after the component is initialized.
  * 
  * @async
  * @method ngOnInit
  * @description Subscribes to authentication state, fetches room details, and loads reviews.
  * @returns {Promise<void>}
  */
  async ngOnInit() {

    try {
      // Subscribe to the current user's authentication state
      this.authService.currentUser$.subscribe((user) => {
        this.isLoggedIn = !!user // Set `isLoggedIn` to true if user exists
      })

      // Get the room ID from route parameters
      this.id = this.route.snapshot.paramMap.get('id') || ''

      if (!this.id) {
        console.error('Room ID is missing in route parameters.')
        return
      }

      // Fetch room details and reviews
      await this.fetchRoomDetails();
      await this.fetchRoomReviews();
    } catch (error) {
      console.error('Error initializing RoomDetailsComponent:', error);
    }
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
      // Attempt to fetch room details from the RoomService
      this.roomDetails = await this.roomService.getRoomById(this.id)

    } catch (error) {

      // Log the error in the console
      console.log('Error fetching room details:', error);
    }
  }

  /**
  * Fetches and enriches reviews for the current room by its ID.
  *
  * @async
  * @method fetchRoomReviews
  * @returns {Promise<void>} Resolves when the room reviews are successfully fetched and enriched.
  * @throws {Error} Logs and handles any errors that occur during the fetch process.
  */
  async fetchRoomReviews(): Promise<void> {
    try {
      // Step 1: Fetch reviews for the room
      this.roomReviews = await this.roomService.getRoomReviewByRoomId(this.id);

      // Step 2: Enrich reviews with guest details
      const enrichedReviews = await Promise.all(this.roomReviews.map(async (review) => {
        try {

          const userId = review.userId

          const guestDetails = await this.userService.getGuestById(userId)

          return {
            ...review,
            guest: guestDetails // Add guest details to the review
          }
        }
        catch (error) {

          console.warn(`Error fetching guest details for userId: ${review.userId}`, error);
          return {
            ...review,
            guest: null, // Fallback to null if guest details can't be fetched
          };
        }
      })
      );

      // Update the roomReviews property with enriched data
      this.roomReviews = enrichedReviews;

    } catch (error) {

      console.log('Error fetching or enriching room reviews:', error);
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

      // Navigate to book room page
      this.router.navigate(['/book-room', this.id])

    } catch (error) {

      throw new Error("Failed to navigate to the booking page. Please try again.")
    }
  }

}
