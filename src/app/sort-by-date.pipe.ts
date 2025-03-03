import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByDate'
})
export class SortByDatePipe implements PipeTransform {

  transform(value: Array<any>, dateKey: string): Array<any> {
    if (!value || value.length === 0 || !dateKey) {
      return value; // Return original array if invalid
    }

    // Sort the array by the provided dateKey
    return value.sort((a, b) => new Date(a[dateKey]).getTime() - new Date(b[dateKey]).getTime())
  }
}
