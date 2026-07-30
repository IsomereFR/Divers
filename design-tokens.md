# Design tokens — Cerba

> **Niveau de fiabilité de ce fichier : mixte.** Le CSS du thème Drupal n'a **jamais pu être
> lu** (réseau bloqué, §2). Une partie des tokens est désormais **observée sur des captures
> d'écran fournies par l'utilisateur** — c'est une source réelle, mais imprécise : les hexa
> sont des **estimations visuelles**, pas des valeurs échantillonnées dans le code.
> Chaque ligne porte son niveau. Rien n'a été deviné « à la manière de » Cerba.

Date : 2026-07-30 · Mise à jour : ajout des observations sur captures d'écran

---

## 0. Les trois niveaux de source

| Niveau | Signification | Utilisable ? |
|---|---|---|
| 🟢 **A — Observé** | Structure lisible avec certitude sur les captures (motifs, comportements, usages) | Oui |
| 🟡 **B — Estimé** | Valeur lue à l'œil sur une capture rendue. Ordre de grandeur juste, hexa approximatif | Oui, à titre provisoire |
| ⛔ **C — Inconnu** | Ni extrait, ni observable. Aucune valeur inventée | Non |

Le repli du brief est rétrogradé : là où la capture le contredit, **c'est la capture qui gagne**
(voir §3.1, deux valeurs de repli sont fausses).

---

## 1. Statut d'extraction

| Élément | Niveau | Détail |
|---|---|---|
| Feuille de style `/sites/default/themes/custom/lab/` | ⛔ C | Jamais lue — réseau bloqué |
| Bleu foncé (encre / titres accentués) | 🟡 B | Estimé §3 — **le repli `#1B2B3A` est faux** |
| Bleu intermédiaire (titres non accentués) | 🟡 B | Estimé §3 — non prévu par le repli |
| Bleu « brush » (couleur secondaire) | 🟡 B | Estimé §3 — **identifié, il n'était pas dans le repli** |
| Bleu CTA | 🟡 B | Estimé §3 |
| Fond principal | 🟢 A | Blanc — confirmé |
| Fond alterné | 🟡 B | Estimé §3 — **le repli `#F4F8FB` est faux** (lavande, pas cyan) |
| Familles de police | ⛔ C | Non identifiées — caractéristiques relevées §4 |
| Poids de police | 🟡 B | Trois graisses distinctes observées §5 |
| Rayons de bordure | 🟡 B | Ordre de grandeur observé §6 |
| Échelle typographique | ⛔ C | Rapports observés, valeurs absolues inconnues §6 |
| Densité d'espacement | ⛔ C | Non mesurable sur capture |
| Fichier SVG du logo | ⛔ C | Non téléchargé — **non redessiné** §8 |
| Fichiers SVG « brush » | ⛔ C | Non téléchargés — **non redessinés** §9 |
| Motif de gras partiel des titres | 🟢 A | **Confirmé et enrichi** §10 |
| Usages du motif brush | 🟢 A | Trois usages distincts identifiés §9 |

---

## 2. Pourquoi le CSS n'a pas pu être lu

Toutes les requêtes HTTPS sortantes de la session sont refusées par la passerelle d'egress,
**quel que soit l'hôte** — ce n'est pas une protection anti-bot côté Cerba :

```
https://example.com          -> CONNECT tunnel failed, response 403
https://www.lab-cerba.com/fr -> CONNECT tunnel failed, response 403
https://web.archive.org/     -> CONNECT tunnel failed, response 403
```

Journal du proxy (`/__agentproxy/status`) :

```json
{ "kind": "connect_rejected",
  "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
  "host": "www.lab-cerba.com:443" }
```

`WebFetch` emprunte le même chemin et renvoie le même `403`. Conséquence directe : **aucune
valeur hexadécimale exacte, aucun `font-family`, aucun fichier SVG** n'est accessible. Les
captures compensent partiellement — elles ne remplacent pas le CSS.

---

## 3. Couleurs

### 3.1 Deux valeurs du repli sont contredites par les captures

| Token | Repli du brief | Observation capture | Verdict |
|---|---|---|---|
| Fond alterné | `#F4F8FB` (blanc cyanisé) | Bande nettement **lavande / périwinkle**, saturation visible | ❌ **Repli faux** |
| Encre | `#1B2B3A` (gris-bleu neutre) | **Bleu marine franc**, pas un gris | ❌ **Repli faux** |
| Bleu primaire | `#005CA9` (bleu cyan vif) | Aucun aplat de cette teinte visible ; le marine est plus sombre, le CTA plus violacé | ⚠️ Douteux |

Ne pas repartir du repli pour ces trois-là.

### 3.2 Palette estimée (🟡 niveau B — hexa approximatifs)

