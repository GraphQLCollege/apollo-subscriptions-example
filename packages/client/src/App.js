import React, { Component } from "react";
import {
  Container,
  Nav,
  PinListPage,
  AddPinPage
} from "apollo-subscription-example-components";

class App extends Component {
  state = { pins: this.props.pins || [] };
  render() {
    return (
      <Container>
        <PinListPage pins={this.state.pins} />
        <AddPinPage
          addPin={pin => {
            this.setState(({ pins }) => ({ pins: pins.concat([pin]) }));
          }}
        />
        <Nav />
      </Container>
    );
  }
}

export default App;
