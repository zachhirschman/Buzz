import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import Map from '../GoogleMaps/GoogleMaps'
import AvailableRooms from "../Room/AvailableRooms/AvailableRooms"
import CurrentRoom from '../Room/CurrentRoom/CurrentRoom';
import './dashboard.css';
import Axios from 'axios';
import { connect } from "react-redux"
import { updateCurrentUser } from "../../redux/reducer"
import NavBar from "../NavBar/Navbar"

const socket = socketIOClient("http://localhost:4000/");

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentHive: false,
            width: window.innerWidth
        }
    }
    //Get user data on mount
    componentDidMount = () => {
        Axios.get("/api/user-data").then(userData => {
            this.props.updateCurrentUser(userData.data)
        })
    }
    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }
    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    toggleHiveView = () => {
        this.setState({
            currentHive: !this.state.currentHive
        })
    }

    render() {
        console.log(this.state.width)
        let dashView
        if(this.state.width >= 500){
            dashView = (
                <div>
                    <div className='dashboard-container'>
                    <div className='hive-container'>
                        {
                            this.state.currentHive ?
                                <CurrentRoom socket={socket} toggleHiveView={this.toggleHiveView} />
                                :
                                <AvailableRooms socket={socket} toggleHiveView={this.toggleHiveView} />
                        }
                    </div>

                        <div className='map-container'>
                            <Map />
                        </div>
                    </div>
                </div>
            ) 
        }
        else{
            dashView = (
                <div className='map-container__responsive'>
                            <Map />
                            <NavBar/>
                        </div>
            )
        }
        return (
            <div>
                {dashView}
            </div>
        )
    }
}
export default connect(null, { updateCurrentUser })(Dashboard)
