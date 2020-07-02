
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import avatar from "assets/img/faces/face-3.jpg";
import '../styles/userProfile.css'

class UserProfile extends Component {

  onCambio = () => {
    console.log("a");
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Edit Profile"
                content={
                  <form className="form-profile">
                    <Row>
                      <Col md={4}>
                        <label>Nombre</label>
                      </Col>
                      <Col md={4}>                      
                        <label>Email</label>
                      </Col>
                      <Col md={4}>                      
                        <label>Usuario</label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <input type="text" name="text" value="Luis Sanchez" />
                      </Col>
                      <Col md={4}>
                        <input type="email" name="email" value="mr.peewi@gmail.com" />
                      </Col>
                      <Col md={4}>
                        <input type="text" name="user" value="mrpeewi" />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <label>Nueva Contraseña</label>
                      </Col>
                      <Col md={6}>
                        <label>Confirmar Contraseña</label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <input type="password" name="pass2" value="mrpeewi" />
                      </Col>
                      <Col md={6}>
                        <input type="password" name="pass" value="mrpeewi" />
                      </Col>
                    </Row>
                    {/* <FormInputs
                      ncols={["col-md-5", "col-md-3", "col-md-4"]}
                      properties={[
                        {
                          label: "Company (disabled)",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Company",
                          defaultValue: "Creative Code Inc.",
                          disabled: true,                          
                        },
                        {
                          label: "Username",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Username",
                          defaultValue: "michael23",
                          onChange: {onChange: this.onCambio()}
                        },
                        {
                          label: "Email address",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email"
                        }
                      ]}
                    />
                    <FormInputs                      
                      ncols={["col-md-6", "col-md-6"]}
                      properties={[
                        {
                          label: "First name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "First name",
                          defaultValue: "Mike"
                        },
                        {
                          label: "Last name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Last name",
                          defaultValue: "Andrew",
                        }                        
                      ]}                      
                    /> */}
                    <Button bsStyle="primary" className="btn-submit" pullRight fill type="submit">
                      Update Profile
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            <Col md={4}>
              <UserCard
                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                avatar={avatar}
                name="Mike Andrew"
                userName="michael24"
                description={
                  <span>
                    "Lamborghini Mercy
                    <br />
                    Your chick she so thirsty
                    <br />
                    I'm in that two seat Lambo"
                  </span>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
