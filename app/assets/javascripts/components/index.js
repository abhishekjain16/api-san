import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from '../config/routes';

class ApiRadar {
  static loadReactComponents() {
    ReactDOM.render((
      <Router history={browserHistory}>
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
