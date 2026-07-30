# Design tokens — Cerba

> **⛔ AVERTISSEMENT — AUCUNE VALEUR DE CE FICHIER N'A ÉTÉ EXTRAITE DE LA SOURCE CERBA.**
> L'accès réseau sortant est bloqué dans cet environnement (détail §2). Toutes les valeurs
> ci-dessous proviennent soit du **repli fourni dans le brief**, soit de **valeurs neutres
> génériques** que j'ai choisies faute de source. Elles sont à remplacer par extraction réelle
> dès qu'un accès à `www.lab-cerba.com` est disponible. Aucune valeur n'a été devinée « à la
> manière de » Cerba : ce qui n'a pas pu être extrait est marqué manquant, pas comblé.

Date de rédaction : 2026-07-30

---

## 1. Statut d'extraction

| Élément demandé | Statut | Source réelle utilisée |
|---|---|---|
| Feuille de style du thème Drupal `/sites/default/themes/custom/lab/` | ❌ **NON EXTRAITE** | — (réseau bloqué) |
| Bleu primaire | ⚠️ Repli | Brief utilisateur, §REPLI |
| Couleur(s) secondaire(s) | ❌ **NON EXTRAITE** | — aucune valeur, aucun repli fourni |
| Couleurs de fond | ⚠️ Repli | Brief utilisateur, §REPLI |
| Couleur de texte (encre) | ⚠️ Repli | Brief utilisateur, §REPLI |
| Familles de police réelles | ❌ **NON EXTRAITES** | `system-ui` d'attente (brief, §REPLI) |
| Poids de police réels | ❌ **NON EXTRAITS** | — |
| Rayons de bordure | ❌ **NON EXTRAITS** | valeurs neutres génériques (§6) |
| Échelle typographique | ❌ **NON EXTRAITE** | valeurs neutres génériques (§6) |
| Densité d'espacement | ❌ **NON EXTRAITE** | valeurs neutres génériques (§6) |
| Logo SVG officiel | ❌ **NON TÉLÉCHARGÉ** | emplacement neutre, §8 |
| Motif « coup de pinceau » (SVG) | ❌ **NON RÉCUPÉRÉ** | emplacement vide, §9 — **non redessiné** |
| Code identitaire des titres (gras partiel) | ✅ **SOURCÉ** | Brief utilisateur, 3 titres relevés — §10 |

Un seul point de la mission repose sur une source réelle : le motif de mise en gras des
titres (§10), fourni directement dans le brief avec trois exemples relevés sur le site.

---

## 2. Preuve du blocage (pourquoi l'extraction a échoué)

Toutes les requêtes HTTPS sortantes de cette session sont refusées par la passerelle
d'egress, **quel que soit l'hôte** — ce n'est pas une protection anti-bot côté Cerba :

```
https://example.com          -> CONNECT tunnel failed, response 403
https://www.lab-cerba.com/fr -> CONNECT tunnel failed, response 403
https://lab-cerba.com/fr     -> CONNECT tunnel failed, response 403
https://web.archive.org/     -> CONNECT tunnel failed, response 403
```

Journal du proxy (`/__agentproxy/status`, champ `recentRelayFailures`) :

```json
{ "kind": "connect_rejected",
  "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
  "host": "www.lab-cerba.com:443" }
```

L'outil `WebFetch` renvoie également `403 Forbidden` sur `example.com` comme sur
`lab-cerba.com` : même chemin d'egress. La recherche web fonctionne (elle passe par
l'infrastructure Anthropic) mais ne restitue que du texte éditorial — **jamais de règles CSS,
de valeurs hexadécimales ni de code SVG**. Elle n'a donc servi à extraire aucun token.

**Ce qu'il faut débloquer :** autoriser `www.lab-cerba.com` dans la politique réseau de
l'environnement, ou me fournir les fichiers directement (voir §11).

---

## 3. Couleurs — repli du brief

