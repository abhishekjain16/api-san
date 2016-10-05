import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from '../config/routes';

class ApiRadar {
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
  ApiRadar.loadReactComponents();
});
/*eslint-enable */
