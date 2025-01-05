import React, { useRef, useEffect, useState } from "react";

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let remoteStream: MediaStream | null = null;

const VideoPlayer = ({}) => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const getLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error("Error accessing media devices", err);
    }
  };

  // Function to start a call (create a peer connection)
  const startCall = async () => {
    if (!localStream) {
      await getLocalMedia();
    }
    peerConnection = new RTCPeerConnection();

    // Add local stream tracks to the peer connection
    localStream?.getTracks().forEach((track) => {
      peerConnection?.addTrack(track, localStream!);
    });

    // Listen for remote stream
    peerConnection.ontrack = (event) => {
      remoteStream = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Here we would normally send the offer to the remote peer through a signaling server
    // Simulating signaling server part: receive the offer and create an answer
    setTimeout(() => handleReceiveOffer(offer), 1000);
    setIsCallStarted(true);
  };

  // Handle received offer (simulating remote peer's response)
  const handleReceiveOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnection) {
      return;
    }

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Here you would send the answer back to the signaling server
    // Simulating receiving answer:
    setTimeout(() => handleReceiveAnswer(answer), 1000);
  };

  // Handle received answer (simulating remote peer's answer)
  const handleReceiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnection) {
      return;
    }
    await peerConnection.setRemoteDescription(answer);
  };

  const toggleMuteVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoMuted(!videoTrack.enabled);
    }
  };

  const toggleMuteAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
    setIsCallStarted(false);
  };

  useEffect(() => {
    // Automatically get user media on load
    getLocalMedia();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-semibold">WebRTC Video Call</h1>
      <div className="flex space-x-4">
        <div className="w-64 h-48 bg-black">
          <video ref={localVideoRef} autoPlay muted className="w-full h-full" />
        </div>
        <div className="w-64 h-48 bg-black">
          <video ref={remoteVideoRef} autoPlay className="w-full h-full" />
        </div>
      </div>
      <div className="space-x-4">
        {!isCallStarted ? (
          <button
            onClick={startCall}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Start Call
          </button>
        ) : (
          <>
            <button
              onClick={toggleMuteVideo}
              className={`${
                isVideoMuted ? "bg-red-500" : "bg-green-500"
              } text-white px-4 py-2 rounded`}
            >
              {isVideoMuted ? "Unmute Video" : "Mute Video"}
            </button>
            <button
              onClick={toggleMuteAudio}
              className={`${
                isAudioMuted ? "bg-red-500" : "bg-green-500"
              } text-white px-4 py-2 rounded`}
            >
              {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            </button>
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
