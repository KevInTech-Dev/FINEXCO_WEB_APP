from django.urls import path

from .views import SessionsPubliquesFormationView


urlpatterns = [
    path(
        "formations/<uuid:formation_id>/sessions/",
        SessionsPubliquesFormationView.as_view(),
        name="sessions-publiques-formation",
    ),
]