import React, { Component } from 'react';

import ProductListItem from './product-list-item';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.getProducts();
  }

  async getProducts() {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      this.setState({
        products
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  render() {
    return (
      <React.Fragment>
        <ProductListItem products={this.state.products} />
      </React.Fragment>
    );
  }
}

export default ProductList;
