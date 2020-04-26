import Modal from 'react-bootstrap/Modal'
import React, {useContext, useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import { Form, Button } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import SearchForHospitalNames from '../SearchForHospitalNames/SearchForHostpitalNames';
import AlternativeAuthButton from '../AlternativeAuthButton';
//import theme from './RequestSuppliesFormModal.css';

export default function RequestSuppliesModal(props) {
    const [successfulSubmit, setSuccessfulSubmit] = useState(false);
    const [didMount, setDidMount] = useState(false)
    const [formData, setFormData] = useState("")
    const [invalidLogin, setInvalidLogin] = useState(false)
    const modalRef = useRef(null)
    const loginEndpoint = "api/login/authenticate";
    const loginOptions = {
      method: "POST",
      
      headers: {
        "Content-Type": "application/json",     
      },
      body: JSON.stringify({
        
        "email": formData.email,
        "password" : formData.password
      })
    }
    useEffect(() => setDidMount(true), [])
    useEffect(() => {
        if(didMount && props.show)
        {
            if (props.show) {
                async function login() {
                    const response = await fetch(loginEndpoint, loginOptions);
                    if(response.status === 200)
                    {
                        console.log("logged in..")
                        props.onHide();
                        window.location.reload();
                    }
                    else{
                        setInvalidLogin(true)
                    }
                }
                // Execute the created function directly
                login();
                }
        }
    }, [formData]);
    function InvalidLogin () {
        if(invalidLogin)
        {
          return <div className="alert alert-danger">  Invalid Login Credentials</div>
        }
      }
    return (

        <Modal
            {...props}
            //show = {modalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            ref= {modalRef}
        >
            <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Log In to Hospital Account 
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div>{InvalidLogin()}</div>
            <Formik
                enableReinitialize
                {...props}
                initialValues={{ name:"", password:""}}
                //validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting,resetForm}) => {
                    
                    // When button submits form and form is in the process of submitting, submit button is disabled
                    setSubmitting(true);
                    //will trigger server call to create hospital 
                    setFormData(values)
                    // Simulate submitting to database, shows us values submitted, resets form
                    
                    setSuccessfulSubmit(true); //set state variable to close modal on successful submit
                    resetForm({ name:"", password:""})
                    
                }}
            >
            {( {values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                }) => (
              <MYFORM onSubmit={handleSubmit} autoComplete="off" className="mx-auto">
                <Form.Group controlId="formEmail">
                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={touched.email && errors.email ? "error" : null}
                  />
                  {touched.email && errors.email ? (
                      <div className="error-message">{errors.email}</div>
                    ): null}
                </Form.Group>
                <Form.Group controlId="formPassword">
                <Form.Label>Password :</Form.Label>
                  <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                    />
                      {touched.password && errors.password ? (
                      <div className="error-message">{errors.password}</div>
                    ): null}
                </Form.Group>
                <BUTTON variant="primary" type="submit" disabled={isSubmitting}>
                  Submit
                </BUTTON>
              </MYFORM>
            )}
            </Formik>
            <AlternativeAuthButton
              label="Don't have an account yet?"
              buttonText="Sign up"
              onClick={() => {
                props.onHide();
                props.onOpenRegistrationModal();
              }}
            />
            </Modal.Body>
            </Modal>
          );
  }

const CONTAINER = styled.div`
  background: #F7F9FA;
  height: auto;
  width: 90%;
  margin: 5em auto;
  color: snow;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);

  @media(min-width: 786px) {
    width: 60%;
  }

  label {
    color: #24B9B6;
    font-size: 1.2em;
    font-weight: 400;
  }

  h1 {
    color: #24B9B6;
    padding-top: .5em;
  }

  .form-group {
    margin-bottom: 2.5em;
  }

  .error {
    border: 2px solid #FF6565;
  }

  .error-message {
    color: #FF6565;
    padding: .5em .2em;
    height: 1em;
    position: absolute;
    font-size: .8em;
  }
`;

const MYFORM = styled(Form)`
  width: 90%;
  text-align: left;
  padding-top: 2em;
  padding-bottom: 2em;

  @media(min-width: 786px) {
    width: 50%;
  }
`;

const BUTTON = styled(Button)`
  background: #1863AB;
  border: none;
  font-size: 1.2em;
  font-weight: 400;

  &:hover {
    background: #1D3461;
  }
`;

// Schema for yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
  .min(2, "*Names must have at least 2 characters")
  .max(100, "*Names can't be longer than 100 characters")
  .required("*Name is required"),
  email: Yup.string()
  .email("*Must be a valid email address")
  .max(100, "*Email must be less than 100 characters")
  .required("*Email is required"),
});




