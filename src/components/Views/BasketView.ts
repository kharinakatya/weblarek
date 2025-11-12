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

  private cardViews: BasketCardView[] = [];

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
  }

  render(items?: IProduct[], total?: number): HTMLElement {
    items = items || [];
    total = total || 0;

    this.container.dataset.id = 'basket';

    this.cardViews.forEach(view => view.offAll?.());
    this.cardViews = [];

    this.listEl.innerHTML = '';
    if (items.length === 0) {
      this.listEl.innerHTML = '<p>Корзина пуста</p>';
      if (this.orderBtn) this.orderBtn.disabled = true;
    } else {
      items.forEach((item, index) => {
        const cardView = new BasketCardView();
        const cardEl = cardView.render(item, index);

        cardView.on('basket:remove-item', (data: RemoveItemEventData) => {
          this.emit('basket:remove-item', data);
        });

        this.cardViews.push(cardView);
        this.listEl.appendChild(cardEl);
      });
      if (this.orderBtn) this.orderBtn.disabled = false;
    }

    const displayTotal = Math.max(0, total);
    this.totalEl.textContent = `${displayTotal} синапсов`;
    return this.container;
  }

  updateTotal(total: number): void {
    const displayTotal = Math.max(0, total);
    this.totalEl.textContent = `${displayTotal} синапсов`;
    if (this.orderBtn) this.orderBtn.disabled = displayTotal === 0;
  }
}