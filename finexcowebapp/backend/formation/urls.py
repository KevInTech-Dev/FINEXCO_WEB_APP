from django.urls import path

from .views import FormationPubliqueDetailView, FormationPubliqueListView, CategoriePubliqueListView, FormationAdminListCreateView, FormationAdminDetailView


urlpatterns = [
    path("formations/", FormationPubliqueListView.as_view(), name="formations-publiques"),
    path("formations/<uuid:pk>/", FormationPubliqueDetailView.as_view(), name="formation-publique-detail"),
    path("categories/", CategoriePubliqueListView.as_view(), name="categories-publiques"),
    path("admin/formations/", FormationAdminListCreateView.as_view(), name="admin-formations"),
    path("admin/formations/<uuid:pk>", FormationAdminDetailView.as_view(), name="admin-formation-detail")
]