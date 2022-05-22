import React from "react";
import { Container, Row, Col, Card, Button, CardGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export class GenreView extends React.Component {
  render() {
    const { genre, onBackClick } = this.props;

    return (
      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>{genre.Name}</Card.Title>
                <Card.Text>Bio: {genre.Description}</Card.Text>
                <Button
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
