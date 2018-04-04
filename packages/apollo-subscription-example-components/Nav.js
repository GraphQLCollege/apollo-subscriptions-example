import React from "react";
import {
  Link,
  withRouter
} from "react-router-dom";
import { Icon } from "gestalt";

import "./Nav.css";

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to="/">
          <button>
            <Icon
              accessibilityLabel="Home"
              icon="pinterest"
              size="40"
              color={this.props.location.pathname === "/" ? "red" : "gray"}
            />
          </button>
        </Link>
        <Link to="/upload-pin">
          <button>
            <Icon
              accessibilityLabel="Upload a pin"
              icon="add-circle"
              size="40"
              color={
                this.props.location.pathname === "/upload-pin"
                  ? "darkGray"
                  : "gray"
              }
            />
          </button>
        </Link>
      </nav>
    );
  }
}

Nav = withRouter(Nav);

export default Nav;