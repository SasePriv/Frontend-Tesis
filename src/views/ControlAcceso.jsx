import React, { Component } from "react";
import { Grid, Row, Col, Table, Tooltip,OverlayTrigger, Button, Modal } from "react-bootstrap";
import Select from "react-dropdown-select";
import Card from "components/Card/Card.jsx";
import huella from '../assets/img/huella.png'
import io from 'socket.io-client';
import axios from 'axios'
import '../styles/inventario.css'

const thArray = ["Status","Nombre del Empleado","Huella","Fecha de Creacion", "Opciones"];

const remove = (<Tooltip id="remove_tooltip">Eliminar Usuario</Tooltip>);

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
          Añadiendo Producto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="formModal">
        <h4 style={{marginTop: "0px", marginBottom: "0px"}}>Datos del Usuario</h4>
        <p className="subtitleModal">
          Porfavor introduzca todos los datos de la persona.
        </p>
        {props.handleForms()}            
      </Modal.Body>
      <Modal.Footer>
        {props.handleBtnSave()}        
        <Button onClick={props.onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ModalConfirmation(props){
  return(
    <Modal
        size="sm"
        {...props}        
        aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">
          Eliminacion del Producto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{textAlign: "center"}}>¿Seguro que desea eliminar este producto?</Modal.Body>
      <Modal.Footer style={{textAlign: "center"}}>
      {props.handleBtnDelete()}
      <Button onClick={props.onHide}>Cancelar</Button>
      </Modal.Footer>
    </Modal>
  )
}

class ControlAcceso extends Component {

  constructor(props) {
    super(props);
    this.socket = io.connect('http://localhost:3010');
    this.state = {
      modalShow: false,
      value: "",
      form: {
        name: "",        
      },
      showBtn: true,
      showHuella: false,
      key: "",
      error_message: "",
      data: [],
      modalConfirmation: false,
      selectUser: ""
    };
  }

  componentDidMount = () => {

    this.fetchUserControl()

    this.socket.on('huella', data => {
      this.setState({
        key: data
      })
    })

  }

  fetchUserControl = async() => {
    await axios
    .get('http://localhost:3010/getUsersControlAccess')
    .then(res => {
      if (res.data.response) {
        this.setState({
          data: res.data.data
        })
      }else{
        console.log(res.data.response)
      }
    })
  }

  handleChange = (e) => {
    this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })
  }

  handleClick = () => {
    this.setState({
      showBtn: false,
      showHuella: true
    })
  }

  handleAccesForm = () => {

    return(
      <React.Fragment>
        <Row>
          <Col md={12}>
          <label className="labelModal">
            Nombre y Apellido
          </label>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <input className="customInput" onChange={(e) => this.handleChange(e)} placeholder="Nombre" type="text" name="name" value={this.state.form.name} />
          </Col>
        </Row>   
        <Row>
          <Col md={12}>
          <label className="labelModal" style={{marginTop: 10}}>
            Huella
          </label>
          <p className="subtitlePeso">
            Para comenzar haz click en el boton de abajo, despues ponga el dedo en el capta huella hasta que termine el proceo
          </p>
          </Col>
        </Row>
        {this.state.showBtn 
        ?
        <Row>
          <Col md={12} style={{textAlign: "center"}}>
            <Button bsStyle="primary" onClick={this.handleClick} className="btn-submit" pullRight fill type="submit" >
              Comenzar
            </Button>
          </Col>
        </Row>  
        :
        null
        }
        {this.state.showHuella 
        ?
        <React.Fragment>
          {this.state.key
          ?
          <Row>
            <Col md={12} className="huella">
              <img src={huella} alt="huella" width="100px"/>
            </Col>
          </Row> 
          :
          null
          }
          
          <Row>
            <Col md={12} className="peso" style={{padding: "10px"}}>
              <div className="waitTime">{this.state.key ? "Listo" :"Ponga el Dedo"}</div>
            </Col>
          </Row>
          <div style={{textAlign: "center", color: "red"}}>{this.state.error_message}</div>
        </React.Fragment>
        : 
          null
        }

      </React.Fragment>
    )
  }

  handleSubmit = async () => {    
    const isValid = this.validate()    
    if (isValid) {
      const name = this.state.form.name
      const huella = this.state.key
      const form = {}
      form.name = name
      form.huella = huella

      await axios
      .post("http://localhost:3010/addUserControlAccess", form)
      .then(res => {
        if (res.data.response) {
          this.fetchUserControl()
          this.setState({modalShow: false})
        }else{
          this.setState({
            error_message: res.data.message
          })          
        }
      })
    }
  }

  validate = () => {
    const name = this.state.form.name
    const huella = this.state.key

    if (name == "") {
      this.setState({
        error_message: "Por favor introduzca un nombre"
      })
      return false
    }else{
      this.setState({
        error_message: ""
      })
    }

    if (huella == "") {
      this.setState({
        error_message: "Por favor introduzca la huella"
      })
      return false
    }else{
      this.setState({
        error_message: ""
      })
    }

    return true
  }

  handleBtnSave = () => {
    return(<Button bsStyle="primary" onClick={() => this.handleSubmit()}>Guardar</Button>)
  }

  deleteAction = async () => {
    await axios
    .post(`http://localhost:3010/eliminateUserControlAccess/${this.state.selectedItem}`)
    .then(res => {
      console.log(res)
      if (res.data.response) {        
        this.fetchUserControl();
        this.setState({
          modalConfirmation: false,
          selectedItem: ""
        })
      }else{
        console.log("Error")
      }
    })
  }

  deleteProducto = () =>{
    return(
      <Button  bsStyle="danger" onClick={() => this.deleteAction()}>Eliminar</Button>
    )
  }

  render() {

    console.log(this.state.data)

    const data = this.state.data

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Button bsStyle="primary" className="btn-submit addBtn" pullRight fill type="submit" onClick={() => this.setState({modalShow: true})}>
              Nueva Persona
              </Button>
              <Card
                title="Control de Acceso Usuarios"
                // category="Aqui se puede dar permisos para acceso a la vitrina"
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
                      {data.map((prop, key) => {

                        const date = new Date(prop.createdAt)
                        const formatDay = date.getDay()+ "/" +date.getDate() + "/" + date.getFullYear()

                        return (
                          <tr key={key}>                            
                            <td key={key}>{prop.status.toUpperCase()}</td>
                            <td >{prop.name}</td>
                            <td >{prop.huella}</td>
                            <td >{formatDay}</td>
                            <td>

                              <OverlayTrigger placement="top" overlay={remove}>
                                <Button
                                bsStyle="danger"
                                simple
                                type="button"
                                bsSize="xs"            
                                onClick={() => this.setState({modalConfirmation: true, selectedItem: prop._id})}
                                >
                                <i className="fa fa-times"></i>
                                </Button>
                              </OverlayTrigger>
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
        <MyVerticallyCenteredModal
          show={this.state.modalShow}
          onHide={() => this.setState({modalShow: false, form:{name: ""}, showBtn: true, showHuella: false})} 
          handleForms={this.handleAccesForm}     
          handleBtnSave={this.handleBtnSave}    
        />
        <ModalConfirmation 
          onHide={() => this.setState({modalConfirmation: false})}    
          show={this.state.modalConfirmation}
          handleBtnDelete={this.deleteProducto}
        />
      </div>
    );
  }
}

export default ControlAcceso;
