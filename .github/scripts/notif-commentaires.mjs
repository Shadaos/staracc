// Envoie une notification pour chaque nouveau commentaire sur une quotidienne :
// - aux joueurs qui ont déjà commenté cette quotidienne (option « thread », activée par défaut) ;
// - aux joueurs qui veulent tous les commentaires (option « all »).
// Jamais à l'auteur. Plusieurs commentaires sont regroupés en une seule notification par joueur.
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const SITE = 'https://pronos-starac.github.io/Star-Academy/';
const DEF = { prime: true, thread: true, all: false };
if (!process.env.FIREBASE_SERVICE_ACCOUNT) { console.error('Secret FIREBASE_SERVICE_ACCOUNT manquant.'); process.exit(1); }
initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
const db = getFirestore();
const stRef = db.doc('season/notifs');

const st = await stRef.get();
const last = st.exists && st.data().lastCommentAt;
if (!last) {                       // première fois : on part de maintenant, sans rattrapage
  await stRef.set({ lastCommentAt: Timestamp.now() }, { merge: true });
  console.log('Initialisé, rien à envoyer.'); process.exit(0);
}
const fresh = await db.collection('comments').where('at', '>', last).orderBy('at').get();
if (fresh.empty) { console.log('Aucun nouveau commentaire.'); process.exit(0); }
console.log(`${fresh.size} nouveau(x) commentaire(s).`);

const [allComments, prefsSnap, tokSnap, players] = await Promise.all([
  db.collection('comments').get(), db.collection('notifprefs').get(), db.collection('pushTokens').get(), db.collection('players').get()]);
const prefs = {}; prefsSnap.forEach(d => prefs[d.id] = { ...DEF, ...d.data() });
const pref = uid => prefs[uid] || DEF;
const names = {}; players.forEach(d => names[d.id] = (d.data().name || 'Quelqu’un'));
const tokens = {}; tokSnap.forEach(d => { const u = d.data().uid; (tokens[u] = tokens[u] || []).push(d.id); });
const lastAtOf = {};                // premier commentaire de chaque joueur par quotidienne
allComments.forEach(d => { const c = d.data(); const k = c.recap + '|' + c.uid, t = c.at ? c.at.toMillis() : 0;
  if (!(k in lastAtOf) || t < lastAtOf[k]) lastAtOf[k] = t; });

// À qui envoyer quoi : { uid: [{recap, author, text}] }
const out = {};
let maxAt = last;
fresh.forEach(d => {
  const c = d.data(); if (!c.at) return;
  if (c.at.toMillis() > maxAt.toMillis()) maxAt = c.at;
  for (const uid of Object.keys(tokens)) {
    if (uid === c.uid) continue;
    const p = pref(uid);
    const inThread = (c.recap + '|' + uid) in lastAtOf && lastAtOf[c.recap + '|' + uid] < c.at.toMillis();
    if (p.all || (p.thread && inThread)) (out[uid] = out[uid] || []).push({ recap: c.recap, author: names[c.uid] || 'Quelqu’un', text: c.text });
  }
});

const day = id => { const [y, m, d] = id.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }); };
let ok = 0, ko = 0; const dead = [];
for (const [uid, list] of Object.entries(out)) {
  const recaps = [...new Set(list.map(x => x.recap))];
  const one = list.length === 1 ? list[0] : null;
  const title = one ? `💬 ${one.author} sur la quotidienne du ${day(one.recap)}` : `💬 ${list.length} nouveaux commentaires`;
  const body = one ? one.text.slice(0, 140) : (recaps.length === 1 ? `Sur la quotidienne du ${day(recaps[0])}` : `Sur ${recaps.length} quotidiennes`);
  const link = SITE + '?rc=' + recaps[recaps.length - 1];
  const res = await getMessaging().sendEachForMulticast({
    tokens: tokens[uid], notification: { title, body },
    data: { title, body, link, tag: 'cm-' + recaps[recaps.length - 1] },
    webpush: { fcmOptions: { link }, notification: { icon: SITE + 'icons/icon-192.png' } }
  });
  res.responses.forEach((r, j) => { if (r.success) ok++; else { ko++; const code = r.error && r.error.code;
    if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token' || code === 'messaging/invalid-argument') dead.push(tokens[uid][j]); } });
}
for (const t of dead) await db.collection('pushTokens').doc(t).delete();
await stRef.set({ lastCommentAt: maxAt }, { merge: true });
console.log(`Destinataires : ${Object.keys(out).length} · envoyées : ${ok} · échecs : ${ko} · jetons périmés : ${dead.length}`);
