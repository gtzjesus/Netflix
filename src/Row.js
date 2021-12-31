import movieTrailer from 'movie-trailer';
import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import axios from './axios';
import './Row.css';

const base_url = "https://image.tmdb.org/t/p/original/";


function Row({ title, fetchUrl, isLargeRow }) {

    const [movies, setMovies] = useState([]);

    const [trailerUrl, setTrailerUrl] = useState("");

    // Snippet which runs based on a specific condition/variable
    useEffect(() => {
        // if[blank], run only once when Row loads.
        // if[movies], run every time variable 'movies' changes.
            async function fetchData() {
                const request = await axios.get(fetchUrl);
                //Get url from our axios.js
                //Pass the fetch from requests.js
                //'await' method to wait for the request first
                setMovies(request.data.results);
                return request;
            }

        fetchData();

    }, [fetchUrl]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

        const handleClick = (movie) => {
            if(trailerUrl) {
                setTrailerUrl("");
            } else {
                movieTrailer(movie?.name || "")
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v"));
                }).catch((error) => console.log(error));
            }
        };

    return (
        <div className='row'>
            <h2>{title}</h2>
            <div className='row__posters'>
                {/* Goes through movies array */}
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row__poster ${isLargeRow && 'row__posterLarge'}`} 
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                        alt={movie.name}
                    />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row;
