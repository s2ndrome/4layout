'use strict';

/* ───────── 유틸 ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const uid = () => Math.random().toString(36).slice(2, 9);
const clone = o => JSON.parse(JSON.stringify(o));

function getPath(o, p) { return p.split('.').reduce((a, k) => (a == null ? a : a[k]), o); }
function setPath(o, p, v) {
  const ks = p.split('.'); const last = ks.pop();
  const t = ks.reduce((a, k) => a[k], o); t[last] = v;
}

const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#c7c7cc"/><circle cx="50" cy="39" r="17" fill="#fff"/><path d="M15 94c3-20 18-30 35-30s32 10 35 30z" fill="#fff"/></svg>');
const avatarOf = src => src || DEFAULT_AVATAR;

/* ───────── 아이콘 ───────── */
const HEART = 'M12 21s-9-5.6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.4-9 12-9 12z';
function svg(inner, size = 24, extra = '') { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${extra}>${inner}</svg>`; }
const stroke = (d, w = 2) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const I = {
  heart: (on, s = 24) => on ? svg(`<path d="${HEART}" fill="#ff3040"/>`, s) : svg(stroke(HEART), s),
  comment: (s = 24) => svg(stroke('M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'), s),
  share: (s = 24) => svg(stroke('M22 3 9.218 10.083M11.698 20.334 22 3.001H2l7.218 7.083z'), s),
  repost: (s = 24) => svg(stroke('M19 7H8.5A4.5 4.5 0 0 0 4 11.5v.5M16 4l3 3-3 3M5 17h10.5a4.5 4.5 0 0 0 4.5-4.5V12M8 20l-3-3 3-3'), s),
  bookmark: (on, s = 24) => svg(`<path d="M20 21 12 13.44 4 21V3h16z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`, s),
  more: (s = 24) => svg('<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>', s),
  close: (s = 24) => svg(stroke('M5 5l14 14M19 5 5 19', 2.2), s),
  plusBox: (s = 24) => svg(stroke('M6.5 2.5h11a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4v-11a4 4 0 0 1 4-4zM12 7.5v9M7.5 12h9'), s),
  menu: (s = 24) => svg(stroke('M3 5h18M3 12h18M3 19h18'), s),
  chev: (s = 14) => svg(stroke('M6 9l6 6 6-6', 2.4), s),
  lock: (s = 16) => svg('<rect x="5" y="10.5" width="14" height="10.5" rx="2" fill="currentColor"/>' + stroke('M8 10.5V8a4 4 0 0 1 8 0v2.5', 2.2), s),
  link: (s = 14) => svg(stroke('M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1', 2.2), s),
  addUser: (s = 16) => svg(stroke('M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2.5 21c.8-4 3.8-6 7.5-6s6.7 2 7.5 6M19.5 8v6M16.5 11h6'), s),
  grid: (s = 24) => svg(stroke('M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18', 1.8), s),
  reels: (s = 24) => svg(stroke('M2.5 7.5h19M8.5 2.5l3 5M14.5 2.5l3 5M6.5 2.5h11a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4v-11a4 4 0 0 1 4-4z') + '<path d="M10 11.3v6.2l5-3.1z" fill="currentColor"/>', s),
  tagged: (s = 24) => svg(stroke('M10.2 18.3 12 21l1.8-2.7H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11.3a2 2 0 0 0 2 2zM12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM7.5 15c.7-1.9 2.4-3 4.5-3s3.8 1.1 4.5 3'), s),
  home: (s = 26) => svg(stroke('M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6.5H9V21H4a1 1 0 0 1-1-1z'), s),
  search: (s = 26) => svg(stroke('M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM16 16l5.5 5.5'), s),
  pin: (s = 24) => svg('<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#fff"/>', s),
  plus: (s = 24) => svg(stroke('M12 5v14M5 12h14', 2.4), s),
  pinned: (s = 12) => svg('<path d="M15 3l6 6-3 1-4 4 .5 4.5L13 20l-4-4-5 5 5-5-4-4 1.5-1.5L11 11l4-4z" fill="currentColor"/>', s),
  heartHL: (s = 24) => svg(stroke(HEART), s),
  back: (s = 26) => svg(stroke('M15 4.5 7.5 12l7.5 7.5', 2.2), s),
  multi: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M8 3h11a2 2 0 0 1 2 2v11" fill="none" stroke="#fff" stroke-width="2"/><rect x="3" y="7" width="14" height="14" rx="2" fill="#fff"/></svg>',
  photo: (s = 28) => svg(stroke('M3 7a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 1.6), s),
  signal: '<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".7" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx=".7" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx=".7" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx=".7" fill="currentColor"/></svg>',
  wifi: '<svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.1-1.1A10 10 0 0 0 8 .7 10 10 0 0 0 .9 3.6L2 4.7a8.4 8.4 0 0 1 6-2.4zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.1-1.1A6.7 6.7 0 0 0 8 4a6.7 6.7 0 0 0-4.7 1.9L4.4 7c1-.9 2.2-1.4 3.6-1.4zM8 9a1.6 1.6 0 0 1 1.2.5L8 11.3 6.8 9.5C7.1 9.2 7.5 9 8 9z" fill="currentColor"/></svg>',
  battery: (lv = 100) => `<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="${(Math.max(4, Math.min(100, lv)) / 100 * 20).toFixed(1)}" height="9" rx="2" fill="${lv <= 20 ? '#ff3b30' : 'currentColor'}"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg>`,
};
function verified(size = 14) {
  const pts = []; const n = 10;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2, b = ((i + .5) / n) * Math.PI * 2 - Math.PI / 2, c = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    const p = (ang, r) => `${(12 + Math.cos(ang) * r).toFixed(2)} ${(12 + Math.sin(ang) * r).toFixed(2)}`;
    if (i === 0) pts.push(`M${p(a, 9.6)}`);
    pts.push(`Q${p(b, 13.2)} ${p(c, 9.6)}`);
  }
  return `<svg class="vf" width="${size}" height="${size}" viewBox="0 0 24 24"><path d="${pts.join('')}Z" fill="#0095f6"/><path d="M7.6 12.3l3 3 5.8-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/* 캡션의 #태그 @멘션 강조 */
function fmt(text) {
  return esc(text).replace(/(^|[\s(])([#@][\p{L}\p{N}_.]+)/gu, '$1<span class="lk">$2</span>');
}

/* ───────── 상태 ───────── */
const KEY = 'insta-maker-v1';
function newComments() {
  return {
    backdrop: true, height: 'half',
    items: [
      { id: uid(), avatar: null, username: 'fan_1', verified: false, time: '2시간', text: '신드롬을 사랑하자', likes: '12', liked: true, author: false, pinned: false, authorLiked: true, reply: false, more: 0 },
      { id: uid(), avatar: null, username: '', verified: false, time: '1시간', text: '@fan_1 고마워 ❤️', likes: '3', liked: false, author: true, pinned: false, authorLiked: false, reply: true, more: 0 },
      { id: uid(), avatar: null, username: 'fan_2', verified: false, time: '45분', text: '성유진을 아껴주자', likes: '', liked: false, author: false, pinned: false, authorLiked: false, reply: false, more: 2 },
    ],
  };
}
function newPost() {
  return {
    photos: [], index: 0, ratio: '4/5', location: '', collab: '', follow: false,
    countStyle: 'inline', likes: '1,234', commentCount: '56', reposts: '8', shares: '21', likedBy: '',
    liked: false, saved: false, showRepost: true,
    caption: '오늘의 기록 📷\n#일상 #daily', collapse: false, time: '3시간 전',
    comments: newComments(),
    crops: [], thumb: null,
  };
}
function newStory() {
  return {
    layout: '4', cells: [], sel: 0, gap: 0.5, gapColor: '#ffffff',
    bg: 'linear-gradient(160deg,#833ab4,#fd1d1d 55%,#fcb045)',
    stickers: [], selSticker: null,
    showTop: true, count: 3, current: 1, progress: 40, time: '3시간', bottom: 'reply',
  };
}
function newAccount() {
  return {
    own: true, private: false, nav: true, showHL: true,
    posts: '24', followers: '1,234', following: '321', category: '', bio: '좋아하는 것들을 기록해요 ✨', link: '', mutual: '',
    highlights: [{ id: uid(), title: '일상', img: null, story: 0 }, { id: uid(), title: '여행', img: null, story: -1 }],
    grid: [], placeholders: 9,
  };
}
function defaults() {
  return {
    ui: { tab: 'post', theme: 'light', status: true, clock: '9:41', sbIcons: true, battery: 100, fontScale: 1, postIdx: 0, storyIdx: 0 },
    profile: { username: 'your.id', name: '이름', avatar: null, verified: false, ring: false },
    posts: [newPost()],
    stories: [newStory()],
    account: newAccount(),
  };
}
// S.post / S.comments / S.story 는 지금 고른 게시물·스토리를 가리킨다 (저장할 때는 빠짐)
function attach(st) {
  Object.defineProperties(st, {
    post: { get() { return this.posts[clamp(this.ui.postIdx, 0, this.posts.length - 1)]; }, set(v) { this.posts[clamp(this.ui.postIdx, 0, this.posts.length - 1)] = v; }, configurable: true },
    comments: { get() { return this.post.comments; }, set(v) { this.post.comments = v; }, configurable: true },
    story: { get() { return this.stories[clamp(this.ui.storyIdx, 0, this.stories.length - 1)]; }, set(v) { this.stories[clamp(this.ui.storyIdx, 0, this.stories.length - 1)] = v; }, configurable: true },
  });
  return st;
}
function hydrate(saved) {
  const d = defaults();
  if (!saved || typeof saved !== 'object') return attach(d);
  for (const k of ['ui', 'profile', 'account']) if (saved[k] && typeof saved[k] === 'object') d[k] = Object.assign(d[k], saved[k]);
  if (Array.isArray(saved.posts) && saved.posts.length) d.posts = saved.posts.map(x => Object.assign(newPost(), x, { comments: Object.assign(newComments(), x.comments) }));
  else if (saved.post) d.posts = [Object.assign(newPost(), saved.post, { comments: Object.assign(newComments(), saved.comments) })];
  if (Array.isArray(saved.stories) && saved.stories.length) d.stories = saved.stories.map(x => Object.assign(newStory(), x));
  else if (saved.story) d.stories = [Object.assign(newStory(), saved.story)];
  d.stories.forEach(x => { if (x.showUI === false) { x.showTop = false; x.bottom = 'none'; } delete x.showUI; });
  d.account.highlights.forEach(h => { if (h.story == null) h.story = -1; });
  d.ui.postIdx = clamp(+d.ui.postIdx || 0, 0, d.posts.length - 1);
  d.ui.storyIdx = clamp(+d.ui.storyIdx || 0, 0, d.stories.length - 1);
  return attach(d);
}

/* 브라우저 저장소 (IndexedDB: 사진까지 저장 가능) */
const DB = (() => {
  let opening = null;
  const open = () => opening || (opening = new Promise((res, rej) => {
    const r = indexedDB.open('insta-maker', 1);
    r.onupgradeneeded = () => { r.result.createObjectStore('kv'); r.result.createObjectStore('slots', { keyPath: 'id' }); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
  const run = async (store, mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction(store, mode); const req = fn(t.objectStore(store));
      t.oncomplete = () => res(req && req.result);
      t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  };
  return {
    get: k => run('kv', 'readonly', st => st.get(k)),
    set: (k, v) => run('kv', 'readwrite', st => st.put(v, k)),
    slots: () => run('slots', 'readonly', st => st.getAll()),
    getSlot: id => run('slots', 'readonly', st => st.get(id)),
    putSlot: v => run('slots', 'readwrite', st => st.put(v)),
    delSlot: id => run('slots', 'readwrite', st => st.delete(id)),
  };
})();

let S = hydrate(null);
async function loadSaved() {
  try { const v = await DB.get('current'); if (v) return JSON.parse(v); } catch { /* IndexedDB 사용 불가 */ }
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
let saveTimer = null, warnedQuota = false;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const json = JSON.stringify(S);
    try { await DB.set('current', json); return; } catch { /* 아래로 */ }
    try { localStorage.setItem(KEY, json); return; } catch { /* 용량 초과 */ }
    try {
      localStorage.setItem(KEY, JSON.stringify(S, (k, v) => (typeof v === 'string' && v.startsWith('data:image') ? null : v)));
      if (!warnedQuota) { warnedQuota = true; toast('사진 용량이 커서 사진은 브라우저에 저장되지 않아요. (글자는 저장됨)'); }
    } catch { /* 무시 */ }
  }, 300);
}

/* ───────── 사진 위치·확대 (게시물 사진, 프로필 썸네일) ───────── */
const CROP0 = () => ({ fx: .5, fy: .5, z: 1 });
function cropCSS(c) {
  c = c || CROP0();
  const pos = `${(c.fx * 100).toFixed(2)}% ${(c.fy * 100).toFixed(2)}%`;
  return `object-position:${pos};transform-origin:${pos};transform:scale(${(+c.z || 1).toFixed(3)})`;
}
function ensureCrops(p) {
  if (!Array.isArray(p.crops)) p.crops = [];
  while (p.crops.length < p.photos.length) p.crops.push(CROP0());
  p.crops.length = p.photos.length;
  return p.crops;
}

/* ───────── 공통 조각 ───────── */
function sbInner() {
  return `<span>${esc(S.ui.clock)}</span>${S.ui.sbIcons ? `<span class="sb-r">${I.signal}${I.wifi}${I.battery(S.ui.battery)}</span>` : ''}`;
}
function statusBar() {
  return S.ui.status ? `<div class="sb">${sbInner()}</div>` : '';
}
const fsStyle = () => `--fs:${S.ui.fontScale || 1}`;
function avatarImg(src, cls = 'av', ring = false) {
  const img = `<img class="${cls}" src="${avatarOf(src)}" alt="">`;
  return ring ? `<span class="ring">${img}</span>` : img;
}
const V = () => (S.profile.verified ? verified(14) : '');

/* ───────── 게시물 ───────── */
function postHTML(p = S.post, o = {}) {
  const pr = S.profile;
  const photos = p.photos.length ? p.photos : [null];
  const idx = clamp(p.index, 0, photos.length - 1);
  const cur = photos[idx];
  const [rw, rh] = p.ratio.split('/').map(Number);
  const inline = p.countStyle === 'inline';
  const act = (icon, n, attr = '') => `<span class="a"${attr}>${icon}${inline && n ? `<span>${esc(n)}</span>` : ''}</span>`;
  const openC = o.viewer ? ` data-open="${o.cid}"` : '';
  const dots = photos.length > 1 ? `<div class="p-dots${inline ? ' row' : ''}">${photos.slice(0, 5).map((_, i) => `<i class="${i === Math.min(idx, 4) ? 'on' : ''}"></i>`).join('')}</div>` : '';
  const user = `<span class="t">${esc(pr.username)}</span>${V()}${p.collab ? `<span class="t">&nbsp;및&nbsp;${esc(p.collab)}</span>` : ''}`;

  let cap = p.caption;
  let more = '';
  if (p.collapse) {
    const first = cap.split('\n')[0];
    const cut = first.length > 38 ? first.slice(0, 38) : first;
    if (cut !== cap) { cap = cut; more = `<span class="sec">... 더 보기</span>`; }
  }
  const likedBy = p.likedBy
    ? `<div class="p-likes">${avatarImg(null)}<span><b>${esc(p.likedBy)}</b>님 외 <b>여러 명</b>이 좋아합니다</span></div>`
    : (!inline && p.likes ? `<div><b>좋아요 ${esc(p.likes)}개</b></div>` : '');

  return `
  <article class="post">
    <header class="p-head">
      ${avatarImg(pr.avatar, 'av', pr.ring)}
      <div class="p-meta">
        <div class="p-user">${user}</div>
        ${p.location ? `<div class="p-sub">${esc(p.location)}</div>` : ''}
      </div>
      ${p.follow ? '<span class="follow-btn">팔로우</span>' : ''}
      ${I.more()}
    </header>
    <div class="p-media" style="aspect-ratio:${rw}/${rh}"${o.viewer && photos.length > 1 ? ' data-car' : ''}${o.crop && cur ? ' data-crop="post"' : ''}>
      ${o.viewer && photos.length > 1 ? photos.map((src, i) => `<img src="${src}" alt="" data-ph="${i}" style="${cropCSS((p.crops || [])[i])}"${i === idx ? '' : ' hidden'}>`).join('')
        : cur ? `<img src="${cur}" alt="" style="${cropCSS((p.crops || [])[idx])}">` : o.viewer ? '' : `<div class="ph-empty">${I.photo()}<span>사진을 추가하세요</span></div>`}
      ${photos.length > 1 ? `<span class="p-count">${idx + 1}/${photos.length}</span>` : ''}
    </div>
    ${inline ? dots : ''}
    <div class="p-act">
      <div class="p-act-l">
        ${act(I.heart(p.liked), p.likes)}
        ${act(I.comment(), p.commentCount, openC)}
        ${p.showRepost ? act(I.repost(), p.reposts) : ''}
        ${act(I.share(), p.shares)}
      </div>
      ${inline ? '' : dots}
      <span class="sp"></span>
      ${I.bookmark(p.saved)}
    </div>
    <div class="p-body">
      ${likedBy}
      ${p.caption ? `<div class="p-cap"><b>${esc(pr.username)}</b>${V()} ${fmt(cap)}${more}</div>` : ''}
      ${!inline && p.commentCount ? `<div class="sec"${openC}>댓글 ${esc(p.commentCount)}개 모두 보기</div>` : ''}
      ${p.time ? `<div class="p-time sec">${esc(p.time)}</div>` : ''}
    </div>
  </article>`;
}
function renderPost() {
  $('#pv-post').innerHTML = `<div style="${fsStyle()}" class="ig shot" data-theme="${S.ui.theme}">${statusBar()}${postHTML(S.post, { crop: true })}</div>`;
}

/* ───────── 댓글 ───────── */
const QUICK_EMOJI = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];
function commentHTML(m) {
  const pr = S.profile;
  const u = m.author ? pr.username : m.username;
  const av = m.author ? pr.avatar : m.avatar;
  const v = m.author ? pr.verified : m.verified;
  return `
  <div class="c${m.reply ? ' rp' : ''}">
    ${avatarImg(av)}
    <div class="c-b">
      <div class="c-h"><b>${esc(u)}</b>${v ? verified(12) : ''}<span class="sec">${esc(m.time)}</span>${m.pinned ? `<span class="sec" style="display:inline-flex;align-items:center;gap:3px">${I.pinned()}고정됨</span>` : ''}${m.author ? '<span class="sec">· 작성자</span>' : ''}</div>
      <div class="c-t">${fmt(m.text)}</div>
      <div class="c-a"><span>답글 달기</span>${m.authorLiked ? `<span class="al">${avatarImg(pr.avatar)}${I.heart(true, 10)}</span>` : ''}</div>
      ${m.more > 0 ? `<div class="c-more"><i></i>답글 ${esc(m.more)}개 더 보기</div>` : ''}
    </div>
    <div class="c-l">${I.heart(m.liked, 14)}<span>${esc(m.likes)}</span></div>
  </div>`;
}
function sheetHTML(c, o = {}) {
  const pr = S.profile;
  return `
  <div class="sheet">
    <div class="grab"${o.viewer ? ' data-close' : ''}></div>
    <div class="s-title">댓글</div>
    <div class="s-list">${c.items.map(commentHTML).join('')}</div>
    <div class="s-foot">
      <div class="s-emo">${QUICK_EMOJI.map(e => `<span>${e}</span>`).join('')}</div>
      <div class="s-in">${avatarImg(pr.avatar)}<div class="s-ph"><span>${esc(pr.username)}님에게 댓글 추가...</span></div></div>
    </div>
  </div>`;
}
function renderComments() {
  const c = S.comments, sheet = sheetHTML(c), t = S.ui.theme;
  $('#pv-comments').innerHTML = c.backdrop
    ? `<div style="${fsStyle()}" class="ig shot phone" data-theme="${t}"><div class="phone-bg">${statusBar()}${postHTML()}</div><div class="dim"></div><div class="sheet-wrap ${c.height}">${sheet}</div></div>`
    : `<div style="${fsStyle()}" class="ig shot cm-plain" data-theme="${t}">${sheet}</div>`;
}

/* ───────── 프로필 ───────── */
function storyCover(i) {
  const st = S.stories[i];
  return st ? (st.cells.find(c => c && c.src) || {}).src || null : null;
}
function accountHTML(o = {}) {
  const a = S.account, pr = S.profile;
  const own = a.own;
  const hls = a.highlights.map(h => {
    const cover = h.img || storyCover(h.story);
    const link = h.story >= 0 && S.stories[h.story] ? (o.viewer ? ` data-story="${h.story}"` : ` data-go-story="${h.story}"`) : '';
    return `<div class="hl"${link}><div class="hl-c">${cover ? `<img src="${cover}" alt="">` : '<div></div>'}</div><span>${esc(h.title)}</span></div>`;
  }).join('')
    + (own ? `<div class="hl"><div class="hl-c"><div class="hl-new">${I.plus(26)}</div></div><span>신규</span></div>` : '');
  let cells = S.posts.map((p, i) => `<div ${o.viewer ? `data-go="s-post-${i}"` : `data-go-post="${i}"`}>${p.photos[0] ? `<img src="${p.photos[0]}" alt="" style="${cropCSS(p.thumb)}">` : ''}${p.photos.length > 1 ? `<span class="g-multi">${I.multi}</span>` : ''}</div>`)
    .concat(a.grid.map(src => `<div><img src="${src}" alt=""></div>`));
  if (!S.posts.some(p => p.photos.length) && !a.grid.length) while (cells.length < a.placeholders) cells.push('<div></div>');
  cells = cells.join('');
  const btns = own
    ? '<div>프로필 편집</div><div>프로필 공유</div>'
    : '<div class="blue">팔로우</div><div>메시지</div>';
  const nav = a.nav ? `<div class="a-nav">${I.home()}${I.reels(26)}${I.share(26)}${I.search()}${avatarImg(pr.avatar)}</div>` : '';
  return `
  <div style="${fsStyle()}" class="ig shot acct${a.nav && !o.viewer ? ' phone' : ''}" data-theme="${S.ui.theme}">
    ${statusBar()}
    <div class="a-top">
      <div class="a-un">${a.private ? I.lock(18) : ''}<span class="t">${esc(pr.username)}</span>${own ? I.chev() : ''}${pr.verified ? verified(18) : ''}</div>
      <span class="sp"></span>
      <div class="a-ic">${own ? I.plusBox() + I.menu() : I.more()}</div>
    </div>
    <div class="a-row">
      <div class="a-av">${avatarImg(pr.avatar, 'av', pr.ring)}${own ? `<span class="a-plus">${I.plus(14)}</span>` : ''}</div>
      <div class="a-right">
        ${pr.name ? `<div class="a-dn">${esc(pr.name)}</div>` : ''}
        <div class="a-stats">
          <div><b>${esc(a.posts)}</b><span>게시물</span></div>
          <div><b>${esc(a.followers)}</b><span>팔로워</span></div>
          <div><b>${esc(a.following)}</b><span>팔로잉</span></div>
        </div>
      </div>
    </div>
    <div class="a-bio">
      ${a.category ? `<div class="sec">${esc(a.category)}</div>` : ''}
      ${a.bio ? `<div class="bio">${fmt(a.bio)}</div>` : ''}
      ${a.link ? `<div class="a-link">${I.link()}<span>${esc(a.link)}</span></div>` : ''}
      ${a.mutual ? `<div class="a-mutual">${avatarImg(null, 'av" style="width:20px;height:20px')}<span>${esc(a.mutual)}</span></div>` : ''}
    </div>
    <div class="a-btns">${btns}<div class="ico">${I.addUser()}</div></div>
    ${a.showHL ? `<div class="a-hl">${hls}</div>` : ''}
    <div class="a-tabs"><div class="on">${I.grid()}</div><div>${I.reels()}</div><div>${I.tagged()}</div></div>
    <div class="a-grid">${cells}</div>
    ${nav}
  </div>`;
}
function renderAccount() { $('#pv-account').innerHTML = accountHTML(); }

/* ───────── 스토리 ───────── */
const LAYOUTS = {
  '1': { n: 1, cols: '1fr', rows: '1fr' },
  '2v': { n: 2, cols: '1fr', rows: '1fr 1fr' },
  '2h': { n: 2, cols: '1fr 1fr', rows: '1fr' },
  '3v': { n: 3, cols: '1fr', rows: '1fr 1fr 1fr' },
  '4': { n: 4, cols: '1fr 1fr', rows: '1fr 1fr' },
  '6': { n: 6, cols: '1fr 1fr', rows: '1fr 1fr 1fr' },
};
const BGS = [
  'linear-gradient(160deg,#833ab4,#fd1d1d 55%,#fcb045)',
  'linear-gradient(160deg,#4f5bd5,#962fbf 50%,#d62976)',
  'linear-gradient(160deg,#fbe9d7,#f6d5f7)',
  'linear-gradient(160deg,#a1c4fd,#c2e9fb)',
  'linear-gradient(160deg,#0f2027,#2c5364)',
  'linear-gradient(160deg,#ffe259,#ffa751)',
  '#000000', '#ffffff', '#f2e8dc',
];
const TEXT_COLORS = ['#ffffff', '#000000', '#3897f0', '#70c050', '#fdcb5c', '#fd8d32', '#ed4956', '#d10869', '#a307ba', '#f8d7e0'];
const FONTS = { classic: '클래식', modern: '모던', neon: '네온', type: '타자기', strong: '스트롱', serif: '명조' };

function cellsOf(s) {
  const n = LAYOUTS[s.layout].n;
  while (s.cells.length < n) s.cells.push({ src: null, fx: .5, fy: .5, z: 1 });
  return s.cells.slice(0, n);
}
function cellsArr() { return cellsOf(S.story); }
function hexToRgb(h) { const m = h.replace('#', '').match(/.{2}/g) || ['ff', 'ff', 'ff']; return m.map(x => parseInt(x, 16)); }
function contrast(h) { const [r, g, b] = hexToRgb(h); return (r * 299 + g * 587 + b * 114) / 1000 > 160 ? '#000' : '#fff'; }

function stickerInner(k) {
  switch (k.type) {
    case 'text': {
      let st;
      if (k.font === 'neon') st = `color:#fff;text-shadow:0 0 .06em #fff,0 0 .2em ${k.color},0 0 .45em ${k.color},0 0 .9em ${k.color}`;
      else if (k.bg === 'solid') st = `background:${k.color};color:${contrast(k.color)}`;
      else if (k.bg === 'soft') { const [r, g, b] = hexToRgb(k.color); st = `background:rgba(${r},${g},${b},.55);color:#fff`; }
      else st = `color:${k.color}`;
      return `<div class="k-text f-${k.font}" style="text-align:${k.align}"><span style="${st}">${esc(k.text)}</span></div>`;
    }
    case 'emoji': return `<span class="k-emoji">${esc(k.text)}</span>`;
    case 'mention': case 'hashtag': case 'location': case 'link': {
      const icon = k.type === 'location' ? `<span style="color:${k.style === 'white' ? '#a033ff' : '#fff'}">${I.pin()}</span>`
        : k.type === 'link' ? `<span style="color:${k.style === 'white' ? '#0095f6' : '#fff'}">${I.link(24)}</span>` : '';
      const pre = k.type === 'mention' ? '@' : k.type === 'hashtag' ? '#' : '';
      const txt = (pre + String(k.text).replace(/^[@#]/, '')).toUpperCase();
      return `<div class="k-chip st-${k.style} c-${k.type}">${icon}<span class="gt g-${k.type}">${esc(txt)}</span></div>`;
    }
    case 'music':
      return `<div class="k-music ${k.style}"><div class="mu-art">${k.img ? `<img src="${k.img}" alt="">` : ''}</div><div class="mu-tx"><b>${esc(k.title)}</b><span>${esc(k.artist)}</span></div><div class="mu-eq"><i></i><i></i><i></i></div></div>`;
    case 'question':
      return `<div class="k-q" style="background:${k.color}">${avatarImg(S.profile.avatar, 'q-av')}<div class="q-title" style="color:${contrast(k.color)}">${esc(k.title)}</div><div class="q-in">${esc(k.hint)}</div></div>`;
    case 'image':
      return `<div class="k-img${k.frame ? ' framed' : ''}"><img src="${k.img}" alt=""></div>`;
  }
  return '';
}
function stickerTransform(k) { return `translate(-50%,-50%) rotate(${k.rot}deg) scale(${k.scale})`; }

function storyHTML(s, o = {}) {
  const pr = S.profile, L = LAYOUTS[s.layout], ed = !o.viewer;
  const cells = cellsOf(s);
  const grid = `<div class="st-grid" style="grid-template-columns:${L.cols};grid-template-rows:${L.rows};gap:${s.gap}cqw;${s.gap ? `background:${s.gapColor}` : ''}">
    ${cells.map((c, i) => `<div class="cell${ed && i === s.sel && L.n > 1 ? ' sel' : ''}" data-cell="${i}"${!c.src && s.gap ? ` style="background:${s.bg}"` : ''}>${c.src ? `<img src="${c.src}" alt="">` : ed ? `<div class="cell-empty">${I.plus(28)}<span>사진 추가</span></div>` : ''}</div>`).join('')}
  </div>`;
  const stickers = s.stickers.map(k => `<div class="k${ed && k.id === s.selSticker ? ' sel' : ''}" data-k-id="${k.id}" style="left:${k.x}%;top:${k.y}%;transform:${stickerTransform(k)}">${stickerInner(k)}</div>`).join('');

  let ui = '';
  {
    const n = clamp(+s.count || 1, 1, 12), cur = clamp(+s.current || 1, 1, n);
    const bars = Array.from({ length: n }, (_, i) => `<i><b${i + 1 === cur ? ' data-cur' : ''} style="width:${i + 1 < cur ? 100 : i + 1 === cur ? s.progress : 0}%"></b></i>`).join('');
    const top = S.ui.status ? 13.5 : 2.4;
    let bottom = '';
    if (s.bottom === 'reply') bottom = `<div class="s-shade-b"></div><div class="s-bottom"><div class="s-input">메시지 보내기</div>${I.heart(false)}${I.share()}</div>`;
    else if (s.bottom === 'own') bottom = `<div class="s-shade-b"></div><div class="s-own"><div class="s-viewers">${avatarImg(null)}${avatarImg(null)}${avatarImg(null)}</div><span class="lbl">활동</span><span class="sp"></span><span class="s-oi">${I.heartHL()}<span>하이라이트</span></span><span class="s-oi">${I.share()}<span>보내기</span></span><span class="s-oi">${I.more()}<span>더 보기</span></span></div>`;
    ui = `<div class="s-ui">
      ${S.ui.status || s.showTop ? '<div class="s-shade-t"></div>' : ''}
      ${S.ui.status ? `<div class="s-sb">${sbInner()}</div>` : ''}
      ${s.showTop ? `<div class="s-bars" style="top:${top}cqw">${bars}</div>
      <div class="s-head" style="top:${top + 2.6}cqw">${avatarImg(pr.avatar)}<b>${esc(pr.username)}</b>${pr.verified ? verified(13) : ''}<span class="tm">${esc(s.time)}</span><span class="sp"></span>${I.more()}${o.viewer && !o.noClose ? `<span class="v-x" data-close>${I.close()}</span>` : I.close()}</div>` : ''}
      ${bottom}
    </div>`;
  }
  return `<div class="story shot"${ed ? ' id="story"' : ''} style="background:${s.bg};${fsStyle()}">${grid}${stickers}${ui}</div>`;
}
function renderStory() {
  $('#pv-story').innerHTML = storyHTML(S.story);
  layoutCells();
}
function fitCellImg(cellEl, c) {
  const img = cellEl.querySelector('img');
  if (!img) return;
  const apply = () => {
    const cw = cellEl.clientWidth, ch = cellEl.clientHeight, w = img.naturalWidth, h = img.naturalHeight;
    if (!cw || !ch || !w) return;
    const base = Math.max(cw / w, ch / h) * c.z, W = w * base, H = h * base;
    Object.assign(img.style, { width: `${W / cw * 100}%`, height: `${H / ch * 100}%`, left: `${(cw - W) * c.fx / cw * 100}%`, top: `${(ch - H) * c.fy / ch * 100}%` });
  };
  if (img.complete) apply(); else img.onload = apply;
}
function layoutCells() {
  const cells = cellsArr();
  $$('#story .cell').forEach((el, i) => fitCellImg(el, cells[i]));
}

/* 스토리: 드래그 / 핀치 */
const ptrs = new Map();
let gesture = null;
function stageRect() { return $('#story').getBoundingClientRect(); }
function onStoryDown(e) {
  const story = e.target.closest('#story'); if (!story) return;
  const kEl = e.target.closest('.k');
  const cellEl = e.target.closest('.cell');
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  story.setPointerCapture(e.pointerId);
  const s = S.story;

  if (ptrs.size === 2 && gesture) { // 두 손가락 시작
    const [a, b] = [...ptrs.values()];
    gesture.pinch = { d: Math.hypot(b.x - a.x, b.y - a.y), ang: Math.atan2(b.y - a.y, b.x - a.x) };
    if (gesture.kind === 'k') { const k = s.stickers.find(x => x.id === gesture.id); gesture.pinch.scale = k.scale; gesture.pinch.rot = k.rot; }
    if (gesture.kind === 'cell') gesture.pinch.z = s.cells[gesture.i].z;
    return;
  }
  if (kEl) {
    const k = s.stickers.find(x => x.id === kEl.dataset.kId);
    const changed = s.selSticker !== k.id;
    s.selSticker = k.id;
    gesture = { kind: 'k', id: k.id, el: kEl, sx: e.clientX, sy: e.clientY, x0: k.x, y0: k.y, moved: false };
    $$('#story .k.sel').forEach(x => x.classList.remove('sel')); kEl.classList.add('sel');
    if (changed) renderStickerEditor();
  } else if (cellEl) {
    const i = +cellEl.dataset.cell, c = cellsArr()[i];
    if (s.selSticker) { s.selSticker = null; $$('#story .k.sel').forEach(x => x.classList.remove('sel')); renderStickerEditor(); }
    if (s.sel !== i) { s.sel = i; $$('#story .cell').forEach((x, j) => x.classList.toggle('sel', j === i && LAYOUTS[s.layout].n > 1)); renderCellEditor(); }
    const img = cellEl.querySelector('img');
    gesture = { kind: 'cell', i, el: cellEl, sx: e.clientX, sy: e.clientY, fx0: c.fx, fy0: c.fy, moved: false, empty: !c.src, img };
  }
}
function onStoryMove(e) {
  if (!ptrs.has(e.pointerId) || !gesture) return;
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const s = S.story;
  if (ptrs.size >= 2 && gesture.pinch) {
    const [a, b] = [...ptrs.values()];
    const d = Math.hypot(b.x - a.x, b.y - a.y), ang = Math.atan2(b.y - a.y, b.x - a.x);
    if (gesture.kind === 'k') {
      const k = s.stickers.find(x => x.id === gesture.id);
      k.scale = clamp(gesture.pinch.scale * d / gesture.pinch.d, .2, 6);
      k.rot = Math.round(gesture.pinch.rot + (ang - gesture.pinch.ang) * 180 / Math.PI);
      gesture.el.style.transform = stickerTransform(k);
    } else {
      const c = s.cells[gesture.i]; c.z = clamp(gesture.pinch.z * d / gesture.pinch.d, 1, 5); fitCellImg(gesture.el, c);
    }
    gesture.moved = true;
    return;
  }
  const dx = e.clientX - gesture.sx, dy = e.clientY - gesture.sy;
  if (Math.abs(dx) + Math.abs(dy) > 3) gesture.moved = true;
  if (gesture.kind === 'k') {
    const r = stageRect(), k = s.stickers.find(x => x.id === gesture.id);
    k.x = clamp(gesture.x0 + dx / r.width * 100, -10, 110);
    k.y = clamp(gesture.y0 + dy / r.height * 100, -10, 110);
    gesture.el.style.left = k.x + '%'; gesture.el.style.top = k.y + '%';
  } else if (gesture.img && gesture.img.naturalWidth) {
    const c = s.cells[gesture.i], cw = gesture.el.clientWidth, ch = gesture.el.clientHeight;
    const base = Math.max(cw / gesture.img.naturalWidth, ch / gesture.img.naturalHeight) * c.z;
    const ox = gesture.img.naturalWidth * base - cw, oy = gesture.img.naturalHeight * base - ch;
    if (ox > .5) c.fx = clamp(gesture.fx0 - dx / ox, 0, 1);
    if (oy > .5) c.fy = clamp(gesture.fy0 - dy / oy, 0, 1);
    fitCellImg(gesture.el, c);
  }
}
function onStoryUp(e) {
  ptrs.delete(e.pointerId);
  if (!gesture) return;
  if (ptrs.size === 1 && gesture.pinch) { // 한 손가락 남으면 이어서 이동
    const [p] = [...ptrs.values()]; const s = S.story;
    gesture.pinch = null; gesture.sx = p.x; gesture.sy = p.y;
    if (gesture.kind === 'k') { const k = s.stickers.find(x => x.id === gesture.id); gesture.x0 = k.x; gesture.y0 = k.y; }
    else { const c = s.cells[gesture.i]; gesture.fx0 = c.fx; gesture.fy0 = c.fy; }
    return;
  }
  if (ptrs.size) return;
  if (gesture.kind === 'cell' && !gesture.moved && gesture.empty) pickCellImage(gesture.i);
  if (gesture.kind === 'k') renderStickerEditor(true);
  if (gesture.kind === 'cell') renderCellEditor();
  gesture = null;
  save();
}
function onStoryWheel(e) {
  const s = S.story;
  const kEl = e.target.closest('.k');
  const cellEl = e.target.closest('.cell');
  if (kEl) {
    e.preventDefault();
    const k = s.stickers.find(x => x.id === kEl.dataset.kId);
    if (e.shiftKey) k.rot = Math.round(k.rot + (e.deltaY || e.deltaX) * .2);
    else k.scale = clamp(k.scale * Math.exp(-e.deltaY * .0015), .2, 6);
    kEl.style.transform = stickerTransform(k);
    renderStickerEditor(true);
  } else if (cellEl && cellEl.querySelector('img')) {
    e.preventDefault();
    const c = s.cells[+cellEl.dataset.cell];
    c.z = clamp(c.z * Math.exp(-e.deltaY * .0015), 1, 5);
    fitCellImg(cellEl, c);
    renderCellEditor(true);
  }
  save();
}

/* ───────── 편집 패널 (동적 영역) ───────── */
function thumbsHTML(arr, path, curIdx) {
  return arr.map((src, i) => `<div class="thumb${i === curIdx ? ' on' : ''}"><img src="${src}" data-thumb="${path}" data-i="${i}" alt=""><button class="x" data-del="${path}" data-i="${i}" aria-label="삭제">✕</button><div class="mv"><button data-mv="${path}" data-i="${i}" data-d="-1">◀</button><button data-mv="${path}" data-i="${i}" data-d="1">▶</button></div></div>`).join('');
}
function listBarHTML(kind) {
  const arr = kind === 'post' ? S.posts : S.stories, cur = kind === 'post' ? S.ui.postIdx : S.ui.storyIdx;
  const name = kind === 'post' ? '게시물' : '스토리';
  return `<div class="chips">${arr.map((_, i) => `<button data-pick-${kind}="${i}" class="${i === cur ? 'on' : ''}">${name} ${i + 1}</button>`).join('')}<button data-new-${kind}>+ 새 ${name}</button></div>
    <div class="btn-row">${arr.length > 1 ? `<button class="btn" data-mv-${kind}="-1"${cur === 0 ? ' disabled' : ''}>◀ 앞으로</button><button class="btn" data-mv-${kind}="1"${cur === arr.length - 1 ? ' disabled' : ''}>뒤로 ▶</button>` : ''}<button class="btn" data-dup-${kind}>${name} ${cur + 1} 복제</button>${arr.length > 1 ? `<button class="btn danger" data-del-${kind}>${name} ${cur + 1} 삭제</button>` : ''}</div>`;
}
function renderLists() {
  $('#post-list').innerHTML = listBarHTML('post');
  $('#cm-post-list').innerHTML = listBarHTML('post');
  $('#story-list').innerHTML = listBarHTML('story');
}
function renderPostEditor() {
  $('#post-thumbs').innerHTML = thumbsHTML(S.post.photos, 'post.photos', S.post.index);
  renderCropEditor();
}
function renderCropEditor(slidersOnly) {
  const p = S.post, box = $('#crop-editor');
  if (!p.photos.length) { box.innerHTML = ''; return; }
  const i = clamp(p.index, 0, p.photos.length - 1), c = ensureCrops(p)[i], t = p.thumb || CROP0();
  if (slidersOnly) {
    const a = $('#crop-zoom'), b = $('#thumb-zoom'), im = $('#thumb-crop img');
    if (a) a.value = c.z; if (b) b.value = t.z; if (im) im.style.cssText = cropCSS(t);
    return;
  }
  box.innerHTML = `
    <p class="muted">미리보기 사진을 드래그하면 위치가 옮겨지고, 두 손가락(또는 마우스 휠)으로 확대돼요.</p>
    <label class="f">사진 ${i + 1} 확대<input type="range" id="crop-zoom" min="1" max="5" step="0.01" value="${c.z}"></label>
    <div class="btn-row"><button class="btn" data-crop-reset="post">사진 ${i + 1} 위치 초기화</button></div>
    <h4 class="sub-h">프로필 피드 썸네일 (1:1)</h4>
    <div class="crop-row">
      <div class="thumb-crop" id="thumb-crop" data-crop="thumb"><img src="${p.photos[0]}" alt="" style="${cropCSS(t)}"></div>
      <div class="grow">
        <label class="f">썸네일 확대<input type="range" id="thumb-zoom" min="1" max="5" step="0.01" value="${t.z}"></label>
        <div class="btn-row"><button class="btn" data-crop-reset="thumb">썸네일 초기화</button></div>
      </div>
    </div>`;
}
function cropTarget(kind) {
  const p = S.post;
  if (!p.photos.length) return null;
  if (kind === 'thumb') return p.thumb || (p.thumb = CROP0());
  return ensureCrops(p)[clamp(p.index, 0, p.photos.length - 1)];
}
function applyCrop(img, c) { if (img) img.style.cssText = cropCSS(c); }
function cropImgsFor(kind) {
  return kind === 'thumb' ? [$('#thumb-crop img')] : [$('#pv-post .p-media img')];
}
// 드래그로 위치 이동, 두 손가락·휠로 확대
const cropG = { ptrs: new Map(), g: null };
function cropAnchor(g, x, y) { g.sx = x; g.sy = y; g.fx0 = g.c.fx; g.fy0 = g.c.fy; }
function onCropDown(e) {
  const el = e.target.closest('[data-crop]'); if (!el) return;
  const c = cropTarget(el.dataset.crop); if (!c) return;
  e.preventDefault();
  el.setPointerCapture(e.pointerId);
  cropG.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (cropG.ptrs.size === 1) { cropG.g = { el, kind: el.dataset.crop, img: el.querySelector('img'), c }; cropAnchor(cropG.g, e.clientX, e.clientY); }
  else if (cropG.g) { const [a, b] = [...cropG.ptrs.values()]; cropG.g.pinch = { d: Math.hypot(b.x - a.x, b.y - a.y) || 1, z0: cropG.g.c.z }; }
}
function onCropMove(e) {
  const g = cropG.g; if (!g || !cropG.ptrs.has(e.pointerId)) return;
  cropG.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const c = g.c;
  if (cropG.ptrs.size >= 2 && g.pinch) {
    const [a, b] = [...cropG.ptrs.values()];
    c.z = clamp(g.pinch.z0 * Math.hypot(b.x - a.x, b.y - a.y) / g.pinch.d, 1, 5);
  } else if (g.img && g.img.naturalWidth) {
    const r = g.el.getBoundingClientRect(), w = g.img.naturalWidth, h = g.img.naturalHeight;
    const base = Math.max(r.width / w, r.height / h);
    const rx = w * base * c.z - r.width, ry = h * base * c.z - r.height;
    if (rx > .5) c.fx = clamp(g.fx0 - (e.clientX - g.sx) / rx, 0, 1);
    if (ry > .5) c.fy = clamp(g.fy0 - (e.clientY - g.sy) / ry, 0, 1);
  }
  applyCrop(g.img, c);
}
function onCropUp(e) {
  cropG.ptrs.delete(e.pointerId);
  const g = cropG.g; if (!g) return;
  if (cropG.ptrs.size === 1) { const [p] = [...cropG.ptrs.values()]; g.pinch = null; cropAnchor(g, p.x, p.y); return; }
  if (cropG.ptrs.size) return;
  cropG.g = null;
  renderCropEditor(true);
  save();
}
function onCropWheel(e) {
  const el = e.target.closest('[data-crop]'); if (!el) return;
  const c = cropTarget(el.dataset.crop); if (!c) return;
  e.preventDefault();
  c.z = clamp(c.z * Math.exp(-e.deltaY * .0015), 1, 5);
  applyCrop(el.querySelector('img'), c);
  renderCropEditor(true);
  save();
}
for (const root of ['#pv-post', '#crop-editor']) {
  const el = $(root);
  el.addEventListener('pointerdown', onCropDown);
  el.addEventListener('pointermove', onCropMove);
  el.addEventListener('pointerup', onCropUp);
  el.addEventListener('pointercancel', onCropUp);
  el.addEventListener('wheel', onCropWheel, { passive: false });
}
document.addEventListener('input', e => {
  const id = e.target.id;
  if (id !== 'crop-zoom' && id !== 'thumb-zoom') return;
  const kind = id === 'crop-zoom' ? 'post' : 'thumb', c = cropTarget(kind); if (!c) return;
  c.z = +e.target.value;
  cropImgsFor(kind).forEach(im => applyCrop(im, c));
  save();
});
function renderGridEditor() {
  $('#grid-thumbs').innerHTML = thumbsHTML(S.account.grid, 'account.grid', -1);
}
function renderCommentEditor() {
  const items = S.comments.items;
  $('#cm-editor').innerHTML = items.map((m, i) => `
  <div class="item">
    <div class="item-head">
      ${m.author ? `<img src="${avatarOf(S.profile.avatar)}" alt="" title="작성자는 계정 정보의 사진을 사용해요">` : `<label title="프로필 사진 변경"><img src="${avatarOf(m.avatar)}" alt=""><input type="file" accept="image/*" data-img="comments.items.${i}.avatar"></label><button data-link="img:comments.items.${i}.avatar" title="링크로 프로필 사진 넣기" aria-label="링크로 프로필 사진 넣기">🔗</button>`}
      <div class="grow">${esc(m.author ? S.profile.username + ' (작성자)' : m.username || '댓글 ' + (i + 1))}</div>
      <button data-cm-mv="${i}" data-d="-1" aria-label="위로">↑</button>
      <button data-cm-mv="${i}" data-d="1" aria-label="아래로">↓</button>
      <button data-cm-del="${i}" aria-label="삭제">✕</button>
    </div>
    ${m.author ? '' : `<div class="grid2"><label class="f">아이디<input type="text" data-k="comments.items.${i}.username"></label><label class="f">시간<input type="text" data-k="comments.items.${i}.time"></label></div>`}
    ${m.author ? `<label class="f">시간<input type="text" data-k="comments.items.${i}.time"></label>` : ''}
    <label class="f">내용<textarea rows="2" data-k="comments.items.${i}.text"></textarea></label>
    <div class="grid2"><label class="f">좋아요 수<input type="text" data-k="comments.items.${i}.likes"></label><label class="f">숨은 답글 수<input type="number" min="0" data-k="comments.items.${i}.more"></label></div>
    <div class="checks">
      <label><input type="checkbox" data-k="comments.items.${i}.author" data-restructure> 작성자(나)</label>
      ${m.author ? '' : `<label><input type="checkbox" data-k="comments.items.${i}.verified"> 인증</label>`}
      <label><input type="checkbox" data-k="comments.items.${i}.reply"> 답글(들여쓰기)</label>
      <label><input type="checkbox" data-k="comments.items.${i}.liked"> 좋아요 누름</label>
      <label><input type="checkbox" data-k="comments.items.${i}.authorLiked"> 작성자가 좋아함</label>
      <label><input type="checkbox" data-k="comments.items.${i}.pinned"> 고정됨</label>
    </div>
  </div>`).join('');
  syncForm($('#cm-editor'));
}
function renderHlEditor() {
  $('#hl-editor').innerHTML = S.account.highlights.map((h, i) => `
  <div class="item"><div class="item-head">
    <label title="커버 사진"><img src="${h.img || storyCover(h.story) || DEFAULT_AVATAR}" alt=""><input type="file" accept="image/*" data-img="account.highlights.${i}.img"></label><button data-link="img:account.highlights.${i}.img" title="링크로 커버 넣기" aria-label="링크로 커버 넣기">🔗</button>
    <div class="grow"><label class="f" style="margin:0"><input type="text" data-k="account.highlights.${i}.title"></label></div>
    <button data-hl-del="${i}" aria-label="삭제">✕</button>
  </div>
  <label class="f">누르면 열리는 스토리<select data-k="account.highlights.${i}.story" data-num><option value="-1">없음</option>${S.stories.map((_, j) => `<option value="${j}">스토리 ${j + 1}</option>`).join('')}</select></label>
  </div>`).join('');
  syncForm($('#hl-editor'));
}
function renderLayouts() {
  $('#layouts').innerHTML = Object.entries(LAYOUTS).map(([key, L]) => `<button data-layout="${key}" class="${key === S.story.layout ? 'on' : ''}" style="grid-template-columns:${L.cols};grid-template-rows:${L.rows}" aria-label="${L.n}분할">${'<i></i>'.repeat(L.n)}</button>`).join('');
  $('#bg-swatches').innerHTML = BGS.map(b => `<button data-bg="${b}" class="${b === S.story.bg ? 'on' : ''}" style="background:${b}"></button>`).join('')
    + `<input type="color" id="bg-custom" value="${S.story.bg.startsWith('#') ? S.story.bg : '#222222'}" title="직접 선택">`;
}
function renderCellEditor(slidersOnly) {
  const s = S.story, cells = cellsArr(), c = cells[s.sel] || cells[0];
  if (slidersOnly) { const z = $('#cell-zoom'); if (z) z.value = c.z; return; }
  $('#cell-editor').innerHTML = `
    <div class="cells">${cells.map((x, i) => `<button data-sel-cell="${i}" class="${i === s.sel ? 'on' : ''}" style="${x.src ? `background-image:url('${x.src}')` : ''}">${x.src ? '' : i + 1}</button>`).join('')}</div>
    <div class="btn-row">
      <button class="btn" data-pick-cell>${c.src ? '사진 바꾸기' : '사진 넣기'} (${s.sel + 1}번 칸)</button>
      <button class="btn" data-link="cell">링크로 넣기</button>
      ${c.src ? '<button class="btn danger" data-clear-cell>비우기</button>' : ''}
    </div>
    ${c.src ? `<label class="f">확대<input type="range" id="cell-zoom" min="1" max="5" step="0.01" value="${c.z}"></label>` : ''}`;
}

function newSticker(type, extra = {}) {
  const n = S.story.stickers.length;
  const base = { id: uid(), type, x: 50 + (n % 3 - 1) * 8, y: 28 + (n % 6) * 9, scale: 1, rot: 0 };
  const d = {
    text: { text: '텍스트 입력', font: 'classic', color: '#ffffff', bg: 'none', align: 'center' },
    emoji: { text: '💖' },
    mention: { text: S.profile.username, style: 'white' },
    hashtag: { text: '해시태그', style: 'white' },
    location: { text: '서울', style: 'white' },
    link: { text: 'LINK', style: 'white' },
    music: { title: '노래 제목', artist: '아티스트', img: null, style: '' },
    question: { title: '나에게 질문하세요', hint: '답변 입력...', color: '#ffffff' },
    image: { img: null, frame: false },
  }[type];
  return Object.assign(base, d, extra);
}
function renderStickerEditor(slidersOnly) {
  const s = S.story, i = s.stickers.findIndex(k => k.id === s.selSticker), box = $('#sticker-editor');
  if (i < 0) { box.innerHTML = s.stickers.length ? '<p class="muted">미리보기에서 스티커를 누르면 여기서 편집할 수 있어요.</p>' : ''; return; }
  const k = s.stickers[i], p = `story.stickers.${i}`;
  if (slidersOnly) { const a = $('#k-scale'), b = $('#k-rot'); if (a) a.value = k.scale; if (b) b.value = k.rot; return; }
  const chips = (key, opts) => `<div class="chips">${Object.entries(opts).map(([v, l]) => `<button data-kset="${key}" data-v="${v}" class="${k[key] === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  const colors = key => `<div class="color-row">${TEXT_COLORS.map(c => `<button data-kset="${key}" data-v="${c}" style="background:${c}"></button>`).join('')}<input type="color" data-k="${p}.${key}"></div>`;
  let fields = '';
  switch (k.type) {
    case 'text':
      fields = `<label class="f">문구<textarea rows="2" data-k="${p}.text"></textarea></label>
        <h4>글꼴</h4>${chips('font', FONTS)}
        <h4>색상</h4>${colors('color')}
        <h4>배경</h4>${chips('bg', { none: '없음', solid: '색 배경', soft: '반투명' })}
        <h4>정렬</h4>${chips('align', { left: '왼쪽', center: '가운데', right: '오른쪽' })}`;
      break;
    case 'emoji':
      fields = `<label class="f">이모지 (키보드로 입력 가능)<input type="text" data-k="${p}.text"></label>
        <div class="emoji-quick">${['💖', '❤️', '✨', '🔥', '😍', '🥰', '😂', '🌸', '⭐', '🎀', '🍰', '☕', '📸', '🐶', '🐱', '🌙'].map(e => `<button data-kset="text" data-v="${e}">${e}</button>`).join('')}</div>`;
      break;
    case 'mention': case 'hashtag': case 'location': case 'link':
      fields = `<label class="f">${{ mention: '아이디', hashtag: '해시태그', location: '장소', link: '링크 문구' }[k.type]}<input type="text" data-k="${p}.text"></label>
        <h4>스타일</h4>${chips('style', { white: '흰 배경', color: '컬러 배경', clear: '투명' })}`;
      break;
    case 'music':
      fields = `<label class="f">제목<input type="text" data-k="${p}.title"></label><label class="f">아티스트<input type="text" data-k="${p}.artist"></label>
        <div class="btn-row"><label class="btn file">앨범 커버<input type="file" accept="image/*" data-img="${p}.img"></label><button class="btn" data-link="img:${p}.img">링크로 넣기</button></div>
        <h4>스타일</h4>${chips('style', { '': '밝게', dark: '어둡게' })}`;
      break;
    case 'question':
      fields = `<label class="f">질문<textarea rows="2" data-k="${p}.title"></textarea></label><label class="f">입력창 문구<input type="text" data-k="${p}.hint"></label>
        <h4>카드 색</h4>${colors('color')}`;
      break;
    case 'image':
      fields = `<div class="checks"><label><input type="checkbox" data-k="${p}.frame"> 흰 테두리 (폴라로이드)</label></div>`;
      break;
  }
  box.innerHTML = `<div class="sticker-edit">
    ${fields}
    <label class="f">크기<input type="range" id="k-scale" min="0.2" max="6" step="0.01" data-k="${p}.scale"></label>
    <label class="f">회전<input type="range" id="k-rot" min="-180" max="180" step="1" data-k="${p}.rot"></label>
    <div class="btn-row">
      <button class="btn" data-k-act="front">맨 앞으로</button>
      <button class="btn" data-k-act="back">맨 뒤로</button>
      <button class="btn" data-k-act="dup">복제</button>
      <button class="btn" data-k-act="center">가운데로</button>
      <button class="btn danger" data-k-act="del">삭제</button>
    </div></div>`;
  syncForm(box);
}

/* ───────── 폼 바인딩 ───────── */
function syncForm(root = document) {
  $$('[data-out]', root).forEach(el => { const v = getPath(S, el.dataset.out); el.textContent = el.hasAttribute('data-pct') ? Math.round(v * 100) : v; });
  $$('[data-k]', root).forEach(el => {
    const v = getPath(S, el.dataset.k);
    if (el.type === 'checkbox') el.checked = !!v;
    else if (v != null && document.activeElement !== el) el.value = String(v);
  });
}
const STRUCTURAL = /^comments\.items\.\d+\.author$/;
document.addEventListener('input', e => {
  const el = e.target, k = el.dataset.k;
  if (!k) return;
  let v = el.type === 'checkbox' ? el.checked : (el.type === 'range' || el.type === 'number' || el.hasAttribute('data-num')) ? +el.value : el.value;
  setPath(S, k, v);
  if (STRUCTURAL.test(k) || el.hasAttribute('data-restructure')) renderCommentEditor();
  if (/^story\.stickers\.\d+\.(scale|rot)$/.test(k)) {
    const kk = getPath(S, k.replace(/\.(scale|rot)$/, '')), node = $(`#story [data-k-id="${kk.id}"]`);
    if (node) { node.style.transform = stickerTransform(kk); save(); return; }
  }
  if (k.startsWith('ui.')) { syncForm(); renderPreview(); save(); return; }
  renderPreview();
  save();
});
document.addEventListener('input', e => {
  if (e.target.id === 'cell-zoom') {
    const c = cellsArr()[S.story.sel]; c.z = +e.target.value;
    const el = $(`#story .cell[data-cell="${S.story.sel}"]`); if (el) fitCellImg(el, c);
    save();
  }
  if (e.target.id === 'bg-custom') { S.story.bg = e.target.value; renderStory(); renderLayouts(); save(); }
});

/* 이미지 불러오기 (큰 사진은 줄여서 저장) */
function readImage(file, maxSide = 1800) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = rej;
    fr.onload = () => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const sc = Math.min(1, maxSide / Math.max(img.width, img.height));
        const keepAlpha = /png|webp|gif/.test(file.type);
        if (sc === 1 && file.size < 1.5e6) return res(fr.result);
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        res(cv.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', .9));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
document.addEventListener('change', async e => {
  const el = e.target;
  if (el.type !== 'file' || !el.files.length) return;
  try {
    if (el.dataset.img) {
      setPath(S, el.dataset.img, await readImage(el.files[0], el.dataset.img.endsWith('avatar') ? 600 : 1800));
    } else if (el.dataset.imgs) {
      const arr = getPath(S, el.dataset.imgs);
      for (const f of el.files) arr.push(await readImage(f));
      if (el.dataset.imgs === 'post.photos') { S.post.index = S.post.photos.length - el.files.length; ensureCrops(S.post); }
    } else if (el.id === 'add-image') {
      const k = newSticker('image', { img: await readImage(el.files[0], 1200) });
      S.story.stickers.push(k); S.story.selSticker = k.id;
    } else if (el.id === 'cell-file') {
      const c = cellsArr()[S.story.sel];
      Object.assign(c, { src: await readImage(el.files[0]), fx: .5, fy: .5, z: 1 });
    }
  } catch { toast('이미지를 불러오지 못했어요.'); }
  el.value = '';
  renderAll();
  save();
});
let cellInput = null;
function pickCellImage(i) {
  S.story.sel = i;
  if (!cellInput) {
    cellInput = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*', id: 'cell-file', hidden: true });
    document.body.appendChild(cellInput);
  }
  cellInput.click();
}

/* 클릭 처리 */
document.addEventListener('click', e => {
  const t = e.target.closest('button, [data-thumb]');
  if (!t) return;
  const d = t.dataset;
  if (d.tab) { S.ui.tab = d.tab; renderAll(); save(); return; }
  if (d.pickPost != null) { S.ui.postIdx = +d.pickPost; renderAll(); save(); return; }
  if (d.pickStory != null) { S.ui.storyIdx = +d.pickStory; renderAll(); save(); return; }
  if (d.mvPost != null || d.mvStory != null) {
    const isPost = d.mvPost != null, arr = isPost ? S.posts : S.stories, key = isPost ? 'postIdx' : 'storyIdx';
    const i = S.ui[key], j = i + +(isPost ? d.mvPost : d.mvStory);
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; S.ui[key] = j;
    if (!isPost) S.account.highlights.forEach(h => { if (h.story === i) h.story = j; else if (h.story === j) h.story = i; });
    renderAll(); save(); return;
  }
  if (d.newPost != null) { S.posts.push(newPost()); S.ui.postIdx = S.posts.length - 1; renderAll(); save(); return; }
  if (d.newStory != null) { S.stories.push(newStory()); S.ui.storyIdx = S.stories.length - 1; renderAll(); save(); return; }
  if (d.dupPost != null) { S.posts.splice(S.ui.postIdx + 1, 0, clone(S.post)); S.ui.postIdx++; renderAll(); save(); toast('게시물을 복제했어요.'); return; }
  if (d.dupStory != null) { S.stories.splice(S.ui.storyIdx + 1, 0, clone(S.story)); S.ui.storyIdx++; S.account.highlights.forEach(h => { if (h.story > S.ui.storyIdx - 1) h.story++; }); renderAll(); save(); toast('스토리를 복제했어요.'); return; }
  if (d.delPost != null) {
    if (!armed(t, '한 번 더 누르면 삭제')) return;
    S.posts.splice(S.ui.postIdx, 1); S.ui.postIdx = clamp(S.ui.postIdx, 0, S.posts.length - 1); renderAll(); save(); return;
  }
  if (d.delStory != null) {
    if (!armed(t, '한 번 더 누르면 삭제')) return;
    const gone = S.ui.storyIdx;
    S.stories.splice(gone, 1); S.ui.storyIdx = clamp(gone, 0, S.stories.length - 1);
    S.account.highlights.forEach(h => { if (h.story === gone) h.story = -1; else if (h.story > gone) h.story--; });
    renderAll(); save(); return;
  }
  if (d.closeModal != null) { t.closest('.modal').hidden = true; return; }
  if (d.themeSet) { S.ui.theme = d.themeSet; renderAll(); save(); return; }
  if (d.thumb === 'post.photos') { S.post.index = +d.i; renderAll(); save(); return; }
  if (d.del) { const arr = getPath(S, d.del); if (d.del === 'post.photos') { ensureCrops(S.post).splice(+d.i, 1); if (+d.i === 0) S.post.thumb = null; } arr.splice(+d.i, 1); if (d.del === 'post.photos') S.post.index = clamp(S.post.index, 0, Math.max(0, arr.length - 1)); renderAll(); save(); return; }
  if (d.mv) { const arr = getPath(S, d.mv), i = +d.i, j = i + +d.d; if (j >= 0 && j < arr.length) { if (d.mv === 'post.photos') { const cr = ensureCrops(S.post); [cr[i], cr[j]] = [cr[j], cr[i]]; if (i === 0 || j === 0) S.post.thumb = null; } [arr[i], arr[j]] = [arr[j], arr[i]]; if (d.mv === 'post.photos') S.post.index = j; } renderAll(); save(); return; }
  if (d.cmDel != null) { S.comments.items.splice(+d.cmDel, 1); renderAll(); save(); return; }
  if (d.cmMv != null) { const a = S.comments.items, i = +d.cmMv, j = i + +d.d; if (j >= 0 && j < a.length) [a[i], a[j]] = [a[j], a[i]]; renderAll(); save(); return; }
  if (t.id === 'cm-add') { S.comments.items.push({ id: uid(), avatar: null, username: 'zzunsiki_' + (S.comments.items.length + 1), verified: false, time: '방금', text: '댓글 내용', likes: '', liked: false, author: false, pinned: false, authorLiked: false, reply: false, more: 0 }); renderAll(); save(); return; }
  if (t.id === 'hl-add') { S.account.highlights.push({ id: uid(), title: '새 하이라이트', img: null }); renderAll(); save(); return; }
  if (d.hlDel != null) { S.account.highlights.splice(+d.hlDel, 1); renderAll(); save(); return; }
  if (d.layout) { S.story.layout = d.layout; S.story.sel = 0; renderAll(); save(); return; }
  if (d.bg) { S.story.bg = d.bg; renderAll(); save(); return; }
  if (d.selCell != null) { S.story.sel = +d.selCell; renderAll(); return; }
  if (d.pickCell != null) { pickCellImage(S.story.sel); return; }
  if (d.clearCell != null) { Object.assign(cellsArr()[S.story.sel], { src: null, fx: .5, fy: .5, z: 1 }); renderAll(); save(); return; }
  if (d.add) { const k = newSticker(d.add); S.story.stickers.push(k); S.story.selSticker = k.id; renderAll(); save(); return; }
  if (d.kset) {
    const k = S.story.stickers.find(x => x.id === S.story.selSticker);
    if (k) { k[d.kset] = d.v; renderStory(); renderStickerEditor(); save(); }
    return;
  }
  if (d.kAct) {
    const s = S.story, i = s.stickers.findIndex(x => x.id === s.selSticker); if (i < 0) return;
    const [k] = d.kAct === 'del' || d.kAct === 'front' || d.kAct === 'back' ? s.stickers.splice(i, 1) : [s.stickers[i]];
    if (d.kAct === 'front') s.stickers.push(k);
    if (d.kAct === 'back') s.stickers.unshift(k);
    if (d.kAct === 'del') s.selSticker = null;
    if (d.kAct === 'dup') { const c = Object.assign(clone(k), { id: uid(), x: k.x + 4, y: k.y + 4 }); s.stickers.push(c); s.selSticker = c.id; }
    if (d.kAct === 'center') { k.x = 50; k.y = 50; }
    renderAll(); save(); return;
  }
  if (d.cropReset) { const c = cropTarget(d.cropReset); if (c) { Object.assign(c, CROP0()); renderAll(); save(); } return; }
  if (d.link) { openLink(d.link); return; }
  if (t.id === 'link-ok') { applyLink(); return; }
  if (t.id === 'export-btn') { exportCurrent(); return; }
  if (t.id === 'html-one' || t.id === 'html-all') { openHtmlNotice(t.id === 'html-all'); return; }
  if (t.id === 'html-go') { $('#html-modal').hidden = true; exportHTML(htmlAll); return; }
  if (t.id === 'slots-btn') { openSlots(); return; }
  if (t.id === 'slot-save') { saveSlot(); return; }
  if (d.slotLoad) { if (armed(t, '덮어쓰고 불러오기')) loadSlot(d.slotLoad); return; }
  if (d.slotDel) { if (armed(t, '한 번 더 누르면 삭제')) delSlot(d.slotDel); return; }
  if (t.id === 'clock-now') { const d = new Date(); S.ui.clock = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; syncForm(); renderPreview(); save(); return; }
  if (t.id === 'reset-all-btn') {
    if (!armed(t, '한 번 더 누르면 전부 초기화')) return;
    const theme = S.ui.theme;
    S = hydrate(null); S.ui.theme = theme;
    renderAll(); save(); scrollTo({ top: 0 });
    toast('모든 내용을 처음 상태로 되돌렸어요. 임시저장해 둔 작업은 그대로 있어요.');
    return;
  }
  if (t.id === 'reset-btn') {
    if (!armed(t, '한 번 더 누르면 초기화')) return;
    const tab = S.ui.tab;
    if (tab === 'post') S.post = newPost();
    else if (tab === 'comments') S.comments = newComments();
    else if (tab === 'story') S.story = newStory();
    else S.account = newAccount();
    renderAll(); save(); return;
  }
});
$$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.hidden = true; }));
// 실수로 누르지 않게 두 번 눌러야 실행되는 버튼
function armed(btn, label) {
  if (btn.dataset.armed) return true;
  btn.dataset.armed = btn.textContent; btn.textContent = label;
  setTimeout(() => { if (btn.dataset.armed) { btn.textContent = btn.dataset.armed; delete btn.dataset.armed; } }, 3000);
  return false;
}
// 프로필 미리보기: 썸네일 → 게시물, 하이라이트 → 스토리
$('#pv-account').addEventListener('click', e => {
  const g = e.target.closest('[data-go-post], [data-go-story]');
  if (!g) return;
  if (g.dataset.goPost != null) { S.ui.postIdx = +g.dataset.goPost; S.ui.tab = 'post'; }
  else { S.ui.storyIdx = +g.dataset.goStory; S.ui.tab = 'story'; }
  renderAll(); save(); scrollTo({ top: 0, behavior: 'smooth' });
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Delete' || e.key === 'Backspace') && S.ui.tab === 'story' && S.story.selSticker && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
    S.story.stickers = S.story.stickers.filter(k => k.id !== S.story.selSticker);
    S.story.selSticker = null; renderAll(); save();
  }
});

