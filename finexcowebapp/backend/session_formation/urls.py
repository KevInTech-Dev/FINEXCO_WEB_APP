from django.urls import path
from .views import SessionPubliqueListView, SessionCreationView


urlpatterns = [
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