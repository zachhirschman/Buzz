import React, {Component} from "react"
import "./AdminNavBar.css"
import {Link} from "react-router-dom"
import beeIcon from '../../images/assets/logo/buzz-logo-yellow-nobg.png';


export default class AdminNavBar extends Component{
    constructor(){
        super()
        this.state = {
           menu:[
            {
                name:'Messages',
                link:'room-data',
                active:false
            },
            {
                name:'Drinks sent',
                link:'drinks-sent',
                active:false
            },
            {
                name:'Stat Dashboard',
                link:'data-dashboard',
                active:false
            },
            {
                name:"Admin Actions",
                link:"admin-actions",
                active:false,
                subLinks:[
                    {name:"Rewards",link:"assign-rewards"},
                    {name:"Promotions",link:"configure-promo"}
                ]
            }
        ]
        }
    }

    setActiveLink(link){
        var copy = this.state.menu.slice()

        copy.map(function(i,v){
            console.log(i.link)
            console.log("V: ", i)
             i.link == link ? i.active = true : i.active = false;
        });

        console.log("Copy: ", copy);
        console.log("Active link: ", link);

        this.setState({
            menu:copy
        });

        this.props.navigate(link);
        
    }

    render(){

        const mappedMenu = this.state.menu.map((e,i) =>{
            return (
                <div className = "menu-button">
                    <div key={i}  onClick ={() =>this.setActiveLink(e.link)}>{e.name}</div>
                    <div className="subLink-parent">

                        {
                            (e.subLinks && e.active)?
                            e.subLinks.map(function(x,y){
                                return(
                                    <div className="subLink">{x.name}</div>
                                )
                            })
                            :
                            null
                        }

                    </div>
                </div>
            )
        })
        return(
            <div className = "AdminNavBar-Parent">
                <div className="dash-link">
                    <Link to="/dashboard"><img height='50' width='50' src={beeIcon} alt='buzz bee logo in yellow' /></Link>
                </div>
                {mappedMenu}
            </div>
        )
    }
}