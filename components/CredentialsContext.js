//context hook makes it possible for our app to have a global state and be able to access it from anywhere in our app
import { createContext } from 'react';

// Credential 
//first we create a context object
//second we set a method that will be used to set the credentials
//we use the same names variable names/values as the ones in our app.js file for the state
export const CredentialsContext = createContext({ storedCredentials: {}, setStoredCredentials: () => {} });