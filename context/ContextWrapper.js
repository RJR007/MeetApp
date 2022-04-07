import { View, Text } from 'react-native';
import Context from './Context'
import React, { useState } from 'react';

export default function ContextWrapper(props) {
    const [rooms, setRooms]= useState([]);
    const [unfilteredRooms, setUnfilteredRooms]= useState([]);
  return (
    <Context.Provider 
        value={{rooms,setRooms, unfilteredRooms, setUnfilteredRooms }}
    >
        {props.children}
    </Context.Provider>
  )
}