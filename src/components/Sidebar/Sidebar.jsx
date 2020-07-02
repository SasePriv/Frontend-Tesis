import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import io from 'socket.io-client'

import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.jsx";

import logo from "assets/logo.png";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.socket = io.connect('http://localhost:3010');
    this.state = {
      width: window.innerWidth,
      event: "",
      eventStatus: false
    };
  }
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    this.socket.on('Event', data => {
      const eventStatus = data.eventStatus;
      this.setState({
        event: data.data,
        eventStatus
      })
    })

    this.socket.on('turnOffEvent', data => {
      this.setState({
        eventStatus: data
      })
    })
  }
  render() {
    const sidebarBackground = {
      backgroundImage: "url(" + this.props.image + ")"
    };
    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color={this.props.color}
        data-image={this.props.image}
      >
          {this.props.hasImage ? (
            <div className="sidebar-background" style={sidebarBackground} />
          ) : (
            null
          )}
        <div className="logo">
          <a
            href="#"
            className="simple-text logo-mini"
            style={{padding: "0px"}}
          >
            <div className="logo-img">
              <img src={logo} alt="logo_image" />
            </div>
          </a>
          <div
            // href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-normal"
          >
            DIAMANT
          </div>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            {this.state.width <= 991 ? <AdminNavbarLinks /> : null}
            {this.props.routes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li
                    className={
                      prop.upgrade
                        ? "active active-pro"
                        : this.activeRoute(prop.layout + prop.path)
                    }
                    key={key}
                  >
                    <NavLink
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <p style={{display: "contents"}}>{prop.name}</p>
                      {prop.name.toUpperCase() == "VITRINAS" && this.state.eventStatus && this.state.event.type == "alerta"
                      ?
                        <i className="pe-7s-attention" style={{position: "absolute", right: "0px", color: "red"}} />
                      : 
                      null
                      }
                    </NavLink>
                  </li>
                );
              return null;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
