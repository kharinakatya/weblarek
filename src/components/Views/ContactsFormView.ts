import { FormView } from './FormView';

export class ContactsFormView extends FormView {
  private node: HTMLElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;

  constructor() {
    super('#contacts');
    this.node = this.getTemplate();
    this.initForm(this.node);
    this.emailInput = this.ensureElement('input[name="email"]', this.node) as HTMLInputElement;
    this.phoneInput = this.ensureElement('input[name="phone"]', this.node) as HTMLInputElement;
    this.submitButton = this.ensureElement('button[type="submit"]', this.node) as HTMLButtonElement;
    
    this.setupListeners();
  }

  private setupListeners(): void {
    this.emailInput.addEventListener('input', () =>
      this.emit('buyer:change', { key: 'email', value: this.emailInput.value })
    );

    const formatPhone = (value: string): string => {
      const digits = value.replace(/\D/g, '');
      if (!digits) return '';

      if (digits[0] === '7' || digits[0] === '8') {
        const d = digits.replace(/^[78]/, '').slice(0, 10);
        let out = '+7';
        if (d.length > 0) out += ' ' + d.slice(0, 3);
        if (d.length > 3) out += ' ' + d.slice(3, 6);
        if (d.length > 6) out += '-' + d.slice(6, 8);
        if (d.length > 8) out += '-' + d.slice(8, 10);
        return out;
      }

      const cc = digits.slice(0, 3);
      let rest = digits.slice(3);
      let out = '+' + cc;
      while (rest.length > 0) {
        out += ' ' + rest.slice(0, 3);
        rest = rest.slice(3);
      }
      return out;
    };

    const setCaretByDigits = (input: HTMLInputElement, digitsBefore: number, formatted: string): void => {
      let count = 0;
      let pos = 0;
      while (pos < formatted.length && count < digitsBefore) {
        if (/\d/.test(formatted[pos])) count++;
        pos++;
      }
      input.setSelectionRange(pos, pos);
    };

    const onPhoneInput = (): void => {
      const raw = this.phoneInput.value;
      const caretPos = this.phoneInput.selectionStart ?? raw.length;
      const digitsBefore = raw.slice(0, caretPos).replace(/\D/g, '').length;
      const formatted = formatPhone(raw);
      this.phoneInput.value = formatted;
      setCaretByDigits(this.phoneInput, digitsBefore, formatted);
      this.emit('buyer:change', { key: 'phone', value: formatted });
    };

    this.phoneInput.addEventListener('input', onPhoneInput);
    this.phoneInput.addEventListener('blur', onPhoneInput);

    this.node.addEventListener('submit', (ev) => {
      ev.preventDefault();
      this.onSubmit();
    });
  }

  render(data?: { email?: string; phone?: string; errors?: Record<string, string> }): HTMLElement {
    const formData = data || { email: '', phone: '', errors: {} };

    this.emailInput.value = formData.email || '';
    this.phoneInput.value = formData.phone || '';

    this.clearErrors();
    if (formData.errors) {
      this.setErrors(formData.errors);
    }

    this.updateSubmitButton(formData.errors);

    return this.node;
  }

  private updateSubmitButton(errors?: Record<string, string>): void {
    const hasErrors = errors ? Object.keys(errors).length > 0 : false;
    this.submitButton.disabled = hasErrors;
  }

  setValidationErrors(errors: Record<string, string>): void {
    this.setErrors(errors);
    this.updateSubmitButton(errors);
  }

  protected onSubmit(_data?: Record<string, string>): void {
  this.emit('contacts:submit');
}

}