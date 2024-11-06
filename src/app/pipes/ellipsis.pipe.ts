import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
})
export class EllipsisPipe implements PipeTransform {
  public transform(value: string, l: number): string {
    // pick whatever number fits your need
    if (value.length > l) {
      return value.substring(0, l).concat('...');
    }
    return value;
  }
}
