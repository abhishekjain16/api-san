import React from 'react';
import { Link } from 'react-router';
import _ from 'underscore';
import ReactDOM from 'react-dom';
import ApiRequestForm from '../api_request_form';
import moment from 'moment';

class HashData {
  static parse(data) {
    const keys = Object.keys(data);

    const finalData = keys.map((key) => {
      const hash = {};
      hash.key = key;
      hash.value = data[key];
      hash.id = uuid.v1();
      return hash;
    });

    return finalData;
  }
}

class ApiResponse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: { response_code: '', response_headers: {}, response_body: {} },
      url: '',
      httpMethod: '',
      requestParams: [],
      requestHeaders: [],
      notFound: false,
      serverError: false,
      activeTab: 'body'
    };
  }

  componentWillMount() {
    const token = this.props.params.token;
    const url = `/api_responses/${token}`;

    /*eslint-disable */
    $.ajax({
      url: url, context: this, dataType: 'json', type: 'GET'
    }).done(function (data) {
      let requestData = {
        url: data.url,
        method: data.httpMethod,
        request_body: data.requestBody,
        username: data.username,
        password: data.password,
        showAuthentication: (data.username && data.username.length > 0 && data.password && data.password.length > 0 && true),
        request_params: HashData.parse(data.requestParams),
        request_headers: HashData.parse(data.requestHeaders)
      };
      this.setState(data);
      this.setState({requestData: requestData});
    }).fail(function (data) {
      if (data.status == 404) {
        this.setState({notFound: true})
      } else {
        this.setState({serverError: true})
      }
    });
    /*eslint-enable */
  }

  render() {
    if (this.state.notFound) {
      return <NotFound />;
    } else if (this.state.serverError) {
      return <ServerError />;
    } else {
      return (
        <ApiResponseView
          httpMethod={this.state.httpMethod}
          url={this.state.url}
          response={this.state.response}
          requestData={this.state.requestData}
          requestHeaders={this.state.requestHeaders}
          requestParams={this.state.requestParams}
          token={this.props.params.token} />
      );
    }
  }
}

class ApiResponseView extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'body'
    };
  }

  render () {
    let { httpMethod, url, response, requestHeaders, requestParams, token, requestData } = this.props;
    return (
      <div>
        <ApiRequestForm {...requestData} />
        <div className="api-res-form__response">
          <h3>Response</h3>
          <HTTPStatus value={response.response_code} />
          <p><span className="api-res-form__label">Date:</span> {moment().format('llll')}</p>
          <ul className="nav nav-tabs api-res__req-tabs">
            <li className={this.state.activeTab === 'body' ? 'active' : ''}>
              <a onClick={()=>{this.setState({activeTab: 'body'})}}>Body</a>
            </li>
            <li className={this.state.activeTab === 'headers' ? 'active' : ''}>
              <a onClick={()=>{this.setState({activeTab: 'headers'})}}>Headers</a>
            </li>
          </ul>
          {(()=>{
            if(this.state.activeTab === 'body') {
              return (<Body response={response} />);
            } else if (this.state.activeTab === 'headers') {
              return (<Headers headers={response.response_headers} />);
            } else {
              return <div />;
            }
          })()}
        </div>
      </div>
    );
  }
};

const NotFound = () => {
  return (
    <h2 className="text-center">The page you are looking for does not exist </h2>
  );
};

const ServerError = () => {
  return (
    <h2 className="text-center">Something went wrong. Please try again later</h2>
  );
};


const Styles = {
  parsedJson: { backgroundColor: 'initial' },
};

const HTTPMethod = ({ value, url }) => {
  return <h4><small>{value}</small><br/>{url}</h4>;
};

const HTTPStatus = ({ value }) => {
  return <p> <span className="api-res-form__label">Status:</span> {value} </p>;
};

const Headers = ({ headers }) => {
  return (
    <ul className="api-res__headers">
      {_.map(headers, (value, key) => {
        return <ListItemPair key={key} listKey={key} listValue={value} />;
      })}
    </ul>
  );
};

const Body = (props) => {
  return (
    <ParsedResponse {...props} />
  );
};

const ParsedResponse = ({ response }) => {
  const contentType = response.response_headers.content_type;
  if (contentType && contentType.match(/json/g)) {
    return <ParsedJSONResponse body={response.response_body} />;
  } else {
    return <div>Response not in JSON</div>;
  }
};

class ParsedJSONResponse extends React.Component {
  constructor() {
    super();
    this.toggleParsedJSON = this.toggleParsedJSON.bind(this);
    this.formatJsonView = this.formatJsonView.bind(this);
    this.jsonData = this.jsonData.bind(this);
    this.state = {
      showFormattedJson: true,
    }
  }

  toggleParsedJSON(event) {
    event.preventDefault();
    this.setState({
      showFormattedJson: !this.state.showFormattedJson
    });
    return false;
  }

  formatJsonView() {
    $(this.refs.formattedJSON).jsonView(this.jsonData(), { collapsed: true });
  }

  jsonData() {
    return JSON.parse(this.props.body);
  }

  componentDidMount() {
    this.formatJsonView();
  }

  componentDidUpdate(prevProps, prevState) {
    this.formatJsonView();
    ReactDOM.findDOMNode(this.refs.jsonResponse).scrollIntoView();
  }

  render() {
    let rawJson = JSON.stringify(this.jsonData());
    return (
      <div ref="jsonResponse">
        <a className="btn" onClick={this.toggleParsedJSON}>
          { this.state.showFormattedJson ? "View raw" : "View formatted" }
        </a>
        <pre style={Styles.parsedJSON}>
          { this.state.showFormattedJson ? <div ref="formattedJSON"></div> : rawJson }
        </pre>
      </div>
    );
  }
};

const List = ({ list, heading }) => {
  if (_.isEmpty(list)) {
    return <div />;
  } else {
    return (
      <div>
        <h5>{heading}:</h5>
        <ul>
          {_.map(list, (value, key) => {
            return <ListItemPair key={key} listKey={key} listValue={value} />;
          })}
        </ul>
      </div>
    );
  }
};

const ListItemPair = ({ listKey, listValue }) => {
  return (
    <li className="list-group-item list-headers">
      {listKey}: {listValue}
    </li>
  );
};

export default ApiResponse;
