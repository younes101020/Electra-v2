// "use client";

// import { useEffect, useState } from "react";
// import { socket } from "@/lib/socket";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import {
//   Card as ConfirmCard,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";

// type CardProps = React.ComponentProps<typeof ConfirmCard> & {
//   messages: Array<string>;
//   users: Array<{ id: string; username: string }>;
// };

// function Card({ className, ...props }: CardProps) {
//   return (
//     <ConfirmCard className={cn("w-[380px]", className)} {...props}>
//       <CardHeader>
//         <CardTitle>Plus qu&apos;une dernière étape!</CardTitle>
//         <CardDescription>
//           Vous devez valider votre demande de connexion afin d&apos;accéder à Electra
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div>
//           <ul>
//             {props.users.map((user) => (
//               <li key={user.id}>{user.username}</li>
//             ))}
//           </ul>
//           <ul>
//             {/* TODO: GENERATE ID FOR EACH MSG SERVER SIDE AND USE IT ON KEY INSTEAD OF INDEX */}
//             {props.messages.map((msg, i) => (
//               <li key={i}>{msg}</li>
//             ))}
//           </ul>
//         </div>
//       </CardContent>
//       <CardFooter>
//         <form
//           action=""
//           onSubmit={(e) => {
//             e.preventDefault();
//             socket.emit("message", e.target.message.value);
//           }}
//           className="flex gap-2"
//         >
//           <Input type="text" placeholder="Message" name="message" />
//           <Button type="submit">Envoyer</Button>
//         </form>
//       </CardFooter>
//     </ConfirmCard>
//   );
// }

// export default function SpacePage() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [transport, setTransport] = useState("N/A");
//   const [users, setUsers] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     socket.on("newUserResponse", (data) => setUsers(data));
//   }, [socket, users]);

//   useEffect(() => {
//     function onFooEvent(value: string) {
//       setMessages(messages.concat(value));
//     }
//     socket.on("messageResponse", onFooEvent);
//     return () => {
//       socket.off("messageResponse", onFooEvent);
//     };
//   }, [message]);

//   useEffect(() => {
//     if (socket.connected) {
//       onConnect();
//     }

//     socket.emit("newUser", { username: "younes", socketID: socket.id });

//     function onConnect() {
//       setIsConnected(true);
//       setTransport(socket.io.engine.transport.name);

//       socket.io.engine.on("upgrade", (transport) => {
//         setTransport(transport.name);
//       });
//     }

//     function onDisconnect() {
//       setIsConnected(false);
//       setTransport("N/A");
//     }

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//     };
//   }, []);

//   return (
//     <div>
//       <p>Status: {isConnected ? "connected" : "disconnected"}</p>
//       <p>Transport: {transport}</p>
//       <div className="w-full flex justify-center">
//         <Card messages={messages} users={users} />
//       </div>
//     </div>
//   );
// }
