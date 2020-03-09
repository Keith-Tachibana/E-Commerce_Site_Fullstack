import React, { Component } from 'react';

import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      }
    };
    this.setView = this.setView.bind(this);
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  setView(name, params) {
    this.setState({
      view: {
        name,
        params
      }
    });
  }

  render() {
    const { view } = this.state;
    switch (view.name) {
      case 'details':
        return (
          <React.Fragment>
            <Header />
            <ProductDetails params={this.state.view.params} setView={this.setView} />
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Header />
            <ProductList setView={this.setView} />
          </React.Fragment>
        );
    }
  }
}

export default App;
