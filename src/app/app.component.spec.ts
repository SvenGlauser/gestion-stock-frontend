import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {provideKeycloakAndInterceptor} from './security/keycloak.initializer';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideKeycloakAndInterceptor()
      ]
    }).compileComponents();
  });

  it("devrait instancier l'application", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
