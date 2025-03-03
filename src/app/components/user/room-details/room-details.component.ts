import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RoomService } from '../../../services/room.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-room-details',
  imports: [RouterLink, NgIf, NgFor, DatePipe, MatProgressSpinnerModule,MatPaginatorModule],
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
  isLoggedIn: boolean = false

  /** @property {boolean} isLoading */

  isLoading: boolean = false

  /**
 * Represents the total number of rooms available.
 * @property {number} items - Total count of rooms.
 */
  items: number = 0

  /**
  * Represents the current page index in the pagination.
  * @property {number} currentpage - Zero-based index of the current page.
  */
  currentpage: number = 0

  /**
  * Represents the index of the first product displayed on the current page.
  * @property {number} lowIndex - Starting index for pagination.
  */
  lowIndex: number = 0

  /**
  * Represents the index of the last product displayed on the current page.
  * @property {number} highIndex - Ending index for pagination.
  */
  highIndex: number = 4

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

      // Set loading state to true before starting the fetch process
      this.isLoading = true

      // Simulate lazy loading delay
      setTimeout(async () => {

        // Fetch room details and reviews
        await this.fetchRoomDetails()
        await this.fetchRoomReviews()

        // Hide spinner after data is loaded
        this.isLoading = false

      }, 1000)  // 1-second delay for effect

    } catch (error) {
      console.error('Error initializing RoomDetailsComponent:', error)

      // Ensure spinner is hidden on error
      this.isLoading = false
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
      console.log('Error fetching room details:', error)
    }
  }

  /**
  * Fetches and enriches reviews for the current room by its ID.
  *
  * @async
  * @msethod fetchRoomReviews
  * @returns {Promise<void>} Resolves when the room reviews are successfully fetched and enriched.
  * @throws {Error} Logs and handles any errors that occur during the fetch process.
  */
  async fetchRoomReviews(): Promise<void> {

    try {

      // Step 1: Fetch reviews for the room using the room ID
      // This retrieves the list of reviews associated with a specific room
      this.roomReviews = await this.roomService.getRoomReviewByRoomId(this.id)

      // update the count of the reviews
      this.items = this.roomReviews.length

      // Step 2: Enrich each review with guest details
      // Using Promise.all to process all reviews concurrently
      const enrichedReviews = await Promise.all(this.roomReviews.map(async (review) => {

        try {

          // Extract userId from the review
          const userId = review.userId

          // Fetch guest details based on the userId
          const guestDetails = await this.userService.getGuestById(userId)

          // Return the review object with additional guest details
          return {
            ...review,
            guest: guestDetails // Attach guest details to the review
          }

        }
        catch (error) {

          // Return the review with guest set to null as a fallback
          return {
            ...review,
            guest: null // Fallback to null if guest details can't be fetched
          }
        }
      }))

      // Step 3: Update the roomReviews property with the enriched data
      this.roomReviews = enrichedReviews

    } catch (error) {

      // Log any errors that occur during the fetching or enrichment process
      console.log('Error fetching or enriching room reviews:', error)
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

  /**
  * @method handlePagenator
  * @description Helper function to handle pagination events and update the visible data range based on the current page and page size.
  * 
  * @param {PageEvent} event - The pagination event containing details such as the current page index and page size.
  * @returns {PageEvent} - The same pagination event for further handling or reference.
  * 
  * Functionality:
  * - Updates the lowIndex to reflect the start index of the current page.
  * - Updates the highIndex to reflect the end index of the current page.
  */
  handlePagenator(event: PageEvent): PageEvent {
    // initialize lowindex and high index property
    this.lowIndex = event.pageIndex * event.pageSize
    this.highIndex = this.lowIndex + event.pageSize
    return event
  }

 /**
 * @function generateStars
 * @description Converts a numeric rating into a star string.
 * @param {number} rating - The rating (1-5).
 * @returns {string}
 */
 generateStars(rating: number): string {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
 }

}
