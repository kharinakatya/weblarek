//CatalogCardView.ts
import { CardView } from './CardView';
import { IProduct } from '../../types/index';

export class CatalogCardView extends CardView {
  constructor() {
    super('#card-catalog');
  }

  render(product: IProduct): HTMLElement {
    const node = this.getTemplate();
    this.fillCard(node, product);
    node.addEventListener('click', () => {
      this.emit('catalog:card-click', { product });
    });
    return node;
  }
}
