from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from formation.models import Categorie, Formation
from .models import SessionFormation


class FormateurAdminListTests(APITestCase):
    def setUp(self):
        utilisateur = get_user_model()
        self.administrateur = utilisateur.objects.create_user(
            email="admin@example.com",
            password="TestPassword123!",
            nom="Admin",
            prenoms="Awa",
            telephone="90000000",
            role=utilisateur.Role.ADMIN,
        )
        self.formateur = utilisateur.objects.create_user(
            email="formateur@example.com",
            password="TestPassword123!",
            nom="Mensah",
            prenoms="Kofi",
            telephone="91111111",
            role=utilisateur.Role.FORMATEUR,
        )
        utilisateur.objects.create_user(
            email="apprenant@example.com",
            password="TestPassword123!",
            nom="Apprenant",
            prenoms="Ama",
            telephone="92222222",
        )
        self.formation = Formation.objects.create(
            nom="Comptabilité pratique",
            categorie=Categorie.objects.create(nom="Comptabilité"),
        )
        self.session = SessionFormation.objects.create(
            formation=self.formation,
            formateur=self.formateur,
            date_debut="2026-11-10",
            date_fin="2026-11-12",
            lieu="Lomé",
            prix=25000,
            place_total=12,
        )

    def test_administrateur_obtient_la_liste_des_formateurs(self):
        self.client.force_authenticate(user=self.administrateur)

        response = self.client.get(reverse("admin-formateurs"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            [
                {
                    "id": str(self.formateur.id),
                    "nom": "Mensah",
                    "prenoms": "Kofi",
                }
            ],
        )

    def test_apprenant_ne_peut_pas_lister_les_formateurs_admin(self):
        apprenant = get_user_model().objects.get(email="apprenant@example.com")
        self.client.force_authenticate(user=apprenant)

        response = self.client.get(reverse("admin-formateurs"))

        self.assertEqual(response.status_code, 403)

    def test_visiteur_non_connecte_ne_peut_pas_lister_les_formateurs_admin(self):
        response = self.client.get(reverse("admin-formateurs"))

        self.assertEqual(response.status_code, 401)

    def test_administrateur_obtient_toutes_les_sessions(self):
        self.client.force_authenticate(user=self.administrateur)

        response = self.client.get(reverse("admin-sessions"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], str(self.session.id))
        self.assertEqual(response.data[0]["formation"]["nom"], "Comptabilité pratique")
        self.assertEqual(response.data[0]["formateur"]["id"], str(self.formateur.id))

    def test_apprenant_ne_peut_pas_lister_les_sessions_admin(self):
        apprenant = get_user_model().objects.get(email="apprenant@example.com")
        self.client.force_authenticate(user=apprenant)

        response = self.client.get(reverse("admin-sessions"))

        self.assertEqual(response.status_code, 403)
