import React, { Component } from "react";
import {
  Container,
  Nav,
  PinListPage,
  AddPinPage,
  Spinner
} from "apollo-subscription-example-components";
import gql from "graphql-tag";
import { ApolloProvider, Query, Mutation } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WS_URI,
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    wsLink,
    new HttpLink({
      uri: process.env.REACT_APP_API_URI,
      credentials: "same-origin"
    })
  ]),
  cache: new InMemoryCache()
});

const PINS_QUERY = gql`
  {
    pins {
      title
      link
      image
      id
    }
  }
`;

const PINS_SUBSCRIPTION = gql`
  subscription {
    pinAdded {
      title
      link
      image
      id
    }
  }
`;

const PinsQuery = ({ children }) => (
  <Query query={PINS_QUERY}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading)
        return (
          <div style={{ paddingTop: 20 }}>
            <Spinner show />
          </div>
        );
      if (error) return <p>Error :(</p>;
      const subscribeToMorePins = () => {
        subscribeToMore({
          document: PINS_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data || !subscriptionData.data.pinAdded)
              return prev;
            const newPinAdded = subscriptionData.data.pinAdded;

            return Object.assign({}, prev, {
              pins: [...prev.pins, newPinAdded]
            });
          }
        });
      };

      return children(data.pins, subscribeToMorePins);
    }}
  </Query>
);

const AddPinMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation AddPin($title: String!, $link: String!, $image: String!) {
        addPin(title: $title, link: $link, image: $image)
      }
    `}
  >
    {(addPin, { data, loading, error }) =>
      children(addPin, { data, loading, error })
    }
  </Mutation>
);

class App extends Component {
  componentDidMount() {
    this.props.subscribeToMorePins();
  }
  render() {
    return (
      <Container>
        <PinListPage pins={this.props.pins} />
        <AddPinMutation>
          {(addPin, { data, loading, error }) => (
            <AddPinPage
              addPin={({ title, link, image }) =>
                addPin({ variables: { title, link, image } })
              }
            />
          )}
        </AddPinMutation>
        <Nav />
      </Container>
    );
  }
}

export default () => (
  <ApolloProvider client={client}>
    <PinsQuery>
      {/* Wrap App with PinsQuery because we need to access subscribeToMorePins in componentDidMount */}
      {(pins, subscribeToMorePins) => (
        <App pins={pins} subscribeToMorePins={subscribeToMorePins} />
      )}
    </PinsQuery>
  </ApolloProvider>
);
