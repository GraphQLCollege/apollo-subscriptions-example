import React from "react";
import { Icon, Heading } from "gestalt";
import { Route } from "react-router-dom";

import "./AddPinPage.css";

class AddPinPage extends React.Component {
  state = {
    title: "",
    link: "",
    image: ""
  };
  render() {
    return (
      <div className="add-pin">
        <Heading size="md">Add pin</Heading>
        <form
          style={{ display: "grid", gridGap: 20 }}
          onSubmit={event => {
            this.setState({
              title: "",
              link: "",
              image: ""
            });
            this.props.addPin({
              title: this.state.title,
              link: this.state.link,
              image: this.state.image
            });
            this.props.history.push("/");
            event.preventDefault();
          }}
        >
          <input
            className="input"
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            placeholder="Title"
            type="text"
            required
            autoFocus
          />
          <input
            className="input"
            value={this.state.link}
            onChange={event => this.setState({ link: event.target.value })}
            placeholder="URL"
            type="url"
            required
          />
          <input
            className="input"
            value={this.state.image}
            onChange={event => {
              this.setState({
                image: event.target.value
              });
            }}
            placeholder="Image URL"
            type="url"
            required
          />
          <button type="submit">
            <Icon
              accessibilityLabel="Home"
              icon="pin"
              color="white"
              size="20"
            />Save
          </button>
        </form>
      </div>
    );
  }
}

export default ({ addPin = () => {} }) => (
  <Route
    path="/upload-pin"
    component={props => <AddPinPage {...props} addPin={addPin} />}
  />
);
