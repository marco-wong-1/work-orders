import React, { Component } from 'react';
import moment from 'moment';
import { Card, Container, Row, Col } from 'react-bootstrap';

class WorkOrder extends Component {
  render() {
    const {work, worker} = this.props;
    const workerDetails = worker ? 
      <Container className="ml-auto mr-auto">
        <Row>
          <Col className="text-sm-right mt-auto mb-auto">
            <img className="thumbnail" src={worker.image} alt="thumnail" />
          </Col>
          <Col className="text-sm-left mt-auto mb-auto">
            <h5>{worker.name}</h5>
            <span>{worker.companyName}</span>
            <br />
            <small className="text-muted">{worker.email}</small>
          </Col>
        </Row>
      </Container>
      : null
    return (
      <Card className="Cards float-md-left">
        <Card.Body className="pl-5 pr-5">
        <Card.Title>{work.name}</Card.Title>
        <div className="Desc mb-2">{work.description}</div>
        {workerDetails}
        <small className="text-muted">{moment.utc(work.deadline).local().toString()}</small>
        </Card.Body>
      </Card>
    );
  }
}

export default WorkOrder;
