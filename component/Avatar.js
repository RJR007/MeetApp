import React from "react";
import { Image } from "react-native";

const Avatar = ({size, user}) =>{
    return(
       <Image style={{
        width:size,
        height:size,
        borderRadius:60,
        backgroundColor:'#AF69EF'
       }} 
       source={user.photoURL ? {uri : user.photoURL} : require('../assets/icon-user.jpeg')}
       resizeMode="cover"
       />
    )
}

export default Avatar; 