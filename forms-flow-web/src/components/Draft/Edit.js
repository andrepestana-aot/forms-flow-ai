import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  selectRoot,
  resetSubmissions,
  saveSubmission,
  Form,
  selectError,
  Errors,
} from "@aot-technologies/formio-react";
import { push } from "connected-react-router";
import { Link, useParams } from "react-router-dom";
import { useTranslation, Translation } from "react-i18next";
import LoadingOverlay from "react-loading-overlay-ts";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";

import {RESOURCE_BUNDLES_DATA} from "../../resourceBundles/i18n";

import useInterval from "../../customHooks/useInterval";
import { CUSTOM_EVENT_TYPE } from "../ServiceFlow/constants/customEventTypes";
import selectApplicationCreateAPI from "../Form/constants/apiSelectHelper";
import {
  setFormSubmissionError,
  setFormSubmissionLoading,
  setFormSubmitted,
} from "../../actions/formActions";
import { postCustomSubmission } from "../../apiManager/services/FormServices";
import {
  getProcessReq,
  getDraftReqFormat,
} from "../../apiManager/services/bpmServices";
import {
  deleteDraftbyId,
  draftUpdate,
} from "../../apiManager/services/draftService";
import {
  CUSTOM_SUBMISSION_URL,
  CUSTOM_SUBMISSION_ENABLE,
  MULTITENANCY_ENABLED,
  DRAFT_ENABLED,
  DRAFT_POLLING_RATE,
} from "../../constants/constants";
import Loading from "../../containers/Loading";
import SubmissionError from "../../containers/SubmissionError";
import SavingLoading from "../Loading/SavingLoading";
import Confirm from "../../containers/Confirm";
import { setDraftDelete } from "../../actions/draftActions";
import { setFormStatusLoading } from "../../actions/processActions";
import { getFormProcesses } from "../../apiManager/services/processServices";
import { textTruncate } from "../../helper/helper";
import PropTypes from "prop-types";

