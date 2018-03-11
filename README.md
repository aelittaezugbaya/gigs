# Gigs

This application will help you to find concerts and gigs around you based on your Spotify acoount recommendation or by choosen genre. It will show concerts on the map and also user can see on the list, where he can directly open the site of concerts. User can filter results by city, radious and date range(doesn't work with genres).

### Why I need to seach gigs by genres?
There are several reasons for it:

* more chances to find event for tonight
* more chances to find event near you
* you can find event for your friend who doesn't have spotify account

### Built With
  * [Ant design](https://ant.design/docs/react/introduce) - for good looking view
  * Bootstrap grid
  * [Spotify API/ OAuth](https://developer.spotify.com/web-api/) - for login and getting recomennded artists
  * [Eventful API](http://api.eventful.com/) - find concerts by artist or genre
  * [Mapbox](https://www.mapbox.com/)- map
  * [React.js](https://reactjs.org/)
  * [Redux](https://redux.js.org/)

I have never used most of these tools, so it cause a lot of problems, because of it application still doesn't work as I was expected.

### Prerequisites

The main problem of this appplication that eventful api get the error 'No 'Access-Control-Allow-Origin' header is present on the requested resource error'. The easiest way to solve it, it download the plugin for Chrome and enable it, while you are using my application.
[Plugin](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en)  

## Authors

**Aelitta Ezugbaya** - *Initial work* 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
