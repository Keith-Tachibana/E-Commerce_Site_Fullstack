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
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h5 onClick={(name, params) => setView('catalog', {})} className="back-button mt-4 ml-4"><i className="fas fa-chevron-left"></i> Back to catalog</h5>
              <h2 className="ml-4 mt-4 mb-4">My Cart</h2>
            </div>
          </div>
          <div className="row">
            {cartItems.length === 0 ? <div>No items in cart</div> : <div>{cartItems}</div>}
          </div>
        </main>
        <footer>
          <h2 className="ml-4">Item Total: ${(total / 100).toFixed(2)}</h2>
        </footer>
      </React.Fragment>
    );
  }
}

export default CartSummary;
