import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  guestDetails: any

  /**
  * @constructor
  * @description
  * @param {ActivatedRoute} route 
  * @param {UserService} userService 
  */
  constructor(private router: Router, private userService: UserService) { }

  /**
   * @method ngOnInit
   */
  ngOnInit() {

    // Get the current navigation object from the router
    const navigation = this.router.getCurrentNavigation()
    // Extract the state object from navigation extras, expecting an 'id' property
    const state = navigation?.extras?.state as { id?: any }

    // Check if 'id' is available in the navigation state
    if (state?.id) {
      // Assign the retrieved ID to the component property
      this.id = state.id
      // Store the ID in sessionStorage to persist across refreshes
      sessionStorage.setItem('id', this.id)
    } else {
      // Retrieve the ID from sessionStorage if the page was refreshed
      this.id = sessionStorage.getItem('id')
    }

    // If 'id' is still not available, redirect to the home page
    if (!this.id) {
      // Redirect user to the home page to prevent access without a valid ID
      this.router.navigate(['/'])
    }

    this.fetchGuestDetails()
  }

  /**
   * @async
   * @method fetchGuestDetails
   * @description 
   */
  async fetchGuestDetails(): Promise<void> {

    try {

      this.guestDetails = await this.userService.getGuestById(this.id)

    } catch (error) {

      console.error('Error fetching guests:', error)
    }
  }

  editGuest() { }

  removeGuest() { }

}
