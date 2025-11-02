//SuccessView.ts
import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class SuccessView extends EventEmitter {
  render(total: number): HTMLElement {
    const node = cloneTemplate<HTMLElement>('#success');
    const descEl = node.querySelector('.order-success__description') as HTMLElement;
    if (descEl) descEl.textContent = `Списано ${total} синапсов`;
    const closeBtn = node.querySelector('.order-success__close') as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.emit('success:close'));
    }
    return node;
  }
}
