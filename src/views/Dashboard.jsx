import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from 'axios'

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

import '../styles/dashboard.css'

const thArray = ["NOMBRE","PRECIO","PESO","CATEGORIA", "ESTADO", "CREADO EL"];

const thArrayEvents = ["CODIGO","Evento","Tipo"];

const tdArray = [
  [ "1" , "Relog Antiguo" , "$100" , "ACTIVO" , ] ,
  [ "2" , "Relog Coleccion" , "$300" , "ACTIVO" , ] ,
  [ "3" , "Relog de Oro" , "$500" , "EN BOBEDA" ,  ]
];

const tdArrayEvents = [
  [ "1" , "Acesso autorizado con la vitrina 2452 por Juan" , "Notificacion" , ] ,
  [ "2" , "Acceso denegado a usuario desconodio en la vitirina 4548" , "Alerta" , ] ,  
];

var legendPIE = {
  names: ["Notificacion", "Alerta"],
  types: ["info", "danger", "warning"]
};

class Dashboard extends Component {

  constructor(props) {
    super(props);
    // this.socket = io.connect('http://localhost:3010');
    this.state = {
      data: [],
      dataEvents: [],
    };
  }

  componentDidMount = () =>{
    this.getInventory();
    this.fetchEvents()
  }

  
  getInventory = async() => {
    try {
      await axios
    .get('http://localhost:3010/getInventory')
    .then(res => {
      if (res.data.response) {
        this.setState({
          data: res.data.data
        })
      }else{
        this.setState({
          error_message: res.data.message
        })
      }
    })
    } catch (error) {
      console.log(error)
    }
  }

  fetchEvents = async() => {
    await axios
    .get("http://localhost:3010/getEvents")
    .then(res => {
      console.log(res.data)
      console.log("prueba")
        this.setState({
          dataEvents: res.data.arrayEvents
        })
    })
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          {/* <Row> */}
            {/* <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Capacity"
                statsValue="105GB"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col> */}
            {/* <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Revenue"
                statsValue="$1,345"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Errors"
                statsValue="23"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last hour"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Followers"
                statsValue="+45"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col> */}
          {/* </Row> */}
          <Row>
            
            <Col md={6}>
              {/* <h2 className="subtitleH2">Vitrinas Activas</h2>
              <Card
                // statsIcon={<i className="fa fa-refresh" />}
                id="chartHours"
                title="Vitrina #23644"
                category="Activa"
                stats="Updated 3 minutes ago"
                content={
                  <div>
                    <p>Items Asignado: 1</p>
                    <p>Items Asignado: 1</p>
                  </div>
                }
              /> */}
              <h2 className="subtitleH2">Lista de Inventario</h2>    
              <div className="card">          
              <Table striped hover>
                  <thead>
                    <tr>                    
                      {thArrayEvents.map((prop, key) => {
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.data.map((prop, key) => {
                      const date = new Date(prop.createdAt)
                      const formatDay = date.getDay()+ "/" +date.getDate() + "/" + date.getFullYear()

                      return (
                        <tr key={key}>                            
                          <td>{prop.name.toUpperCase()}</td>
                          <td>{prop.price+"$"}</td>                            
                          <td>{prop.peso+"g"}</td>                            
                          <td>{prop.category.toUpperCase()}</td>                            
                          <td>{prop.status.toUpperCase()}</td>                            
                          <td>{formatDay}</td>                                                        
                        </tr>
                      );

                    })}
                  </tbody>
                </Table> 
              </div>          
            </Col>
            <Col md={6}>
              <h2 className="subtitleH2">Ultimos Eventos Registrados</h2>
              <Card
                // statsIcon={<i className="fa fa-refresh" />}
                id="chartHours"
                title="Ultimos 10 Eventos"                
                stats="Updated 3 minutes ago"
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArrayEvents.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.dataEvents.map((prop, key) => {                        
                        if (key > 9) {
                          return null
                        }
                        const date = new Date(prop.createdAt)
                        const formatDay = date.getDay()+ "/" +date.getDate() + "/" + date.getFullYear()
                        const hour = date.getHours()+":"+date.getMinutes()
                        return (
                          <tr key={key}>
                            <td>{prop.codigo}</td>                            
                            <td>{prop.description}</td>
                            <td>{prop.type}</td>                            
                          </tr>
                        );

                      })}
                    </tbody>
                  </Table>  
                }
                legend={
                  <div className="legend">{this.createLegend(legendPIE)}</div>
                }
              />
            </Col>
            {/* <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Email Statistics"
                category="Last Campaign Performance"
                stats="Campaign sent 2 days ago"
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              />
            </Col> */}
          </Row>

        </Grid>
      </div>
    );
  }
}

export default Dashboard;
