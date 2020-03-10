import React, { Component } from 'react';

import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';

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
        const updatedCart = previous.cart;
        updatedCart.push(json);
        return {
          cart: updatedCart
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { view } = this.state;
    switch (view.name) {
      case 'details':
        return (
          <React.Fragment>
            <Header cartItemCount={this.state.cart.length} />
            <ProductDetails params={this.state.view.params} setView={this.setView} addToCart={this.addToCart} />
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Header cartItemCount={this.state.cart.length} />
            <ProductList setView={this.setView} />
          </React.Fragment>
        );
    }
  }
}

export default App;
