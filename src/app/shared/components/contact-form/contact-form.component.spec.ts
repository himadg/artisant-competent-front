import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContactFormComponent,
        TranslocoTestingModule.forRoot({
          langs: { fr: {} },
          translocoConfig: { availableLangs: ['fr'], defaultLang: 'fr' },
          preloadLangs: true,
        }),
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('source', 'home');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid form', () => {
    expect(component['form'].valid).toBe(false);
  });

  it('should become valid once every required field is filled', () => {
    component['form'].setValue({
      name: 'Jean Dupont',
      email: 'jean@exemple.fr',
      phone: '',
      subject: 'general',
      message: 'Bonjour, je souhaite un renseignement.',
      consent: true,
    });

    expect(component['form'].valid).toBe(true);
  });

  it('should reject an invalid email address', () => {
    component['form'].controls.email.setValue('pas-un-email');

    expect(component['form'].controls.email.valid).toBe(false);
  });

  it('should accept a permissive French phone number', () => {
    component['form'].controls.phone.setValue('06 12 34 56 78');
    expect(component['form'].controls.phone.valid).toBe(true);

    component['form'].controls.phone.setValue('+33 6 12 34 56 78');
    expect(component['form'].controls.phone.valid).toBe(true);
  });

  it('should not leave the idle state when submitting an invalid form', () => {
    component['submit']();

    expect(component['status']()).toBe('idle');
  });
});
