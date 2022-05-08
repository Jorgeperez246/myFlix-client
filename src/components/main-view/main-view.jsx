import React from "react";
import axios from "axios";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      selcetedMovie: null,
      user: null,
    };
  }
  componentDidMount() {
    //get request query to /movies endpoint using Axios

    axios
      .get("https://myflixdb246.herokuapp.com/movies")
      .then((response) => {
        this.setState({
          movies: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
  }
  //func for successful register
  onRegistration(register) {
    this.setState({
      register,
    });
  }
  //user logs in and function updates user property to particular user
  onLoggedIn(user) {
    this.setState({
      user,
    });
  }
  render() {
    const { movies, selectedMovie, user } = this.state;

    //if no user,loginview is rendered. If user,details are passed as a prop to loginView
    if (!user)
      return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />;

    if (movies.length === 0)
      return <div className="main-view">The list is empty!</div>;

    return (
      <div className="main-view">
        {selectedMovie ? (
          <MovieView
            movie={selectedMovie}
            onBackClick={(newSelectedMovie) => {
              this.setSelectedMovie(newSelectedMovie);
            }}
          />
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onMovieClick={(movie) => {
                this.setSelectedMovie(movie);
              }}
            />
          ))
        )}
      </div>
    );
  }
}
