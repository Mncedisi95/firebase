import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-booking',
  imports: [RouterLink],
  templateUrl: './view-booking.component.html',
  styleUrl: './view-booking.component.css'
})
export class ViewBookingComponent {

  /**
  * @constructor
  * @description 
  * @param router 
  */
  constructor(private router:Router){}

  /**
  * @method goToChangeBooking 
  */
  goToChangeBooking():void {

    this.router.navigate(['/edit-booking'])
  }



}
