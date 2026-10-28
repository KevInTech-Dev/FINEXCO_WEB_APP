from rest_framework import generics, permissions

from .selectors import formations_publiques
from .serializers import FormationPubliqueSerializer


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