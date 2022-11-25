import React, { Component } from "react";
import "./App.css";
import EventList from "./Eventlist";
import EventGenre from "./EventGenre";
import CitySearch from "./Citysearch";
import NumberOfEvents from "./NumberOfEvents";
import { extractLocations, getEvents, checkToken, getAccessToken } from "./Api";
import { OffLineAlert } from "./Alert";
import "./nprogress.css";
import WelcomeScreen from "./WelcomeScreen";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

class App extends Component {
  state = {
    events: [],
    eventsOriginal: [],
    locations: [],
    numberOfEvents: 32,
    locationSelected: "all",
    showWelcomeScreen: undefined,
    scatterData: null
  };

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem("access_token");
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    this.setState({ showWelcomeScreen: !(code || isTokenValid) });
    if ((code || isTokenValid) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          let sliceNumber = events.length;
          this.setState({
            locations: extractLocations(events),
            events: events.slice(0, sliceNumber),
            eventsOriginal: events
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents = (location, maxNumberEvents) => {
    if (maxNumberEvents === undefined) {
      maxNumberEvents = this.state.numberOfEvents;
    } else this.setState({ numberOfEvents: maxNumberEvents });
    if (location === undefined) {
      location = this.state.locationSelected;
    }
    getEvents().then((events) => {
      let locationEvents =
        location === "all"
          ? events
          : events.filter((event) => event.location === location);
      this.setState({
        events: locationEvents.slice(0, maxNumberEvents),
        numberOfEvents: maxNumberEvents,
        locationSelected: location,
        eventsOriginal: events
      });
    });
  };
  //
  // updateNumberEvents = (numberOfEvents) => {
  //   this.setState({
  //     numberOfEvents,
  //   });
  //   this.updateEvents(undefined, numberOfEvents);
  // };

  sliceEvents = (count) =>{
    return this.setState({ events: this.state.eventsOriginal.slice(0, count) });
  };

  getData = (location) => {
    if(location && location=='all'){
      location = null;
    }
    const { locations, events } = this.state;
    let data=null;
    try{
      data = (location ? [location] : locations).map((location) => {
        const number = events.filter(
          (event) => event.location === location
        ).length;
        const city = location.split(", ").shift();
        return { city, number };
      });
    }catch(e){
    }
    return data;
  };

  render() {
    if (this.state.showWelcomeScreen === undefined)
      return <div className="App" />;
    return (
      <div className="App">
        <WelcomeScreen
          showWelcomeScreen={this.state.showWelcomeScreen}
          getAccessToken={() => {
            getAccessToken();
          }}
        />
        <div className="offlineAlert">
          {!navigator.onLine && (
            <OffLineAlert text={"You are currently offline!"} />
          )}
        </div>

        <h1>Come and see what's going on</h1>

        <CitySearch
          locations={this.state.locations}
          updateEvents={this.updateEvents}
        />
        <NumberOfEvents
          sliceEvents={this.sliceEvents}
          numberOfEvents={this.state.events.length}
          maxEvents={this.state.numberOfEvents}
        />
        <div className="data-vis-wrapper">
          <div className="pie-wrapper">
            <EventGenre events={this.state.events} />
          </div>
          <div className="scatter-wrapper">
            <ResponsiveContainer>
              <ScatterChart
                width={400}
                height={400}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid />
                <XAxis type="category" dataKey="city" name="City" />
                <YAxis
                  type="number"
                  dataKey="number"
                  name="Number of events"
                  allowDecimals={false}
                />

                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={this.getData(this.state.locationSelected)} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <EventList events={this.state.events} />
      </div>
    );
  }
}

export default App;
