import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  /**
  * @constructor
  * @param {Firestore} firestore 
  */
  constructor(private firestore: Firestore) { }

  /**
   * Fetches payment details by the booking ID.
   *
   * @async
   * @method getPaymentByBookingId
   * @description Fetches the payment details associated with a specific booking ID from the Firestore database.
   *              If the payment record exists, it returns the data; otherwise, throws an error.
   * @param {string} bookingId - The unique ID of the booking associated with the payment.
   * @returns {Promise<any>} A promise that resolves with the payment details, including the ID, or rejects with an error.
   * @throws {Error} If the payment document does not exist or if an error occurs during the fetch.
   */
  async getPaymentByBookingId(bookingId: any): Promise<any> {

    try {

      const paymentQuery = query(
        collection(this.firestore, 'payments'),
        where('bookingId', '==', bookingId))

      // Fetch the document from Firestore
      const paymentSnap = await getDocs(paymentQuery)

      // Return the first document from the result
      const doc = paymentSnap.docs[0]

      return {
        
        id: doc.id, ...doc.data() 
      }

    } catch (error) {

      console.log('Error fetching payment by ID:', error)
      // Re-throw the error to be handled by the caller
      throw error
    }
  }
}
