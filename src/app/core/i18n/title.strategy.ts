import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TranslocoTitleStrategy extends TitleStrategy {
  private lastTitleKey?: string;

  constructor(
    private readonly transloco: TranslocoService,
    private readonly titleService: Title,
  ) {
    super();
    this.transloco.langChanges$.subscribe(() => {
      if (this.lastTitleKey) {
        this.transloco.selectTranslate(this.lastTitleKey).pipe(take(1)).subscribe((t) => {
          this.titleService.setTitle(t);
        });
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot) {
    const key = this.buildTitle(snapshot);
    this.lastTitleKey = key ?? undefined;
    if (key) {
      this.transloco.selectTranslate(key).pipe(take(1)).subscribe((t) => {
        this.titleService.setTitle(t);
      });
    }
  }
}
