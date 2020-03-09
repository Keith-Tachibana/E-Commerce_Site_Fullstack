import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <React.Fragment>
        <header className="bg-dark mb-4">
          <h1 className="ml-4 text-white"><em>$</em>Wicked Sales</h1>
        </header>
      </React.Fragment>
    );
  }
}

export default Header;
