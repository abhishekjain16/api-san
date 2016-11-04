import React from 'react';
import uuid from 'uuid';
import ApiRequestForm from './index';

class HashData {
  static parse(data) {
    const keys = Object.keys(data);

    const finalData = keys.map((key) => {
      const hash = {};
      hash.key = key;
      hash.value = data[key];
      hash.id = uuid.v1();
      return hash;
    });

    return finalData;
  }
}

export default class EditApiRequest extends React.Component {
  componentDidMount() {
    const token = this.props.params.token;
    const url = `/api_responses/${token}`;

    fetch(url)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          url: data.url,
          method: data.httpMethod,
          request_body: data.requestBody,
          username: data.username,
          password: data.password,
          showAuthentication: (data.username && data.username.length > 0 && data.password && data.password.length > 0 && true),
          request_params: HashData.parse(data.requestParams),
          request_headers: HashData.parse(data.requestHeaders),
        });
      });
  }

  render() {
    if (this.state) {
      return (
          <ApiRequestForm {...this.state} />
      );
    } else {
      return false;
    }
  }
}
