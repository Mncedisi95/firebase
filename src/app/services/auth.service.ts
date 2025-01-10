import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from '@angular/fire/auth';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
  * @constructor
  * @description Initializes the component with necessary dependencies.
  * @param {Auth} auth - Service for handling authentication-related operations. 
  */
  constructor(private auth: Auth) { }

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
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  /** 
  * @method register
  * @description Creates a new user account using email and password authentication.
  * This method utilizes Firebase's createUserWithEmailAndPassword to register a new user.
  * Optionally, the user's name can be stored for profile updates post-registration.
  * 
  * @param {string} name - The user's full name. This can be used for updating the user's profile information.
  * @param {string} email - The user's email address. Must be in a valid email format.
  * @param {string} password - The user's password. Must meet the application's password security requirements.
  * @returns {Promise<UserCredential>} A promise that resolves with the registered user's credentials or rejects with an error.
  */
  register(name: string, email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
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
