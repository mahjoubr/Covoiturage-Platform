import { gql } from '@apollo/client';
export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: Int!) {
    getChatMessages(chatId: $chatId) {
      id
      text
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      id
      text
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageAdded($chatId: Int!) {
    messageAdded(chatId: $chatId) {
      id
      text
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

export const GET_CHATS=gql`
  query GetChats($userId: Int!) {
    getChats(userId: $userId) {
      id
      name
      messages {
        id
        text
        createdAt
        sender {
          id
          name
        }
      }
    }
  }
`;