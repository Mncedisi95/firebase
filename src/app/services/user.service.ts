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
  * @method getUsers
  * @description Retrieves all users with the role of 'guest' from the Firestore 'users' collection.
  *              Each returned guest object includes the document ID and associated data.
  * 
  * @returns {Promise<Array<{ id: string; [key: string]: any }>>} A promise that resolves to an array of guest objects.
  * @throws {Error} Throws an error if there is an issue retrieving the guests from Firestore.
  */
  async getUsers() : Promise<Array<{ id: string;[key: string]: any }>> {

    try {

      // Reference the Firestore 'users' collection
      const docRef = collection(this.firestore, 'users')

      // Fetch all documents from the collection
      const querySnap = await getDocs(query(docRef))

      // Map the documents into an array of room objects
      return querySnap.docs.map((doc) => ({

        id: doc.id,  // Include the document ID
        ...doc.data() // Include all other document fields
      }))
    } catch (error) {
      console.log('Error fetching guests:', error)
      throw new Error('Unable to fetch guests. Please try again later.')
    }
  }

  /**
  * @async
  * @method getGuestById 
  * @param {any} guestId
  */
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

  /**
  * @async 
  * @method filterUserByRole
  * @description  Fetch users based on their role.
  * @param {string} role - The user role to filter by (e.g., "admin", "guest").
  * @returns {Promise<Array<{ id: string; [key: string]: any }>>} - A promise resolving to an array of user objects.
  */
  async filterUserByRole(role: string): Promise<Array<{ id: string; [key: string]: any }>>  {

    try {

      // Create Firestore query to fetch users with the specified role
      const userQuery = query(
        collection(this.firestore, 'users'),
        where('role', '==', role)) // Filter users by role

      // Execute the query and fetch documents 
      const userSnap = await getDocs(userQuery)

      // Map the documents into an array of user objects
      return userSnap.docs.map((doc) => ({
        id : doc.id, // Include the document ID
        ...doc.data() // Include all other document fields
      }))
      
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return [] // Return empty array if an error occurs
    }
  }
  
}
