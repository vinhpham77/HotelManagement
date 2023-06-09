import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Directive({
  selector: '[appCurrencyFormatter]'
})
export class CurrencyFormatterDirective {
  @Input() decimalPlaces!: string;

  constructor(
    private el: ElementRef,
    private control: NgControl,
    private currencyPipe: CurrencyPipe
  ) {}

  @HostListener('focus')
  onFocus() {
    if (this.control.value) {
      const value = this.control.value.replace(/,/g, '');
      this.el.nativeElement.value = this.currencyPipe.transform(
        value,
        'VND',
        '',
        '1.0-0'
      );
    }
  }

  @HostListener('blur')
  onBlur() {
    let value = this.control.value;
    if (value === null) value = '0';
    value = value.replace(/,/g, '');
    if (value === '') value = '0';
    this.el.nativeElement.value = this.currencyPipe.transform(
      value,
      'VND',
      '',
      '1.0-0'
    );
  }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event: any) {
    if (event) {
      event = event.toString();
      let value = event.replace(/,/g, '');
      const indexOfE = value.search(/e/i);
      if (indexOfE !== -1) {
        value = value.slice(0, indexOfE);
      }
      this.control.valueAccessor?.writeValue(
        this.currencyPipe.transform(value, 'VND', '', '1.0-0')
      );
    }
  }
}
