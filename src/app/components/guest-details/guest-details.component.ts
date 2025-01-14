import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-guest-details',
  imports: [RouterLink],
  templateUrl: './guest-details.component.html',
  styleUrl: './guest-details.component.css'
})
export class GuestDetailsComponent {


  editGuest(){}

  removeGuest(){}

}
