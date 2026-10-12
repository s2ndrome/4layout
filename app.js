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
function defaults() {
  return {
    ui: { tab: 'post', theme: 'light', status: true, clock: '9:41', sbIcons: true, battery: 100, fontScale: 1 },
    profile: { username: 'your.id', name: '이름', avatar: null, verified: false, ring: false },
    post: {
      photos: [], index: 0, ratio: '4/5', location: '', collab: '', follow: false,
      countStyle: 'inline', likes: '1,234', commentCount: '56', reposts: '8', shares: '21', likedBy: '',
      liked: false, saved: false, showRepost: true,
      caption: '오늘의 기록 📷\n#일상 #daily', collapse: false, time: '3시간 전',
    },
    comments: {
      backdrop: true, height: 'half',
      items: [
        { id: uid(), avatar: null, username: 'zzunsiki_1', verified: false, time: '2시간', text: '신드롬을 사랑하자', likes: '12', liked: true, author: false, pinned: false, authorLiked: true, reply: false, more: 0 },
        { id: uid(), avatar: null, username: '', verified: false, time: '1시간', text: '@zzunsiki_1 고마워 ❤️', likes: '3', liked: false, author: true, pinned: false, authorLiked: false, reply: true, more: 0 },
        { id: uid(), avatar: null, username: 'zzunsiki_2', verified: false, time: '45분', text: '성유진을 아껴주자', likes: '', liked: false, author: false, pinned: false, authorLiked: false, reply: false, more: 2 },
      ],
    },
    story: {
      layout: '4', cells: [], sel: 0, gap: 0.5, gapColor: '#ffffff',
      bg: 'linear-gradient(160deg,#833ab4,#fd1d1d 55%,#fcb045)',
      stickers: [], selSticker: null,
      showTop: true, count: 3, current: 1, progress: 40, time: '3시간', bottom: 'reply',
    },
    account: {
      own: true, private: false, nav: true, showHL: true,
      posts: '24', followers: '1,234', following: '321', category: '', bio: '좋아하는 것들을 기록해요 ✨', link: '', mutual: '',
      highlights: [{ id: uid(), title: '일상', img: null }, { id: uid(), title: '여행', img: null }],
      grid: [], placeholders: 9,
    },
  };
}
let S = load();
function load() {
  const d = defaults();
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { /* 저장소 사용 불가 */ }
  if (!saved) return d;
  for (const k of Object.keys(d)) if (saved[k] && typeof saved[k] === 'object') d[k] = Object.assign(d[k], saved[k]);
  if (d.story.showUI === false) { d.story.showTop = false; d.story.bottom = 'none'; }
  delete d.story.showUI;
  return d;
}
let saveTimer = null, warnedQuota = false;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); return; } catch { /* 용량 초과 */ }
    try {
      const lite = JSON.parse(JSON.stringify(S, (k, v) => (typeof v === 'string' && v.startsWith('data:image') ? null : v)));
      localStorage.setItem(KEY, JSON.stringify(lite));
      if (!warnedQuota) { warnedQuota = true; toast('사진 용량이 커서 사진은 브라우저에 저장되지 않아요. (글자는 저장됨)'); }
    } catch { /* 무시 */ }
  }, 300);
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
function postHTML() {
  const p = S.post, pr = S.profile;
  const photos = p.photos.length ? p.photos : [null];
  const idx = clamp(p.index, 0, photos.length - 1);
  const cur = photos[idx];
  const [rw, rh] = p.ratio.split('/').map(Number);
  const inline = p.countStyle === 'inline';
  const act = (icon, n) => `<span class="a">${icon}${inline && n ? `<span>${esc(n)}</span>` : ''}</span>`;
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
    <div class="p-media" style="aspect-ratio:${rw}/${rh}">
      ${cur ? `<img src="${cur}" alt="">` : `<div class="ph-empty">${I.photo()}<span>오른쪽에서 사진을 추가하세요</span></div>`}
      ${photos.length > 1 ? `<span class="p-count">${idx + 1}/${photos.length}</span>` : ''}
    </div>
    ${inline ? dots : ''}
    <div class="p-act">
      <div class="p-act-l">
        ${act(I.heart(p.liked), p.likes)}
        ${act(I.comment(), p.commentCount)}
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
      ${!inline && p.commentCount ? `<div class="sec">댓글 ${esc(p.commentCount)}개 모두 보기</div>` : ''}
      ${p.time ? `<div class="p-time sec">${esc(p.time)}</div>` : ''}
    </div>
  </article>`;
}
function renderPost() {
  $('#pv-post').innerHTML = `<div style="${fsStyle()}" class="ig shot" data-theme="${S.ui.theme}">${statusBar()}${postHTML()}</div>`;
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
function renderComments() {
  const c = S.comments, pr = S.profile;
  const sheet = `
  <div class="sheet">
    <div class="grab"></div>
    <div class="s-title">댓글</div>
    <div class="s-list">${c.items.map(commentHTML).join('')}</div>
    <div class="s-foot">
      <div class="s-emo">${QUICK_EMOJI.map(e => `<span>${e}</span>`).join('')}</div>
      <div class="s-in">${avatarImg(pr.avatar)}<div class="s-ph"><span>${esc(pr.username)}님에게 댓글 추가...</span></div></div>
    </div>
  </div>`;
  const t = S.ui.theme;
  $('#pv-comments').innerHTML = c.backdrop
    ? `<div style="${fsStyle()}" class="ig shot phone" data-theme="${t}"><div class="phone-bg">${statusBar()}${postHTML()}</div><div class="dim"></div><div class="sheet-wrap ${c.height}">${sheet}</div></div>`
    : `<div style="${fsStyle()}" class="ig shot cm-plain" data-theme="${t}">${sheet}</div>`;
}

/* ───────── 프로필 ───────── */
function renderAccount() {
  const a = S.account, pr = S.profile;
  const own = a.own;
  const hls = a.highlights.map(h => `<div class="hl"><div class="hl-c">${h.img ? `<img src="${h.img}" alt="">` : '<div></div>'}</div><span>${esc(h.title)}</span></div>`).join('')
    + (own ? `<div class="hl"><div class="hl-c"><div class="hl-new">${I.plus(26)}</div></div><span>신규</span></div>` : '');
  const cells = a.grid.length ? a.grid.map(src => `<div><img src="${src}" alt=""></div>`).join('') : Array.from({ length: a.placeholders }, () => '<div></div>').join('');
  const btns = own
    ? '<div>프로필 편집</div><div>프로필 공유</div>'
    : '<div class="blue">팔로우</div><div>메시지</div>';
  const nav = a.nav ? `<div class="a-nav">${I.home()}${I.reels(26)}${I.share(26)}${I.search()}${avatarImg(pr.avatar)}</div>` : '';
  $('#pv-account').innerHTML = `
  <div style="${fsStyle()}" class="ig shot acct${a.nav ? ' phone' : ''}" data-theme="${S.ui.theme}">
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

function cellsArr() {
  const n = LAYOUTS[S.story.layout].n;
  while (S.story.cells.length < n) S.story.cells.push({ src: null, fx: .5, fy: .5, z: 1 });
  return S.story.cells.slice(0, n);
}
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

function renderStory() {
  const s = S.story, pr = S.profile, L = LAYOUTS[s.layout];
  const cells = cellsArr();
  const grid = `<div class="st-grid" style="grid-template-columns:${L.cols};grid-template-rows:${L.rows};gap:${s.gap}cqw;${s.gap ? `background:${s.gapColor}` : ''}">
    ${cells.map((c, i) => `<div class="cell${i === s.sel && L.n > 1 ? ' sel' : ''}" data-cell="${i}"${!c.src && s.gap ? ` style="background:${s.bg}"` : ''}>${c.src ? `<img src="${c.src}" alt="">` : `<div class="cell-empty">${I.plus(28)}<span>사진 추가</span></div>`}</div>`).join('')}
  </div>`;
  const stickers = s.stickers.map(k => `<div class="k${k.id === s.selSticker ? ' sel' : ''}" data-k-id="${k.id}" style="left:${k.x}%;top:${k.y}%;transform:${stickerTransform(k)}">${stickerInner(k)}</div>`).join('');

  let ui = '';
  {
    const n = clamp(+s.count || 1, 1, 12), cur = clamp(+s.current || 1, 1, n);
    const bars = Array.from({ length: n }, (_, i) => `<i><b style="width:${i + 1 < cur ? 100 : i + 1 === cur ? s.progress : 0}%"></b></i>`).join('');
    const top = S.ui.status ? 13.5 : 2.4;
    let bottom = '';
    if (s.bottom === 'reply') bottom = `<div class="s-shade-b"></div><div class="s-bottom"><div class="s-input">메시지 보내기</div>${I.heart(false)}${I.share()}</div>`;
    else if (s.bottom === 'own') bottom = `<div class="s-shade-b"></div><div class="s-own"><div class="s-viewers">${avatarImg(null)}${avatarImg(null)}${avatarImg(null)}</div><span class="lbl">활동</span><span class="sp"></span><span class="s-oi">${I.heartHL()}<span>하이라이트</span></span><span class="s-oi">${I.share()}<span>보내기</span></span><span class="s-oi">${I.more()}<span>더 보기</span></span></div>`;
    ui = `<div class="s-ui">
      ${S.ui.status || s.showTop ? '<div class="s-shade-t"></div>' : ''}
      ${S.ui.status ? `<div class="s-sb">${sbInner()}</div>` : ''}
      ${s.showTop ? `<div class="s-bars" style="top:${top}cqw">${bars}</div>
      <div class="s-head" style="top:${top + 2.6}cqw">${avatarImg(pr.avatar)}<b>${esc(pr.username)}</b>${pr.verified ? verified(13) : ''}<span class="tm">${esc(s.time)}</span><span class="sp"></span>${I.more()}${I.close()}</div>` : ''}
      ${bottom}
    </div>`;
  }
  const stage = $('#pv-story');
  stage.innerHTML = `<div class="story shot" id="story" style="background:${s.bg};${fsStyle()}">${grid}${stickers}${ui}</div>`;
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
function renderPostEditor() {
  $('#post-thumbs').innerHTML = thumbsHTML(S.post.photos, 'post.photos', S.post.index);
}
function renderGridEditor() {
  $('#grid-thumbs').innerHTML = thumbsHTML(S.account.grid, 'account.grid', -1);
}
function renderCommentEditor() {
  const items = S.comments.items;
  $('#cm-editor').innerHTML = items.map((m, i) => `
  <div class="item">
    <div class="item-head">
      ${m.author ? `<img src="${avatarOf(S.profile.avatar)}" alt="" title="작성자는 계정 정보의 사진을 사용해요">` : `<label title="프로필 사진 변경"><img src="${avatarOf(m.avatar)}" alt=""><input type="file" accept="image/*" data-img="comments.items.${i}.avatar"></label>`}
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
    <label title="커버 사진"><img src="${h.img || DEFAULT_AVATAR}" alt=""><input type="file" accept="image/*" data-img="account.highlights.${i}.img"></label>
    <div class="grow"><label class="f" style="margin:0"><input type="text" data-k="account.highlights.${i}.title"></label></div>
    <button data-hl-del="${i}" aria-label="삭제">✕</button>
  </div></div>`).join('');
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
        <label class="btn file">앨범 커버<input type="file" accept="image/*" data-img="${p}.img"></label>
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
    else if (v != null && document.activeElement !== el) el.value = v;
  });
}
const STRUCTURAL = /^comments\.items\.\d+\.author$/;
document.addEventListener('input', e => {
  const el = e.target, k = el.dataset.k;
  if (!k) return;
  let v = el.type === 'checkbox' ? el.checked : (el.type === 'range' || el.type === 'number') ? +el.value : el.value;
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
      if (el.dataset.imgs === 'post.photos') S.post.index = S.post.photos.length - el.files.length;
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
  if (d.themeSet) { S.ui.theme = d.themeSet; renderAll(); save(); return; }
  if (d.thumb === 'post.photos') { S.post.index = +d.i; renderAll(); save(); return; }
  if (d.del) { const arr = getPath(S, d.del); arr.splice(+d.i, 1); if (d.del === 'post.photos') S.post.index = clamp(S.post.index, 0, Math.max(0, arr.length - 1)); renderAll(); save(); return; }
  if (d.mv) { const arr = getPath(S, d.mv), i = +d.i, j = i + +d.d; if (j >= 0 && j < arr.length) { [arr[i], arr[j]] = [arr[j], arr[i]]; if (d.mv === 'post.photos') S.post.index = j; } renderAll(); save(); return; }
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
  if (t.id === 'export-btn') { exportCurrent(); return; }
  if (t.id === 'clock-now') { const d = new Date(); S.ui.clock = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; syncForm(); renderPreview(); save(); return; }
  if (t.id === 'reset-btn') {
    if (!confirm('현재 화면의 내용을 처음 상태로 되돌릴까요?')) return;
    const tab = S.ui.tab; S[tab] = defaults()[tab]; renderAll(); save(); return;
  }
  if (t.id === 'modal-close') { $('#modal').hidden = true; }
});
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') e.currentTarget.hidden = true; });
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

renderAll();
document.fonts && document.fonts.ready.then(() => { if (S.ui.tab === 'story') layoutCells(); });
