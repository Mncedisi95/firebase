import { Injectable } from '@angular/core';
import { deleteDoc, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, DocumentReference, getDoc, getDocs, limit, orderBy, Query, query, updateDoc, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  /**
  * @constructor
  * @description
  * @param {Firestore} firestore 
  */
  constructor(private firestore: Firestore) { }

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
        status: 'Available',
        bookingCount: 0,
        averageRating: 0,
        totalReviews: 0
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
  * Books a room for a user.
  *
  * @param {string} userId - The ID of the user making the booking.
  * @param {string} roomId - The ID of the room being booked.
  * @param {string} checkIn - The check-in date in ISO string format (YYYY-MM-DD).
  * @param {string} checkOut - The check-out date in ISO string format (YYYY-MM-DD).
  * @param {number} numberOfGuest - The number of guests for the booking.
  * @param {string} [specialRequests] - Optional special requests made by the user.
  * @returns {Promise<DocumentReference>} A promise resolving to the Firestore document reference of the booking.
  * @throws {Error} If validation fails or the booking operation encounters an error.
  */
  async bookRoom(userId: any, roomId: any, checkIn: any, checkOut: any, numberOfGuest: any, specialRequests: any): Promise<DocumentReference> {

    try {

      // Firestore collection reference
      const bookingCollection = collection(this.firestore, 'bookings')
      // Reference to the room document
      const roomRef = doc(this.firestore, 'rooms/' + roomId)

      // Fetch room details to get the current booking count
      const roomSnap = await getDoc(roomRef)

      if (!roomSnap.exists()) {
        throw new Error("Room not found.");
      }

      // Get the current booking count or default to 0
      const currentBookingCount = roomSnap.data()?.['bookingCount'] || 0

      // Prepare booking data
      const bookingData = {
        userId,
        roomId,
        checkIn,
        checkOut,
        numberOfGuest,
        creationDate: new Date().toISOString(),
        status: 'Pending', // Initial booking status
        paymentStatus: 'unpaid', // Initial payment status
        specialRequests,
        hasCheckedIn: false,
        hasCheckedOut: false,
      }

      // Add the booking to Firestore
      const docRef = await addDoc(bookingCollection, bookingData)

      // Increment booking count in rooms collection
      await updateDoc(roomRef, {
        bookingCount: currentBookingCount + 1,
      });

      return docRef

    } catch (error) {

      console.error('Error during user registration:', error);
      throw error
    }
  }

  /**
  * @async
  * @method addReview
  * @description Adds a new review for a room to the Firestore database.
  * This function saves user feedback, including a rating and comment, associated with a specific room.
  *
  * @param {any} reviewData 
  * @returns {Promise<DocumentReference>} A promise that resolves to the document reference of the newly added review.
  * @throws {Error} Throws an error if the operation fails.
  */
  async addReview(reviewData: any): Promise<DocumentReference> {

    try {

      // Reference the room document
      const roomRef = doc(this.firestore, "rooms", reviewData.roomId)
      const roomSnap = await getDoc(roomRef)

      if (!roomSnap.exists()) {
        throw new Error("Room not found.")
      }

      const roomData = roomSnap.data()

      const totalReviews = roomData?.['totalReviews'] || 0
      const currentAverage = roomData?.['averageRating'] || 0

      // Calculate new average rating
      const newTotalReviews = totalReviews + 1
      const newAverageRating = ((currentAverage * totalReviews) + reviewData.rating) / newTotalReviews;

      // Reference to the Firestore 'reviews' collection
      const reviewCollection = collection(this.firestore, 'reviews')

      // Add the review to Firestore
      const reviewDocRef = await addDoc(reviewCollection, reviewData)
     
      // Update the room document with the new rating
      await updateDoc(roomRef, {
        averageRating: newAverageRating,
        totalReviews: newTotalReviews
      })

      return reviewDocRef

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
  async getRooms(): Promise<Array<{ id: string;[key: string]: any }>> {

    try {
      // Reference the Firestore 'rooms' collection
      const docRef = collection(this.firestore, 'rooms')
      // Fetch all documents from the collection
      const querySnapshot = await getDocs(query(docRef))

      // Map the documents into a structured array with IDs and data
      return querySnapshot.docs.map((doc) => {

        return {
          id: doc.id, // Include the document ID
          ...doc.data() // Spread the document data
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
  async getRoomById(roomId: any): Promise<any> {

    try {

      // Reference to the room document
      const roomRef = doc(this.firestore, 'rooms/' + roomId)

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
  * Fetches booking details by ID from the Firestore database.
  *
  * @async
  * @function
  * @param {any} bookingId - The unique ID of the booking to fetch.
  * @returns {Promise<any>} A promise that resolves with the booking details if found, or rejects with an error if not found.
  * @throws {Error} Throws an error if the booking is not found or if there's a failure during the fetch operation.
  */
  async getBookingById(bookingId: any): Promise<any> {

    try {
      // Validate Booking ID
      if (!bookingId) {
        throw new Error('Booking ID is required to fetch bookings.');
      }

      // Fetch the document from Firestore
      const bookingSnap = await getDoc(doc(this.firestore, 'bookings', bookingId))

      // Check if the document exists
      if (bookingSnap.exists()) {
        return { id: bookingSnap.id, ...bookingSnap.data() }
      }
      else {
        // Document not found, throw an error
        throw new Error('Booking with ID' + bookingId + 'not found.')
      }

    } catch (error) {
      console.error('Error fetching booking with ID' + bookingId, error);
      throw new Error('Failed to fetch guest details for ID' + bookingId);
    }
  }

  /**
  * @method getAvailableRooms
  * @description Fetches a list of available rooms from the Firestore database where the status is "Available."
  * @returns {Promise<Array<{id: string, [key: string]: any}>>} A promise that resolves to an array of available room objects.
  * Each room object contains an `id` and all other room properties from the Firestore document.
  * @throws {Error} Throws an error if the Firestore query fails.
  */
  async getAvailableRooms(): Promise<Array<{ id: string;[key: string]: any }>> {

    try {

      const roomsQuery = query(
        collection(this.firestore, 'rooms'),
        where('status', '==', 'Available')
      )

      // Fetch Firestore data with abort signal
      const roomSnap = await getDocs(roomsQuery)

      return roomSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } catch (error) {

      console.error('Error fetching available rooms:', error);
      throw new Error('Unable to fetch available rooms. Please try again later.');
    }
  }

  /**
  * @method getBookedRooms
  * @description Fetches all rooms with a "Booked" status from the Firestore database.
  * @returns {Promise<Array<{ id: string; [key: string]: any }>>} A promise resolving to an array of room objects.
  * Each object contains the room's Firestore document ID and its associated data.
  * @throws Will throw an error if fetching the booked rooms fails.
  */
  async getBookedRooms(): Promise<Array<{ id: string;[key: string]: any }>> {

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
  * @method getMaintenanceRooms
  * @description Fetches a list of available rooms from the Firestore database where the status is "Maintenance."
  * @returns {Promise<Array<{id: string, [key: string]: any}>>} A promise that resolves to an array of Maintenance room objects.
  * Each room object contains an `id` and all other room properties from the Firestore document.
  * @throws {Error} Throws an error if the Firestore query fails.
  */
  async getMaintenanceRooms(): Promise<Array<{ id: string;[key: string]: any }>> {

    try {

      // Construct Firestore query to fetch rooms with status 'Maintenance'
      const roomsQuery = query(
        collection(this.firestore, 'rooms'),
        where('status', '==', 'Maintenance'))

      // Execute the query and fetch documents
      const roomSnap = await getDocs(roomsQuery)

      // Map the documents into an array of room objects
      return roomSnap.docs.map((doc) => ({

        id: doc.id,  // Include the document ID
        ...doc.data() // Include all other document fields
      }))

    } catch (error) {

      console.log('Error fetching Maintenance rooms:', error)
      throw new Error('Unable to fetch Maintenance rooms. Please try again later.')
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
  async updateRoom(roomID: string, updatedData: Record<string, any>): Promise<void> {

    try {
      // Reference to the specific room document in the Firestore collection
      const postRef = doc(this.firestore, 'rooms/' + roomID)

      // Update the room document with the provided data
      await updateDoc(postRef, updatedData)
      console.log('Room with ID ' + roomID + ' successfully updated.');

    } catch (error) {

      console.error('Error updating room with ID ' + roomID + ':', error);
      throw new Error('Failed to update room:' + error);
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
  async getBookings(): Promise<Array<{ id: string;[key: string]: any }>> {

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
  async getBookingsByGuestId(guestId: string): Promise<Array<{ id: string;[key: string]: any }>> {
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

  /**
  * Fetches reviews for a specific room by its ID.
  *
  * @param {string} roomId - The unique identifier of the room.
  * @returns {Promise<Array<{ id: string; [key: string]: any }>>} A promise that resolves to an array of review objects.
  * Each review object contains the review ID (`id`) and the rest of its Firestore data.
  * @throws {Error} Throws an error if the `roomId` is invalid or if fetching reviews fails.
  */
  async getRoomReviewByRoomId(roomId: any): Promise<Array<{ id: string;[key: string]: any }>> {

    // Validate input
    if (!roomId) {
      throw new Error('Room ID is required to fetch reviews.')
    }

    try {

      // Create a Firestore query for reviews matching the given roomId
      const reviewsQuery = query(
        collection(this.firestore, 'reviews'),
        where('roomId', '==', roomId)
      )

      // Fetch the reviews from Firestore
      const querySnapshot = await getDocs(reviewsQuery)

      // Transform the query results into a structured array of review objects
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

    } catch (error) {
      console.log('Error fetching room reviews:', error);
      throw new Error('Unable to fetch room reviews. Please try again later.')
    }
  }

  /** 
  * @async
  * @method fetchRooms
  * @description Fetch room data from Firestore based on the given query.
  * @param {Query} roomQuery - Firestore query for fetching rooms.
  * @returns {Promise<any[]>} - A promise that resolves with room data.
  */
  async fetchRooms(roomQuery: Query): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(roomQuery);
      const rooms: any[] = [];
      querySnapshot.forEach((doc) => {

        rooms.push({ id: doc.id, ...doc.data() });
      });
      return rooms;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw new Error('Failed to fetch rooms');
    }
  }

  /**
  * @async
  * @method filterRoomsByType
  * @description Filter rooms by room type.
  * @param {string} roomType - Room type to filter (e.g., "Deluxe", "Standard").
  * @returns {Promise<any[]>} - A promise that resolves with rooms matching the type filter.
  */
  async filterRoomsByType(roomType: string): Promise<any[]> {

    try {
      const roomCollection = collection(this.firestore, 'rooms');
      const roomQuery = query(
        roomCollection,
        where('roomType', '==', roomType)
      );

      return await this.fetchRooms(roomQuery);
    } catch (error) {
      console.error('Error filtering rooms by room type:', error)
      throw new Error('Failed to filter rooms by type')
    }
  }

  /**
  * Filters rooms based on their status (e.g., "Available", "Booked", "Maintenance").
  *
  * @async
  * @method filterRoomsByStatus
  * @param {string} status - The status to filter rooms by.
  * @returns {Promise<any[]>} A promise that resolves to an array of rooms with the specified status.
  * @throws {Error} Throws an error if the filtering process fails.
  */
  async filterRoomsByStatus(status: string): Promise<any[]> {

    try {
      // Create Firestore query to fetch rooms based on status
      const roomQuery = query(collection(this.firestore, 'rooms'), where('status', '==', status))

      // Fetch and return rooms matching the status
      return await this.fetchRooms(roomQuery)

    } catch (error) {
      console.error('Error filtering rooms by room status:', error)
      throw new Error('Failed to filter rooms by status')
    }
  }

  /**
  * Sort rooms by price.
  *
  * @param {'priceLowToHigh' | 'priceHighToLow'} sortBy - Sorting order.
  * @returns {Promise<any[]>} - A promise that resolves with sorted room data.
  */
  async sortRoomsByPrice(sortBy: 'priceLowToHigh' | 'priceHighToLow'): Promise<any[]> {

    try {
      const roomCollection = collection(this.firestore, 'rooms');
      const order = sortBy === 'priceLowToHigh' ? 'asc' : 'desc';
      const roomQuery = query(
        roomCollection,
        orderBy('price', order)
      );
      return await this.fetchRooms(roomQuery);
    } catch (error) {
      console.error('Error sorting rooms by price:', error);
      throw new Error('Failed to sort rooms by price');
    }
  }

  /**
  * Registers a payment in Firestore.
  * 
  * @method payment
  * @description Saves payment details to Firestore for a given booking. 
  * Includes the booking ID, amount, number of nights, and the creation timestamp.
  * 
  * @param {string} bookingId - The unique identifier of the booking associated with the payment.
  * @param {number} amount - The total amount paid.
  * @param {number} nights - The number of nights associated with the booking.
  * @returns {Promise<DocumentReference>} A promise that resolves with the Firestore document reference of the newly added payment.
  * 
  * @throws Will throw an error if the payment registration fails.
  */
  async processBookingPayment(bookingId: any, amount: number, nights: number): Promise<DocumentReference> {

    try {

      // Validate input parameters
      if (!bookingId || typeof amount !== 'number' || amount <= 0 || nights <= 0) {
        throw new Error('Invalid input: Ensure bookingId, amount, and nights are valid.')
      }

      console.log('Starting payment process...')

      // Simulate third-party payment process
      const paymentResult = await this.simulateThirdPartyPayment(amount);

      if (paymentResult.status !== 'success') {
        throw new Error('Payment failed: ' + paymentResult.message);
      }

      // Prepare payment data
      const paymentData = {
        bookingId,
        amount,
        nights,
        status: 'success',
        paymentMethod: 'DummyPaymentAPI',
        transactionId: paymentResult.transactionId,
        creationDate: new Date().toISOString()
      }

      // Firestore collection reference
      const paymentRef = collection(this.firestore, 'payments')

      // Add payment data to Firestore
      const paymentSnap = await addDoc(paymentRef, paymentData)
      console.log('Payment added successfully:', paymentSnap.id)

      // Update booking status in Firestore
      const bookingRef = doc(this.firestore, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'Confirmed', paymentStatus: 'Paid' });

      console.log('Booking confirmed successfully.')

      return paymentSnap

    } catch (error) {

      console.log('Error during payment registration:', error);
      throw new Error('Failed to register payment. Please try again.');
    }
  }

  /**
  * Simulates a third-party payment process.
  * 
  * @param {number} amount - The payment amount.
  * @returns {Promise<{ status: string; message: string; transactionId?: string }>} The simulated payment result.
  */
  async simulateThirdPartyPayment(amount: number): Promise<{ status: string; message: string; transactionId?: string }> {

    return new Promise((resolve) => {

      console.log('Processing payment of $' + amount + ' through DummyPaymentAPI...')

      // Simulate a delay for payment processing
      setTimeout(() => {
        // Simulated response from a payment gateway
        const success = Math.random() > 0.1; // 90% success rate for the dummy payment

        if (success) {
          resolve({
            status: 'success',
            message: 'Payment processed successfully.',
            transactionId: 'DUMMY-' + new Date().getTime(),
          })
        } else {
          resolve({
            status: 'failure',
            message: 'Payment declined by DummyPaymentAPI.',
          })
        }
      }, 2000)
    })

  }

  /**
  * Fetches and displays check-ins scheduled for the current day if the rooms are available.
  *
  * @async
  * @method fetchTodayCheckIns
  * @param {Firestore} firestore - The Firestore instance.
  * @returns {Promise<any[]>} - A promise that resolves with the list of today's check-ins with available rooms.
  * @throws {Error} Throws an error if the data fetching fails.
  */
  async fetchTodayCheckIns(): Promise<any[]> {
    try {
      // Reference the Firestore 'bookings' collection
      const bookingsCollection = collection(this.firestore, 'bookings');

      // Get today's date (start of day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get tomorrow's date (start of next day)
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Query for bookings scheduled for today with available rooms
      const bookingQuery = query(
        bookingsCollection,
        where('checkIn', '>=', today.toISOString()), // Use ISO string for date comparison
        where('checkIn', '<', tomorrow.toISOString()) // Upper bound for today's bookings
      )

      // Fetch data from Firestore
      const querySnapshot = await getDocs(bookingQuery);
      const todayCheckIns: any[] = [];

      querySnapshot.forEach((doc) => {
        todayCheckIns.push({ id: doc.id, ...doc.data() });
      });

      // Log and return the filtered list of today's check-ins
      console.info('Successfully fetched today\'s check-ins:', todayCheckIns);
      return todayCheckIns;
    } catch (error) {
      console.error('Error fetching today\'s check-ins:', error);
      throw new Error('Failed to fetch today\'s check-ins');
    }
  }

  /**
  * @async
  * @method checkIn
  * @description Updates a booking document in Firestore with the provided updated data.
  * This method is typically used for marking a booking as checked in.
  * 
  * @param {string} bookingId - The ID of the booking to update.
  * @param {Partial<any>} updatedData - The data to update in the booking document.
  * @returns {Promise<void>} - A promise that resolves when the update operation is complete.
  * @throws {Error} - Throws an error if the update operation fails.
  */
  async checkIn(bookingId: any, updatedData: Partial<any>) {

    try {

      // Check if the bookingId is provided
      if (!bookingId) {
        throw new Error('Booking ID is required to update the booking.');
      }

      // Reference to the Firestore document for the specified booking
      const bookingDocRef = doc(this.firestore, 'bookings', bookingId);

      // Perform the update operation on the Firestore document
      await updateDoc(bookingDocRef, updatedData);

    } catch (error) {
      console.error('Error updating booking:', error)
      // Re-throw the error for further handling
      throw error
    }
  }

  /**
  * @async
  * @method checkOut
  * @description Updates a booking document in Firestore with the provided updated data, and marks the associated room as available after guest check-out.
  * This method is typically used for finalizing the check-out process and ensuring room availability.
  * 
  * @param {string} bookingId - The ID of the booking to update.
  * @param {Partial<any>} updatedData - The data to update in the booking document.
  * @returns {Promise<void>} - A promise that resolves when the update operation is complete.
  * @throws {Error} - Throws an error if the update operation fails.
  */
  async checkOut(bookingId: string, updatedData: Partial<any>): Promise<void> {
    try {
      // Ensure the bookingId is provided
      if (!bookingId) {
        throw new Error('Booking ID is required to update the booking.');
      }

      // Reference to the Firestore document for the specified booking
      const bookingDocRef = doc(this.firestore, 'bookings', bookingId);

      // Perform the update operation on the Firestore document
      await updateDoc(bookingDocRef, updatedData);

      // Retrieve the associated room ID from the booking document
      const bookingSnapshot = await getDoc(bookingDocRef);

      if (!bookingSnapshot.exists()) {
        throw new Error(`Booking with ID: ${bookingId} does not exist.`);
      }

      const bookingData = bookingSnapshot.data();
      const roomId = bookingData['roomId']

      if (!roomId) {
        throw new Error(`Room ID is missing from booking with ID: ${bookingId}.`);
      }

      // Reference to the Firestore document for the associated room
      const roomDocRef = doc(this.firestore, 'rooms', roomId);

      // Update the room status to 'Available'
      await updateDoc(roomDocRef, { status: 'Available' })

    } catch (error) {
      console.error('Error during check-out process:', error);
      // Re-throw the error for further handling
      throw error;
    }
  }

  /**
  * Updates the status of a single booking identified by its booking ID.
  * If the booking status is updated to 'Cancelled', it also updates the associated room status to 'Available'.
  * 
  * @async
  * @method updateBookingStatus
  * @param {string} bookingId - The unique ID of the booking to be updated.
  * @param {string} status - The new status to set for the booking (e.g., 'Pending', 'Confirmed').
  * @returns {Promise<void>} Resolves when the status of the booking has been successfully updated.
  * @throws {Error} Throws an error if updating the booking status fails.
  */
  async updateBookingStatus(bookingId: any, status: string): Promise<void> {

    try {

      // Reference to the Firestore document for the specified booking
      const bookingDocRef = doc(this.firestore, 'bookings', bookingId)

      // Fetch the booking document to get the associated room ID
      const bookingSnapshot = await getDoc(bookingDocRef)

      if (!bookingSnapshot.exists()) {
        throw new Error(`Booking with ID ${bookingId} does not exist.`)
      }

      const bookingData = bookingSnapshot.data()
      const roomId = bookingData?.['roomId']

      // Update the booking status
      await updateDoc(bookingDocRef, { status })

      // If the new status is 'Cancelled', update the room status to 'Available'
      if (status === 'Cancelled' && roomId) {

        const roomDocRef = doc(this.firestore, 'rooms', roomId);
        await updateDoc(roomDocRef, { status: 'Available' })
      }

    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status. Please try again.');
    }
  }

  /**
  * @async 
  * @method getTopPerformingRoomType
  * @description Fetch the top-performing room type based on booking count.
  */
  async getTopPerformingRoomType() {

    try {

      // Reference the 'rooms' collection
      const roomCollection = collection(this.firestore, "rooms")

      // Query: Order rooms by bookingCount in descending order and limit to 1 result
      const topRoomQuery = query(roomCollection, orderBy("bookingCount", "desc"), limit(1))
      const querySnapshot = await getDocs(topRoomQuery)

      // If no rooms are found, return a default message
      if (querySnapshot.empty) {
        return { message: "No bookings yet!" };
      }

      // Get the top room's data and 
      const topRoom = querySnapshot.docs[0].data()

      return topRoom

    } catch (error) {
      console.error("Error fetching top-performing room type:", error);
      return { success: false, message: "Failed to fetch data" };
    }
  }

}
