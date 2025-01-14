import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-rooms',
  imports: [RouterLink],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

  /**
   * @constructor
   * @param router 
   */
  constructor(private router:Router){}

  /**
   * @method goToBookRoom
   * @description 
   */
  goToBookRoom(){
    this.router.navigate(['/book-room'])
  }

  /**
   * @method goToRoomDetails
   * @description 
   */
  goToRoomDetails(){

    this.router.navigate(['/room-details'])
  }
}