| Token | Valeur | Rôle | Source |
|---|---|---|---|
| `--cerba-blue-primary` | `#005CA9` | Bleu primaire | ⚠️ **Repli du brief — NON EXTRAIT du CSS Cerba** |
| `--cerba-ink` | `#1B2B3A` | Texte principal | ⚠️ **Repli du brief — NON EXTRAIT** |
| `--cerba-surface` | `#FFFFFF` | Fond principal | ⚠️ **Repli du brief — NON EXTRAIT** |
| `--cerba-surface-alt` | `#F4F8FB` | Fond alterné (sections) | ⚠️ **Repli du brief — NON EXTRAIT** |
| `--cerba-secondary` | ❌ **ABSENT** | Couleur secondaire | Aucune valeur — ni extraite, ni fournie en repli. **Ne pas inventer.** |

### Valeurs dérivées

Ces valeurs sont calculées **mécaniquement** à partir du repli (pas relevées sur le site).
Elles disparaîtront ou changeront lors de l'extraction réelle.

| Token | Valeur | Dérivation |
|---|---|---|
| `--cerba-blue-hover` | `#004A87` | `--cerba-blue-primary` assombri (~15 %) — calcul, non sourcé |
| `--cerba-border` | `#D9E4EE` | Bordure neutre accordée au fond alterné — choix neutre, non sourcé |
| `--cerba-muted` | `#5A6B7A` | Texte secondaire, éclairci depuis `--cerba-ink` — calcul, non sourcé |

> ⚠️ Aucune couleur d'état (succès / alerte / erreur) n'est définie : elles n'ont pas pu être
> extraites et le brief n'en fournit pas. Ne pas en improviser.

---

## 4. Typographie — familles

