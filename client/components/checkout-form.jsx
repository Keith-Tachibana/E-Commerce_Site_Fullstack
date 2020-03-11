import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      creditCard: '',
      shippingAddress: '',
      creditCardIsNumber: false,
      nameIsLetters: false,
      addressMultiLine: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const digitRegExp = new RegExp('^[0-9]*$', 'g');
    const lettersRegExp = new RegExp('^[A-Za-z]+\\s[A-Za-z]+$', 'g');
    const multiLineRegExp = new RegExp('\\n', 'gm');
    this.setState({
      [name]: value,
      creditCardIsNumber: digitRegExp.test(this.state.creditCard),
      nameIsLetters: lettersRegExp.test(this.state.name),
      addressMultiLine: multiLineRegExp.test(this.state.shippingAddress)
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { placeOrder } = this.props;
    const order = {};
    order.name = this.state.name;
    order.creditCard = this.state.creditCard;
    order.shippingAddress = this.state.shippingAddress;
    placeOrder(order);
  }

  minLengthCC() {
    return (this.state.creditCard.length >= 0 && this.state.creditCard.length < 15)
      ? 'Your credit card number needs to be 16 digits long.'
      : '';
  }

  noDigitCC() {
    return this.state.creditCardIsNumber === false
      ? 'Your credit card must be all numbers.'
      : '';
  }

  noLettersName() {
    return this.state.nameIsLetters === false
      ? 'Your full name must be all upper/lower case letters with a space in between.'
      : '';
  }

  multiLineAddress() {
    return this.state.addressMultiLine === false
      ? 'Your street number and name must be on one line, and your city, state, and zip code on another.'
      : '';
  }

  renderIconCC() {
    return (this.state.creditCard.length === 16 && this.state.creditCardIsNumber)
      ? 'fas fa-check fa-lg valid'
      : '';
  }

  renderIconName() {
    return (this.state.name && this.state.nameIsLetters === true)
      ? 'fas fa-check fa-lg valid'
      : '';
  }

  renderIconAddress() {
    return (this.state.shippingAddress && this.state.addressMultiLine === true)
      ? 'fas fa-check fa-lg valid'
      : '';
  }

  render() {
    const { cart } = this.props;
    const total = cart.reduce((accumulator, current) => accumulator + current.price, 0);
    return (
      <React.Fragment>
        <main className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="my-4 ml-4">My Cart</h1>
              <h4 className="my-4 ml-4 text-secondary">Order Total: ${(total / 100).toFixed(2)}</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <form>
                <div className="form-group">
                  <label className="ml-4" htmlFor="name"><strong>Name</strong></label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <i className="input-group-text fas fa-user pt-2 ml-4"></i>
                    </div>
                    <input
                      autoFocus
                      type="text"
                      name="name"
                      id="name"
                      className="form-control mr-4"
                      placeholder="Enter your full name"
                      value={this.state.name}
                      required="required"
                      onChange={this.handleChange}
                    />
                    <span className="mt-2"><i className={this.renderIconName()}></i></span>
                  </div>
                  <div className="ml-4 alerts"><small>{this.noLettersName()}</small></div>
                </div>
                <div className="form-group">
                  <label className="ml-4" htmlFor="creditCard"><strong>Credit Card</strong></label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <i className="input-group-text far fa-credit-card pt-2 ml-4"></i>
                    </div>
                    <input
                      type="tel"
                      name="creditCard"
                      id="creditCard"
                      className="form-control mr-4"
                      placeholder="Enter your credit card number without dashes"
                      value={this.state.creditCard}
                      required="required"
                      maxLength="16"
                      pattern="[0-9]{16}"
                      onChange={this.handleChange}
                    />
                    <span className="mt-2"><i className={this.renderIconCC()}></i></span>
                  </div>
                  <div className="ml-4 alerts"><small>{this.minLengthCC()}</small></div>
                  <div className="ml-4 alerts"><small>{this.noDigitCC()}</small></div>
                </div>
                <div className="form-group">
                  <label className="ml-4" htmlFor="shippingAddress"><strong>Shipping Address</strong></label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <i className="input-group-text fas fa-shipping-fast pt-2 ml-4"></i>
                    </div>
                    <textarea
                      type="text"
                      name="shippingAddress"
                      id="shippingAddress"
                      className="form-control mr-4"
                      placeholder="Enter your shipping address"
                      value={this.state.shippingAddress}
                      required="required"
                      rows="5"
                      onChange={this.handleChange}
                    >
                    </textarea>
                    <span className="mt-2"><i className={this.renderIconAddress()}></i></span>
                  </div>
                  <div className="ml-4 alerts"><small>{this.multiLineAddress()}</small></div>
                </div>
              </form>
            </div>
          </div>
        </main>
        <footer className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="form-footer justify-content-between mt-4">
                <Link to="/" className="text-muted">
                  <h5
                    className="back-button ml-4">
                    <i className="fas fa-chevron-left mr-2"></i>
                    Continue shopping
                  </h5>
                </Link>
                <button
                  name="place-order"
                  type="submit"
                  onClick={this.handleSubmit}
                  className="btn btn-primary">
                    Place Order
                </button>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default CheckoutForm;
