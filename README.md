# Divers

## Veille communication Bioxa → Notion

Fonction serverless Vercel déclenchée par cron **chaque lundi à 06:00 UTC** :

1. appelle l'API Claude (`claude-sonnet-5`) avec l'outil de recherche web ;
2. identifie 5–6 communications récentes dont la mécanique est transposable à un
   laboratoire de biologie médicale ;
3. crée une page par idée dans la base Notion « Veille — Éditions & idées ».

> Le classement « meilleurs posts de la semaine » reste une curation humaine :
> les métriques d'engagement LinkedIn ne sont pas récupérables de façon fiable.
> L'automatisation fait de la **découverte thématique** et de l'**analyse de
> mécanique**, sans inventer de chiffres.

### Fichiers

| Fichier | Rôle |
|---|---|
| `api/veille.js` | Fonction serverless : appel Claude + écriture Notion |
| `vercel.json` | Planification cron (`0 6 * * 1` = lundi 06:00 UTC) |
| `package.json` | Dépendance `@notionhq/client` |

### Variables d'environnement (Vercel → Settings → Environment Variables)

```
ANTHROPIC_API_KEY      = sk-ant-...   (console.anthropic.com — activer la recherche web au niveau organisation)
NOTION_TOKEN           = ntn_...      (notion.so/my-integrations — partager la base avec l'intégration !)
NOTION_DATABASE_ID     = 10631260b7a146c9811a61707b909f7b
NOTION_DATA_SOURCE_ID  = 9d686c25-260b-475f-b21b-4311f304ecda   (optionnel — fallback nouveau format Notion)
CRON_SECRET            = chaîne aléatoire (Vercel l'envoie automatiquement au cron)
```

### Déploiement

1. `npm install`
2. Renseigner les variables d'environnement sur Vercel.
3. **Partager la base Notion avec l'intégration** (base → ⋯ → Connexions), sinon l'écriture échoue.
4. `vercel deploy`
5. Test manuel :
   ```sh
   curl -i https://<projet>.vercel.app/api/veille -H "Authorization: Bearer $CRON_SECRET"
   ```
   puis vérifier les pages créées dans Notion (filtrer par « Semaine »).
6. Laisser le cron tourner. Sur le plan Hobby, l'heure de déclenchement n'est pas
   garantie ; le plan Pro fiabilise le lundi matin.

### Robustesse intégrée

- **Validation des selects** : chaque valeur renvoyée par le modèle est rapprochée
  des options autorisées du schéma Notion (avec alias : Innocent / Michel et
  Augustin → « Innocent / M&A », Institut Curie → « Institut Curie / ARC ») ;
  marque inconnue → « Autre », priorité inconnue → « Moyenne ».
- **`pause_turn`** : la recherche web côté serveur peut suspendre le tour ;
  la fonction relance automatiquement (max 3 reprises).
- **Extraction JSON tolérante** : fences markdown et texte parasite autour du
  tableau sont ignorés.
- **Fallback « data source »** : si l'API Notion réclame le nouveau format,
  la création est retentée avec `parent: { data_source_id }`.
- **Erreurs par idée** : une page qui échoue n'empêche pas les autres ; le
  détail est renvoyé dans la réponse JSON et loggé dans Vercel.
- **Visuel de référence** : laissé vide volontairement (l'API Notion ne peut pas
  uploader de capture) — à déposer à la main.

### Coût indicatif

~8 recherches web (~0,08 $) + tokens Sonnet 5 : **quelques centimes à ~0,20 $ par semaine**.
