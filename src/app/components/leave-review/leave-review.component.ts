import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leave-review',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './leave-review.component.html',
  styleUrl: './leave-review.component.css'
})
export class LeaveReviewComponent {

  /**
  * @property {FormGroup} reviewForm
  */
  reviewForm: FormGroup

  /**
  *  Represents the current error message to display.
  * @property {string} errorMessage 
  */
  errorMessage: string = ''

  /**
  * @property {boolean} isErrorVisible
  * Represents whether to display an error message on the book page. Set to true to show the 
  * error message and false to hide it.
  * Default value: false.
  */
  isErrorVisible: boolean = false

  /**
  * Represents the current success message to display.
  * @property {string} successMessage
  */
  successMessage: string = ''

  /**
  * Controls visibility of success messages.
  * @property {boolean} isSuccessVisible
  */
  isSuccessVisible: boolean = false

  /**
  * @property {any} roomId
  */
   roomId : any

  /**
  * @property {any} userId  
  */ 
  userId : any

  /**
  * @constructor 
  * @param {FormBuilder} fb
  * @param {RoomService} roomService
  */
  constructor(private fb: FormBuilder,private roomService: RoomService,private route: ActivatedRoute, private router: Router,private authService: AuthService) {

    this.reviewForm = this.fb.group({
      // Required : Rating
      rating: ['', [Validators.required]], 
      // Required : comment and must be at least 10 chars
      comment: ['', [Validators.required, Validators.minLength(10)]], 
    })
  }

   ngOnInit(){

    this.roomId = this.route.snapshot.paramMap.get('roomId') || ''

    this.authService.currentUser$.subscribe((user) => {
      
      this.userId = user.uid
    })
  }

  /**
  * @method showError 
  * @description Displays an error message for a specified duration.
  * @param {string} message - The error message to be displayed. 
  * @param {number} [duration= 3000] - Optional duration for the error message display in milliseconds.
  */
  showError(message: string, duration = 3000): void {

    // Prevent multiple overlapping error messages
    if (this.isErrorVisible) return;

    // Set the error message and display state
    this.errorMessage = message
    this.isErrorVisible = true

    setTimeout(() => {
      this.isErrorVisible = false
      this.errorMessage = ''
    }, duration)
  }

  /**
  * @method showSuccess
  * @description Displays a success message for a specified duration. 
  * @param {string} message - The success message to be displayed.
  * @param {number} [duration= 3000] - Optional duration for the error message display in milliseconds.
  */
   showSuccess(message: string, duration = 3000): void {

    // Prevent multiple overlapping error messages
    if (this.isSuccessVisible) return

    // Set the error message and display state
    this.successMessage = message
    this.isSuccessVisible = true

    setTimeout(() => {
      this.isSuccessVisible = false
      this.successMessage = ''
    }, duration);
  }

  /**
  * @async
  * @method onSubmitReview
  * @description Submits a review for a room. The function collects review details, validates the input, 
  * sends the data to the backend, and handles success or error feedback to the user.
  * 
  * @returns {Promise<void>} A promise that resolves when the review submission is completed.
  * @throws {Error} Throws an error if the submission process fails.
  */
  async onSubmitReview() : Promise<void>{

    try {

      // Validate form inputs
      if (!this.reviewForm.valid) {
        this.showError('Please fill in all required fields and provide a valid rating.')
        return
      }

      // Prepare review data
      const reviewData = {

        roomId : this.roomId,
        userId : this.userId,
        comment: this.reviewForm.get('comment')?.value,
        rating : this.reviewForm.get('rating')?.value,
        creationDate: new Date().toISOString(),
      }

      // Call service to add the review
      await this.roomService.addReview(reviewData)
      
      // Show success message and reset form
      this.showSuccess('Thank you for your review!')
      this.reviewForm.reset()

    } catch (error) {

      console.log('Error submitting review:', error)
      this.showError('Failed to submit the review. Please try again.')
    }
  }

}