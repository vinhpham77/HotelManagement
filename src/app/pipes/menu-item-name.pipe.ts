import { Pipe, PipeTransform } from '@angular/core';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
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
