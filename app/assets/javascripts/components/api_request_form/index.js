import React from 'react';
import uuid from 'uuid';
import update from 'react-addons-update';
import _ from 'underscore';
import { hashHistory } from 'react-router';
import Loader from 'react-loader';
import ReactDOM from 'react-dom';

class ApiRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url || '',
      method: this.props.method || 'get',
      username: this.props.username || '',
      password: this.props.password || '',
      request_body: this.props.request_body || '',
      params: this.props.request_params || [],
      headers: this.props.request_headers || [],
      assertions: this.props.assertions || [],
      showRequestBody: false,
      showAuthentication: this.props.showAuthentication || false,
      errors: {},
      loaded: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState(nextProps);
      return true;
    }
  }

  componentDidMount() {
    window.x = this.refs.urlInput;
    ReactDOM.findDOMNode(this.refs.urlInput).focus();
  }

  addParam(event) {
    event.preventDefault();
    const params = this.state.params.concat({ id: uuid.v1(), key: '', value: '' });
    const showRequestBody = false;
    this.setState({ params, showRequestBody });
  }

  addBody(event) {
    event.preventDefault();
    const params = [];
    const showRequestBody = true;
    this.setState({ params, showRequestBody });
  }

  addHeader(event) {
    event.preventDefault();
    const headers = this.state.headers.concat({ id: uuid.v1(), key: '', value: '' });
    this.setState({ headers });
  }

  addAssertion(event) {
    event.preventDefault();
    const assertions = this.state.assertions.concat({ id: uuid.v1(), kind: 'ResponseJSON', key: '', comparision: 'equals', value: '' });
    this.setState({ assertions });
  }

  removeParam(event, paramId) {
    event.preventDefault();
    const params = this.state.params.filter(element => element.id !== paramId);
    this.setState({ params });
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

  handleCheckboxChange(event) {
    this.setState({ showAuthentication: event.target.checked });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleParamChange(event, id) {
    const param = _.find(this.state.params, element => element.id === id);
    param[event.target.dataset.type] = event.target.value;

    this.updateAndSet(this.state.params, param, 'params');
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
      //TODO: add post request to accept and save assertions in request object
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
      console.log(element);
      return _.pick(element, 'kind', 'key', 'comparision', 'value');
    });
    return assertions;
  }

  requestParams() {
    if (this.state.showRequestBody) {
      return { request_body: this.state.request_body };
    } else {
      const parameters = this.state.params.map((element) => {
        return _.pick(element, 'key', 'value');
      });
      return { request_parameters: parameters };
    }
  }

  render() {
    const params = this.state.params.map((param) => {
      const removeParam = event => this.removeParam(event, param.id);
      const handleParamChange = event => this.handleParamChange(event, param.id);
      return <RequestParameterInput key={param.id} removeParam={removeParam} handleParamChange={handleParamChange} param={param} />;
    });
    const headers = this.state.headers.map((header) => {
      const removeHeader = event => this.removeHeader(event, header.id);
      const handleHeaderChange = event => this.handleHeaderChange(event, header.id);
      return <RequestHeaderInput key={header.id} removeHeader={removeHeader} handleHeaderChange={handleHeaderChange} header={header} />;
    });
    const assertions = this.state.assertions.map((assertion) => {
      const removeAssertion = event => this.removeAssertion(event, assertion.id);
      const handleAssertionChange = event => this.handleAssertionChange(event, assertion.id);
      return <RequestAssertionInput key={assertion.id} removeAssertion={removeAssertion} handleAssertionChange={handleAssertionChange} assertion={assertion} />;
    });
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
                  <input ref="urlInput" value={this.state.url} type="text" className="input form-control required" name="url" placeholder="Enter destination URL" onChange={event => this.handleChange(event)} />
                  <Error messages={this.state.errors.url} />
                </div>
            </div>
            <div className="form-inline api-req-form__auth-form">
              <div className="form-group checkbox">
                <label htmlFor="authentication"><input type="checkbox" className="api-req-form__auth-check" checked={this.state.showAuthentication} onChange={event => this.handleCheckboxChange(event)} />Basic Authentication</label>
              </div>
              <Authentication username={this.state.username} password={this.state.password} showAuthentication={this.state.showAuthentication} handleChange={event => this.handleChange(event)} />
            </div>

            <div className="form-group">
              <AddHeaderLink addHeader={event => this.addHeader(event)} />
              {headers}
            </div>

            <div className="form-group">
              <div className="api-req-form__param-links">
                <AddParamLink addParam={event => this.addParam(event)} />
                OR
                <AddRequestBody addBody={event => this.addBody(event)} />
              </div>
              <div>
                {params}
                <RequestBody showRequestBody={this.state.showRequestBody} handleChange={event => this.handleChange(event)} value={this.state.request_body || ''} />
              </div>
            </div>

            <div className="form-group">
              <AddAssertionLink addAssertion={event => this.addAssertion(event)} />
              {assertions}
            </div>

            <button type="submit" className="btn btn-primary" disabled={!this.state.loaded}>
              <i className="fa fa-paper-plane-o api-req-form__send-icon" />
              SEND
            </button>
          </form>
          <Error messages={this.state.errors.base} />
        </div>
        <Loader loaded={this.state.loaded} zIndex={2e9} />
      </div>
    );
  }
}

