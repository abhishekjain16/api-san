import React from 'react';
import ApiRequestForm from '../components/api_request_form/index';
import EditApiRequest from '../components/api_request_form/edit';
import ApiResponse from '../components/api_response/index';
import App from '../components/app'
import { Route, IndexRoute } from 'react-router';

export default (
  <Route path="/" component={App}>
    <Route path="/api_responses/:token" component={ApiResponse} />
    <Route path="/api_responses/:token/edit" component={EditApiRequest} />
    <IndexRoute component={ApiRequestForm} />
  </Route>
);