import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import reactDom from "react-dom";
import { setMovies } from "../../actions/actions";
import MoviesList from "../movie-list/movie-list";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { RegistrationView } from "../registration-view/registration-view";
import { DirectorView } from "../../director-view/director-view";
import { GenreView } from "../genre-view/genre-vew";
import { Container } from "react-bootstrap";
import { Row, Col, Button } from "react-bootstrap";
import { ProfileView } from "../profile-view/profile-view";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarToggle from "react-bootstrap/esm/NavbarToggle";

class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      user: null,
    };
  }
  getMovies(token) {
    axios
      .get("https://myflixdb246.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  refreshPage() {
    window.location.reload(false);
  }

  //data now takes both inputs the token and username
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }
  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
  }
  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }

  render() {
    let { movies } = this.props;
    let { user } = this.state;

    return (
      <Router>
        <Navbar>
          <Navbar.Brand href="/" className="justify-content-start">
            MyFlix
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Link to={`/users/${user}`}>Signed in as: {user}</Link>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <Row className="main-view justify-content-md-center">
          {/* homscreen displays every movie */}
          <Route
            exact
            path="/"
            render={() => {
              if (!user)
                return (
                  <Col>
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  </Col>
                );
              if (movies.length === 0) return <div className="main-view" />;

              return <MoviesList movies={movies} />;
            }}
          />
          {/* connects to LoginView */}
          <Route
            exact
            path="/login"
            render={() => {
              if (user) {
                return <Redirect to="/" />;
              }
              return <LoginView onLoggedIn={(data) => this.onLoggedIn(data)} />;
            }}
          />
          {/* connects to RegistrationView */}
          <Route
            exact
            path="/register"
            render={() => {
              if (user) {
                return <Redirect to="/" />;
              }
              return (
                <Col>
                  <RegistrationView />
                </Col>
              );
            }}
          />
          {/* displays movie info in MovieView */}
          <Route
            path="/movies/:movieId"
            render={({ match, history }) => {
              if (!user)
                return (
                  <Col>
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  </Col>
                );
              if (movies.length === 0) return <div className="main-view" />;

              return (
                <Col md={8}>
                  <MovieView
                    movie={movies.find((m) => m._id === match.params.movieId)}
                    onBackClick={() => history.goBack()}
                  />
                </Col>
              );
            }}
          />
          {/* displays director info in DirectorView */}
          <Route
            path="/directors/:name"
            render={({ match, history }) => {
              if (!user)
                return (
                  <Row>
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  </Row>
                );
              if (movies.length === 0) return <div className="main-view" />;

              return (
                <Col md={8}>
                  <DirectorView
                    director={
                      movies.find((m) => m.Director.Name === match.params.name)
                        .Director
                    }
                    movies={movies}
                    onBackClick={() => history.goBack()}
                  />
                </Col>
              );
            }}
          />

          {/* displays genre info on Genreview */}
          <Route
            path="/genres/:name"
            render={({ match, history }) => {
              if (!user)
                return (
                  <Row>
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  </Row>
                );
              if (movies.length === 0) return <div className="main-view" />;

              return (
                <Col md={8}>
                  <GenreView
                    genre={
                      movies.find((m) => m.Genre.Name === match.params.name)
                        .Genre
                    }
                    movies={movies}
                    onBackClick={() => history.goBack()}
                  />
                </Col>
              );
            }}
          />
          {/* displays user info in profile view */}
          <Route
            path={`/users/${user}`}
            render={({ history }) => {
              if (!user)
                return (
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                );
              if (movies.length === 0) return <div className="main-view" />;
              return (
                <Col md={8}>
                  <ProfileView
                    history={history}
                    movies={movies}
                    user={user}
                    onBackClick={() => history.goBack()}
                  />
                </Col>
              );
            }}
          />
        </Row>
      </Router>
    );
  }
}
// #7
let mapStateToProps = (state) => {
  return { movies: state.movies };
};

// #8
export default connect(mapStateToProps, { setMovies })(MainView);
