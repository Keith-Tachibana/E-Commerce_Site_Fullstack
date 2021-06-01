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
          className="my-4 product-item ">
          <Link to={`/${product.productId}`} className="text-body" >
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={product.image} alt={product.name} height="50" width="100" />
              <div className="card-body">
                <h5 className="card-title"><em>{product.name}</em></h5>
                <h6 className="card-text text-secondary">${(product.price / 100).toFixed(2)}</h6>
              </div>
              <div className="card-footer">
                <p className="card-text">&quot;{product.shortDescription}&quot;</p>
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
