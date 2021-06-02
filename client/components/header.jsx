import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    const { cartItemCount } = this.props;
    const count = cartItemCount === undefined ? 0 : cartItemCount;
    return (
      <React.Fragment>
        <header className="bg-dark mb-4 d-flex justify-content-between">
          <Link to="/" className="nav-link"><h2 className="ml-4"><em className="text-white">&#129304; Metal Music Mart &#129304;</em></h2></Link>
          <Link to="/cart" className="text-white">
            <h3 className="shopping-cart">
              {count} {count === 1 ? 'item' : 'items'}
              <i className="fas fa-shopping-cart mr-4 mt-3 ml-2"></i>
            </h3>
          </Link>
        </header>
      </React.Fragment>
    );
  }
}

export default Header;
