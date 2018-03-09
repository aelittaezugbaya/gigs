import React from 'react';
import moment from 'moment';
import { List } from 'antd';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import { Collapse, Slider, Input, DatePicker, Select, Button } from 'antd';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;
import 'antd/lib/list/style/css';
import 'antd/lib/collapse/style/css';
import 'antd/lib/slider/style/css';
import 'antd/lib/input/style/css';
// import 'antd/lib/date-picker/RangePicker'
// import 'antd/lib/date-picker/RangePicker'
import 'antd/lib/date-picker/style/css';

const data = ['Jazz-influenced hip hop artist', 'A Little Night Music.', 'Truckero'];

const dateFormat = 'YYYY/MM/DD';

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    const arrayOfCitirs = [];
    this.state = {
      cities: arrayOfCitirs,
      sliderValue: 250,
      dateValue: null
    };
    this.logOut = this.logOut.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.settings.city != this.props.settings.city) {
      this.props = nextProps;
      this.setState({
        sliderValue: 250,
        dateValue: null
      })

    }
  }

  logOut() {
    delete window.localStorage.accessToken;
    window.location = 'http://localhost:8080/';
  }

  changeDate = moment => {
    if (moment[0]) {
      const from = moment[0].format('YYYYMMDD');
      const to = moment[1].format('YYYYMMDD');
      this.setState({
        dateValue: moment
      })
      this.props.updateSettings({ date: [from, to] });
    } else {
      this.setState({
        dateValue: null
      })
      this.props.updateSettings({ date: null });
    }

  };
  changeRange = value => {
    this.props.updateSettings({ range: value });
    this.setState({
      sliderValue: value
    })
  }
  changeCity = value => this.props.updateSettings({ city: value });
  changeGenres = (value) => {
    console.log(value);
    if (value) {
      this.props.updateSettings({ genres: value });
    } else {
      this.props.updateSettings({ genres: null });
    }

    console.log(this.props.settings.genres);
  };

  render() {
    const marks = {
      0: '0 km',
      250: '250 km',
    };

    function formatter(value) {
      return `${value} km`;
    }

    const text = (
      <p style={{ paddingLeft: 24 }}>
        A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be
        found as a welcome guest in many households across the world.
      </p>
    );

    const genre = ['Rock', 'Pop', 'Techno', 'Classical', 'Rap', 'Jazz'];

    const children = [];
    for (let i = 0; i < 6; i++) {
      children.push(<Option key={i} value={genre[i]}>{genre[i]}</Option>);
    }

    const { settings } = this.props;

    return (
      <div id="side-menu">
        <h3 style={{ marginBottom: 16 }}>List of gigs and Settings</h3>
        <Collapse bordered={false} defaultActiveKey={['1']}>
          <Panel
            header={
              <React.Fragment>
                Settings <i className="fa fa-cog fa-lg" style={{ color: '#6e6e6e' }} />
              </React.Fragment>
            }
            key="1"
          >
            <h5>Choose date</h5>
            {/* <DatePicker onChange={this.changeDate} value={settings.date}/> */}
            <RangePicker onChange={this.changeDate} format={dateFormat} value={this.state.dateValue} />
            <h5>Area range</h5>
            <Slider
              id='slider'
              marks={marks}
              defaultValue={20}
              max={250}
              tipFormatter={formatter}
              onChange={this.changeRange}

              value={this.state.sliderValue}
            />
            <h5>Change city</h5>
            <Input.Search
              style={{ width: 300 }}
              placeholder="input here"
              onSearch={value => this.changeCity(value)}
              enterButton
            />
            <h5>Choose genres</h5>
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.changeGenres}
            >
              {children}
            </Select>
          </Panel>
        </Collapse>
        <div className='list'>
          <List
            itemLayout="horizontal"
            dataSource={this.props.gigs}
            renderItem={item => (
              <List.Item>
                <a href={item.url} target="_blank">
                  {item.title} {item.start_time}
                </a>
              </List.Item>
            )}
          />
        </div>
        <footer className="text-center">
          <Button type="danger" className="logout " size="large" onClick={this.logOut}>
            Log out
          </Button>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = ({ gigs, settings }) => ({
  settings,
  gigs,
});

const mapDispatchToProps = dispatch => ({
  updateSettings: setting =>
    dispatch({
      type: actions.UPDATE_SETTINGS,
      payload: setting,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
