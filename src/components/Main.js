import React, {Component} from 'react';
import { Row, Col } from 'antd';
import SatSetting from "./SatSetting";
import SatelliteList from "./SatelliteList";
import axios from "axios";
import { SAT_API_KEY,BASE_URL, NEARBY_SATELLITE, STARLINK_CATEGORY } from "../constant";
import WorldMap from './WorldMap'

class Main extends Component {
    //创建状态值：使每次从后端拿到数据后都自动跟新SatelliteList
    //通过state来调整状态
    state = {
        setting: {},
        satInfo: {},
        satList: [],
        isLoadingList: false    //修改icon
    }

    //callback -> set setting,拿setting数据：子->父
    showNearbySatellite = (setting) => {
        console.log('show nearby')
        this.setState({setting: setting})
        this.fetchSatellite(setting);
    }
    fetchSatellite = setting =>{
        //step1 : get settings
        //step2 : send req to the server and display loading icon
        //step3 : get the res from the server
        //case1 : success ->update satList, unmount loading icon
        //case2 : fail -> inform users unmount loading icon
        //setting中结构数据
        const { latitude, longitude, elevation, altitude } = setting;
        //deploy的后端URL
        const url = `${BASE_URL}/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        this.setState({isLoadingList: true});

        axios.get(url)
            .then(res => {
                if(res.status === 200){
                    console.log(res.data);
                    this.setState({
                        satInfo: res.data,
                        isLoadingList: false
                    })
                }
            })
            .catch( error => {
                console.log('err in fetch satellite -> ', error);
            })
            .finally( () => {
                this.setState({ isLoadingList: false })
            })
    }
    //子到父，定义cb,在标签处传入 key = cb的reference
    showMap = selected =>{
        this.setState(preState =>({
            ...preState,
            satList:[...selected]
        }))
    }

    render() {
        const { satInfo, isLoadingList, satList, setting } = this.state;
        return (
            <Row className = "main">
                <Col span={8} className="left-side">
                    <SatSetting onshow = {this.showNearbySatellite}/>
                    <SatelliteList satInfo = {satInfo}
                                   isLoad = {isLoadingList}
                                   onShowMap = {this.showMap}
                    />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData = {satList} observerData = {setting}/>
                </Col>
            </Row>
        );
    }
}

export default Main;