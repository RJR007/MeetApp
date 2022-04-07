import { StatusBar } from "expo-status-bar";
import React, { useDebugValue, useEffect, useState } from "react";
import {View, Text,Button,StyleSheet,Image} from "react-native";
import Consatnts from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { pickImage,askForPermission, uploadImage } from "../utility";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";


function Profile(){
    const [displayName, setDisplayName]=useState("");
    const [selectedImage, setSelectedImage]=useState(null);
    const [permissionStatus, setPermissionStatus]=useState(null);
    const navigation =useNavigation();
    useEffect(() => {
        (async ()=>{
            const status = await askForPermission();
            setPermissionStatus(status);
        })()
    },[])
    async function handelNextPress(){
       const user = auth.currentUser
       let PhotoURL;
       if(selectedImage){
        const{url} = await uploadImage(selectedImage,`images/${user.uid}`, "profilePicture");
        PhotoURL = url;
       }
       const userData = {
           displayName,
           email:user.email
       }
       if(PhotoURL){
           userData.PhotoURL= PhotoURL;
       }
       await Promise.all([
           updateProfile(user,userData),
           setDoc(doc(db,"users",user.uid),{...userData,uid:user.uid})
       ])
        navigation.navigate('Home');
    }
    async function handelProfilePhoto(){
        const result = await pickImage();
        if(!result.cancelled){
            setSelectedImage(result.uri)
        }
    }
     
    if(!permissionStatus){
        return <Text>Loading...</Text>
    }
    if(permissionStatus !== 'granted'){
        return <Text>You need to allow this permission</Text>
        
    }
    return(
    <React.Fragment>
        <StatusBar style="auto"/>
        <View style={{
            flex:1,
            justifyContent:"center",
            alignItems:"center",
            paddingTop: Consatnts.statusBarHeight + 20,
            padding:20 
            }}>
        <Text style={{
            fontSize:22,
            color:"#710193",
            fontWeight:"bold"
        }} >
         Profile Info
        </Text>
        <Text style={{ 
            fontSize:16,
            color:"#710193",
            fontWeight:"normal",
            marginTop:10
        }}>
            Please provide your name and profile photo
        </Text> 
        <TouchableOpacity 
        onPress={handelProfilePhoto}
        style={{
            marginTop:30,
            borderRadius:120,
            width:120,
            height:120,
            backgroundColor: '#E9CFEC',
            alignItems:'center',
            justifyContent:"center",            
            }}>
            {!selectedImage 
            ? (<MaterialCommunityIcons name="camera-plus" color="grey" size={45}/>)
            : <Image source={{uri: selectedImage}}
                style={{width:"100%",height:"100%",borderRadius:120}}
            />}
        </TouchableOpacity>
        <View style={styles.Container}>
        <TextInput
        placeholder="Type your name..." 
        value={displayName }
        onChangeText={setDisplayName} 
        style={styles.tName}
        />
        <View style={{borderRadius:25,marginTop:20}}>
        <TouchableOpacity style={{
            backgroundColor:'#710193' ,
            // borderRadius:20,
            height:'auto',
            alignContent:'center' 
      
            }}
        onPress={handelNextPress}
        disabled={!displayName}
        >
        <Text style={{alignSelf:'center',padding:9,fontSize:20,color:'#ffffff'}}>Next</Text>
        </TouchableOpacity>
        </View>
        </View>
        </View>
    </React.Fragment>
)
}
const styles=StyleSheet.create({
    Container: {
        paddingVertical:'5%',
        paddingHorizontal:'5%',
        backgroundColor:'white',
        height:'auto',
        width:'100%',
        shadowOpacity:0.8,
        shadowColor:'black',
        shadowRadius:8,
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        marginTop:10,
        
      },
      tName:{
        width: '100%',
        height: 50,
        backgroundColor: '#AF69EF',
        // borderBottomWidth: 1.5,
        // borderBottomColor:'#000',
        borderRadius:20,
        paddingLeft:20,
        fontSize:20,
        color:'#ffffff',
      },
});
export default Profile;