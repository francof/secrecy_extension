var encrypter = {
  port: '',
  pass: '',
  salt: 'LWK3dxBAgxs=',
  iterations: 100,
  keyLength: 128,

  //Setup communication between the contentscript and the popup
  connect: function(){
    var that = this;
    chrome.tabs.getSelected(null, function(tab){
      that.port = chrome.tabs.connect(tab.id,{name: "secrecy"})

      that.port.onDisconnect.addListener(function(e){
        //TODO implement proper errors
        alert("disconnected from encrypter");
      });

      that.port.onMessage.addListener(function(msg){
        if(msg.cmd == "encrypt"){
          that.port.postMessage({cmd:"set_current_text", text:that.encrypt(msg.text)});
        }
        else if (msg.cmd == "decrypt"){
          v = that.decrypt(msg.text);
          that.port.postMessage({cmd: "set_current_text", text:v});
        }
      });
    })
  },

  //Splits an IV+CT text to a [iv,ct] 
  splitCt: function(text){
    //TODO move hardcode
    var ivLength = 24;
    return {iv:text.substr(0,ivLength), ct:text.substr(ivLength)};
  },

  calculateKey: function(){
    return sjcl.misc.pbkdf2(this.pass, this.salt, this.iterations, this.keyLength);
  },

  encrypt: function(text){
    enc = JSON.parse(sjcl.encrypt(this.calculateKey(), text));
    return enc.iv + enc.ct;
  },

  decrypt: function(text){
    var info = this.splitCt(text);
    var vals = {iv:info.iv, ct:info.ct};
    //TODO proper error handling on exception
    return sjcl.decrypt(this.calculateKey(), JSON.stringify(vals), {}, {});
  },

  //Start by calling the contentscript
  start_decrypt: function(e) {
    this.port.postMessage({cmd: "want_to_decrypt"})
  },

  //Start by calling the contentscript
  start_encrypt: function(e) {
    this.port.postMessage({cmd: "want_to_encrypt"});
  },
}
document.addEventListener('DOMContentLoaded', function(){
  //FIXME Possible, but *very* improbable, race condition
  encrypter.connect();
  document.getElementById('decrypt').addEventListener("click", function(evt){
    encrypter.pass = document.getElementById('password').value
    encrypter.start_decrypt(evt);
  });

  document.getElementById('encrypt').addEventListener("click", function(evt){
    encrypter.pass = document.getElementById('password').value
    encrypter.start_encrypt(evt);
  });
});
// Ports may not be needed, maybe we can get away with 
//just using programmatic injection. 
// See: https://developer.chrome.com/extensions/content_scripts.html#pi
