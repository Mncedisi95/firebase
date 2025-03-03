import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /** @property {string}  dataUrl */

  private dataUrl: string = "assets/data/data.json"

  /**
  * @constructor 
  * @param {HttpClient} httpClient 
  */
  constructor(private httpClient: HttpClient) { }

  /**
  * Fetches data from the server.
  * 
  * @method readData
  * @description Sends an HTTP GET request to retrieve data from the server.
  * @returns {Observable<any>} An observable that emits the fetched data or an error.
  */
  readData(): Observable<any> {

    return this.httpClient.get<any>(this.dataUrl).pipe(
      catchError(this.handleError) // Handle errors 
    )
  }

  /**
  * Handles HTTP errors and returns a readable error message.
  * 
  * @method handleError
  * @param {HttpErrorResponse} error - The error response received from the HTTP request.
  * @returns {Observable<never>} An observable that throws a formatted error message.
  */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`
    } else {
      // Server-side error
      errorMessage = `Server returned code ${error.status}, message: ${error.message}`
    }

    console.error(errorMessage); // Log the error for debugging
    return throwError(() => new Error(errorMessage))
  }
}
