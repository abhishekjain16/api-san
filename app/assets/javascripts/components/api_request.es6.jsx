class ApiRequest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      username: '',
      password: '',
      errorMessage: '',
      response: {},
      isLoading: false,
      httpMethod: 'GET'
    };
  }


  handleChange(event) {
    let change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);
  }

  handleSubmit(event) {
    event.preventDefault();
    const requestData = this.requestData();

    $.ajax({
      url: this.props.formURL, context: this, dataType: 'json', type: 'POST', data: requestData
    }).done(function (data) {
      this.setState({response: data});
    }).fail(function (data) {
      //Need to add this
    });
  }

  requestData() {
    return {
      url: this.state.url,
      auth: {
        username: this.state.username,
        password: this.state.password
      }
    }
  }

  render () {
    const response = this.state.response;
    if (Object.keys(response).length === 0) {
      return <ApiRequestForm handleChange={(event) => this.handleChange(event)} handleSubmit={(event) => this.handleSubmit(event)}/>
    } else {
      return <ApiResponse response={response} url={this.state.url} httpMethod={this.state.httpMethod} />
    }
  }
}

ApiRequest.defaultProps = {
  formURL: '/api_requests/build'
}

