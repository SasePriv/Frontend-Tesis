import React, { Component } from "react";
import { Grid, Row, Col, Button, Modal } from "react-bootstrap";
import Select from "react-dropdown-select";
import Cards from "components/Card/Card";
import { iconsArray } from "variables/Variables.jsx";
import axios from 'axios'
import '../styles/vitrinas.css'
import ReactLoading from 'react-loading';
import io from 'socket.io-client';

//Modal 
function MyVerticallyCenteredModal(props) {

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered            
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Vitrina #258274
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="formModal">
         {props.hanfleForm()}      
      </Modal.Body>
      <Modal.Footer>
        {props.onHandleSubmitBtn()}
        <Button onClick={props.onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

// const optionArray = [
//   {id: 1 ,name: "Eduardo"},
//   {id: 2 ,name: "Fernandez"}
// ];

class Vitrinas extends Component {

  constructor(props) {
    super(props);
    this.socket = io.connect('http://localhost:3010');
    this.state = {
      modalShow: false,
      value: "",
      arduino: "",
      optionArray: [],
      selected: "",
      show: false,
      loading: false,
      showBtn: true,
      gramos: 0,
      sensors: {
        infrarrojo: "",
        puerta: ""
      },
      error_message: "",
      eventStatus: this.props.eventEstado, 
      event: ""
    };
  }

  componentDidMount = () => {    

    //Obteniendo la informacion del arduino
    if (sessionStorage.getItem("arduinoInfo")) {
      this.setState({
        arduino: JSON.parse(sessionStorage.getItem("arduinoInfo"))
      })
    }

    //Obteniendo inventario
    this.getInventory()

    //Recibiendo la confirmacion que el peso esta listo
    this.socket.on('peso', data =>{
      if (data.status == "ready") {
        this.setState({
          show: true,
          loading: false
        })
      }
    })

    //Recibe la informacion en vivo del peso
    this.socket.on('gramos', data => {
      this.setState({
        gramos: data
      })
    })

    //Recibiendo Informacion del arduino
    this.socket.on('ifArduino', data => {
      this.setState({
        arduino: data
      })
    })

    //Recibiendo Informacion del infrarrojo
    this.socket.on('infrarojo', data => {
      this.setState({
        sensors: {
          ...this.state.sensors,
          infrarrojo: parseInt(data)
        }
      })
    })

    //Informacion de la puerta
    this.socket.on('puerta', data => {
      this.setState({
        sensors: {
          ...this.state.sensors,
          puerta: data
        }
      })
    })

    //Recibiendo Informacion del evento 
    this.socket.on('Event', data => {
      const eventStatus = data.eventStatus;
      this.setState({
        event: data.data,
        eventStatus
      })
    })

    //Recibiendo apagar evento
    this.socket.on('turnOffEvent', data => {
      this.setState({
        eventStatus: data
      })
    })
  }

  //Obtener inventario
  getInventory = async() => {
    try {
      await axios
    .get('http://localhost:3010/getInventory')
    .then(res => {
      if (res.data.response) {
        console.log(res.data.data)
        this.setState({
          optionArray: res.data.data
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


  onClickStart = (e) =>{    
    console.log("click")
    const data = {message: "t"}
    this.socket.emit('passPeso', data);
    this.setState({loading: true, showBtn: false})
    
  }

  handleFormUsing = () => {
    // const arduino = this.state.arduino
    let gramos = parseFloat(this.state.gramos)
    if (gramos < 1.5 && gramos > 0 && gramos > -1) {
      gramos = 0;
    }

    return(
      <React.Fragment>
        <Row>
          <Col md={12}>
          <label className="labelModal">
            Inventario
          </label>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Select placeholder="Buscar" searchable={true} options={this.state.optionArray} labelField="name" valueField="name" onChange={(value) => this.setState({selected: value})} />
          </Col>
        </Row>     
        <Row>
          <Col md={12}>
          <label className="labelModal">
            Peso
          </label>
          <p className="subtitlePeso">
            Para comenzar haz click en el boton de abajo, despues espere unos segundos y una vez que diga listo ponga el objeto a pesar.
          </p>
          </Col>
        </Row>
        {this.state.showBtn
        ?
        <Row>
          <Col md={12} style={{textAlign: "center"}}>
            <Button onClick={() => this.onClickStart()} bsStyle="primary" className="btn-submit" pullRight fill type="submit" >
              Comenzar
            </Button>
          </Col>
        </Row>
        :
          null
        }        

        {this.state.loading
        ?
        <ReactLoading className="loading" type="spin" color="#3472F7" height={100} width={100} />
        :
        null
        }

        {this.state.show 
        ? 
        <Row>
          <Col md={12} className="peso">
            <h3>{this.state.selected ? this.state.selected[0].peso : 0}{"g | "+ gramos +"g"}</h3>
            <div className="waitTime">Ponga el objeto</div>            
          </Col>
        </Row> 
        :
        null
        } 
        <div style={{color: "red", marginTop: "10px"}}>{this.state.error_message}</div>
      </React.Fragment> 
    )
  }

  activationItem = () =>{
    const isValid = this.validateStart()

    if (isValid) {
      const form = {}
      form.itemObject = this.state.selected[0]
      form.itemId = form.itemObject._id
      form.status = true
      this.socket.emit('itemActivation', form)

      
      this.setState({modalShow: false})
    }
  }

  validateStart = () => {
    const selected = this.state.selected
    const infrarrojo = this.state.sensors.infrarrojo
    const puerta = this.state.sensors.puerta
    let gramos = parseFloat(this.state.gramos)
    if (gramos < 1.5 && gramos > 0 || gramos < 0 && gramos > -1) {
      gramos = 0;
    }

    console.log("infrarrojo: "+infrarrojo)
    console.log("puerta: "+puerta)

    if (selected == "") {
      this.setState({
        error_message: "Por favor seleccione algun producto del inventario"
      })
      return false
    }else{
      this.setState({
        error_message: ""
      })
    }

    if (gramos < 2 && infrarrojo == 1) {
      this.setState({
        error_message: "Por favor coloque un objeto sobre la pesa"
      })
      return false
    }else{
      this.setState({
        error_message: ""
      })
    }

    if (infrarrojo == 1) {
      this.setState({
        error_message: "Por favor coloque el objeto en el medio de la pesa"
      })
      return false
    }else{
      this.setState({
        error_message: ""
      })
    }

    if (puerta == 1) {
      this.setState({
        error_message: "Por favot mantenga la puerta cerrada para proceder"
      })
      return false
    }else{
      this.setState({
        error_message: ""
      })
    }

    return true

  }

  onHandleSubmitBtn = () =>{
    return(
      <Button bsStyle="primary" onClick={() => this.activationItem()}>Activar</Button>
    )
  }

  handleKick = () => {
    const form = {}
    form.itemObject = null
    form.itemId = ""
    form.status = false
    this.socket.emit('itemDesactive', form)

    this.setState({modalShow: false})
  }

  handleKickEvent = () => {
    const form = {}
    form.itemObject = null
    form.itemId = ""
    form.status = false
    form.eventStatus = false
    this.socket.emit('itemDesactiveEvent', form)

    this.setState({modalShow: false})
  }

  handleActualizarVitrina = async () => {
    await axios
    .get('http://localhost:3010/arduino')
    .then(res => {
      console.log("Actualizado")
    })
  }

  render() {

    const vitrinaExist = this.state.arduino.status
    const info = this.state.arduino
    let arudinoId = ""  
    let serial = ""
    if (this.state.arduino) {
      if (this.state.arduino.infoArduino[2]) {
        arudinoId = this.state.arduino.infoArduino[2]
        serial = this.state.arduino.infoArduino[1]
      }
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>              
            <Row className="card">
              <Col md={7}>
                <h2>Administrador de Vitrinas</h2>
                <p>Aqui se mostraran y manejaran las vitrinas disponibles</p>  
              </Col>              
              <Col md={5}>
                <Button 
                  style={{marginTop: "23px"}} 
                  bsStyle="primary"
                  onClick={() => this.handleActualizarVitrina()}
                  >Actualizar Vitrina</Button>
              </Col>
            </Row>
            
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h2 style={{marginTop: 0}}>Vitrinas Disponibles</h2>
            </Col>
          </Row>
          <Row>            
            <Col md={6}>
              <div className="card cardVitrina">
                {vitrinaExist == "active" && !info.itemStatus
                ?
                <div>
                  <Row>
                  <Col md={12}>   
                      <Col md={12}>
                        <h4>{"Vitrina " + "#"+  arudinoId.split(":")[1]}</h4>
                        <p className="textCard">En espera</p>
                        {/* <div className="valores">Capacidad: 1</div> */}
                        <div className="valores">{"Puerto Serial: " + serial.split(":")[1]}</div>
                      </Col>           
                  </Col>
                  </Row>
                  <Row>
                    <hr className="inline"/>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Button bsStyle="primary" className="btn-vitrinas" pullRight fill type="submit" onClick={() => this.setState({modalShow: true})}>
                        Utilizar
                      </Button>
                    </Col>
                  </Row>
                </div>
                :
                  <h3 className="ninguna">Ninguna Disponible</h3>
                }
                
              </div>
            </Col>                        
          </Row>
          <Row>
            <Col md={12}>
              <h2 style={{marginTop: 0}}>Vitrinas Activas</h2>
            </Col>
          </Row>
          <Row>            
            <Col md={6}>
              <div className="card cardVitrina">
                {vitrinaExist == "active" && info.itemStatus
                ?
                  <React.Fragment>
                  <Row>
                    {this.state.eventStatus && this.state.event.type == "alerta"
                    ?
                    <i className="pe-7s-attention" style={{fontSize: "50px" ,marginTop: "5px", color: "red"}}/> 
                    :
                    null 
                    }                  
                  <Col md={12}>    
                      <Col md={12}>
                      <h4>{"Vitrina " + "#"+arudinoId.split(":")[1]}</h4>
                      <p className="textCard">{this.state.eventStatus && this.state.event.type == "alerta" ? "Problema de Seguridad, revisar los eventos" : "En uso"}</p>
                      {/* <div className="valores">Capacidad: 1</div> */}
                      <div className="valores">{"Puerto Serial: " +serial.split(":")[1]}</div>
                      <h3 className="colorH3">{info.item.peso + "g | "+ this.state.gramos +"g"}</h3>
                      </Col>                                           
                  </Col>                  
                  </Row>
                  <Row>
                    <hr className="inline"/>
                  </Row>
                  <Row>
                    <Col md={12}>
                      {/* <Button bsStyle="primary" className="btn-vitrinas" pullRight fill type="submit">
                        Ver
                      </Button>
                      <Button bsStyle="success" className="btn-vitrinas" pullRight fill type="submit">
                        Modificar
                      </Button> */}
                      {this.state.eventStatus 
                      ?
                      <Button bsStyle="danger" onClick={this.handleKickEvent} className="btn-vitrinas" pullRight fill type="submit">
                        Quitar
                      </Button>
                      :
                      <Button bsStyle="danger" onClick={this.handleKick} className="btn-vitrinas" pullRight fill type="submit">
                        Quitar
                      </Button>
                      }

                    </Col>
                  </Row>
                  </React.Fragment>
                :
                  <h3 className="ninguna">Ninguna Disponible</h3>
                }
                
              </div>
            </Col>                        
          </Row>
        </Grid>
        {/* <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="202 Awesome Stroke Icons"
                ctAllIcons
                category={
                  <span>
                    Handcrafted by our friends from{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="http://themes-pixeden.com/font-demos/7-stroke/index.html"
                    >
                      Pixeden
                    </a>
                  </span>
                }
                content={
                  <Row>
                    {iconsArray.map((prop, key) => {
                      return (
                        <Col
                          lg={2}
                          md={3}
                          sm={4}
                          xs={6}
                          className="font-icon-list"
                          key={key}
                        >
                          <div className="font-icon-detail">
                            <i className={prop} />
                            <input type="text" defaultValue={prop} />
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                }
              />
            </Col>
          </Row>
        </Grid> */}
        <MyVerticallyCenteredModal
          show={this.state.modalShow}
          onHide={() => this.setState({modalShow: false, show: false, showBtn: true})}
          onChange={(values) => this.setState({value: values})}   
          hanfleForm={this.handleFormUsing}     
          onHandleSubmitBtn={this.onHandleSubmitBtn}      
        />
      </div>
    );
  }
}

export default Vitrinas;
