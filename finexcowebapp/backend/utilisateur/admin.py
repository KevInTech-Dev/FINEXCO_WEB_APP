from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import UtilisateurChangeForm, UtilisateurCreationForm
from .models import Utilisateur

@admin.register(Utilisateur)
class UtilisateurAdmin(UserAdmin):
    add_form = UtilisateurCreationForm
    form = UtilisateurChangeForm
    model = Utilisateur

    list_display = ("email", "nom", "prenoms", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("email", "nom", "prenoms")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields" : ("email", "password")}),
        (
            "Informations personnelles",
            {"fields": ("nom", "prenoms", "telephone", "role")},
        ),
        (
            "Permissions Django",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions"
                )
            },
        ),
        (
            "Suivi", 
            {
                "fields": (
                    "id", 
                    "created_at", 
                    "updated_at"
                )
            }
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "nom",
                    "telephone",
                    "role",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser"
                )
            }
        )
    )

    readonly_fields = ("id", "created_at", "updated_at")