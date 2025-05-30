import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { push } from "connected-react-router";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  selectRoot,
  resetSubmissions,
  saveSubmission,
  Form,
  selectError,
  Errors,
  getForm,
  Formio,
} from "@aot-technologies/formio-react";
import { useTranslation, Translation } from "react-i18next";
import isEqual from "lodash/isEqual";

import Loading from "../../../containers/Loading";
import {
  getProcessReq,
  getDraftReqFormat,
} from "../../../apiManager/services/bpmServices";
import { RESOURCE_BUNDLES_DATA } from "../../../resourceBundles/i18n";
import {
  setFormFailureErrorData,
  setFormRequestData,
  setFormSubmissionError,
  setFormSubmissionLoading,
  setFormSuccessData,
  setMaintainBPMFormPagination,
  setFormSubmitted
} from "../../../actions/formActions";
import SubmissionError from "../../../containers/SubmissionError";
import { publicApplicationStatus } from "../../../apiManager/services/applicationServices";
import LoadingOverlay from "react-loading-overlay-ts";
import { CUSTOM_EVENT_TYPE } from "../../../components/ServiceFlow/constants/customEventTypes";
import { toast } from "react-toastify";
import { fetchFormByAlias } from "../../../apiManager/services/bpmFormServices";
import { checkIsObjectId } from "../../../apiManager/services/formatterService";
import {
  draftCreate,
  draftUpdate,
  publicDraftCreate,
  publicDraftUpdate,
} from "../../../apiManager/services/draftService";
import { setPublicStatusLoading } from "../../../actions/applicationActions";
import { postCustomSubmission } from "../../../apiManager/services/FormServices";
import {
  CUSTOM_SUBMISSION_URL,
  CUSTOM_SUBMISSION_ENABLE,
  MULTITENANCY_ENABLED,
  DRAFT_ENABLED,
  DRAFT_POLLING_RATE,
} from "../../../constants/constants";
import useInterval from "../../../customHooks/useInterval";
import selectApplicationCreateAPI from "../../../components/Form/constants/apiSelectHelper";
import {
  getApplicationCount,
  getFormProcesses,
} from "../../../apiManager/services/processServices";
import { setFormStatusLoading } from "../../../actions/processActions";
import SavingLoading from "../../../components/Loading/SavingLoading";
import { renderPage } from "../../../helper/helper";
import PropTypes from "prop-types";

