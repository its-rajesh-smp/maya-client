import { useMicVAD } from "@ricky0123/vad-react";
import { useSocket } from "../contexts/socket.context";
import { getAiContext } from "../utils/aiContext.util";

const useAudioInput = () => {
  const { socket } = useSocket();

  function float32ToInt16(float32Array: any) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      int16Array[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
    }
    return int16Array;
  }

  const mic = useMicVAD({
    onSpeechEnd: (audio) => {
      console.log("User stopped talking");
      const int16 = float32ToInt16(audio);
      socket?.emit("userAudioInput", int16.buffer, { context: getAiContext() });
    },
    additionalAudioConstraints: {
      sampleRate: 16000,
    },
    startOnLoad: false,
  });

  return mic;
};

export default useAudioInput;
