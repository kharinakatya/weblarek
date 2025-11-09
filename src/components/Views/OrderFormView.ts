// OrderFormView.ts
import { FormView } from './FormView';
import { TPayment } from '../../types/index';

export class OrderFormView extends FormView {
  private payment: TPayment | null = null;
  private node: HTMLElement;

  constructor() {
    super('#order');

    this.node = this.getTemplate();
    this.initForm(this.node);
    this.setupListeners(this.node);
  }

  render(): HTMLElement {
    return this.node;
  }

  private setupListeners(node: HTMLElement): void {
    const addressInput = node.querySelector('input[name="address"]') as HTMLInputElement | null;
    const buttons = Array.from(node.querySelectorAll('.button_alt')) as HTMLButtonElement[];

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

    if (addressInput) {
      addressInput.addEventListener('input', () => {
        this.emit('buyer:change', { key: 'address', value: addressInput.value });
      });
    }

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.payment = button.name as TPayment;
        this.emit('buyer:change', { key: 'payment', value: this.payment });
        markButtonActive(button);
      });
    });

    if (this.payment) {
      const activeBtn = buttons.find(b => b.name === this.payment);
      if (activeBtn) markButtonActive(activeBtn);
    }
  }

  setValidationErrors(errors: Record<string, string>): void {
    const relevant: Record<string, string> = {};
    if (errors.address) relevant.address = errors.address;
    if (errors.payment) relevant.payment = errors.payment;

    this.setErrors(relevant);

    const submitBtn = this.node.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submitBtn) {
      submitBtn.disabled = Object.keys(relevant).length > 0;
    }
  }

  validate(_formData: Record<string, string>): Record<string, string> {
    return {};
  }

  protected onSubmit(data: Record<string, string>): void {
    data.payment = (this.payment ?? data.payment) as string;
    this.emit('order:submit', { data });
  }

  setSelectedPayment(payment: TPayment | null): void {
    this.payment = payment;

    if (!this.node) return;
    const buttons = Array.from(this.node.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    buttons.forEach(b => {
      b.classList.remove('button_alt-active');
      b.setAttribute('aria-pressed', 'false');
    });
    if (payment) {
      const activeBtn = buttons.find(b => b.name === payment);
      if (activeBtn) {
        activeBtn.classList.add('button_alt-active');
        activeBtn.setAttribute('aria-pressed', 'true');
      }
    }
  }

  clearForm(): void {
    console.log('OrderForm cleared');

    // Очищаем поле адреса
    const addressInput = this.node.querySelector('input[name="address"]') as HTMLInputElement | null;
    if (addressInput) addressInput.value = '';

    this.payment = null;

    const buttons = Array.from(this.node.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    buttons.forEach(b => {
      b.classList.remove('button_alt-active');
      b.setAttribute('aria-pressed', 'false');
    });

    this.clearErrors();
    const submitBtn = this.node.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submitBtn) submitBtn.disabled = true;
  }
}