import React, { Component } from "react";

class Event extends Component {
  state = {
    buttonCollapsed: true,
  };

  handleShowDetails() {
    this.setState({ buttonCollapsed: !this.state.buttonCollapsed });
  }

  collapsedEvent = () => {
    if (this.state.buttonCollapsed === false) {
      return (
        <div className="event-details">
          <div className="description">
            <h3>Description</h3>
            <em dangerouslySetInnerHTML={{__html: this.props.event.description}}></em>
          </div>
          <div className="creator">
            <h4>e-mail:</h4>
            <p>{this.props.event.creator.email}</p>
          </div>
          <h4>Date and Time:</h4>
          <div className="start">
            <p>{this.props.event.start.dateTime}</p>
          </div>
          <div className="end">
            <p>{this.props.event.end.dateTime}</p>
          </div>
        </div>
      );
    }
  };

  btnText = () => {
    return `${this.state.buttonCollapsed ? "show" : "hide"} details`;
  };

  render() {
    // console.log(this.props.event);
    return (
      // 1-7
      <div className="event-visible">
        <h2 className="summary">{this.props.event.summary}</h2>
        <h3 className="location">{this.props.event.location}</h3>
        {this.collapsedEvent()}
        <button
          onClick={() => this.handleShowDetails()} // 10b & 11b
          className="btn-details" // 8
        >
          {this.btnText()}
        </button>
      </div>
    );
  }
}

export default Event;
