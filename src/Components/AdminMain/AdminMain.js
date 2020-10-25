import React, {Component} from "react"
import "./AdminMain.css"
import AdminMessages from "../AdminMessages/AdminMessages"
import Axios from "axios"

export default class AdminMain extends Component{
    constructor(){
        super()
        this.state = {
            description:""
        }
    }

    handleDescChange(e){
        this.setState({
            description:e.target.value
        });
        console.log("Setting state: ", this.state)
    }

    createDeal(){
        Axios.post("/api/create-deal", {description:this.state}).then(response =>{
            console.log("Created new deal.")
        })
    }
    render(){
        let view;
        if(this.props.dataToShow === 'room-data'){
            view = <AdminMessages messages ={this.props.messages}/>
        }
        else if(this.props.dataToShow ==='drinks-sent'){
            view = <div>Drinks sent in your establishment</div>
        }
        else if(this.props.dataToShow === 'data-dashboard'){
            view = <div>Data Dashboard</div>
        }
        else if(this.props.dataToShow === "admin-actions"){
            view = <div>Admin Actions
                <h1>New Drink Deal</h1>
                <p>Description:</p>
                <input placeholder="Description" onChange={(e) => this.handleDescChange(e)}></input>
                <button onClick ={() => this.createDeal()}>Submit</button>
            </div>
        }
        else{
            view = <div>None Selected</div>
        }
        return(
            <div className = "AdminMain-Parent">
                <header className = "mainViewHeader">
                    {this.props.dataToShow}
                </header>
                <div>
                    <span>
                        Rooms
                    </span>
                    <select style={{width:"100px"}}>

                    </select>
                </div>
                {view}
            </div>
        )
    }
}