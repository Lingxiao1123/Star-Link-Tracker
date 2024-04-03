import React, { Component } from "react";
import { Button, Checkbox, Spin } from "antd";
import { Avatar, List } from "antd";
import satellite from "../assets/images/satellite.svg";

class SatelliteList extends Component {
  state = {
    selected: [],
  };
  onChange = (e) => {
    //step1:get satInfo and checked status
    //step2:add or remove to/from the selected
    const { dataInfo, checked } = e.target;
    const { selected } = this.state;
    const list = this.addOrRemove(dataInfo, checked, selected);
    this.setState({ selected: list });
  };
  addOrRemove = (item, status, list) => {
    //case1 :check is true
    //  -item not in list =>add it
    //case2 :check is false
    //  -item in the list => remove it
    const found = list.some((entry) => entry.satid === item.satid);
    if (!found && status) {
      list = [...list, item];
    }
    if (found && !status) {
      list = list.filter((entry) => entry.satid !== item.satid);
    }
    //console.log(list)
    return list;
  };

  onShowSatMap = () => {
    this.props.onShowMap(this.state.selected);
  };

  render() {
    const satList = this.props.satInfo ? this.props.satInfo.above : [];
    const { isLoad } = this.props;
    const { selected } = this.state;

    return (
      <div className="sat-list-box">
        <Button
          className="sat-list-btn"
          type="primary"
          disabled={selected.length === 0}
          onClick={this.onShowSatMap}
        >
          Track
        </Button>
        <hr />
        {isLoad ? (
          <div className="spin-box">
            <Spin tip="Loading..." size="large" />
          </div>
        ) : (
          <List
            className="sat-list"
            itemLayout="horizontal"
            size="small"
            dataSource={satList}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Checkbox dataInfo={item} onChange={this.onChange} />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size={50} src={satellite} />}
                  title={<p>{item.satname}</p>}
                  description={`Launch Date: ${item.launchDate}`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

export default SatelliteList;
