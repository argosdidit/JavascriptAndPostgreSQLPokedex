// index.js
const App = {
  flag: true,
  areaButtons: document.querySelector('.mode_buttons'),
  areaGreeting: document.querySelector('.greeting'),
  areaSentences: document.querySelector('.sentences'),

  makeButtons() {
    if (!this.flag) return this;
    this.areaButtons.innerHTML = `
      <button id="pcButton">PC表示</button>
      <button id="mobileButton">スマホ表示</button>
    `;
    const switchMode = (mode) => {
      const cur = document.body.classList.contains('pc-mode') ? 'pc' : 'mobile';
      if (mode === cur) return;
      document.body.classList.replace(`${cur}-mode`, `${mode}-mode`);
      this
        .makeGreeting()
        .makeSentences()
        .makeInfoTabs()
        .makeLink()
        .runAnimations();
    };
    document.getElementById('pcButton').addEventListener('click', () => switchMode('pc'));
    document.getElementById('mobileButton').addEventListener('click', () => switchMode('mobile'));
    return this;
  },

  makeGreeting() {
    if (this.flag) {
      this.areaGreeting.innerHTML = `<h1>～Welcome to My Page！～</h1>`;
    }
    return this;
  },

  makeSentences() {
    if (this.flag) {
      this.areaSentences.innerHTML = `
        <p>私の名前は竹下聖也と申します。</p>
        <p>2001年03月03日に生を受け、歳は24歳になります。</p>
        <p>人生を謳歌します。</p>
        <p>何卒宜しくお願い致します。</p>
      `;
    }
    return this;
  },

  makeInfoTabs() {
    const display = document.querySelector('.info-display');
    const btns = document.querySelectorAll('.info-tabs button');
    const info = {
      profile:
        `昨年の7月に体重3桁がカッコいいという衝動に駆られ、0.1tを
        目指しおりましたが断念しました。
        私の話し方が地元の中で癖が強かったらしく
        友人の母親より「かごんマぁ～」と
        呼ばれて以来大学在学中は、そのように呼ばれておりました。
        実は地元よりも長崎県の佐世保市が好きだったりします。`,
      school:
        `小学校         : 霧島市立日当山小学校
        中学校         : 霧島市立日当山小学校
        高校           : 鹿児島県立国分高等学校 理数科
        大学(専門学校) : 北海道情報大学
        (なお、北海道を訪れたことはありませんが)
        ---------------------------------------------------
        前職 : 日本システム株式会社 プログラマー
        ※なお、賞罰等はございません。`,
      like1:
        `幼少期からディズニーが好きでした。とはいっても
        アニメーションではなく、実写のコメディドラマです。
        派生して海外ドラマのGleeやFull House、ミュージカルでは
        Wickedなども好きだったりします。一時期はABCニュースや
        BBCニュースのライブ中継であったり法廷の裁判系などを
        Youtube等で閲覧しておりました。
        あとお話変わりますが、パズルとかも好きだったりします。`,
      like2:
        `就職してから気になるものを自力で作るようになりました。
        日本のアニメや漫画はあまりわからず、知っていても
        ちびまる子ちゃんやドラえもんくらいなのですが
        高校時代にポケットモンスターを知りつくす変人たちと出会い
        当時の現存していたほぼすべて個体を覚える機会が
        ありました。
        就職後ノウハウをつけて、自作でWebアプリを作ろうと思い、
        良い材料がないか模索していた中、ポケモンを思い出し、
        図鑑の作成をしていた時に、救われたなぁと思いました。
        ただ、アニメや漫画に関しては皆無です。`,
      life:
        ` 「笑いが一番の治療法」をモットーとしております。
        しかしながらここ近年、常に冗談が好きな人間でしたが
        年齢が上がるに反比例してつまらなくなっていると
        自分で感じる所存でございます。
        転職を機にどこかで大冒険ができたらと思います。
        (色んな意味で)`,
      dream:
        `ひとまず、中断している学習活動を再開させ、
        自己肯定感を養っていけるようになりたいです。
        また、だいぶ引っ込み思案で、見た目通り
        臆病気質な節がございますが己を貫ければと思います。
        人としての当たり前を毎日こなしていけるように努めます。`,
    };
    btns.forEach(b => {
      b.addEventListener('mouseenter', () => {
        display.innerHTML = info[b.dataset.key].replace(/\n/g,'<br>');
      });
      b.addEventListener('mouseleave', () => {
        display.textContent = "項目にマウスを合わせて説明を表示します。";
      });
    });
    return this;
  },

  makeLink() {
  if (!this.flag) return this;
  const viewMode = document.body.classList.contains('mobile-mode') ? 'mobile' : 'pc';
  const pages = [
    { type: 'puzzle', label: 'パズル関連' },
  ];
  const html = pages.map(p =>
    `<p><a href="link/link.html?type=${p.type}&mode=${viewMode}">${p.label}</a></p>`
  ).join('');
  document.querySelector('.linking').innerHTML = html;
  return this;
}
,

  runAnimations() {
    const cont = document.querySelector('.container');
    const g = document.querySelector('.greeting');
    const ss = document.querySelectorAll('.sentences p');
    const tabs = document.querySelector('.info-tabs');
    const disp = document.querySelector('.info-display');
    const mb = document.querySelector('.mode_buttons');
    const link = document.querySelector('.linking');

    cont.style.opacity = 0;
    [g, tabs, disp, mb, ...(link? [link]: [])].forEach(el => el.classList.remove('visible'));
    ss.forEach(p => p.classList.remove('visible'));

    setTimeout(() => { cont.style.opacity = 1; }, 100);
    g.classList.add('slide-fade-in-left');
    setTimeout(() => g.classList.add('visible'), 1100);

    ss.forEach((p,i) => {
      p.classList.add('fade-in');
      setTimeout(() => p.classList.add('visible'), 1600 + i*500);
    });

    [tabs, disp].forEach(el => el.classList.add('scale-fade-in'));
    setTimeout(() => {
      tabs.classList.add('visible');
      disp.classList.add('visible');
    }, 1600 + ss.length*500 + 500);

    if (link) {
      link.classList.add('scale-fade-in');
      setTimeout(() => link.classList.add('visible'), 1600 + ss.length*500 + 1000);
    }

    mb.classList.add('scale-fade-in');
    setTimeout(() => mb.classList.add('visible'), 1600 + ss.length*500 + 1200);

    return this;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const modeParam = params.get('mode');
  if (modeParam === 'pc' || modeParam === 'mobile') {
    document.body.classList.remove('pc-mode', 'mobile-mode');
    document.body.classList.add(`${modeParam}-mode`);
  }

  App
    .makeButtons()
    .makeGreeting()
    .makeSentences()
    .makeInfoTabs()
    .makeLink()
    .runAnimations();
});

