import React, { useEffect , useState, useMemo} from "react";
import { connect, useDispatch, useSelector} from "react-redux";
import {
  selectRoot,
  resetSubmissions,
  saveSubmission,
  Form,
  selectError,
  Errors,
} from "@aot-technologies/formio-react";
import { push } from "connected-react-router";
import { RESOURCE_BUNDLES_DATA } from "../../../../resourceBundles/i18n";
import Loading from "../../../../containers/Loading";

import {
  setFormSubmissionError,
  setFormSubmissionLoading,
} from "../../../../actions/formActions";
import SubmissionError from "../../../../containers/SubmissionError";
import {
  CUSTOM_SUBMISSION_URL,
  CUSTOM_SUBMISSION_ENABLE,
  MULTITENANCY_ENABLED,
} from "../../../../constants/constants";
import {
  CLIENT_EDIT_STATUS,
  UPDATE_EVENT_STATUS,
  getProcessDataReq,
} from "../../../../constants/applicationConstants";
import { useParams } from "react-router-dom";
import { updateApplicationEvent } from "../../../../apiManager/services/applicationServices";
import LoadingOverlay from "react-loading-overlay-ts";
import { toast } from "react-toastify";
import { Translation, useTranslation } from "react-i18next";
import { updateCustomSubmission } from "../../../../apiManager/services/FormServices";
import PropTypes from "prop-types";

const Edit = React.memo((props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.user.lang);
  const { formId, submissionId } = useParams();
  const { 
    onSubmit,
    options,
    errors,
    onFormSubmit,
    onCustomEvent,
    form: { form, isActive: isFormActive },
    submission: { submission, isActive: isSubActive, url },
  } = props;

  const [updatedSubmissionData, setUpdatedSubmissionData] = useState({});

  const applicationStatus = useSelector(
    (state) => state.applications.applicationDetail?.applicationStatus || ""
  );
  const userRoles = useSelector((state) => {
    return selectRoot("user", state).roles;
  });
  const applicationDetail = useSelector(
    (state) => state.applications.applicationDetail
  );

  const isFormSubmissionLoading = useSelector(
    (state) => state.formDelete.isFormSubmissionLoading
  );
  const tenantKey = useSelector((state) => state.tenants?.tenantId);
  const customSubmission = useSelector(
    (state) => state.customSubmission?.submission || {}
  );
  const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : "/";
  useEffect(() => {
    // Check if the application is in "Resubmit" or "Awaiting Acknowledgement" status (old approach and it's kept to have backward compatibility)
    // In the new approach, we will use the "isResubmit" key
    if (applicationStatus && !onFormSubmit) {
      if (
        userRoles.includes('create_submissions') &&
        !CLIENT_EDIT_STATUS.includes(applicationStatus) &&
        !applicationDetail.isResubmit
      ) {
        // Redirect the user to the submission view page if not allowed to edit
        dispatch(push(`/form/${formId}/submission/${submissionId}`));
      }
    }
  }, [
    applicationStatus,
    userRoles,
    dispatch,
    submissionId,
    formId,
    onFormSubmit,
  ]);
  const updatedSubmission = useMemo(()=>{
    if (CUSTOM_SUBMISSION_URL && CUSTOM_SUBMISSION_ENABLE) {
      return customSubmission;
    } else {
      return submission;
    }
  },[customSubmission,submission]);

  if (isFormActive || (isSubActive && !isFormSubmissionLoading) || !updatedSubmission?.data) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="main-header">
        <SubmissionError
          modalOpen={props.submissionError.modalOpen}
          message={props.submissionError.message}
          onConfirm={props.onConfirm}
        ></SubmissionError>
        <h3 className="task-head text-truncate form-title">{form.title}</h3>
      </div>
      <Errors errors={errors} />
      <LoadingOverlay
        active={isFormSubmissionLoading}
        spinner
        text={t("Loading...")}
        className="col-12"
      >
        <div className="ms-4 mb-5 me-4 wizard-tab service-task-details">
          <Form
            form={form}
            submission={isFormSubmissionLoading ? updatedSubmissionData : updatedSubmission}
            url={url} 
            onSubmit={(submission) =>{

              setUpdatedSubmissionData(submission);
              onSubmit(
                submission,
                applicationDetail,
                onFormSubmit,
                form._id,
                redirectUrl
              );
            }

            }
            options={{
              ...options,
              i18n: RESOURCE_BUNDLES_DATA,
              language: lang,
              buttonSettings: { showCancel: false },
            }}
            onCustomEvent={onCustomEvent}
          />
        </div>
      </LoadingOverlay>
    </div>
  );
});

