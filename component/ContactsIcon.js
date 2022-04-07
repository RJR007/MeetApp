import React from "react";
import { View,Text,TouchableOpacity } from "react-native";
import {MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const ContactIcon = () =>{
    const navigation = useNavigation();
    return(
            <TouchableOpacity
                onPress={() => navigation.navigate('Contacts')}
                style={{
                    position:'absolute',
                    right:20,
                    bottom:20,
                    borderRadius:60,
                    width:60,
                    height:60,
                    backgroundColor:"#E9CFEC",
                    alignItems:"center",
                    justifyContent:'center',
                }}
            >
                <MaterialCommunityIcons 
                    name="android-messages"
                    size={30}
                    color="#710193"
                    style={{transform:[{scaleX: -1}]}}
                />
            </TouchableOpacity>
    )
}

export default ContactIcon;