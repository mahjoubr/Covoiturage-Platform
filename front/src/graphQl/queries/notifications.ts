
import { gql } from '@apollo/client';

/*
export const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotifications($userId: Int!, $limit: Int) {
    userNotifications(userId: $userId, limit: $limit) {
      id
      type
      title
      message
      status
      actionUrl
      metadata
      relatedEntityId
      relatedEntityType
      createdAt
      updatedAt
    }
  }
`;

export const GET_UNREAD_NOTIFICATIONS = gql`
  query GetUnreadNotifications($userId: Int!) {
    unreadNotifications(userId: $userId) {
      id
      type
      title
      message
      actionUrl
      metadata
      createdAt
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadNotificationCount($userId: Int!) {
    unreadNotificationCount(userId: $userId)
  }
`;

// Mutations
export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($createNotificationInput: CreateNotificationInput!) {
    createNotification(createNotificationInput: $createNotificationInput) {
      id
      type
      title
      message
      status
      actionUrl
      createdAt
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: Int!) {
    markNotificationAsRead(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead($userId: Int!) {
    markAllNotificationsAsRead(userId: $userId)
  }
`;

export const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification($updateNotificationInput: UpdateNotificationInput!) {
    updateNotification(updateNotificationInput: $updateNotificationInput) {
      id
      status
      updatedAt
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: Int!) {
    removeNotification(id: $id) {
      id
    }
  }
`;

*/


export const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: ID!, $limit: Int, $offset: Int) {
    notifications(userId: $userId, limit: $limit, offset: $offset) {
      id
      type
      title
      message
      timestamp
      read
      actionUrl
      metadata
      userId
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($notificationId: ID!) {
    markNotificationRead(notificationId: $notificationId) {
      id
      read
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead($userId: ID!) {
    markAllNotificationsRead(userId: $userId) {
      count
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId) {
      id
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadCount($userId: ID!) {
    unreadNotificationsCount(userId: $userId)
  }
`;

