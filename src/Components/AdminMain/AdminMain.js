import React, {Component} from "react"
import "./AdminMain.css"
import AdminMessages from "../AdminMessages/AdminMessages"

export default class AdminMain extends Component{
    constructor(){
        super()
        this.state = {
        }
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
        else{
            view = <div>None Selected</div>
        }
        return(
            <div className = "AdminMain-Parent">
                <header className = "mainViewHeader">
                    {this.props.dataToShow}
                </header>
                {view}
            </div>
        )
    }
}