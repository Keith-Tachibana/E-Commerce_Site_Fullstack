import React, { Component } from 'react';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
    this.handleBackToCatalog = this.handleBackToCatalog.bind(this);
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

  handleBackToCatalog() {
    const { setView } = this.props;
    setView('catalog', {});
  }

  render() {
    const { product } = this.state;
    const { addToCart } = this.props;
    if (!product) {
      return <div className="ml-4">Loading...</div>;
    } else {
      return (
        <React.Fragment>
          <section className="product-detail">
            <h5 onClick={this.handleBackToCatalog} className="back-button mt-4 ml-4"><i className="fas fa-chevron-left"></i> Back to catalog</h5>
            <div className="row">
              <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 mt-4">
                <img src={product.image} alt={product.name} className="img-detail img-fluid" />
              </div>
              <div className="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
                <h1>{product.name}</h1>
                <h3 className="text-secondary">${(product.price / 100).toFixed(2)}</h3>
                <h6>{product.shortDescription}</h6>
                <button className="btn btn-primary" onClick={product => addToCart(product)}>Add To Cart</button>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
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
