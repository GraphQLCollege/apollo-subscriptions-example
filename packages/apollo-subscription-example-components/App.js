import React from "react";

import Container from "./Container";
import Nav from "./Nav";
import PinListPage from "./PinListPage";
import AddPinPage from "./AddPinPage";

export class App extends React.Component {
  render() {
    return (
      <Container noRouter={this.props.noRouter}>
        <PinListPage pins={this.props.pins} />
        <AddPinPage addPin={this.props.addPin} />
        <Nav />
      </Container>
    );
  }
}
