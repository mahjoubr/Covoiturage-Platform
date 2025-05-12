export enum EventType {
  POST_UPDATED = 'update_post',
  NEW_COMMENT = 'new_comment',
  JOIN_REQUEST = 'join_request',
  JOIN_ACCEPT = 'join_accepted',
  RIDE_DELETE = 'ride_deleted',
  RIDE_START = 'ride_started',
  REVIEW_ADDED = 'review_added',
}

export interface StreamEvent {
  type: EventType;
  targetId: number;
  recipientId: number;
  payload: any;
  timestamp: number;
}