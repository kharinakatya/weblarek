//CatalogView.ts
import { EventEmitter } from '../base/Events';
import { CatalogCardView } from './CatalogCardView';
import { IProduct } from '../../types/index';

export class CatalogView extends EventEmitter {
  private container: HTMLElement;
  private catalogCardView: CatalogCardView;

  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.catalogCardView = new CatalogCardView();
    this.catalogCardView.on('catalog:card-click', (data) => this.emit('catalog:card-click', data));
  }

  render(items: IProduct[]): void {
    this.container.innerHTML = '';
    items.forEach(item => {
      const card = this.catalogCardView.render(item);
      this.container.appendChild(card);
    });
  }
}
