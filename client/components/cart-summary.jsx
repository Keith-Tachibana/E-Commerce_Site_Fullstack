import React, { Component } from 'react';

import CartSummaryItem from './cart-summary-item';

class CartSummary extends Component {
  render() {
    const { cart, setView } = this.props;
    const total = cart.length === 0 ? 0 : cart.reduce((accumulator, current) => accumulator + current.price, 0);
    const cartItems = cart.map(cartItem => {
      return (
        <CartSummaryItem key={cartItem.cartItemId} item={cartItem}/>
      );
    });
    return (
      <React.Fragment>
        <main>
          <h5
            onClick={(name, params) => setView('catalog', {})}
            className="back-button mt-4 ml-4 text-secondary">
            <i className="fas fa-chevron-left mr-2"></i>
              Back to catalog
          </h5>
          <div className="row justify-content-center">
            <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <h2 className="ml-4 mt-4 mb-4">My Cart</h2>
              <div className="cart-container">
                {cartItems.length === 0 ? <div>No items in cart</div> : <div>{cartItems}</div>}
              </div>
              <h2 className="ml-4">Item Total: ${(total / 100).toFixed(2)}</h2>
              <button
                className="float-right mb-4 btn btn-primary"
                onClick={(name, params) => setView('checkout', {})}>
                  Checkout
              </button>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default CartSummary;
