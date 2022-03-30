import browser = require('webextension-polyfill');

 (() => {

   function  createTopBar(message: string, breakLink: string) {
     var topBar = document.createElement("a");
     let style = topBar.style;
     style.overflow = "hidden";
     style.backgroundColor = "red";
     style.position = "fixed";
     style.top = "0";
     style.width = "100%"; 
     style.zIndex = "100000000000000";
     style.padding = "100px";
     style.textAlign = "center";
     style.fontSize = "xxx-large";
     style.color = "antiquewhite";
     topBar.title = message;
     topBar.href = breakLink;
     var newContent = document.createTextNode(message);
     topBar.appendChild(newContent);

     var body = document.body;
     body.insertBefore(topBar, body.firstChild);
   }

   /**
    * Listen for messages from the background script.
    */
   browser.runtime.onMessage.addListener((data: {message: string, breakLink: string}) => {
     createTopBar(data.message, data.breakLink);
   });
 })(); 