import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CartSummaryItem from './cart-summary-item';

class CartSummary extends Component {
  render() {
    const { cart, deleteItem } = this.props;
    const total = cart.length === 0 ? 0 : cart.reduce((accumulator, current) => accumulator + current.price, 0);
    const cartItems = cart.map(cartItem => {
      return (
        <CartSummaryItem
          key={cartItem.cartItemId}
          deleteItem={deleteItem}
          item={cartItem}/>
      );
    });
    return (
      <React.Fragment>
        <main className="cart-main container">
          <Link to="/" className="text-muted">
            <h5
              className="back-button mt-4 ml-4">
              <i className="fas fa-chevron-left mr-2"></i>
              Back to catalog
            </h5>
          </Link>
          <div className="row cart-row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h2 className="ml-4 mt-4 mb-4">My Cart</h2>
              <div className="cart-container">
                {cartItems.length === 0 ? <div className="ml-4 mb-4"><em>No items in cart</em></div> : <div>{cartItems}</div>}
                <div className="cart-footer justify-content-between my-4">
                  <h2 className="ml-4">Item Total: ${(total / 100).toFixed(2)}</h2>
                  <button
                    className="btn btn-primary">
                    <Link to="/checkout" className="text-white">Checkout</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default CartSummary;
