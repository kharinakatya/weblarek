// CardView.ts
import { EventEmitter } from '../base/Events'
import { IProduct } from '../../types/index';

export class CardView extends EventEmitter {
  protected templateSelector: string;

  constructor(templateSelector: string) {
    super();
    this.templateSelector = templateSelector;
  }

  protected getTemplate(): HTMLElement {
    const tmpl = document.querySelector(this.templateSelector) as HTMLTemplateElement | null;
    if (!tmpl) throw new Error(`Template not found: ${this.templateSelector}`);

    const el = tmpl.content.firstElementChild;
    if (!el) throw new Error(`Template ${this.templateSelector} has no root element`);

    return el.cloneNode(true) as HTMLElement;
  }

  fillCard(node: HTMLElement, product: IProduct) {
    const titleEl = node.querySelector('.card__title') as HTMLElement | null;
    if (titleEl) titleEl.textContent = (product.title ?? product.name ?? '').toString();

    const priceEl = node.querySelector('.card__price') as HTMLElement | null;
    if (priceEl) priceEl.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесплатно';

    const imgEl = node.querySelector('img') as HTMLImageElement | null;
    if (imgEl && (product as any).image) imgEl.src = (product as any).image;

    if (product && (product as any).id !== undefined) {
      node.dataset.productId = String((product as any).id);
    }

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