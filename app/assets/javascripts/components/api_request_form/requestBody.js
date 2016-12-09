import React from 'react';

export const AddRequestBody = ({ addBody }) => {
  return <a href="" onClick={event => addBody(event)} className="devise-links"> Add Request Body</a>;
};

export const RequestBody = ({ showRequestBody, handleChange, value, removeRequestBody }) => {
  if (!showRequestBody) { return <div />; }
  return (
    <div className="form-input">
      <div className="form-group__label">
        Request Body
        <a href="" className="devise-links" onClick={event => removeRequestBody(event)}>Remove Request Body</a>
      </div>
      <textarea name="request_body" placeholder="Enter Request Body" rows="8" cols="8" className="form-control api-req-form__textarea" onChange={event => handleChange(event)} value={value} />
    </div>
  );
};
