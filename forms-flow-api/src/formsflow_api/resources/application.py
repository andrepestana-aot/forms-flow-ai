"""API endpoints for managing application resource."""

from http import HTTPStatus

from flask import current_app, g, request
from flask_restx import Namespace, Resource

from formsflow_api.exceptions import BusinessException
from formsflow_api.schemas import (
    ApplicationListRequestSchema,
    ApplicationListReqSchema,
    ApplicationSchema,
    ApplicationUpdateSchema,
)
from formsflow_api.services import ApplicationService
from formsflow_api.utils import REVIEWER_GROUP, auth, cors_preflight, profiletime


API = Namespace("Application", description="Application")


@cors_preflight("GET,POST,OPTIONS")
@API.route("", methods=["GET", "OPTIONS"])
class ApplicationsResource(Resource):
    """Resource for managing applications."""

    @staticmethod
    @auth.require
    @profiletime
    def get():
        """Get applications
        Fetch applications list based on parameters
        :params Id: list the application for particular id
        :params applicationName: retrieve application list based on application name
        :params applicationStatus: list all applications based on status
        :params createdBy: to retrieve applications based on createdby
        :params created: retrieve the applications based on date and time
        :params modified: retrieve the applications based on modified date and time
        :params pageNo: to retrieve page number
        :params limit: to retrieve limit for each page
        :params orderBy: Name of column to order by (default: created)
        """
        try: 
            dict_data = ApplicationListRequestSchema().load(request.args) or {}
            page_no = dict_data.get("page_no")
            limit = dict_data.get("limit")
            order_by = dict_data.get("order_by") or "id"
            application_id = dict_data.get("application_id")
            application_name = dict_data.get("application_name")
            application_status = dict_data.get("application_status")
            created_by = dict_data.get("created_by")
            created_from_date = dict_data.get("created_from_date")
            created_to_date = dict_data.get("created_to_date")
            modified_from_date = dict_data.get("modified_from_date")
            modified_to_date = dict_data.get("modified_to_date")
            sort_order = dict_data.get("sort_order") or "desc"
            if auth.has_role([REVIEWER_GROUP]):
                (
                    application_schema_dump,
                    application_count,
                ) = ApplicationService.get_auth_applications_and_count(
                    created_from=created_from_date,
                    created_to=created_to_date,
                    modified_from=modified_from_date,
                    modified_to=modified_to_date,
                    order_by=order_by,
                    sort_order=sort_order,
                    created_by=created_by,
                    application_id=application_id,
                    application_name=application_name,
                    application_status=application_status,
                    token=request.headers["Authorization"],
                    page_no=page_no,
                    limit=limit,
                )
            else:
                (
                    application_schema_dump,
                    application_count,
                ) = ApplicationService.get_all_applications_by_user(
                    user_id=g.token_info.get("preferred_username"),
                    page_no=page_no,
                    limit=limit,
                    order_by=order_by,
                    sort_order=sort_order,
                    created_from=created_from_date,
                    created_to=created_to_date,
                    modified_from=modified_from_date,
                    modified_to=modified_to_date,
                    created_by=created_by,
                    application_id=application_id,
                    application_name=application_name,
                    application_status=application_status,
                )
            application_schema = ApplicationService.apply_custom_attributes(
                    application_schema=application_schema_dump
                )
            return (
                (
                    {
                        "applications": application_schema,
                        "totalCount": application_count,
                        "limit": limit,
                        "pageNo": page_no,
                    }
                ),
                HTTPStatus.OK,
            )
        except KeyError as err:
            response, status = (
                {
                    "type": "Invalid Request Object",
                    "message": "Required fields are not passed",
                },
                HTTPStatus.BAD_REQUEST,
            )

            current_app.logger.critical(response)
            current_app.logger.critical(err)
            return response, status


