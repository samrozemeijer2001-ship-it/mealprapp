const $ = s => document.querySelector(s), pad = n => String(n).padStart(2, '0'), esc = s => String(s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
const dk = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const NM = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
const D = [
    { ic: '🏉', tr: 'Lichte rugby + kracht', k: 3020, p: 215, sn: ['4 rijstwafels + 30 g pindakaas + fruit', { wafels: 4, pnb: 30, fruit: 1 }, 370, 10], lr: 130, pre: '2 wafels + honing + banaan' },
    { ic: '🏉', tr: 'Zware rugby', k: 3230, p: 215, sn: ['6 rijstwafels + 30 g pindakaas + fruit', { wafels: 6, pnb: 30, fruit: 1 }, 430, 12], lr: 150, ln: ' · 2-3 u voor training', pre: '2 wafels + honing + banaan (45-60 min voor training)' },
    { ic: '🏋️', tr: 'Krachttraining na werk', k: 2820, p: 210, sn: ['4 wafels + honing/jam + banaan (voor training)', { wafels: 4, honing: 1, banaan: 1 }, 260, 4], lr: 130, ln: ' · op kantoor', post: 'Shake direct na training', pt: '17:30' },
    { ic: '🏉', tr: 'Rugby', k: 3020, p: 215, sn: ['4 rijstwafels + 30 g pindakaas + fruit', { wafels: 4, pnb: 30, fruit: 1 }, 370, 10], lr: 130, ln: ' · 2-3 u voor training', pre: '2 wafels + honing + banaan' },
    { ic: '😴', tr: 'Rust · dag voor wedstrijd', k: 2740, p: 215, sn: ['4 rijstwafels + 30 g pindakaas + fruit', { wafels: 4, pnb: 30, fruit: 1 }, 370, 10], lr: 100, dr: 130, dn: ' · weinig vet en vezels (geen bonen/kool)', late: 1 },
    { ic: '🏆', tr: 'Wedstrijd', k: 3230, p: 215, sn: ['6 rijstwafels + honing, geen pindakaas', { wafels: 6, honing: 1 }, 240, 5], lr: 150, ln: ' · weinig vet, 3-4 u voor wedstrijd', pre: 'Banaan + 2 wafels (1 u voor wedstrijd)', post: 'Shake + banaan direct erna', bn: 1 },
    { ic: '😴', tr: 'Rust + mealprep', k: 2740, p: 215, sn: ['4 rijstwafels + 30 g pindakaas + fruit', { wafels: 4, pnb: 30, fruit: 1 }, 370, 10], lr: 100, dr: 130, late: 1 }];
function meals(i) {
    const d = D[i], L = [], a = (t, n, x, q, k, p) => L.push({ id: n, t, n, x, q, k, p }), g = (r, note) => [`Eiwitportie + ${r} g rijst/pasta/aardappel + 200 g groente${note || ''}`, { kip: 250, rijst: r, groente: 200 }, 275 + r * 3.6 + 150, 62 + r * .07];
    a('07:30', 'Ontbijt', '250 g kwark + 90 g muesli', { kwark: 250, muesli: 90 }, 480, 35);
    a('11:00', 'Kantoor snack', ...d.sn);
    a(d.lt || '13:00', 'Warme lunch', ...g(d.lr, d.ln));
    if (d.pre) a('16:30', 'Voor training', d.pre, { wafels: 2, honing: 1, banaan: 1 }, 210, 3);
    if (d.post || i != 4 && i != 6) a(d.pt || '19:00', 'Na training', d.post || 'Shake (30 g whey)', d.bn ? { whey: 30, banaan: 1 } : { whey: 30 }, d.bn ? 220 : 120, d.bn ? 25 : 24);
    a('19:30', 'Avondeten', ...g(d.dr || (i == 1 || i == 5 ? 150 : 130), d.dn));
    if (d.late) a('21:30', 'Late kwark', '250 g kwark', { kwark: 250 }, 150, 25);
    L.sort((x, y) => x.t < y.t ? -1 : 1);
    for (const f of ['k', 'p']) { const s = L.reduce((a, m) => a + m[f], 0), r = d[f] / s; L.forEach(m => m[f] = Math.round(m[f] * r / (f == 'k' ? 10 : 1)) * (f == 'k' ? 10 : 1)); const df = d[f] - L.reduce((a, m) => a + m[f], 0); L[L.length - 1][f] += df }
    return L
}
const ML = D.map((_, i) => meals(i));
let S = {}; try { S = JSON.parse(localStorage.getItem('vd') || '{}') } catch (e) { }
S.days ??= {}; S.w ??= []; S.shop ??= { c: {}, rm: {}, x: [] }; S.tk ??= {}; S.stock ??= { kip: 10, rijst: 2, whey: 20, creatine: 40 }; S.menu ??= { p: { kip: 1, gehakt: 1, zalm: 1 }, c: { rijst: 1, pasta: 1 }, x: [] };
const save = () => { try { localStorage.setItem('vd', JSON.stringify(S)) } catch (e) { } };
const wk = () => { const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return dk(d) };
if (S.wk != wk()) { S.wk = wk(); S.shop.c = {}; S.tk = {}; save() }
const now = new Date(), TI = (now.getDay() + 6) % 7; let sel = TI, tab = 0;
const day = k => S.days[k] ??= { m: {}, w: 0, c: 0 };
const vib = () => navigator.vibrate && navigator.vibrate(15);
function toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('on'), 1800) }
const done = (st) => st == 'done' || st == 'sub';
function ring(p, c, v, l) { const r = 38, C = 2 * Math.PI * r, st = PR[l] ?? C; PR[l] = C * (1 - Math.min(p, 1)); return `<div class="ring ${p >= 1 ? 'full' : ''}"><svg viewBox="0 0 92 92"><circle class="bg" cx="46" cy="46" r="${r}"/><circle class="fg" cx="46" cy="46" r="${r}" stroke="${c}" stroke-dasharray="${C}" stroke-dashoffset="${st}" data-o="${C * (1 - Math.min(p, 1))}"/></svg><b>${v}</b><small>${l}</small></div>` }
function today() {
    const K = dk(now), ds = day(K), L = ML[TI], d = D[TI]; let k = 0, p = 0, n = 0; L.forEach(m => { if (done((ds.m[m.id] || {}).st)) { k += m.k; p += m.p; n++ } });
    const pend = L.filter(m => !ds.m[m.id]), hm = pad(now.getHours()) + ':' + pad(now.getMinutes()), nx = pend.find(m => m.t >= hm) || pend[0];
    const lw = S.w[S.w.length - 1], pw = S.w[S.w.length - 2];
    return `<h1>${NM[TI]}</h1><div class="sub">${d.ic} ${d.tr}</div>
<div class="rings">${ring(k / d.k, 'var(--o)', k, 'kcal / ' + d.k)}${ring(p / d.p, 'var(--k)', p, 'eiwit / ' + d.p + ' g')}${ring(n / L.length, 'var(--g)', Math.round(n / L.length * 100) + '%', 'dag voltooid')}</div>
<div class="left">Nog nodig: <b>${Math.max(d.k - k, 0)} kcal</b> · <b>${Math.max(d.p - p, 0)} g eiwit</b></div>
${nx ? `<div class="next"><div class="i"><small>${nx.t < hm ? 'NU / ACHTERSTAND' : 'VOLGENDE · ' + nx.t}</small><p><b>${nx.n}</b> — ${esc(nx.x)}</p></div><button class="btn" onclick="setM('${nx.id}','done')">Gegeten</button></div>` : '<div class="next" style="background:var(--g);box-shadow:0 6px 0 #17a06c"><div class="i"><small>KLAAR</small><p>Alle eetmomenten afgehandeld 💪</p></div></div>'}
<h2>Tijdlijn</h2><div class="tl">${L.map(m => { const s = ds.m[m.id] || {}, st = s.st || ''; return `<div class="m ${st} ${LAST == m.id ? 'pp' : ''}"><div class="t">${m.t}</div><div class="c"><div class="b" onclick="sheet('${m.id}')"><b>${m.n}</b><p>${st == 'sub' ? '🔄 ' + esc(s.sub) + `<br><em style="text-decoration:line-through">${esc(m.x)}</em>` : esc(s.pk ? m.x.replace('Eiwitportie', s.pk) : m.x)}</p><em>${m.k} kcal · ${m.p} g eiwit${st == 'skip' ? ' · overgeslagen' : ''}</em></div><button class="ck" onclick="tgl('${m.id}')">${st == 'skip' ? '✕' : st ? '✓' : ''}</button></div></div>` }).join('')}</div>
<h2>Water</h2><div class="card"><div class="row sp"><span class="big">💧 ${(ds.w / 1000).toFixed(2).replace(/\.?0+$/, '')} / 4 L</span><button class="btn g s" onclick="wat(-250)">−</button></div><div class="bar"><i style="width:${Math.min(ds.w / 40, 100)}%"></i></div><div class="row"><button class="btn" style="flex:1" onclick="wat(250)">+250 ml</button><button class="btn" style="flex:1" onclick="wat(500)">+500 ml</button></div></div>
<h2>Creatine</h2><div class="it ${ds.c ? 'd' : ''} ${LAST == 'cre' ? 'pp' : ''}" onclick="cre()"><button class="ck">${ds.c ? '✓' : ''}</button><span class="n">5 gram creatine genomen</span></div>
<h2>Gewicht</h2><div class="card">${lw ? `<div class="big">${lw.kg.toFixed(1)} kg</div><div class="sub">${pw ? `Vorige (${pw.d.slice(5)}): ${pw.kg.toFixed(1)} kg · verschil <b style="color:${lw.kg <= pw.kg ? 'var(--g)' : 'var(--o)'}">${(lw.kg - pw.kg > 0 ? '+' : '') + (lw.kg - pw.kg).toFixed(1)} kg</b>` : 'Eerste meting'}</div>` : '<div class="sub">Nog geen metingen</div>'}<div class="row" style="margin-top:10px"><input type="number" step="0.1" id="wi" placeholder="Gewicht in kg"><button class="btn" onclick="addW()">Opslaan</button></div>${S.w.slice(-5, -1).reverse().map(x => `<div class="sub row sp"><span>${x.d}</span><span>${x.kg.toFixed(1)} kg</span></div>`).join('')}</div>`
}
function tgl(id) { const ds = day(dk(now)), s = ds.m[id]; LAST = id; if (s) delete ds.m[id]; else ds.m[id] = { st: 'done' }; save(); render(); vib(); if (!s) win(ML[TI].find(x => x.id == id)) }
function setM(id, st, sub, pk) { day(dk(now)).m[id] = st == 'reset' ? undefined : { st, sub, pk }; if (st == 'reset') delete day(dk(now)).m[id]; LAST = id; save(); closeS(); render(); vib(); if (st == 'done' || st == 'sub') win(ML[TI].find(x => x.id == id)); else if (st == 'skip') toast('Geen stress, focus op de volgende! 👊') }
function sheet(id) { const m = ML[TI].find(x => x.id == id); const e = document.createElement('div'); e.className = 'sh'; e.onclick = ev => { if (ev.target == e) closeS() }; e.innerHTML = `<div><h1 style="font-size:20px">${m.n} · ${m.t}</h1><div class="sub">${esc(m.x)}</div>${m.q.kip ? `<div class="sub" style="margin-top:14px">Kies je eiwitbron:</div><div class="chips" style="margin-top:6px">${popts().map((o, i) => `<button class="chip" onclick="pick('${id}',${i})">${esc(o.n)}<small>${esc(plab(o))}</small></button>`).join('') || '<div class="sub">Kies eerst opties bij Prep</div>'}</div>` : ''}<button class="btn" onclick="setM('${id}','done')">✅ Gegeten</button><button class="btn g" onclick="setM('${id}','skip')">❌ Overgeslagen</button><div style="margin-top:12px" class="sub">🔄 Vervangen door:</div><input type="text" id="si" placeholder="bijv. 250 g zalm + aardappelen" style="margin-top:6px"><button class="btn g" onclick="subM('${id}')">🔄 Opslaan als vervanging</button><button class="btn g" onclick="setM('${id}','reset')">↩︎ Terugzetten</button></div>`; document.body.appendChild(e) }
const closeS = () => document.querySelectorAll('.sh').forEach(e => e.remove());
function subM(id) { const v = $('#si').value.trim(); if (v) setM(id, 'sub', v) }
function wat(n) { const d = day(dk(now)), o = d.w, B = ['#35c4ff', '#fff', '#2ee59d']; d.w = Math.max(0, d.w + n); save(); render(); vib(); if (n > 0) { if (o < 4000 && d.w >= 4000) big('Waterdoel gehaald! 💧', '4 liter binnen, topper!', B); else { burst(10, T.x, T.y, B); float('+' + n + ' ml 💧'); toast(rnd(WM)) } } }
function cre() { const d = day(dk(now)); d.c = d.c ? 0 : 1; if (d.c && S.stock.creatine > 0) S.stock.creatine--; LAST = 'cre'; save(); render(); vib(); if (d.c) { burst(14); toast('Creatine binnen ✨ Sterker elke dag!') } }
function addW() { const v = parseFloat($('#wi').value); if (!(v > 0)) return; S.w.push({ d: dk(now), kg: v }); save(); render(); burst(14); toast('Gewicht opgeslagen, blijf consistent! 📈') }
function week() {
    const L = ML[sel], d = D[sel], t = L.reduce((a, m) => [a[0] + m.k, a[1] + m.p], [0, 0]), ds = new Date(now);
    return `<h1>Week</h1><div class="days">${D.map((x, i) => { const dt = new Date(now); dt.setDate(now.getDate() - TI + i); return `<button class="dc ${i == sel ? 'on' : ''} ${i == TI ? 'now' : ''}" onclick="sel=${i};FRESH=1;render()"><small>${NM[i].slice(0, 2).toUpperCase()} ${dt.getDate()}</small><b>${x.ic}</b><small>${x.k} kcal</small></button>` }).join('')}</div>
<h1 style="font-size:22px;margin-top:10px">${NM[sel]}</h1><div class="sub">${d.ic} ${d.tr}</div><div class="left" style="margin:12px 0 18px"><b>${t[0]} kcal</b> · <b>${t[1]} g eiwit</b></div><div class="tl">${L.map(m => `<div class="m"><div class="t">${m.t}</div><div class="c"><div class="b"><b>${m.n}</b><p>${esc(m.x)}</p><em>${m.k} kcal · ${m.p} g eiwit</em></div></div></div>`).join('')}</div>`
}
function need() { const q = {}; ML.flat().forEach(m => { for (const k in m.q) q[k] = (q[k] || 0) + m.q[k] }); return q }
const kg = g => (g / 1000).toFixed(g % 1000 ? 2 : 0).replace(/(\.\d)0$/, '$1') + ' kg';
function items() {
    const q = need(), po = popts(), co = CO.filter(c => S.menu.c[c[0]]), np = q.kip / 250, r10 = x => Math.round(x / 10) * 10;
    const totaalEiwitBron = 1500;
    const E = po.map((o, i) => {
        const gram = Math.round((totaalEiwitBron / po.length) / 50) * 50;
        return ['p_' + o.id, o.n, kg(gram) + ' nodig'];
    });
    E.push(['kwark', 'Kwark', kg(q.kwark)], ['whey', 'Whey', q.whey / 30 + ' shakes · ' + q.whey + ' g']);
    return [['Eiwitten', E], ['Koolhydraten', [...co.map(c => ['c_' + c[0], c[1], kg(r10(q.rijst / co.length * c[2])) + (c[2] == 1 ? ' (droog)' : '')]), ['wafels', 'Rijstwafels', q.wafels + ' stuks'], ['muesli', 'Muesli', q.muesli + ' g'], ['honing', 'Honing / jam', q.honing + '× gebruikt']]], ['Fruit', [['banaan', 'Bananen', q.banaan + ' stuks'], ['fruit', 'Ander fruit', q.fruit + ' stuks']]], ['Groente', [['groente', 'Groente warme maaltijden', kg(q.groente)]]], ['Overig', [['pnb', 'Pindakaas', q.pnb + ' g'], ['creatine', 'Creatine', '35 g (7 × 5 g)']]]]
}
const PO = [['kip', 'Kip', 150], ['gehakt', 'Mager gehakt', 150], ['kalkoen', 'Kalkoen', 150], ['zalm', 'Zalm', 150], ['vis', 'Witte vis', 150], ['ei', 'Eieren', 3, 'st']], CO = [['rijst', 'Rijst', 1], ['pasta', 'Pasta', 1], ['aardappel', 'Aardappelen', 4.5]];
const allP = () => [...PO.map(([id, n, g, u]) => ({ id, n, g, u })), ...S.menu.x.map((o, i) => ({ id: 'x' + i, n: o.n, g: o.g, u: 'g' }))], popts = () => allP().filter(o => S.menu.p[o.id]), plab = o => o.u == 'st' ? o.g + ' ' + o.n.toLowerCase() : o.g + ' g ' + o.n.toLowerCase();
function mp(id) { S.menu.p[id] = !S.menu.p[id]; save(); render(); vib() }
function mc(id) { S.menu.c[id] = !S.menu.c[id]; save(); render(); vib() }
function addO() { const n = $('#mn').value.trim(), g = +$('#mg').value || 250; if (!n) return; S.menu.x.push({ n, g }); S.menu.p['x' + (S.menu.x.length - 1)] = 1; save(); render(); toast(n + ' toegevoegd') }
function pick(id, i) { const o = popts()[i]; setM(id, 'done', undefined, plab(o)) }
const TK = ['Kip bakken voor meerdere dagen', 'Rijst koken', 'Bakjes vullen', 'Groente voorbereiden', 'Rijstwafels klaarzetten', 'Whey shaker klaarzetten', 'Sporttas controleren', 'Waterflessen vullen'];
const ST = [['kip', 'Kip', 'porties', 1, 4, 'p_kip'], ['rijst', 'Rijst', 'kg', .5, .5, 'c_rijst'], ['whey', 'Whey', 'shakes', 1, 5, 'whey'], ['creatine', 'Creatine', 'dagen', 5, 7, 'creatine']];
function prep() {
    const S1 = S.shop, all = items().map(([c, l]) => [c, l.filter(i => !S1.rm[i[0]])]); all.push(['Zelf toegevoegd', S1.x.map((n, i) => ['x' + i, n, ''])]);
    const flat = all.flatMap(a => a[1]), got = flat.filter(i => S1.c[i[0]]).length, tk = TK.filter((_, i) => S.tk[i]).length;
    const np = need().kip / 250, pc = popts().length, menu = `<h2>Menu deze week</h2><div class="sub" style="margin-bottom:10px">Vink aan wat je wilt eten: <b>of dit, of dat</b>. Je gekozen eiwitbronnen verdelen automatisch de benodigde 1500 gram eiwitbron over de week.</div><div class="chips">${allP().map(o => `<button class="chip ${S.menu.p[o.id] ? 'on' : ''}" onclick="mp('${o.id}')">${esc(o.n)}</button>`).join('')}</div><div class="sub" style="margin-bottom:6px">Koolhydraten</div><div class="chips">${CO.map(c => `<button class="chip c ${S.menu.c[c[0]] ? 'on' : ''}" onclick="mc('${c[0]}')">${c[1]}</button>`).join('')}</div><div class="row"><input type="text" id="mn" placeholder="Eigen optie, bijv. tofu"><input type="number" id="mg" placeholder="g" style="width:90px"><button class="btn" onclick="addO()">+</button></div><div class="left" style="margin-top:12px">${pc ? `✅ ${np} porties × ~55 g = <b>~${np * 55} g eiwit</b> uit je warme maaltijden. Boodschappenlijst dekt je dagdoel.` : '⚠️ Kies minstens 1 eiwitbron, anders mis je je eiwitten.'}</div>`;
    const kd = ML.map((L, i) => NM[i].slice(0, 2) + ' ' + L.reduce((a, m) => a + (m.q.kip || 0), 0)).join(' · ');
    return `<h1>Prep</h1><div class="sub">Zondag: week voorbereiden</div>${menu}<h2>Boodschappen</h2><div class="card"><div class="row sp"><b>${got} / ${flat.length} producten gehaald</b></div><div class="bar"><i style="width:${flat.length ? got / flat.length * 100 : 0}%;background:var(--g)"></i></div></div>
${all.filter(a => a[1].length).map(([c, l]) => `<h2 style="margin-top:18px">${c}</h2>${l.map(([id, n, s]) => `<div class="it ${S1.c[id] ? 'd' : ''} ${LAST == id ? 'pp' : ''}"><button class="ck" onclick="shp('${id}')">${S1.c[id] ? '✓' : ''}</button><span class="n" onclick="shp('${id}')">${esc(n)}<small>${esc(s)}</small></span><button class="x" onclick="rmI('${id}')">×</button></div>`).join('')}`).join('')}
<div class="row" style="margin-top:12px"><input type="text" id="ni" placeholder="Product toevoegen"><button class="btn" onclick="addI()">+</button></div>
<h2>Mealprep checklist · ${tk}/${TK.length}</h2>${TK.map((t, i) => `<div class="it ${S.tk[i] ? 'd' : ''} ${LAST == 't' + i ? 'pp' : ''}" onclick="tk(${i})"><button class="ck">${S.tk[i] ? '✓' : ''}</button><span class="n">${t}</span></div>`).join('')}
<h2>Voorraad</h2>${ST.map(([id, n, u, st, lo, sid]) => { const v = S.stock[id], lw = v <= lo, onl = (sid[1] != '_' || (sid[0] == 'p' ? S.menu.p : S.menu.c)[sid.slice(2)]) && !S1.rm[sid] && !S1.c[sid]; return `<div class="card" style="margin-bottom:8px"><div class="row sp"><div><b>${n}</b><div class="big">${v} <span class="sub">${u}</span></div></div><div class="row"><button class="btn g" onclick="stk('${id}',-${st})">−</button><button class="btn g" onclick="stk('${id}',${st})">+</button></div></div>${lw ? (onl ? '<div class="low">✓ Staat op je boodschappenlijst</div>' : `<div class="low" onclick="toList('${id}')" style="text-decoration:underline">Bijna op → toevoegen aan boodschappenlijst</div>`) : ''}</div>` }).join('')}`
}
function shopAll() { const S1 = S.shop, f = [...items().flatMap(a => a[1]), ...S1.x.map((n, i) => ['x' + i])].filter(i => !S1.rm[i[0]]); return [f.filter(i => S1.c[i[0]]).length, f.length] }
function shp(id) { S.shop.c[id] = !S.shop.c[id]; LAST = id; save(); render(); vib(); if (S.shop.c[id]) { const [g, t] = shopAll(); if (g == t) big('Boodschappen klaar! 🛒', 'Alles in huis, je bent er klaar voor!'); else { burst(10); toast(rnd(SM) + ' ' + g + '/' + t) } } }
function tk(i) { S.tk[i] = !S.tk[i]; LAST = 't' + i; save(); render(); vib(); if (S.tk[i]) { if (TK.every((_, j) => S.tk[j])) big('Mealprep klaar! 🥳', 'Je week is voorbereid, daar gaan we!'); else { burst(10); toast(rnd(TM)) } } }
function rmI(id) { if (id[0] == 'x') S.shop.x.splice(+id.slice(1), 1); else S.shop.rm[id] = 1; save(); render() }
function addI() { const v = $('#ni').value.trim(); if (v) { S.shop.x.push(v); save(); render() } }
function stk(id, n) { S.stock[id] = Math.max(0, +(S.stock[id] + n).toFixed(1)); save(); render() }
function toList(id) { const s = ST.find(x => x[0] == id)[5]; delete S.shop.rm[s]; S.shop.c[s] = false; if (s[1] == '_') (s[0] == 'p' ? S.menu.p : S.menu.c)[s.slice(2)] = 1; save(); render(); toast('Toegevoegd aan lijst') }
const IC = ['<path d="M12 2c1 4 6 6 6 12a6 6 0 01-12 0c0-2.500 1-4 2-5 0 2 1 3 2 3 0-4-1-7 2-10z"/>', '<path d="M7 2h2v2h6V2h2v2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2zM5 9v11h14V9z"/>', '<path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM1 2h3l.4 2H21l-2.600 9H7.200l.4 2H19v2H6L3.300 4H1z"/>'];
function render() {
    const y = scrollY; $('#p0').innerHTML = today(); $('#p1').innerHTML = week(); $('#p2').innerHTML = prep();
    const fr = FRESH; FRESH = 0; document.querySelectorAll('.pg').forEach((e, i) => { e.classList.toggle('on', i == tab); e.classList.toggle('fresh', !!fr && i == tab) }); document.querySelectorAll('.fresh .m,.fresh .it,.fresh .card,.fresh .chip,.fresh .dc').forEach((e, i) => e.style.setProperty('--i', Math.min(i, 14)));
    $('.tabs').innerHTML = ['Vandaag', 'Week', 'Prep'].map((n, i) => `<button class="${i == tab ? 'on' : ''}" onclick="go(${i})"><svg viewBox="0 0 24 24">${IC[i]}</svg>${n}</button>`).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.fg').forEach(c => c.style.strokeDashoffset = c.dataset.o))); countUp(); LAST = null; scrollTo(0, y)
}
function go(i) { tab = i; FRESH = 1; render(); scrollTo(0, 0) }
let LAST = null, FRESH = 1, T = { x: innerWidth / 2, y: innerHeight / 2 }; const PR = {}, PV = {};
addEventListener('pointerdown', e => { T = { x: e.clientX, y: e.clientY } });
const RM = matchMedia('(prefers-reduced-motion:reduce)').matches, COL = ['#ffd23f', '#ff7a1a', '#ff4f9a', '#2ee59d', '#35c4ff'], rnd = a => a[Math.floor(Math.random() * a.length)];
const MG = ['Lekker bezig! 💪', 'Brandstof binnen! ⚡', 'Sterk gedaan! 🔥', 'Zo word je een machine! 🏉', 'Yes, weer een! ✅'], WM = ['Blijf drinken! 💧', 'Top, hydratatie on point! 🌊', 'Splash! Lekker bezig 💦'], SM = ['In de mand! 🛒', 'Weer een! 🙌', 'Goed bezig! ✅'], TM = ['Prep-held! 🔪', 'Weer een klaar! ✅', 'Doorpakken! 🔥'];
function burst(n = 16, x = T.x, y = T.y, cols = COL) { if (RM) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'), a = Math.random() * 6.28, d = 60 + Math.random() * 130; p.className = 'cf'; p.style.cssText = `left:${x}px;top:${y}px;background:${cols[i % cols.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 70}px;--r:${Math.random() * 720 - 360}deg`; document.body.appendChild(p); setTimeout(() => p.remove(), 1100) } }
function float(t) { const e = document.createElement('div'); e.className = 'fl'; e.textContent = t; e.style.left = T.x + 'px'; e.style.top = T.y + 'px'; document.body.appendChild(e); setTimeout(() => e.remove(), 1100) }
function big(t, s, cols) { burst(40, innerWidth * .3, innerHeight * .35, cols); burst(40, innerWidth * .7, innerHeight * .35, cols); navigator.vibrate && navigator.vibrate([30, 40, 30]); const e = document.createElement('div'); e.className = 'bg2'; e.innerHTML = `<div><b>${t}</b><span>${s}</span></div>`; e.onclick = () => e.remove(); document.body.appendChild(e); setTimeout(() => e.remove(), 2800) }
function win(m) { burst(18); float('+' + m.k + ' kcal'); toast(rnd(MG)); const ds = day(dk(now)); if (ML[TI].every(x => done((ds.m[x.id] || {}).st))) setTimeout(() => big('Dag voltooid! 🏆', 'Alles gegeten, sterke dag!'), 500) }
function countUp() { document.querySelectorAll('.ring b').forEach(b => { const k = b.parentNode.querySelector('small').textContent, to = parseInt(b.textContent), suf = b.textContent.replace(/\d+/, ''), from = PV[k] ?? 0; PV[k] = to; if (RM || from == to) return; const t0 = performance.now(); (function f(t) { const p = Math.min((t - t0) / 700, 1); b.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f) })(t0) }) }
render();
