import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { error } from 'console';
import { RoomService } from '../../services/room.service';


@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  /**
  * @property {any[]} rooms
  */
  rooms: any[] = []

  /**
  * @property {any[]} availableRooms
  */
  availableRooms : any[] = []

  /**
  * @property {any[]} todayCheckIns 
  */
  todayCheckIns: any[] = []

  /**
  * @property {number} items
  */
  items : number = 0

  /**
  * @property {number} availableItems
  */
  availableItems: number = 0

  /**
   * @property {number} todayCheckInsItems
   */
  todayCheckInsItems: number = 0

  /**
  * @property {number} occupancyRate 
  */
  occupancyRate  : number = 0

  /**
  * @constructor
  * @description 
  * @param {AuthService} authService 
  * @param {Router} router
  * @param {RoomService} roomService 
  */
  constructor(private authService: AuthService, private router: Router,private roomService: RoomService){}

  /**
   * @description
   */
  ngOnInit(){

    this.fetchRooms()

    this.fetchAvailableRooms()

    this.fetchTodayCheckIns()
  }

  /**
  * Fetches and updates the list of rooms from the database.
  * 
  * @async
  * @method fetchRooms
  * @description Retrieves room data by calling the `getRooms` method from the `roomService`.
  * Updates the component's `rooms` property with the fetched data.
  * Logs the retrieved data for debugging purposes.
  * 
  * @returns {Promise<void>} Resolves when the rooms have been successfully fetched and stored.
  * @throws {Error} Logs an error if the room retrieval process fails.
  */
  async fetchRooms(): Promise<void>{

    try {

      // Call the room service to fetch room data
      this.rooms = await this.roomService.getRooms()
      // Update the count of rooms
      this.items = this.rooms.length

      // Log the fetched rooms for debugging purposes
      console.log('Rooms:', this.rooms)
      
    } catch (error) {

      // Handle and log errors during the fetch process
      console.log('Error fetching rooms:', error)
    }
  }

  /**
  * @async
  * @method fetchAvailableRooms
  * @description Fetches the list of available rooms by calling the room service and updates the component's state.
  * This function also logs the room data for debugging and handles any errors during the fetch process.
  * @returns {Promise<void>} A promise that resolves when the room data has been successfully fetched and processed.
  */
  async fetchAvailableRooms(): Promise<void> {

    try {

      // Fetch available rooms from the room service
      this.availableRooms = await this.roomService.getAvailableRooms()

      // Update the count of available rooms
      this.availableItems = this.availableRooms.length

     // Debugging: Log the fetched room data
     console.info('Fetched Available Rooms:', this.availableRooms)

      
    } catch (error) {
      // Handle errors gracefully and log them
      console.log('Error fetching available rooms:', error)
    }
  }

  /**
  * Fetches and processes the list of rooms scheduled for check-in today.
  *
  * @async
  * @method fetchTodayCheckIns
  * @description
  * This method retrieves all the check-ins scheduled for the current day using the `roomService`. 
  * It updates the list of check-ins and their count while handling potential errors gracefully.
  * 
  * @returns {Promise<void>} Resolves when the check-in data is successfully fetched and processed.
  */
  async fetchTodayCheckIns(): Promise<void>{

    try {

      // Fetch check-ins for today from the room service
      this.todayCheckIns = await this.roomService.fetchTodayCheckIns()

      // Update the count of today's check-in rooms
      this.todayCheckInsItems = this.todayCheckIns.length

      // Debugging: Log the fetched room data
      console.log('Fetched today check-ins:', this.todayCheckIns)
      
    } catch (error) {
        // Handle errors gracefully and log them for debugging
        console.error('Error fetching today check-ins:', error)
    }
  }

  /** 
  * @method calculateOccupancyRate
  */
  calculateOccupancyRate(): void {

    this.occupancyRate = (this.todayCheckInsItems / this.availableItems) * 100
  }

  /**
  * @method logout
  * @description Logs the user out of the application, navigates to the login page, 
  *              and handles potential errors during the process.
  * @returns {void}
  */
  logout() : void{

    this.authService.logout()
    .then(() => {

      console.log('User logged out')
      this.router.navigate(['/index'])
       // Navigate the user to the home page upon successful logout
    })
    .catch((error) => {
       // Log the error and provide feedback to the user
       console.error('An error occurred during logout:', error);
    })
  }

}
