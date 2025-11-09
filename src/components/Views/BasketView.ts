// BasketView.ts
import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class BasketView extends EventEmitter {
  private container: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement;

  constructor() {
    super();
    this.container = cloneTemplate<HTMLElement>('#basket');
    this.listEl = this.container.querySelector('.basket__list') as HTMLElement;
    this.totalEl = this.container.querySelector('.basket__price') as HTMLElement;
    this.orderBtn = this.container.querySelector('.basket__button') as HTMLButtonElement;

    if (this.orderBtn) {
      this.orderBtn.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.emit('basket:order-click');
      });
    }
  }

  set items(items: HTMLElement[]) {
    this.listEl.innerHTML = '';
    if (items.length > 0) {
      this.listEl.replaceChildren(...items);
      if (this.orderBtn) this.orderBtn.disabled = false;
    } else {
      this.listEl.innerHTML = '<p>Корзина пуста</p>';
      if (this.orderBtn) this.orderBtn.disabled = true;
    }
  }

  set total(total: number) {
    if (this.totalEl) this.totalEl.textContent = `${total} синапсов`;
  }

  render(): HTMLElement {
    this.container.dataset.id = 'basket';
    return this.container;
  }
}