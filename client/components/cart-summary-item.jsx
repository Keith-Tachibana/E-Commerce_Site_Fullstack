import React, { Component } from 'react';

class CartSummaryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldCancel: false,
      quantity: 1
    };
  }
  
  decrease() {
    this.setState({
      quantity: --this.state.quantity
    });
  }
  
  increase() {
    this.setState({
      quantity: ++this.state.quantity
    });
  }

  render() {
    const { item, deleteItem } = this.props;
    return (
      <React.Fragment>
        <div className="item-container mb-4 ml-4 mr-4">
          <div className="row item-summary">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-5 img-container">
              <img src={item.image} alt={item.name} className="item-img ml-4" />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-7 item">
              <h3>{item.name}</h3>
              <h5 className="text-secondary">${(item.price / 100).toFixed(2)}</h5>
              <p>{item.shortDescription}</p>
              <button
                className="btn btn-danger"
                onClick={() => deleteItem(item.cartItemId)}>
                  Remove From Cart
              </button>
              <div onClick={this.decrease()}>-</div>Qty:{this.state.quantity}<div onClick={this.increase()}>+</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CartSummaryItem;
