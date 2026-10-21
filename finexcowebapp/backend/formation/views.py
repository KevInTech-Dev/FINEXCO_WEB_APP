from rest_framework import generics, permissions

from .selectors import formations_publiques
from .serializers import FormationCatalogueSerializer


class FormationPubliqueListView(generics.ListAPIView):
    serializer_class = FormationCatalogueSerializer

    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return formations_publiques()


class FormationPubliqueDetailView(generics.RetrieveAPIView):
    serializer_class = FormationCatalogueSerializer

    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return formations_publiques()