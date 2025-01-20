import { Injectable } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';

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
  
}
