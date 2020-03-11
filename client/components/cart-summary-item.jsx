import React, { Component } from 'react';

class CartSummaryItem extends Component {
  render() {
    const { item, deleteItem } = this.props;
    return (
      <React.Fragment>
        <div className="item-container mb-4 ml-4 mr-4">
          <div className="row">
            <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 img-container">
              <img src={item.image} alt={item.name} className="item-img ml-4" />
            </div>
            <div className="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 item">
              <h3>{item.name}</h3>
              <h5 className="text-secondary">${(item.price / 100).toFixed(2)}</h5>
              <p>{item.shortDescription}</p>
              <button
                className="btn btn-danger"
                onClick={() => deleteItem(item.cartItemId)}>
                  Remove From Cart
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CartSummaryItem;
