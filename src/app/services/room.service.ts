import { Injectable } from '@angular/core';
import { deleteDoc, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, DocumentReference, getDoc, getDocs, query, updateDoc } from 'firebase/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  /**
  * @property {any} collectionRef
  */
  private collectionRef: any

  /**
  * @constructor
  * @description
  * @param {Firestore} firestore 
  */
  constructor(private firestore: Firestore) {

    this.collectionRef = collection(this.firestore, 'rooms')
  }

  /**
   * @async
   * @method addRoom 
   * @description  Adds a new room to the Firestore database.
   * 
   * @param {number} roomNumber - The unique number identifying the room.
   * @param {string} roomType - The type of the room (e.g., single, double, suite).
   * @param {File} roomImage - The image file representing the room.
   * @param {string} price - The price per night for the room.
   * @param {number} capacity - The maximum number of occupants allowed in the room.
   * @param {number} size - The size of the room in square meters.
   * @param {string} bedType - The type of bed available in the room (e.g., queen, king, twin).
   * @param {string} services - Additional services offered with the room (comma-separated values).
   * @param {string} description - A detailed description of the room.
   * @returns {Promise<DocumentReference>} A promise that resolves with the document reference of the newly added room.
   * @throws {Error} Throws an error if the Firestore operation fails or if image conversion encounters an issue.
   */
  async addRoom(roomNumber: number, roomType: string, roomImage: any, price: number, capacity: number, size: number, bedType: string, services: string, description: string): Promise<DocumentReference> {

    try {

      // Firestore collection reference
      const roomCollection = collection(this.firestore, 'rooms')
      
      // Add room data to Firestore
      const roomData = {
        roomNumber,
        roomType,
        roomImage,
        price,
        capacity,
        size,
        bedType,
        services,
        description,
        createdAt: new Date().toISOString(),
      }

      const documentReference = await addDoc(roomCollection, roomData)
      console.log('Room added successfully:', documentReference.id)

      return documentReference

    } catch (error) {

      console.error('Error during user registration:', error);
      throw error
    }
  }

  /**
  * Fetches all room data from the Firestore database.
  * 
  * @async
  * @method getRooms
  * @description Retrieves a list of rooms from the Firestore collection 'rooms'.
  * Each room document includes its ID and all associated data fields.
  * 
  * @returns {Promise<Array<{id: string, [key: string]: any}>>} A promise that resolves to an array of room objects.
  * Each object contains the document ID and its associated data.
  * @throws {Error} Throws an error if the room data retrieval fails.
  */
  async getRooms(): Promise<Array<{ id: string; [key: string]: any }>>{
    
    try {
      // Reference the Firestore 'rooms' collection
      const docRef = collection(this.firestore,'rooms')
      // Fetch all documents from the collection
      const querySnapshot = await getDocs(query(docRef))

      // Map the documents into a structured array with IDs and data
      return querySnapshot.docs.map((doc) => {

        const data = doc.data()
        
        return {
          id: doc.id, // Include the document ID
          ...data // Spread the document data
        }
      })
    } catch (error) {

      console.log('Error fetching rooms:', error);
      throw new Error('Failed to fetch rooms. Please try again later.')
    }
  }

  /**
  * Fetches room details by room ID.
  * @async
  * @method getRoomById
  * @description Retrieves the room details from Firestore using the room's unique ID.
  * @param {any} id - The unique identifier of the room.
  * @returns {Promise<any>} A promise that resolves to the room details or rejects with an error.
  */
  async getRoomById(id: any): Promise<any>{

    try {

      // Reference to the room document
      const roomRef = doc(this.firestore, 'rooms/' + id)

      // Fetch the document from Firestore
      const roomSnap = await getDoc(roomRef)

       // Check if the document exists
       if (roomSnap.exists()) {

        return { id: roomSnap.id, ...roomSnap.data() }
      } else {

        throw new Error('Room not found');
      }
      
    } catch (error) {
      
      console.log('Error fetching room by ID:', error);
      throw error
    }
  }

  /**
  * @async
  * @method updateRoom
  * @description Updates the details of a specific room in the Firestore database. 
  * This method allows modifying any field of the room's data using its unique ID.
  *
  * @param {string} roomID - The unique identifier of the room to be updated.
  * @param {Record<string, any>} updatedData - An object containing the fields to update with their new values.
  * @returns {Promise<void>} A promise that resolves when the update is successful or rejects with an error.
  * @throws Will throw an error if the Firestore update operation fails.
  */
  async updateRoom(roomID: string, updatedData: Record<string, any>):  Promise<void>{

    try {
      // Reference to the specific room document in the Firestore collection
      const postRef = doc(this.firestore, 'rooms/' + roomID)
    
      // Update the room document with the provided data
      await updateDoc(postRef,updatedData)
      console.log('Room with ID ' + roomID + ' successfully updated.');

    } catch (error) {
      
      console.error('Error updating room with ID ' + roomID + ':', error);
      throw new Error('Failed to update room:' + error );
    }
  }

  /** 
  * 
  * @async
  * @method deleteRoom
  * @description - Deletes a room from the Firestore database by its ID.
  * @param {string} roomID - The unique identifier of the room to be deleted.
  * @returns {Promise<void>} - Resolves when the room is successfully deleted. Rejects with an error otherwise.
  * @throws {Error} Throws an error if the deletion process fails.
  */
  async deleteRoom(roomID: any): Promise<void> {

    if (!roomID) {
      throw new Error('Invalid roomID: roomID cannot be null or undefined.');
    }

    try {
      // Reference to the specific room document
      const roomRef = doc(this.firestore, 'rooms/' + roomID)

      // Delete the document from Firestore
      await deleteDoc(roomRef)

      // Log success message
      console.log('Room with ID' + roomID + 'deleted successfully.')

    } catch (error) {
      
    // Log the error for debugging purposes
    console.error('Error deleting room with ID ' + roomID + ', error');

    // Re-throw the error for further handling if needed
    throw new Error('Failed to delete the room. Please try again later.')
    }
  }
}
