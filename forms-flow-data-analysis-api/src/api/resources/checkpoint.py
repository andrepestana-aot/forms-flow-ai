"""API definiton for Checkpoint."""
from http import HTTPStatus

from flask_restx import Namespace, Resource

from formsflow_api_utils.utils import cors_preflight

API = Namespace("Checkpoint", description="Verify the application's health status.")


@cors_preflight("GET")
@API.route("", methods=["GET"])
class HealthCheckpointResource(Resource):
    """Resource for managing healthcheckpoint."""

    @staticmethod
    def get():
        """Get the status of API."""
        return (
            ({"message": "Welcome to formsflow.ai Data Analysis API"}),
            HTTPStatus.OK,
        )
