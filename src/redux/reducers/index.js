import actions from "../actions";

const initialState = {
  gigs: [],
  settings: {
    date: null,
    range: 250,
    city: 'Helsinki',
    genres: [],
  }
};

function gigsApp(state, action) {
  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    case actions.RECEIVE_GIGS:
      return Object.assign(
        {},
        state,
        {
          gigs: action.payload
        }
      )
      break;
    case actions.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        }
      }
    default:
  }
  // For now, don't handle any actions
  // and just return the state given to us.
  return state;
}

export default gigsApp;
