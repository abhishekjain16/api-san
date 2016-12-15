import React from 'react';
import uuid from 'uuid';
import update from 'react-addons-update';
import _ from 'underscore';
import { hashHistory } from 'react-router';
import Loader from 'react-loader';
import { SelectForMethods } from './inputs';
import { AddAssertionLink, Assertions } from './assertions';
import { AddAuthLink, Authentication } from './auth';
import { AddParamLink, Params } from './params';
import { AddHeaderLink, Headers } from './headers';
import { AddRequestBody, RequestBody } from './requestBody';

class ApiRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url || '',
      method: this.props.method || 'get',
      username: this.props.username || '',
      password: this.props.password || '',
      request_body: this.props.request_body || '',
      request_params: this.props.request_params || [],
      headers: this.props.request_headers || [],
      assertions: this.props.assertions || [],
      showRequestBody: false,
      showAuthentication: this.props.showAuthentication || false,
      errors: {},
      loaded: true,
    };
  }

  componentDidMount() {
    this.urlInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState(nextProps);
      this.setState({ showAuthentication: (!!nextProps.username || !!nextProps.password) });
      return true;
    }
  }

  addParam(event) {
    event.preventDefault();
    const showRequestBody = false;
    this.setState({ request_params: this.state.request_params.concat({ id: uuid.v1(), key: '', value: '' }), showRequestBody });
  }

  addBody(event) {
    event.preventDefault();
    const showRequestBody = true;
    this.setState({ request_params: [], showRequestBody });
  }

  addHeader(event) {
    event.preventDefault();
    const headers = this.state.headers.concat({ id: uuid.v1(), key: '', value: '' });
    this.setState({ headers });
  }

  addAssertion(event) {
    event.preventDefault();
    const assertions = this.state.assertions.concat({ id: uuid.v1(), kind: 'Response JSON', key: '', comparison: 'equals', value: '' });
    this.setState({ assertions });
  }

  removeRequestBody(event) {
    event.preventDefault();
    this.setState({ request_body: null, showRequestBody: false });
  }

  removeParam(event, paramId) {
    event.preventDefault();
    this.setState({ request_params: this.state.request_params.filter(element => element.id !== paramId) });
  }

  removeHeader(event, headerId) {
    event.preventDefault();
    const headers = this.state.headers.filter(element => element.id !== headerId);
    this.setState({ headers });
  }

  removeAssertion(event, assertionId) {
    event.preventDefault();
    const assertions = this.state.assertions.filter(element => element.id !== assertionId);
    this.setState({ assertions });
  }

  toggleAuth(event, showAuthentication = true) {
    event.preventDefault();
    if (!showAuthentication) {
      this.setState({ username: '', password: '' });
    }
    this.setState({ showAuthentication });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.urlInput.focus();
  }

  handleParamChange(event, id) {
    const requestParams = _.find(this.state.request_params, element => element.id === id);
    requestParams[event.target.dataset.type] = event.target.value;
    this.updateAndSet(this.state.request_params, requestParams, 'request_params');
  }

  handleHeaderChange(event, id) {
    const header = _.find(this.state.headers, element => element.id === id);
    header[event.target.dataset.type] = event.target.value;

    this.updateAndSet(this.state.headers, header, 'headers');
  }

  handleAssertionChange(event, id) {
    const assertion = _.find(this.state.assertions, element => element.id === id);
    assertion[event.target.dataset.type] = event.target.value;

    this.updateAndSet(this.state.assertions, assertion, 'assertions');
  }

  updateAndSet(list, element, stateName) {
    const change = {};
    change[stateName] = update(list, { $merge: element });
    this.setState(change);
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = _.extend(this.requestParams(), this.requestData());

    /*eslint-disable */
    $.ajax({
      url: this.props.formURL,
      context: this,
      dataType: 'json',
      type: 'POST',
      data: data,
      beforeSend: this.setState({loaded: false})
    }).done(function (data) {
      const token = data.token;
      hashHistory.push(`/api_responses/${token}`);
    }).fail(function (data) {
      const response = data.responseJSON;
      this.setState({errors: response.errors})
      this.urlInput.focus();
    }).complete(function() {
      this.setState({loaded: true})
    });
    /*eslint-enable */
  }

  requestData() {
    return {
      url: this.state.url,
      method: this.state.method,
      username: this.state.username,
      password: this.state.password,
      request_headers: this.requestHeaders(),
      assertions: this.requestAssertions(),
    };
  }

  requestHeaders() {
    const headers = this.state.headers.map((element) => {
      return _.pick(element, 'key', 'value');
    });
    return headers;
  }

  requestAssertions() {
    const assertions = this.state.assertions.map((element) => {
      return _.pick(element, 'kind', 'key', 'comparison', 'value');
    });
    return assertions;
  }

  requestParams() {
    if (this.state.showRequestBody) {
      return { request_body: this.state.request_body };
    } else {
      const parameters = this.state.request_params.map((element) => {
        return _.pick(element, 'key', 'value');
      });
      return { request_parameters: parameters };
    }
  }

  render() {
    return (
      <div className="container-fluid api-req-form__container">
        <div className="row form-controls text-center">
          <form onSubmit={event => this.handleSubmit(event)} className="bootstrap-center-form api-req-form__form">
            <div className="api-req-form__url-group">
                <div>
                  <SelectForMethods handleChange={event => this.handleChange(event)} defaultMethod={this.state.method} />
                  <Error messages={this.state.errors.method} />
                </div>
                <div className="api-req-form__url-control">
                  <input ref={(c) => { this.urlInput = c; }} value={this.state.url} type="text" className="input form-control required" name="url" placeholder="Enter destination URL" onChange={event => this.handleChange(event)} />
                  <Error messages={this.state.errors.url} />
                </div>
                <div className="api-req-form__btn-group btn-group">
                  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="api-req-form__more-text">More</span>
                    <span className="caret" />
                    <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul className="dropdown-menu">
                    <li><AddAuthLink addAuth={this.toggleAuth.bind(this)} /></li>
                    <li><AddHeaderLink addHeader={this.addHeader.bind(this)} /></li>
                    <li><AddParamLink addParam={this.addParam.bind(this)} /></li>
                    <li><AddRequestBody addBody={this.addBody.bind(this)} /></li>
                    <li><AddAssertionLink addAssertion={this.addAssertion.bind(this)} /></li>
                  </ul>
                </div>
                <button type="submit" className="btn btn-primary" disabled={!this.state.loaded}>
                  <i className="fa fa-paper-plane-o api-req-form__send-icon" />
                  SEND
                </button>
            </div>
            <Authentication showAuthentication={this.state.showAuthentication} handleChange={this.handleChange.bind(this)} username={this.state.username} password={this.state.password} removeAuth={event => this.toggleAuth(event, false)} />
            <Headers headers={this.state.headers} addHeader={this.addHeader.bind(this)} handleHeaderChange={this.handleHeaderChange.bind(this)} removeHeader={this.removeHeader.bind(this)} />
            <Params params={this.state.request_params} addParam={this.addParam.bind(this)} handleParamChange={this.handleParamChange.bind(this)} removeParam={this.removeParam.bind(this)} />
            <Assertions assertions={this.state.assertions} addAssertion={this.addAssertion.bind(this)} handleAssertionChange={this.handleAssertionChange.bind(this)} removeAssertion={this.removeAssertion.bind(this)} />
            <RequestBody showRequestBody={this.state.showRequestBody} handleChange={this.handleChange.bind(this)} value={this.state.request_body || ''} removeRequestBody={this.removeRequestBody.bind(this)} />
          </form>
          <Error messages={this.state.errors.base} />
        </div>
        <Loader loaded={this.state.loaded} zIndex={2e9} />
      </div>
    );
  }
}

const Error = ({ messages }) => {
  if (messages) {
    return <span className="text-danger pull-left">{messages.join()}</span>;
  } else {
    return <span />;
  }
};

ApiRequestForm.defaultProps = {
  formURL: '/api_responses',
};

export default ApiRequestForm;
