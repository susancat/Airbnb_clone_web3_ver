import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

function SuccessToast({error, setError, msg}) {

//should fade auto
  return (
    <Row>
      <Col xs={6}>
        <Toast bg="danger" onClose={() => setError(false)} show={error} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Booking Failed</strong>
          </Toast.Header>
          <Toast.Body>{msg}</Toast.Body>
        </Toast>
      </Col>
    </Row>
  );
}

export default SuccessToast;