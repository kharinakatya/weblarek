import { EventEmitter } from '../base/Events';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { BasketCardView } from './BasketCardView';
import { IProduct } from '../../types/index';

interface RemoveItemEventData {
  product: IProduct;
}

export class BasketView extends EventEmitter {
  private container: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement | null;
  private currentItems: HTMLElement[] = [];

  constructor() {
    super();

    this.container = cloneTemplate<HTMLElement>('#basket');
    this.listEl = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalEl = ensureElement<HTMLElement>('.basket__price', this.container);

    try {
      this.orderBtn = ensureElement<HTMLButtonElement>('.basket__button', this.container);
      this.orderBtn.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('BasketView: order button clicked');
        this.emit('basket:order-click');
      });
    } catch {
      this.orderBtn = null;
    }

    if (this.orderBtn) {
      this.orderBtn.disabled = true;
    }
  }

  set items(items: HTMLElement[]) {
    this.currentItems = items || [];
    this.listEl.innerHTML = '';
    if (this.currentItems.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'Корзина пуста';
      this.listEl.appendChild(p);
      if (this.orderBtn) this.orderBtn.disabled = true;
    } else {
      this.currentItems.forEach(el => this.listEl.appendChild(el));
      if (this.orderBtn) this.orderBtn.disabled = false;
    }
  }

  set total(total: number) {
    const displayTotal = Math.max(0, total || 0);
    this.totalEl.textContent = `${displayTotal} синапсов`;
    if (this.orderBtn) this.orderBtn.disabled = displayTotal === 0;
  }

  render(): HTMLElement {
    return this.container;
  }

  updateTotal(total: number): void {
    this.total = total;
  }
}