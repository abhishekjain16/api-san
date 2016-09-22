import React from 'react';

const ApiRequestForm = (props) => {
  return (
    <div className="row">
      <div className="col-sm-6 col-sm-offset-3">
        <div className="row form-controls text-center">
          <form method="POST" action={props.formURL}>
            <div className="form-group">
              <div className="row text-center">
                <label htmlFor="url">
                  Destination URL
                </label>
              </div>
              <div className="row">
                <input type="text"
                   className="form-control required"
                   name="url"
                   placeholder="Enter destination URL" />
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <label htmlFor="username">
                  Authentication Basic
                </label>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <input type="text"
                     className="form-control"
                     name="auth[username]"
                     placeholder="Enter username" />
                </div>
                <div className="col-sm-6">
                  <input
                     type="text"
                     className="form-control"
                     name="auth[password]"
                     placeholder="Enter password" />
                </div>
              </div>
            </div>
            <div className="form-buttons row">
              <div className="col-sm-5">
                <button type="submit" className="btn btn-primary btn-block">
                  Launch Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

ApiRequestForm.defaultProps = {
  formURL: '/api_responses',
};

export default ApiRequestForm;
