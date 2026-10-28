from django.core.management.base import BaseCommand

from inscription.services import expirer_inscriptions


class Command(BaseCommand):
    # Ce texte explique la commande dans l'aide de manage.py.
    help = "Expire les inscriptions dont le délai de paiement est dépassé."

    def handle(self, *args, **options):
        # On appelle le service qui contient la logique métier d'expiration.
        nombre_expire = expirer_inscriptions()

        # On affiche le nombre d'inscriptions modifiées par le service.
        self.stdout.write(
            self.style.SUCCESS(
                f"{nombre_expire} inscription(s) expirée(s)."
            )
        )