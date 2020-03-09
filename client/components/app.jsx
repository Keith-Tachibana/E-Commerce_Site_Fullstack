import React, { Component } from 'react';

import Header from './header';
import ProductList from './product-list';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <ProductList />
      </React.Fragment>
    );
  }
}

export default App;
