# Divers

## Design tokens Cerba — ⚠️ partiellement sourcé

`design-tokens.md` documente l'identité visuelle Cerba. Le CSS du thème Drupal **n'a jamais pu
être lu** : l'accès réseau sortant est bloqué dans l'environnement d'exécution (refus `403` sur
le tunnel `CONNECT`, pour tous les hôtes — voir §2 du fichier). Une partie des tokens est en
revanche **observée sur des captures d'écran** fournies par l'utilisateur.

Chaque ligne du fichier porte son niveau de source :

- 🟢 **A — Observé** : motif de gras partiel des titres, usages du motif brush, fond blanc.
- 🟡 **B — Estimé** : couleurs, poids, rayons — lus à l'œil sur capture, hexa approximatifs.
- ⛔ **C — Inconnu** : familles de police, échelle typographique, espacement, couleurs d'état.

Points d'attention :

- **Deux valeurs du repli initial sont fausses** et ont été écartées : le fond alterné est
  lavande (pas `#F4F8FB`), l'encre est un bleu marine franc (pas `#1B2B3A`).
- La **couleur secondaire a été identifiée** : c'est le bleu du motif pinceau.
- Logo officiel **non téléchargé** → `assets/logo-cerba-placeholder.svg`, emplacement neutre
  marqué « logo Cerba ». **Le logo n'a pas été redessiné.**
- Motif « coup de pinceau » : **trois usages identifiés**, fichiers SVG non récupérés et
  **non redessinés**.

À faire dès qu'un accès à `www.lab-cerba.com` est disponible : suivre la checklist §11 de
`design-tokens.md`, et ne faire passer en 🟢 que les lignes réellement vérifiées.
