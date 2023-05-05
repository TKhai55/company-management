import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiMeet = () => {
  return (
    <div>
      <JitsiMeeting
        configOverwrite={{
          startWithAudioMuted: true,
          hiddenPremeetingButtons: ["microphone"],
        }}
        // userInfo={{
        //   displayName: "KKK ",
        // }}
        roomName={"YOUR_CUSTOM_ROOM_NAME"}
        getIFrameRef={(node) => (node.style.height = "100vh")}
      />
    </div>
  );
};

export default JitsiMeet;