const View = React.memo((props) => {
  const [formStatus, setFormStatus] = React.useState("");
  const { t } = useTranslation();
  const lang = useSelector((state) => state.user.lang);
  const pubSub = useSelector((state) => state.pubSub);
  const formStatusLoading = useSelector(
    (state) => state.process?.formStatusLoading
  );
  const isFormSubmissionLoading = useSelector(
    (state) => state.formDelete.isFormSubmissionLoading
  );
  const isPublicStatusLoading = useSelector(
    (state) => state.applications.isPublicStatusLoading
  );

  const isFormSubmitted = useSelector(
    (state) => state.formDelete.formSubmitted
  );
  const publicFormStatus = useSelector(
    (state) => state.formDelete.publicFormStatus
  );
  const draftSubmissionId = useSelector(
    (state) => state.draft.draftSubmission?.applicationId
  );
  // Holds the latest data saved by the server
  const processLoadError = useSelector((state) => state.process?.processLoadError);
  const lastUpdatedDraft = useSelector((state) => state.draft.lastUpdated);
  const isPublic = !props.isAuthenticated;
  const tenantKey = useSelector((state) => state.tenants?.tenantId);
  const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : "/";
  /**
   * `draftData` is used for keeping the uptodate form entry,
   * this will get updated on every change the form is having.
   */
  const [draftData, setDraftData] = useState({});
  const draftRef = useRef();
  const [isDraftCreated, setIsDraftCreated] = useState(false);

  const { formId } = useParams();
  const [validFormId, setValidFormId] = useState(undefined);

  const [showPublicForm, setShowPublicForm] = useState("checking");
  const [poll, setPoll] = useState(DRAFT_ENABLED);
  const exitType = useRef("UNMOUNT");
  const [draftSaved, setDraftSaved] = useState(false);
  const [notified, setNotified] = useState(false);
  const {
    isAuthenticated,
    submission, 
    onSubmit,
    onCustomEvent,
    errors,
    options,
    form: { form, isActive, url, error },
  } = props;

  const [isValidResource, setIsValidResource] = useState(false);

  const dispatch = useDispatch();
  /*
  Selecting which endpoint to use based on authentication status,
  public endpoint or authenticated endpoint.
  */
  const draftCreateMethod = isAuthenticated ? draftCreate : publicDraftCreate;
  const draftUpdateMethod = isAuthenticated ? draftUpdate : publicDraftUpdate;

  const getPublicForm = useCallback(
    (form_id, isObjectId, formObj) => {
      dispatch(setPublicStatusLoading(true));
      dispatch(
        publicApplicationStatus(form_id, (err) => {
          dispatch(setPublicStatusLoading(false));
          if (!err) {
            if (isPublic) {
              if (isObjectId) {
                dispatch(getForm("form", form_id));
                dispatch(setFormStatusLoading(false));
              } else {
                dispatch(
                  setFormRequestData(
                    "form",
                    form_id,
                    `${Formio.getProjectUrl()}/form/${form_id}`
                  )
                );
                dispatch(setFormSuccessData("form", formObj));
                dispatch(setFormStatusLoading(false));
              }
            }
          }
        })
      );
    },
    [dispatch, isPublic]
  );
  const getFormData = useCallback(() => {
    const isObjectId = checkIsObjectId(formId);
    if (isObjectId) {
      getPublicForm(formId, isObjectId);
      setValidFormId(formId);
    } else {
      dispatch(
        fetchFormByAlias(formId, async (err, formObj) => {
          if (!err) {
            const form_id = formObj._id;
            getPublicForm(form_id, isObjectId, formObj);
            setValidFormId(form_id);
          } else {
            dispatch(setFormFailureErrorData("form", err));
          }
        })
      );
    }
  }, [formId, dispatch, getPublicForm]);
  /**
   * Compares the current form data and last saved data
   * Draft is updated only if the form is updated from the last saved form data.
   */
  const saveDraft = (payload, exitType) => {
    if (exitType === "SUBMIT") return;
    let dataChanged = !isEqual(payload.data, lastUpdatedDraft.data);
    if (draftSubmissionId && isDraftCreated) {
      if (dataChanged) {
        setDraftSaved(false);
        dispatch(
          draftUpdateMethod(payload, draftSubmissionId, (err) => {
            if (exitType === "UNMOUNT" && !err && isAuthenticated) {
              toast.success(t("Submission saved to draft."));
            }
            if (!err) {
              setDraftSaved(true);
            } else {
              setDraftSaved(false);
            }
          })
        );
      }
    }
  };

  useEffect(() => {
    if (form._id && !error) setIsValidResource(true);
    return () => setIsValidResource(false);
  }, [error, form._id]);

  useEffect(() => {
    setTimeout(() => {
      setNotified(true);
    }, 5000);
  }, []);

  useEffect(() => {
    if (isDraftCreated) {
      setDraftSaved(true);
    }
  }, [isDraftCreated]);

  /**
   * Will create a draft application when the form is selected for entry.
   */
  useEffect(() => {
    if (
      validFormId &&
      DRAFT_ENABLED &&
      isValidResource &&
      ((isAuthenticated && formStatus === "active") ||
        (!isAuthenticated && publicFormStatus?.status == "active"))
    ) {
      let payload = getDraftReqFormat(validFormId, draftData?.data);
      dispatch(draftCreateMethod(payload, setIsDraftCreated));
    }
  }, [validFormId, formStatus, publicFormStatus, isValidResource]);

  /**
   * We will repeatedly update the current state to draft table
   * on purticular interval
   */
  useInterval(
    () => {
      let payload = getDraftReqFormat(validFormId, { ...draftData?.data });
      saveDraft(payload);
    },
    poll ? DRAFT_POLLING_RATE : null
  );

  /**
   * Save the current state when the component unmounts.
   * Save the data before submission to handle submission failure.
   */
  useEffect(() => {
    return () => {
      let payload = getDraftReqFormat(validFormId, draftRef.current?.data);
      if (poll) saveDraft(payload, exitType.current);
    };
  }, [validFormId, draftSubmissionId, isDraftCreated, poll, exitType.current]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setFormStatusLoading(true));
      dispatch(
        getFormProcesses(formId, (err, data) => {
          if (!err) {
            dispatch(getApplicationCount(data.id));
            setFormStatus(data.status);
            dispatch(setFormStatusLoading(false));
          }else{
            dispatch(setFormStatusLoading(false));
          }
        })
      );
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isPublic) {
      getFormData();
    } else {
      setValidFormId(formId);
    }
  }, [isPublic, dispatch, getFormData]);

  useEffect(() => {
    if (publicFormStatus) {
      if (
        publicFormStatus.anonymous === true &&
        publicFormStatus.status === "active"
      ) {
        setShowPublicForm(true);
      } else {
        setShowPublicForm(false);
      }
    }
  }, [publicFormStatus]);

  useEffect(()=>{
    if(pubSub.publish){
      pubSub.publish('ES_FORM', form);
    }
  },[form, pubSub.publish]);

  if (isActive || isPublicStatusLoading || formStatusLoading) {
    return (
      <div data-testid="loading-view-component">
        <Loading />
      </div>
    );
  }

  if (isFormSubmitted && !isAuthenticated) {
    return (
      <div className="text-center pt-5">
        <h1>{t("Thank you for your response.")}</h1>
        <p>{t("saved successfully")}</p>
      </div>
    );
  }

  if (isPublic && !showPublicForm) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        {t("Form not available")}
      </div>
    );
  }
  return (
    <div className="container overflow-y-auto form-view-wrapper">
      {DRAFT_ENABLED &&
        isAuthenticated &&
        isValidResource &&
        (formStatus === "active" ||
          (publicFormStatus?.anonymous === true &&
            publicFormStatus?.status === "active")) && (
             <span className="pe-2  me-2 d-flex justify-content-end align-items-center">
              {!notified && (
                <span className="text-primary">
                  <i className="fa fa-info-circle me-2" aria-hidden="true"></i>
                  {t(
                    "Unfinished submissions will be saved to Submissions/Drafts."
                  )}
                </span>
              )}

              {notified && poll && (
                <SavingLoading
                  text={
                    draftSaved
                      ? t("Saved to Submissions/Drafts")
                      : t("Saving...")
                  }
                  saved={draftSaved}
                />
              )}
            </span>
         )}
      <div className="d-flex align-items-center justify-content-between">
        <div className="main-header">
          <SubmissionError
            modalOpen={props.submissionError.modalOpen}
            message={props.submissionError.message}
            onConfirm={props.onConfirm}
          ></SubmissionError>
          {isAuthenticated ? (
            <Link
              title={t("Back to Form List")}
              to={`${redirectUrl}form`}
              data-testid="back-to-form-list"
            >
              <i className="fa fa-chevron-left fa-lg me-2" />
            </Link>
          ) : null}

          {form.title ? (
            <h3 className="ms-3 text-truncate form-title">
              <span className="task-head-details">
                <i className="fa-solid fa-file-lines me-2" aria-hidden="true" /> &nbsp;{" "}
                {t("Forms")}/
              </span>{" "}
              {form.title}
            </h3>
          ) : (
            ""
          )}
        </div>
      </div>
      <Errors errors={errors} />
      <LoadingOverlay
        active={isFormSubmissionLoading}
        spinner
        text={<Translation>{(t) => t("Loading...")}</Translation>}
        className="col-12"
      >
  <div className="ms-4 me-4 wizard-tab service-task-details p-3">
    {(isPublic || (formStatus === "active") ) ?  (
      <Form
        form={form}
        submission={submission}
        url={url}
        options={{
          ...options,
          language: lang,
          i18n: RESOURCE_BUNDLES_DATA,
          buttonSettings: { showCancel: false },
        }}
        onChange={(data) => {
          setDraftData(data);
          draftRef.current = data;
        }}
        onSubmit={(data) => {
          setPoll(false);
          exitType.current = "SUBMIT";
          onSubmit(data, form._id, isPublic);
        }}
        onCustomEvent={(evt) => onCustomEvent(evt, redirectUrl)}
      />
    ) : (
      renderPage(formStatus, processLoadError)
    )}
  </div>
      </LoadingOverlay>
    </div>
  );
});

