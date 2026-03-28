import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountStateService } from '../../../../../core/services/account-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-personal-data',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskDirective,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.css'
})
export class PersonalDataComponent implements OnInit {
  private readonly accountState = inject(AccountStateService);
  readonly account = toSignal(this.accountState.account$);

  isEditing = signal(false);
  isSaving = signal(false);
  saveSuccess = signal(false);

  form = new FormGroup({
    fullName: new FormControl('', { validators: [Validators.required, Validators.minLength(3)], nonNullable: true }),
    cpf: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    birthDate: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    phone: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    motherName: new FormControl('', { nonNullable: true }),
    gender: new FormControl('', { nonNullable: true }),
    street: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    number: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    complement: new FormControl('', { nonNullable: true }),
    neighborhood: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    city: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    state: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    zip: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });

  ngOnInit(): void {
    this.loadMockData();
    this.form.disable();
  }

  toggleEdit(): void {
    if (this.isEditing()) {
      this.form.disable();
      this.isEditing.set(false);
      this.loadMockData();
    } else {
      this.form.enable();
      this.form.controls.cpf.disable();
      this.isEditing.set(true);
      this.saveSuccess.set(false);
    }
  }

  onSave(): void {
    if (this.form.invalid) return;

    this.isSaving.set(true);
    setTimeout(() => {
      this.isSaving.set(false);
      this.isEditing.set(false);
      this.saveSuccess.set(true);
      this.form.disable();
    }, 1200);
  }

  private loadMockData(): void {
    const name = this.account()?.name ?? 'Cliente Especial';
    this.form.patchValue({
      fullName: name,
      cpf: '•••.•••.328-42',
      birthDate: '1990-06-15',
      phone: '(11) 98765-4321',
      email: 'admin@banco.com',
      motherName: 'Maria da Silva',
      gender: 'prefer-not',
      street: 'Rua Exemplo',
      number: '1234',
      complement: 'Apto 56',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zip: '01001-000',
    });
  }
}
