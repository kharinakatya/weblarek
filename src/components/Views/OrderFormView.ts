import { FormView } from './FormView';
import { TPayment } from '../../types/index';

export class OrderFormView extends FormView {
  private payment: TPayment | null = null;
  private node: HTMLElement;
  private addressInput!: HTMLInputElement;
  private submitBtn!: HTMLButtonElement;
  private paymentButtons!: HTMLButtonElement[];

  constructor() {
    super('#order');

    this.node = this.getTemplate();
    this.initForm(this.node);

    this.addressInput = this.ensureElement('input[name="address"]', this.node) as HTMLInputElement;
    this.submitBtn = this.ensureElement('button[type="submit"]', this.node) as HTMLButtonElement;
    this.paymentButtons = Array.from(this.node.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    this.submitBtn.disabled = true;
    this.addressInput.addEventListener('input', () => {
      this.emit('buyer:change', { key: 'address', value: this.addressInput.value });
    });

    const clearButtonsState = () => {
      this.paymentButtons.forEach(b => {
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

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.payment = button.name as TPayment;
        console.log('OrderFormView: payment selected =', this.payment);
        this.emit('buyer:change', { key: 'payment', value: this.payment });
        markButtonActive(button);
      });
    });

    this.node.addEventListener('submit', (ev) => {
      ev.preventDefault();
      this.onSubmit();
    });
  }

  protected afterClear(): void {
    this.payment = null;
    this.paymentButtons.forEach(b => {
      b.classList.remove('button_alt-active');
      b.setAttribute('aria-pressed', 'false');
    });

    this.addressInput.value = '';
    this.submitBtn.disabled = true;
  }

  render(): HTMLElement {
    return this.node;
  }

  setValidationErrors(errors: Record<string, string>): void {
    const relevant: Record<string, string> = {};
    if (errors.address) relevant.address = errors.address;
    if (errors.payment) relevant.payment = errors.payment;
    this.setErrors(relevant);
    this.submitBtn.disabled = Object.keys(relevant).length > 0;
  }

validate(formData: Record<string, string>): Record<string, string> {
  return {};
}

protected onSubmit(_data?: Record<string, string>): void {
  this.emit('order:submit');
}

  setSelectedPayment(payment: TPayment | null): void {
    this.payment = payment;
    const activeBtn = this.paymentButtons.find(b => b.name === payment);
    this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
    if (activeBtn) {
      activeBtn.classList.add('button_alt-active');
      activeBtn.setAttribute('aria-pressed', 'true');
    }
  }
  
}