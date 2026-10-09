/**
 * Old rafikihub.com tables → new RafikiHub records. Pure functions: no database, no network,
 * so they can be tested against a sample export. The column names and value formats come from
 * the old PHP code (see docs/MIGRATION.md).
 *
 * Deliberately left out of the new site: ID/passport numbers, KRA PINs, physical addresses and every
 * uploaded document (`files`), plus members' phone and email on their public profile (those stay
 * on the private account record).
 */

/* ───────────── small helpers ───────────── */

/** The old code writes the text "NULL" and empty strings for missing values. */
export const clean = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" || s.toUpperCase() === "NULL" ? null : s;
};

/** Undoes UTF-8 text that was stored through a latin1 connection ("WanjirÅ©" → "Wanjirũ"). */
export function fixText(v) {
  const s = clean(v);
  if (!s || !/[ÃÂÅÄâ€]/.test(s)) return s;
  const fixed = Buffer.from(s, "latin1").toString("utf8");
  return fixed.includes("�") ? s : fixed;
}

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", hellip: "…" };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : entities[e.toLowerCase()] ?? m);

/** HTML (TinyMCE) → plain text with paragraph breaks. */
export function htmlToText(v) {
  const s = fixText(v);
  if (!s) return null;
  const text = decode(
    s
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "\n\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text || null;
}

/** HTML → the blog's { heading?, text }[] blocks: h1–h4 start a section, paragraphs follow. */
export function htmlToBlocks(v) {
  const s = fixText(v) ?? "";
  const parts = s.split(/(<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>)/i);
  const blocks = [];
  for (const part of parts) {
    const h = /^<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>$/i.exec(part.trim());
    if (h) {
      const heading = htmlToText(h[1]);
      if (heading) blocks.push({ heading, text: "" });
      continue;
    }
    const paras = (htmlToText(part) ?? "").split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    for (const text of paras) {
      const last = blocks[blocks.length - 1];
      if (last?.heading && !last.text) last.text = text;
      else blocks.push({ text });
    }
  }
  return blocks.filter((b) => b.text || b.heading).map((b) => (b.heading && !b.text ? { text: b.heading } : b));
}

/** "Y-m-d", "Y-m-d H:i:s" or datetime-local → "Y-m-d"; 0000-00-00 → null. */
export function dateOnly(v) {
  const s = clean(v);
  const m = s && /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!m || m[1] === "0000" || m[2] === "00" || m[3] === "00") return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

/** Old timestamps are Nairobi time (UTC+3) → ISO string. */
export function timestamp(v) {
  const s = clean(v);
  const m = s && /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(s);
  if (!m || m[1] === "0000") return dateOnly(v) ? `${dateOnly(v)}T00:00:00+03:00` : null;
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}+03:00`;
}

const int = (v) => {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : null;
};

const yes = (v) => /^(yes|1|true)$/i.test(String(v ?? "").trim());

/** Matches free text against an option list, ignoring case and spacing. */
function option(v, options) {
  const s = clean(v);
  if (!s) return null;
  const key = s.toLowerCase().replace(/[\s_-]+/g, "");
  return options.find((o) => o.toLowerCase().replace(/[\s_-]+/g, "") === key) ?? null;
}

const groupBy = (rows = [], key) => {
  const map = new Map();
  for (const r of rows) {
    const k = r[key];
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  }
  return map;
};

/* ───────────── profile link names ───────────── */

/** URL-safe link names; "." and ".." alone aren't allowed. Mirrors lib/admin/profile-form.ts. */
export const LINK_NAME = /^(?!\.{1,2}$)[A-Za-z0-9._-]{1,120}$/;

/** "Wanjirũ Mwangi" → "wanjiru-mwangi" */
export const slugify = (s) =>
  String(s ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

/* ───────────── option lists (mirror lib/data.ts) ───────────── */

export const lists = {
  appearance: ["Black-African", "Mixed Race", "East Asian", "South Asian", "Arab", "White", "Other"],
  eyeColor: ["Black", "Dark Brown", "Brown", "Hazel", "Green", "Blue", "Grey"],
  hairColor: ["Black", "Dark Brown", "Brown", "Auburn", "Blonde", "Red", "Grey", "White", "Dyed"],
  hairLength: ["Shaved", "Bald", "Short", "Mid Length", "Long", "Very Long", "Locs", "Braids"],
  facialHair: ["Clean Shaven", "Stubble", "Moustache", "Goatee", "Full Beard"],
  voiceQuality: ["Husky", "Strong", "Warm", "Bright", "Deep", "Soft", "Gravelly", "Breathy"],
  voiceCharacter: ["Sincere", "Authoritative", "Friendly", "Conversational", "Energetic", "Calm", "Playful"],
  traits: ["Tatoo", "Piercing", "Birthmark", "Scar"],
  categories: ["Actor", "Actress", "Young Performer", "Independent Performer", "Model", "Voice Over Artist", "Dancer", "Musician", "Presenter", "Fashion Stylist", "Fashion Designer", "Make-up Artist", "Photographer", "Wardrobe", "Crew", "Pet"],
  // Pet options from the old pets-body.php (mirrors lib/data.ts)
  petType: ["Dog", "Cat", "Bird", "Parrot", "Horse", "Fish", "Hamster", "Mouse", "Lizard", "Snake", "Other"],
  petSize: ["Very Small", "Small", "Medium", "Large"],
  petTraining: ["Basic", "Intermediate", "Expert"],
  petSkills: ["Chase", "Fetch", "Fly", "Growl", "Jump", "Lie Down", "Retrieve", "Roll Over", "Run", "Shake Hand", "Sit"],
  petPersonality: ["Calm", "Playful", "Energetic", "Aggressive"],
};

/** Old membership_category → new profile category. */
export function profileCategory(old, role) {
  const s = (clean(old) ?? "").toLowerCase();
  if (s.startsWith("independent")) return "Independent Performer";
  if (s.replace(/[\s-]/g, "") === "makeupartist") return "Make-up Artist";
  if (s.includes("voice")) return "Voice Over Artist";
  return option(old, lists.categories) ?? (role === 4 ? "Crew" : "Independent Performer");
}

/* ───────────── measurements ───────────── */

/** "5 feet" + "8 inches", or "172 cm" → { feet, inches } */
export function height(first, second) {
  const a = clean(first);
  if (!a) return null;
  const cm = /([\d.]+)\s*cm/i.exec(a);
  if (cm) {
    const total = Number(cm[1]) / 2.54;
    if (!(total > 20 && total < 110)) return null;
    let feet = Math.floor(total / 12);
    let inches = Math.round(total - feet * 12);
    if (inches === 12) { feet += 1; inches = 0; }
    return { feet, inches };
  }
  const feet = int(a);
  if (!feet || feet < 2 || feet > 8) return null;
  const inches = int(clean(second)) ?? 0;
  return { feet, inches: inches >= 0 && inches <= 11 ? inches : 0 };
}

/** "34 inches", "86 cm", "34" → { value, unit } */
export function measurement(v) {
  const s = clean(v);
  if (!s) return null;
  const m = /([\d.]+)\s*(cm|in|inch|inches|")?/i.exec(s);
  if (!m) return null;
  const value = Number(m[1]);
  if (!(value > 0 && value < 300)) return null;
  return { value, unit: /cm/i.test(m[2] ?? "") ? "cm" : "inches" };
}

/**
 * The old pet columns → the new pet details. Skills were stored as one string of picks ("Fetch Roll Over Sit"),
 * so known skills are matched inside it; "Retreive" was misspelt on the old form, and "Sit Down" folds into "Sit".
 */
export function petDetails(u) {
  const raw = (fixText(u.pet_skills) ?? "").toLowerCase().replace(/retreive/g, "retrieve").replace(/sit down/g, "sit");
  const skills = lists.petSkills.filter((k) => new RegExp(`(^|[^a-z])${k.toLowerCase()}([^a-z]|$)`).test(raw));
  const trained = /^yes$/i.test(clean(u.pet_trained) ?? "");
  return {
    type: option(u.pet_type, lists.petType) ?? (clean(u.pet_type) ? "Other" : null),
    breed: fixText(u.pet_breed),
    size: option(u.pet_size, lists.petSize),
    trained,
    trainingLevel: trained ? option(u.pet_trained_level, lists.petTraining) : null,
    skills,
    personality: option(u.pet_personality, lists.petPersonality),
  };
}

const creditType = (t) => {
  const s = (clean(t) ?? "").toLowerCase();
  if (/film|movie|feature|short|documentary/.test(s)) return "Film";
  if (/tele|tv|series|soap/.test(s)) return "TV";
  if (/stage|theat|play|musical/.test(s)) return "Theatre";
  if (/commercial|advert|tvc/.test(s)) return "Commercial";
  if (/radio/.test(s)) return "Radio";
  if (/voice/.test(s)) return "Voice Over";
  if (/music/.test(s)) return "Music Video";
  return "Other";
};

/* ───────────── the conversion ───────────── */

const ROLE = { 2: "casting", 3: "performer", 4: "performer", 5: "performer" };
const planFor = (billtime) => ({ 1: "basic", 6: "standard", 12: "premium" })[int(billtime)] ?? null;
const accountStatus = (s) => {
  const v = (clean(s) ?? "").toLowerCase();
  if (v === "active" || v === "blocked" || v === "expired") return v;
  if (v === "unpaid") return "expired";
  return "unverified";
};

/**
 * @param {Map<string, object[]>} t tables from parseDump
 * @param {{ assetsBase: string }} opts where the old uploaded files are reachable, e.g. https://rafikihub.com
 */
export function transform(t, { assetsBase }) {
  const base = assetsBase.replace(/\/$/, "");
  const asset = (folder, name) => (clean(name) && clean(name) !== "user.jpg" ? `${base}/assets/${folder}/${encodeURIComponent(clean(name))}` : null);
  const report = { skipped: {}, notes: [] };
  const skip = (why) => { report.skipped[why] = (report.skipped[why] ?? 0) + 1; };

  const users = t.get("users") ?? [];
  const by = (table, key = "user_id") => groupBy(t.get(table), key);
  const cities = by("cities"), nats = by("nationalities"), traits = by("traits"), skills = by("skills");
  const credits = by("credits"), training = by("training"), photos = by("photos"), videos = by("videos"), voices = by("voices");

  /* accounts: one per email, keeping the best row when the old site let an email register twice */
  const rank = (u) => [accountStatus(u.status) === "active" ? 1 : 0, timestamp(u.last_login) ?? "", int(u.id)];
  const better = (a, b) => { const x = rank(a), y = rank(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return false; };
  const byEmail = new Map();
  for (const u of users) {
    const role = ROLE[int(u.roles_id)];
    if (!role) { skip(int(u.roles_id) === 1 ? "admin/test accounts (role 1)" : int(u.roles_id) === 6 ? "rooms and studio accounts (no home on the new site)" : "accounts with an unknown role"); continue; }
    const email = clean(u.email)?.toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { skip("accounts without a valid email"); continue; }
    const prev = byEmail.get(email);
    if (prev) { skip("duplicate emails (kept the active or most recent account)"); if (!better(u, prev)) continue; }
    byEmail.set(email, u);
  }
  const kept = [...byEmail.values()];
  const keptIds = new Set(kept.map((u) => int(u.id)));

  // Link names: keep the old one so old links keep working; members who never had a usable one get one from their name
  const linkFor = new Map();
  const taken = new Set();
  let generated = 0;
  for (const u of kept) if (ROLE[int(u.roles_id)] === "performer") {
    const raw = clean(u.link_url);
    if (raw && LINK_NAME.test(raw) && !taken.has(raw.toLowerCase())) { linkFor.set(u.id, raw); taken.add(raw.toLowerCase()); }
  }
  for (const u of kept) if (ROLE[int(u.roles_id)] === "performer" && !linkFor.has(u.id)) {
    const base = slugify(fixText(u.name)) || "member";
    let link = base;
    for (let n = 2; taken.has(link.toLowerCase()); n++) link = `${base}-${n}`;
    linkFor.set(u.id, link);
    taken.add(link.toLowerCase());
    generated++;
  }
  if (generated) report.notes.push(`${generated} profiles had no usable link name on the old site, so one was made from the member's name.`);

  const accounts = kept.map((u) => {
    const role = ROLE[int(u.roles_id)];
    const code = clean(u.code);
    const phone = clean(u.phone);
    const md5 = /^[a-f0-9]{32}$/i.test(clean(u.password) ?? "");
    return {
      legacy_id: int(u.id),
      email: clean(u.email).toLowerCase(),
      name: fixText(u.name) ?? "RafikiHub member",
      role,
      category: fixText(u.alt_title) ?? fixText(u.membership_category),
      password_hash: md5 ? clean(u.password).toLowerCase() : null,
      hash_algo: md5 ? "md5" : null,
      status: accountStatus(u.status),
      is_admin: int(u.is_admin) === 1,
      phone: phone ? (code && code !== "0" ? `${code} ${phone}` : phone) : null,
      country: fixText(u.country),
      // Performers, crew and pets have public profiles; casting accounts don't
      profile_url: linkFor.get(u.id) ?? null,
      plan_id: planFor(u.billtime),
      last_login_at: timestamp(u.last_login),
      created_at: timestamp(u.created_at),
    };
  });

  /* talent profiles: performers, crew and pets */
  const profiles = [];
  for (const u of kept) {
    const roleId = int(u.roles_id);
    if (roleId === 2) continue;
    const url = linkFor.get(u.id);
    const id = u.id;
    const sk = skills.get(id) ?? [];
    const skillNames = (types) => [...new Set(sk.filter((s) => types.includes((clean(s.type) ?? "").toLowerCase())).map((s) => fixText(s.name)).filter(Boolean))];
    const pics = (photos.get(id) ?? []).filter((p) => int(p.status) !== 0).sort((a, b) => (int(b.profile) ?? 0) - (int(a.profile) ?? 0) || int(a.id) - int(b.id));
    // Every showreel and voice clip, oldest first, with the title the member gave it
    const clipsFrom = (rows, folder) => (rows ?? []).slice().sort((a, b) => int(a.id) - int(b.id))
      .map((r) => ({ url: asset(folder, r.name), title: fixText(r.title)?.slice(0, 120) ?? null })).filter((c) => c.url);
    const reels = clipsFrom(videos.get(id), "videos"), voiceClips = clipsFrom(voices.get(id), "voices");
    const ageFrom = int(u.age_from), ageTo = int(u.age_to);
    const category = roleId === 5 ? "Pet" : profileCategory(u.membership_category, roleId);
    const data = {
      profileUrl: url,
      fullName: fixText(u.name) ?? "RafikiHub member",
      category,
      contactDetails: { country: fixText(u.country) ?? "Kenya", website: clean(u.website) && /^https?:\/\//i.test(clean(u.website)) ? clean(u.website) : null, phone: null, email: null, address: null },
      personalData: {
        dateOfBirth: dateOnly(u.date_of_birth),
        playingAge: ageFrom && ageTo && ageFrom <= ageTo ? { min: ageFrom, max: ageTo } : null,
        country: fixText(u.country) ?? "Kenya",
        height: height(u.first_height, u.second_height),
      },
      cities: [...new Set((cities.get(id) ?? []).map((c) => fixText(c.name)).filter(Boolean))],
      nationalities: [...new Set((nats.get(id) ?? []).map((c) => fixText(c.name)).filter(Boolean))],
      appearance: {
        appearance: option(u.appearance, lists.appearance), eyeColor: option(u.eye_color, lists.eyeColor), hairColor: option(u.hair_color, lists.hairColor),
        hairLength: option(u.hair_length, lists.hairLength), facialHair: option(u.facial_hair, lists.facialHair),
      },
      voiceAttributes: { voiceQuality: option(u.voice_quality, lists.voiceQuality), voiceCharacter: option(u.voice_character, lists.voiceCharacter) },
      voiceRange: { lowVoice: clean(u.low_note), mediumVoice: clean(u.medium_note), highVoice: clean(u.high_note) },
      furtherMeasurements: {
        bustChest: measurement(u.chest), waist: measurement(u.waist), hips: measurement(u.hips), insideLeg: measurement(u.inside_leg),
        insideArm: measurement(u.inside_arm), collar: measurement(u.collar), hat: measurement(u.hat),
        weightKg: (() => { const w = Number.parseFloat(clean(u.weight) ?? ""); return w > 0 && w < 300 ? w : null; })(),
        shoeSize: clean(u.shoe_size), dressSize: clean(u.dress_size),
      },
      appearanceTraits: (traits.get(id) ?? []).map((x) => ({ trait: option(x.name, lists.traits), location: fixText(x.location) ?? "" })).filter((x) => x.trait),
      bio: htmlToText(u.agent_bio),
      skills: skillNames(["other", "perfomance", "performance", "present", "sport", "vehicle", "music"]),
      languages: skillNames(["language"]),
      accents: skillNames(["dialect"]),
      credits: (credits.get(id) ?? [])
        .map((c) => ({ year: int(c.production_year), production: fixText(c.production_name), role: fixText(c.role) ?? (roleId === 4 ? "Crew" : "Cast"), type: creditType(c.production_type), ...(fixText(c.director) ? { director: fixText(c.director) } : {}) }))
        .filter((c) => c.year >= 1920 && c.year <= 2100 && c.production)
        .sort((a, b) => b.year - a.year),
      training: (training.get(id) ?? [])
        .map((x) => { const y = int(x.date_ended) ?? int(x.date_started); return { institution: fixText(x.institution_name), course: fixText(x.course_name), ...(y && y > 1900 ? { year: y } : {}) }; })
        .filter((x) => x.institution && x.course),
      media: {
        headshots: pics.map((p) => asset("images/gallery", p.name)).filter(Boolean),
        showreelUrl: reels[0]?.url ?? null,
        voiceoverReelUrl: voiceClips[0]?.url ?? null,
        documents: [],
        reels,
        voiceClips,
      },
      ...(roleId === 5 ? { pet: petDetails(u) } : {}),
      isEnhanced: false,
      representedByRafikiHub: false,
      createdAt: dateOnly(u.created_at) ?? new Date().toISOString().slice(0, 10),
    };
    profiles.push({
      profile_url: url,
      full_name: data.fullName,
      category,
      published: accountStatus(u.status) === "active" && yes(u.visible),
      data,
    });
  }
  const docs = t.get("files")?.length ?? 0;
  if (docs) report.notes.push(`${docs} uploaded documents (IDs, KRA PINs, certificates) were left out on purpose.`);

  /* castings */
  const cats = groupBy(t.get("talent_categories"), "talent_id");
  const countries = groupBy(t.get("talent_countries"), "talent_id");
  const today = new Date().toISOString().slice(0, 10);
  const auditions = (t.get("auditions") ?? []).flatMap((a) => {
    if (!keptIds.has(int(a.user_id))) { skip("castings whose owner account wasn't imported"); return []; }
    const closes = dateOnly(a.close_date) ?? dateOnly(a.created_at) ?? today;
    const filled = int(a.status) === 1;
    return [{
      legacy_id: int(a.id),
      ref: clean(a.random_id) ?? `RH${a.id}`,
      owner_legacy_id: int(a.user_id),
      title: fixText(a.title) ?? "Untitled casting",
      type: fixText(a.type) ?? "Other",
      gender: option(a.gender, ["Everybody", "Female", "Male"]) ?? "Everybody",
      categories: [...new Set((cats.get(a.id) ?? []).map((c) => clean(c.name)).filter((n) => n && !/^all categories$/i.test(n)).map((n) => profileCategory(n)))],
      countries: [...new Set((countries.get(a.id) ?? []).map((c) => fixText(c.name)).filter((n) => n && !/^all countries$/i.test(n)))],
      body: htmlToText(a.body) ?? "",
      closes_on: closes,
      filled,
      status: filled || closes < today ? "closed" : "published",
      published_at: timestamp(a.created_at),
      created_at: timestamp(a.created_at),
    }];
  });
  const auditionIds = new Set(auditions.map((a) => a.legacy_id));

  const seenApps = new Set();
  const applications = (t.get("auditions_applications") ?? []).flatMap((x) => {
    const key = `${int(x.audition_id)}:${int(x.user_id)}`;
    if (!auditionIds.has(int(x.audition_id)) || !keptIds.has(int(x.user_id))) { skip("applications for a casting or member that wasn't imported"); return []; }
    if (seenApps.has(key)) { skip("duplicate applications"); return []; }
    seenApps.add(key);
    return [{ audition_legacy_id: int(x.audition_id), applicant_legacy_id: int(x.user_id), status: "new", created_at: timestamp(x.created_at) }];
  });

  const seenAgents = new Set();
  const agentLinks = (t.get("agents") ?? []).flatMap((x) => {
    const key = `${int(x.agent_id)}:${int(x.user_id)}`;
    if (!keptIds.has(int(x.agent_id)) || !keptIds.has(int(x.user_id)) || seenAgents.has(key)) { skip("agent links to missing members, or repeated"); return []; }
    seenAgents.add(key);
    return [{ agent_legacy_id: int(x.agent_id), performer_legacy_id: int(x.user_id), status: /approved/i.test(x.status ?? "") ? "approved" : "pending", created_at: timestamp(x.created_at) }];
  });

  /* payments */
  const payments = [
    ...(t.get("billing") ?? []).map((b) => ({
      legacy_key: `billing:${b.id}`, account_legacy_id: int(b.userid), plan_id: null,
      amount_ksh: int(String(b.amount ?? "").replace(/[^\d.]/g, "")) ?? 0, phone: clean(b.phone), provider: "mpesa",
      reference: clean(b.transactionreference) ?? clean(b.transactionid), status: clean(b.transactionreference) ? "success" : "pending",
      paid_at: timestamp(b.paydate), created_at: timestamp(b.created_at),
    })),
    ...(t.get("payment_history") ?? []).map((p) => ({
      legacy_key: `history:${p.id}`, account_legacy_id: int(p.user_id), plan_id: null,
      amount_ksh: int(String(p.amount ?? "").replace(/[^\d.]/g, "")) ?? 0, phone: null, provider: "mpesa",
      reference: clean(p.token), status: /success/i.test(p.status ?? "") ? "success" : /reject/i.test(p.status ?? "") ? "rejected" : "cancelled",
      paid_at: timestamp(p.created_at), created_at: timestamp(p.created_at),
    })),
  ].filter((p) => { if (keptIds.has(p.account_legacy_id)) return true; skip("payments by members that weren't imported"); return false; });
  if ((t.get("payment_history") ?? []).length) report.notes.push("payment_history amounts were shown with a $ sign on the old site; they're imported as Ksh. Check a few.");

  /* inbox: Sio Bahati bookings and location requests */
  const bookingStatus = (s) => ({ closed: "done", scheduled: "confirmed" })[(clean(s) ?? "").toLowerCase()] ?? "new";
  const bookings = (t.get("services") ?? []).map((s) => ({
    legacy_id: int(s.id), service: fixText(s.service) ?? "Service",
    full_name: [fixText(s.firstname), fixText(s.lastname)].filter(Boolean).join(" ") || "Unknown",
    email: clean(s.email) ?? "", phone: clean(s.phone) ?? "", preferred_date: clean(s.sdate)?.replace("T", " ") ?? null,
    notes: null, status: bookingStatus(s.status), created_at: timestamp(s.created_at),
  }));
  const locServices = groupBy(t.get("location_services"), "location_id");
  const locationRequests = (t.get("locations") ?? []).map((l) => ({
    legacy_id: int(l.id), organization: fixText(l.organization) ?? "Unknown", email: clean(l.email) ?? "", country: fixText(l.country),
    phone: clean(l.phone), nature: fixText(l.nature) ?? "Not given", crew: clean(l.crew),
    from_date: clean(l.from_date)?.replace("T", " ") ?? null, to_date: clean(l.to_date)?.replace("T", " ") ?? null,
    location_type: fixText(l.location_info) ?? "Not given",
    services: (locServices.get(l.id) ?? []).map((x) => fixText(x.service)).filter(Boolean).join(", ") || null,
    details: htmlToText(l.more_information), status: /closed/i.test(l.status ?? "") ? "done" : "new", created_at: timestamp(l.created_at),
  }));

  /* blog posts → content_items (kind "articles"), same shape as Article in lib/data.ts */
  const genre = (c) => ({ talent: "Member story", training: "Advice", review: "Review" })[(clean(c) ?? "").toLowerCase()] ?? "Article";
  const articles = (t.get("blog") ?? []).flatMap((b) => {
    const slug = clean(b.slug)?.toLowerCase() || slugify(fixText(b.title));
    if (!slug) { skip("blog posts without a slug or title"); return []; }
    const content = htmlToBlocks(b.body);
    const text = content.map((c) => c.text).join(" ");
    return [{
      slug,
      published: /^published$/i.test(clean(b.status) ?? ""),
      data: {
        url: slug, title: fixText(b.title) ?? slug, genre: genre(b.category),
        excerpt: text.length > 180 ? `${text.slice(0, 177).replace(/\s+\S*$/, "")}…` : text,
        publishedAt: dateOnly(b.created_at) ?? today, ...(dateOnly(b.updated_at) ? { updatedAt: dateOnly(b.updated_at) } : {}),
        author: fixText(b.writter) ?? "RafikiHub",
        image: clean(b.image) ? `${base}/assets/images/blog/${encodeURIComponent(clean(b.image))}.png` : null,
        content: content.length ? content : [{ text: "" }],
      },
    }];
  });

  for (const [table, why] of [["classes", "videos (RafikiHub Online is curated from YouTube in the admin)"], ["testimonials", "testimonials (curated in the admin)"], ["partners", "partners (curated in the admin)"], ["faqs", "FAQs (curated in the admin)"]]) {
    const n = t.get(table)?.length ?? 0;
    if (n) report.notes.push(`${n} old ${why} were not imported.`);
  }

  return { accounts, profiles, auditions, applications, agentLinks, payments, bookings, locationRequests, articles, report };
}
