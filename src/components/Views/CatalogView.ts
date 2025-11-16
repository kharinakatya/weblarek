import { EventEmitter } from '../base/Events';
import { CatalogCardView } from './CatalogCardView';

export class CatalogView extends EventEmitter {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    super();
    this.container = container;
  }

  set items(views: Array<any>) {
  const elements = views.map(v => {
    if (v && typeof v.getElement === 'function') {
      return v.getElement();
    }
    return v as HTMLElement;
  });
  this.container.replaceChildren(...elements);
}

}