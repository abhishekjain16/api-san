import React from 'react';
import _ from 'underscore';

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
    };
  }

  componentWillMount() {
    const token = this.props.params.token;
    const url = `/api_responses/${token}`;

    /*eslint-disable */
    $.ajax({
      url: url, context: this, dataType: 'json', type: 'GET'
    }).done(function (data) {
      this.setState(data);
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
          requestHeaders={this.state.requestHeaders}
          requestParams={this.state.requestParams} />
      );
    }
  }
}

const ApiResponseView = ({ httpMethod, url, response, requestHeaders, requestParams }) => {
  return (
    <div>
      <h3 className="text-center"> Request</h3>
      <div className="row">
        <HTTPMethod value={httpMethod} url={url} />
      </div>
      <div className="row">
        <HTTPStatus value={response.response_code} />
      </div>
      <div className="row">
        <List list={requestHeaders} heading="Headers" />
      </div>
      <div className="row">
        <List list={requestParams} heading="Parameters" />
      </div>
      <h3 className="text-center"> Response</h3>
      <div className="row">
        <Headers headers={response.response_headers} />
      </div>
      <div className="row">
        <Body response={response} />
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


const Styles = {
  parsedJson: { backgroundColor: 'initial' },
  parsedResponseContainer: { paddingLeft: '40px' },
};

const HTTPMethod = ({ value, url }) => {
  return <h3>{value} {url}</h3>;
};

const HTTPStatus = ({ value }) => {
  return <p> Status: {value} </p>;
};

const Headers = ({ headers }) => {
  return (
    <div>
      <h5>Headers:</h5>
      <ul>
        {_.map(headers, (value, key) => {
          return <ListItemPair key={key} listKey={key} listValue={value} />;
        })}
      </ul>
    </div>
  );
};

const Body = (props) => {
  return (
    <div>
      <h5>Body:</h5>
      <div style={Styles.parsedResponseContainer}>
        <ParsedResponse {...props} />
      </div>
    </div>
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

const ParsedJSONResponse = ({ body }) => {
  let formattedJson = JSON.stringify(JSON.parse(body), null, 2);
  formattedJson = `${formattedJson}`;
  return (
    <pre style={Styles.parsedJson}>
      {formattedJson}
    </pre>
  );
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
