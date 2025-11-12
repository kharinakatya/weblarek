import { CardView } from './CardView';
import { IProduct } from '../../types/index';
import { ensureElement } from '../../utils/utils';

export class BasketCardView extends CardView {
  constructor() {
    super('#card-basket');
  }

  render(product: IProduct, index: number): HTMLElement {
    const node = this.getTemplate();
    this.fillCard(node, product);

    try {
      const indexEl = ensureElement<HTMLElement>('.basket__item-index', node);
      indexEl.textContent = String(index + 1);
    } catch (e) {
    }

    try {
      const deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', node);
      deleteBtn.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        this.emit('basket:remove-item', { product });
      });
    } catch (e) {
    }

    return node;
  }
}