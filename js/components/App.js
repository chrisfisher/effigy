import React, { Component } from 'react';
import Relay from 'react-relay';
import AddLocationMutation from '../mutations/AddLocationMutation';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: ''
    }
  }

  render() {
    return (
      <div>
        <h1>Locations</h1>
        <input 
          type={'text'}
          placeholder={'Add location...'}
          value={this.state.location}
          onChange={event => { this.setState({location: event.target.value}); }}
        />
        <input 
          type={'button'}
          value={'Add'}
          onClick={this._addLocation}
        />
        <ul>
          {this.props.viewer.locations.edges.map(this._renderLocation)}
        </ul>        
      </div>
    );
  }

  _renderLocation = ({ node }) => (
    <li key={node.id} style={{margin: '10px'}}>
      <div>{node.title}</div>
      <div>{this._renderCreatedDate(node.createdDate)}</div>           
    </li>
  );

  _renderCreatedDate = date => (new Date(date)).toString();

  _addLocation = () => {
    this.props.relay.commitUpdate(
      new AddLocationMutation({
        viewer: this.props.viewer,
        title: this.state.location,        
      })
    );

    this.setState({location: ''});
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    limit: -1 >>> 1,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        locations(first: $limit) {
          edges {
            node {
              id,
              title,
              createdDate,
            }
          }
        },
        ${AddLocationMutation.getFragment('viewer')}
      }
    `,
  },
});