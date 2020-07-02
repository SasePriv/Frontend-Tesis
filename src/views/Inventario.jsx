import React, { Component } from "react";
import { Grid, Row, Col, Table, Tooltip,OverlayTrigger, Button, Modal, } from "react-bootstrap";
import Select from "react-dropdown-select";
import Card from "components/Card/Card.jsx";
import axios from "axios";
import io from 'socket.io-client';
import ReactLoading from 'react-loading';

import '../styles/inventario.css'
import { createExpressionStatement } from "typescript";

const thArray = ["CODIGO","NOMBRE","PRECIO","PESO","CATEGORIA", "ESTADO", "CREADO EL"];

const optionArray = [
  {id: 1 ,name: "Joyas"},
  {id: 2 ,name: "Relog"},
  {id: 2 ,name: "Anillos"}
];

const edit = (<Tooltip id="edit_tooltip">Editar Producto</Tooltip>);
const remove = (<Tooltip id="remove_tooltip">Eliminar Producto</Tooltip>);

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
        <h4 style={{marginTop: "0px", marginBottom: "0px"}}>Datos del Producto</h4>
        <p className="subtitleModal">
          Porfavor introduzca todos los datos del producto.
        </p>
        {props.onHandleFormModal()}             
        {props.onHandlePeso(props)}
      </Modal.Body>
      <Modal.Footer>        
        {props.onHandleSubmitBtn()}
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

class Inventario extends Component {

  constructor(props) {
    super(props);
    this.socket = io.connect('http://localhost:3010');
    this.state = {
      modalShow: false,
      modalConfirmation: false,
      value: "",
      data: [],
      arduino: "",
      pesoReady: "",
      show: false,
      loading: false,
      showBtn: true,
      gramos: 0,
      form:{
        name: "",
        price: 0,
      },
      selectedItem: "",
      edit: false
    };
  }


