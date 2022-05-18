import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, Button, CardGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export class DirectorView extends React.Component {
  render() {
    const { director, onBackClick } = this.props;

    return (
      <Container>
        <Row>
          <Col>
            <Card id="director-view">
              <Card.Body>
                <Card.Title>{director.Name}</Card.Title>
                <Card.Text>Bio: {director.Bio}</Card.Text>
                <Card.Text>Birthday: {director.Birth}</Card.Text>
                <Card.Text>Death: {director.Death}</Card.Text>
                <Button
                  id="director-back-button"
                  onClick={() => {
                    onBackClick();
                  }}
                >
                  Back
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

DirectorView.propTypes = {
  director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birth: PropTypes.string.isRequired,
  }).isRequired,

  onBackClick: PropTypes.func.isRequired,
};
