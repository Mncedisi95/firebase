import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-guest-details',
  imports: [RouterLink],
  templateUrl: './guest-details.component.html',
  styleUrl: './guest-details.component.css'
})
export class GuestDetailsComponent {

  /**
  * @property {any} id
  */
  id: any

  /**
  * @property {any} guestDetails
  */
  guestDetails : any

  /**
  * @constructor
  * @description
  * @param {ActivatedRoute} route 
  * @param {UserService} userService 
  */
  constructor(private route: ActivatedRoute,private userService: UserService){}

  /**
   * @method ngOnInit
   */
  ngOnInit(){

    this.id = this.route.snapshot.paramMap.get('id') || ''

    this.fetchGuestDetails()
  }

  /**
   * @async
   * @method fetchGuestDetails
   * @description 
   */
  async fetchGuestDetails() : Promise<void> {

    try {
      
      this.guestDetails = await this.userService.getGuestById(this.id)

    } catch (error) {

      console.error('Error fetching guests:', error)
    }
  }

  editGuest(){}

  removeGuest(){}

}
