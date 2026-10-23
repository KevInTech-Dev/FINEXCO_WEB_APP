from rest_framework.permissions import BasePermission


# Cette permission autorise les administrateurs et les superutilisateurs.
class EstAdministrateur(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role == "ADMIN"
                or request.user.is_superuser
            )
        )