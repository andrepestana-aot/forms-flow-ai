"""This manages application Response Schema."""

from marshmallow import EXCLUDE, Schema, fields

from .base_schema import AuditDateTimeSchema


class ApplicationListReqSchema(Schema):
    """This is a general class for paginated request schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    page_no = fields.Int(data_key="pageNo", required=False, allow_none=True)
    limit = fields.Int(required=False, allow_none=True)


class ApplicationListRequestSchema(ApplicationListReqSchema):
    """This class manages application list request schema."""

    order_by = fields.Str(data_key="sortBy", required=False)
    application_id = fields.Str(data_key="Id", required=False)
    application_name = fields.Str(data_key="applicationName", required=False)
    application_status = fields.Str(data_key="applicationStatus", required=False)
    created_by = fields.Str(data_key="createdBy", required=False)
    created_from_date = fields.DateTime(
        data_key="createdFrom", format="%Y-%m-%dT%H:%M:%S+00:00"
    )
    created_to_date = fields.DateTime(
        data_key="createdTo", format="%Y-%m-%dT%H:%M:%S+00:00"
    )
    modified_from_date = fields.DateTime(
        data_key="modifiedFrom", format="%Y-%m-%dT%H:%M:%S+00:00"
    )
    modified_to_date = fields.DateTime(
        data_key="modifiedTo", format="%Y-%m-%dT%H:%M:%S+00:00"
    )
    sort_order = fields.Str(data_key="sortOrder", required=False)
    created_user_submissions = fields.Bool(data_key="createdUserSubmissions")
    parent_form_id = fields.Str(data_key="parentFormId")
    include_drafts = fields.Bool(data_key="includeDrafts")
    only_drafts = fields.Bool(data_key="onlyDrafts")


class ApplicationSchema(AuditDateTimeSchema):
    """This class manages application request and response schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key="id")
    application_name = fields.Str(data_key="applicationName")
    application_status = fields.Str(data_key="applicationStatus")
    form_process_mapper_id = fields.Str(data_key="formProcessMapperId")
    process_instance_id = fields.Str(data_key="processInstanceId")
    process_key = fields.Str(data_key="processKey")
    process_name = fields.Str(data_key="processName")
    process_tenant = fields.Str(data_key="processTenant")
    created_by = fields.Str(data_key="createdBy")
    modified_by = fields.Str(data_key="modifiedBy")
    form_id = fields.Str(data_key="formId", load_only=True)
    latest_form_id = fields.Str(data_key="formId", dump_only=True)
    submission_id = fields.Str(data_key="submissionId")
    form_url = fields.Str(data_key="formUrl", load_only=True)
    web_form_url = fields.Str(data_key="webFormUrl", load_only=True)
    is_resubmit = fields.Bool(data_key="isResubmit", dump_only=True)
    event_name = fields.Str(data_key="eventName", dump_only=True)
    data = fields.Dict(data_key="data")
    is_draft = fields.Bool(data_key="isDraft", dump_only=True)


class ApplicationUpdateSchema(Schema):
    """This class manages application update request schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    application_status = fields.Str(data_key="applicationStatus", required=False)
    form_url = fields.Str(data_key="formUrl", required=False)
    is_resubmit = fields.Bool(data_key="isResubmit")
    event_name = fields.Str(data_key="eventName", allow_none=True)
    data = fields.Dict(data_key="data", required=False, allow_none=True)


class ApplicationSubmissionSchema(Schema):
    """This class provides the schema for application submission data."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    form_url = fields.Str(data_key="formUrl", required=True)
    submission_id = fields.Str(data_key="submissionId", required=True)
    web_form_url = fields.Str(data_key="webFormUrl", load_only=True)
    data = fields.Dict(data_key="data", load_only=True)
