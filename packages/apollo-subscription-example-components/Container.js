import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "gestalt/dist/gestalt.css";
import "./Container.css";

export default class Container extends React.Component {
  render() {
    const AppRouter = this.props.noRouter ? React.Fragment : Router;
    return (
      <AppRouter>
        <div className="App">{this.props.children}</div>
      </AppRouter>
    );
  }
}
