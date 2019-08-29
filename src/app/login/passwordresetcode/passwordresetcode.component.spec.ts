import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordresetcodeComponent } from './passwordresetcode.component';

describe('PasswordresetcodeComponent', () => {
  let component: PasswordresetcodeComponent;
  let fixture: ComponentFixture<PasswordresetcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordresetcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordresetcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