/* 스토리 포인터 이벤트 */
const pvStory = $('#pv-story');
pvStory.addEventListener('pointerdown', onStoryDown);
pvStory.addEventListener('pointermove', onStoryMove);
pvStory.addEventListener('pointerup', onStoryUp);
pvStory.addEventListener('pointercancel', onStoryUp);
pvStory.addEventListener('wheel', onStoryWheel, { passive: false });
addEventListener('resize', () => { if (S.ui.tab === 'story') layoutCells(); });

/* ───────── 렌더 ───────── */
function renderPreview() {
  const t = S.ui.tab;
  if (t === 'post') renderPost();
  else if (t === 'comments') renderComments();
  else if (t === 'story') renderStory();
  else renderAccount();
  $('#profile-avatar-img').src = avatarOf(S.profile.avatar);
}
function renderAll() {
  const t = S.ui.tab;
  $$('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  $$('[data-theme-set]').forEach(b => b.classList.toggle('on', b.dataset.themeSet === S.ui.theme));
  $('#theme-seg').style.visibility = t === 'story' ? 'hidden' : '';
  $$('[data-pane]').forEach(el => { el.hidden = el.dataset.pane !== t; });
  $('#hero-t').textContent = { post: 'Post', comments: 'Comments', story: 'Story', account: 'Profile' }[t];
  renderLists();
  if (t === 'post') renderPostEditor();
  if (t === 'comments') renderCommentEditor();
  if (t === 'story') { renderLayouts(); renderCellEditor(); renderStickerEditor(); }
  if (t === 'account') { renderHlEditor(); renderGridEditor(); }
  renderPreview();
  syncForm();
}

/* ───────── 이미지 저장 ───────── */
const WEBFONTS = {
  'Noto Sans KR': 'Noto+Sans+KR:wght@400;500;600;700',
  'Do Hyeon': 'Do+Hyeon',
  'Black Han Sans': 'Black+Han+Sans',
  'Nanum Pen Script': 'Nanum+Pen+Script',
  'Nanum Gothic Coding': 'Nanum+Gothic+Coding:wght@400;700',
  'Nanum Myeongjo': 'Nanum+Myeongjo:wght@700;800',
};
const blobToDataURL = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
// 화면에 쓰인 글자만 담은 작은 웹폰트를 받아 이미지에 넣는다 (한글 폰트 전체를 받지 않도록)
async function buildFontCSS(node) {
  const used = new Set(['Noto Sans KR']);
  [node, ...node.querySelectorAll('*')].forEach(el => {
    const ff = getComputedStyle(el).fontFamily;
    for (const k of Object.keys(WEBFONTS)) if (ff.includes(k)) used.add(k);
  });
  const chars = [...new Set((node.textContent + '0123456789').replace(/\s/g, ''))].slice(0, 1200).join('');
  const parts = await Promise.all([...used].map(async fam => {
    try {
      let css = await (await fetch(`https://fonts.googleapis.com/css2?family=${WEBFONTS[fam]}&text=${encodeURIComponent(chars)}&display=block`)).text();
      for (const u of [...new Set(css.match(/url\([^)]+\)/g) || [])]) {
        const data = await blobToDataURL(await (await fetch(u.slice(4, -1).replace(/["']/g, ''))).blob());
        css = css.split(u).join(`url(${data})`);
      }
      return css;
    } catch { return ''; }
  }));
  return parts.join('\n');
}
let exporting = false;
async function exportCurrent() {
  if (exporting) return;
  const node = $(`#pv-${S.ui.tab} .shot`);
  if (!node) return;
  exporting = true;
  const btn = $('#export-btn'); const label = btn.textContent; btn.textContent = '만드는 중…'; btn.disabled = true;
  document.body.classList.add('exporting');
  try {
    await document.fonts.ready;
    const fontEmbedCSS = await buildFontCSS(node);
    const ratio = S.ui.tab === 'story' ? 1080 / node.offsetWidth : 3;
    const opts = { pixelRatio: ratio, fontEmbedCSS, cacheBust: false, backgroundColor: S.ui.tab === 'story' ? '#000' : undefined };
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) await htmlToImage.toPng(node, opts); // 사파리 첫 렌더 이미지 누락 방지
    const url = await htmlToImage.toPng(node, opts);
    if ([...node.querySelectorAll('img')].some(im => /^https?:/.test(im.getAttribute('src') || ''))) setTimeout(() => toast('링크로 넣은 사진은 사이트에 따라 PNG에 안 나올 수 있어요. 안 나오면 그 사진만 파일로 올려 주세요.'), 400);
    const name = `instagram-${S.ui.tab}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.png`;
    $('#modal-img').src = url;
    const dl = $('#modal-dl'); dl.href = url; dl.download = name;
    $('#modal').hidden = false;
  } catch (err) {
    console.error(err);
    toast('이미지를 만들지 못했어요. 다시 시도해 주세요.');
  } finally {
    document.body.classList.remove('exporting');
    btn.textContent = label; btn.disabled = false; exporting = false;
  }
}

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}

/* ───────── 링크로 사진 넣기 ───────── */
let linkTarget = null;
// 공유 링크를 이미지 주소로 바꾼다 (구글 드라이브, 드롭박스)
function normalizeImageURL(u) {
  u = u.trim();
  let m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{10,})/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w2000`;
  if (/dropbox\.com\//.test(u)) { try { const x = new URL(u); x.searchParams.delete('dl'); x.searchParams.set('raw', '1'); return x.toString(); } catch { return u; } }
  return u;
}
function probeImage(url) {
  return new Promise(res => {
    const img = new Image(); let done = false;
    const end = ok => { if (!done) { done = true; res(ok); } };
    img.onload = () => end(img.naturalWidth > 0);
    img.onerror = () => end(false);
    setTimeout(() => end(false), 12000);
    img.src = url;
  });
}
function openLink(target) {
  linkTarget = target;
  const multi = target.startsWith('imgs:');
  $('#link-title').textContent = multi ? '링크로 사진 추가 (여러 장)' : '링크로 사진 넣기';
  $('#link-url').placeholder = multi ? 'https://...\nhttps://...  (한 줄에 하나씩)' : 'https://...';
  $('#link-url').rows = multi ? 4 : 2;
  $('#link-url').value = '';
  $('#link-err').hidden = true;
  $('#link-modal').hidden = false;
  setTimeout(() => $('#link-url').focus(), 50);
}
async function applyLink() {
  const btn = $('#link-ok'), err = $('#link-err');
  const multi = linkTarget.startsWith('imgs:');
  let urls = $('#link-url').value.split(/\s+/).filter(Boolean).map(normalizeImageURL);
  if (!multi) urls = urls.slice(0, 1);
  const bad = urls.filter(u => !/^https?:\/\//i.test(u));
  if (!urls.length || bad.length) { err.textContent = 'https:// 로 시작하는 이미지 주소를 넣어 주세요.'; err.hidden = false; return; }
  btn.disabled = true; const label = btn.textContent; btn.textContent = '확인 중…'; err.hidden = true;
  const ok = await Promise.all(urls.map(probeImage));
  btn.disabled = false; btn.textContent = label;
  const failed = urls.filter((_, i) => !ok[i]);
  if (failed.length) {
    err.textContent = `사진을 불러오지 못한 링크가 있어요${urls.length > 1 ? ` (${failed.length}개)` : ''}. 웹페이지 주소가 아니라 사진을 길게 누르거나 오른쪽 클릭해서 "이미지 주소 복사"한 링크인지, 공개된 사진인지 확인해 주세요.`;
    err.hidden = false; return;
  }
  const [kind, path] = linkTarget.split(/:(.*)/s);
  if (kind === 'img') setPath(S, path, urls[0]);
  else if (kind === 'imgs') {
    const arr = getPath(S, path); arr.push(...urls);
    if (path === 'post.photos') { S.post.index = arr.length - urls.length; ensureCrops(S.post); }
  } else if (kind === 'cell') Object.assign(cellsArr()[S.story.sel], { src: urls[0], fx: .5, fy: .5, z: 1 });
  else if (kind === 'sticker') { const k = newSticker('image', { img: urls[0] }); S.story.stickers.push(k); S.story.selSticker = k.id; }
  $('#link-modal').hidden = true;
  renderAll(); save();
  toast(urls.length > 1 ? `사진 ${urls.length}장을 링크로 넣었어요.` : '링크로 사진을 넣었어요.');
}

/* ───────── HTML 파일로 저장 ───────── */
let htmlAll = false;
// 파일로 올린 사진(파일 안에 통째로 들어가는 사진) 개수
function countEmbedded() {
  let n = 0;
  JSON.stringify(S, (k, v) => { if (typeof v === 'string' && v.startsWith('data:image') && !v.startsWith('data:image/svg')) n++; return v; });
  return n;
}
function openHtmlNotice(everything) {
  htmlAll = everything;
  const n = countEmbedded();
  $('#html-embedded').textContent = n ? `지금 파일로 올린 사진이 ${n}장 있어요. 이 사진들은 HTML 파일 안에 그대로 들어가서 파일이 커져요.` : '';
  $('#html-embedded').hidden = !n;
  $('#html-modal').hidden = false;
}

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Do+Hyeon&family=Black+Han+Sans&family=Nanum+Pen+Script&family=Nanum+Gothic+Coding:wght@400;700&family=Nanum+Myeongjo:wght@700;800&display=swap';
const VIEWER_CSS = `
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; min-height: 100vh; min-height: 100dvh; display: flex; justify-content: center; background: #fff; }
body.v-dark { background: #000; }
body.v-lock { overflow: hidden; }
.v-scr { width: 100%; max-width: 470px; }
.v-scr[hidden], .v-ov[hidden] { display: none; }
.v-scr > .ig { width: 100%; max-width: none; overflow: visible; }
.ig.phone { height: 100vh; height: 100dvh; }
.v-top { position: sticky; top: 0; z-index: 3; display: flex; align-items: center; justify-content: space-between; height: 44px; padding: 0 10px; background: var(--ig-bg); }
.v-top button { border: 0; background: none; padding: 0; color: inherit; display: flex; cursor: pointer; }
.v-tt { text-align: center; line-height: 1.2; }
.v-tt small { display: block; font-size: 12px; color: var(--ig-sec); text-transform: uppercase; }
.v-tt b { font-size: 16px; font-weight: 700; }
.a-nav { position: sticky; bottom: 0; }
[data-go], [data-open], [data-story], [data-car], [data-close] { cursor: pointer; }
.v-ov { position: fixed; inset: 0; z-index: 20; }
.v-dim { position: absolute; inset: 0; background: rgba(0,0,0,.5); }
.v-sheet { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 100%; max-width: 470px; height: 78%; display: flex; background: none; }
.v-sheet .sheet { width: 100%; }
.v-sheet .s-list { overflow-y: auto; }
.v-st { background: #000; display: flex; align-items: center; justify-content: center; }
.v-st .story { width: min(100vw, 56.25vh); width: min(100vw, 56.25dvh); max-width: none; border-radius: 0; touch-action: auto; }
.v-st .k { cursor: default; }
.v-x { pointer-events: auto; display: flex; cursor: pointer; }
.cm-plain .sheet { min-height: 100vh; min-height: 100dvh; }
`;
const VIEWER_JS = `(function () {
  var all = function (q) { return Array.prototype.slice.call(document.querySelectorAll(q)); };
  var timer = null;
  function show(id) { var el = document.getElementById(id); if (!el) return; all('.v-scr').forEach(function (x) { x.hidden = x !== el; }); window.scrollTo(0, 0); }
  function closeAll() { all('.v-ov[data-closable]').forEach(function (o) { o.hidden = true; }); document.body.classList.remove('v-lock'); clearTimeout(timer); }
  function open(id) { var el = document.getElementById(id); if (!el) return null; el.hidden = false; document.body.classList.add('v-lock'); return el; }
  function play(el) {
    var b = el.querySelector('.s-bars b[data-cur]'); if (!b) return;
    b.style.transition = 'none'; b.style.width = '0%'; void b.offsetWidth;
    b.style.transition = 'width 5s linear'; b.style.width = '100%';
    clearTimeout(timer); timer = setTimeout(closeAll, 5000);
  }
  function slide(m, x) {
    var imgs = m.querySelectorAll('img[data-ph]'), n = imgs.length, cur = 0;
    for (var i = 0; i < n; i++) if (!imgs[i].hidden) cur = i;
    var r = m.getBoundingClientRect(), nx = Math.max(0, Math.min(n - 1, cur + (x > r.left + r.width / 2 ? 1 : -1)));
    for (var j = 0; j < n; j++) imgs[j].hidden = j !== nx;
    var c = m.querySelector('.p-count'); if (c) c.textContent = (nx + 1) + '/' + n;
    var post = m.closest('.post'), dots = post ? post.querySelectorAll('.p-dots i') : [];
    for (var k = 0; k < dots.length; k++) dots[k].className = k === Math.min(nx, dots.length - 1) ? 'on' : '';
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-car],[data-close],[data-back],[data-go],[data-open],[data-story]'); if (!t) return;
    if (t.hasAttribute('data-car')) slide(t, e.clientX);
    else if (t.hasAttribute('data-close')) closeAll();
    else if (t.hasAttribute('data-back')) show('s-home');
    else if (t.getAttribute('data-go')) show(t.getAttribute('data-go'));
    else if (t.getAttribute('data-open')) open('ov-c-' + t.getAttribute('data-open'));
    else if (t.getAttribute('data-story')) { var el = open('ov-s-' + t.getAttribute('data-story')); if (el && el.hasAttribute('data-auto')) play(el); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
})();`;
let igCSSCache = null;
async function igCSS() {
  if (!igCSSCache) {
    const t = await (await fetch('style.css', { cache: 'no-cache' })).text();
    igCSSCache = t.slice(t.indexOf('/* ───────── 인스타그램 UI'));
  }
  return igCSSCache;
}
const igWrap = (inner, cls = '') => `<div style="${fsStyle()}" class="ig ${cls}" data-theme="${S.ui.theme}">${inner}</div>`;
function postScreen(i, withBack, hidden) {
  const top = withBack ? `<div class="v-top"><button data-back aria-label="뒤로">${I.back()}</button><div class="v-tt"><small>${esc(S.profile.username)}</small><b>게시물</b></div><span style="width:26px"></span></div>` : '';
  return `<section class="v-scr" id="s-post-${i}"${hidden ? ' hidden' : ''}>${igWrap(statusBar() + top + postHTML(S.posts[i], { viewer: true, cid: i }))}</section>`;
}
function commentsOverlay(i, opened) {
  return `<div class="v-ov" id="ov-c-${i}" data-closable${opened ? '' : ' hidden'}><div class="v-dim" data-close></div>${igWrap(sheetHTML(S.posts[i].comments, { viewer: true }), 'v-sheet')}</div>`;
}
// 스토리 사진 칸 위치는 실제로 그려 봐야 계산되므로 화면 밖에서 한 번 그린다
async function storyMarkup(st, o) {
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:-10000px;top:0;width:360px';
  box.innerHTML = storyHTML(st, Object.assign({ viewer: true }, o));
  document.body.appendChild(box);
  const imgs = [...box.querySelectorAll('.cell img')];
  await Promise.all(imgs.map(im => (im.complete ? Promise.resolve() : new Promise(r => { im.onload = im.onerror = r; }))));
  const cells = cellsOf(st);
  box.querySelectorAll('.cell').forEach((el, i) => fitCellImg(el, cells[i]));
  await new Promise(r => setTimeout(r, 0));
  const html = box.innerHTML;
  box.remove();
  return html;
}
async function storyOverlay(i, { opened = false, auto = false, closable = true } = {}) {
  return `<div class="v-ov v-st" id="ov-s-${i}"${closable ? ' data-closable' : ''}${auto ? ' data-auto' : ''}${opened ? '' : ' hidden'}>${await storyMarkup(S.stories[i], { noClose: !closable })}</div>`;
}
function htmlDoc(title, body, css) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_URL}">
<style>
${css}
${VIEWER_CSS}
</style>
</head>
<body class="v-${S.ui.theme}">
${body}
<script>
${VIEWER_JS}
<\/script>
</body>
</html>
`;
}
function downloadText(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/html;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
const fileSafe = t => String(t || 'instagram').replace(/[\\/:*?"<>|\s]+/g, '_');
async function exportHTML(everything) {
  const btn = everything ? $('#html-all') : $('#html-one');
  const label = btn.textContent; btn.textContent = '만드는 중…'; btn.disabled = true;
  try {
    const css = await igCSS();
    const u = S.profile.username, tab = S.ui.tab;
    let body, name, title;
    if (everything) {
      const parts = [`<section class="v-scr" id="s-home">${accountHTML({ viewer: true })}</section>`];
      S.posts.forEach((_, i) => { parts.push(postScreen(i, true, true)); parts.push(commentsOverlay(i, false)); });
      for (let i = 0; i < S.stories.length; i++) parts.push(await storyOverlay(i, { auto: true }));
      body = parts.join('\n'); name = `${fileSafe(u)}-instagram.html`; title = `${u} • Instagram`;
    } else if (tab === 'post') {
      body = postScreen(S.ui.postIdx, false, false) + commentsOverlay(S.ui.postIdx, false);
      name = `${fileSafe(u)}-post-${S.ui.postIdx + 1}.html`; title = `${u} 게시물`;
    } else if (tab === 'comments') {
      body = S.comments.backdrop
        ? postScreen(S.ui.postIdx, false, false) + commentsOverlay(S.ui.postIdx, true)
        : `<section class="v-scr">${igWrap(sheetHTML(S.comments, { viewer: true }), 'cm-plain')}</section>`;
      name = `${fileSafe(u)}-comments-${S.ui.postIdx + 1}.html`; title = `${u} 댓글`;
    } else if (tab === 'story') {
      body = await storyOverlay(S.ui.storyIdx, { opened: true, closable: false });
      name = `${fileSafe(u)}-story-${S.ui.storyIdx + 1}.html`; title = `${u} 스토리`;
    } else {
      body = `<section class="v-scr" id="s-home">${accountHTML({ viewer: true })}</section>`;
      name = `${fileSafe(u)}-profile.html`; title = `${u} • Instagram`;
    }
    downloadText(name, htmlDoc(title, body, css));
    toast(`${name} 파일을 저장했어요.`);
  } catch (err) {
    console.error(err);
    toast('HTML 파일을 만들지 못했어요. 다시 시도해 주세요.');
  } finally {
    btn.textContent = label; btn.disabled = false;
  }
}

/* ───────── 임시저장 (이 브라우저에만) ───────── */
const two = n => String(n).padStart(2, '0');
const fmtTime = ts => { const d = new Date(ts); return `${d.getFullYear()}.${two(d.getMonth() + 1)}.${two(d.getDate())} ${two(d.getHours())}:${two(d.getMinutes())}`; };
function firstImage(st) {
  for (const p of st.posts || []) if (p.photos && p.photos[0]) return p.photos[0];
  for (const x of st.stories || []) for (const c of x.cells || []) if (c && c.src) return c.src;
  return (st.profile && st.profile.avatar) || null;
}
function makeThumb(src) {
  return new Promise(res => {
    if (!src) return res(null);
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 96;
      const sc = Math.max(96 / img.width, 96 / img.height), w = img.width * sc, h = img.height * sc;
      try {
        cv.getContext('2d').drawImage(img, (96 - w) / 2, (96 - h) / 2, w, h);
        res(cv.toDataURL('image/jpeg', .8));
      } catch { res(/^https?:/.test(src) ? src : null); } // 다른 사이트 사진은 주소 그대로
    };
    img.onerror = () => res(null);
    img.src = src;
  });
}
async function renderSlots() {
  const list = $('#slot-list');
  let slots = [];
  try { slots = (await DB.slots()).sort((a, b) => b.time - a.time); } catch { list.innerHTML = '<p class="muted">이 브라우저에서는 임시저장을 쓸 수 없어요. (개인정보 보호 모드인지 확인해 주세요)</p>'; return; }
  list.innerHTML = slots.length ? slots.map(x => `
    <div class="slot">
      ${x.thumb ? `<img src="${x.thumb}" alt="">` : '<span class="slot-ph"></span>'}
      <div class="grow"><b>${esc(x.name)}</b><small>${fmtTime(x.time)} · 게시물 ${x.posts} · 스토리 ${x.stories}</small></div>
      <button class="btn" data-slot-load="${x.id}">불러오기</button>
      <button class="btn danger" data-slot-del="${x.id}">삭제</button>
    </div>`).join('') : '<p class="muted">아직 저장한 작업이 없어요.</p>';
}
function openSlots() {
  const d = new Date();
  $('#slot-name').value = `${S.profile.username} ${d.getMonth() + 1}/${d.getDate()} ${two(d.getHours())}:${two(d.getMinutes())}`;
  $('#slots-modal').hidden = false;
  renderSlots();
}
async function saveSlot() {
  const name = $('#slot-name').value.trim() || '이름 없는 저장';
  try {
    await DB.putSlot({ id: uid(), name, time: Date.now(), data: JSON.stringify(S), thumb: await makeThumb(firstImage(S)), posts: S.posts.length, stories: S.stories.length });
    toast(`"${name}"(으)로 저장했어요.`);
    renderSlots();
  } catch (err) {
    console.error(err);
    toast('저장하지 못했어요. 브라우저 저장 공간이 부족할 수 있어요.');
  }
}
async function loadSlot(id) {
  try {
    const x = await DB.getSlot(id);
    if (!x) return;
    S = hydrate(JSON.parse(x.data));
    renderAll(); save();
    $('#slots-modal').hidden = true;
    toast(`"${x.name}"을(를) 불러왔어요.`);
  } catch (err) { console.error(err); toast('불러오지 못했어요.'); }
}
async function delSlot(id) {
  try { await DB.delSlot(id); renderSlots(); } catch { toast('삭제하지 못했어요.'); }
}

renderAll();
loadSaved().then(saved => { if (saved) { S = hydrate(saved); renderAll(); } });
document.fonts && document.fonts.ready.then(() => { if (S.ui.tab === 'story') layoutCells(); });
