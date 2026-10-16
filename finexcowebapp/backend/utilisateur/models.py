from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UtilisateurManager(BaseUserManager):
    use_inimigrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not password:
            raise ValueError("Un mot de passe est obligatoire.")
        if not email:
            raise ValueError("L'adresse email est obligatoire.")

        email = self.normalize_email(email)
        utilisateur = self.model(email=email, **extra_fields)
        utilisateur.set_password(password)
        utilisateur.save(using=self._db)
        return utilisateur
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", "ADMIN")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Un super utilisateur doit avoir is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Un surper utilisateur doit avoir is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class Utilisateur(AbstractUser):
    class Role(models.TextChoices):
        APPRENANT = "APPRENANT", "Apprenant"
        ADMIN = "ADMIN", "Administrateur"
        FORMATEUR = "FORMATEUR", "Formateur"

    username = None
    first_name = None
    last_name = None

    nom = models.CharField(max_length=150)
    prenoms = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    telephone = models.CharField(max_length=20)
    role = models.CharField(
        max_length=15,
        choices=Role.choices,
        default=Role.APPRENANT,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nom", "prenoms"]

    objects = UtilisateurManager()