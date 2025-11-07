// CatalogView.ts
import { EventEmitter } from '../base/Events';
import { CatalogCardView } from './CatalogCardView';

export class CatalogView extends EventEmitter {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    super();
    this.container = container;
  }

  set items(views: CatalogCardView[]) {
    const elements = views.map(view => view.getElement());
    this.container.replaceChildren(...elements);
  }
}
