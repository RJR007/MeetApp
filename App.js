import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React ,{useState,useEffect, Profiler}from 'react';
import {useAssets} from 'expo-asset';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from "./firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs"
import SignIn from './screens/SignIn';
import Profile from './screens/Profile'; 
import { LogBox } from 'react-native';
import Chats from "./screens/Chats";
import Photo from "./screens/Photos";
import Status from "./screens/Status";
import {Ionicons} from "@expo/vector-icons";
import Contacts from "./screens/Contacts";
import Chat from "./screens/Chat";
import ChatHeader from './component/ChatHeader';
import ContextWrapper from './context/ContextWrapper';
LogBox.ignoreLogs([
  "Setting a timer for a long period of time",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release",
  "Remote debugger is in a background tab which may cause apps to perform slowly.",
]); 


const Stack=createStackNavigator();
const Tab =createMaterialTopTabNavigator();

function App() {
  const [currUser, setCurrUser]=useState(null); 
  const [load,setLoad]=useState(true);
  useEffect(()=>{
  const unsubscribe = onAuthStateChanged(auth, (user) =>{
    setLoad(false); 
    if(user){
      setCurrUser(user)
    }
  });
  return () => unsubscribe();
  }, []);
  if(load){
    return <Text style={{flex:1,justifyContent:"center"}}>Loading...</Text>
  }
  return (
    <NavigationContainer>
      {!currUser ?(
        <Stack.Navigator 
        screenOptions={{headerShown: false}}
        >
          <Stack.Screen name="signIn" component={SignIn} />
        </Stack.Navigator>
      ):(
        <Stack.Navigator screenOptions={{ headerStyle:{
          backgroundColor:"#710193",
          shadowOpacity:0,
          elevation:0,
        },
        headerTintColor:"#ffffff"
        }}>
          {!currUser.displayName && (
            <Stack.Screen name='Profile' component={Profile} Options={{headerShown: false}} />
          )}
          <Stack.Screen name='Home' component={Home} options={{title:"MeetApp"}}/>
          <Stack.Screen  
          name='Contacts' component={Contacts}
          options={{title:'Select Contacts'}}
          />
          <Stack.Screen 
            name='Chat' 
            component={Chat} 
            options={{headerTitle:(props) => <ChatHeader {...props} /> }} 
            
            />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function Home(){
  return (
  <Tab.Navigator 
  screenOptions={({route}) =>{
    return {
      tabBarLabel:()=>{
        if(route.name === 'Photo'){
          return <Ionicons name="camera" size={20} color={'#710193'}/>
        } else {
          return (
          <Text 
            style={{color:'#710193'}}
          >
            {route.name.toLocaleUpperCase()}
            </Text>
          );
        } 
      },
      tabBarShowIcon:true,
      tabBarLabelStyle:{
        color:"#710193"
      },
      tabBarIndicatorStyle:{
        backgroundColor:"#710193"
      },
      tabBarStyle :{
        backgroundColor:"#E9CFEC",
        borderRadius:20
      }
    };
    
  }}
  initialRouteName="Chats"
  >
    <Tab.Screen name='Photo' component={Photo} />
    <Tab.Screen name='Chats' component={Chats} />
    <Tab.Screen name='Status' component={Status} /> 
  </Tab.Navigator>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

 function Main(){
  const [assets] = useAssets(
     require("./assets/mapp.jpeg"),
  )
  if(!assets){
    return <Text>Loading...</Text>
  }
  return(
    <ContextWrapper>
    <App/>
    </ContextWrapper>
    );
}
export default Main;