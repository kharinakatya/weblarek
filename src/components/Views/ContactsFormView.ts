//ContactsFormView.ts
import { FormView } from './FormView';

export class ContactsFormView extends FormView {

  private node: HTMLElement;

  constructor() {
    super('#contacts');
    this.node = this.getTemplate();
    this.initForm(this.node);
    this.setupListeners(this.node);
  }

  private setupListeners(node: HTMLElement): void {
    const emailInput = node.querySelector('input[name="email"]') as HTMLInputElement | null;
    const phoneInput = node.querySelector('input[name="phone"]') as HTMLInputElement | null;

    if (emailInput) {
      emailInput.addEventListener('input', () =>
        this.emit('buyer:change', { key: 'email', value: emailInput.value })
      );
    }

    if (phoneInput) {
      const formatPhone = (value: string) => {
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

      const setCaretByDigits = (input: HTMLInputElement, digitsBefore: number, formatted: string) => {
        let count = 0;
        let pos = 0;
        while (pos < formatted.length && count < digitsBefore) {
          if (/\d/.test(formatted[pos])) count++;
          pos++;
        }
        input.setSelectionRange(pos, pos);
      };

      const onPhoneInput = () => {
        const raw = phoneInput.value;
        const caretPos = phoneInput.selectionStart ?? raw.length;
        const digitsBefore = raw.slice(0, caretPos).replace(/\D/g, '').length;
        const formatted = formatPhone(raw);
        phoneInput.value = formatted;
        setCaretByDigits(phoneInput, digitsBefore, formatted);
        this.emit('buyer:change', { key: 'phone', value: formatted });
      };

      phoneInput.addEventListener('input', onPhoneInput);
      phoneInput.addEventListener('blur', onPhoneInput);
    }
  }

render(): HTMLElement {
  this.clearErrors();
  
  const submitBtn = this.node.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (submitBtn) {
    submitBtn.disabled = true;
  }
  
  this.setValidationErrors({});
  
  return this.node;
}


setValidationErrors(errors: Record<string, string>): void {
  // Отобразить ошибки
  this.setErrors(errors);

  const emailInput = this.node.querySelector('input[name="email"]') as HTMLInputElement | null;
  const phoneInput = this.node.querySelector('input[name="phone"]') as HTMLInputElement | null;
  const emailValue = emailInput?.value.trim() || '';
  const phoneValue = phoneInput?.value.trim() || '';
  const submitBtn = this.node.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (submitBtn) {
    const hasErrors = Object.keys(errors).length > 0;
    const fieldsFilled = emailValue !== '' && phoneValue !== '';
    submitBtn.disabled = hasErrors || !fieldsFilled;
  }
}

  validate(_formData: Record<string, string>): Record<string, string> {
    return {};
  }

  protected onSubmit(data: Record<string, string>): void {
    this.emit('contacts:submit', { data });
  }

  public clearForm(): void {
    // очистить значения полей
    const emailInput = this.node.querySelector('input[name="email"]') as HTMLInputElement | null;
    const phoneInput = this.node.querySelector('input[name="phone"]') as HTMLInputElement | null;
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';

    this.clearErrors();
    const submitBtn = this.node.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submitBtn) submitBtn.disabled = true;

    this.emit('buyer:change', { key: 'email', value: '' });
    this.emit('buyer:change', { key: 'phone', value: '' });
  }

}
