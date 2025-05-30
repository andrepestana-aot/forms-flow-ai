/* istanbul ignore file */
import ACTION_CONSTANTS from "./actionConstants";

export const setFormSubmissionDeleteStatus = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_SUBMISSION_DELETE,
    payload: data,
  });
};
export const setFormSubmissionError = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_SUBMISSION_ERROR,
    payload: data,
  });
};


export const setFormSubmissionLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_FORM_SUBMISSION_LOADING,
    payload: data,
  });
};

export const setFormDeleteStatus = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_DELETE,
    payload: data,
  });
};
export const setFormAuthorizationDetails = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_AUTHORIZATION_HANDLE,
    payload: data,
  });
};
export const setFormAuthVerifyLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_AUTH_VERIFY_LOADING,
    payload: data,
  });
};

export const setFormWorkflowSaved = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_FORM_WORKFLOW_SAVED,
    payload: data,
  });
};

export const setBPMFormList = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_FORM_LIST,
    payload: data,
  });
};

export const setBPMFormListLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_BPM_FORM_LIST_LOADING,
    payload: data,
  });
};

export const setBPMFormListPage = (page) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_FORM_LIST_PAGE_CHANGE,
    payload: page,
  });
};

export const setBPMFormLimit = (pageLimit) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_FORM_LIST_LIMIT_CHANGE,
    payload: pageLimit,
  });
};

// Submission form listing pagination

export const setClientSubmissionLimit = (pageLimit) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.CLIENT_FORM_LIST_SUBMISSION_LIST_PAGE_CHANGE,
    payload: pageLimit,
  });
};

export const setClientSubmitionListPage = (page) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.CLIENT_SUBMITION_LIST_PAGE_CHANGE,
    payload: page,
  });
};

export const setMaintainBPMFormPagination = (maintainList) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_MAINTAIN_PAGINATION,
    payload: maintainList,
  });
};

export const setBPMFormListSort = (sort) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_FORM_LIST_SORT_CHANGE,
    payload: sort,
  });
};

export const setFormSubmitted = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.PUBLIC_FORM_SUBMIT,
    payload: data,
  });
};

export const setPublicFormStatus = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.PUBLIC_FORM_STATUS,
    payload: data,
  });
};

export const setFormSuccessData = (name, form, url) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_SUCCESS,
    form,
    name,
    url,
  });
};

export const setFormRequestData = (name, id, url) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_REQUEST,
    name,
    id,
    url,
  });
};

export const resetFormData = (name) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_RESET,
    name,
  });
};

export const setFormFailureErrorData = (name, error) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_FAILURE,
    name,
    error,
  });
};

export const setBpmFormSearch = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_FORM_SEARCH,
    payload: data,
  });
  return Promise.resolve();
};

export const setBpmFormType = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_FORM_TYPE,
    payload: data,
  });
  return Promise.resolve();
};

export const setBpmFormLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_FORM_LOADING,
    payload: data,
  });
};

export const clearFormError = (name) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_CLEAR_ERROR,
    name,
  });
};

export const clearSubmissionError = (name) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.SUBMISSION_CLEAR_ERROR,
    name,
  });
};


export const setRestoreFormId = (form_id) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.RESTORE_FORM_ID,
    payload:form_id,
  });
};

export const setRestoreFormData = (fromData) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.RESTORE_FORM_DATA,
    payload:fromData,
  });
};

export const setFormHistories = (historyData) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_HISTORY,
    payload:historyData,
  });
};

export const setBpmFormSort = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_FORM_SORT,
    payload: data,
    });
};

export const setClientFormSearch = ( data ) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_CLIENT_FORM_SEARCH,
    payload: data,
    });
};

export const setClientFormListPage = (page) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.CLIENT_SUBMIT_LIST_PAGE_CHANGE,
    payload: page,
  });
};

export const setClientFormLimit = (pageLimit) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.CLIENT_SUBMIT_LIST_LIMIT_CHANGE,
    payload: pageLimit,
  });
};

export const setClientFormListSort = (sort) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.CLIENT_SUBMIT_LIST_SORT_CHANGE,
    payload: sort,
  });
};
