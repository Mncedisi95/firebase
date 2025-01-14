import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-bookings',
  imports: [RouterLink],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.css'
})
export class ManageBookingsComponent {

  
  /**
  * @constructor
  * @param {Router} router 
  */
  constructor(private router: Router){}


  /**
  * @description 
  */
  ngOnInit(){

    // Load Bookings
  }

  /**
  * @method loadBookings
  * @description 
  */
  loadBookings(){}

  /**
  * @method
  * @description
  */
  goToViewBooking(){

    this.router.navigate(['/booking-details'])
  }

}
