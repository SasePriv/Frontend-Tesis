import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import NotificationSystem from "react-notification-system";
import io from 'socket.io-client'
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.jsx";
import {Redirect} from 'react-router-dom'
import axios from 'axios'

import { style } from "variables/Variables.jsx";

import routes from "routes.js";

import image from "assets/img/sidebar-3.jpg";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.socket = io.connect('http://localhost:3010');
    this.state = {
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open",
      redirect: false,
      eventStatus: "",
      openDoor: false,
      closeDoor: false
    };
  }
  handleNotificationClick = position => {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
          every web developer.
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  };

  onClickStartInventoyBtn = () =>{    
    this.socket.emit('grams', {message: "requiriendo peso"});
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component
                {...props}
                handleClick={this.handleNotificationClick}
                onClickStartInventoyBtn={this.onClickStartInventoyBtn()}
                eventEstado={this.state.eventStatus}
              />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show-dropdown open" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  componentDidMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    var _notificationSystem = this.refs.notificationSystem;
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    // _notificationSystem.addNotification({
    //   title: <span data-notify="icon" className="pe-7s-gift" />,
    //   message: (
    //     <div>
    //       Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
    //       every web developer.
    //     </div>
    //   ),
    //   level: level,
    //   position: "tr",
    //   autoDismiss: 15
    // });

    this.activateArduino()
  
    this.socket.on('ifArduino', data => {      
      sessionStorage.setItem('arduinoInfo', JSON.stringify(data));
    })    


    //Recibe el evento y lo muestra por notificacion 
    this.socket.on('Event', data => {
      const eventData = data.data;
      const eventStatus = data.eventStatus;
      const notifi = {}
      switch(eventData.type){
        case "alerta":
          notifi.level =  "error"
          notifi.icon = "pe-7s-shield"
          break
        case "acceso":
          notifi.level =  "success"
          notifi.icon = "pe-7s-check"
          break
        case "aviso":
          notifi.level = "warning"
          notifi.icon = "pe-7s-attention"
          break
      }

      _notificationSystem.addNotification({
        title: <span data-notify="icon" className={notifi.icon} />,
        message: (
          <div>
            {eventData.description}
          </div>
        ),
        level: notifi.level,
        position: "tr",
        autoDismiss: 120
      });

      this.setState({
        eventStatus: eventStatus
      })

    })

    this.socket.on('turnOffEvent', data => {
      this.setState({
        eventStatus: data
      })
    })

  }

  activateArduino = async() =>{
    await axios
    .get("http://localhost:3010/arduino")
    .then(res => {
      if (res.data.response) {
        console.log("Iniciado")
      }else{
        console.log("no iniciado o se encuentra")
      }
    })
  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }

  UNSAFE_componentWillMount = () =>{
    if (!sessionStorage.getItem("userData")) {
        this.setState({
            redirect: true
        })
    }
  }

  handleLogout = () => {
    sessionStorage.setItem("userData",'')
    sessionStorage.clear()
    this.setState({
      redirect: true
    })
  }

  render() {

    if (this.state.redirect) {
      return (<Redirect to="/login" />)
    }  


    return (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar {...this.props} routes={routes} image={this.state.image}
        color={this.state.color}
        hasImage={this.state.hasImage}        
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
            handleLogout={this.handleLogout}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer />
          {/* <FixedPlugin
            handleImageClick={this.handleImageClick}
            handleColorClick={this.handleColorClick}
            handleHasImage={this.handleHasImage}
            bgColor={this.state["color"]}
            bgImage={this.state["image"]}
            mini={this.state["mini"]}
            handleFixedClick={this.handleFixedClick}
            fixedClasses={this.state.fixedClasses}
          /> */}
        </div>
      </div>
    );
  }
}

export default Admin;
