/**
 * ./data/schema.js
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Viewer,
  Location,
  getViewer,
  getLocations,
  getLocation,
  addLocation,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  globalId => {
    const {type, id} = fromGlobalId(globalId);    
    if (type === 'Viewer') {
      return getViewer(id);
    } else if (type === 'Location') {
      return getLocation(id);
    } else {
      return null;
    }
  },
  obj => {
    if (obj instanceof Viewer) {
      return viewerType;
    } else if (obj instanceof Location) {
      return locationType;
    } else {
      return null;
    }
  }
);

const locationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    id: globalIdField('Location'),
    title: {
      type: GraphQLString,
      description: 'The title of the location',
      resolve: value => value.title,
    },
    createdDate: {
      type: GraphQLString,
      description: 'The date the location entry was created',
      resolve: value => value.createdDate,
    },
  }),
  interfaces: [nodeInterface],
});

const { connectionType: locationsConnectionType, edgeType: locationEdgeType } =
  connectionDefinitions({ nodeType: locationType });

const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    id: globalIdField('Viewer'),
    locations: {
      type: locationsConnectionType,
      description: 'A list of locations',
      args: connectionArgs,
      resolve: (obj, args) => (
        connectionFromArray(getLocations(), args)
      ),
    },
  },
  interfaces: [nodeInterface],
});

const AddLocationMutation = mutationWithClientMutationId({
  name: 'AddLocation',
  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: getViewer,
    },
    locationEdge: {
      type: locationEdgeType,
      resolve: ({ locationId }) => {
        const location = getLocation(locationId);
        return {
          cursor: cursorForObjectInConnection(getLocations(), location),
          node: location,
        };
      },
    },
  },
  mutateAndGetPayload: ({ title }) => {
    const locationId = addLocation(title);
    return { locationId };
  },
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {    
    viewer: {
      type: viewerType,
      resolve: getViewer,
    },
    node: nodeField,
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addLocation: AddLocationMutation,
  },
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});