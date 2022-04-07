
import * as ImagePicker from  'expo-image-picker';
import "react-native-get-random-values";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { storege } from './firebase';

export async function pickImage(){
    let result=ImagePicker.launchCameraAsync();
    return  result;
}
 
export async function  askForPermission(){
    const {status}= await ImagePicker.requestCameraPermissionsAsync();
    return status;
}

export async function uploadImage(uri,path,fname){
    const blob = await new Promise((resolve,reject) =>{
        const xhr = new XMLHttpRequest();
        xhr.onload = function(){
        resolve(xhr.response);
    };
    xhr.onerror = function (e){
        console.log(e);
        reject(new TypeError('Network request failed'));
    };
    xhr.responseType ="blob";
    xhr.open("GET",uri,true);
    xhr.send(null);
    });
    const fileName = fname || nanoid();
    const imageRef = ref(storege,`${path}/${fileName}.jpeg`);

    const snapShot = await uploadBytes(imageRef,blob,{
        contentType: "image/jpeg",
    });

    blob.close();

    const url = await getDownloadURL(snapShot.ref);
    
    return {url,fileName};
}