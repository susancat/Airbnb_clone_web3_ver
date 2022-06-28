import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

function SuccessToast({success, setSuccess, location}) {

//should fade auto
  return (
    <Row>
      <Col xs={6}>
        <Toast bg="success" onClose={() => setSuccess(false)} show={success} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Booking Successful</strong>
          </Toast.Header>
          <Toast.Body>Nice! You are going to {location}!!</Toast.Body>
        </Toast>
      </Col>
    </Row>
  );
}

export default SuccessToast;