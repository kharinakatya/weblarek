// ContactsFormView.ts
import { FormView } from './FormView';

export class ContactsFormView extends FormView {
  constructor() {
    super('#contacts');
  }

  render(): HTMLElement {
    const node = this.getTemplate();
    this.initForm(node);

    this.clearErrors();

    const emailInput = node.querySelector('input[name="email"]') as HTMLInputElement | null;
    const phoneInput = node.querySelector('input[name="phone"]') as HTMLInputElement | null;

    if (emailInput) {
      emailInput.addEventListener('input', () =>
        this.emit('buyer:change', { key: 'email', value: emailInput.value })
      );
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', () =>
        this.emit('buyer:change', { key: 'phone', value: phoneInput.value })
      );

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

      const onPhoneInput = () => {
        const start = phoneInput.selectionStart ?? phoneInput.value.length;
        const formatted = formatPhone(phoneInput.value);
        phoneInput.value = formatted;
      };

      phoneInput.addEventListener('input', onPhoneInput);
      phoneInput.addEventListener('blur', onPhoneInput);
    }

    return node;
  }

  setValidationErrors(errors: Record<string, string>): void {
    this.clearErrors();
  }

  // validate возвращает пустой объект — локальная валидация не блокирует сабмит
  validate(_formData: Record<string, string>): Record<string, string> {
    return {};
  }

  protected onSubmit(data: Record<string, string>): void {
    this.emit('contacts:submit', { data });
  }
}