// eslint-disable-next-line no-unused-vars
const doProcessActions = (submission, ownProps) => {
  return (dispatch, getState) => {
    const state = getState();
    let form = state.form?.form;
    let isAuth = state.user.isAuthenticated;
    const tenantKey = state.tenants?.tenantId;
    const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : `/`;
    const origin = `${window.location.origin}${redirectUrl}`;
    dispatch(resetSubmissions("submission"));
    const data = getProcessReq(form, submission._id, origin,submission?.data);
    let draft_id = state.draft.draftSubmission?.id;
    let isDraftCreated = !!draft_id;
    const applicationCreateAPI = selectApplicationCreateAPI(
      isAuth,
      isDraftCreated,
      DRAFT_ENABLED
    );

    dispatch(
      // eslint-disable-next-line no-unused-vars
      applicationCreateAPI(data, draft_id, (err, res) => {
        dispatch(setFormSubmissionLoading(false));
        if (!err) {
          toast.success(
            <Translation>{(t) => t("Submission Saved")}</Translation>
          );
          dispatch(setFormSubmitted(true));
          if (isAuth) {
            dispatch(setMaintainBPMFormPagination(true));
            dispatch(push(`${redirectUrl}form`));
          }
        } else {
          toast.error(
            <Translation>{(t) => t("Submission Failed.")}</Translation>
          );
        }
      })
    );
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user.userDetail,
    tenant: state?.tenants?.tenantId,
    form: selectRoot("form", state),
    isAuthenticated: state.user.isAuthenticated,
    errors: [selectError("form", state), selectError("submission", state)],
    options: {
      noAlerts: false,
      i18n: {
        en: {
          error: <Translation>{(t) => t("Message")}</Translation>,
        },
      },
    },
    submissionError: selectRoot("formDelete", state).formSubmissionError,
  };
};

