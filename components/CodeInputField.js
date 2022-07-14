//1. import all requred constants, hooks and components
//===================================================
import { COLORS } from './../constants';
import {useState, useRef,useEffect} from 'react';
import {Pressable, TextInput, View, Text} from 'react-native';
import { CodeInput, CodeInputFocused } from './StyledComponents';

const CodeInputField = ({setPinReady, code, setCode, maxLength}) => {
    //create  an array with the length of the set max length and fill it with zeroes
    const codeDigitsArray = new Array(maxLength).fill(0);
    
    //ref for text input
    const textInputRef = useRef(null);

    //monitoring input focus
    const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);

    //this function will be called when the input field loses focus
    const handleOnBlur =  () => {
        //when ever the input field is selected and focussed we will set this value to true
        setInputContainerIsFocused(false);
    }

    useEffect(() => { 
        //toggle submit button state
        setPinReady(code.length === maxLength);

        //clean up function: whenever  this component unmounts we will set the pin ready to false
        return () => setPinReady(false);
    
        //run the use effect hook whenever the value of the code changes
    }, [code]);

    const handleOnPress =  () => {
        setInputContainerIsFocused(true);

        //trigger the focus function of the input
        //this makes the input to be active and ready to accept input
        textInputRef?.current?.focus();
    }

    const toCodeDigitInput =  (_value, index) => {
        const emptyInputChar = ' ';
        const digit = code[index] || emptyInputChar;

        //formatting
        //tells us if the digit is the first one
        const isCurrentDigit = index === code.length;
        //tells us if the digit is the last one
        const isLastDigit = index === maxLength - 1;

        //tells us if the code is full
        const isCodeFull = code.length === maxLength;

        //for a digit to be focussed it should be the current digit or is the last digit and the code is full
        const isDigitFocussed = isCurrentDigit || (isLastDigit && isCodeFull);

        const StyledCodeInput = inputContainerIsFocused && isDigitFocussed ? CodeInputFocused : CodeInput;


        return (
            <StyledCodeInput key={index}>
                <Text style={{fontSize:22,fontWeight:'bold', textAlign:'center', color:COLORS.brand}}>{digit}</Text>
            </StyledCodeInput>
        );
    }

  return (
        <View style={{flex: 1, justifyContent:'center',alignItems: 'center', marginVertical: 30}}> 
            <Pressable onPress={handleOnPress} style={{width:'70%',flexDirection:'row', justifyContent:'space-between'}}>
                    {codeDigitsArray.map(toCodeDigitInput)}
            </Pressable>
         
            <TextInput style={{position:'absolute', width:1, height:1, opacity:0}}   
                ref={textInputRef}
                value={code}
                onChangeText={setCode}
                onSubmitEditing={handleOnBlur}
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType="oneTimeCode"
                maxLength={maxLength}
            />
        </View>
  )
}

export default CodeInputField;