import React from 'react';
import _ from 'underscore';

const ApiResponse = ({ response, url, httpMethod, requestParams }) => {
  return (
    <div>
      <div className="row">
        <HTTPMethod value={httpMethod} url={url} />
      </div>
      <div className="row">
        <HTTPStatus value={response.response_code} />
      </div>
      <div className="row">
        <RequestParams params={requestParams} />
      </div>
      <h4 className="text-center"> Response</h4>
      <div className="row">
        <Headers headers={response.response_headers} />
      </div>
      <div className="row">
        <Body response={response} />
      </div>
    </div>
  );
};

ApiResponse.propTypes = {
  response: React.PropTypes.isRequired,
  url: React.PropTypes.isRequired,
  httpMethod: React.PropTypes.isRequired,
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
          return <Header key={key} headerKey={key} headerValue={value} />;
        })}
      </ul>
    </div>
  );
};

const Header = ({ headerKey, headerValue }) => {
  return (
    <li className="list-group-item">
      {headerKey}: {headerValue}
    </li>
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

const RequestParams = ({ params }) => {
  if (_.isEmpty(params)) {
    return <div />;
  } else {
    return (
      <div>
        <h4>Request Params:</h4>
        <ul>
          {_.map(params, (value, key) => {
            return <RequestParam key={key} paramKey={key} paramValue={value} />;
          })}
        </ul>
      </div>
    );
  }
};

const RequestParam = ({ paramKey, paramValue }) => {
  return (
    <li className="list-group-item">
      {paramKey}: {paramValue}
    </li>
  );
};

export default ApiResponse;
