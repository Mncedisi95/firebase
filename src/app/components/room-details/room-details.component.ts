import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-room-details',
  imports: [RouterLink],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent {

  /**
  * @constructor
  * @description
  * @param {Router} router 
  */
  constructor(private router: Router){}

  /**
  * @method goToEditRoom
  * @description 
  */
  goToEditRoom(): void{
    // navigate to edit room component
    this.router.navigate(['/edit-room'])
  }

}
