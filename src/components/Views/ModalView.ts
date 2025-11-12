export class ModalView {
  private modalRoot: HTMLElement;
  private content: HTMLElement;
  private closeBtn: HTMLElement | null;
  private currentContentId: string | null = null;
  private boundCloseByEsc: (e: KeyboardEvent) => void;

  constructor(modalSelector = '#modal-container') {
    this.modalRoot = document.querySelector(modalSelector) as HTMLElement;
    this.content = this.modalRoot.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = this.modalRoot.querySelector('.modal__close');
    this.boundCloseByEsc = this.closeByEsc.bind(this);

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    this.modalRoot.addEventListener('click', (e) => this.closeByOverlay(e));
  }

  open(content: HTMLElement): void {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this.currentContentId = content.dataset.id || null;
    this.modalRoot.classList.add('modal_active');
    document.addEventListener('keydown', this.boundCloseByEsc);
  }

  close(): void {
    this.modalRoot.classList.remove('modal_active');
    this.currentContentId = null;
    document.removeEventListener('keydown', this.boundCloseByEsc);
  }

  get isActive(): boolean {
    return this.modalRoot.classList.contains('modal_active');
  }

  updateContent(content: HTMLElement): void {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this.currentContentId = content.dataset.id || null;
  }

  getContentId(): string | null {
    return this.currentContentId;
  }

  private closeByEsc(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.close();
  }

  private closeByOverlay(e: MouseEvent): void {
    if (!this.content.contains(e.target as Node)) this.close();
  }
}