import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React from "react";
import { View,Text,TouchableOpacity, StyleSheet  } from "react-native";
import { sign_Out } from "../firebase";
const Chats = () =>{
    const navigation=useNavigation();
    return(
        <View style={styles.container}>
            <TouchableOpacity 
            style={styles.logoutB}
            onPress={()=> {
                //navigation.navigate("signIn");
                sign_Out();
            }}
            >
                <Text style={styles.logot}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
    },
    logoutB:{
        justifyContent:"center",
        backgroundColor:"#710193",
        margin:10,
        height:50
    },
    logot:{
        fontSize:22,
        textAlign:"center",
        color:"#ffffff",
    }
})

export default Chats;