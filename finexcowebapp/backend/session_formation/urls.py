from django.urls import path
from .views import (
    FormateurAdminListView,
    SessionAdminDetailView,
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
        "admin/sessions/<uuid:pk>/",
        SessionAdminDetailView.as_view(),
        name="admin-session-detail",
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