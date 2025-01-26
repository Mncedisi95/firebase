import { Injectable } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { getDoc,collection, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
  * @constructor
  * @description
  * @param {Firestore} firestore 
  */
  constructor(private firestore: Firestore) { }

  async getGuestById(guestId: any) :  Promise<{ [key: string]: any }> {

    try {
  
      const guestDoc = await getDoc(doc(this.firestore, 'users',guestId))

      if (guestDoc.exists()) {

        return guestDoc.data()
      } 
      else {

        throw new Error('Guest not found');
      }
    } 
    catch (error) {

      console.error(`Error fetching guest with ID ${guestId}:`, error);
      throw new Error(`Failed to fetch guest details for ID ${guestId}`);
    }
  }

  /**
  * @async 
  * @method updateUserProfile
  * @description Updates the user's profile in Firebase Authentication and Firestore
  * @param {string} userId - The user's ID
  * @param {Partial<any>} updatedData - The data to update
  * @returns {Promise<void>} - A promise that resolves when the profile is updated
  */
  async updateUserProfile( userId: any, updatedData: Partial<any>): Promise<void> {

    try {

      // Update Firestore user document
      if (userId) {

        // Reference to the document
        const userDocRef = doc(this.firestore, 'users/' + userId)
        // Perform the update
        await updateDoc(userDocRef, updatedData)

        console.log('User profile updated successfully')
      }

    } catch (error) {
      console.error('Error updating user profile:', error)
      // Re-throw the error for further handling
      throw error
    }
  }
  
}
