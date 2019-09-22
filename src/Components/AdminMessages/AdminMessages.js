import React from "react"
import "./AdminMessages.css"

export default function AdminMessages(props){
    console.log("props: ", props)
    const mappedMessages = props.messages.map((e,i) =>{
        return (
        <div className = "message-parent">
            <div className = "user-information">
                <img src = {e.picture} className = "message-picture"/>
                <p className = "user-name">{e.profile_name}</p>
            </div>
            <div className = "post-content">
               <p>{e.post_content}</p> 
            </div>
        </div>
        )
    })
    return(
        <div className = "messages-parent">{mappedMessages}</div>
    )
}