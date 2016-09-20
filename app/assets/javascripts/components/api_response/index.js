import React from 'react'
import _ from 'underscore'

const ApiResponse = ({response, url, httpMethod}) => {
  return (
    <div>
      <h2 className="text-center">Response</h2>
      <div className="row">
        <HTTPMethod value={httpMethod} url={url} />
      </div>
      <div className="row">
        <HTTPStatus value={response.response_code} />
      </div>
      <div className="row">
        <Headers headers={response.response_headers}/>
      </div>
      <div className="row">
        <Body response={response} />
      </div>
    </div>
  );
};

module.exports = ApiResponse;

ApiResponse.propTypes = {
  response: React.PropTypes.object.isRequired
};

const Styles = {
  parsedJson: {backgroundColor: 'initial'},
  parsedResponseContainer: {paddingLeft: '40px'}
};

const HTTPMethod = ({value, url}) => {
  return <h4>{value} {url}</h4>
};

const HTTPStatus = ({value}) => {
  return <p> Status: {value} </p>
};

const Headers = ({headers}) => {
  return(
    <div>
      <h5>Headers:</h5>
      <ul>
        {_.map(headers, (value, key) => {
          return <Header key={key} headerKey={key} headerValue={value} />
        })}
      </ul>
    </div>
  )
};

const Header = ({headerKey, headerValue}) => {
  return <li className="list-group-item">
    {headerKey}: {headerValue}
  </li>
};

const Body = (props) => {
  return(
    <div>
      <h5>Body:</h5>
      <div style={Styles.parsedResponseContainer}>
        <ParsedResponse {...props}/>
      </div>
    </div>
  )
};

const ParsedResponse = ({response}) => {
  const contentType = response.response_headers.content_type;
  if (contentType && contentType.match(/json/g)) {
    return <ParsedJSONResponse body={response.response_body}/>
  }
  else {
    return <div>Response not in JSON</div>
  }
};

const ParsedJSONResponse = ({body}) => {
  var formattedJson = JSON.stringify(JSON.parse(body), null, 2)
  formattedJson = `${formattedJson}`;
  return(
    <pre style={Styles.parsedJson}>
      {formattedJson}
    </pre>
  )
};
