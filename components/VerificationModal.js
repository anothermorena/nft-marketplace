import { Modal, View, Text, TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';
// our theme config and other constants
import { COLORS, Constants } from "../constants";
//icons
import {Ionicons} from '@expo/vector-icons';

// get status bar height
const StatusBarHeight = Constants.statusBarHeight;

const VerificationModal = ({modalVisible, setModalVisible,successful,message, persistLoginAfterOTPVerification}) => {
  const buttonHandler = () => { 
    if(successful) {
        persistLoginAfterOTPVerification();
    }
    setModalVisible(false);
  }
  
return (
   <Modal animationType='slide' visible={modalVisible} transparent={true}>
        <View style={{flex:1,padding: 25, paddingTop: StatusBarHeight + 30, justifyContent:'center',alignItems:'center', backgroundColor: 'rgba(0,0,0,0.7)'}}>
            {!successful && <FailContent buttonHandler={buttonHandler} errorMsg={message}/> }
            {successful && <SuccessContent buttonHandler={buttonHandler}/> }
        </View>
   </Modal>
  )
}

//content for the modal
const SuccessContent = ({buttonHandler}) => { 
    return (
        <View style={{margin:20, backgroundColor:COLORS.white, borderRadius: 20, padding:35,alignItems:'center',elevation:5,shadowColor:'black', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25,shadowRadius:4,width:'100%'}}>
            <StatusBar style="dark"/>
             <Ionicons name="checkmark-circle" size={100} color={COLORS.green} />
             <Text style={{fontSize: 25, color:COLORS.tertiary, marginBottom:10, textAlign:'center',fontWeight:'bold', padding:10}}>Verified!</Text>
                <Text style={{color:COLORS.tertiary, marginBottom: 15, fontSize: 15, textAlign:'center'}}>
                    You have successfully verified your account. 😎
                </Text>

                <TouchableOpacity style={{backgroundColor:COLORS.green, flexDirection:'row', padding:15,justifyContent:'center', alignItems:'center', borderRadius:5, marginVertical:5, height:60}} onPress={buttonHandler}>
                    <Text style={{color:COLORS.white, fontSize:16}}>Continue to App </Text>
                    <Ionicons name="arrow-forward-circle" size={25} color={COLORS.white} />
                </TouchableOpacity>
        </View>
    );
};

const FailContent = ({errorMsg, buttonHandler}) => { 
    return (
        <View style={{margin:20, backgroundColor:COLORS.white, borderRadius: 20, padding:35,alignItems:'center',elevation:5,shadowColor:'black', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25,shadowRadius:4,width:'100%'}}>
            <StatusBar style="dark"/>
             <Ionicons name="close-circle" size={100} color={COLORS.red} />
             <Text style={{fontSize: 25, color:COLORS.tertiary, marginBottom:10, textAlign:'center',fontWeight:'bold', padding:10}}>Failed!</Text>
             <Text style={{color:COLORS.tertiary, marginBottom: 15, fontSize: 15, textAlign:'center'}}>
                    {`Oh Oh 😶! Account verification failed. ${errorMsg}.`}
            </Text>

            <TouchableOpacity style={{backgroundColor:COLORS.red, flexDirection:'row', padding:15,justifyContent:'center', alignItems:'center', borderRadius:5, marginVertical:5, height:60}} onPress={buttonHandler}>
                <Text style={{color:COLORS.white, fontSize:16}}>Try Again</Text>
                    <Ionicons name="arrow-redo-circle" size={25} color={COLORS.white} />
            </TouchableOpacity>
        </View>
    );
};

export default VerificationModal;