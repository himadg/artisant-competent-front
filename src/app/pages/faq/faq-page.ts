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
import { Accordion } from '../../shared/components/accordion';
import { KlarnaFaqService } from '../../core/services/klarna-faq.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslocoModule, Accordion],
  templateUrl: './faq-page.html',
  styleUrl: './faq-page.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FaqPage implements OnInit, AfterViewInit {
  private static readonly FAQ_COUNT = 13;

  @ViewChild('klarnaAccordion') private readonly klarnaAccordion?: Accordion;

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
    const questionIds = Array.from({ length: FaqPage.FAQ_COUNT }, (_, i) => `q${i + 1}`);
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
