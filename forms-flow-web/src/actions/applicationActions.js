/* istanbul ignore file */
import ACTION_CONSTANTS from "./actionConstants";

export const setApplicationList = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.LIST_APPLICATIONS,
    payload: data,
  });
};

export const setApplicationListByFormId = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.LIST_APPLICATIONS_OF_FORM,
    payload: data,
  });
};

export const setApplicationsAndDrafts = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FETCH_APPLICATIONS_AND_DRAFTS,
    payload: data,
  });
};

export const setApplicationDetail = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATION_DETAIL,
    payload: data,
  });
};

export const setApplicationDetailStatusCode = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATION_DETAIL_STATUS_CODE,
    payload: data,
  });
};

export const setUpdateLoader = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_APPLICATION_UPDATING,
    payload: data,
  });
};

export const setApplicationListLoader = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_APPLICATION_LIST_LOADING,
    payload: data,
  });
};

export const setApplicationDetailLoader = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_APPLICATION_DETAIL_LOADING,
    payload: data,
  });
};

// eslint-disable-next-line no-unused-vars
export const serviceActionError = (data) => (dispatch) => {
  //TODO update to a common file
  dispatch({
    type: ACTION_CONSTANTS.ERROR,
    payload: "Error Handling API",
  });
};

export const setApiFailure = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.API_FAILURE,
    payload: data,
  });
};


export const setApplicationProcess = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATION_PROCESS,
    payload: data,
  });
};

export const setApplicationListCount = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.SET_APPLICATION_LIST_COUNT,
    payload: data,
  });
};
export const setSubmissionFormName = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.SET_SUBMISSION_FORM_NAME,
    payload: data,
  });
};

export const setApplicationListActivePage = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATION_LIST_ACTIVE_PAGE,
    payload: data,
  });
};

export const setFormSubmissionSort = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_SUBMISSION_SORT,
    payload: data,
  });
};



export const setCountPerpage = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.CHANGE_SIZE_PER_PAGE,
    payload: data,
  });
};

export const setApplicationStatusList = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATION_STATUS_LIST,
    payload: data,
  });
};

export const setApplicationError = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATIONS_ERROR,
    payload: data,
  });
};

export const setPublicStatusLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_PUBLIC_STATUS_LOADING,
    payload: data,
  });
};

export const setApplicationSortOrder = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_APPLICATION_LIST_SORT_ORDER,
    payload: data,
  });
};

export const setApplicationSortBy = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_APPLICATION_LIST_SORT_BY,
    payload: data,
  });
};

export const setApplicationLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_APPLICATION_LOADING,
    payload: data,
  });
};

export const setApplicationListSearchParams = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATION_LIST_SEARCH_PARAMS,
    payload: data,
  });
};