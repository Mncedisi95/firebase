import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { NgFor } from '@angular/common';
import { SortByDatePipe } from '../../sort-by-date.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-booking',
  imports: [RouterLink,NgFor,SortByDatePipe],
  templateUrl: './view-booking.component.html',
  styleUrl: './view-booking.component.css'
})
export class ViewBookingComponent {

  /**
  * @property {any} guestId
  */
  guestId: any

  /**
  * @property {any[]} bookings
  */
 bookings : any[] = []

  /**
  * @constructor
  * @description 
  * @param router 
  */
  constructor(private router:Router,private roomService: RoomService,private authService:AuthService){}

  ngOnInit(){

    this.authService.currentUser$.subscribe((user) => {
      this.guestId = user.uid
    })
  

    this.fetchGuestBookings()
  }

  /**
   * @method fetchGuestBookings()
   * @description
   * 
   */
  async fetchGuestBookings() {

    try {
      this.bookings = await this.roomService.getBookingsByGuestId(this.guestId)
      console.log('Bookings for guest:', this.bookings)
    
    } catch (error) {
      console.error('Error fetching guest bookings:', error);
    }
  }

  /**
  * @method goToChangeBooking 
  */
  goToChangeBooking():void {

    this.router.navigate(['/edit-booking'])
  }



}
