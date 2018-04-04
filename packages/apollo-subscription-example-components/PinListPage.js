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
  render() {
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
            <li className="pin" key={index}>
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
  <Route exact path="/" render={() => <PinListPage pins={pins} />} />
);
