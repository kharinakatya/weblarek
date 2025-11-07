// BasketCardView.ts
import { CardView } from './CardView';
import { IProduct } from '../../types/index';

export class BasketCardView extends CardView {
  constructor() {
    super('#card-basket');
  }

  render(product: IProduct, index: number): HTMLElement {
    const node = this.getTemplate();
    this.fillCard(node, product);
    const indexEl = node.querySelector('.basket__item-index') as HTMLElement | null;
    if (indexEl) indexEl.textContent = String(index + 1);
    const deleteBtn = node.querySelector('.basket__item-delete') as HTMLButtonElement | null;
    if (deleteBtn) {
deleteBtn.addEventListener('click', (e: MouseEvent) => {
  e.stopPropagation();
  this.emit('basket:remove-item', { product });
});
    }
    return node;
  }
}