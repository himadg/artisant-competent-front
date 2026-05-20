import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './politique-cookies.html',
})
export class PolitiqueCookiesPage implements OnInit {
  private readonly meta = inject(Meta);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.transloco
      .selectTranslate<string>('cookies.meta.description')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((description) => {
        this.meta.updateTag({ name: 'description', content: description });
      });
  }
}
