import React from 'react';
import ApiRequestForm from '../components/api_request_form/index';
import ApiResponse from '../components/api_response/index';
import { Route, IndexRoute } from 'react-router';

export default (
  <Route path="/" component={ApiRequestForm}>
    <Route path="/api_responses/:token" component={ApiResponse} />
  </Route>
);
