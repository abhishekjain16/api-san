import React from 'react';
import { Link } from 'react-router';
import _ from 'underscore';
import moment from 'moment';
import uuid from 'uuid';

import ApiRequestForm from '../api_request_form';
import ParsedJSONResponse from './parsed_json_response';

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
      requestData: {},
      requestParams: [],
      requestHeaders: [],
      notFound: false,
      serverError: false,
      activeTab: 'body',
    };
  }

  componentWillMount() {
    this.fetchResponseData();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.params.token !== this.props.params.token) {
      this.fetchResponseData(nextProps.params.token);
      return false;
    }
    return true;
  }

  fetchResponseData(newToken) {
    const token = newToken || this.props.params.token;
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
        request_headers: HashData.parse(data.requestHeaders),
        headers: HashData.parse(data.requestHeaders),
        assertions: data.assertions,
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
  }

  changeActiveTab(activeTab) {
    this.setState({ activeTab });
  }

  assertionFailureText(assertion) {
    let errorText = ""
    switch(assertion.comparison) {
      case 'equals':
        errorText  = ' was not equal to ';
        break;
      case 'contains':
        errorText  = ' did not contain ';
        break;
      case 'lesser than':
        errorText  = ' was not less than ';
        break;
      case 'greater than':
        errorText  = ' was not greater than ';
        break;
      default:
        errorText  = ' was not equal to ';
    }
    return errorText;
  }

  render() {
    if (this.state.notFound) {
      return <NotFound />;
    } else if (this.state.serverError) {
      return <ServerError />;
    } else {
      return (
        <ApiResponseView
          response={this.state.response}
          requestData={this.state.requestData}
          changeActiveTab={activeTab => this.changeActiveTab(activeTab)}
          assertionFailureText={assertion => this.assertionFailureText(assertion)}
          activeTab={this.state.activeTab} />
      );
    }
  }
}

const ApiResponseView = ({ response, requestData, activeTab, changeActiveTab, assertionFailureText }) => {
  return (
    <div>
      <ApiRequestForm {...requestData} />
      <div className="api-res-form__response">
        <h3>Response</h3>
        <HTTPStatus value={response.response_code} />
        <p><span className="api-res-form__label">Date:</span> {moment().format('llll')}</p>
        <AssertionView assertions={requestData.assertions} assertionFailureText={assertionFailureText} />
        <ul className="nav nav-tabs api-res__req-tabs">
          <li className={activeTab === 'body' ? 'active' : ''}>
            <Link onClick={() => { changeActiveTab('body'); }}>Body</Link>
          </li>
          <li className={activeTab === 'headers' ? 'active' : ''}>
            <Link onClick={() => { changeActiveTab('headers'); }}>Headers</Link>
          </li>
        </ul>
        {(() => {
          if (activeTab === 'body') {
            return (<Body response={response} />);
          } else if (activeTab === 'headers') {
            return (<Headers headers={response.response_headers} />);
          } else {
            return <div />;
          }
        })()}
      </div>
    </div>
  );
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

const ListItemPair = ({ listKey, listValue }) => {
  return (
    <li className="list-group-item list-headers">
      {listKey}: {listValue}
    </li>
  );
};

const AssertionView = ({ assertions, assertionFailureText }) => {
  if (!assertions || !assertions.length) {
    return <div/>
  };
  return (
    <div>
      <span className="api-res-form__label">Assertions:</span>
      <ul className="api-res-form__assertions">
        {
          assertions.map((assertion, index) => {
            return (
              <li key={index} className={'api-res-form__assertion--'+(assertion.success ? 'success' : 'fail')}>
                <i className={assertion.success ? 'fa fa-check' : 'fa fa-times'}/>
                <AssertionText assertion={assertion} success={assertion.success} assertionFailureText={assertionFailureText} />
              </li>
            );
          })
        }
      </ul>
    </div>
    );
}

const AssertionText = ({ assertion, success, assertionFailureText }) => {
  if (success) {
    return(
      <span>
        {assertion.key + ' ' + assertion.comparison + ' '}
        <strong>{assertion.value}</strong>
      </span>
    );
  } else {
    return(
      <span>
        {assertion.key + ' '}
        {assertionFailureText(assertion)}
        <strong>{assertion.value}.</strong>
        {" The value received was "}
        <strong>{assertion.api_value}.</strong>
      </span>
    );
  }
}

export default ApiResponse;
