import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { NgIf } from '@angular/common';

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
  * @constructor
  * @description
  * @param {Router} router 
  * @param {ActivatedRoute} route
  * @param {RoomService} roomService
  */
  constructor(private router: Router,private route: ActivatedRoute,private roomService: RoomService){}

  /**
   * @description 
   */
  ngOnInit(){

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

}
