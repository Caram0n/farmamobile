import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalDetalleCajaPage } from './modal-detalle-caja.page';

describe('ModalDetalleCajaPage', () => {
  let component: ModalDetalleCajaPage;
  let fixture: ComponentFixture<ModalDetalleCajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleCajaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetalleCajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
