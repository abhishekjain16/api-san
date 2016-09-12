class ApiRequestForm extends React.Component {
  render () {
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="row form-controls text-center">
            <form onSubmit={this.props.handleSubmit}>
              <div className="form-group">
                <div className="row text-center">
                  <label>
                    Destination URL
                  </label>
                </div>
                <div className="row">
                  <input type="text" className="form-control required" name="url" onChange={this.props.handleChange} placeholder="Enter destination URL" />
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
                    <input type="text" className="form-control" name="username" onChange={this.props.handleChange} placeholder="Enter username" />
                  </div>
                  <div className="col-sm-6">
                    <input type="text" className="form-control" name="password" onChange={this.props.handleChange} placeholder="Enter password" />
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
    )
  }
}

