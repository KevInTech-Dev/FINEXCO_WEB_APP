from django.urls import path

from .views import FormationPubliqueDetailView, FormationPubliqueListView


urlpatterns = [
    path("formations/", FormationPubliqueListView.as_view(), name="liste-formations"),
    path(
        "formations/<uuid:pk>/",
        FormationPubliqueDetailView.as_view(),
        name="detail-formation",
    ),
]