  componentDidMount = () => {
    this.getInventory();


    if (sessionStorage.getItem("arduinoInfo")) {
      this.setState({
        arduino: JSON.parse(sessionStorage.getItem("arduinoInfo"))
      })
      console.log(JSON.parse(sessionStorage.getItem("arduinoInfo")))
    }

    this.socket.on('peso', data =>{
      // console.log("Recibiendo")
      // console.log(data)
      if (data.status == "ready") {
        this.setState({
          show: true,
          loading: false
        })
      }
    })

    this.socket.on('gramos', data => {
      this.setState({
        gramos: data
      })
    })
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

  onClickStart = (e) =>{    
    console.log("click")
    const data = {message: "t"}
    this.socket.emit('passPeso', data);
    this.setState({loading: true, showBtn: false})
    
  }

  onHandlePeso = (props) => {
    const arduino = this.state.arduino
    let show = this.state.show
    let gramos = parseFloat(this.state.gramos)
    if (gramos < 1.5 && gramos > 0 || gramos < 0 && gramos > -1) {
      gramos = 0;
    }

    return(
      <React.Fragment>
      {!this.state.edit 
      ? 
      <React.Fragment>
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
        <React.Fragment>
          {this.state.showBtn
          ?
          <Row>
            <Col md={12} style={{textAlign: "center"}}>
              <div onClick={() => props.onClickStart()}>
              <Button {...arduino.status == "active" && !arduino.itemStatus ? null : {disabled: "disable"}} bsStyle="primary" className="btn-submit" pullRight fill type="submit">
                Comenzar
              </Button>
              </div>
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
          
          <div className="mensaje-error">{arduino.status == "active" || arduino.itemStatus ? null : "Ninguna vitrina disponible"}</div>
          {show 
          ? 
          <Row>
            <Col md={12} className="peso">
              <h3>{gramos+"g"}</h3>
              <div className="waitTime">Ponga el objeto</div>
            </Col>
          </Row>
          :
          null
          }

        </React.Fragment>
      </React.Fragment>
      :
      null 
      }
      </React.Fragment>
    )
  }

  handleChangeForm = (e) => {
    this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }      
    })
  }

  onHandleFormModal = () => {
    return (
      <React.Fragment>
        <Row>
          <Col md={12}>
          <label className="labelModal">
            Nombre
          </label>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <input onChange={this.handleChangeForm} className="customInput" placeholder="Nombre del Producto" type="text" name="name" value={this.state.form.name} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
          <label className="labelModal">
            Precio
          </label>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <input onChange={this.handleChangeForm} className="customInput" type="number" name="price" value={this.state.form.price} />
          </Col>
        </Row>  
        <Row>
          <Col md={12}>
          <label className="labelModal">
            Category
          </label>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Select placeholder="Buscar" searchable={true} options={optionArray} labelField="name" valueField="name" onChange={(values) => this.setState({value: values})} />
          </Col>
        </Row>             
      </React.Fragment>
    )
  }

  onSendInventory = async () => {

    if (!this.state.edit) {

      const form = this.state.form
      form.peso = this.state.gramos
      form.category = this.state.value[0].name.toLowerCase();
      let data = this.state.data

      await axios
      .post('http://localhost:3010/addInventory', form)
      .then(res => {
        if (res.data.response) {
          data.unshift(res.data.data)
          this.setState({
            data,
            modalShow: false,
            form:{
              name: "",
              price: 0,            
            },
            showBtn: true,
            show: false
          })
        }else{
          console.log("Error")
          console.log(res.data)
        }
      })

    }else{

      const form = this.state.form      
      form.category = typeof this.state.value  == 'string' ? this.state.value : this.state.value[0].name.toLowerCase();
      let data = this.state.data
      
      await axios
      .post(`http://localhost:3010/updateInventory/${this.state.selectedItem}`, form)
      .then(res => {
        if (res.data.response) {
          this.getInventory();          
          this.setState({            
            modalShow: false,
            form:{
              name: "",
              price: 0,            
            },
            showBtn: true,
            show: false
          })
        }else{
          console.log("Error")
          console.log(res.data)
        }
      })

    }

    
  }

  onHandleSubmitBtn = () =>{
    return(
      <React.Fragment>
        <Button 
          bsStyle="primary" 
          onClick={() => this.onSendInventory()}
          {...this.state.gramos > 2 || this.state.edit ? null : {disabled: "disable"}}
          >
            Guardar
          </Button>
      </React.Fragment>
    )
  }

  deleteAction = async () => {
    await axios
    .post(`http://localhost:3010/eliminateInventory/${this.state.selectedItem}`)
    .then(res => {
      console.log(res)
      if (res.data.response) {        
        this.getInventory();
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

  handleEdit = (id) => {
    const obj = this.state.data.filter(product => product._id == id)    
    this.setState({
      form:{
        name: obj[0].name,
        price: obj[0].price
      },
      value: obj[0].category,
      modalShow: true,
      edit: true,
      selectedItem: id
    })
  }

  render() {
        

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Button bsStyle="primary" className="btn-submit addBtn" pullRight fill type="submit" onClick={() => this.setState({modalShow: true})}>
              Añadir Producto
              </Button>
              <Card
                title="Inventario Joyeria"
                category="Aqui se encuentra el inventario registrado"
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
                        const date = new Date(prop.createdAt)
                        const formatDay = date.getDay()+ "/" +date.getDate() + "/" + date.getFullYear()

                        return (
                          <tr key={key}>  
                            <td>{prop._id}</td>                          
                            <td>{prop.name.toUpperCase()}</td>
                            <td>{prop.price+"$"}</td>                            
                            <td>{prop.peso+"g"}</td>                            
                            <td>{prop.category.toUpperCase()}</td>                            
                            <td>{prop.status.toUpperCase()}</td>                            
                            <td>{formatDay}</td>                                                        
                            <td>
                              <OverlayTrigger placement="top" overlay={edit}>
                                <Button                                
                                bsStyle="primary"
                                simple
                                type="button"
                                bsSize="xs"                                
                                style={{marginRight: "5px"}}
                                onClick={() => this.handleEdit(prop._id)}
                                >
                                <i className="fa fa-edit"></i>
                                </Button>
                              </OverlayTrigger>

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
          onHide={() => this.setState({modalShow: false, form:{name: "",price: 0,},showBtn: true,show: false, selectedItem: "", edit: false})}           
          onHandlePeso={this.onHandlePeso}    
          onHandleSubmitBtn={this.onHandleSubmitBtn}  
          onHandleFormModal={this.onHandleFormModal}
          onClickStart={this.onClickStart}
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

export default Inventario;
