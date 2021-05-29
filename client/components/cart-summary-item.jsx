import React, { Component } from 'react';

class CartSummaryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldCancel: false,
      quantity: this.props.quantity
    };
    this.decrease = this.decrease.bind(this);
    this.increase = this.increase.bind(this);
  }

  decrease() {
    this.setState(prevState => {
      return {
        quantity: prevState.quantity - 1
      };
    });
  }

  increase() {
    this.setState(prevState => {
      return {
        quantity: prevState.quantity + 1
      };
    });
  }

  render() {
    const { item, deleteItem, quantity } = this.props;
    // eslint-disable-next-line no-console
    console.log('Quantity:', quantity);
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
              <button
                className="btn btn-sm btn-warning"
                onClick={() => this.decrease()}>-
              </button>

              <button
                className="btn btn-sm btn-info"
                onClick={() => this.increase()}>+
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CartSummaryItem;
