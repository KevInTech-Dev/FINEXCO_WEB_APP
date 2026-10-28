from django.urls import path
from .views import (
    FormateurAdminListView,
    SessionAdminListView,
    SessionCreationView,
    SessionPubliqueListView,
)


urlpatterns = [
    path(
        "admin/formateurs/",
        FormateurAdminListView.as_view(),
        name="admin-formateurs",
    ),
    path(
        "admin/sessions/",
        SessionAdminListView.as_view(),
        name="admin-sessions",
    ),
    path(
        "formations/<uuid:formation_id>/sessions/",
        SessionPubliqueListView.as_view(),
        name="sessions-publiques",
    ),
    path(
        "sessions/",
        SessionCreationView.as_view(),
        name="session_created",
    ),
]