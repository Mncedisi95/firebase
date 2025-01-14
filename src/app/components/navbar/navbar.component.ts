import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [NgIf,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

 /**
 *@property {boolean} isLoginPage 
 */
 isAuthPage: boolean = false

 /**
  *@property {boolean} isDropdownOpen 
  */
 isDropdownOpen: boolean = false;

 /**
  *@property {boolean} menuOpen 
  */
  menuOpen: boolean = false

  /**
  * @constructor
  * @description
  * @param {Router} router 
  */
  constructor(private router: Router,private authService: AuthService){}

  ngOnInit(){

    this.router.events.subscribe(() => {
      const authRoutes = ['/login','/register','/forgot-password']
      this.isAuthPage = authRoutes.includes(this.router.url)
    })
  }
  
  /**
  * @method toggleDropdown 
  */
  toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMenu = (): void => {

    this.menuOpen = !this.menuOpen
  }

  /**
  * @method goToLogin
  */
  goToLogin(): void{

   this.router.navigate(['/login'])

  }

  /**
  * @method logout
  * @description  
  */
  logout(): void{
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
