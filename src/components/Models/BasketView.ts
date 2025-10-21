import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';
import { Basket } from '../Models/Basket';

export class BasketView extends EventEmitter {
  private basket: Basket;
  private basketTemplate = '#basket';
  private itemTemplate = '#card-basket';

  constructor(basket: Basket) {
    super();
    this.basket = basket;
  }

  render(): HTMLElement {

  const basketElement = cloneTemplate<HTMLElement>(this.basketTemplate);
  const listElement = basketElement.querySelector('.basket__list') as HTMLElement;
  const totalElement = basketElement.querySelector('.basket__price') as HTMLElement;
  const orderButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;

  listElement.innerHTML = '';

  const items = this.basket.getItems();

  if (items.length === 0) {

    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Корзина пуста';
    emptyMessage.classList.add('basket__empty');
    listElement.appendChild(emptyMessage);

    if (totalElement) totalElement.textContent = '0 синапсов';
    if (orderButton) orderButton.disabled = true;
  } else {

    items.forEach((product, index) => {
      const itemElement = cloneTemplate<HTMLElement>(this.itemTemplate);

      const indexEl = itemElement.querySelector('.basket__item-index') as HTMLElement;
      const titleEl = itemElement.querySelector('.card__title') as HTMLElement;
      const priceEl = itemElement.querySelector('.card__price') as HTMLElement;
      const deleteBtn = itemElement.querySelector('.basket__item-delete') as HTMLElement;

      if (indexEl) indexEl.textContent = String(index + 1);
      if (titleEl) titleEl.textContent = product.title;
      if (priceEl) priceEl.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесплатно';

    if (deleteBtn) {
    deleteBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    this.emit('basket:remove-item', { product });
  });
}

      listElement.appendChild(itemElement);
    });

    if (totalElement) {
      totalElement.textContent = `${this.basket.getTotal()} синапсов`;
    }

    if (orderButton) orderButton.disabled = false;

    if (orderButton) {
    orderButton.addEventListener('click', (ev) => {
    ev.stopPropagation();
    this.emit('basket:order-click');
  });
}
}

  return basketElement;
    }
}