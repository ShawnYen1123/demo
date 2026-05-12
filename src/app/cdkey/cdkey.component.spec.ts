import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkeyComponent } from './cdkey.component';

describe('CdkeyComponent', () => {
  let component: CdkeyComponent;
  let fixture: ComponentFixture<CdkeyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CdkeyComponent]
    });
    fixture = TestBed.createComponent(CdkeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
