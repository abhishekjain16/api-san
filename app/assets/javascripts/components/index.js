import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from '../config/routes';

class ApiSanity {
  static loadReactComponents() {
    ReactDOM.render((
      <Router history={hashHistory}>
        {routes}
      </Router>
    ), document.getElementById('react-container'));
  }
}

/*eslint-disable */
$(() => {
  ApiSanity.loadReactComponents();
});
/*eslint-enable */
