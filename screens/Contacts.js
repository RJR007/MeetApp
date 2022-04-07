import { useRoute } from "@react-navigation/native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View,Text, FlatList } from "react-native";
import ListItem from "../component/ListItem";
import GlobalContext from "../context/Context";
import { db } from "../firebase";
import useContacts from "../hooks/useHooks";

const Contacts = () =>{
    const contact = useContacts();
    const route =useRoute();
    const image = route.params && route.params.image;
    return(
        <FlatList 
            style={{flex:1,padding:5}} 
            data={contact} 
            keyExtractor={(_, i) => i}    
            renderItem={({item}) => <ContactPreview contact={item} image={image} />  }
        />
    ); 
}

function ContactPreview({contact, image}){
    const {unfilteredRooms, rooms} = useContext(GlobalContext);
    const [user, setUser] = useState(contact);
    useEffect(()=>{
        const q = query(
            collection(db,"users"),
            where("email", "==", contact.email)
        )  
        const unsubscribe= onSnapshot(q, snapshot => {  
            if(snapshot.docs.length){
                const userDoc= snapshot.docs[0].data()
                setUser((prevUser) => ({ ...prevUser, userDoc}));
            }
        })
        return () => unsubscribe();
    },[]);
    return (
        <ListItem style={{marginTop:3 }} 
            type="Contacts" 
            user={user} 
            image={image} 
            room={unfilteredRooms.find((room) => room.participantsArray.includes(contact.email))}
        />
    )   
}

export default Contacts; 