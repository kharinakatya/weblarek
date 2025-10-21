import './scss/styles.scss'; 
import { CDN_URL } from './utils/constants';
import { apiProducts } from './utils/data'; 
import { Basket } from './components/Models/Basket'; 
import { Api } from './components/base/Api'; 
import { ProductCatalog } from './components/Models/ProductCatalog'; 
import { ProductCatalogView } from './components/Models/ProductCatalogView'; 
import { API_URL } from './utils/constants'; 
import { IProduct } from './types/index'; 

document.addEventListener('DOMContentLoaded', () => { 

  const catalog = new ProductCatalog(); 
  const basket = new Basket(); 

  function showNotification(message: string) {
    alert(message);
  }

  function updateCartCount(basket: Basket) {
    const cartCountElement = document.querySelector('.header__basket-counter') as HTMLElement | null;
    if (cartCountElement) {
      cartCountElement.textContent = basket.getCount().toString();
    }
  }

  function loadBasketFromStorage(basket: Basket) {
    const stored = localStorage.getItem('basket');
    if (stored) {
      const items = JSON.parse(stored) as IProduct[];
      items.forEach(item => basket.addItem(item));
    }
  }

  function saveBasketToStorage(basket: Basket) {
    localStorage.setItem('basket', JSON.stringify(basket.getItems()));
  }

  loadBasketFromStorage(basket);
  updateCartCount(basket);

  const catalogContainer = document.querySelector('.gallery') as HTMLElement;
  if (!catalogContainer) throw new Error('Container for catalog not found');
  const catalogView = new ProductCatalogView(catalogContainer);

  const modalContainer = document.querySelector('#modal-container') as HTMLElement;
  if (!modalContainer) throw new Error('Modal container not found');
  const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;
  if (!modalContent) throw new Error('Modal content not found in HTML');

  function openModal(product: IProduct) {
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    if (!template) throw new Error('Template #card-preview not found');

    const modalElement = template.content.cloneNode(true) as DocumentFragment;
    const cardElement = modalElement.querySelector('.card') as HTMLElement;
    if (!cardElement) throw new Error('Card element not found in template');

    const titleElement = cardElement.querySelector('.card__title') as HTMLElement;
    const imageElement = cardElement.querySelector('.card__image') as HTMLImageElement;
    const descriptionElement = cardElement.querySelector('.card__text') as HTMLElement;
    const priceElement = cardElement.querySelector('.card__price') as HTMLElement;
    const categoryElement = cardElement.querySelector('.card__category') as HTMLElement;
    const addButton = cardElement.querySelector('.card__button') as HTMLButtonElement;

    if (titleElement) titleElement.textContent = product.title;
    if (imageElement) {
      imageElement.src = `${CDN_URL}${product.image}`;
      imageElement.alt = product.title;

      imageElement.onerror = () => {
        imageElement.src = require('../images/Subtract.svg');
      };
      console.log('Product image src set to:', product.image);
    }
    if (descriptionElement) descriptionElement.textContent = product.description;
    if (priceElement) {
      priceElement.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесплатно';
    }
    if (categoryElement) categoryElement.textContent = product.category;

    modalContent.innerHTML = '';
    modalContent.appendChild(cardElement);

    if (addButton) {
      addButton.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('modal:add-to-basket', { detail: { product } }));
      });
    }

    modalContainer.classList.add('modal_active');
  }

  function closeModal() {
    modalContent.innerHTML = '';
    modalContainer.classList.remove('modal_active');
  }

