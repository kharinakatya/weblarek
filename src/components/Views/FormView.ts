import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export abstract class FormView extends EventEmitter {
  protected templateSelector: string;
  protected formElement: HTMLFormElement | null = null;
  protected submitButton: HTMLButtonElement | null = null;
  protected errorsElement: HTMLElement | null = null;
  protected node: HTMLElement | null = null;

  private _submitHandler: ((e: SubmitEvent) => void) | null = null;

  constructor(templateSelector: string) {
    super();
    this.templateSelector = templateSelector;
  }

  protected getTemplate(): HTMLElement {
    return cloneTemplate<HTMLElement>(this.templateSelector);
  }

  protected ensureElement(selector: string, context?: HTMLElement): HTMLElement {
    const ctx = context || document;
    const el = ctx.querySelector(selector);
    if (!el) {
      throw new Error(`Element not found: ${selector}`);
    }
    return el;
  }

  protected initForm(node: HTMLElement): void {

    this.node = node;

    this.formElement = (node.tagName === 'FORM' ? node : node.querySelector('form')) as HTMLFormElement | null;

    this.submitButton = (
      this.formElement?.querySelector('button[type="submit"]') ??
      node.querySelector('button[type="submit"]')
    ) as HTMLButtonElement | null;

    this.errorsElement = (
      this.formElement?.querySelector('.form__errors') ??
      node.querySelector('.form__errors')
    ) as HTMLElement | null;

    if (this._submitHandler && this.formElement) {
      try {
        this.formElement.removeEventListener('submit', this._submitHandler);
      } catch (err) {

      }
    }

    if (this.formElement) {
      this._submitHandler = (e: SubmitEvent) => {
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
      };
      this.formElement.addEventListener('submit', this._submitHandler);
    }
  }

  abstract validate(formData: Record<string, string>): Record<string, string>;
  protected abstract onSubmit(data: Record<string, string>): void;

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

  public clearForm(): void {
    if (!this.node) return;

    if (this.formElement) {
      try {
        this.formElement.reset();
      } catch {
      }
    }

    try {
      this.clearErrors();
    } catch {

    }

    try {
      const alternates = Array.from(this.node.querySelectorAll<HTMLElement>('.button_alt'));
      alternates.forEach(b => {
        b.classList.remove('button_alt-active');
        b.setAttribute('aria-pressed', 'false');
      });
    } catch {

    }

    try {
      this.afterClear();
    } catch {

    }

    this.emit('form:cleared');
  }
}
