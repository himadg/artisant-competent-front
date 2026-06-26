import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Accordion } from '../accordion';
import { SeoService } from '../../../core/services/seo.service';
import { KlarnaFaqService } from '../../../core/services/klarna-faq.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule, Accordion],
  templateUrl: './faq.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FaqSection implements OnInit, AfterViewInit {
  private static readonly FAQ_COUNT = 13;

  @ViewChild('klarnaAccordion') private klarnaAccordion?: Accordion;

  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly klarnaFaq = inject(KlarnaFaqService);

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.injectFaqJsonLd();
    }

    this.klarnaFaq.openRequest$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.openKlarnaAccordion();
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.route.snapshot.fragment === 'faq-klarna') {
      this.openKlarnaAccordion();
    }
  }

  private openKlarnaAccordion(): void {
    this.klarnaAccordion?.open();
    setTimeout(() => {
      this.document.getElementById('faq-klarna')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }

  private injectFaqJsonLd(): void {
    const questionIds = Array.from({ length: FaqSection.FAQ_COUNT }, (_, i) => `q${i + 1}`);
    const keys = questionIds.flatMap((id) => [`home.faq.${id}.question`, `home.faq.${id}.body`]);

    this.transloco
      .selectTranslate<string[]>(keys)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        const entries = questionIds.map((_, i) => ({
          question: values[i * 2],
          answerHtml: values[i * 2 + 1],
        }));
        this.seo.setFaqJsonLd(entries);
      });
  }
}
