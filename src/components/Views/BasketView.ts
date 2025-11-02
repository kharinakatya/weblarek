//BasketView.ts
import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';
import { BasketCardView } from './BasketCardView';
import { IProduct } from '../../types/index';

export class BasketView extends EventEmitter {
  private basketCardView: BasketCardView;

  constructor() {
    super();
    this.basketCardView = new BasketCardView();
    this.basketCardView.on('basket:remove-item', (data) => this.emit('basket:remove-item', data));
  }

  render(items: IProduct[], total: number): HTMLElement {
    const node = cloneTemplate<HTMLElement>('#basket');
    const listEl = node.querySelector('.basket__list') as HTMLElement;
    const totalEl = node.querySelector('.basket__price') as HTMLElement;
    const orderBtn = node.querySelector('.basket__button') as HTMLButtonElement;

    listEl.innerHTML = '';
    if (items.length === 0) {
      listEl.innerHTML = '<p>Корзина пуста</p>';
      if (orderBtn) orderBtn.disabled = true;
    } else {
      items.forEach((item, index) => {
        const card = this.basketCardView.render(item, index);
        listEl.appendChild(card);
      });
if (orderBtn) {
  orderBtn.disabled = false;
  orderBtn.addEventListener('click', (ev: MouseEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.emit('basket:order-click');
  });
}
    }
    if (totalEl) totalEl.textContent = `${total} синапсов`;
    return node;
  }
}
