import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View,Text,TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { sign_Out } from "../firebase";
import {Picker}  from "@react-native-picker/picker";
import {PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory} from "react-native-power-translator"
//TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyB5ip6KC-9KCIjO9Q7Rm47dYJDmOdjLgM0','hi');
const axios = require('axios').default;

const Status = () =>{ 
    const [from,setFrom]=useState("en");
    const [to,setTo]=useState("en");
    const [input,setInput]=useState("");
    const [output,setOutput]=useState("");
    const navigation=useNavigation();
    const [selectedLang,setSelectedLang]=useState("");
    const [options,setOptions]=useState([]);
    //const translator = TranslatorFactory.createTranslator();
    //const {t}=translator.translate("message");

    

    async function translate () {
        const res = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
                q: input,
                source: from,
                target: to,
                format: "text",
                api_key: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
            }),
            headers: { "Content-Type": "application/json" }
        });

        const result = await res.json();
        // console.log(res.redirected);
        setOutput(result.translatedText);

        // const params = new URLSearchParams();
        // params.append('q', input);
        // params.append('source', from);
        // params.append('target', to);
        // params.append('api_key', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        // console.log(params);
        // axios.post("https://libretranslate.de",{params},
        //     {
        //         headers: {
        //             'accept': 'application/json',
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //         }
        //     }).then((res)=>{
        //         console.log(res.data);
        //         setOutput(res.data.translatedText);
        //     }
        //     ).catch((e)=>{
        //         console.log(e);
        //     })
    }
     
    useEffect(()=>{
        axios.get('https://libretranslate.de/languages',
        {headers:{'accept': 'application/json'}}).then(res =>{
            setOptions(res.data); 
        })
    },[])

   // curl -X POST "https://libretranslate.de/detect" -H  "accept: application/json" -H  "Content-Type: application/x-www-form-urlencoded" -d "q=Hello%20world!&api_key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

    return(
        <View style={styles.container}>
            <Text style={{fontSize:22,paddingLeft:10}}>Select From Language:</Text>
            <Picker
            style={styles.pick}
            selectedValue={from}
             onValueChange={(itemValue,itemIndex)=>setFrom(itemValue)}
            >
                {options.map(opt =>  <Picker.Item key={opt.code} label={opt.name}  value={opt.code} />)}
            </Picker>
            <Text style={{fontSize:22,paddingLeft:10}}>Select To Language:</Text>
            <Picker
            style={styles.pick}
            selectedValue={to}
             onValueChange={(itemValue,itemIndex)=>setTo(itemValue)}
            >
                {options.map(opt =>  <Picker.Item key={opt.code} label={opt.name}  value={opt.code} />)}
              
            </Picker>
            <TextInput 
             multiline={true}
             numberOfLines={4}
            style={styles.box}
            placeholder="Enter text"
            onChangeText={(e)=>setInput(e)}
            //value={input}
            />
            <TextInput 
            multiline={true}
            numberOfLines={4}
            style={styles.box}
            placeholder="Translation"
            value={output}
            editable={false}
            //onChangeText={setOutput}
             
            />
            <TouchableOpacity
            style={styles.logoutB}
            onPress={e=>translate()}
            >
                <Text style={styles.logot}>Translate</Text>
            </TouchableOpacity>
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
    pick:{
        height: 50,  
        width: "70%",  
        color: '#710193',
        backgroundColor:"#E9CFEC"  ,
        justifyContent:"center",
        marginHorizontal:"14%" ,
        margin: 10,
        
    },
    logoutB:{
        justifyContent:"center",
        backgroundColor:"#710193",
        margin:10,
        height:50
    },
    box:{
        width: '90%',
        height: "auto",
        justifyContent:"center",
        backgroundColor: '#AF69EF',
        // borderBottomWidth: 1.5,
        // borderBottomColor:'#000',
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 20,
        color: '#ffffff',
        marginLeft:20,
        marginTop:10
    },
    logot:{
        fontSize:22,
        textAlign:"center",
        color:"#ffffff",
        justifyContent:"center",
    }
})

export default Status;