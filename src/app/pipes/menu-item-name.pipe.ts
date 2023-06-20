import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'menuItemName' })
export class MenuItemNamePipe implements PipeTransform {
  transform(value: boolean | null): string {
    switch (value) {
      case true:
        return 'Thức ăn';
      case false:
        return 'Nước uống';
      default:
        return 'Khác';
    }
  }
}
