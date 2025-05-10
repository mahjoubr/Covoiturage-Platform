export interface ChatSidebarProps {
  isMobile: boolean;
  setIsMobile: (val: boolean) => void;
  onChatClick: (chat: Chat) => void;
}
 
export type Chat = {
  id: number;
  messages: Message[]; 
  driver: User;
  rider: User;
  ride: Ride;
};

export type User = {
  id: number;
  name: string;
  lastName: string;
  
};

export type Ride = {
  id: number;
  
};

export type Message = {
  id: number;
  content: string;
  
};