| Token | Valeur | Source |
|---|---|---|
| `--cerba-font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | ⚠️ **Repli du brief, « en attendant identification »** |
| Famille réelle des titres | ❌ **INCONNUE** | Non extraite |
| Famille réelle du corps de texte | ❌ **INCONNUE** | Non extraite |
| Fonte(s) auto-hébergée(s) `@font-face` | ❌ **INCONNUES** | Non extraites — le thème Drupal n'a pas pu être lu |

## 5. Typographie — poids

Le code identitaire de Cerba (§10) repose sur **un contraste de graisse à l'intérieur d'un
même titre**. Les deux graisses réelles sont donc structurantes — et elles sont inconnues.

| Token | Valeur provisoire | Source |
|---|---|---|
| `--cerba-weight-regular` | `400` | ⚠️ Valeur neutre par défaut — **poids réel non extrait** |
| `--cerba-weight-bold` | `700` | ⚠️ Valeur neutre par défaut — **poids réel non extrait** |

> Le couple réel est peut-être 300/600, 400/600 ou 350/700 : l'écart de graisse détermine
> l'intensité du motif identitaire. **À vérifier en priorité lors de l'extraction.**

---

## 6. Rayons, échelle typographique, espacement — valeurs neutres génériques

> ⛔ **Rien dans cette section ne vient de Cerba.** Aucune de ces valeurs n'a pu être
> extraite et le brief n'en fournit aucun repli. Ce sont des valeurs neutres que j'ai
> choisies pour que le fichier soit exploitable, **explicitement signalées comme telles**
> conformément à la consigne (§3 du brief : signaler plutôt que remplacer silencieusement).

### Rayons de bordure — ❌ non extraits

| Token | Valeur neutre | Statut |
|---|---|---|
| `--cerba-radius-sm` | `4px` | ⛔ Générique |
| `--cerba-radius-md` | `8px` | ⛔ Générique |
| `--cerba-radius-lg` | `16px` | ⛔ Générique |
| `--cerba-radius-pill` | `999px` | ⛔ Générique |

### Échelle typographique — ❌ non extraite

Échelle neutre en ratio 1.25 (tierce majeure), base 16px.

| Token | Valeur neutre | Statut |
|---|---|---|
| `--cerba-text-xs` | `0.75rem` / 12px | ⛔ Générique |
| `--cerba-text-sm` | `0.875rem` / 14px | ⛔ Générique |
| `--cerba-text-base` | `1rem` / 16px | ⛔ Générique |
| `--cerba-text-lg` | `1.25rem` / 20px | ⛔ Générique |
| `--cerba-text-xl` | `1.5625rem` / 25px | ⛔ Générique |
| `--cerba-text-2xl` | `1.953rem` / ~31px | ⛔ Générique |
| `--cerba-text-3xl` | `2.441rem` / ~39px | ⛔ Générique |
| `--cerba-text-4xl` | `3.052rem` / ~49px | ⛔ Générique |

### Densité d'espacement — ❌ non extraite

Échelle neutre 4px.

| Token | Valeur neutre | Statut |
|---|---|---|
| `--cerba-space-1` … `--cerba-space-16` | `4px` × n (4, 8, 12, 16, 24, 32, 48, 64) | ⛔ Générique |

> La densité réelle de Cerba (respiration des sections, rythme vertical) est un marqueur
> d'identité fort et **elle est totalement inconnue ici**.

---

## 7. Bloc CSS prêt à l'emploi

Les commentaires `SOURCE:` sont volontairement conservés dans le code : ils empêchent
qu'une valeur de repli passe pour une valeur Cerba au fil des reprises.

```css
:root {
  /* --- Couleurs : REPLI DU BRIEF, non extraites du CSS Cerba --- */
  --cerba-blue-primary: #005CA9;  /* SOURCE: repli brief — À REMPLACER */
  --cerba-ink:          #1B2B3A;  /* SOURCE: repli brief — À REMPLACER */
  --cerba-surface:      #FFFFFF;  /* SOURCE: repli brief — À REMPLACER */
  --cerba-surface-alt:  #F4F8FB;  /* SOURCE: repli brief — À REMPLACER */
  /* --cerba-secondary:            MANQUANT — aucune source, ne pas inventer */

  /* Dérivées par calcul depuis le repli, non sourcées */
  --cerba-blue-hover:   #004A87;
  --cerba-border:       #D9E4EE;
  --cerba-muted:        #5A6B7A;

  /* --- Typographie : familles réelles INCONNUES --- */
  --cerba-font-sans: system-ui, -apple-system, "Segoe UI", Roboto,
                     Helvetica, Arial, sans-serif; /* SOURCE: repli brief */
  --cerba-weight-regular: 400;  /* poids réel non extrait */
  --cerba-weight-bold:    700;  /* poids réel non extrait */

  /* --- Rayons / échelle / espacement : GÉNÉRIQUES, non Cerba --- */
  --cerba-radius-sm: 4px;
  --cerba-radius-md: 8px;
  --cerba-radius-lg: 16px;
  --cerba-radius-pill: 999px;

  --cerba-text-xs:   0.75rem;
  --cerba-text-sm:   0.875rem;
  --cerba-text-base: 1rem;
  --cerba-text-lg:   1.25rem;
  --cerba-text-xl:   1.5625rem;
  --cerba-text-2xl:  1.953rem;
  --cerba-text-3xl:  2.441rem;
  --cerba-text-4xl:  3.052rem;

  --cerba-space-1:  4px;
  --cerba-space-2:  8px;
  --cerba-space-3:  12px;
  --cerba-space-4:  16px;
  --cerba-space-6:  24px;
  --cerba-space-8:  32px;
  --cerba-space-12: 48px;
  --cerba-space-16: 64px;
}
```

---

## 8. Logo — ❌ NON TÉLÉCHARGÉ

Cible : `https://www.lab-cerba.com/sites/default/themes/custom/lab/html/public/assets/images/logo.svg`
→ inaccessible (§2).

Conformément à la consigne : **le logo n'a pas été redessiné, ni approximé, ni remplacé par
un substitut graphique.** Un emplacement neutre est fourni :

- `assets/logo-cerba-placeholder.svg` — cadre neutre portant la mention « logo Cerba ».

Il porte l'attribut `data-cerba-placeholder="logo"` pour être retrouvé et remplacé d'un seul
`grep` le jour où le SVG officiel est disponible.

---

## 9. Motif « coup de pinceau » — ❌ NON RÉCUPÉRÉ

Les SVG de motif brush référencés sur la page d'accueil n'ont pas pu être identifiés :
la page d'accueil elle-même est inaccessible, donc **je ne connais ni leurs URL, ni leur
nombre, ni leur forme**.

**Aucune forme de pinceau n'a été dessinée.** Un tracé « à peu près similaire » serait une
invention d'identité visuelle, ce que le brief interdit. L'emplacement reste vide et signalé.

À récupérer lors du déblocage : les `<img src>` / `background-image` / `<use href>` pointant
vers des SVG sous `/sites/default/themes/custom/lab/` sur `/fr`, puis archiver les fichiers
tels quels dans `assets/`.