const AddParamLink = ({ addParam }) => {
  return <a href="" onClick={event => addParam(event)} className="devise-links"> Add Parameter </a>;
};

const AddHeaderLink = ({ addHeader }) => {
  return <a href="" onClick={event => addHeader(event)} className="devise-links"> Add Header </a>;
};

const AddAssertionLink = ({ addAssertion }) => {
  return <a href="" onClick={event => addAssertion(event)} className="devise-links"> Add Assertion </a>;
};

const AddRequestBody = ({ addBody }) => {
  return <a href="" onClick={event => addBody(event)} className="devise-links"> Add Body</a>;
};

const RequestBody = ({ showRequestBody, handleChange, value }) => {
  return (
    showRequestBody ?
      <textarea name="request_body" placeholder="Enter Request Body" rows="8" cols="8" className="form-control api-req-form__textarea" onChange={handleChange} value={value} /> :
      <div />
  );
};

const RequestParameterInput = ({ removeParam, handleParamChange, param }) => {
  return (
    <div className="api-req-form__form-inline form-inline">
      <KeyInput inputKeyName="request_parameters[][key]" handleKeyChange={handleParamChange} value={param.key} />
      <ValueInput inputValueName="request_parameters[][value]" handleValueChange={handleParamChange} value={param.value} />
      <a href="" className="fa fa-2x fa-times api-req-form__remove-icon" onClick={removeParam}>
        <span />
      </a>
    </div>
  );
};

const RequestHeaderInput = ({ removeHeader, handleHeaderChange, header }) => {
  return (
    <div className="api-req-form__form-inline form-inline">
      <KeyInput inputKeyName="request_headers[][key]" handleKeyChange={handleHeaderChange} value={header.key} />
      <ValueInput inputValueName="request_headers[][value]" handleValueChange={handleHeaderChange} value={header.value} />
      <a href="" className="fa fa-2x fa-times api-req-form__remove-icon" onClick={removeHeader}>
        <span />
      </a>
    </div>
  );
};

const RequestAssertionInput = ({ removeAssertion, handleAssertionChange, assertion }) => {
  return (
    <div className="api-req-form__form-inline form-inline">
      <AssertionKindInput inputKeyName="request_assertions[][kind]" handleKindChange={handleAssertionChange} value={assertion.kind } />
      <KeyInput inputKeyName="request_assertions[][key]" handleKeyChange={handleAssertionChange} value={assertion.key} />
      <AssertionComparisionInput inputKeyName="request_assertions[][comarision]" handleComparisionChange={handleAssertionChange} value={assertion.comparision} />
      <ValueInput inputValueName="request_assertions[][value]" handleValueChange={handleAssertionChange} value={assertion.value} />
      <a href="" className="fa fa-2x fa-times api-req-form__remove-icon" onClick={removeAssertion}>
        <span />
      </a>
    </div>
  );
};

const Error = ({ messages }) => {
  if (messages) {
    return <span className="text-danger pull-left">{messages.join()}</span>;
  } else {
    return <span />;
  }
};

const KeyInput = ({ inputKeyName, handleKeyChange, value }) => {
  return (
    <input type="text" value={value} name={inputKeyName} className="input form-control api-req-form__input" placeholder="Enter Name" onChange={handleKeyChange} data-type="key" />
  );
};

const AssertionKindInput = ({ inputKindName, handleKindChange, value }) => {
  return (
    <select name={inputKindName} className="api-req-form__assertion-select form-control required" value={value} onChange={handleKindChange} data-type="kind">
      <option>ResponseJSON</option>
      <option>ResponseBody</option>
    </select>
    );
}

const AssertionComparisionInput = ({ inputComparisionName, handleComparisionChange, value }) => {
  return (
    <select name={inputComparisionName} className="api-req-form__assertion-select form-control required" value={value} onChange={handleComparisionChange} data-type="comparision">
      <option>equals</option>
      <option>contains</option>
      <option>greater than</option>
      <option>lesser than</option>
    </select>
    );
}

const ValueInput = ({ inputValueName, handleValueChange, value }) => {
  return (
    <input type="text" value={value} name={inputValueName} className="input form-control api-req-form__input" placeholder="Enter Value" onChange={handleValueChange} data-type="value" />
  );
};

const SelectForMethods = ({ handleChange, defaultMethod }) => {
  return (
    <select className="form-control required" name="method" defaultValue={defaultMethod.toLowerCase()} onChange={handleChange}>
      <option value="get">GET</option>
      <option value="post">POST</option>
      <option value="put">PUT</option>
      <option value="patch">PATCH</option>
      <option value="delete">Delete</option>
    </select>
  );
};

const Authentication = ({ showAuthentication, handleChange, username, password }) => {
  if (showAuthentication) {
    return (
      <div className="form-group">
        <div className="form-group">
          <input type="text" value={username} className="input form-control" name="username" placeholder="Enter username" onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="text" value={password} className="input form-control" name="password" placeholder="Enter password" onChange={handleChange} />
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

ApiRequestForm.defaultProps = {
  formURL: '/api_responses',
};

export default ApiRequestForm;
