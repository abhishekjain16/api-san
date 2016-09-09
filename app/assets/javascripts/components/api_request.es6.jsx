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
    requestdata = this.buildData();

    $.ajax({
      url: this.props.formURL, context: this, dataType: 'json', type: 'POST', data: requestdata
    }).done(function (data) {
      this.setState({response: data});
    }).fail(function (data) {
      //Need to add this
    });
  }

  buildData() {
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
      return (
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <div className="row form-controls text-center">
              <form onSubmit={(event) => this.handleSubmit(event)}>
                <div className="form-group">
                  <div className="row text-center">
                    <label>
                      Destination URL
                    </label>
                  </div>
                  <div className="row">
                    <input type="text" className="form-control required" name="url" onChange={(event) => this.handleChange(event)} placeholder="Enter destination URL" />
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <label>
                      Authentication Basic
                    </label>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <input type="text" className="form-control" name="username" onChange={(event) => this.handleChange(event)} placeholder="Enter username" />
                    </div>
                    <div className="col-sm-6">
                      <input type="text" className="form-control" name="password" onChange={(event) => this.handleChange(event)} placeholder="Enter password" />
                    </div>
                  </div>
                </div>
                <div className="form-buttons row">
                  <div className="col-sm-5">
                    <button type="submit" className="btn btn-primary btn-block">Launch Request</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return <ApiResponse response={response} url={this.state.url} httpMethod={this.state.httpMethod} />
    }
  }
}

ApiRequest.defaultProps = {
  formURL: '/api_requests/build'
}

