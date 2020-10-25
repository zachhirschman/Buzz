import React, {Component} from "react"
import Axios from "axios";
import "./AdminDashboard.css"
import AdminNavBar from "../AdminNavBar/AdminNavBar"
import AdminMain from "../AdminMain/AdminMain"

export default class AdminDashbaord extends Component{
    constructor(){
        super()
        this.state ={
            adminPostData:[],
            adminData:[],
            adminRoomData:[],
            dataToShow:'room-data'
        }
    }
    navigate =(menuItem) =>{
        console.log("Changing view: ", menuItem)
        this.setState({
            dataToShow:menuItem
        })
    }
    componentDidMount = () =>{
            Axios.get("/getAdminPosts").then(allAdminPosts =>{
                console.log("Got admin posts: ", allAdminPosts.data)
                this.setState({
                    adminPostData:allAdminPosts.data
                })
            })
            Axios.get("/getUserSession").then(adminData =>{
                console.log("adminData: ", adminData)
                this.setState({
                    adminData:adminData.data
                })
            })
    }
    render(){
        return(
            <div className = "Admin-Dash-Parent">
                <AdminNavBar navigate ={this.navigate}/>
                <AdminMain dataToShow = {this.state.dataToShow} messages ={this.state.adminPostData}/>
            </div>
        )
    }
}