function openBasketModal() {
  const template = document.querySelector('#basket') as HTMLTemplateElement;
  if (!template) throw new Error('Template #basket not found');

  const modalElement = template.content.cloneNode(true) as DocumentFragment;
  const basketElement = modalElement.querySelector('.basket') as HTMLElement;
  if (!basketElement) throw new Error('Basket element not found in template');

  const itemsList = basketElement.querySelector('.basket__list') as HTMLUListElement;
  if (!itemsList) throw new Error('Basket list not found in template');

  const priceElement = basketElement.querySelector('.basket__price') as HTMLElement;
  if (!priceElement) throw new Error('Basket price element not found in template');

  const orderButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;
  if (!orderButton) throw new Error('Order button not found in template');

  const items = basket.getItems();
  if (items.length === 0) {
    itemsList.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
    if (priceElement) priceElement.textContent = '0 синапсов';
    if (orderButton) {
      orderButton.disabled = true;
    }
  } else {
    itemsList.innerHTML = '';
    items.forEach((item, index) => {
      const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
      if (cardTemplate) {
        const cardElement = cardTemplate.content.cloneNode(true) as DocumentFragment;
        const liElement = cardElement.querySelector('.basket__item') as HTMLElement;
        if (liElement) {
          const indexElement = liElement.querySelector('.basket__item-index') as HTMLElement;
          const titleElement = liElement.querySelector('.card__title') as HTMLElement;
          const priceElementItem = liElement.querySelector('.card__price') as HTMLElement;
          const deleteButton = liElement.querySelector('.basket__item-delete') as HTMLButtonElement;

          if (indexElement) indexElement.textContent = (index + 1).toString();
          if (titleElement) titleElement.textContent = item.title;
          if (priceElementItem) priceElementItem.textContent = item.price !== null ? `${item.price} синапсов` : 'Бесплатно';
          if (deleteButton) deleteButton.dataset.id = item.id;

          itemsList.appendChild(liElement);
        }
      }
    });

    const total = items
      .filter(item => item.price !== null)
      .reduce((sum, item) => sum + (item.price || 0), 0);
    if (priceElement) priceElement.textContent = `${total} синапсов`;
    if (orderButton) {
      orderButton.disabled = false;
    }
  }


  itemsList.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('basket__item-delete')) {
      const id = target.dataset.id!;
      const itemToRemove = basket.getItems().find(item => item.id === id);
      if (itemToRemove) {
        basket.removeItem(itemToRemove);
        updateCartCount(basket);
        saveBasketToStorage(basket);
        openBasketModal();
      }
    }
  });

  modalContent.innerHTML = '';
  modalContent.appendChild(basketElement);
  modalContainer.classList.add('modal_active');
}

  modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  });

  const closeButton = modalContainer.querySelector('.modal__close') as HTMLButtonElement;
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  const openCartBtn = document.querySelector('.header__basket') as HTMLButtonElement;
  if (openCartBtn) {
    openCartBtn.addEventListener('click', openBasketModal);
  }

  catalogView.on('catalog:card-click', (event: { product: IProduct }) => {
    console.log('Карточка товара кликнута:', event.product);
    openModal(event.product);
  });

  window.addEventListener('modal:add-to-basket', (event: CustomEvent) => {
    const { product } = event.detail;
    if (!basket.hasItem(product.id)) {
      basket.addItem(product);
      updateCartCount(basket);
      saveBasketToStorage(basket);
      closeModal();
    } else {

    }
    console.log('Товар добавлен в корзину:', product);
  });

  console.log('=== Тестирование ProductCatalog ===');
  
  const testProducts: IProduct[] = [
    { id: '1', title: 'Test Product 1', description: 'Desc 1', image: 'img1.jpg', category: 'Category 1', price: 100 },
    { id: '2', title: 'Test Product 2', description: 'Desc 2', image: 'img2.jpg', category: 'Category 2', price: 200 },
  ];
  catalog.setItems(testProducts);
  console.log('getItems():', catalog.getItems());
  
  console.log('getItem("1"):', catalog.getItem('1'));
  console.log('getItem("999"):', catalog.getItem('999'));
  
  catalog.setSelectedProduct(testProducts[0]);
  console.log('getSelectedProduct():', catalog.getSelectedProduct());
  
  console.log('=== Тестирование Basket ===');
  
  basket.addItem(testProducts[0]);
  basket.addItem(testProducts[1]);
  console.log('getItems() after add:', basket.getItems());
  
  console.log('getTotal():', basket.getTotal());
  console.log('getCount():', basket.getCount());
  console.log('hasItem("1"):', basket.hasItem('1'));
  console.log('hasItem("999"):', basket.hasItem('999'));

  basket.removeItem(testProducts[0]);
  console.log('getItems() after remove:', basket.getItems());
  console.log('getTotal() after remove:', basket.getTotal());
  console.log('getCount() after remove:', basket.getCount());

  basket.clear();
  console.log('getItems() after clear:', basket.getItems());
  console.log('getCount() after clear:', basket.getCount());
  
  console.log('=== Загрузка товаров с сервера ===');
  (async () => { 
    try { 
      console.log('Создание Api...');
      const api = new Api(API_URL); 
      console.log('Запрос товаров...');
      const products = await api.get('/product') as IProduct[]; 
      console.log('Товары получены:', products);
      catalog.setItems(products); 
      console.log('Products loaded from server:', catalog.getItems()); 
      catalogView.render(catalog.getItems());
      console.log('Товары отрендерены на UI');
    } catch (error) { 
      console.error('Ошибка при работе с сервером:', error); 
      console.log('Загрузка fallback товаров...');
      catalog.setItems(apiProducts.items); 
      console.log('Fallback products loaded:', catalog.getItems()); 
      catalogView.render(catalog.getItems());
      console.log('Fallback товары отрендерены на UI');
    } 
  })(); 

}); 