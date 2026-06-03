import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [NgOptimizedImage],
  templateUrl: './start.html',
  styleUrl: './start.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Start implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private redirectTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.redirectTimer = setTimeout(() => this.router.navigate(['/termine']), 3000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.redirectTimer);
  }
}
