import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialTrackerComponent } from './credential-tracker';

describe('CredentialTracker', () => {
  let component: CredentialTrackerComponent;
  let fixture: ComponentFixture<CredentialTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialTrackerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
