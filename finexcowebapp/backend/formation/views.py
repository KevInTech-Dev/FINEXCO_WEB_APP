from rest_framework import generics, permissions
from .models import Formation
from .selectors import formations_publiques, categories_publiques, formations_administrations
from .serializers import FormationPubliqueSerializer, FormationAdminSerializer, CategoriePubliqueSerializer
from utilisateur.permission import EstAdministrateur

class FormationPubliqueListView(generics.ListAPIView):
    serializer_class = FormationPubliqueSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return formations_publiques()


# On réutilise le même sélecteur pour empêcher l’accès aux brouillons et archives.
class FormationPubliqueDetailView(generics.RetrieveAPIView):
    serializer_class = FormationPubliqueSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return formations_publiques()

class CategoriePubliqueListView(generics.ListAPIView):
    serializer_class = CategoriePubliqueSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return categories_publiques()

class FormationAdminListCreateView(generics.ListCreateAPIView):
    serializer_class = FormationAdminSerializer
    permission_classes = [EstAdministrateur]

    def get_queryset(self):
        return formations_administrations()

class FormationAdminDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = FormationAdminSerializer
    permission_classes = [EstAdministrateur]

    def get_queryset(self):
        return formations_administrations()