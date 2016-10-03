import React from 'react';
import uuid from 'uuid';

class ApiRequestForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: [],
      showRequestBody: false,
      headers: [],
    };
  }

  addParam(event) {
    event.preventDefault();
    const params = this.state.params.concat({ id: uuid.v1() });
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
    const headers = this.state.headers.concat({ id: uuid.v1() });
    this.setState({ headers });
  }

  removeParam(event, paramId) {
    event.preventDefault();
    const params = this.state.params.filter((element) => {
      return element.id !== paramId;
    });
    this.setState({ params });
  }

  removeHeader(event, headerId) {
    event.preventDefault();
    const headers = this.state.headers.filter((element) => {
      return element.id !== headerId;
    });
    this.setState({ headers });
  }

  render() {
    const params = this.state.params.map((param) => {
      const removeParam = event => this.removeParam(event, param.id);
      return <RequestParameterInput key={param.id} removeParam={removeParam} />;
    });
    const headers = this.state.headers.map((header) => {
      const removeHeader = event => this.removeHeader(event, header.id);
      return <RequestHeaderInput key={header.id} removeHeader={removeHeader} />;
    });
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="row form-controls text-center">
            <form method="POST" action={this.props.formURL} className="bootstrap-center-form">

              <div className="form-group">
                <div className="row text-center">
                  <Label title="Destination URL" />
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <SelectForMethods />
                  </div>
                  <div className="col-sm-9">
                    <input type="text" className="form-control required" name="url" placeholder="Enter destination URL" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <Label title="Authentication Basic" />
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <input type="text" className="form-control" name="username" placeholder="Enter username" />
                  </div>
                  <div className="col-sm-6">
                    <input type="text" className="form-control" name="password" placeholder="Enter password" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <Label title="Headers" />
                </div>
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
                <div className="row">
                  <Label title="Parameters" />
                </div>
                <div className="row form-controls">
                  <div className="row">
                    <AddParamLink addParam={event => this.addParam(event)} />
                    OR
                    <AddRequestBody addBody={event => this.addBody(event)} />
                  </div>
                  <div className="row form-controls">
                    {params}
                    <RequestBody showRequestBody={this.state.showRequestBody} />
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

const RequestBody = ({ showRequestBody }) => {
  return (
    showRequestBody ?
      <textarea name="request_body" placeholder="Enter Request Body" rows="8" cols="8" className="form-control" /> :
      <div />
  );
};

const RequestParameterInput = ({ removeParam }) => {
  return (
    <div className="row form-controls form-input-text">
      <KeyInput inputKeyName="request_parameters[][key]" />
      <ValueInput inputValueName="request_parameters[][value]" />
      <div className="col-sm-2">
        <a href="" className="fa fa-2x fa-times" onClick={removeParam}>
          <span />
        </a>
      </div>
    </div>
  );
};

const RequestHeaderInput = ({ removeHeader }) => {
  return (
    <div className="row form-controls form-input-text">
      <KeyInput inputKeyName="request_headers[][key]" />
      <ValueInput inputValueName="request_headers[][value]" />
      <div className="col-sm-2">
        <a href="" className="fa fa-2x fa-times" onClick={removeHeader}>
          <span />
        </a>
      </div>
    </div>
  );
};

const KeyInput = ({ inputKeyName }) => {
  return (
    <div className="col-sm-5">
      <input type="text" name={inputKeyName} className="form-control" placeholder="Enter Name" />
    </div>
  );
};

const ValueInput = ({ inputValueName }) => {
  return (
    <div className="col-sm-5">
      <input type="text" name={inputValueName} className="form-control" placeholder="Enter Value" />
    </div>
  );
};

const SelectForMethods = () => {
  return (
    <select className="form-control required" name="method" defaultValue="get">
      <option value="get">GET</option>
      <option value="post">POST</option>
      <option value="put">PUT</option>
      <option value="patch">PATCH</option>
      <option value="delete">Delete</option>
    </select>
  );
};

const Label = ({ title }) => {
  return (
    <label htmlFor={title}>
      {title}
    </label>
  );
};

ApiRequestForm.defaultProps = {
  formURL: '/api_responses',
};

export default ApiRequestForm;
