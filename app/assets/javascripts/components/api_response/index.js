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
    });
    /*eslint-enable */
  }

  render() {
    return (
      <div>
        <h3 className="text-center"> Request</h3>
        <div className="row">
          <HTTPMethod value={this.state.httpMethod} url={this.state.url} />
        </div>
        <div className="row">
          <HTTPStatus value={this.state.response.response_code} />
        </div>
        <div className="row">
          <List list={this.state.requestHeaders} heading="Headers" />
        </div>
        <div className="row">
          <List list={this.state.requestParams} heading="Parameters" />
        </div>
        <h3 className="text-center"> Response</h3>
        <div className="row">
          <Headers headers={this.state.response.response_headers} />
        </div>
        <div className="row">
          <Body response={this.state.response} />
        </div>
      </div>
    );
  }
}

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
