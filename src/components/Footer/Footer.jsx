import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          {/* <nav className="pull-left">
            <ul>
              <li>
                <a href="#pablo">Home</a>
              </li>
              <li>
                <a href="#pablo">Company</a>
              </li>
              <li>
                <a href="#pablo">Portfolio</a>
              </li>
              <li>
                <a href="#pablo">Blog</a>
              </li>
            </ul>
          </nav> */}
          <p className="copyright" style={{textAlign: "center"}}>
            &copy; {new Date().getFullYear()}{" "}
            <a href="#">
              Luis Sanchez
            </a>
            , Version 1.0.0
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
