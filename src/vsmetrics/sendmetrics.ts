/**
 * This file contains the code that sends the data to firebase. 
 */

 import {docs} from '../main';

 // Change this to change the number of minutes it takes to send to FB. 
 let numMin = 1;


 // TODO: Function to send data to FB. 
 export let sendClientData = window.setInterval(function() {
    // Convert data in lists to JSON.

    // Send it over to Firebase. 
 
}, 60000 * numMin);


 


