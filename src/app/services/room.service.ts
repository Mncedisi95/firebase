import { Injectable } from '@angular/core';
import { deleteDoc, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, DocumentReference, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  

  /**
  * @constructor
  * @description
  * @param {Firestore} firestore 
  */
  constructor(private firestore: Firestore) {}

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
        status: 'Available'
      }

      const documentReference = await addDoc(roomCollection, roomData)
      console.log('Room added successfully:', documentReference.id)

      return documentReference

    } catch (error) {

      console.error('Error during user registration:', error);
      throw error
    }
  }

  
  async bookRoom(userId: any, roomId: any, checkIn: any, checkOut: any,numberOfGuest: any,specialRequests:any):  Promise<DocumentReference>{

    try {
      
      // Firestore collection reference
      const bookingCollection = collection(this.firestore, 'bookings')

      const bookingData = {

        userId,
        roomId,
        checkIn,
        checkOut,
        numberOfGuest,
        creationDate:  new Date().toISOString(),
        status: 'Pending',
        paymentStatus: 'unpaid',
        specialRequests
      }

      const docRef = await addDoc(bookingCollection, bookingData)
      console.log('booking added successfully:', docRef.id)

      return docRef

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
  * @method getAvailableRooms
  * @description Fetches a list of available rooms from the Firestore database where the status is "Available."
  * @returns {Promise<Array<{id: string, [key: string]: any}>>} A promise that resolves to an array of available room objects.
  * Each room object contains an `id` and all other room properties from the Firestore document.
  * @throws {Error} Throws an error if the Firestore query fails.
  */
  async getAvailableRooms(): Promise<Array<{ id: string; [key: string]: any }>>{

    try {

      // Construct Firestore query to fetch rooms with status 'Available'
      const roomsQuery = query(
        collection(this.firestore,'rooms'),
        where('status', '==', 'Available'))

      // Execute the query and fetch documents
      const roomSnap = await getDocs(roomsQuery)

      // Map the documents into an array of room objects
      return roomSnap.docs.map((doc) => ({

        id:doc.id,  // Include the document ID
        ...doc.data() // Include all other document fields
      }))
      
    } catch (error) {

      console.log('Error fetching available rooms:', error)
      throw new Error('Unable to fetch available rooms. Please try again later.')
    }
  }

  /**
  * @method getBookedRooms
  * @description Fetches all rooms with a "Booked" status from the Firestore database.
  * @returns {Promise<Array<{ id: string; [key: string]: any }>>} A promise resolving to an array of room objects.
  * Each object contains the room's Firestore document ID and its associated data.
  * @throws Will throw an error if fetching the booked rooms fails.
  */
  async getBookedRooms(): Promise<Array<{ id: string; [key: string]: any }>> {

    try {

      // Construct Firestore query to fetch rooms with status 'Available'
      const roomQuery = query(
      collection(this.firestore, 'rooms'),
      where('status', '==', 'Booked'))

      // Execute the query and fetch documents
      const roomSnap = await getDocs(roomQuery)

      // Map the fetched documents into an array of room objects
      return roomSnap.docs.map((doc) => ({

        id: doc.id, // Include the document ID
        ...doc.data() // Include all other document fields
      }))
      
    } catch (error) {

      // Log the error and rethrow a user-friendly message
      console.log('Error fetching booked rooms:', error)
      throw new Error('Unable to fetch Booked rooms. Please try again later.')
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
  * @method updateRoomStatus
  * @description Updates the status of a room in the database.
  * @param {string} roomId - The ID of the room to update.
  * @param {string} status - The new status to set for the room (e.g., 'Available', 'Booked', 'Maintenance').
  * @returns {Promise<void>}
  */
  async updateRoomStatus(roomId: string, status: string): Promise<void> {

    try {

      // Reference to the specific room document
      const roomRef = doc(this.firestore, 'rooms', roomId);

      // Update the room's status field
      await updateDoc(roomRef, { status })

      console.log('Room status updated successfully: Room ID:' + roomId + ', Status:' + status)
      
    } catch (error) {
      
      console.log('Error updating room status:', error);
      throw new Error('Unable to update room status. Please try again later.')
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

  /**
  * @method getBookings
  * @description Fetches all bookings from the Firestore 'bookings' collection.
  * This method retrieves a list of all bookings, each containing its unique ID and associated data.
  * @returns {Promise<Array<{ id: string; [key: string]: any }>>} - A promise that resolves to an array of booking objects.
  * @throws {Error} Throws an error if fetching bookings fails.
  */
  async getBookings(): Promise<Array<{ id: string; [key: string]: any }>> {

    try {
      // Reference the Firestore 'bookings' collection
      const bookingsRef = collection(this.firestore, 'bookings')
      // Fetch all documents from the collection
      const querySnapshot = await getDocs(query(bookingsRef))

      // Map the documents into a structured array with IDs and data
      return querySnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data() //Document Data
      }))
      
    } catch (error) {
      
      console.log('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings. Please try again later.')
    }
  }

  /**
 * @method getBookingsByGuestId
 * @description Fetches all bookings for a specific guest using their ID.
 * @param {string} guestId - The ID of the guest to filter bookings by.
 * @returns {Promise<Array<{ id: string; [key: string]: any }>>} A promise that resolves to an array of booking objects.
 */
async getBookingsByGuestId(guestId: string): Promise<Array<{ id: string; [key: string]: any }>> {
  try {
    // Validate input
    if (!guestId) {
      throw new Error('Guest ID is required to fetch bookings.');
    }

    // Reference the Firestore 'bookings' collection and filter by guestId
    const bookingsQuery = query(
      collection(this.firestore, 'bookings'),
      where('userId', '==', guestId)
    );

    // Execute the query and fetch the matching documents
    const querySnapshot = await getDocs(bookingsQuery);

    // Map the results to an array of booking objects
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.log('Error fetching bookings for guest:', error);
    throw new Error('Unable to fetch guest bookings. Please try again later.');
  }
}


}
