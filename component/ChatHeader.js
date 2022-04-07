import { useRoute } from "@react-navigation/native";
import React from "react";
import { View,Text } from "react-native";
import Avatar from "./Avatar";

const ChatHeader = () =>{
    const route =  useRoute();
    return(
        <View style={{flexDirection:"row"}}>
            <View style={{marginLeft:-20}}>
               <Avatar size={40} user={route.params.user} />
            </View>
            <View style={{marginLeft:15,alignItems:"center",justifyContent:"center"}}>
                <Text style={{ color :"#ffffff",fontSize:18}}>
                    {route.params.user.contactName || route.params.displayName}
                </Text>
            </View>
        </View>
    )
}

export default ChatHeader;