| Token | Estimation | Rôle observé | Source |
|---|---|---|---|
| `--cerba-navy` | `≈ #1B3A6B` | Fragment accentué des titres, chiffres-clés, navigation | 🟡 Capture 1 (« Over 650 »), capture 2 (« Tailored and accessible ») |
| `--cerba-slate` | `≈ #5079A8` | Fragment **non** accentué des titres | 🟡 Capture 1 (« The largest European laboratory ») |
| `--cerba-brush` | `≈ #82ACD8` | **Couleur secondaire** — motif pinceau | 🟡 Capture 1 et 2 (aplats du pinceau) |
| `--cerba-cta` | `≈ #1E3F94` | Fond de bouton primaire | 🟡 Capture 2 (« Discover the Group ») |
| `--cerba-card-overlay` | `≈ #2F80C4` | Voile bleu sur vignettes de spécialité | 🟡 Capture 3 |
| `--cerba-surface` | `#FFFFFF` | Fond principal | 🟢 A |
| `--cerba-surface-alt` | `≈ #DBE1EF` | Bandes de section alternées | 🟡 Capture 1 et 2 (bandes pleine largeur) |
| `--cerba-text-body` | `≈ #5C5C5C` | Corps de texte — **gris, pas bleu** | 🟡 Capture 1 et 2 |

> ⚠️ Les hexa ci-dessus sont lus à l'œil sur des captures compressées. Ils donnent la **teinte
> et la valeur justes à quelques unités près**, pas la valeur de marque. À remplacer par
> échantillonnage du CSS.

### 3.3 Ce qui reste inconnu

- Couleurs d'état (succès / alerte / erreur) — ⛔ aucune trace sur les captures.
- Les quatre teintes du logo (dégradé cyan → marine sur les pastilles) — ⛔ non échantillonnables
  de façon fiable, le logo est trop petit sur la capture.
- Le dégradé bleu du bandeau de vignettes (capture 3) semble varier d'une carte à l'autre — ⛔
  comportement non déterminé.

---

## 4. Typographie — familles ⛔ NON IDENTIFIÉES

La famille réelle n'a pas pu être extraite. Caractéristiques relevées sur les captures, à
titre d'indice pour l'identification future — **ce ne sont pas des tokens** :

- Sans-serif humaniste / grotesque, hauteur d'x élevée
- `a` à double étage, terminaisons horizontales, `o` très circulaire
- Chiffres tabulaires larges et ouverts (« 5 000 », « Over 1 300 »)
- Rendu très proche d'une grotesque néo-classique de type Roboto — **ressemblance ≠
  identification, ne pas figer cette hypothèse dans le code**

| Token | Valeur provisoire | Niveau |
|---|---|---|
| `--cerba-font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | ⛔ Repli du brief |

---

## 5. Typographie — poids

**Trois graisses distinctes** sont visibles, pas deux — c'est plus riche que ce que supposait
le brief :

| Token | Estimation | Usage observé | Niveau |
|---|---|---|---|
| `--cerba-weight-light` | `≈ 300` | Titres de page (« About us »), chiffres-clés (« Over 650 ») | 🟡 B |
| `--cerba-weight-regular` | `≈ 400` | Corps de texte, fragment non accentué des titres | 🟡 B |
| `--cerba-weight-bold` | `≈ 700` | Fragment accentué des titres, emphases dans le corps | 🟡 B |

> Le contraste light/bold est le moteur du motif identitaire (§10). Les valeurs exactes
> restent à confirmer : un couple 300/700 et un couple 400/600 ne produisent pas le même effet.

---

## 6. Rayons, échelle, espacement

### Rayons — 🟡 ordre de grandeur observé

| Token | Estimation | Observation |
|---|---|---|
| `--cerba-radius-card` | `≈ 4px` | Vignettes de spécialité (capture 3) — arrondi léger, franchement pas un `pill` |
| `--cerba-radius-button` | `≈ 4px` | Bouton « Discover the Group » (capture 2) |
| `--cerba-radius-circle` | `50%` | 🟢 Boutons-flèche circulaires, portraits ronds |

> Constat utile : l'identité Cerba est **peu arrondie**. Les valeurs `8px` / `16px` que
> j'avais posées en générique au tour précédent sont trop molles — supprimées.

### Échelle typographique — ⛔ valeurs absolues inconnues

Rapports observés, sans mesure fiable en `px` : titre de page > chiffre-clé > titre de
section > corps > légende. Les titres de section des captures 1 et 2 semblent **de taille
identique sur leurs deux lignes**, accentuée ou non — 🟢 la mise en gras ne s'accompagne
d'aucun changement de corps.

### Espacement — ⛔ non mesurable

Seule observation exploitable : 🟢 les sections alternent `--cerba-surface` et
`--cerba-surface-alt` en **bandes pleine largeur**, avec une respiration verticale ample.

---

## 7. Bloc CSS

Les commentaires de niveau sont volontairement conservés dans le code.

```css
:root {
  /* --- Couleurs : ESTIMÉES sur captures (niveau B), à confirmer sur le CSS --- */
  --cerba-navy:         #1B3A6B; /* B ~ fragment accentué, chiffres, nav */
  --cerba-slate:        #5079A8; /* B ~ fragment non accentué */
  --cerba-brush:        #82ACD8; /* B ~ SECONDAIRE, motif pinceau */
  --cerba-cta:          #1E3F94; /* B ~ bouton primaire */
  --cerba-card-overlay: #2F80C4; /* B ~ voile vignettes */
  --cerba-surface:      #FFFFFF; /* A  confirmé */
  --cerba-surface-alt:  #DBE1EF; /* B ~ lavande — PAS le #F4F8FB du repli */
  --cerba-text-body:    #5C5C5C; /* B ~ gris, pas bleu */
  /* états succès/alerte/erreur : INCONNUS — ne pas inventer */

  /* --- Typographie : famille INCONNUE --- */
  --cerba-font-sans: system-ui, -apple-system, "Segoe UI", Roboto,
                     Helvetica, Arial, sans-serif; /* repli brief */
  --cerba-weight-light:   300; /* B */
  --cerba-weight-regular: 400; /* B */
  --cerba-weight-bold:    700; /* B */

  /* --- Rayons : ordre de grandeur observé --- */
  --cerba-radius-card:   4px; /* B */
  --cerba-radius-button: 4px; /* B */

  /* échelle typographique et espacement : NON EXTRAITS, volontairement absents
     plutôt que remplis de valeurs génériques trompeuses */
}
```

---

## 8. Logo — ⛔ fichier NON TÉLÉCHARGÉ

Cible inaccessible :
`https://www.lab-cerba.com/sites/default/themes/custom/lab/html/public/assets/images/logo.svg`

