import {useEffect,useState} from "react";
import * as Contacts from "expo-contacts";

export default function useContacts(){
    const [contacts,Setcontacts] =useState([]);
    useEffect(()=>{
        (async () => {
            const {status} = await Contacts.requestPermissionsAsync();
            if(status === 'granted'){
                const {data} = await Contacts.getContactsAsync({
                    fields:[Contacts.Fields.Emails]
                })
                if(data.length > 0){
                    Setcontacts(
                        data.filter(
                            c => c.firstName && c.emails && c.emails[0] && c.emails[0].email
                        ).map(mapContactTopUser)
                    );
                }
            }
        })();
    },[]);
    return contacts; 
}

function mapContactTopUser(contact){
    return{
        contactName: contact.firstName && contact.lastName 
            ? `${contact.firstName} ${contact.lastName}` 
            : contact.firstName,
        email:contact.emails[0].email
    };
}