View.propTypes = {
  form: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  errors: PropTypes.array,
  options: PropTypes.object,
  submissionError: PropTypes.object,
  onSubmit: PropTypes.func,
  onConfirm: PropTypes.func,
  submission:PropTypes.object, 
  onCustomEvent:PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (submission, formId, isPublic) => {
      dispatch(setFormSubmissionLoading(true));
      // this is callback function for submission
      const callBack = (err, submission) => {
        if (!err) {
          dispatch(doProcessActions(submission, ownProps));
        } else {
          const ErrorDetails = {
            modalOpen: true,
            message: (
              <Translation>
                {(t) => t("Submission cannot be done.")}
              </Translation>
            ),
          };
          toast.error(
            <Translation>{(t) => t("Error while Submission.")}</Translation>
          );
          dispatch(setFormSubmissionLoading(false));
          dispatch(setFormSubmissionError(ErrorDetails));
        }
      };
      if (CUSTOM_SUBMISSION_URL && CUSTOM_SUBMISSION_ENABLE) {
        postCustomSubmission(submission, formId, isPublic, callBack);
      } else {
        dispatch(saveSubmission("submission", submission, formId, callBack));
      }
    },
    onCustomEvent: (customEvent, redirectUrl) => {
      switch (customEvent.type) {
        case CUSTOM_EVENT_TYPE.CUSTOM_SUBMIT_DONE:
          toast.success(
            <Translation>{(t) => t("Submission Saved")}</Translation>
          );
          dispatch(push(`${redirectUrl}form`));
          break;
        case CUSTOM_EVENT_TYPE.CANCEL_SUBMISSION:
          dispatch(push(`${redirectUrl}form`));
          break;
        default:
          return;
      }
    },
    onConfirm: () => {
      const ErrorDetails = { modalOpen: false, message: "" };
      dispatch(setFormSubmissionError(ErrorDetails));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
