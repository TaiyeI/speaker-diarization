import React, { useRef, useEffect, useState } from "react";
import { DefaultEventsMap, Socket } from "socket.io";
import { io } from "socket.io-client";

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let remoteStream: MediaStream | null = null;

const VideoCall = ({}) => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef(
    io("localhost:5001", {
      reconnection: true,
    })
  );

  const getLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error("Error accessing media devices", err);
    }
  };

  const startCall = async () => {
    if (!localStreamRef.current) {
      await getLocalMedia();
    }
    socketRef.current.emit("join", { room: "random-room" });

    //Missssssssss
    peerConnectionRef.current = new RTCPeerConnection();

    localStreamRef.current?.getTracks().forEach((track) => {
      peerConnectionRef.current?.addTrack(
        track,
        localStreamRef.current as MediaStream
      );
    });

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Create offer
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    // Send offer via socket
    socketRef.current.emit("offer", { offer, room: "random-room" });

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("candidate", {
          candidate: event.candidate,
          room: "random-room",
        });
      }
    };
    //Misssssssssss
    setIsCallStarted(true);
  };

  const handleReceiveOffer = async (offer: RTCSessionDescriptionInit) => {
    //Misssssssssss
    console.log("Received Offer:", offer);

    peerConnectionRef.current = new RTCPeerConnection();

    // Add local stream tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(
          track,
          localStreamRef.current as MediaStream
        );
      });
    }

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Set remote description
    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    // Create and send answer
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socketRef.current.emit("answer", { answer, room: "random-room" });

    // Handle ICE Candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("candidate", {
          candidate: event.candidate,
          room: "random-room",
        });
      }
    };
  };

  const handleReceiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    console.log("Received Answer:", answer);

    if (!peerConnectionRef.current) return;

    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const endCall = () => {
    setIsCallStarted(false);
    //Misssssss
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    //Missssssss
    socketRef.current.emit("endCall");
  };

  useEffect(() => {
    socketRef.current = io("localhost:5001", {
      reconnection: true,
    });

    socketRef.current.on("connect", () => {
      console.log("connect");
    });

    socketRef.current.on("offer", async (data) => {
      await handleReceiveOffer(data.offer);
    });

    socketRef.current.on("answer", async (data) => {
      await handleReceiveAnswer(data.answer);
    });

    socketRef.current.on("candidate", async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    });

    socketRef.current.on("ready", () => {
      console.log("Ready to establish connection!");
    });

    socketRef.current.on("peer_left", () => {
      console.log("The other peer has left.");
      endCall();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
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
            onClick={() => {
              startCall();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Start Call
          </button>
        ) : (
          <>
            <button
              onClick={() => console.log("toggleMuteVideo")}
              className={`${
                isVideoMuted ? "bg-red-500" : "bg-green-500"
              } text-white px-4 py-2 rounded`}
            >
              {isVideoMuted ? "Unmute Video" : "Mute Video"}
            </button>
            <button
              onClick={() => console.log("toggleMuteAudio")}
              className={`${
                isAudioMuted ? "bg-red-500" : "bg-green-500"
              } text-white px-4 py-2 rounded`}
            >
              {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            </button>
            <button
              onClick={() => endCall()}
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

export default VideoCall;
