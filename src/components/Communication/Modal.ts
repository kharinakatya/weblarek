import { CDN_URL } from '../../utils/constants';
import { cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types/index';

export class ModalController {
  private modalRoot: HTMLElement;
  private container: HTMLElement;
  private content: HTMLElement;
  private closeBtn: HTMLElement | null;
  private prevFocused: Element | null = null;
  private boundOnKey = this.onKeyDown.bind(this);
  private boundOnRootClick = this.onRootClick.bind(this);

  constructor(modalSelector = '#modal-container') {
    this.modalRoot = document.querySelector(modalSelector) as HTMLElement;
    if (!this.modalRoot) throw new Error(`Modal root ${modalSelector} not found`);

    this.container = this.modalRoot.querySelector('.modal__container') as HTMLElement;
    this.content = this.modalRoot.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = this.modalRoot.querySelector('.modal__close');

    this.initHandlers();
  }

  private initHandlers() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    this.modalRoot.addEventListener('click', this.boundOnRootClick);
  }

  private onRootClick(e: MouseEvent) {
    if (!this.container.contains(e.target as Node)) {
      this.close();
    }
  }

  open(product: IProduct, templateSelector = '#card-preview') {
    this.prevFocused = document.activeElement;

    this.content.innerHTML = '';
    const node = cloneTemplate<HTMLElement>(templateSelector);
    this.fillPreview(node, product);

    const addButton = node.querySelector('.card__button') as HTMLButtonElement | null;
    if (addButton) {
      addButton.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const custom = new CustomEvent('modal:add-to-basket', { detail: { product } });
        window.dispatchEvent(custom);
      });
    }

    this.content.appendChild(node);

    this.modalRoot.classList.add('is-open');
    this.modalRoot.setAttribute('aria-hidden', 'false');

    document.addEventListener('keydown', this.boundOnKey);

    this.trapFocus();
  }

  close() {
    this.modalRoot.classList.remove('is-open');
    this.modalRoot.setAttribute('aria-hidden', 'true');

    document.removeEventListener('keydown', this.boundOnKey);

    if (this.prevFocused instanceof HTMLElement) {
      this.prevFocused.focus();
    }
  }

  private fillPreview(node: HTMLElement, p: IProduct) {
    const title = node.querySelector('.card__title') as HTMLElement | null;
    const img = node.querySelector('.card__image') as HTMLImageElement | null;
    const text = node.querySelector('.card__text') as HTMLElement | null;
    const price = node.querySelector('.card__price') as HTMLElement | null;
    const category = node.querySelector('.card__category') as HTMLElement | null;

    if (title) title.textContent = p.title ?? '';
    if (text) text.textContent = p.description ?? '';
    if (price) price.textContent = p.price != null ? `${p.price} синапсов` : 'Бесплатно';
    if (category) category.textContent = p.category ?? '';

    if (img) {
  img.src = `${CDN_URL}${p.image}`;
  img.alt = p.title ?? '';
}
    node.dataset.id = p.id ?? '';
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key === 'Tab') {
      this.maintainFocus(e);
    }
  }

  private getFocusable(): HTMLElement[] {
    return Array.from(
      this.modalRoot.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => el.offsetParent !== null);
  }

  private trapFocus() {
    const list = this.getFocusable();
    if (list.length) {
      list[0].focus();
    } else {
      (this.container as HTMLElement).focus();
    }
  }

  private maintainFocus(e: KeyboardEvent) {
    const list = this.getFocusable();
    if (!list.length) {
      e.preventDefault();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

openContent(content: HTMLElement) {
  this.prevFocused = document.activeElement;
  this.content.innerHTML = '';
  this.content.appendChild(content);
  this.modalRoot.classList.add('is-open');
  this.modalRoot.setAttribute('aria-hidden', 'false');

  document.addEventListener('keydown', this.boundOnKey);
  this.trapFocus();
}
}