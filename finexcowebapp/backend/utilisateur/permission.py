from rest_framework.permissions import BasePermission


class MotDePassePersonnelDefini(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and not request.user.doit_changer_mot_de_passe
        )


class ChangementMotDePasseRequis(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "FORMATEUR"
            and request.user.doit_changer_mot_de_passe
        )


# Cette permission autorise les administrateurs et les superutilisateurs.
class EstAdministrateur(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and not request.user.doit_changer_mot_de_passe
            and (
                request.user.role == "ADMIN"
                or request.user.is_superuser
            )
        )