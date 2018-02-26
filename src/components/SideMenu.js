import React from 'react';
import { List } from 'antd';
import { Collapse, Slider, AutoComplete, DatePicker, Select} from 'antd';
const Option = Select.Option;
const Panel = Collapse.Panel;
import 'antd/lib/list/style/css'
import 'antd/lib/collapse/style/css'
import 'antd/lib/slider/style/css'
import 'antd/lib/auto-complete/style/css'
import 'antd/lib/date-picker/style/css'


const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export default class SideMenu extends React.Component{
    
    render(){
        const text = (
            <p style={{ paddingLeft: 24 }}>
              A dog is a type of domesticated animal.
              Known for its loyalty and faithfulness,
              it can be found as a welcome guest in many households across the world.
            </p>
          );

          const genre = ['rock','pop','techno','classic','rap','jazz']


        const children = [];
        for (let i = 0; i < 6; i++) {
        children.push(<Option key={genre[i]}>{genre[i]}</Option>);
        }
        return(
            <div id='side-menu'>
                <h3 style={{ marginBottom: 16 }}>List of gigs and Settings</h3>
                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel header={(
                        <React.Fragment>
                            Settings <i className="fa fa-cog fa-lg" style={{color: '#6e6e6e'}}/>
                        </React.Fragment>
                    )} key="1">
                        <h5>Choose date</h5>
                        <DatePicker/>
                        <h5>Area range</h5>
                        <Slider range defaultValue={[20, 50]} max={250} />
                        <h5>Change center(type another city or town)</h5>
                        <AutoComplete
                            style={{ width: 300 }}
                            placeholder="input here"
                        />
                        <h5>Choose genres</h5>
                         <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                        >
                            {children}
                        </Select>
                        
                    </Panel>
                </Collapse>
                <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (<List.Item>{item}</List.Item>)}
                />
          </div>
        )
    }
}