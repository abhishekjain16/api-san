import React from 'react';
import { Link } from 'react-router';

class ParsedJSONResponse extends React.Component {
  constructor() {
    super();
    this.toggleParsedJSON = this.toggleParsedJSON.bind(this);
    this.formatJsonView = this.formatJsonView.bind(this);
    this.jsonData = this.jsonData.bind(this);
    this.state = {
      showFormattedJson: true,
    };
  }

  componentDidMount() {
    this.formatJsonView();
  }

  componentDidUpdate() {
    const jsonResponse = this.jsonResponse;
    this.formatJsonView();
    jsonResponse.scrollIntoView();
  }

  toggleParsedJSON(event) {
    event.preventDefault();
    this.setState({
      showFormattedJson: !this.state.showFormattedJson,
    });
  }

  formatJsonView() {
    const formattedJSON = this.formattedJSON;
    /*eslint-disable */
    $(formattedJSON).html('');
    $(formattedJSON).jsonView(this.jsonData(), { collapsed: true, nl2br: true });
    /*eslint-enable */
  }

  jsonData() {
    return JSON.parse(this.props.body);
  }

  render() {
    const rawJson = JSON.stringify(this.jsonData());
    return (
      <div ref={(node) => { this.jsonResponse = node; }}>
        <Link className="btn" onClick={this.toggleParsedJSON}>
          { this.state.showFormattedJson ? 'View raw' : 'View formatted' }
        </Link>
        <pre className="api-res__res" style={Styles.parsedJSON}>
          { this.state.showFormattedJson ? <div ref={(node) => { this.formattedJSON = node; }} /> : rawJson }
        </pre>
      </div>
    );
  }
}

const Styles = {
  parsedJson: { backgroundColor: 'initial' },
};

export default ParsedJSONResponse;
