import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ProductListItem extends Component {
  render() {
    const { products, setView } = this.props;
    const productItems = products.map(product => {
      return (
        <div
          key={product.productId}
          onClick={(name, params) => setView('details', { productId: product.productId })}
          className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 my-4 product-item ">
          <Link to={`/${product.productId}`} className="text-body" >
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={product.image} alt={product.name} height="50" width="100" />
              <div className="card-body">
                <h3 className="card-title">{product.name}</h3>
                <h6 className="card-text text-secondary">${(product.price / 100).toFixed(2)}</h6>
                <p className="card-text">{product.shortDescription}</p>
              </div>
            </div>
          </Link>
        </div>
      );
    });
    return (
      <React.Fragment>
        <main className="container">
          <div className="row product-items">
            {productItems}
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default ProductListItem;