Edit.defaultProps = {
  onCustomEvent: () => {},
};

const mapStateToProps = (state) => {
  return {
    user: state.user.userDetail,
    form: selectRoot("form", state),
    submission: selectRoot("submission", state),
    isAuthenticated: state.user.isAuthenticated,
    errors: [selectError("form", state), selectError("submission", state)],
    options: {
      noAlerts: false,
      i18n: {
        en: {
          error: (
            <Translation>
              {(t) => t("Please fix the errors before submitting again.")}
            </Translation>
          ),
        },
      },
    },
    submissionError: selectRoot("formDelete", state).formSubmissionError,
  };
};

Edit.propTypes = {
  onCustomEvent: PropTypes.func,
  form: PropTypes.object,
  submission: PropTypes.object, 
  errors: PropTypes.array,
  options: PropTypes.object,
  onConfirm: PropTypes.func,
  submissionError: PropTypes.object,
  onSubmit: PropTypes.func,
  onFormSubmit: PropTypes.func,
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const handleSubmissionSuccess = (submission, onFormSubmit, redirectUrl) => {
    dispatch(resetSubmissions("submission"));
    dispatch(setFormSubmissionLoading(false));
    
    if (onFormSubmit) {
      onFormSubmit();
    } else {
      toast.success(<Translation>{(t) => t("Submission Saved")}</Translation>);
      const path = 
      `${redirectUrl}form/${ownProps.match.params.formId}/submission/${submission._id}`;
      dispatch(push(path));
    }
  };

  const handleSubmissionError = () => {
    dispatch(setFormSubmissionLoading(false));
    const ErrorDetails = {
      modalOpen: true,
      message: <Translation>{(t) => t("Submission cannot be done.")}</Translation>,
    };
    toast.error(<Translation>{(t) => t("Error while Submission.")}</Translation>);
    dispatch(setFormSubmissionError(ErrorDetails));
  };

  const handleApplicationEvent = (applicationDetail, submission, onFormSubmit, redirectUrl) => {
    const data = getProcessDataReq(applicationDetail, submission.data);
    dispatch(
      updateApplicationEvent(applicationDetail.id, data, () => {
        handleSubmissionSuccess(submission, onFormSubmit, redirectUrl);
      })
    );
  };

  return {
    onSubmit: (submission, applicationDetail, onFormSubmit, formId, redirectUrl) => {
      dispatch(setFormSubmissionLoading(true));
      
      const callBack = (err, submission) => {
        if (!err) {
          if (UPDATE_EVENT_STATUS.includes(applicationDetail.applicationStatus) || 
              applicationDetail.isResubmit) {
            handleApplicationEvent(applicationDetail, submission, onFormSubmit, redirectUrl);
          } else {
            handleSubmissionSuccess(submission, onFormSubmit, redirectUrl);
          }
        } else {
          handleSubmissionError();
        }
      };

      if (CUSTOM_SUBMISSION_URL && CUSTOM_SUBMISSION_ENABLE) {
        updateCustomSubmission(
          submission,
          onFormSubmit ? formId : ownProps.match.params.formId,
          callBack
        );
      } else {
        dispatch(
          saveSubmission(
            "submission",
            submission,
            onFormSubmit ? formId : ownProps.match.params.formId,
            callBack
          )
        );
      }
    },
    onConfirm: () => {
      dispatch(setFormSubmissionError({ modalOpen: false, message: "" }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
