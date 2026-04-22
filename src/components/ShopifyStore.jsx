import React from 'react';
import './ShopifyStore.css';

export default function ShopifyStore() {
  const storeDomain = "v0rdvd-00.myshopify.com";
  const accessToken = "dc2d71427445c866ed9443ef27a2bb33";

  return (
    <div className="shopify-page">
      <shopify-store 
        store-domain={storeDomain} 
        access-token={accessToken}
        country="CO" 
        language="es"
      >
        
        <header className="store-header">
          <div className="store-header-content">
            <h1>ROSÉ Shop</h1>
            <button className="cart-toggle-btn" onClick={() => document.getElementById('main-cart')?.showModal()}>
              Ver Carrito
            </button>
          </div>
        </header>

        <section className="store-products-section">
          <h2>Catálogo de Productos</h2>
          <shopify-list-context type="product" query="products" first="20">
            <div className="products-grid">
              <template>
                <div className="product-layout">
                  <div className="product-card">
                    <div className="product-card__container">
                      <div className="product-card__media">
                        <div className="product-card__main-image">
                          <shopify-media width="280" height="280" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
                        </div>
                      </div>
                      <div className="product-card__details">
                        <div className="product-card__info">
                          <h2 className="product-card__title">
                            <shopify-data query="product.title"></shopify-data>
                          </h2>
                          <div className="product-card__price">
                            <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money>
                          </div>
                        </div>

                        <button
                          className="product-card__view-button"
                          onClick={(e) => {
                            const modal = document.getElementById('product-modal');
                            const context = document.getElementById('product-modal-context');
                            if(modal && context) {
                              context.update(e);
                              modal.showModal();
                            }
                          }}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div shopify-loading-placeholder="true" className="store-loading">Cargando catálogo...</div>
          </shopify-list-context>
        </section>

        <shopify-cart id="main-cart"></shopify-cart>

        <dialog id="product-modal" className="product-modal">
          <shopify-context id="product-modal-context" type="product" wait-for-update="true">
            <template>
              <div className="product-modal__container">
                <div className="product-modal__close-container">
                  <button className="product-modal__close" onClick={() => document.getElementById('product-modal')?.close()}>&#10005;</button>
                </div>
                <div className="product-modal__content">
                  <div className="product-modal__layout">
                    <div className="product-modal__media">
                      <shopify-media width="416" height="416" query="product.selectedOrFirstAvailableVariant.image"></shopify-media>
                    </div>
                    <div className="product-modal__details">
                      <div className="product-modal__header">
                        <div>
                          <span className="product-modal__vendor">
                            <shopify-data query="product.vendor"></shopify-data>
                          </span>
                        </div>
                        <h1 className="product-modal__title">
                          <shopify-data query="product.title"></shopify-data>
                        </h1>
                        <div className="product-modal__price-container">
                          <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money>
                        </div>
                      </div>
                      
                      <shopify-variant-selector></shopify-variant-selector>

                      <div className="product-modal__buttons">
                        <button
                          className="product-modal__add-button"
                          onClick={(e) => document.getElementById('main-cart')?.addLine(e).showModal()}
                          shopify-attr--disabled="!product.selectedOrFirstAvailableVariant.availableForSale"
                        >
                          Agregar al carrito
                        </button>
                        <button
                          className="product-modal__buy-button"
                          onClick={(e) => document.querySelector('shopify-store')?.buyNow(e)}
                          shopify-attr--disabled="!product.selectedOrFirstAvailableVariant.availableForSale"
                        >
                          Comprar ahora
                        </button>
                      </div>
                      <div className="product-modal__description">
                        <span className="product-modal__description-text">
                          <shopify-data query="product.descriptionHtml"></shopify-data>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div shopify-loading-placeholder="true" className="store-loading">Cargando producto...</div>
          </shopify-context>
        </dialog>

      </shopify-store>
    </div>
  );
}
