import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { IProduct } from '../../types/index';

export class ProductCatalogView extends EventEmitter {
  private container: HTMLElement;
  private templateSelector = '#card-catalog';

  constructor(container: HTMLElement) {
    super();
    if (!container) throw new Error('ProductCatalogView: container is required');
    this.container = container;
  }

  render(items: IProduct[] = []) {
    this.container.innerHTML = '';

    items.forEach(product => {
      const card = cloneTemplate<HTMLElement>(this.templateSelector);

      const titleEl = card.querySelector('.card__title') as HTMLElement | null;
      const imgEl = card.querySelector('.card__image') as HTMLImageElement | null;
      const priceEl = card.querySelector('.card__price') as HTMLElement | null;
      const categoryEl = card.querySelector('.card__category') as HTMLElement | null;

      if (titleEl) titleEl.textContent = product.title;
      if (priceEl) priceEl.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесплатно';
      if (categoryEl) {
        categoryEl.textContent = product.category;

        const modifier = (categoryMap as Record<string, string>)[product.category] ?? 'card__category_other';
        categoryEl.className = `card__category ${modifier}`;
      }
      if (imgEl) {

        imgEl.src = `${CDN_URL}${product.image}`;
        imgEl.alt = product.title;
      }

      card.dataset.id = product.id;

      card.addEventListener('click', () => {
        this.emit('catalog:card-click', { product });
      });

      this.container.append(card);
    });
  }
}