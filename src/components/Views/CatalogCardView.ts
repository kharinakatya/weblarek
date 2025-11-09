// CatalogCardView.ts
import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types/index';
import { CDN_URL } from '../../utils/constants';

export class CatalogCardView extends EventEmitter {
  private container!: HTMLElement;

  render(product: IProduct): HTMLElement {
    this.container = cloneTemplate<HTMLElement>('#card-catalog');
    
    const titleEl = this.container.querySelector('.card__title') as HTMLElement;
    const priceEl = this.container.querySelector('.card__price') as HTMLElement;
    const imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
    const categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    
    if (titleEl) titleEl.textContent = product.title;
    if (priceEl) priceEl.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесплатно';
    if (imageEl) {

      imageEl.src = `${CDN_URL}${product.image}`;
      imageEl.alt = product.title;
    }

    if (categoryEl) categoryEl.textContent = product.category;
    this.container.addEventListener('click', () => {
      this.emit('catalog:card-click', { product });
    });
    
    return this.container;
  }

  getElement(): HTMLElement {
    return this.container;
  }
}