import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class SuccessView extends EventEmitter {
  private container: HTMLElement;
  private descEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor() {
    super();
    this.container = cloneTemplate<HTMLElement>('#success');
    this.descEl = this.container.querySelector('.order-success__description') as HTMLElement;
    this.closeBtn = this.container.querySelector('.order-success__close') as HTMLButtonElement;
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.emit('success:close'));
    }
  }

render(total: number): HTMLElement {
  if (this.descEl) this.descEl.textContent = `Списано ${total} синапсов`;
  this.container.dataset.id = 'success';
  return this.container;
  }
}