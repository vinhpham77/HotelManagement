import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {
  transform(firstName: string, lastName: string, country?: string): string {
    const reverseOrderCountries = ['Trung Quốc', 'Nhật Bản', 'Hàn Quốc', 'Triều Tiên' , 'Hungary', 'Việt Nam'];
    const reverseOrder = country && reverseOrderCountries.includes(country);
    if (reverseOrder) {
      return `${lastName} ${firstName}`;
    } else {
      return `${firstName} ${lastName}`;
    }
  }
}
