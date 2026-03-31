import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-start',
  imports: [NgOptimizedImage],
  templateUrl: './start.html',
  styleUrl: './start.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Start {

}
