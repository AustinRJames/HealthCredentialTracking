import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManager } from './department-manager';

describe('DepartmentManager', () => {
  let component: DepartmentManager;
  let fixture: ComponentFixture<DepartmentManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
