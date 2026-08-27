import { all } from "redux-saga/effects";
import { authSaga } from "./auth/saga";
import { usersSaga } from "./users/saga";
import { projectsSaga } from "./projects/saga";
import { organizationSaga } from "./organization/saga";
import { tasksSaga } from "./tasks/saga";
import { activitySaga } from "./activity/saga";
import { notificationsSaga } from "./notifications/saga";
import { analyticsSaga } from "./analytics/saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    usersSaga(),
    projectsSaga(),
    organizationSaga(),
    tasksSaga(),
    activitySaga(),
    notificationsSaga(),
    analyticsSaga(),
  ]);
}
