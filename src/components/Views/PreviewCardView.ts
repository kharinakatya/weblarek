//PreviewCardView.ts
import { CardView } from './CardView';
import { IProduct } from '../../types/index';

export class PreviewCardView extends CardView {
  constructor() {
    super('#card-preview');
  }

  render(product: IProduct): HTMLElement {
    const node = this.getTemplate();
    this.fillCard(node, product);
    const textEl = node.querySelector('.card__text') as HTMLElement | null;
    if (textEl) textEl.textContent = product.description;
    const button = node.querySelector('.card__button') as HTMLButtonElement | null;
    if (button) {
      button.addEventListener('click', () => {
        this.emit('preview:add-to-basket', { product });
      });
    }
    return node;
  }
}