**Le logo n'a pas été redessiné.** Ce que la capture permet seulement de *décrire*, pour que
le remplacement soit sans ambiguïté :

- Mot-symbole « Cerba » en bas-de-casse, graisse légère, bleu marine
- Au-dessus à droite : un groupe de **pastilles rondes disposées en croix**, dans un dégradé
  allant du cyan clair au marine
- Proportion d'ensemble nettement horizontale

Emplacement neutre livré : `assets/logo-cerba-placeholder.svg`, portant
`data-cerba-placeholder="logo"` pour être retrouvé au `grep`. **Cette description ne doit pas
servir à reconstituer le logo** — elle sert à vérifier qu'on a bien téléchargé le bon fichier.

---

## 9. Motif « coup de pinceau » — 🟢 usages identifiés, ⛔ fichiers non récupérés

**Aucune forme de pinceau n'a été dessinée.** La forme exacte des tracés est une signature
graphique : la reproduire de mémoire serait l'inventer. Les captures révèlent en revanche
**trois usages distincts**, ce qui est directement exploitable pour préparer l'intégration :

| # | Usage | Observation |
|---|---|---|
| 1 | **Élément décoratif autonome** | Grand tracé bleu libre, posé à côté du texte, sans fonction de contenu (capture 1, à droite). Texture de brosse sèche très visible, stries blanches dans l'aplat |
| 2 | **Masque / calage de photo** | Le tracé passe derrière et devant un portrait détouré rond, créant un effet de superposition (capture 2, les deux blocs) |
| 3 | **Bord déchiré de vignette** | Sur les vignettes de spécialité, le bandeau bleu du bas a une **arête supérieure en coup de pinceau**, pas une ligne droite (capture 3) |

Caractéristiques communes 🟢 : tracé unique d'un seul geste, opacité partielle laissant voir
ce qu'il y a dessous, texture de brosse sèche conservée (ce n'est pas un aplat lissé).

À récupérer au déblocage : les `<img>`, `background-image` et `<use href>` pointant vers des
SVG sous `/sites/default/themes/custom/lab/`, à archiver tels quels dans `assets/`. Il y en a
**au moins trois différents**, un par usage.

---

## 10. Code identitaire des titres — 🟢 CONFIRMÉ ET ENRICHI

Les captures confirment la règle du brief **et la corrigent sur un point important**.

### La règle

Dans chaque titre, **un seul fragment contigu** est accentué. L'accentuation joue sur
**deux dimensions simultanées** :

1. la **graisse** — le fragment passe en gras, le reste reste léger ;
2. la **couleur** — le fragment passe en marine, le reste reste en bleu intermédiaire.

> ⚠️ **Correction par rapport à la version précédente de ce fichier** : j'y décrivais un
> contraste de graisse seul. Les captures montrent que le changement de couleur est
> systématique et tout aussi porteur. Un titre qui ne joue que sur la graisse n'est pas
> conforme.

