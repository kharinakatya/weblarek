// OrderFormView.ts
import { FormView } from './FormView';
import { TPayment } from '../../types/index';

export class OrderFormView extends FormView {
  private payment: TPayment | null = null;

  constructor() {
    super('#order');
  }

  render(): HTMLElement {
    const node = this.getTemplate();
    this.initForm(node);

    const addressInput = node.querySelector('input[name="address"]') as HTMLInputElement | null;
    const buttons = Array.from(node.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    const submitBtn = node.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    const updateSubmitState = () => {
      const hasAddress = !!(addressInput && addressInput.value.trim());
      const hasPayment = !!this.payment;
      if (submitBtn) submitBtn.disabled = !(hasAddress && hasPayment);
    };

    if (addressInput) {
      addressInput.addEventListener('input', () => {
        this.emit('buyer:change', { key: 'address', value: addressInput.value });
        updateSubmitState();
      });
    }

    const clearButtonsState = () => {
      buttons.forEach(b => {
        b.classList.remove('button_alt-active');
        b.setAttribute('aria-pressed', 'false');
      });
    };

    const markButtonActive = (button: HTMLButtonElement | null) => {
      clearButtonsState();
      if (!button) return;
      button.classList.add('button_alt-active');
      button.setAttribute('aria-pressed', 'true');
    };

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.payment = button.name as TPayment;
        console.log('OrderFormView: payment selected =', this.payment);
        this.emit('buyer:change', { key: 'payment', value: this.payment });
        markButtonActive(button);
        updateSubmitState();
      });
    });

    if (this.payment) {
      const activeBtn = buttons.find(b => b.name === this.payment);
      if (activeBtn) markButtonActive(activeBtn);
    }

    updateSubmitState();
    return node;
  }

  setValidationErrors(errors: Record<string, string>): void {
    const relevant: Record<string, string> = {};
    if (errors.address) relevant.address = errors.address;
    if (errors.payment) relevant.payment = errors.payment;
    this.setErrors(relevant);
  }

  validate(formData: Record<string, string>): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!formData.address || formData.address.trim() === '') {
      errors.address = 'Необходимо указать адрес';
    }
    const paymentValue = (this.payment ?? formData.payment) as string | undefined;
    if (!paymentValue) {
      errors.payment = 'Выберите способ оплаты';
    }
    return errors;
  }

  protected onSubmit(data: Record<string, string>): void {
    data.payment = (this.payment ?? data.payment) as string;
    this.emit('order:submit', { data });
  }

  setSelectedPayment(payment: TPayment | null): void {
    this.payment = payment;
  }
}