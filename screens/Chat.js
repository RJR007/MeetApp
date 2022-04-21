// @refresh reset
import { useRoute } from "@react-navigation/native";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Image } from "react-native";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { Actions, Bubble, GiftedChat, InputToolbar, MessageText } from "react-native-gifted-chat";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { pickImage, uploadImage } from '../utility';
import ImageView from "react-native-image-viewing";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Status from "./Status"
const axios = require('axios').default;


const randomId = nanoid();

const Chat = () => {
    const [roomHash, setRoomHash] = useState("");
    const [messages, setMessages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageView, setSelectedImageView] = useState("");
    const { currentUser } = auth;
    const route = useRoute();
    const room = route.params.room;
    const { showActionSheetWithOptions } = useActionSheet();
    const [res , setRes] = useState("");
    const [input,setInput]=useState("");

    const selectedImage = route.params.image;
    const userB = route.params.user;

    const senderUser = currentUser.photoURL
        ? {
            name: currentUser.displayName,
            _id: currentUser.uid,
            avatar: currentUser.photoURL,
        }
        : { name: currentUser.displayName, _id: currentUser.uid };

    const roomId = room ? room.id : randomId;
    const roomRef = doc(db, "rooms", roomId);
    const roomMessageRef = collection(db, "rooms", roomId, "messages");

    useEffect(() => {
        (async () => {
            if (!room) {
                const currUserData = {
                    displayName: currentUser.displayName,
                    email: currentUser.email
                }
                if (currentUser.photoURL) {
                    currUserData.photoURL = currentUser.photoURL
                }
                const userBData = {
                    displayName: userB.contactName || userB.displayName || "",
                    email: userB.email,
                }
                if (userB.photoURL) {
                    userBData.photoURL = userB.photoURL
                }
                const roomData = {
                    participants: [currUserData, userBData],
                    participantsArray: [currentUser.email, userB.email]

                }
                try {
                    await setDoc(roomRef, roomData);
                } catch (error) {
                    console.log(error);
                }
            }
            const emailHash = `${currentUser.email}:${userB.email}`;
            setRoomHash(emailHash);
            if (selectedImage && selectedImage.uri) {
                await sendImage(selectedImage.uri, emailHash);
            }
        })();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(roomMessageRef, (querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === 'added')
                .map(({ doc }) => {
                    const message = doc.data();
                    return { ...message, createdAt: message.createdAt.toDate() };
                }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            appendMessages(messagesFirestore);
            
            
        });
        return () => unsubscribe();
    }, []);


    const appendMessages = useCallback((messages) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
           
        );
    }, [messages]);

    async function translator(input){
        const params = {
            q : input,
            source : 'en',
            target : 'hi',
            api_key : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
          }
          axios.post('https://libretranslate.de/translate',params)
          .then(result => {
            setRes(result.data.translatedText)
            console.log(result.data.translatedText)})
          .catch(error => console.error(error))
        // const params = new URLSearchParams();
        // params.append('q', text);
        // params.append('source', "en");
        // params.append('target', "hi");
        // params.append('api_key', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        // console.log(params);
        // axios.post("https://libretranslate.de/docs/#/translate/post_translate",{params},
        //     {
        //         headers: {
        //             'accept': 'application/json',
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //         }
        //     }).then((res)=>{
        //         console.log(res.data);
        //         console.log(res.data.translatedText);
        //     }
        //     ).catch((e)=>{
        //         console.log(e);
        //     })
    //     const res = await fetch("https://libretranslate.de/translate", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             q:input,
    //             source: "en",
    //             target: "hi",
    //             format: "text"
    //         }),
    //         headers: { "Content-Type": "application/json" }
    //     });
    //     //console.log(res);
    //      const result = await res.json();
    //      //console.log(res.json()); 
    //     const langtrans=result.translatedText;
    //   setRes(langtrans);
    
    }

    async function onSend(messages = []) {
        const writes = messages.map(m => addDoc(roomMessageRef, m));
        const lastMessage = messages[messages.length - 1];
        writes.push(updateDoc(roomRef, { lastMessage }));
        await Promise.all(writes);
    }
    async function sendImage(uri, roomPath) {
        const { url, fileName } = await uploadImage(
            uri,
            `image/rooms/${roomPath || roomHash}`
        )
        const message = {
            _id: fileName,
            text: '',
            createdAt: new Date(),
            user: senderUser,
            image: url,
        }
        const lastMessage = { ...message, text: "Image" };
        await Promise.all([addDoc(roomMessageRef, message), updateDoc(roomRef, { lastMessage }),]);
    }
    async function handelPhotoPicker() {
        const result = await pickImage()
        if (!result.cancelled) {
            await sendImage(result.uri);
        }
    }
    function onDelete(messageIdToDelete) {
        this.setState(previousState =>
            ({ messages: previousState.messages.filter(message => message.id !== messageIdToDelete) }))
    }
    function onLongPress(message) {
        const options = ['copy', 'Delete Message', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        showActionSheetWithOptions({
            options,
            cancelButtonIndex,
            
        }, (buttonIndex) => {
            
            switch (buttonIndex) {
                case 0:
                    Clipboard.setString(message.text);
                    break;
                case 1:
                    onDelete(messageIdToDelete)
                    break;
            }
        });
    }
    return (
        <ImageBackground
            resizeMode="cover"
            source={require('../assets/chatBG.jpg')}
            style={{ width: "100%", height: "100%" }}
        >
            <GiftedChat
                onSend={onSend}
                messages={ messages}
                user={senderUser}
                renderAvatar={null}
                renderActions={(props) => (
                    <Actions
                        {...props}
                        containerStyle={{
                            position: 'absolute',
                            right: 50,
                            bottom: 3,
                            zIndex: 9999
                        }}
                        onPressActionButton={handelPhotoPicker}
                        icon={() => (<Ionicons name="ios-camera" size={28} color="#710193" />)}
                    />
                )}
                renderSend={(props) => {
                    const { text, messageIdGenerator, user, onSend } = props;
                    return (
                        <TouchableOpacity
                            style={{
                                height: 40,
                                width: 40,
                                backgroundColor: "#710193",
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 2,
                                borderRadius: 30
                            }}
                            onPress={() => {
                                if (text && onSend) {
                                    onSend({
                                        text:text.trim(),
                                        user,
                                        _id: messageIdGenerator(),
                                    }, true);
                                    translator(text);
                                }
                            }   
                        }
                        >
                            <MaterialIcons name="send" size={22} color="#ffffff" />
                        </TouchableOpacity>
                    );
                }}
                renderInputToolbar={(props) => (
                    <InputToolbar
                        {...props}
                        containerStyle={{
                            marginLeft: 5,
                            marginRight: 5,
                            marginBottom: 4,
                            borderRadius: 20,
                            padding: 5,
                            marginTop: 10,
                            toFixed: 5
                        }}
                    />
                )}
                renderBubble={(props) => (
                    <Bubble
                        {...props}
                       
                        onLongPress={() =>onLongPress()}
                        textStyle={{
                            right: { color: "#ffffff" }
                        }}
                        wrapperStyle={{
                            right: {
                                backgroundColor: "#AF69EF",
                                marginBottom: 7,

                            },
                            left: {
                                marginBottom: 7,
                            },
                            
                        }}
                    />)}
                     renderMessageText={() =>{
                        // const txt = props.currentMessage.text;
                        // const {currText}=res;
                        
                          return  <Text style={{padding:3,color:"#ffffff",fontSize:14}}> {res} </Text>

                        //console.log(result);
                        console.log(JSON.stringify(res));
                        // return(
                        //     <Text>{res}</Text>
                        //     )
                        }}
                renderMessageImage={(props) => {
                    return (
                        <View style={{ borderRadius: 10, padding: 2 }}>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(true);
                                setSelectedImageView(props.currentMessage.image);
                            }}>
                                <Image
                                    resizeMode="contain"
                                    style={{
                                        width: 200,
                                        height: 200,
                                        padding: 6,
                                        resizeMode: "cover",
                                        borderRadius: 15,
                                    }}
                                    source={{ uri: props.currentMessage.image }}
                                />
                                {selectedImageView ? (
                                    <ImageView
                                        imageIndex={0}
                                        visible={modalVisible}
                                        onRequestClose={() => setModalVisible(false)}
                                        images={[{ uri: selectedImageView }]}
                                    />
                                ) : null}
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </ImageBackground>
    )
}

export default Chat;