Le **corps de texte ne change pas** : 🟢 les deux fragments sont à la même taille.

### Position du fragment : libre

| Titre | Fragment accentué | Position | Source |
|---|---|---|---|
| **Cerba** Laboratoire de biologie de spécialité | `Cerba` | début | Brief |
| biologie médicale **spécialisée** | `spécialisée` | fin | Brief |
| L'innovation, **composante de notre ADN** | `composante de notre ADN` | fin | Brief |
| **Tailored and accessible** guidance for clinicians | `Tailored and accessible` | début | 🟢 Capture 2 |
| The largest European laboratory **for specialized medical biology** | `for specialized medical biology` | fin | 🟢 Capture 1 |
| Expertise reinforced by the **Cerba HealthCare Group** | `Cerba HealthCare Group` | fin | 🟢 Capture 2 |

C'est le **sens** qui décide, pas l'emplacement : l'accent porte le distinctif (la marque, la
spécialité, la promesse), le reste porte le générique.

### Retour à la ligne

🟢 Les titres observés sont composés **sur deux lignes**, avec la coupure placée pour que le
fragment accentué démarre une ligne. Ce n'est pas une règle absolue : dans « Expertise
reinforced by the **Cerba HealthCare Group** », l'accent démarre en milieu de ligne et se
poursuit sur la suivante. **La sémantique prime sur l'alignement.**

### Extension au corps de texte

🟢 Le motif déborde des titres : dans les paragraphes, Cerba met aussi en gras un fragment
porteur (« *Europe's **largest specialized clinical pathology laboratory***… »). Même
principe — une emphase, contiguë, sémantique.

### Application

```css
/* Le titre est léger par défaut : c'est le fragment qui se détache, pas le titre entier */
.cerba-title {
  font-family: var(--cerba-font-sans);
  font-weight: var(--cerba-weight-light);
  color: var(--cerba-slate);
  line-height: 1.25;
}

/* L'unique fragment accentué : graisse ET couleur, les deux ensemble */
.cerba-title__accent {
  font-weight: var(--cerba-weight-bold);
  color: var(--cerba-navy);
  /* pas de font-size ici : le corps est identique — vérifié sur captures */
}

/* Emphase dans le corps de texte : même logique, couleur du texte conservée */
.cerba-body strong {
  font-weight: var(--cerba-weight-bold);
  color: inherit;
}
```

```html
<h2 class="cerba-title">
  The largest European laboratory
  <strong class="cerba-title__accent">for specialized medical biology</strong>
</h2>

<h2 class="cerba-title">
  <strong class="cerba-title__accent">Tailored and accessible</strong>
  guidance for clinicians
</h2>
```

Composant réutilisable — l'API impose la règle : le titre se déclare en trois morceaux, donc
il est structurellement impossible d'oublier l'accent ou d'en poser deux.

```jsx
// before / after optionnels ; accent obligatoire et unique.
// breakBefore insère la coupure de ligne observée sur le site.
export function CerbaTitle({ as: Tag = 'h2', before, accent, after, breakBefore = true }) {
  if (!accent) throw new Error('CerbaTitle: un fragment "accent" est obligatoire.');
  return (
    <Tag className="cerba-title">
      {before && <>{before}{breakBefore ? <br /> : ' '}</>}
      <strong className="cerba-title__accent">{accent}</strong>
      {after && <> {after}</>}
    </Tag>
  );
}

// <CerbaTitle before="The largest European laboratory" accent="for specialized medical biology" />
// <CerbaTitle accent="Tailored and accessible" after="guidance for clinicians" breakBefore={false} />
// <CerbaTitle before="L'innovation," accent="composante de notre ADN" />
```

Cette règle s'applique à **tous** les titres de l'application. Le repo ne contient aujourd'hui
aucune interface : elle est livrée prête à câbler.

---

## 11. Checklist de reprise (dès que l'accès réseau est ouvert)

1. `curl https://www.lab-cerba.com/fr` → relever le `<link rel="stylesheet">` du thème.
2. Échantillonner les hexa réels et **corriger les huit estimations du §3.2**, en notant le
   sélecteur exact de chaque déclaration.
3. Relever le `font-family` réel et les **trois** poids (§5).
4. Mesurer l'échelle typographique et le rythme d'espacement, absents du §6.
5. `curl .../assets/images/logo.svg` → remplacer `assets/logo-cerba-placeholder.svg`,
   supprimer l'attribut `data-cerba-placeholder`.
6. Récupérer les **trois** SVG brush correspondant aux usages du §9.
7. Relever les couleurs d'état, absentes des captures.
8. Faire passer en 🟢 les seules lignes réellement vérifiées, et mettre à jour le §1.
