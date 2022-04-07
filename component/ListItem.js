import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View,Text,TouchableOpacity,ImageBackground } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import Avatar  from "./Avatar";

function ListItem({type, description, user, style, time, room, image}){
    const navigation=useNavigation();
    return(
        <View
        style={{borderRadius:30}}
        >
            <ImageBackground
            resizeMode="cover"
            source={require('../assets/chatBG.jpg')}
            style={{borderBottomEndRadius:30}}
            >
            <TouchableOpacity 
            style={{ height:65 , ...style}}
            onPress={() => navigation.navigate('Chat',{user, room, image})}
            >
            <Grid style={{maxHeight:80,borderRadius:10}}>  
                <Col style={{width:80,alignItems:'center',justifyContent:"center"}}>
                    <Avatar user={user} size= {type === 'Contacts' ? 40 : 60}/>
                    <View
                    style={{
                    borderBottomColor: 'gray',
                    borderBottomWidth: 1,
                    }}
                />
                </Col>
                <Col style={{marginLeft:0}}>
                    <Row style={{alignItems:'center',}}>
                        <Col>
                            <Text 
                                style={{
                                    fontWeight:'bold',
                                    fontSize:16,
                                    color:"black",
                                }}
                            >
                                {user.contactName || user.displayName}
                            </Text>
                        </Col>
                        {time && (
                            <Col style={{alignItems:"flex-end"}}>
                                <Text style={{ fontSize:12 }}>
                                    {new Date(time.seconds * 1000 ).toLocaleDateString()}
                                </Text>
                            </Col>
                        )} 
                    </Row>
                    {description && (
                        <Row style={{marginTop: 5}}>
                             <Text style={{fontSize:13}} > { description } </Text>
                        </Row>
                    )}
                </Col>
                
            </Grid>
        </TouchableOpacity>
        </ImageBackground>
        </View>
    )
}

export default ListItem;