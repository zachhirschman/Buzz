import React, {Component} from "react"
import "./AdminNavBar.css"
import {Link} from "react-router-dom"

export default class AdminNavBar extends Component{
    constructor(){
        super()
        this.state = {
           menu:[
            {
                name:'Messages',
                link:'room-data'
            },
            {
                name:'Drinks sent',
                link:'drinks-sent'
            },
            {
                name:'Stat Dashboard',
                link:'data-dashboard'
            }
        ]
        }
    }
    render(){

        const mappedMenu = this.state.menu.map((e,i) =>{
            return (
                <button key={i} className = "menu-button" onClick ={() =>this.props.navigate(e.link)}>{e.name}</button>
            )
        })
        return(
            <div className = "AdminNavBar-Parent">
                <div>
                    <Link to="/dashboard">Dashboard</Link>
                </div>
                {mappedMenu}
            </div>
        )
    }
}