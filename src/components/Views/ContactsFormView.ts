// ContactsFormView.ts
import { FormView } from './FormView';

export class ContactsFormView extends FormView {
  private touchedEmail: boolean = false;
  private touchedPhone: boolean = false;

  constructor() {
    super('#contacts');
  }

  render(): HTMLElement {
    const node = this.getTemplate();
    this.initForm(node);

    if (!this.formElement) {
      this.formElement = node.querySelector('form') as HTMLFormElement | null;
    }

    this.validateAndUpdate();

    const emailInput = node.querySelector('input[name="email"]') as HTMLInputElement | null;
    const phoneInput = node.querySelector('input[name="phone"]') as HTMLInputElement | null;

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        this.touchedEmail = true;
        this.validateAndUpdate();
      });
      emailInput.addEventListener('blur', () => {
        this.touchedEmail = true;
        this.validateAndUpdate();
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        this.touchedPhone = true;
        this.applyPhoneMask(phoneInput);
        this.validateAndUpdate();
      });
      phoneInput.addEventListener('blur', () => {
        this.touchedPhone = true;
        this.applyPhoneMask(phoneInput);
        this.validateAndUpdate();
      });
    }

    return node;
  }

  protected onSubmit(data: Record<string, string>): void {
    if (data.phone) {
      data.phone = data.phone.toString().trim();
    }
    this.emit('contacts:submit', data);
  }

  protected validate(data: Record<string, string>): Record<string, string> {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Валидация email (обязательна)
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = 'Введите корректный email';
    }

    const cleanPhone = data.phone ? data.phone.replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone.length === 0) {
      errors.phone = 'Введите телефон';
    }

    return errors;
  }

  private validateAndUpdate(): void {
    // Попробуем восстановить formElement, если он не установлен
    if (!this.formElement) {
      this.formElement = document.querySelector('form[name="contacts"]') as HTMLFormElement | null;
      if (!this.formElement) return;
    }

    const formData = new FormData(this.formElement);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    // Нормализуем значения
    data.email = (data.email || '').toString().trim();
    data.phone = (data.phone || '').toString().trim();

    // Логирование для отладки (можно удалить в проде)
    console.log('ContactsFormView - data:', data);

    const errors = this.validate(data);
    console.log('ContactsFormView - errors:', errors);

    // Формируем видимые ошибки. Показываем email только если поле было тронуто.
    const visibleErrors: Record<string, string> = {};
    if (errors.email && this.touchedEmail) visibleErrors.email = errors.email;
    // Для телефона показывать ошибку только если тронуто
    if (errors.phone && this.touchedPhone) visibleErrors.phone = errors.phone;

    // Обновим контейнер ошибок (в форме может быть единый элемент .form__errors)
    const errorsEl = this.formElement.querySelector('.form__errors') as HTMLElement | null;
    if (errorsEl) {
      const msgs: string[] = [];
      if (visibleErrors.email) msgs.push(visibleErrors.email);
      if (visibleErrors.phone) msgs.push(visibleErrors.phone);
      errorsEl.textContent = msgs.length ? msgs.join('. ') : '';
    }

    // Также попробуем вызвать setErrors (если реализовано в FormView)
    try {
      (this as any).setErrors?.(visibleErrors);
    } catch (e) {
      // ignore
    }

    // Валидность формы: email должен быть валиден, телефон — любой непустой (с учётом чистых цифр)
    const isEmailValid = !errors.email;
    const isPhoneValid = !errors.phone;
    const isFormValid = isEmailValid && isPhoneValid;

    console.log('ContactsFormView - isFormValid:', isFormValid);

    // Обновление состояния кнопки "Оплатить" — используем this.submitButton из FormView
    if (this.submitButton) {
      console.log('Setting submitButton disabled to', !isFormValid);
      this.submitButton.disabled = !isFormValid;
      this.submitButton.classList.toggle('button_disabled', !isFormValid);
      this.submitButton.setAttribute('aria-disabled', (!isFormValid).toString());
    } else {
      console.warn('submitButton not found in ContactsFormView');
    }

    // Пометка полей aria-invalid
    const emailInput = this.formElement.querySelector('input[name="email"]') as HTMLInputElement | null;
    const phoneInput = this.formElement.querySelector('input[name="phone"]') as HTMLInputElement | null;
    if (emailInput) emailInput.setAttribute('aria-invalid', errors.email ? 'true' : 'false');
    if (phoneInput) phoneInput.setAttribute('aria-invalid', errors.phone ? 'true' : 'false');
  }

  // Улучшенная функция для применения маски телефона в формате +7 (XXX) XXX-XX-XX
  private applyPhoneMask(input: HTMLInputElement): void {
    const oldValue = input.value;
    const oldCursor = input.selectionStart ?? 0;

    // Сколько цифр находится слева от курсора в старом значении
    const digitsBeforeCursor = oldValue.slice(0, oldCursor).replace(/\D/g, '').length;

    // Берём только цифры
    let digits = oldValue.replace(/\D/g, '');

    // Убираем ведущую 7, если она появилась (мы сами добавляем +7 в форматировании)
    if (digits.startsWith('7')) digits = digits.slice(1);

    // Ограничение на 10 цифр локального номера
    digits = digits.slice(0, 10);

    // Формируем отфомрованную строку (пусто, если цифр нет)
    let formatted = '';
    if (digits.length > 0) {
      formatted = '+7 (';
      formatted += digits.slice(0, 3);
      formatted += ')';
      if (digits.length > 3) formatted += ' ' + digits.slice(3, 6);
      if (digits.length > 6) formatted += '-' + digits.slice(6, 8);
      if (digits.length > 8) formatted += '-' + digits.slice(8, 10);
    }

    input.value = formatted;

    // Восстанавливаем позицию курсора: сопоставляем количество цифр слева от курсора с новой строкой
    let newCursor = 0;
    if (digitsBeforeCursor === 0) {
      newCursor = formatted ? formatted.indexOf('(') + 1 : 0;
    } else {
      let counted = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) counted++;
        if (counted === digitsBeforeCursor) {
          newCursor = i + 1;
          break;
        }
      }
      if (newCursor === 0) newCursor = formatted.length;
    }

    newCursor = Math.max(0, Math.min(newCursor, formatted.length));
    try {
      input.setSelectionRange(newCursor, newCursor);
    } catch (e) {
      // ignore
    }
  }
}
