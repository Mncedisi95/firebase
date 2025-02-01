import { Component } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-index',
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  ngAfterViewInit(): void {

    new Swiper ('.swiper-container', {
      loop: true, // Enables infinite looping
      autoplay: {
        delay: 5000, // Changes slide every 5 seconds
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    })
  }

 
}
