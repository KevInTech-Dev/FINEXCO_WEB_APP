from rest_framework import generics, permissions

from .serializers import CreationInscriptionSerializer


class CreationInscriptionView(generics.CreateAPIView):
    # La création et ses règles métier passent par le sérialiseur et son service.
    serializer_class = CreationInscriptionSerializer

    # Une inscription à une session exige un compte connecté.
    permission_classes = [permissions.IsAuthenticated]