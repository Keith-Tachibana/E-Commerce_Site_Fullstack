import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
  }

  componentDidMount() {
    const { params } = this.props;
    this.getSpecificProduct(params.productId);
  }

  async getSpecificProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`);
      const product = await response.json();
      this.setState({
        product
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  render() {
    const { product } = this.state;
    const { addToCart, params } = this.props;
    if (!product) {
      return <div className="ml-4">Loading...</div>;
    } else {
      return (
        <React.Fragment>
          <section className="product-detail">
            <Link to="/" className="text-muted">
              <h5
                className="back-button mt-4 ml-4">
                <i className="fas fa-chevron-left mr-2"></i>
                Back to catalog
              </h5>
            </Link>
            <div className="row details-top">
              <div className="mt-4 img-container">
                <img src={product.image} alt={product.name} className="img-detail img-fluid" />
              </div>
              <div className="product-info">
                <h1 className="ml-4">{product.name}</h1>
                <h3 className="text-secondary ml-4">${(product.price / 100).toFixed(2)}</h3>
                <h6 className="mr-4 ml-4">{product.shortDescription}</h6>
                <button
                  className="btn btn-primary ml-4"
                  onClick={product => addToCart({ productId: params.productId })}>
                    Add To Cart
                </button>
              </div>
            </div>
            <div className="row">
              <div>
                <p className="product-desc">{product.longDescription}</p>
              </div>
            </div>
          </section>
        </React.Fragment>
      );
    }
  }
}

export default ProductDetails;