---

## 10. Code identitaire des titres — ✅ le seul point sourcé

**Règle :** dans chaque titre, **un seul fragment contigu** est en graisse forte ; tout le
reste est en graisse normale. Le fragment en gras porte le sens distinctif ; le reste porte
le descriptif générique.

Exemples relevés (source : brief utilisateur) :

| Titre | Fragment en gras | Position |
|---|---|---|
| **Cerba** Laboratoire de biologie de spécialité | `Cerba` | début |
| biologie médicale **spécialisée** | `spécialisée` | fin |
| L'innovation, **composante de notre ADN** | `composante de notre ADN` | fin (après virgule) |

**La position du fragment n'est pas fixe** — c'est la valeur sémantique qui décide, pas
l'emplacement. Ce qui est invariant : *exactement un* fragment gras, *jamais zéro, jamais deux*.

### Application

```css
/* Titre : graisse normale par défaut — c'est le fragment qui se détache, pas le titre entier */
.cerba-title {
  font-family: var(--cerba-font-sans);
  font-weight: var(--cerba-weight-regular);
  color: var(--cerba-ink);
  line-height: 1.2;
}
.cerba-title--h1 { font-size: var(--cerba-text-4xl); }
.cerba-title--h2 { font-size: var(--cerba-text-3xl); }
.cerba-title--h3 { font-size: var(--cerba-text-2xl); }

/* L'unique fragment accentué */
.cerba-title__accent { font-weight: var(--cerba-weight-bold); }
```

```html
<h1 class="cerba-title cerba-title--h1">
  <strong class="cerba-title__accent">Cerba</strong> Laboratoire de biologie de spécialité
</h1>

<h2 class="cerba-title cerba-title--h2">
  biologie médicale <strong class="cerba-title__accent">spécialisée</strong>
</h2>

<h2 class="cerba-title cerba-title--h2">
  L'innovation, <strong class="cerba-title__accent">composante de notre ADN</strong>
</h2>
```

Composant réutilisable — l'API force la règle : le titre se déclare en trois morceaux
(avant / accent / après), donc il est impossible d'oublier l'accent ou d'en mettre deux.

```jsx
// before et after sont optionnels ; accent est obligatoire.
export function CerbaTitle({ as: Tag = 'h2', level = 'h2', before, accent, after }) {
  if (!accent) throw new Error('CerbaTitle: un fragment "accent" est obligatoire.');
  return (
    <Tag className={`cerba-title cerba-title--${level}`}>
      {before && <>{before} </>}
      <strong className="cerba-title__accent">{accent}</strong>
      {after && <> {after}</>}
    </Tag>
  );
}

// <CerbaTitle as="h1" level="h1" accent="Cerba" after="Laboratoire de biologie de spécialité" />
// <CerbaTitle before="biologie médicale" accent="spécialisée" />
// <CerbaTitle before="L'innovation," accent="composante de notre ADN" />
```

> Cette règle s'applique à **tous** les titres de l'application. Le repo ne contient
> aujourd'hui aucune interface : la règle est donc livrée sous forme applicable
> (CSS + composant), à câbler sur les titres au fur et à mesure de leur création.

---

## 11. Checklist de reprise (dès que l'accès est ouvert)

1. `curl https://www.lab-cerba.com/fr` → relever le `<link rel="stylesheet">` du thème
   `/sites/default/themes/custom/lab/`.
2. Extraire du CSS : bleu primaire, secondaire(s), fonds, texte — **avec le sélecteur et la
   ligne exacte** de chaque déclaration, à reporter dans la colonne Source.
3. Relever les `@font-face` / `font-family` réels + les deux poids du motif §10.
4. Relever `border-radius`, l'échelle `font-size`, et le rythme d'espacement (§6).
5. `curl .../assets/images/logo.svg` → remplacer `assets/logo-cerba-placeholder.svg`,
   supprimer l'attribut `data-cerba-placeholder`.
6. Identifier et télécharger les SVG « brush » de la home (§9).
7. Retirer les mentions ⚠️/⛔ **uniquement** pour les lignes réellement remplacées, et
   mettre à jour le tableau §1.
