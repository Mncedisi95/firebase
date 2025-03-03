import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signOut } from '@angular/fire/auth';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { Firestore, doc } from '@angular/fire/firestore';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any | null>(null)

  currentUser$ = this.currentUserSubject.asObservable()

  /**
  * @constructor
  * @description Initializes the component with necessary dependencies.
  * @param {Auth} auth - Service for handling authentication-related operations. 
  */
  constructor(private auth: Auth, private  firestore: Firestore) { 

    this.observeAuthState()
  }

  /** 
  * @method login
  * @description Authenticates the user by signing them in using email and password.
  * Utilizes Firebase's signInWithEmailAndPassword method to handle authentication.
  * 
  * @param {string} email  - The user's email address. Must be a valid email format.
  * @param {string} password - The user's password. Must meet the application's security criteria.
  * 
  * @returns {Promise<UserCredential>} A promise that resolves with the authenticated user's credentials or rejects with an error.
  */
  async login(email: string, password: string): Promise<UserCredential> {

    try {

      // Sign in the user with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)

      console.log(userCredential);
    
      return userCredential
      
    } catch (error) {
      // Rethrow the error to be handled by the caller
      console.error('Login failed:', error);
      throw error
    }
  }

  /**
  * @method register
  * @description Registers a new user account using Firebase authentication and Firestore for user data storage.
  * Creates a user with email and password authentication and stores additional user information in Firestore.
  * Assigns the user an initial role (default: 'admin').
  *
  * @param {string} name - The user's full name for profile identification.
  * @param {string} email - The user's email address, in a valid email format.
  * @param {string} phone - The user's phone number for contact purposes.
  * @param {File} profile - The user's profile picture file, to be stored as a base64 string.
  * @param {string} address - The user's physical address.
  * @param {string} password - The user's password, meeting security requirements.
  * @returns {Promise<UserCredential>} A promise that resolves with the registered user's credentials or rejects with an error.
  * @throws {FirebaseError} If an error occurs during user creation or Firestore operations.
  */
  async register(name: string, email: string, phone: string, profile: File, address: string, password: string): Promise<UserCredential> {

    try {

    // Create user with email and password authentication
    const userCreditial = await createUserWithEmailAndPassword(this.auth, email, password)

    // Reference to Firestore document for the new user
    const userRef = doc(this.firestore, 'users/'+ userCreditial.user.uid)

    // Store additional user data in Firestore
    await setDoc(userRef, {
      name,
      email,
      phone,
      profile,
      address,
      uid: userCreditial.user.uid,
      role: 'guest',
    }) 

    return userCreditial;
      
    } catch (error) {

      console.error('Error during user registration:', error);
      throw error
    }
  }

  /**
  * @private
  * @method observeAuthState
  * @description Observes changes to the user's authentication state in Firebase.
  * This method subscribes to Firebase's authentication state changes and updates 
  * the currentUserSubject observable with the authenticated user or null.
  * It ensures real-time updates to the current user state across the application.
  */
  private observeAuthState() {

    onAuthStateChanged(this.auth, (user) => {
      // Emit the authenticated user or null if logged out
      this.currentUserSubject.next(user)
    },
    (error) => {
      // Log the error for debugging purposes
      console.log('Error observing auth state:', error)
    })
  }

  /**
  * @method getCurrentUser
  * @description Retrieves the current authenticated user from the `currentUserSubject`.
  * This method provides a synchronous way to access the latest authentication state of the user.
  * 
  * @returns {User | null} The currently authenticated user object, or null if no user is logged in.
  */
  getCurrentUser():  any | null {
    return this.currentUserSubject.value !== null
  }

  /**
  * @method hasRole
  * @description Retrieves the role of the currently authenticated user by querying 
  * the Firestore database. Returns the user's role if available.
  * 
  * @returns {Promise<string>} A promise that resolves with the user's role (e.g., 'admin', 'staff', 'guest').
  * Resolves with an empty string if the user is not authenticated or the role cannot be determined.
  */
  async hasRole(): Promise<string> {

    const currentUser = this.auth.currentUser

    if(!currentUser){
      return ''
    }

    try {

      const userDocRef = doc(this.firestore, 'users', currentUser.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data() as { role?: string }
        // Return the role if it exists, otherwise return an empty string
        return userData.role  || ''
      } else {
        console.log('User document not found');
        return '';
      }
      
    } catch (error) {
      console.log('Error fetching user role:', error);
      return '';
    }
  }

  /**
  * @method isLoggedIn
 '' * @description Checks if a user is currently authenticated.
  * This method simplifies authentication checks by returning a boolean value.
  * 
  * @returns {boolean} true if a user is logged in, otherwise `false`.
  */
  isLoggedIn(): boolean {

    return !!this.getCurrentUser()
  }

  /**
  * @method resetPassword
  * @description Sends a password reset email to the specified email address.
  * This method uses Firebase's sendPasswordResetEmail to trigger a reset email.
  * The user can follow the instructions in the email to reset their password.
  * 
  * @param {string} email - The user's registered email address. Must be in a valid email format.
  * @returns {Promise<void>} A promise that resolves if the email was sent successfully or rejects with an error.
  */
  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email)
  }

  /**
  * @method trackPasswordReset
  * @description Monitors user authentication state and updates Firestore when a password reset is detected.
  */
  private async trackPasswordReset(user: any) {

    try {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // ✅ Update only if passwordChanged is false
        if (!userData?.['passwordChanged']) {
          await updateDoc(userDocRef, { passwordChanged: true });
          console.log('Password reset tracked successfully!');
        }
      }
    } catch (error) {
      console.error('Error updating passwordChanged field:', error);
    }
  }

  /**
  * @method logout
  * @description Logs the user out of the application by terminating their current authentication session.
  * This method uses Firebase's signOut function to sign the user out.
  * Once the user is logged out, they will need to sign in again to access authenticated features.
  * 
  * @returns {Promise<void>} A promise that resolves when the user has been successfully signed out or rejects with an error if the operation fails.
  */
  logout(): Promise<void> {
    return signOut(this.auth)
  }
}
