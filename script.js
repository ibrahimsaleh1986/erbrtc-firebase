//Create an account on Firebase, and use the credentials they give you in place of the following
var config = {
    apiKey: "AIzaSyB_hC6EAi4Lcubx5oKdt6XhfUhy9eIqt3A",
    authDomain: "maqraa-18b00.firebaseapp.com",
    databaseURL: "https://maqraa-18b00.firebaseio.com",
    projectId: "maqraa-18b00",
    storageBucket: "maqraa-18b00.appspot.com",
    messagingSenderId: "484319770328",
    appId: "1:484319770328:web:d814f4b0787ebcdca709ad",
    measurementId: "G-4M23TN8TNL"
};
firebase.initializeApp(config);

var partnerAudio = document.querySelector('.audio.partner');

var database = firebase.database().ref();
// var yourVideo = document.getElementById("yourVideo");
// var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
var servers = {iceServers: [{
   urls: [ "stun:bn-turn1.xirsys.com" ]
}, {
   username: "4YZ55YVDuwcyQ9eBVVfFPUIXleT0R_Q-V-MmSugmX0NqHNaPrgNaRtY3dJXq51WzAAAAAF-eg9Bpc2FsZWg=",
   credential: "07d3299e-1c27-11eb-8f9c-0242ac140004",
   urls: [
       "turn:bn-turn1.xirsys.com:80?transport=udp",
       "turn:bn-turn1.xirsys.com:3478?transport=udp",
       "turn:bn-turn1.xirsys.com:80?transport=tcp",
       "turn:bn-turn1.xirsys.com:3478?transport=tcp",
       "turns:bn-turn1.xirsys.com:443?transport=tcp",
       "turns:bn-turn1.xirsys.com:5349?transport=tcp"
   ]
}]};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
pc.onaddstream = (event => partnerAudio.srcObject = event.stream);

function sendMessage(senderId, data) {
    var msg = database.push({ sender: senderId, message: data });
	// if(messageRead)
		msg.remove();
}
var messageRead = false;
function readMessage(data) {
    var msg = JSON.parse(data.val().message);
    var sender = data.val().sender;
    if (sender != yourId) {
        if (msg.ice != undefined)
            pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        else if (msg.sdp.type == "offer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
              .then(() => pc.createAnswer())
              .then(answer => pc.setLocalDescription(answer))
              .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
        else if (msg.sdp.type == "answer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
		// messageRead = true;
    }
};

database.on('child_added', readMessage);

function showMyFace() {
  navigator.mediaDevices.getUserMedia({audio:true})
    // .then(stream => yourVideo.srcObject = stream)
    .then(stream => pc.addStream(stream));
}

function showFriendsFace() {
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer) )
    .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
}
// function stopStreamedAudio() {
	// audio1.srcObject.getTracks()[0].stop();
// }
function stopstreamedaudio() {
 const stream = partneraudio.srcobject;
 const tracks = stream.gettracks();

 tracks.foreach(function(track) {
 track.stop();
 });

  // // // partneraudio.srcobject = null;
 }
// // function mute(){
	// // // audio1.srcObject.getTracks().forEach(t => t.enabled = !t.enabled);
	// // // partnerAudio.srcObject.getTracks().forEach(t => t.muted = !t.muted);
	// // audio1.srcObject.getTracks()[0].stop();
	
// // }