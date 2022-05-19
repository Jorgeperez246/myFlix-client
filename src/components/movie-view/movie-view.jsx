import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Button, Card, Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
export class MovieView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FavoriteMovies: [],
    };
    this.addFav = this.addFav.bind(this);
    this.removeFav = this.removeFav.bind(this);
  }

  getUser(token) {
    let user = localStorage.getItem("user");
    axios
      .get(`https://myflixdb246.herokuapp.com/users/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //assign the result to the state
        this.setState({
          FavoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch((e) => console.log(e));
  }
  componentDidMount() {
    const accessToken = localStorage.getItem("token");
    this.getUser(accessToken);
  }
  addFav() {
    {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const id = this.props.movie._id;

      //duplicate movie prevention
      let userFavorites = this.state.FavoriteMovies;
      let isFav = userFavorites.includes(id);
      if (!isFav) {
        axios
          .post(
            `https://myflixdb246.herokuapp.com/users/${user}/movies/${id}`,
            {},

            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            console.log(response);
            alert(
              `${this.props.movie.Title} has been added to your list of favorites`
            );
            window.open(`/movies/${id}`, "_self");
          })
          .catch((e) => console.log(e));
      } else if (isFav) {
        alert(
          `${this.props.movie.Title} is already in your list of favorite movies!`
        );
        window.open(`/movies/${id}`, "_self");
      }
    }
  }

  removeFav() {
    {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const id = this.props.movie._id;

      axios
        .delete(
          `https://myflixdb246.herokuapp.com/users/${user}/movies/${id}`,

          { headers: { Authorization: `Bearer ${token}` } },
          {}
        )
        .then((response) => {
          console.log(response);
          alert(
            `${this.props.movie.Title} has been deleted from your list of favorites`
          );
          window.open(`/movies/${id}`, "_self");
        })
        .catch((e) => console.log(e));
    }
  }

  render() {
    const { movie, onBackClick } = this.props;
    let movieId = this.props.movie._id;
    let userFav = this.state.FavoriteMovies;
    let isFav = userFav.includes(movieId);

    return (
      <Card>
        <Container>
          <Button
            variant="primary"
            onClick={() => {
              onBackClick(null);
            }}
          >
            Go Back
          </Button>
        </Container>
        <Container>
          <Card.Img
            variant="top"
            style={{ width: "40%" }}
            src={movie.ImagePath}
          />
        </Container>

        <Card.Body>
          <Col>
            <Card.Text>Title: </Card.Text>
            <span>{movie.Title}</span>
          </Col>

          <Col>
            <Card.Text>Description: </Card.Text>
            <span>{movie.Description}</span>
          </Col>

          <Col>
            <Card.Text>Genre: </Card.Text>
            <Link to={`/genres/${movie.Genre.Name}`}>{movie.Genre.Name}</Link>
          </Col>

          <Col>
            <Card.Text>Director: </Card.Text>
            <Link to={`/directors/${movie.Director.Name}`}>
              {movie.Director.Name}
            </Link>
          </Col>

          <Container>
            {!isFav && (
              <Button variant="primary" onClick={this.addFav}>
                Add to favorites
              </Button>
            )}
            {isFav && (
              <Button variant="primary" onClick={this.removeFav}>
                Remove from favorites
              </Button>
            )}
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }).isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }).isRequired,
    Description: PropTypes.string.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
