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
import { CatalogCardView } from './components/Views/CatalogCardView';
import { BasketCardView } from './components/Views/BasketCardView';

document.addEventListener('DOMContentLoaded', () => {
  const catalog = new ProductCatalog();
  const basket = new Basket();
  const buyer = new Buyer();

  const galleryEl = document.querySelector('.gallery') as HTMLElement;
  const modal = new ModalView();
  const catalogView = new CatalogView(galleryEl);
  const basketView = new BasketView();
  const headerView = new HeaderView();
  const orderFormView = new OrderFormView();
  const contactsFormView = new ContactsFormView();
  const successView = new SuccessView();
  const previewView = new PreviewCardView();

  const api = new Api(API_URL);
  const communicationLayer = new CommunicationLayer(api);

  let isBasketOpen = false;

  const handleRemoveFromBasket = ({ product }: { product: any }) => {
    console.log('Удаление товара:', product.id);
    basket.removeItem(product);
  };

  const updateBasketUI = (items) => {
    console.log('Корзина изменилась, товаров:', items.length);

    headerView.updateCounter(items.length);

    const cardEls = items.map((item, index) => {
      const card = new BasketCardView();
      const cardEl = card.render(item, index);

    if (card.on) card.on('basket:remove-item', handleRemoveFromBasket);

      return cardEl;
    });

    basketView.items = cardEls;
    basketView.total = basket.getTotalPrice();
    if (isBasketOpen) {
      modal.updateContent(basketView.render());
    }
  };

  basket.on('basket:changed', ({ items }) => {
    updateBasketUI(items);
  });

  updateBasketUI(basket.getItems());

  headerView.on('header:basket-click', () => {
    modal.open(basketView.render());
    isBasketOpen = true;
  });

  basketView.on('basket:order-click', () => {
    console.log('main: basket order clicked — открываем форму заказа');
    modal.open(orderFormView.render());
    isBasketOpen = true;
  });

const handleCardClick = ({ product }: { product: any }) => {
  catalog.selectPreview(product);
};


  catalog.on('catalog:changed', ({ items }) => {
    const cardViews = items.map(item => {
      const card = new CatalogCardView();
      card.render(item);
      card.on && card.on('catalog:card-click', handleCardClick);
      return card;
    });
    catalogView.items = cardViews;
  });

  catalog.on('catalog:preview', ({ product }) => {
    const isInBasket = basket.hasItem(product.id);
    modal.open(previewView.render(product, isInBasket));
  });

  previewView.on('preview:add-to-basket', ({ product }) => {
    basket.addItem(product);
    modal.close();
  });

  previewView.on('preview:remove-from-basket', ({ product }) => {
    console.log('Удаление из превью:', product.id);
    basket.removeItem(product);
    modal.close();
  });

  basketView.on('basket:remove-item', handleRemoveFromBasket);

  orderFormView.on('buyer:change', ({ key, value }) => {
    buyer.setData(key, value);
  });

  contactsFormView.on('buyer:change', ({ key, value }) => {
    buyer.setData(key, value);
  });

  buyer.on('order:validate', (errors: Record<string, string>) => {
    const orderErrors: Record<string, string> = {};
    if (errors.address) orderErrors.address = errors.address;
    if (errors.payment) orderErrors.payment = errors.payment;

    const contactsErrors: Record<string, string> = {};
    if (errors.email) contactsErrors.email = errors.email;
    if (errors.phone) contactsErrors.phone = errors.phone;

    orderFormView.setValidationErrors(orderErrors);
    contactsFormView.setValidationErrors(contactsErrors);

    const buyerData = buyer.getData();
    orderFormView.render({ address: buyerData.address, payment: buyerData.payment, errors: orderErrors });
    contactsFormView.render({ email: buyerData.email, phone: buyerData.phone, errors: contactsErrors });
  });

  orderFormView.on('order:submit', () => {
    modal.open(contactsFormView.render());
  });

  contactsFormView.on('contacts:submit', async () => {
    const allItems = basket.getItems();
    const sellableItems = allItems.filter(i => {
      const p = typeof i.price === 'number' ? i.price : Number(i.price);
      return isFinite(p) && p > 0;
    });

    const sellableIds = sellableItems.map(i => i.id);
    const total = basket.getTotalPrice();

    const buyerData = buyer.getData();
    const orderData = {
      payment: buyerData.payment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      total: total,
      items: sellableIds
    };

    try { 
      console.log('Отправка заказа...', orderData); 
      await communicationLayer.sendOrder(orderData); 
      console.log('Заказ отправлен успешно, открываем success модалку'); 
 
      const successElement = successView.render(orderData.total); 
      modal.open(successElement); 
      isBasketOpen = false; 
 
      basket.clear(); 
      buyer.clear(); 
    } catch (err) { 
      console.error('Ошибка отправки заказа:', err); 
    } 

  }); 


  successView.on('success:close', () => {
    modal.close();
    isBasketOpen = false;
  });

  (async () => {
    try {
      const products = await communicationLayer.fetchProducts();
      catalog.setItems(products);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  });
});