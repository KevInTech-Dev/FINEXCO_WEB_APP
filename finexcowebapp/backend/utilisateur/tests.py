from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase


class MotDePasseInitialFormateurTests(APITestCase):
    def setUp(self):
        self.formateur = get_user_model().objects.create_user(
            email="formateur@example.com",
            password="TemporaryTrainerPass93!",
            nom="Mensah",
            prenoms="Kofi",
            telephone="91111111",
            role=get_user_model().Role.FORMATEUR,
            doit_changer_mot_de_passe=True,
        )

    def obtenir_jeton(self, mot_de_passe):
        return self.client.post(
            reverse("connexion"),
            {
                "email": self.formateur.email,
                "password": mot_de_passe,
            },
            format="json",
        )

    def test_formateur_change_son_mot_de_passe_provisoire(self):
        connexion = self.obtenir_jeton("TemporaryTrainerPass93!")
        self.assertEqual(connexion.status_code, 200)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {connexion.data['access']}"
        )

        profil = self.client.get(reverse("mon-profil"))
        self.assertEqual(profil.status_code, 200)
        self.assertTrue(profil.data["doit_changer_mot_de_passe"])

        inscription_interdite = self.client.post(
            reverse("inscriptions"),
            {},
            format="json",
        )
        self.assertEqual(inscription_interdite.status_code, 403)

        changement = self.client.post(
            reverse("mot-de-passe-initial"),
            {"nouveau_mot_de_passe": "PersonalTrainerPass94!"},
            format="json",
        )
        self.assertEqual(changement.status_code, 200)
        self.assertFalse(changement.data["doit_changer_mot_de_passe"])

        self.assertEqual(self.obtenir_jeton("TemporaryTrainerPass93!").status_code, 401)
        nouvelle_connexion = self.obtenir_jeton("PersonalTrainerPass94!")
        self.assertEqual(nouvelle_connexion.status_code, 200)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {nouvelle_connexion.data['access']}"
        )
        inscription_autorisee = self.client.post(
            reverse("inscriptions"),
            {},
            format="json",
        )
        self.assertEqual(inscription_autorisee.status_code, 400)

    def test_mot_de_passe_provisoire_ne_peut_pas_etre_reutilise(self):
        connexion = self.obtenir_jeton("TemporaryTrainerPass93!")
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {connexion.data['access']}"
        )

        changement = self.client.post(
            reverse("mot-de-passe-initial"),
            {"nouveau_mot_de_passe": "TemporaryTrainerPass93!"},
            format="json",
        )

        self.assertEqual(changement.status_code, 400)
        self.formateur.refresh_from_db()
        self.assertTrue(self.formateur.doit_changer_mot_de_passe)
