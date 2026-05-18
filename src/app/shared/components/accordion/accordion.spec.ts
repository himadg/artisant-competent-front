import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accordion } from './accordion';

describe('Accordion', () => {
  let component: Accordion;
  let fixture: ComponentFixture<Accordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accordion],
    }).compileComponents();

    fixture = TestBed.createComponent(Accordion);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Titre de test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title in the header button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.accordion__trigger');
    expect(button.textContent).toContain('Titre de test');
  });

  it('should be collapsed by default (aria-expanded=false)', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.accordion__trigger');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('should link the header and panel via aria attributes', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.accordion__trigger');
    const panel: HTMLElement = fixture.nativeElement.querySelector('.accordion__panel');
    expect(button.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(button.id);
  });

  it('should open on header click and emit the toggled event', () => {
    const emitted: boolean[] = [];
    component.toggled.subscribe((open) => emitted.push(open));
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.accordion__trigger');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(emitted).toEqual([true]);
  });

  it('should display the summary insert only when a summary is provided', () => {
    expect(fixture.nativeElement.querySelector('.accordion__summary')).toBeNull();

    fixture.componentRef.setInput('summary', 'Résumé court de test');
    fixture.detectChanges();

    const summary: HTMLElement = fixture.nativeElement.querySelector('.accordion__summary');
    expect(summary).not.toBeNull();
    expect(summary.textContent).toContain('Résumé court de test');
  });
});
