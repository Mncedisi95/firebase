import { Injectable } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { getDoc,collection, updateDoc, query, where, getDocs } from 'firebase/firestore';

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

 /**
  * Fetches a list of guests from the Firestore database.
  *
  * @async
  * @method getGuests
  * @description Retrieves all users with the role of 'guest' from the Firestore 'users' collection.
  *              Each returned guest object includes the document ID and associated data.
  * 
  * @returns {Promise<Array<{ id: string; [key: string]: any }>>} A promise that resolves to an array of guest objects.
  * @throws {Error} Throws an error if there is an issue retrieving the guests from Firestore.
  */
  async getGuests() : Promise<Array<{ id: string;[key: string]: any }>> {

    try {

      // Construct Firestore query to fetch users with the role of 'guest'
      const guestsQuery = query(
      collection(this.firestore, 'users'),
      where('role', '==', 'guest'))

      // Execute the query and fetch documents
      const guestSnap = await getDocs(guestsQuery)
      
      // Map the documents into an array of room objects
      return guestSnap.docs.map((doc) => ({

        id: doc.id,  // Include the document ID
        ...doc.data() // Include all other document fields
      }))
    } catch (error) {
      console.log('Error fetching guests:', error)
      throw new Error('Unable to fetch guests. Please try again later.')
    }
  }

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
