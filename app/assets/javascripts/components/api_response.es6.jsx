class ApiResponse extends React.Component {
  render () {
    const response = this.props.response;
    const url = this.props.url;
    const httpMethod = this.props.httpMethod;
    const headers = Object.keys(response.response_headers).map((key) => {
      return (
        <li className="list-group-item" key={key}>
          {key}: {response.response_headers[key]}
        </li>
      )
    })
    return (
      <div>
        <h2 className="text-center"> Response</h2>
        <div className="row">
          <h4>{httpMethod} {url}</h4>
        </div>
        <div className="row">
          <p> Status: {response.response_code} </p>
        </div>
        <div>
          <h5>Headers:</h5>
          <ul>
            {headers}
          </ul>
        </div>
        <div>
          <h5>Body:</h5>
            <DOMify value={response.response_body} />
        </div>
      </div>
    );
  }
}

ApiResponse.propTypes = {
  response: React.PropTypes.object.isRequired
};
