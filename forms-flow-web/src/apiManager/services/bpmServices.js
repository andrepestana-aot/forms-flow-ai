/* istanbul ignore file */

import { StorageService, RequestService } from "@formsflow/service";
import API from "../endpoints";
import {getFormUrlWithFormIdSubmissionId} from "./formatterService";

export const getProcessReq = (form, submissionId, origin, submissionData ) => {
  const requestFormat = {
    formId: form._id,
    submissionId: submissionId,
    formUrl: getFormUrlWithFormIdSubmissionId(form._id, submissionId),
    webFormUrl: `${origin}form/${form._id}/submission/${submissionId}`,
    data: submissionData
  };
  return requestFormat;
};

export const getTaskSubmitFormReq = (formUrl, applicationId, actionType, webFormUrl) => {
  let formRequestFormat = {
    variables: {
      formUrl: {
        value: formUrl,
      },
      applicationId: {
        value: applicationId,
      },
      webFormUrl:{
        value: webFormUrl
      }
    },
  };
  if (actionType) {
    formRequestFormat.variables.action = {
      value: actionType,
    };
  }
  return formRequestFormat;
};

export const formatForms = (forms) => {
  return forms.map((form) => {
    return {
      _id: form.formId,
      title: form.formName,
      processKey: form.processKey,
      status: form.status,
      anonymous: form.anonymous,
      description:form.description,
      created: form.created,
      formType: form.formType,
      modified:form.modified,
      latestSubmission: form.latestSubmission,
      submissionsCount:form.submissionsCount,
      parentFormId:form.parentFormId,
    };
  });
};

const dynamicSort = (property) => {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a, b) => {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    const result =
      a[property].toUpperCase() < b[property].toUpperCase()
        ? -1
        : a[property].toUpperCase() > b[property].toUpperCase()
        ? 1
        : 0;
    return result * sortOrder;
  };
};

export const getSearchResults = (forms, searchText) => {
  let searchResult = [];
  if (searchText === "") {
    searchResult = forms;
  } else {
    searchResult = forms?.filter((e) => {
      const caseInSensitive = e.title.toUpperCase();
      return caseInSensitive.includes(searchText.toUpperCase());
    });
  }
  return searchResult;
};
export const getPaginatedForms = (forms, limit, page, sort) => {
  forms.sort(dynamicSort(sort));
  return forms.slice((page - 1) * limit, ((page - 1) * limit) + limit);
};

export const deployBpmnDiagram = (data, token, isBearer = true) => {

  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: isBearer
      ? `Bearer ${token || StorageService.get(StorageService.User.AUTH_TOKEN)}`
      : token,
  };

  return RequestService.httpPOSTRequest(API.DEPLOY_BPM, data, token, isBearer, headers);

};

export const getDraftReqFormat = (form_id, data = {}) => {
  return {
    formId: form_id,
    data: data,
  };
};