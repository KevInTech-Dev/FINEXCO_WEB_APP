from django.urls import path

from .views import SessionPubliqueListView


urlpatterns = [
    path(
        "formations/<uuid:formation_id>/sessions/",
        SessionPubliqueListView.as_view(),
        name="sessions-publiques",
    ),
]