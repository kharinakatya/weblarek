// OrderFormView.ts
import { FormView } from './FormView';

export class OrderFormView extends FormView {
  private payment: string = '';
  private touchedPayment: boolean = false;
  private touchedAddress: boolean = false;
  private submitted: boolean = false;

  constructor() {
    super('#order');
  }

  render(): HTMLElement {
    const node = this.getTemplate();
    this.initForm(node);

    this.formElement.addEventListener('submit', (ev: Event) => {
      ev.preventDefault();
      this.submitted = true;
      this.validateAndUpdate();
      
      const formData = new FormData(this.formElement);
      const data = Object.fromEntries(formData.entries()) as Record<string, string>;
      data.address = (data.address || '').toString().trim();
      data.payment = this.payment ?? '';
      const errors = this.validate(data);
      
      if (Object.keys(errors).length === 0) {
        this.emit('order:submit', { address: data.address, payment: data.payment });
      }
    });

    const buttons = node.querySelectorAll('.button_alt') as NodeListOf<HTMLButtonElement>;
    buttons.forEach(btn => {
      btn.addEventListener('click', (ev: MouseEvent) => {
        ev.stopPropagation();
        this.payment = btn.name;
        this.touchedPayment = true;
        buttons.forEach(b => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        this.emit('order:payment-select', { payment: this.payment });
        this.validateAndUpdate();
      });
    });

    const activeButton = node.querySelector('.button_alt-active') as HTMLButtonElement | null;
    if (activeButton && activeButton.name) {
      this.payment = activeButton.name;
      this.touchedPayment = true;
    }

    const addressInput = node.querySelector('input[name="address"]') as HTMLInputElement | null;
    if (addressInput) {
      addressInput.addEventListener('input', (ev: Event) => {
        ev.stopPropagation();
        this.touchedAddress = true;
        this.validateAndUpdate();
      });
      addressInput.addEventListener('blur', () => {
        this.touchedAddress = true;
        this.validateAndUpdate();
      });
    }

    this.validateAndUpdate();

    return node;
  }

  protected validate(data: Record<string, string>): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!data.address || data.address.trim() === '') {
      errors.address = 'Необходимо указать адрес';
    }
    if (!data.payment || data.payment.trim() === '') {
      errors.payment = 'Выберите способ оплаты';
    }
    return errors;
  }

  private validateAndUpdate(): void {
    console.log('Creating FormData');
    const formData = new FormData(this.formElement);
    console.log('FormData entries:', Array.from(formData.entries()));
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    console.log('data before assign:', data);
    data.address = (data.address || '').toString().trim();
    data.payment = this.payment ?? '';
    console.log('data after assign:', data);
    const allErrors = this.validate(data);
    console.log('allErrors:', allErrors);

    const visibleErrors: Record<string, string> = {};
    if (this.submitted) {
      Object.assign(visibleErrors, allErrors);
    } else {
      if (allErrors.payment && this.touchedPayment) {
        visibleErrors.payment = allErrors.payment;
      }
      if (allErrors.address && (this.touchedPayment || this.touchedAddress)) {
        visibleErrors.address = allErrors.address;
      }
    }

    const errorsEl = this.formElement.querySelector('.form__errors') as HTMLElement | null;
    if (errorsEl) {
      const msgs = Object.values(visibleErrors);
      errorsEl.textContent = msgs.length ? msgs.join('. ') : '';
    }

    const submitBtn = this.formElement.querySelector('button[type="submit"], .order__button') as HTMLButtonElement | null;
    const isValid = Object.keys(allErrors).length === 0;
    if (submitBtn) {
      submitBtn.disabled = !isValid;
      submitBtn.classList.toggle('button_disabled', !isValid);
      submitBtn.setAttribute('aria-disabled', (!isValid).toString());
    }
  }
}
