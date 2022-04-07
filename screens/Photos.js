import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View,Text } from "react-native";
import { pickImage } from "../utility";

const Photo = () =>{
    const navigation = useNavigation();
    const [cancelled, setCancelled]= useState(false);
     useEffect(()=>{
        const unsubscribe = navigation.addListener("focus", async() => {
            const result =await pickImage(); 
            navigation.navigate("Contacts",{image: result});
            if(result.cancelled){
                setCancelled(true);
                setTimeout(() => navigation.navigate("Chats"), 100);
            }
        });
        return ()=> unsubscribe() 
     },[navigation, cancelled ]);
    return(
        <View />
    )
}

export default Photo;