import React, { Component } from 'react';

import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
    this.getCartItems();
  }

  setView(name, params) {
    this.setState({
      view: {
        name,
        params
      }
    });
  }

  async getCartItems() {
    try {
      const response = await fetch('/api/cart');
      const cart = await response.json();
      this.setState({
        cart
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async addToCart(product) {
    try {
      const productAdded = {
        productId: product.productId
      };
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const response = await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify(productAdded),
        headers
      });
      const json = await response.json();
      this.setState(previous => {
        const updatedCart = [...previous.cart];
        updatedCart.push(json);
        return {
          cart: updatedCart
        };
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async placeOrder(order) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order),
        headers
      });
      this.setState({
        cart: []
      }, (name, params) => this.setView('catalog', {}));
    } catch (error) {
      console.error(error.message);
    }
  }

  render() {
    const { view } = this.state;
    let renderView;
    switch (view.name) {
      case 'details':
        renderView = (
          <React.Fragment>
            <ProductDetails
              params={this.state.view.params}
              setView={this.setView}
              addToCart={this.addToCart} />
          </React.Fragment>
        );
        break;
      case 'cart':
        renderView = (
          <React.Fragment>
            <CartSummary
              cart={this.state.cart}
              setView={this.setView} />
          </React.Fragment>
        );
        break;
      case 'checkout':
        renderView = (
          <React.Fragment>
            <CheckoutForm
              cart={this.state.cart}
              setView={this.setView}
              placeOrder={this.placeOrder}/>
          </React.Fragment>
        );
        break;
      default:
        renderView = (
          <React.Fragment>
            <ProductList
              setView={this.setView} />
          </React.Fragment>
        );
        break;
    }
    return (
      <React.Fragment>
        <Header
          cartItemCount={this.state.cart.length}
          setView={this.setView} />
        {renderView}
      </React.Fragment>
    );
  }
}

export default App;
