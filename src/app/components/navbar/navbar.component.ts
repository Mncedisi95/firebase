import { NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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
   * @property {boolean} isLoggedIn 
   */
   isLoggedIn : boolean = false

   /**
   * @constructor
   * @description
   * @param {Router} router 
   */
   constructor(private router: Router,private authService: AuthService){}

   /**
   * @description
   */
  ngOnInit(){

    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user
    })

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

  /**
   * @method toggleMenu
   * @description 
   */
  toggleMenu = (): void => {

    this.menuOpen = !this.menuOpen
  }

  /**
   * 
   * @param event 
   */
  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {
    if (!(event.target as HTMLElement).closest('.user-menu')) {
      this.menuOpen = false;
    }
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
      console.log('User logged out')
      this.router.navigate(['/index'])
    })
    .catch((error) => {
      console.log(error);
    })
  }


}
