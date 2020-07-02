import React, { Component } from "react";
import { Grid, Row, Col,} from "react-bootstrap";
import '../styles/login.css'
import logo from '../assets/logo.png'
import axios from "axios";
import {Redirect} from 'react-router-dom'

let redirect = false

class Login extends Component {

  constructor(){
    super();
    this.state = {
      login: {
        username: "",
        password: ""
      }, 
      redirect: false,
      error_login: ""
    }
  }

  UNSAFE_componentWillMount = () =>{
    if (sessionStorage.getItem("userData")) {
        this.setState({
            redirect: true
        })
    }
  }

  onChange = (e) => {
    e.preventDefault();
    this.setState({
      login: {
          ...this.state.login,
          [e.target.name]: e.target.value
      }
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let status= false;


    this.setState({
      error_code: ""
    })

    const username = this.state.login.username;
    const password = this.state.login.password;

    await axios
    .post('http://localhost:3010/login', {username, password})
    .then(res => {
      if (res.data.response) {
        sessionStorage.setItem('userData', JSON.stringify(res.data.data));
        this.setState({
          redirect: true
        });
      }else{
        this.setState({
          error_login: res.data.message
        })
      }
    })
  }

  render() {

    if (this.state.redirect) {
      return (<Redirect to="/admin/dashboard" />)
    }    
    return (
      <div>
        <Row className="prueba">
            <Col className="imagen-fondo shadow-lg" sm={8}></Col>
            <Col className="shadow-lg forma options d-flex justify-content-center align-items-center" sm={4}>                        
                <div className="image-logo">
                    <img src={logo} width={150} height={150} />
                    <div className="titlelogin">DIAMANT</div>
                </div>        
                <div>                  
                </div>                    
                <form className="form-login" onSubmit={this.handleSubmit}>                
                    <div class="form-group">
                        <label for="exampleInputEmail1" className="label-login">Usuario</label>
                        <input onChange={this.onChange} type="text" name="username" value={this.state.login.username} class="form-control form-control-login" id="username" aria-describedby="emailHelp" placeholder="Usuario" />                    
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1" className="label-login">Contraseña</label>
                        <input onChange={this.onChange} name="password" value={this.state.login.password} type="password" class="form-control form-control-login" id="password" placeholder="Contraseña" />
                    </div>
                    <button type="submit" class="btn btn-primary btn-login">Login</button>
                </form>            
            </Col>
        </Row>
      </div>
    );
  }
}

export default Login;