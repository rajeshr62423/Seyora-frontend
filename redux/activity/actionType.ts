export const FETCH_ACTIVITY_REQUEST = "activity/FETCH_ACTIVITY_REQUEST";
export const FETCH_ACTIVITY_SUCCESS = "activity/FETCH_ACTIVITY_SUCCESS";
export const FETCH_ACTIVITY_FAILURE = "activity/FETCH_ACTIVITY_FAILURE";

export const FETCH_MORE_ACTIVITY_REQUEST = "activity/FETCH_MORE_ACTIVITY_REQUEST";
export const FETCH_MORE_ACTIVITY_SUCCESS = "activity/FETCH_MORE_ACTIVITY_SUCCESS";
export const FETCH_MORE_ACTIVITY_FAILURE = "activity/FETCH_MORE_ACTIVITY_FAILURE";

// Separate from FETCH_ACTIVITY_*: that one is the shared org-wide feed
// (never filtered/overwritten per-consumer, see ActivityPage's actor
// filter). This one is a dedicated slot for a single task's history, used
// by the task detail page's Activity/Progress timeline.
export const FETCH_TASK_ACTIVITY_REQUEST = "activity/FETCH_TASK_ACTIVITY_REQUEST";
export const FETCH_TASK_ACTIVITY_SUCCESS = "activity/FETCH_TASK_ACTIVITY_SUCCESS";
export const FETCH_TASK_ACTIVITY_FAILURE = "activity/FETCH_TASK_ACTIVITY_FAILURE";
