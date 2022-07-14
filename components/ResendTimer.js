//1. import all requred constants and components
//==============================================
import { COLORS } from "./../constants";
import { View, Text,ActivityIndicator, TouchableOpacity} from 'react-native';

const ResendTimer = ({activeResend,resendingEmail,resendStatus,timeLeft,targetTime,resendEmail}) => {
  return (
    <View>
    <View style={{flexDirection:'row', padding:10,justifyContent:'center',alignItems:'center'}}>
         <Text style={{color:COLORS.gray,fontSize:15,textAlign:'center'}}>Did'nt receive the email?</Text>

         {!resendingEmail && (   
        <TouchableOpacity  
            style={{opacity: !activeResend ? 0.5 : 1, justifyContent:'center', alignItems:'center'}}
            disabled={!activeResend} 
            onPress={resendEmail}>
             <Text 
                resendStatus={resendStatus}
                style={{textDecorationLine: 'underline', color:COLORS.brand, fontSize:15}}>
                 {resendStatus}
             </Text>
         </TouchableOpacity>
         )}

        {/* If resend email is true disable the link completely because you are already in the process to resend the email*/}
        {resendingEmail && (
        <TouchableOpacity style={{justifyContent:'center', alignItems:'center'}} disabled>
             <Text 
                resendStatus={resendStatus}
                style={{textDecorationLine: 'underline', color: COLORS.brand, fontSize:15, color: resendStatus === 'FAILED' ? COLORS.red : COLORS.green}}>
                <ActivityIndicator color={COLORS.brand}/>
             </Text>
         </TouchableOpacity>
         )}
         
    </View>
    {!activeResend && (
        <Text style={{color: COLORS.gray, fontSize:15,textAlign:'center'}}>
            in <Text style={{fontWeight:'bold', fontStyle:'italic'}}>{timeLeft || targetTime}</Text> second(s)
        </Text>
    )} 
</View>
  )
}

export default ResendTimer;