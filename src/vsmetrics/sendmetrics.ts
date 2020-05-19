/**
 * This file contains the code that sends the data to firebase. 
 */

 //import {docs} from '../main';

 // Change this to change the number of minutes it takes to send to FB. 
 let numMin = 1;


 // TODO: Function to send data to FB. 
 export let sendClientData : NodeJS.Timeout = setInterval(function() {
    // Convert data in lists to JSON.

    // let req = new XMLHttpRequest();

    // req.open('POST', 'https://enfw61sffu585.x.pipedream.net', true);

    // let payload : JSON = {};

    // // Send it over to Firebase. 

    // req.send(payload);
 
}, 60000 * numMin);


 


