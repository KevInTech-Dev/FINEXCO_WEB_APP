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
                    "email": "formateur@example.com",
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

    def test_administrateur_peut_mettre_a_jour_et_fermer_une_session(self):
        self.client.force_authenticate(user=self.administrateur)

        response = self.client.patch(
            reverse("admin-session-detail", kwargs={"pk": self.session.id}),
            {"etat": SessionFormation.EtatSession.FERMEE},
        )

        self.assertEqual(response.status_code, 200)
        self.session.refresh_from_db()
        self.assertEqual(self.session.etat, SessionFormation.EtatSession.FERMEE)

    def test_administrateur_peut_creer_un_formateur(self):
        self.client.force_authenticate(user=self.administrateur)

        response = self.client.post(
            reverse("admin-formateurs"),
            {
                "email": "nouveau.formateur@example.com",
                "nom": "Doe",
                "prenoms": "Jane",
                "telephone": "93333333",
                "password": "SecureTrainerPass938!",
            },
        )

        self.assertEqual(response.status_code, 201)
        formateur = get_user_model().objects.get(
            email="nouveau.formateur@example.com"
        )
        self.assertEqual(formateur.role, get_user_model().Role.FORMATEUR)
        self.assertTrue(formateur.check_password("SecureTrainerPass938!"))
        self.assertTrue(formateur.doit_changer_mot_de_passe)

    def test_apprenant_ne_peut_pas_creer_un_formateur(self):
        apprenant = get_user_model().objects.get(email="apprenant@example.com")
        self.client.force_authenticate(user=apprenant)

        response = self.client.post(
            reverse("admin-formateurs"),
            {
                "email": "interdit@example.com",
                "nom": "Doe",
                "prenoms": "Jane",
                "telephone": "93333333",
                "password": "SecureTrainerPass938!",
            },
        )

        self.assertEqual(response.status_code, 403)
