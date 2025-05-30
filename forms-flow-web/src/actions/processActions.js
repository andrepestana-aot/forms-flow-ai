/* istanbul ignore file */
import ACTION_CONSTANTS from "./actionConstants";

export const setProcessList = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.PROCESS_STATUS_LIST,
    payload: data,
  });
};

export const setProcessXml = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.SET_PROCESSES_XML,
    payload: data,
  });
};

export const setProcessStatusLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_PROCESS_STATUS_LOADING,
    payload: data,
  });
};

export const setProcessLoadError = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_PROCESS_STATUS_LOAD_ERROR,
    payload: data,
  });
};

export const setProcessData = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.SET_PROCESS_DATA,
    payload: data,
  });
};

export const setProcessActivityLoadError = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_PROCESS_ACTIVITY_LOAD_ERROR,
    payload: data,
  });
};

export const setAllProcessList = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.PROCESS_LIST,
    payload: data,
  });
};

export const setAllDmnProcessList = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.DMN_PROCESS_LIST,
    payload: data,
  });
};

export const setFormProcessLoadError = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_FORM_PROCESS_STATUS_LOAD_ERROR,
    payload: data,
  });
};

export const setFormProcessesData = (data) => (dispatch) => {
 dispatch({
    type: ACTION_CONSTANTS.FORM_PROCESS_LIST,
    payload: data,
  });
};

export const setWorkflowAssociation = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.WORKFLOW_ASSOCIATION_CHANGED,
    payload: data,
  });
};

export const setProcessActivityData = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.PROCESS_ACTIVITIES,
    payload: data,
  });
};

export const setProcessDiagramXML = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.DEFAULT_PROCESS_DIAGRAM_XML,
    payload: data,
  });
};

export const setDescisionDiagramXML = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.DEFAULT_DECISION_DIAGRAM_XML,
    payload: data,
  });
};
export const setProcessDiagramLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_PROCESS_DIAGRAM_LOADING,
    payload: data,
  });
};

export const setFormPreviosData = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_PREVIOUS_DATA,
    payload: data,
  });
};

export const setApplicationCount = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATION_COUNT,
    payload: data,
  });
};

export const setIsApplicationCountLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_APPLICATION_COUNT_LOADING,
    payload: data,
  });
};

export const setApplicationCountResponse = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.APPLICATION_COUNT_RESPONSE,
    payload: data,
  });
};

export const setUnPublishApiError = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.UNPUBLISH_API_ERROR,
    payload: data,
  });
};

export const setResetProcess = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.RESET_PROCESS,
    payload: data,
  });
};

export const setFormStatusLoading = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.FORM_STATUS_LOADING,
    payload: data,
  });
};

export const setBpmnSearchText = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPMN_SEARCH_TEXT,
    payload: data,
  });
};

export const setDmnSearchText = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.DMN_SEARCH_TEXT,
    payload: data,
  });
};


export const setBpmnModel = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_BPMN_MODEL,
    payload: data,
  });
};

export const setIsPublicDiagram = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.IS_PUBLIC_DIAGRAM,
    payload: data,
  });
};

export const setProcessHistories = (historyData) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.PROCESS_HISTORY,
    payload:historyData,
  });
};
export const setSubflowCount = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.SET_SUBFLOW_COUNT,
    payload: data,
  });
}; 

export const setTotalDmnCount = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.SET_TOTAL_DMN_COUNT, 
    payload: data,
    }); 
};

export const setBpmSort = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.BPM_SORT,
    payload: data,
    });
};
export const setDmnSort = (data) => (dispatch) => {
  dispatch({
    type: ACTION_CONSTANTS.DMN_SORT,
    payload: data,
    });
};