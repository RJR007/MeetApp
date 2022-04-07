import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View,Text,ImageBackground } from "react-native";
import { auth, db } from "../firebase";
import GlobalContext from "../context/Context";
import ContactIcon from "../component/ContactsIcon";
import ListItem from "../component/ListItem";
import useContacts from "../hooks/useHooks";
const Chats = () =>{
    const {rooms,setRooms, setUnfilteredRooms }= useContext(GlobalContext);
    const {currentUser} =auth;
    const contacts = useContacts();
    const ChatsQuery = query(
        collection(db,"rooms"), 
        where("participantsArray","array-contains",currentUser.email),
    );
    useEffect(() => {
        const unsubscribe = onSnapshot(ChatsQuery,(querySnapshot) =>{
          const parsedChats = querySnapshot.docs 
                .map((doc) => ({
                  ...doc.data(),
                  id:doc.id,
                  userB:doc  
                  .data()
                  .participants.find((p) => p.email !== currentUser.email ),
              }) );
            setUnfilteredRooms(parsedChats);
            setRooms(parsedChats.filter((doc) => doc.lastMessage));
        });
        return () => unsubscribe();
    },[]);

    function getUserB(user, contacts){
        const userContact =contacts.find((c) => c.email === user.email);
        if(userContact && userContact.contactName){
            return {...user, contactName : userContact.contactName};
        } 
        return user;
    }
    return(
        <ImageBackground
                resizeMode="cover"
                source={require('../assets/chatBG.jpg')}
                style={{flex:1,borderRadius:10}}
                >
        <View style={{
            width:"100%",
            height:"100%",
            padding:5,
            paddingRight:10,
            borderRadius:20,
            margin:1
            }}>
            {rooms.map((room)=> (
                <ListItem 
                    type="Chat"
                    description={room.lastMessage.text}
                    key={room.id}
                    room={room}
                    time={room.lastMessage.createdAt}
                    user={getUserB(room.userB, contacts)}
                    />    
                )   
            )}
            <ContactIcon />
        </View>   
        </ImageBackground>
    )
}

export default Chats;