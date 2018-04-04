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
    new HttpLink({
      uri: "http://localhost:3001/graphql",
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

const PinsQuery = ({ children }) => (
  <Query query={PINS_QUERY}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <div style={{ paddingTop: 20 }}>
            <Spinner show />
          </div>
        );
      if (error) return <p>Error :(</p>;

      return children(data.pins);
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
    refetchQueries={[{ query: PINS_QUERY }]}
  >
    {(addPin, { data, loading, error }) =>
      children(addPin, { data, loading, error })
    }
  </Mutation>
);

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Container>
          <PinsQuery>{pins => <PinListPage pins={pins} />}</PinsQuery>
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
      </ApolloProvider>
    );
  }
}

export default App;
