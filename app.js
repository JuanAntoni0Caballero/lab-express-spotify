require('dotenv').config();


const { Router } = require('express');
const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req, res) => {
    res.render('home_page')
})



app.get('/artist-results', (req, res) => {

    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            // console.log(data.body.artists.items)
            const artist = data.body.artists.items
            res.render('artist-results', { artist })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})





app.get('/albums/:id', (req, res) => {
    const { id } = req.params
    spotifyApi
        .getArtistAlbums(id)
        .then((data) => {
            console.log(data)
            const albums = data.body.items
            console.log(albums)
            res.render('albums', { albums })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/tracks/:id', (req, res) => {
    const { id } = req.params

    console.log(id)

    spotifyApi
        .getAlbumTracks(id)
        .then((data) => {
            const tracks = data.body.items
            console.log(data.body);
            res.render('tracks', { tracks })
        }, (err) => {
            console.log('Something went wrong!', err);
        })
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
