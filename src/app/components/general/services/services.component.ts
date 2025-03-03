import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [RouterLink,NgFor],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

  /** @property {any} data */

  data: any

  /**
  * @constructor
  * @param {DataService} dataService 
  */
  constructor(private dataService: DataService) { }

  /**
  * @method ngOnInit
  * @description Lifecycle hook that runs when the component is initialized.
  * It subscribes to the `readData()` method from `dataService` to fetch data.
  */
  ngOnInit(): void {
    // Subscribe to the readData() method to fetch data from the service
    this.dataService.readData().subscribe({
      next: (data) => {
        this.data = data // Assign fetched data to the component's variable
      },
      error: (error) => {
        console.error('Error fetching data:', error) // Log error to console
      }
    })
  }
}
