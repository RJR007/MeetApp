import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Platform, TouchableOpacity, Image } from 'react-native';
import { signIn, signUp, forgotPassword} from '../firebase';
import SimpleToast from "react-native-simple-toast";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("signIn");
  async function handelPress() {
    const emailPat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (email == "" || email == emailPat) {
      SimpleToast.showWithGravity("Enter valid Email Id!", SimpleToast.LONG, SimpleToast.CENTER);
      return false;
    }
    if (password == "" || password.length < 6) {
      SimpleToast.showWithGravity("Enter password at least 6 character!", SimpleToast.LONG, SimpleToast.CENTER);
      return false;
    }
    if (mode === "signUp") {
      if (password !== confirmPassword) {
        SimpleToast.showWithGravity("Enter confirm password same as password! ", SimpleToast.LONG, SimpleToast.CENTER);
        return false;
      }
      await signUp(email, password);
    }
    if (mode === "signIn") {
      await signIn(email, password);
  }
}
async function HandleForgotPassword(){
  await forgotPassword(email);
}
  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../assets/mapp.jpeg')}
          style={styles.logo}
          resizeMode="cover" />
        <Text style={styles.Wtext}>Welcome To MeetApp</Text>
      </View>
      <View style={styles.inContainer}>

        <View style={{ alignItems: 'center', borderRadius: 10 }}>
          <TextInput
            placeholder='Email-Id'
            style={styles.eView}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={{ alignItems: 'center', borderRadius: 10 }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder='Password'
            style={styles.eView}
            secureTextEntry={true}
          />
        </View>
        {mode === "signUp" ?
          <View style={{ alignItems: 'center', borderRadius: 10 }}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder='Confirm Password'
              style={styles.eView}
              secureTextEntry={true}
            />
          </View> : null}
        <View style={{ padding: '7%' }}>
          <TouchableOpacity style={{
            backgroundColor: '#710193',
            //borderRadius:20,
            height: 'auto',
            alignContent: 'center'
          }}
            onPress={handelPress}
          >
            {mode !== "signUp" ?
              <Text style={{ alignSelf: 'center', padding: 9, fontSize: 20, color: '#ffffff' }}>Sign In</Text>
              :
              <Text style={{ alignSelf: 'center', padding: 9, fontSize: 20, color: '#ffffff' }}>Sign Up</Text>
            }
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ marginTop: 15 }}
          onPress={HandleForgotPassword}>
          <Text style={styles.foot} >
            {mode === 'signIn'
              ? "Forgot Password!"
              : null}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 15 }}
          onPress={() => mode === 'signUp' ? setMode('signIn') : setMode("signUp")}>
          <Text style={styles.foot} >
            {mode === 'signUp'
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? '30%' : '30%',
    backgroundColor: '#E9CFEC',
    flexDirection: 'column',
    height: "auto"
  },
  inContainer: {
    paddingVertical: '15%',
    paddingHorizontal: '0%',
    backgroundColor: 'white',
    height: 'auto',
    width: '100%',
    shadowOpacity: 0.8,
    shadowColor: 'black',
    shadowRadius: 8,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25
  },
  eView: {
    width: '88%',
    height: 50,
    backgroundColor: '#AF69EF',
    // borderBottomWidth: 1.5,
    // borderBottomColor:'#000',
    borderRadius: 20,
    paddingLeft: 20,
    fontSize: 20,
    color: '#ffffff',
    margin: 5
  },
  txtConView: {
    paddingVertical: 0,
    height: 'auto',
    backgroundColor: '#710193',
  },
  Wtext: {
    color: '#710193',
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
    padding: 10,
    shadowOpacity: 0.8,
    textShadowColor: '#000000',
  },
  logo: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 20,
    resizeMode: 'cover',
    shadowOpacity: 0.8,
    shadowColor: 'black',
    shadowRadius: 8,
  },
  foot: {
    color: "#710193",
    textAlign: "center",
    fontSize: 16,
  }
});
export default SignIn;