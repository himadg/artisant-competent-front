import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class JobCityPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private paramsSub?: Subscription;
  tradeContent: any = null;

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      const tradeSlug = params.get('trade') ?? '';
      const citySlug = params.get('city') ?? '';

      if (tradeSlug && citySlug) {
        this.router.navigate(['/job', tradeSlug], { queryParams: { city: citySlug }, replaceUrl: true });
      } else {
        this.router.navigate(['/jobs'], { replaceUrl: true });
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }
}
