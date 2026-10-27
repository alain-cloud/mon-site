# Modifier le portfolio

Les contenus visibles sont dans `content/fr/` et `content/en/`. Chaque dossier contient les mêmes sept fichiers : `profile.md`, `impact.md`, `expertise.md`, `community.md`, `experience.md`, `credentials.md` et `contact.md`.

1. Ouvrir le fichier de la langue à modifier dans VS Code.
2. Modifier les valeurs de l’en-tête entre les deux lignes `---`, ou le texte sous les titres `##`.
3. Enregistrer. Vite actualise le site local automatiquement.
4. Pour mettre à jour le site public, reconstruire puis pousser les changements sur GitHub.

Pour une expérience professionnelle, garder la structure d’un bloc : titre d’entreprise `##`, période sur la ligne suivante, poste(s) en gras sur la ligne d’après, puis description. Les mêmes fichiers alimentent le CV PDF généré dans le navigateur au clic sur « Télécharger le CV ».

Dans `community.md`, modifier les valeurs de l’en-tête pour changer le texte, le lien de l’article Fujitsu ou les titres, identifiants et durées des vidéos YouTube intégrées.

## Assistant recruteur

L’interface du portfolio envoie `{ language, question, profile }` en POST JSON à l’URL indiquée par `VITE_RECRUITER_ASSISTANT_ENDPOINT`. Le service doit répondre avec `{ "answer": "..." }`. Cette URL est publique dans le site; une clé d’IA ne doit jamais être mise dans les variables `VITE_*` ni dans le navigateur. Le service côté serveur doit conserver la clé privée et limiter les requêtes. Sans endpoint configuré, l’interface indique qu’elle attend sa connexion.

## Photo

Le CV Word reçu et l’export LinkedIn ne contenaient pas de photo. Quand le fichier image sera disponible, le placer sous `public/profile-photo.jpg` et l’ajouter au composant de présentation.
