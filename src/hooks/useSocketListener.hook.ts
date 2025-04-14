import { useEffect } from "react";
import { useSocket } from "../contexts/socket.context";

const useSocketListener = (
  event: string,
  callback: (...args: any[]) => void
) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [event, socket]);
};
export default useSocketListener;
