//CardView.ts
import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { IProduct } from '../../types/index';

export abstract class CardView extends EventEmitter {
  protected templateSelector: string;

  constructor(templateSelector: string) {
    super();
    this.templateSelector = templateSelector;
  }

  protected getTemplate(): HTMLElement {
    return cloneTemplate<HTMLElement>(this.templateSelector);
  }

  protected fillCard(node: HTMLElement, product: IProduct): void {
    const titleEl = node.querySelector('.card__title') as HTMLElement | null;
    const imgEl = node.querySelector('.card__image') as HTMLImageElement | null;
    const priceEl = node.querySelector('.card__price') as HTMLElement | null;
    const categoryEl = node.querySelector('.card__category') as HTMLElement | null;

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
    node.dataset.id = product.id;
  }

  abstract render(product: IProduct, ...args: any[]): HTMLElement;
}
