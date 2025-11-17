import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types/index';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class PreviewCardView extends EventEmitter {
  private container!: HTMLElement;

  constructor() {
    super();
  }

  render(product: IProduct, isInBasket: boolean): HTMLElement {
    this.container = cloneTemplate<HTMLElement>('#card-preview');

    const titleEl = this.container.querySelector('.card__title') as HTMLElement | null;
    const descriptionEl = this.container.querySelector('.card__text') as HTMLElement | null;
    const priceEl = this.container.querySelector('.card__price') as HTMLElement | null;
    const imageEl = this.container.querySelector('.card__image') as HTMLImageElement | null;
    const categoryEl = this.container.querySelector('.card__category') as HTMLElement | null;
    const buttonEl = this.container.querySelector('.card__button') as HTMLButtonElement | null;

    if (titleEl) titleEl.textContent = product.title;
    if (descriptionEl) descriptionEl.textContent = product.description;
    if (priceEl) priceEl.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесплатно';
    if (imageEl) { imageEl.src = `${CDN_URL}${product.image}`; imageEl.alt = product.title; }
    if (categoryEl) categoryEl.textContent = product.category;

    const modifier = categoryMap[product.category] ?? 'card__category_other';
    categoryEl.className = `card__category ${modifier}`;

    this.setupButton(buttonEl, product, isInBasket);

    return this.container;
  }

  private setupButton(buttonEl: HTMLButtonElement | null, product: IProduct, isInBasket: boolean): void {
    if (!buttonEl) return;

    const newButton = buttonEl.cloneNode(true) as HTMLButtonElement;
    buttonEl.replaceWith(newButton);

    newButton.replaceChildren();
    if (isInBasket) {
      newButton.textContent = 'Удалить из корзины';
      newButton.classList.add('button_remove');
      newButton.classList.remove('button_buy');
      newButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emit('preview:remove-from-basket', { product });
      });
    } else {
      newButton.textContent = 'Купить';
      newButton.classList.add('button_buy');
      newButton.classList.remove('button_remove');
      newButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emit('preview:add-to-basket', { product });
      });
    }
  }
}