// BasketView.ts
import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';
import { BasketCardView } from './BasketCardView';
import { IProduct } from '../../types/index';

export class BasketView extends EventEmitter {
  private container: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement;

  private cardViews: BasketCardView[] = [];

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
      console.log('BasketView: order button clicked');
      this.emit('basket:order-click');
    });
  }
}

  render(items: IProduct[], total: number): HTMLElement {
    this.container.dataset.id = 'basket';

    this.cardViews = [];

    this.listEl.innerHTML = '';
    if (items.length === 0) {
      this.listEl.innerHTML = '<p>Корзина пуста</p>';
      if (this.orderBtn) this.orderBtn.disabled = true;
    } else {
      items.forEach((item, index) => {
        const cardView = new BasketCardView();
        const cardEl = cardView.render(item, index);

        cardView.on('basket:remove-item', ({ product }) => {
          this.emit('basket:remove-item', { product });
        });

        this.cardViews.push(cardView);
        this.listEl.appendChild(cardEl);
      });
      if (this.orderBtn) this.orderBtn.disabled = false;
    }
    if (this.totalEl) 
      this.totalEl.textContent = `${total} синапсов`;
    return this.container;
  }
}