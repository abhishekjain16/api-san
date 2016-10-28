import React from 'react';
import uuid from 'uuid';
import update from 'react-addons-update';
import _ from 'underscore';
import { hashHistory } from 'react-router';

class ApiRequestForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
      method: 'get',
      username: '',
      password: '',
      request_body: '',
      params: [],
      headers: [],
      showRequestBody: false,
      showAuthentication: false,
      errors: {},
    };
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

  handleCheckboxChange(event) {
    this.setState({ showAuthentication: event.target.checked });
  }

  handleChange(event) {
    const change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);
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
      url: this.props.formURL, context: this, dataType: 'json', type: 'POST', data: data
    }).done(function (data) {
      const token = data.token;
      hashHistory.push(`/api_responses/${token}`);
    }).fail(function (data) {
      const response = data.responseJSON;
      this.setState({errors: response.errors})
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
    };
  }

  requestHeaders() {
    const headers = this.state.headers.map((element) => {
      return _.pick(element, 'key', 'value');
    });
    return headers;
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
      return <RequestParameterInput key={param.id} removeParam={removeParam} handleParamChange={handleParamChange} />;
    });
    const headers = this.state.headers.map((header) => {
      const removeHeader = event => this.removeHeader(event, header.id);
      const handleHeaderChange = event => this.handleHeaderChange(event, header.id);
      return <RequestHeaderInput key={header.id} removeHeader={removeHeader} handleHeaderChange={handleHeaderChange} />;
    });
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="row form-controls text-center">
            <form onSubmit={event => this.handleSubmit(event)} className="bootstrap-center-form">

              <div className="form-group">
                <div className="row">
                  <div className="col-sm-3">
                    <SelectForMethods handleChange={event => this.handleChange(event)} defaultMethod={this.state.method} />
                    <Error messages={this.state.errors.method} />
                  </div>
                  <div className="col-sm-9">
                    <input type="text" className="form-control required" name="url" placeholder="Enter destination URL" onChange={event => this.handleChange(event)} />
                    <Error messages={this.state.errors.url} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="checkbox">
                  <label htmlFor="authentication"><input type="checkbox" onChange={event => this.handleCheckboxChange(event)} />Basic Authentication</label>
                </div>
                <Authentication showAuthentication={this.state.showAuthentication} handleChange={event => this.handleChange(event)} />
              </div>

              <div className="form-group">
                <div className="row form-controls">
                  <div className="row">
                    <AddHeaderLink addHeader={event => this.addHeader(event)} />
                  </div>
                  <div className="row form-controls">
                    {headers}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row form-controls">
                  <div className="row">
                    <AddParamLink addParam={event => this.addParam(event)} />
                    OR
                    <AddRequestBody addBody={event => this.addBody(event)} />
                  </div>
                  <div className="row form-controls">
                    {params}
                    <RequestBody showRequestBody={this.state.showRequestBody} handleChange={event => this.handleChange(event)} />
                  </div>
                </div>
              </div>

              <div className="form-buttons text-center row">
                <button type="submit" className="btn btn-primary btn-block">Launch Request</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
}


const AddParamLink = ({ addParam }) => {
  return <a href="" onClick={event => addParam(event)} className="devise-links"> (+) Add Parameter(s) </a>;
};

const AddHeaderLink = ({ addHeader }) => {
  return <a href="" onClick={event => addHeader(event)} className="devise-links"> (+) Add Header(s) </a>;
};

const AddRequestBody = ({ addBody }) => {
  return <a href="" onClick={event => addBody(event)} className="devise-links"> (+) Add Body</a>;
};

const RequestBody = ({ showRequestBody, handleChange }) => {
  return (
    showRequestBody ?
      <textarea name="request_body" placeholder="Enter Request Body" rows="8" cols="8" className="form-control" onChange={handleChange} /> :
      <div />
  );
};

const RequestParameterInput = ({ removeParam, handleParamChange }) => {
  return (
    <div className="row form-controls form-input-text">
      <KeyInput inputKeyName="request_parameters[][key]" handleKeyChange={handleParamChange} />
      <ValueInput inputValueName="request_parameters[][value]" handleValueChange={handleParamChange} />
      <div className="col-sm-2">
        <a href="" className="fa fa-2x fa-times" onClick={removeParam}>
          <span />
        </a>
      </div>
    </div>
  );
};

const RequestHeaderInput = ({ removeHeader, handleHeaderChange }) => {
  return (
    <div className="row form-controls form-input-text">
      <KeyInput inputKeyName="request_headers[][key]" handleKeyChange={handleHeaderChange} />
      <ValueInput inputValueName="request_headers[][value]" handleValueChange={handleHeaderChange} />
      <div className="col-sm-2">
        <a href="" className="fa fa-2x fa-times" onClick={removeHeader}>
          <span />
        </a>
      </div>
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

const KeyInput = ({ inputKeyName, handleKeyChange }) => {
  return (
    <div className="col-sm-5">
      <input type="text" name={inputKeyName} className="form-control" placeholder="Enter Name" onChange={handleKeyChange} data-type="key" />
    </div>
  );
};

const ValueInput = ({ inputValueName, handleValueChange }) => {
  return (
    <div className="col-sm-5">
      <input type="text" name={inputValueName} className="form-control" placeholder="Enter Value" onChange={handleValueChange} data-type="value" />
    </div>
  );
};

const SelectForMethods = ({ handleChange, defaultMethod }) => {
  return (
    <select className="form-control required" name="method" defaultValue={defaultMethod} onChange={handleChange}>
      <option value="get">GET</option>
      <option value="post">POST</option>
      <option value="put">PUT</option>
      <option value="patch">PATCH</option>
      <option value="delete">Delete</option>
    </select>
  );
};

const Authentication = ({ showAuthentication, handleChange }) => {
  if (showAuthentication) {
    return (
      <div className="row">
        <div className="col-sm-6">
          <input type="text" className="form-control" name="username" placeholder="Enter username" onChange={handleChange} />
        </div>
        <div className="col-sm-6">
          <input type="text" className="form-control" name="password" placeholder="Enter password" onChange={handleChange} />
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
