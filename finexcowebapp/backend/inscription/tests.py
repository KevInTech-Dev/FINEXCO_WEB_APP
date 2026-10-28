from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase

from formation.models import Categorie, Formation
from inscription.models import Inscription
from session_formation.models import SessionFormation


class InscriptionAdminListTests(APITestCase):
    def setUp(self):
        utilisateur = get_user_model()
        self.administrateur = utilisateur.objects.create_user(
            email="admin@example.com",
            password="AdminPassword123!",
            nom="Admin",
            prenoms="Awa",
            telephone="90000000",
            role=utilisateur.Role.ADMIN,
        )
        self.apprenant = utilisateur.objects.create_user(
            email="apprenant@example.com",
            password="LearnerPassword123!",
            nom="Mensah",
            prenoms="Ama",
            telephone="91111111",
        )
        formateur = utilisateur.objects.create_user(
            email="formateur@example.com",
            password="TrainerPassword123!",
            nom="Koffi",
            prenoms="Yao",
            telephone="92222222",
            role=utilisateur.Role.FORMATEUR,
        )
        formation = Formation.objects.create(
            nom="Comptabilité pratique",
            categorie=Categorie.objects.create(nom="Comptabilité"),
        )
        session = SessionFormation.objects.create(
            formation=formation,
            formateur=formateur,
            date_debut="2026-11-10",
            date_fin="2026-11-12",
            lieu="Lomé",
            prix=25000,
            place_total=12,
        )
        self.inscription = Inscription.objects.create(
            apprenant=self.apprenant,
            session=session,
            date_limite_paiement=timezone.now(),
        )

    def test_administrateur_obtient_la_liste_des_inscriptions(self):
        self.client.force_authenticate(user=self.administrateur)

        response = self.client.get(reverse("admin-inscriptions"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        donnee = response.data[0]
        self.assertEqual(donnee["id"], str(self.inscription.id))
        self.assertEqual(donnee["apprenant"]["email"], self.apprenant.email)
        self.assertEqual(
            donnee["session"]["formation"]["nom"],
            "Comptabilité pratique",
        )

    def test_apprenant_ne_peut_pas_lister_les_inscriptions_admin(self):
        self.client.force_authenticate(user=self.apprenant)

        response = self.client.get(reverse("admin-inscriptions"))

        self.assertEqual(response.status_code, 403)
