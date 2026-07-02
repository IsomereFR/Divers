import { Client } from "@notionhq/client";

const SYSTEM = `Tu es l'analyste veille de la plume LinkedIn Bioxa : 16 laboratoires de biologie médicale en Champagne, accrédités COFRAC, spécialités DPNI / cytogénétique / AMP. Ton chaleureux et humain, rigueur médico-scientifique, déontologie stricte (aucun conseil médical, aucune promesse de résultat, COFRAC mentionné avec sobriété, pas de comparatif entre laboratoires).`;

const USER = `Recherche sur le web les communications récentes (7 derniers jours si possible) de ces marques et institutions, et repère celles dont la MÉCANIQUE est transposable à un laboratoire de biologie médicale :
Hors-secteur : Burger King, Duolingo, Ryanair, Decathlon, Back Market, Innocent, Michel et Augustin, Netflix, Spotify, Patagonia.
Santé/biologie : Biogroup, Cerba, Synlab, Eurofins, Unilabs, Inovie, Doctolib.
Science : Institut Pasteur, Inserm, CNRS, Institut Curie.
Sources d'inspiration : Blog du Modérateur, La Réclame, r/marketing.

Sélectionne 5 à 6 communications. Pour chacune, analyse la mécanique (autodérision, storytelling métier, UGC, détournement d'actu, data storytelling, pédagogie visuelle, coulisses, RSE, newsjacking) et conçois une transposition Bioxa concrète, dans le respect de la déontologie médicale. Le champ "pourquoi" explique la mécanique de la publication, sans inventer de chiffres d'engagement.

Réponds UNIQUEMENT par un tableau JSON valide, sans texte autour, sans balises markdown. Chaque objet a exactement ces clés :
{
  "publication": "titre court de l'idée transposée pour Bioxa",
  "marque_source": "une valeur parmi : Burger King, Duolingo, Ryanair, Decathlon, Back Market, Innocent / M&A, Netflix, Spotify, Patagonia, Apple, Biogroup, Cerba, Synlab, Eurofins, Unilabs, Inovie, Doctolib, Institut Pasteur, Inserm, Institut Curie / ARC, Autre",
  "secteur": "Hors-secteur | Santé & biologie | Marque employeur | Institutionnel / science",
  "plateforme": ["une ou plusieurs valeurs parmi : LinkedIn, Reddit, Instagram, TikTok, YouTube, X, Presse / blog"],
  "mecanique": ["une ou plusieurs valeurs parmi : Autodérision, Storytelling métier, UGC / communauté, Détournement d'actu, Data storytelling, Pédagogie visuelle, Émotion maîtrisée, Coulisses, Prise de parole RSE, Newsjacking"],
  "pourquoi": "2 phrases : pourquoi cette mécanique fonctionne",
  "transposition": "angle Bioxa concret + hook proposé, respect Module 5",
  "pilier": "Expertise & vulgarisation | Vie interne & équipes | Qualité & accréditation | Partenariats & RSE | Santé publique & prévention",
  "audience": "1 · Confrères biologistes | 2 · Prescripteurs | 3 · Candidats | 4 · Grand public",
  "lien": "URL de la publication source",
  "priorite": "🔥 Haute | Moyenne | Basse"
}`;

// ---------------------------------------------------------------------------
// Listes autorisées du schéma Notion (les valeurs hors liste créeraient de
// nouvelles options select — on valide donc avant écriture).
// ---------------------------------------------------------------------------
const MARQUES = [
  "Burger King", "Duolingo", "Ryanair", "Decathlon", "Back Market",
  "Innocent / M&A", "Netflix", "Spotify", "Patagonia", "Apple",
  "Biogroup", "Cerba", "Synlab", "Eurofins", "Unilabs", "Inovie",
  "Doctolib", "Institut Pasteur", "Inserm", "Institut Curie / ARC", "Autre",
];
// Le prompt cite des noms qui n'existent pas tels quels dans le select Notion.
const MARQUE_ALIASES = {
  "innocent": "Innocent / M&A",
  "michel et augustin": "Innocent / M&A",
  "institut curie": "Institut Curie / ARC",
  "arc": "Institut Curie / ARC",
};
const SECTEURS = ["Hors-secteur", "Santé & biologie", "Marque employeur", "Institutionnel / science"];
const PLATEFORMES = ["LinkedIn", "Reddit", "Instagram", "TikTok", "YouTube", "X", "Presse / blog"];
const MECANIQUES = [
  "Autodérision", "Storytelling métier", "UGC / communauté", "Détournement d'actu",
  "Data storytelling", "Pédagogie visuelle", "Émotion maîtrisée", "Coulisses",
  "Prise de parole RSE", "Newsjacking",
];
const PILIERS = [
  "Expertise & vulgarisation", "Vie interne & équipes", "Qualité & accréditation",
  "Partenariats & RSE", "Santé publique & prévention",
];
const AUDIENCES = ["1 · Confrères biologistes", "2 · Prescripteurs", "3 · Candidats", "4 · Grand public"];
const PRIORITES = ["🔥 Haute", "Moyenne", "Basse"];

const norm = (s) => String(s ?? "").trim().toLowerCase();

/** Rapproche une valeur d'une option select autorisée (insensible à la casse). */
function matchSelect(value, allowed) {
  const v = norm(value);
  if (!v) return null;
  return allowed.find((o) => norm(o) === v)
    ?? allowed.find((o) => norm(o).includes(v) || v.includes(norm(o)))
    ?? null;
}

