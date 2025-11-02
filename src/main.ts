// main.ts
import './scss/styles.scss';
import { Api } from './components/base/Api';
import { CommunicationLayer } from './components/Communication/CommunicationLayer';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { API_URL } from './utils/constants';
import { CatalogView } from './components/Views/CatalogView';
import { ModalView } from './components/Views/ModalView';
import { BasketView } from './components/Views/BasketView';
import { OrderFormView } from './components/Views/OrderFormView';
import { ContactsFormView } from './components/Views/ContactsFormView';
import { SuccessView } from './components/Views/SuccessView';
import { HeaderView } from './components/Views/HeaderView';
import { PreviewCardView } from './components/Views/PreviewCardView';
import { IProduct } from './types/index';

document.addEventListener('DOMContentLoaded', () => {
  const catalog = new ProductCatalog();
  const basket = new Basket();
  const buyer = new Buyer();

  const galleryEl = document.querySelector('.gallery') as HTMLElement;
  const modal = new ModalView();
  const catalogView = new CatalogView(galleryEl);
  const basketView = new BasketView();
  const headerView = new HeaderView();
  const previewView = new PreviewCardView();
  const orderFormView = new OrderFormView();
  const contactsFormView = new ContactsFormView();
  const successView = new SuccessView();


  let communicationLayer: CommunicationLayer | null = null;

  catalog.on('catalog:changed', ({ items }) => {
    catalogView.render(items);
  });

  basket.on('basket:changed', ({ items }) => {
    headerView.updateCounter(items.length);
    if (modal.modalRoot.classList.contains('modal_active') && modal.modalContent && modal.modalContent.id !== 'success') {
      const total = basket.getTotalPrice();
      const basketContent = basketView.render(items, total);
      modal.openContent(basketContent);
    }
  });

  buyer.on('buyer:changed', (data) => {
  });

  catalogView.on('catalog:card-click', ({ product }) => {
    const previewContent = previewView.render(product)
    modal.openContent(previewContent);
  });

  previewView.on('preview:add-to-basket', ({ product }) => {
    basket.addItem(product);
    modal.close();
  });

  basketView.on('basket:remove-item', ({ product }) => {
    basket.removeItem(product);
  });

  basketView.on('basket:order-click', () => {
    const orderContent = orderFormView.render();
    modal.openContent(orderContent);
  });

  headerView.on('header:basket-click', () => {
    const items = basket.getItems();
    const total = basket.getTotalPrice();
    const basketContent = basketView.render(items, total);
    modal.openContent(basketContent);
  });

  orderFormView.on('order:submit', (data) => {
    console.log('Submit формы заказа:', data);
    const errors = orderFormView.validate(data);
    if (Object.keys(errors).length) {
      orderFormView.setErrors(errors);
    } else {
      buyer.setAddress(data.address);
      buyer.setPayment(data.payment);
      console.log('Переход к форме контактов');
      const contactsContent = contactsFormView.render();
      modal.openContent(contactsContent);
    }
  });

  contactsFormView.on('contacts:submit', async (data) => {
    console.log('Submit формы контактов:', data);
    const errors = contactsFormView.validate(data);
    if (Object.keys(errors).length) {
      contactsFormView.setErrors(errors);
    } else {
      buyer.setEmail(data.email);
      buyer.setPhone(data.phone);
      const orderData = {
        payment: buyer.getData().payment,
        email: data.email,
        phone: data.phone,
        address: buyer.getData().address,
        total: basket.getTotalPrice(),
        items: basket.getItems().map(i => i.id)
      };
      try {
        if (communicationLayer) {
          await communicationLayer.sendOrder(orderData);
        } else {
          console.warn('CommunicationLayer не инициализирован');
        }
      } catch (err) {
        console.error('Ошибка отправки заказа:', err);
        return;
      }
      const successContent = successView.render(orderData.total);
      modal.openContent(successContent);
      basket.clear();
      buyer.clear();
    }
  });

  successView.on('success:close', () => {
    modal.close();
  });

  (async () => {
    try {
      const api = new Api(API_URL);
      communicationLayer = new CommunicationLayer(api);
      const products = await communicationLayer.fetchProducts();
      catalog.setItems(products);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  })();
});
