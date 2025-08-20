// types/next.d.ts
import { Server as HTTPServer } from "http";
import { Socket } from "net";
import { Server as IOServer } from "socket.io";

declare module "http" {
  interface IncomingMessage {
    socket: Socket & { server: HTTPServer & { io?: IOServer } };
  }
}

export type NextApiResponseServerIO = {
  socket: Socket & { server: HTTPServer & { io?: IOServer } };
};
