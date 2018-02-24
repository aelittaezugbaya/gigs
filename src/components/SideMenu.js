import React from 'react';
import { List } from 'antd';
import 'antd/lib/list/style/css'

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export default class SideMenu extends React.Component{
    render(){
        return(
            <div>
                <h3 style={{ marginBottom: 16 }}>List of gigs</h3>
                <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (<List.Item>{item}</List.Item>)}
                />
          </div>
        )
    }
}