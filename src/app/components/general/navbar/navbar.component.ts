import { NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';


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
    * @property {boolean} isAdmin
    */
   isAdminOrStaff: boolean = false

    /**
    * @property {any} guestDetails 
    */
    guestDetails : any

    /**
    * @property {any} id 
    */
    id : any

    /** @property {string} userRole */

    userRole : string = ''
    
    /**@property {boolean} isMobileMenuOpen */

    isMobileMenuOpen : boolean = false

   /**
   * @constructor
   * @description
   * @param {Router} router 
   */
   constructor(private router: Router,private authService: AuthService,private userService : UserService){}

   /**
   * @description
   */
  ngOnInit(){

    this.authService.currentUser$.subscribe((user) => {

      if(user){

        this.isLoggedIn = !!user
        this.id = user.uid

        this.fetchGuestDetails()

        // Check if user has admin role
        this.authService.hasRole().then(role =>{

        // Fetch the user role from your authentication service or session storage
        this.isAdminOrStaff = role === 'admin' || role === 'staff'
        this.userRole = role
        })
      }
      else {
        this.isLoggedIn = false;
        this.isAdminOrStaff = false;
      }
    })

    this.router.events.subscribe(() => {
      const authRoutes = ['/login','/register','/forgot-password']
      this.isAuthPage = authRoutes.includes(this.router.url)
    })
  }

   /**
  * @async
  * @method fetchGuestDetails
  * @description Fetches guest details from the database based on the provided guest ID. 
  *              Logs an error if the ID is missing or the request fails.
  * @returns {Promise<void>} Resolves when guest details are fetched and assigned successfully.
  */
   async fetchGuestDetails(): Promise<void> {

    if (!this.id) {
      console.error('Guest ID is undefined. Cannot fetch guest details.');
      return
    }

    try {
    
      // Fetch guest details from the service
      this.guestDetails = await this.userService.getGuestById(this.id)

    } catch (error) {
      // Handle potential errors gracefully
      console.log('Error fetching guest details:', error);
    }
  }

  /**
  * @method toggleMobileMenu
  * @description 
  */
  toggleMobileMenu() {
    
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
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
      this.isLoggedIn = false;
      this.isAdminOrStaff = false;
      this.router.navigate(['/index'])
    })
    .catch((error) => {
      console.log(error);
    })
  }

}
