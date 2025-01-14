import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-details',
  imports: [RouterLink],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent {

  updateStatus(event: any) {
    // API call to update booking status
    console.log('Status updated to:');
  }

  editBooking() {
    // Redirect to edit booking page
    console.log("Editing booking...");
  }

  cancelBooking() {
    // API call or modal confirmation to cancel booking
    console.log("Booking cancelled.");
  }

}