function matchMarque(value) {
  const alias = MARQUE_ALIASES[norm(value)];
  return alias ?? matchSelect(value, MARQUES) ?? "Autre";
}

function matchAudience(value) {
  const direct = matchSelect(value, AUDIENCES);
  if (direct) return direct;
  const digit = String(value ?? "").match(/[1-4]/);
  return digit ? AUDIENCES[Number(digit[0]) - 1] : null;
}

function matchMulti(values, allowed) {
  return [...new Set((Array.isArray(values) ? values : [values])
    .map((v) => matchSelect(v, allowed))
    .filter(Boolean))];
}

/** Lundi de la semaine courante au format YYYY-MM-DD. */
function mondayISO() {
  const d = new Date();
  const day = (d.getUTCDay() + 6) % 7; // 0 = lundi
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

/** Extrait le tableau JSON de la réponse du modèle (tolère fences et texte autour). */
function extractIdeas(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Pas de tableau JSON dans la réponse du modèle : ${cleaned.slice(0, 300)}`);
  }
  const ideas = JSON.parse(cleaned.slice(start, end + 1));
  if (!Array.isArray(ideas) || ideas.length === 0) {
    throw new Error("Le modèle a renvoyé un tableau vide");
  }
  return ideas;
}

/**
 * Appelle Claude avec la recherche web. Les outils serveur peuvent renvoyer
 * stop_reason "pause_turn" avant la fin : on relance jusqu'à 3 fois en
 * réinjectant la réponse partielle.
 */
async function askClaude() {
  const messages = [{ role: "user", content: USER }];
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5", // ou "claude-opus-4-8" pour qualité max
        max_tokens: 8000,
        system: SYSTEM,
        messages,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`API Anthropic ${res.status} : ${JSON.stringify(data.error ?? data)}`);
    }
    if (data.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: data.content });
      continue;
    }
    if (data.stop_reason === "refusal") {
      throw new Error("Le modèle a refusé la requête (stop_reason: refusal)");
    }
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return extractIdeas(text);
  }
  throw new Error("Trop de pause_turn successifs, abandon");
}

function buildProperties(idea, semaine) {
  const secteur = matchSelect(idea.secteur, SECTEURS);
  const pilier = matchSelect(idea.pilier, PILIERS);
  const audience = matchAudience(idea.audience);
  const priorite = matchSelect(idea.priorite, PRIORITES) ?? "Moyenne";
  const lien = /^https?:\/\//.test(idea.lien ?? "") ? idea.lien : null;

  const props = {
    "Publication": { title: [{ text: { content: idea.publication || "Idée sans titre" } }] },
    "Semaine": { date: { start: semaine } },
    "Marque source": { select: { name: matchMarque(idea.marque_source) } },
    "Plateforme": { multi_select: matchMulti(idea.plateforme, PLATEFORMES).map((name) => ({ name })) },
    "Mécanique": { multi_select: matchMulti(idea.mecanique, MECANIQUES).map((name) => ({ name })) },
    "Pourquoi ça performe": { rich_text: [{ text: { content: String(idea.pourquoi ?? "").slice(0, 2000) } }] },
    "Transposition Bioxa": { rich_text: [{ text: { content: String(idea.transposition ?? "").slice(0, 2000) } }] },
    "Statut": { select: { name: "À explorer" } },
    "Priorité": { select: { name: priorite } },
  };
  if (secteur) props["Secteur"] = { select: { name: secteur } };
  if (pilier) props["Pilier Bioxa"] = { select: { name: pilier } };
  if (audience) props["Audience"] = { select: { name: audience } };
  if (lien) props["Lien source"] = { url: lien };
  return props;
}

/**
 * Crée la page dans Notion. Si l'API réclame le nouveau format « data source »,
 * on retente avec parent data_source_id et la version d'API correspondante.
 */
async function createNotionPage(notion, properties) {
  try {
    return await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties,
    });
  } catch (err) {
    if (!/data.?source/i.test(String(err?.message ?? ""))) throw err;
    const dataSourceId = process.env.NOTION_DATA_SOURCE_ID || "9d686c25-260b-475f-b21b-4311f304ecda";
    const notionV2 = new Client({ auth: process.env.NOTION_TOKEN, notionVersion: "2025-09-03" });
    return await notionV2.pages.create({
      parent: { type: "data_source_id", data_source_id: dataSourceId },
      properties,
    });
  }
}

export default async function handler(req, res) {
  // Sécurité : Vercel Cron envoie l'en-tête Authorization: Bearer <CRON_SECRET>
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    const ideas = await askClaude();
    const semaine = mondayISO();
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const created = [];
    const errors = [];
    for (const idea of ideas) {
      try {
        const page = await createNotionPage(notion, buildProperties(idea, semaine));
        created.push(page.id);
      } catch (err) {
        console.error(`Échec création page "${idea.publication}" :`, err);
        errors.push({ publication: idea.publication, error: String(err?.message ?? err) });
      }
    }

    const ok = created.length > 0;
    return res.status(ok ? 200 : 500).json({
      ok,
      semaine,
      ideas: ideas.length,
      created: created.length,
      ...(errors.length ? { errors } : {}),
    });
  } catch (err) {
    console.error("Veille Bioxa — échec :", err);
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
}
