
import { gql } from '@apollo/client';

// Queries
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

// Hooks for using the queries and mutations
import { useQuery, useMutation } from '@apollo/client';

export const useUserNotifications = (userId: number, limit?: number) => {
  return useQuery(GET_USER_NOTIFICATIONS, {
    variables: { userId, limit },
    skip: !userId,
    pollInterval: 30000, // Poll every 30 seconds as backup
  });
};

export const useUnreadCount = (userId: number) => {
  return useQuery(GET_UNREAD_COUNT, {
    variables: { userId },
    skip: !userId,
    pollInterval: 30000,
  });
};

export const useMarkAsRead = () => {
  return useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [GET_UNREAD_COUNT],
  });
};

export const useMarkAllAsRead = () => {
  return useMutation(MARK_ALL_NOTIFICATIONS_AS_READ, {
    refetchQueries: [GET_USER_NOTIFICATIONS, GET_UNREAD_COUNT],
  });
};