const View = React.memo((props) => {
  const { t } = useTranslation();
  const lang = useSelector((state) => state.user.lang);
  const isFormSubmissionLoading = useSelector(
    (state) => state.formDelete.isFormSubmissionLoading
  );
  const isPublicStatusLoading = useSelector(
    (state) => state.applications.isPublicStatusLoading
  );

  const isFormSubmitted = useSelector(
    (state) => state.formDelete.formSubmitted
  );

  const draftDelete = useSelector((state) => state.draft?.draftDelete);

  const isPublic = !props.isAuthenticated;
  const tenantKey = useSelector((state) => state.tenants?.tenantId);
  const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : "/";
  const draftSubmission = useSelector((state) => state.draft.draftSubmission);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  /**
   * `draftData` is used for keeping the uptodate form entry,
   * this will get updated on every change the form is having.
   */
  const [draftData, setDraftData] = useState(draftSubmission?.data);
  // Holds the latest data saved by the server
  const lastUpdatedDraft = useSelector((state) => state.draft.lastUpdated);
  const draftRef = useRef();
  const { formId, draftId } = useParams();
  const [poll, setPoll] = useState(DRAFT_ENABLED);
  const exitType = useRef("UNMOUNT");
  const {
    isAuthenticated,
    submission,
    hideComponents,
    onSubmit,
    onCustomEvent,
    errors,
    options,
    form: { form, isActive, url },
  } = props;
  const dispatch = useDispatch();

  const formStatusLoading = useSelector(
    (state) => state.process?.formStatusLoading
  );

  const processData = useSelector(
    (state) => state.process?.formProcessList
  );

  
  const saveDraft = (payload, exitType) => {
    if (exitType === "SUBMIT" || processData?.status !== "active") return;
    let dataChanged = !isEqual(payload.data, lastUpdatedDraft.data);
    if (draftSubmission?.applicationId) {
      if (String(draftSubmission?.applicationId) !== String(draftId)) return;
      if (dataChanged) {
        setDraftSaved(false);
        if (!showNotification) setShowNotification(true);
        dispatch(
          draftUpdate(payload, draftSubmission?.applicationId, (err) => {
            if (exitType === "UNMOUNT" && !err) {
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
  /**
   * We will repeatedly update the current state to draft table
   * on purticular interval
   */
  useInterval(
    () => {
      let payload = getDraftReqFormat(formId, { ...draftData });
      saveDraft(payload);
    },
    poll ? DRAFT_POLLING_RATE : null
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setFormStatusLoading(true));
      dispatch(
        getFormProcesses(formId,()=>{
          dispatch(setFormStatusLoading(false));
        })
      );
    }
  }, [isAuthenticated,formId]);

  useEffect(() => {
    return () => {
       if(draftRef.current)
      {
        let payload = getDraftReqFormat(formId, draftRef.current);
        if (poll) saveDraft(payload, exitType.current);
      }
    };
  }, [poll, exitType.current, draftSubmission?.id, processData?.status]);

  if (isActive || isPublicStatusLoading || formStatusLoading) {
    return (
      <div data-testid="loading-view-component">
        <Loading />
      </div>
    );
  }



  const deleteDraft = () => {
    dispatch(
      setDraftDelete({
        modalOpen: true,
        draftId: draftSubmission.applicationId,
        draftName: draftSubmission.DraftName,
      })
    );
  };

  const onYes = (e) => {
    e.currentTarget.disabled = true;
    deleteDraftbyId(draftDelete.draftId)
      .then(() => {
        toast.success(t("Draft Deleted Successfully"));
        dispatch(push(`${redirectUrl}draft`));
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        dispatch(
          setDraftDelete({
            modalOpen: false,
            draftId: null,
            draftName: "",
          })
        );
      });
  };

  const onNo = () => {
    dispatch(
      setDraftDelete({
        modalOpen: false,
        draftId: null,
        draftName: "",
      })
    );
  };

  if (isFormSubmitted && !isAuthenticated) {
    //This code has relevance only for form Submission Edit by Anonymous Users
    return (
      <div className="text-center pt-5">
        <h1>{t("Thank you for your response.")}</h1>
        <p>{t("saved successfully")}</p>
      </div>
    );
  }

  return (
    <div className=" overflow-y-auto">
      {

          <span className="pe-2  me-2 d-flex justify-content-end align-items-center">
            {poll && showNotification && (
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

      }
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <SubmissionError
            modalOpen={props.submissionError.modalOpen}
            message={props.submissionError.message}
            onConfirm={props.onConfirm}
          ></SubmissionError>
          {isAuthenticated ? (
            <Link data-testid="back-to-drafts-link" title={t("Back to Drafts")} to={`${redirectUrl}draft`} className="">
              <i className="fa fa-chevron-left fa-lg me-2" />
            </Link>
          ) : null}

          {form.title ? (
            <h3 className="">
              <span className="task-head-details">
                <i className="fa-solid fa-file-lines me-2" aria-hidden="true" /> &nbsp;{" "}
                {t("Drafts")}/
              </span>{" "}
              {textTruncate(60,40,form.title)}
            </h3>
          ) : (
            ""
          )}
        </div>
        {processData?.status === "active" ? (
          <button
            data-testid="draft-discard"
            className="btn btn-danger me-2"
            onClick={() => deleteDraft()}
          >
            {t("Discard Draft")}
          </button>
        ) : (
          ""
        )}
      </div>
      <Errors errors={errors} />
      <LoadingOverlay
        active={isFormSubmissionLoading}
        spinner
        text={<Translation>{(t) => t("Loading...")}</Translation>}
        className="col-12 p-0"
      >
        <div className="mt-4">
        <Confirm
  modalOpen={draftDelete.modalOpen}
  message={
    <>

      {t("Are you sure to delete the draft")} 
      <span className="fw-bold">&nbsp;
        {textTruncate(14, 12, draftDelete.draftName)}
      </span>&nbsp;
      {t("with ID")} 
      <span className="fw-bold">&nbsp;
        {draftDelete.draftId}
      </span> ?
    </>
  }
  onNo={() => onNo()}
  onYes={(e) => {
    exitType.current = "SUBMIT";
    onYes(e);
  }}
/>
          {processData?.status === "active" ? (
            <div className="form-view-wrapper wizard-tab service-task-details">
              <Form
                form={form}
                submission={submission.submission}
                url={url}
                options={{
                  ...options,
                  language: lang,
                  i18n: RESOURCE_BUNDLES_DATA,
                }}
                hideComponents={hideComponents}
                onChange={(formData) => {
                  setDraftData(formData.data);
                  draftRef.current = formData.data;
                }}
                onSubmit={(data) => {
                  setPoll(false);
                  exitType.current = "SUBMIT";
                  onSubmit(data, form._id, isPublic);
                }}
                onCustomEvent={(evt) => onCustomEvent(evt, redirectUrl)}
              />
            </div>
          ) : (
            <span>
              <div
                className="container-md d-flex align-items-center justify-content-center draft-edit flex-column">
                <h3>{t("Form not published")}</h3>
                <p>{t("You can't submit this form until it is published")}</p>
              </div>
            </span>
          )}
        </div>
      </LoadingOverlay>
    </div>
  );
});

const executeAuthSideEffects = (dispatch, redirectUrl) => {
  dispatch(push(`${redirectUrl}draft`));
};

View.propTypes = {
  isAuthenticated: PropTypes.bool,
  form: PropTypes.object,
  submission: PropTypes.object,
  url: PropTypes.string,
  options: PropTypes.object,
  hideComponents: PropTypes.array,
  onSubmit: PropTypes.func,
  onCustomEvent: PropTypes.func,
  submissionError: PropTypes.object,
  onConfirm: PropTypes.func,
  errors: PropTypes.array,
};

// eslint-disable-next-line no-unused-vars
const doProcessActions = (submission, ownProps) => {
  return (dispatch, getState) => {
    const state = getState();
    let form = state.form?.form;
    let isAuth = state.user.isAuthenticated;
    const tenantKey = state.tenants?.tenantId;
    const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : `/`;
    dispatch(resetSubmissions("submission"));
    const origin = `${window.location.origin}${redirectUrl}`;
    const data = getProcessReq(form, submission._id, origin, submission?.data);
    let draft_id = state.draft.submission?.submissionId;
    let isDraftCreated = !!draft_id;
    const applicationCreateAPI = selectApplicationCreateAPI(
      isAuth,
      isDraftCreated,
      DRAFT_ENABLED
    );
   
    dispatch(
      applicationCreateAPI(data, draft_id, (err) => {
        dispatch(setFormSubmissionLoading(false));
        if (!err) {
          toast.success(
            <Translation>{(t) => t("Submission Saved")}</Translation>
          );
        } else {
          toast.error(
            <Translation>{(t) => t("Submission Failed.")}</Translation>
          );
        }
        if (isAuth) executeAuthSideEffects(dispatch, redirectUrl);
        else dispatch(setFormSubmitted(true));
      })
    );
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user.userDetail,
    tenant: state?.tenants?.tenantId,
    form: selectRoot("form", state),
    submission: selectRoot("draft", state),
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
          dispatch(push(`${redirectUrl}draft`));
          break;
        case CUSTOM_EVENT_TYPE.CANCEL_SUBMISSION:
          dispatch(push(`${redirectUrl}draft`));
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
