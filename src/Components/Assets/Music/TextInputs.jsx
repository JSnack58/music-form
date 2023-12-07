import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'


export default function TextInputs(props) {
    return (
        
            <div>
                {
                    props.NameSettersMap.map((input)=>{
                                let name = input.name;
                                let func = input.func;
                                return (<Form.Group className="mb-3" controlId={`formBasic${name}`}>
                                    <Form.Label>{name}</Form.Label>
                                    <Form.Control type="input" placeholder={`Enter ${name}`} 
                                        onChange={func} />
                                </Form.Group>)
                    })
                }
            </div>

        
    )
}
