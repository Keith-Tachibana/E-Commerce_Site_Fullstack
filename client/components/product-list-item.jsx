import React, { Component } from 'react';

class ProductListItem extends Component {
  render() {
    const { products } = this.props;
    const productItems = products.map(product => {
      return (
        <div key={product.productId} className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 mt-4 mb-4">
          <div className="card h-100">
            <img className="card-img-top img-fluid" src={product.image} alt={product.name} />
            <div className="card-body">
              <h3 className="card-title">{product.name}</h3>
              <h6 className="card-text text-secondary">${(product.price / 100).toFixed(2)}</h6>
              <p className="card-text">{product.shortDescription}</p>
            </div>
          </div>
        </div>
      );
    });
    return (
      <React.Fragment>
        <main className="container">
          <div className="row">
            {productItems}
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default ProductListItem;
