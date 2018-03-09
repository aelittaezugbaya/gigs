import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Row, Col } from 'antd';
import distanceInKmBetweenEarthCoordinates from '../utils/calcDistance'
import 'lodash';
import moment from 'moment'
import { error } from 'util';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: this.props.settings,
      gigs: [],
      artists: [],
      gigsOfAllArtists: [],
      markers: []
    };

    this.findGigs = this.findGigs.bind(this);
  }
  promises = [];

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.settings, nextProps.settings) == false) {
      console.log(nextProps)
      if (nextProps.settings.genres && nextProps.settings.genres.length > 0) {
        this.props = nextProps;
        if (this.props.settings.city != nextProps.settings.city) {
          this.findGigsByCity(this.props.settings, true)
        } else {
          this.findGigs();
        }
      } else if (this.props.settings.genres && nextProps.settings.genres == null) {
        this.props = nextProps;
        this.putMarkers(this.state.map, this.props.gigsByArtist);
        this.props.receiveGigs(this.props.gigsByArtist);
        //this.resetSettings();
      } else if (this.props.settings.city != nextProps.settings.city) {
        this.props = nextProps;
        this.findGigsByCity(nextProps.settings, false);
      } else if (nextProps.settings.range < 250 && nextProps.settings.date) {
        this.props = nextProps;
        this.filterEventsByDateRangeAndByDistance()
      } else if (nextProps.settings.range < 250) {
        this.props = nextProps;
        this.filterEventsByRange(this.props.settings.range);
      } else if (nextProps.settings.date) {
        this.props = nextProps;
        this.filterEventsByDateRange(nextProps.gigs)
      } else if (nextProps.settings.range < 250 && nextProps.setting.date) {
        this.filterEventsByDateRangeAndByDistance()
      }
      //
    }
  }

  filterEventsByDateRangeAndByDistance() {
    console.log('lol')
    const sorted = [];
    // sort by time
    const from = moment(this.props.settings.date[0], 'YYYYMMDD');
    const to = moment(this.props.settings.date[1], 'YYYYMMDD');
    console.log(this.props.gigsByArtist)
    this.props.gigsByArtist.forEach(event => {
      const eventDate = moment(event.start_time);
      if (eventDate.isAfter(from) && eventDate.isBefore(to)) {
        sorted.push(event)
      }
    })
    console.log(sorted)
    //
    const sortedByDistance = [];
    for (event of sorted) {
      const distance = distanceInKmBetweenEarthCoordinates(this.state.latitude, this.state.longitude, event.latitude, event.longitude);
      if (distance < this.props.settings.range) {
        sortedByDistance.push(event)
      }
    }
    console.log(sortedByDistance)
    this.props.receiveGigs(sortedByDistance);
    this.putMarkers(this.state.map, sortedByDistance);
    console.log(this.props.gigs)
  }

  componentDidMount() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYWVsaXR0YWUiLCJhIjoiY2pkeWlsODg0MHp4dTMzbzZncTI0dzBpdCJ9.6YIUNwH0qV7HZqxkmel2DQ';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [24.9384, 60.1699], // starting position
      zoom: 13, // starting zoom
    });
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        fitBoundsOptions: {
          maxZoom: 14,
        },
        trackUserLocation: true,
      }),
    );
    navigator.geolocation.getCurrentPosition(position => {
      const coords = position.coords;
      // map.flyTo( {center: [coords.longitude,coords.latitude]});
      map.setCenter([coords.longitude, coords.latitude]);
      //this.findGigs(coords.latitude, coords.longitude, map)
      this.setState({
        map: map,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      //this.findGigs(this.state.latitude, this.state.longitude, this.state.map)
      this.getFavouriteArtists();
    });
  }

  filterEventsByRange(range) {
    console.log("range" + range)
    const sorted = [];
    console.log('empty')
    console.log(this.props.gigs)
    console.log(this.props.gigsByArtist)
    for (event of this.props.gigsByArtist) {
      const distance = distanceInKmBetweenEarthCoordinates(this.state.latitude, this.state.longitude, event.latitude, event.longitude);
      if (distance < range) {
        console.log(distance)
        sorted.push(event)
      }
    }
    console.log(sorted)
    this.props.receiveGigs(sorted);
    this.putMarkers(this.state.map, sorted)
    console.log(this.props.gigs)
  }

  resetSettings() {
    this.props.updateSettings({
      date: null,
      range: 250,
      city: null,
      genres: [],
    })
  }

  getArtistEvent(name) {
    const origin = 'https://cors-anywhere.herokuapp.com/';
    let url = 'http://api.eventful.com/json/events/search?app_key=vHdXThWsm6Xn9HPP&';
    url += '&category=music&page_size=100';
    url += '&keywords=title:' + encodeURIComponent(name);
    url += '&date=Future';
    url += '&sort_order=date&page_size=20';
    url +=
      '&where=' +
      encodeURIComponent(this.state.latitude) +
      ',' +
      encodeURIComponent(this.state.longitude);
    // url+='&location='+encodeURIComponent(this.props.settings.city);
    url += '&within=250&units=km';
    return window
      .fetch(url, {
        method: 'GET',
      })
      .then(data => data.json())
      .then(data => {
        const sortedByName = [];
        if (data.events) {
          data.events.event.map(event => {
            if (event.performers != null) {
              if (event.performers.performer.name) {
                if (event.performers.performer.name.toUpperCase() == name.toUpperCase()) {
                  sortedByName.push(event);
                }
              } else {
                event.performers.performer.map(artist => {
                  if (artist.name.toUpperCase() == name.toUpperCase()) {
                    sortedByName.push(event);
                  }
                });
              }
            }
          });
        }

        if (sortedByName.length > 0) {
          const events = [];
          for (const gig of sortedByName) {
            events.push({
              artist: name,
              title: gig.title,
              description: gig.description,
              start_time: gig.start_time,
              latitude: gig.latitude,
              longitude: gig.longitude,
              url: gig.url,
            });
          }

          this.props.setGigsByArtist(this.props.gigsByArtist.concat(events));
          this.props.receiveGigs(this.props.gigs.concat(sortedByName));
          this.putMarkers(this.state.map, this.props.gigs);
          // console.log('gigs');
          // console.log(this.props.gigs);

        }
      })
      .catch(error => console.error(error));
  }

  getRecommendatedArtists(arrayOfArtists) {
    let string = '';
    for (let i = 0; i < 5; i++) {
      string += arrayOfArtists[i].id + ',';
    }

    return window
      .fetch(`https://api.spotify.com/v1/recommendations?limit=100&seed_artists=` + string, {
        headers: {
          Authorization: 'Bearer ' + window.localStorage.accessToken,
        },
      })
      .then(data => data.json())
      .then(data => {
        const recommendedArtists = [];
        data.tracks.map(track => {
          if (
            !recommendedArtists.includes(track.artists[0].name) &&
            !this.state.artists.includes(track.artists[0].name)
          ) {
            recommendedArtists.push(track.artists[0].name);
          }
        });
        this.setState({
          artists: this.state.artists.concat(recommendedArtists),
        });

        for (const artist of recommendedArtists) {
          console.log('gettting events');
          this.promises.push(this.getArtistEvent(artist));
        }
      });
  }

  getFavouriteArtists() {
    console.log('first');
    this.promises.push(
      window
        .fetch('https://api.spotify.com/v1/me/top/artists', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + window.localStorage.accessToken,
          },
        })
        .then(data => data.json())
        .then(data => {
          if (!data.items) return;
          const artists = [];
          data.items.map(artist =>
            artists.push({ id: artist.id, name: artist.name, genres: artist.genres }),
          );
          const recommendedArtistPromises = [];
          for (let i = 0; i < 20; i += 5) {
            const group = [];
            for (let j = i; j < i + 5; j++) {
              group.push(artists[j]);
            }
            console.log('receviving reccomended');
            recommendedArtistPromises.push(this.getRecommendatedArtists(group));
          }
          Promise.all(recommendedArtistPromises)
            .then(() => Promise.all(this.promises))
            .then(this.doneReceiving);
        }),
    );
  }

  doneReceiving = () => {
    this.promises = [];
    this.props.updateLoading(false);
    console.log('done')
  };

  filterEventsByDateRange(events) {
    const sorted = [];
    console.log(this.props.settings.date)
    const from = moment(this.props.settings.date[0], 'YYYYMMDD');
    const to = moment(this.props.settings.date[1], 'YYYYMMDD');
    events.forEach(event => {
      const eventDate = moment(event.start_time);
      if (eventDate.isAfter(from) && eventDate.isBefore(to)) {
        sorted.push(event)
      }
    })
    this.props.receiveGigs(sorted);
    this.putMarkers(this.state.map, sorted)
    console.log(sorted)
  }

  putMarkers(map, events) {
    this.state.markers.forEach(marker => {
      marker.remove()
    })
    this.setState({
      markers: []
    })
    console.log(events)
    events.forEach(event => {
      const popup = new mapboxgl.Popup()
        .setHTML('<strong>' +
        event.title +
        '</strong><p>' +
        event.description +
        "</p><a href='" +
        event.url +
        '\'target="_blank" title="Opens in a new window">Link to the event</a>')
      const marker = new mapboxgl.Marker()
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup) // sets a popup on this marker
        .addTo(this.state.map)
      this.setState({
        markers: this.state.markers.concat(marker)
      })
    })
  }
  // putMarkers(map, events) {
  //   const gigs = [];
  //   if (map.getLayer('places')) {
  //     map.removeLayer('places');
  //     map.removeSource('source');
  //   }
  //   events.forEach(event => {
  //     gigs.push({
  //       type: 'Feature',
  //       properties: {
  //         description:
  //           '<strong>' +
  //           event.title +
  //           '</strong><p>' +
  //           event.description +
  //           "</p><a href='" +
  //           event.url +
  //           '\'target="_blank" title="Opens in a new window">Link to the event</a>',
  //         icon: 'music',
  //       },
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [event.longitude, event.latitude],
  //       },
  //     });
  //   });

  //   map.addSource('source', {
  //     type: 'geojson',
  //     data: {
  //       type: 'FeatureCollection',
  //       features: gigs,
  //     },
  //   });
  //   map.addLayer({
  //     id: 'places',
  //     type: 'symbol',
  //     source: 'source',
  //     layout: {
  //       'icon-image': '{icon}-15',
  //       'icon-allow-overlap': true,
  //     },
  //   });

  //   map.on('click', 'places', function (e) {
  //     var coordinates = e.features[0].geometry.coordinates.slice();
  //     var description = e.features[0].properties.description;

  //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  //       coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  //     }

  //     new mapboxgl.Popup()
  //       .setLngLat(coordinates)
  //       .setHTML(description)
  //       .addTo(map);
  //   });

  //   // Change the cursor to a pointer when the mouse is over the places layer.
  //   map.on('mouseenter', 'places', function () {
  //     map.getCanvas().style.cursor = 'pointer';
  //   });

  //   // Change it back to a pointer when it leaves.
  //   map.on('mouseleave', 'places', function () {
  //     map.getCanvas().style.cursor = '';
  //   });
  // }

  findGigs() {
    console.log(this.props.settings)
    const origin = 'https://cors-anywhere.herokuapp.com/';
    let url = 'http://api.eventful.com/json/events/search?app_key=vHdXThWsm6Xn9HPP&';
    url += '&where=' + encodeURIComponent(this.state.latitude) + ',' + encodeURIComponent(this.state.longitude);
    url += '&category=music';
    url += '&within=' + encodeURIComponent(this.props.settings.range) + '&units=km';
    url += '&sort_order=date&page_size=100&date=Future';
    url += '&keywords=' + encodeURIComponent(this.props.settings.genres);
    // for (const genre of this.props.settings.genres) {
    //   url += encodeURIComponent(genre) + ',';
    // }
    window
      .fetch(origin + url, {
        method: 'GET',
      })
      .then(data => data.json())
      .then(data => {
        console.log(data.events)
        this.props.receiveGigs(data.events.event);
        this.putMarkers(this.state.map, data.events.event);
      });
  }


  findGigsByCity(settings, byGenres) {
    if (settings.city) {
      this.props.updateSettings({
        range: 250,
        date: null,
        genres: [],
      })
      this.promises = [];
      this.props.updateLoading(true);
      this.props.receiveGigs([]);
      window
        .fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${
        settings.city
        }.json?access_token=pk.eyJ1IjoiYWVsaXR0YWUiLCJhIjoiY2pkdzF3bWN6MGZudjJ2b2hlN2x0ZWM2OCJ9.lM3nZt9piPiGYrpDiGAOHw&autocomplete=true&limit=1`,
        {
          method: 'GET',
        },
      )
        .then(data => data.json())
        .then(data => {
          this.state.map.setCenter(data.features[0].center);
          this.setState({
            longitude: data.features[0].center[0],
            latitude: data.features[0].center[1],
          });
          if (byGenres) {
            this.findGigs()
          } else {
            for (const artist of this.state.artists) {
              this.promises.push(this.getArtistEvent(artist));
            }
            Promise.all(this.promises).then(this.doneReceiving);
          }

        });
    }
  }

  renderMap() { }

  render() {
    return <div id="map" />;
  }
}

const mapStateToProps = ({ gigs, settings, gigsByArtist, loading }) => ({
  gigs,
  settings,
  gigsByArtist,
  loading
});

const mapDispatchToProps = dispatch => ({
  receiveGigs: gigs =>
    dispatch({
      type: actions.RECEIVE_GIGS,
      payload: gigs,
    }),
  setGigsByArtist: gigs =>
    dispatch({
      type: actions.SET_GIGS_BY_ARTISTS,
      payload: gigs,
    }),
  updateLoading: ready =>
    dispatch({
      type: actions.SET_LOADING,
      payload: ready,
    }),
  updateSettings: setting =>
    dispatch({
      type: actions.UPDATE_SETTINGS,
      payload: setting,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