@cors_preflight("GET,PUT,OPTIONS")
@API.route("/<int:application_id>", methods=["GET", "PUT", "OPTIONS"])
class ApplicationResourceById(Resource):
    """Resource for submissions."""

    @staticmethod
    @auth.require
    @profiletime
    def get(application_id):
        """Get application by id."""
        try:
            if auth.has_role([REVIEWER_GROUP]):
                (
                    application_schema_dump,
                    status,
                ) = ApplicationService.get_auth_by_application_id(
                    application_id=application_id,
                    token=request.headers["Authorization"],
                )
                return (
                    ApplicationService.apply_custom_attributes(application_schema_dump),
                    status,
                )
            else:
                application, status = ApplicationService.get_application_by_user(
                    application_id=application_id,
                    user_id=g.token_info.get("preferred_username"),
                )
                return (ApplicationService.apply_custom_attributes(application), status)
        except BusinessException as err:
            return err.error, err.status_code

    @staticmethod
    @auth.require
    @profiletime
    def put(application_id):
        """Update application details."""
        application_json = request.get_json()
        try:
            application_schema = ApplicationUpdateSchema()
            dict_data = application_schema.load(application_json)
            sub = g.token_info.get("preferred_username")
            dict_data["modified_by"] = sub
            ApplicationService.update_application(
                application_id=application_id, data=dict_data
            )
            return "Updated successfully", HTTPStatus.OK
        except BaseException as submission_err:
            response, status = {
                "type": "Bad request error",
                "message": "Invalid request data",
            }, HTTPStatus.BAD_REQUEST

            current_app.logger.warning(response)
            current_app.logger.warning(submission_err)

            return response, status


@cors_preflight("GET,OPTIONS")
@API.route("/formid/<string:form_id>", methods=["GET", "OPTIONS"])
class ApplicationResourceByFormId(Resource):
    """Resource for submissions."""

    @staticmethod
    @auth.require
    @profiletime
    def get(form_id):
        """Get applications."""
        if request.args:
            dict_data = ApplicationListReqSchema().load(request.args)
            page_no = dict_data["page_no"]
            limit = dict_data["limit"]
        else:
            page_no = 0
            limit = 0

        if auth.has_role(["formsflow-reviewer"]):
            application_schema = ApplicationService.apply_custom_attributes(
                ApplicationService.get_all_applications_form_id(
                    form_id=form_id, page_no=page_no, limit=limit
                )
            )
            application_count = ApplicationService.get_all_applications_form_id_count(
                form_id=form_id
            )
        else:
            application_schema = ApplicationService.apply_custom_attributes(
                ApplicationService.get_all_applications_form_id_user(
                    form_id=form_id,
                    user_id=g.token_info.get("preferred_username"),
                    page_no=page_no,
                    limit=limit,
                )
            )
            application_count = (
                ApplicationService.get_all_applications_form_id_user_count(
                    form_id=form_id, user_id=g.token_info.get("preferred_username")
                )
            )

        if page_no == 0:
            return (
                (
                    {
                        "applications": application_schema,
                        "totalCount": application_count,
                    }
                ),
                HTTPStatus.OK,
            )
        else:
            return (
                (
                    {
                        "applications": application_schema,
                        "totalCount": application_count,
                        "limit": limit,
                        "pageNo": page_no,
                    }
                ),
                HTTPStatus.OK,
            )


@cors_preflight("POST,OPTIONS")
@API.route("/create", methods=["POST", "OPTIONS"])
class ApplicationResourcesByIds(Resource):
    """Resource for submissions."""

    @staticmethod
    @auth.require
    @profiletime
    def post():
        """Post a new application using the request body."""
        application_json = request.get_json()

        try:
            application_schema = ApplicationSchema()
            dict_data = application_schema.load(application_json)
            sub = g.token_info.get("preferred_username")
            dict_data["created_by"] = sub
            application = ApplicationService.create_application(
                data=dict_data, token=request.headers["Authorization"]
            )
            response, status = application_schema.dump(application), HTTPStatus.CREATED
            return response, status
        except BaseException as application_err:
            response, status = {
                "type": "Bad request error",
                "message": "Invalid application request passed",
            }, HTTPStatus.BAD_REQUEST
            current_app.logger.warning(response)
            current_app.logger.warning(application_err)
            return response, status


@cors_preflight("GET,OPTIONS")
@API.route("/<string:application_id>/process", methods=["GET", "OPTIONS"])
class ProcessMapperResourceByApplicationId(Resource):
    """Resource for managing process details."""

    @staticmethod
    @auth.require
    @profiletime
    def get(application_id):

        try:
            return (
                ApplicationService.get_application_form_mapper_by_id(application_id),
                HTTPStatus.OK,
            )
        except BusinessException as err:
            return err.error, err.status_code


@cors_preflight("GET,OPTIONS")
@API.route("/status/list", methods=["GET", "OPTIONS"])
class ApplicationResourceByApplicationStatus(Resource):
    """Get application status."""

    @staticmethod
    @auth.require
    @profiletime
    def get():

        try:
            return (
                ApplicationService.get_all_application_status(),
                HTTPStatus.OK,
            )
        except BusinessException as err:
            return err.error, err.status_code
