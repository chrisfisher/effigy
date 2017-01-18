import Relay from 'react-relay';

export default class AddLocationMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer { id }`,
  };
  
  getMutation() {
    return Relay.QL`mutation { addLocation }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddLocationPayload @relay(pattern: true) {
        viewer {
          locations
        },
        locationEdge
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'locations',
      edgeName: 'locationEdge',
      rangeBehaviors: {
        '' : 'append'
      },
    }];
  }

  getVariables() {
    return {
      title: this.props.title,
    };
  }
  
  getOptimisticResponse() {
    const { viewer, title } = this.props;
    
    return {
      viewer: {
        id: viewer.id,
      },
      locationEdge: {
        node: {
          createdDate: (new Date()).toISOString(),
          title,
        },
      },
    };
  }
}