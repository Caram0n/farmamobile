import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalDetalleUsuarioPage } from './modal-detalle-usuario.page';

describe('ModalDetalleUsuarioPage', () => {
  let component: ModalDetalleUsuarioPage;
  let fixture: ComponentFixture<ModalDetalleUsuarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleUsuarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetalleUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
