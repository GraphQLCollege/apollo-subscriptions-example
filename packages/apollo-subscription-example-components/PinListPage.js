import React from "react";
import { Link } from "react-router-dom";
import randomColor from "randomcolor";
import { Route } from "react-router-dom";

import "./PinListPage.css";

function stringToColor(str) {
  return randomColor({
    seed: str
  });
}

class PinListPage extends React.Component {
  componentDidUpdate({ pins }) {
    if (
      this.props.pins.length !== pins &&
      this.lastElement &&
      pins.length !== 0 // Only scroll on updates. Don't scroll in the first request
    ) {
      this.lastElement.scrollIntoView({ behavior: "smooth" });
    }
  }
  render() {
    if (!this.props.match) {
      return null;
    }
    return (
      <div>
        {this.props.pins.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: 30
            }}
          >
            <div>There are no pins yet.</div>
            <Link to="/upload-pin">Create the first one</Link>
          </div>
        )}
        <ul className="pins">
          {this.props.pins.map((pin, index) => (
            <li
              className="pin"
              key={index}
              ref={element => {
                if (element && index === this.props.pins.length - 1) {
                  this.lastElement = element;
                }
              }}
            >
              <a href={pin.link} target="_blank">
                <img
                  src={pin.image}
                  alt={pin.title}
                  onError={event => {
                    event.target.src = `http://via.placeholder.com/200x200/${stringToColor(
                      pin.link
                    ).replace("#", "")}?text= +`;
                  }}
                />
                <h4 className="title">{pin.title}</h4>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ({ pins = [] }) => (
  // Render PinListPage as children instead of using react router's render or component props
  // The reason is that those other options mount/unmount the component, which would not trigger componentDidUpdate
  <Route exact path="/">
    {({ match }) => <PinListPage pins={pins} match={match} />}
  </Route>
);
