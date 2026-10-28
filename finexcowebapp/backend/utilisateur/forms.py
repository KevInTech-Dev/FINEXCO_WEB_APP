from django import forms
from django.contrib.auth import password_validation
from django.contrib.auth.forms import UserChangeForm as DjangoUserChangeForm
from django.core.exceptions import ValidationError

from .models import Utilisateur

class UtilisateurCreationForm(forms.ModelForm):
    password1 = forms.CharField(
        label="Mot de passe",
        widget=forms.PasswordInput,
    )
    password2 = forms.CharField(
        label="Confirmation du mot de passe",
        widget=forms.PasswordInput,
    )

    class Meta:
        model = Utilisateur
        fields = (
            "email",
            "nom",
            "prenoms",
            "telephone",
            "role",
            "is_staff",
            "is_superuser",
        )
    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise ValidationError("Les deux mots de passe ne correspondent pas.")

        if password2:
            password_validation.validate_password(password2, self.instance)

        return password2
    
    def save(self, commit=True):
        utilisateur =super().save(commit=False)
        utilisateur.set_password(self.cleaned_data["password1"])
    
        if commit:
            utilisateur.save()
    
        return utilisateur

class UtilisateurChangeForm(DjangoUserChangeForm):
    class Meta(DjangoUserChangeForm.Meta):
        model = Utilisateur
        fields = (
            "email",
            "nom",
            "prenoms",
            "telephone",
            "role",
            "is_active",
            "is_staff",
            "is_superuser",
            "groups",
            "user_permissions"
        )