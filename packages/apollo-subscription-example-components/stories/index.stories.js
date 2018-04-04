import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { MemoryRouter } from "react-router-dom";

import { App as PinApp } from "../App";

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      pins: props.pins || []
    };
  }

  render() {
    return (
      <PinApp
        {...this.props}
        pins={this.state.pins}
        addPin={pin => {
          this.setState(({ pins }) => ({ pins: pins.concat([pin]) }));
        }}
      />
    );
  }
}

const pins = [
  {
    title: "Modern",
    link: "https://pinterest.com/pin/637540890973869441/",
    image:
      "https://i.pinimg.com/564x/5a/22/2c/5a222c93833379f00777671442df7cd2.jpg"
  },
  {
    title: "Broadcast Clean Titles",
    link: "https://pinterest.com/pin/487585097141051238/",
    image:
      "https://i.pinimg.com/564x/85/ce/28/85ce286cba63daf522464a7d680795ba.jpg"
  },
  {
    title: "Drawing",
    link: "https://pinterest.com/pin/618611698790230574/",
    image:
      "https://i.pinimg.com/564x/00/7a/2e/007a2ededa8b0ce87e048c60fa6f847b.jpg"
  }
];

storiesOf("App", module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
  ))
  .add("lists pins", () => <App pins={pins} noRouter />)
  .add("add pin", () => <App noRouter />);
