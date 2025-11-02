// FormView.ts
import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export abstract class FormView extends EventEmitter {
  protected templateSelector: string;
  protected formElement: HTMLFormElement | null = null;
  protected submitButton: HTMLButtonElement | null = null;
  protected errorsElement: HTMLElement | null = null;

  constructor(templateSelector: string) {
    super();
    this.templateSelector = templateSelector;
  }

  protected getTemplate(): HTMLElement {
    return cloneTemplate<HTMLElement>(this.templateSelector);
  }


protected initForm(node: HTMLElement): void {
  if (!this.formElement) {
    this.formElement = (node.tagName === 'FORM' ? node : node.querySelector('form')) as HTMLFormElement | null;
  }

  if (!this.submitButton) {
    this.submitButton = (
      this.formElement?.querySelector('button[type="submit"]') ??
      node.querySelector('button[type="submit"]')
    ) as HTMLButtonElement | null;
  }

  if (!this.errorsElement) {
    this.errorsElement = (
      this.formElement?.querySelector('.form__errors') ??
      node.querySelector('.form__errors')
    ) as HTMLElement | null;
  }

  if (this.formElement) {
    this.formElement.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      const data = new FormData(this.formElement as HTMLFormElement);
      const formData = Object.fromEntries(data.entries()) as Record<string, string>;

      const errors = this.validate(formData);
      if (Object.keys(errors).length > 0) {
        this.setErrors(errors);
      } else {
        this.clearErrors();
        this.onSubmit(formData);
      }
    });
  }
}
  protected abstract onSubmit(data: Record<string, string>): void;
  protected abstract validate(data: Record<string, string>): Record<string, string>;

  setErrors(errors: Record<string, string>): void {
    if (this.errorsElement) {
      this.errorsElement.textContent = Object.values(errors).join(', ');
    }
    if (this.submitButton) {
      this.submitButton.disabled = Object.keys(errors).length > 0;
    }
  }

  clearErrors(): void {
    if (this.errorsElement) this.errorsElement.textContent = '';
    if (this.submitButton) this.submitButton.disabled = false;
  }

  abstract render(): HTMLElement;
}
