import React, { Component } from "react";
import { ErrorAlert } from "./Alert";

class NumberOfEvents extends Component {
  state = {
    numberOfEvents: this.props.maxEvents,
    errorText: "",
  };

  handleInputChanged = (event) => {
    const value = event.target.value;
    if(!value){
      this.props.sliceEvents(32);
      return this.setState({ numberOfEvents: '', errorText: "" });
    }

    if (value > 0 && value <= this.props.maxEvents) {
      this.props.sliceEvents(value);
      return this.setState({ numberOfEvents: value, errorText: "" });
    } else {
      this.props.sliceEvents(this.props.maxEvents);
      return this.setState({
        numberOfEvents: this.props.maxEvents,
        errorText: "Select number from 1 to "+this.props.maxEvents,
      });
    }
  };

  render() {
    return (
      <div className="numberOfEvents">
        <input
          type="number"
          id="default"
          className="default"
          placeholder="Enter no of events"
          value={this.state.numberOfEvents}
          onChange={this.handleInputChanged}
        />
        <ErrorAlert text={this.state.errorText} />
      </div>
    );
  }
}

export default NumberOfEvents;
