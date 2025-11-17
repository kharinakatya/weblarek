import { EventEmitter } from '../base/Events'
import { IProduct } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants'; 

export class CardView extends EventEmitter {
  protected templateSelector: string;

  constructor(templateSelector: string) {
    super();
    this.templateSelector = templateSelector;
  }

  protected getTemplate(): HTMLElement {
    const tmpl = ensureElement<HTMLTemplateElement>(this.templateSelector);
    const el = tmpl.content.firstElementChild;
    if (!el) throw new Error(`Template ${this.templateSelector} has no root element`);
    return el.cloneNode(true) as HTMLElement;
  }

  fillCard(node: HTMLElement, product: IProduct) {
    const titleEl = ensureElement<HTMLElement>('.card__title', node);
    titleEl.textContent = (product.title ?? product.name ?? '').toString();

    const priceEl = ensureElement<HTMLElement>('.card__price', node);
    priceEl.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесплатно';

    const categoryEl = node.querySelector('.card__category') as HTMLElement | null;
    if (categoryEl) { 
      categoryEl.textContent = product.category; 
      const modifier = (categoryMap as Record<string, string>)[product.category] ?? 'card__category_other'; 
      categoryEl.className = `card__category ${modifier}`; 
    }

    const imgEl = node.querySelector('img') as HTMLImageElement | null;
    if (imgEl) { 
      imgEl.src = `${CDN_URL}${product.image}`; 
      imgEl.alt = product.title; 
    }

    node.dataset.productId = product.id;
    node.dataset.id = product.id;

    const addBtn = node.querySelector('.card__add-to-basket, .card__add') as HTMLElement | null;
    if (addBtn) {
      addBtn.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        this.emit('basket:add-item', { product });
      });
    }
  }

  render(product: IProduct, index?: number): HTMLElement {
    const node = this.getTemplate();
    this.fillCard(node, product);

    if (typeof index === 'number') {
      const ind = node.querySelector('.card__index') as HTMLElement | null;
      if (ind) ind.textContent = String(index + 1);
    }

    return node;
  }
  
}