import actions from '../actions';

const initialState = {
  gigs: [],
  gigsByArtist: [],
  settings: {
    date: null,
    range: 250,
    city: 'Helsinki',
    genres: [],
  },
  loading: false,
};

function gigsApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case actions.RECEIVE_GIGS:
      return Object.assign({}, state, {
        gigs: action.payload,
      });
      break;
    case actions.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
      break;
    case actions.SET_GIGS_BY_ARTISTS:
      return {
        ...state,
        gigsByArtist: action.payload,
      };
      break;
    case actions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
  }
  // For now, don't handle any actions
  // and just return the state given to us.
  return state;
}

export default gigsApp;
