import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { error } from 'console';


@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  /**
  *@property {boolean} menuOpen 
  */
  menuOpen: boolean = false

   /**
  *@property {boolean} isDropdownOpen 
  */
  isDropdownOpen: boolean = false;

  /**
  * @constructor
  * @description 
  * @param authService 
  * @param router 
  */
  constructor(private authService: AuthService, private router: Router){}

  toggleMenu = (): void => {

    this.menuOpen = !this.menuOpen
  }

  /**
  * @method toggleDropdown 
  */
  toggleDropdown() {

    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(){
    this.authService.logout()
    .then(() => {

      this.menuOpen = false;
      console.log('User logged out');
      this.router.navigate(['/login']);
    })
    .catch((error) => {
      console.log(error);
    })
  }

}
