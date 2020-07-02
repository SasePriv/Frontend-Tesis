import React, { Component } from "react";
import { Grid, Row, Col, Table, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import io, { connect } from 'socket.io-client';
import Card from "components/Card/Card.jsx";
import axios from 'axios'
import { times } from "chartist";

const thArray = ["CODIGO","TITULO","DESCRIPCION","TIPO","FECHA", "HORA" , "Revisado"];
const tdArray = [
  [ "50" , "Acceso Permitido" , "Acceso permitido a la vitrina 23545 por Juan" , "Notificacion", "10/02/20" , "9:30AM"] ,
  [ "30" , "Acceso Denegado" , "Acceso denegado a la vitrina 21484 por personal desconocido" , "Alerta de Seguridad" , "22/05/20", "9:30AM"] ,
  [ "60" , "Alerta de Seguridad" , "Se ha abierto la puerta de la vitrina 15484 sin previa autorizacion" , "Alerta de Seguridad" , "22/05/20", "9:30AM" ]
];

const edit = (<Tooltip id="edit_tooltip">Edit Task</Tooltip>);
const remove = (<Tooltip id="remove_tooltip">Remove</Tooltip>);

class Eventos extends Component {

  constructor(){
    super();
    this.socket = io.connect('http://localhost:3010');
    this.state = {
      data: []
    }
  }

  componentDidMount = () => {
    this.fetchEvents()
  }

  fetchEvents = async() => {
    await axios
    .get("http://localhost:3010/getEvents")
    .then(res => {
      console.log(res.data)
      console.log("prueba")
        this.setState({
          data: res.data.arrayEvents
        })
    })
  }

  handleClickReview = async (event_id) =>{
    console.log(event_id)
    const status = {
      status: true
    }
    await axios
    .post("http://localhost:3010/changeStatusEvents/"+event_id, status)
    .then(res => {
      console.log("asdasdasdas")
      console.log(res.data)
      if (res.data.response) {
        this.fetchEvents()
      }else{
        console.log("Error al cambiar el estado")
      }
    })
  }

  render() {
    console.log(this.state)
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Ultimos Eventos"
                category="Todos los eventos registrados se encuentran aqui"
                ctTableFullWidth
                ctTableResponsive                
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map((prop, key) => {                        
                        if (key > 4) {
                          return null
                        }
                        const date = new Date(prop.createdAt)
                        const formatDay = date.getDay()+ "/" +date.getDate() + "/" + date.getFullYear()
                        const hour = date.getHours()+":"+date.getMinutes()
                        return (
                          <tr key={key}>
                            <td>{prop.codigo}</td>
                            <td>{prop.title}</td>
                            <td>{prop.description}</td>
                            <td>{prop.type}</td>
                            <td>{formatDay}</td>
                            <td>{hour}</td>
                            <td>
                              <input onClick={() => this.handleClickReview(prop._id)} {...prop.reviewed ? {checked: "checked"} : null} {...prop.reviewed ? {disabled: "disabled"} : null}  type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                            </td>
                          </tr>
                        );

                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
        <div></div>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Eventos Sin Revisar"
                category="Todos los eventos que no han sido revisado apareceran aqui"
                ctTableFullWidth
                ctTableResponsive                
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map((prop, key) => {                        
                        if (prop.reviewed) {
                          return null
                        }
                        console.log("1232")
                        console.log(prop.reviewed)
                        const date = new Date(prop.createdAt)
                        const formatDay = date.getDay()+ "/" +date.getDate() + "/" + date.getFullYear()
                        const hour = date.getHours()+":"+date.getMinutes()
                        return (
                          <tr key={key}>
                            <td>{prop.codigo}</td>
                            <td>{prop.title}</td>
                            <td>{prop.description}</td>
                            <td>{prop.type}</td>
                            <td>{formatDay}</td>
                            <td>{hour}</td>
                            <td>
                              <input onClick={() => this.handleClickReview(prop._id)} {...prop.reviewed ? {checked: "checked"} : null} type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                            </td>
                          </tr>
                        );

                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Eventos Revisados"
                category="Todos los eventos que hayan sido revisados apareceran aqui"
                ctTableFullWidth
                ctTableResponsive                
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map((prop, key) => {                        
                        if (!prop.reviewed) {
                          return null
                        }
                        const date = new Date(prop.createdAt)
                        const formatDay = date.getDay()+ "/" +date.getDate() + "/" + date.getFullYear()
                        const hour = date.getHours()+":"+date.getMinutes()
                        return (
                          <tr key={key}>
                            <td>{prop.codigo}</td>
                            <td>{prop.title}</td>
                            <td>{prop.description}</td>
                            <td>{prop.type}</td>
                            <td>{formatDay}</td>
                            <td>{hour}</td>
                            <td>
                              <input disabled onClick={() => this.handleClickReview(prop._id)} {...prop.reviewed ? {checked: "checked"} : null} type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                            </td>
                          </tr>
                        );

                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Eventos;
