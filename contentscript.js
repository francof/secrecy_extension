//Mantain a current input for the latest edited text
//TODO this will have to be improved to include textarea, etc.
// there has to be a better way for more dynamic type sites
// Maybe a mouse selector a-la-inspect (?)
//
// Probably SELECTED text is the best choice
var currentInput;
var inputs = document.querySelectorAll("input[type=text]");
for(var i=0; i < inputs.length; i++){
  inputs[i].addEventListener('blur', function(e){
    currentInput = this;
  });
}


chrome.runtime.onConnect.addListener(function(port){
  port.onDisconnect.addListener(function(e){
    //TODO
  });
  port.onMessage.addListener(function(msg) {
    if (msg.cmd == "want_to_decrypt"){
      port.postMessage({cmd: "decrypt", text: currentInput.value});
    }
      //TODO this should search the whole page
      //for the predefined encryption tag
      //and call decrypt for each text and replace
    else if (msg.cmd == "want_to_encrypt"){
      port.postMessage({cmd: "encrypt", text: currentInput.value});
    }
    else if (msg.cmd == "set_current_text"){
      console.log("set_current_text called with :"+msg.text);
      currentInput.value = msg.text;
    }
  });
});


