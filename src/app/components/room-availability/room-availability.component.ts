import { Component } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-room-availability',
  imports: [NgFor],
  templateUrl: './room-availability.component.html',
  styleUrl: './room-availability.component.css'
})
export class RoomAvailabilityComponent {

  /**
  * @property {any[]} rooms
  */
  rooms: any[] = []

  /**
  * @property {any[]} availableRooms
  */
  availableRooms: any[] = []

  /**
  * @property {any[]} bookedRooms
  */
 bookedRooms : any[] = []

  /**
  * @property {number} items
  */
  items: number = 0

  /**
  * @property {number} availableItems
  */
  availableItems: number = 0

  /**
  * @property {numbe} bookedItems
  */
  bookedItems : number = 0

  /**
  * @constructor
  * @param {RoomService} roomService
  */
  constructor(private roomService: RoomService) { }

  ngOnInit() { 

    this.fetchRooms()

    this.fetchAvailableRooms()

    this.fetchBookedRooms()
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
  async fetchRooms(): Promise<void> {

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
  * @method fetchBookedRooms
  * @description Fetches the list of rooms with a "Booked" status and updates the local state.
  * Calls the room service to retrieve data, logs the results, and handles errors gracefully.
  * @returns {Promise<void>} Resolves when the operation is complete.
  */
  async fetchBookedRooms(): Promise<void> {

    try {

      // Fetch booked rooms from the room service
      this.bookedRooms = await this.roomService.getBookedRooms()

      // Update the count of booked rooms
      this.bookedItems = this.bookedRooms.length

      // Debugging: Log the fetched room data
      console.info('Fetched Booked Rooms:', this.bookedRooms)
      
    } catch (error) {
        // Handle errors gracefully and log them
        console.log('Error fetching booked rooms:', error)
    }
  }

}