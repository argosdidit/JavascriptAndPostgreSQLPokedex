const App = {
  flag: true,
  currentIndex: 0,
  mode: 'puzzle',
  imageCount: 10,
  viewMode: 'pc', // PC or mobileの状態を保持

  modeMap: {
    puzzle: {
      title: 'パズル関連',
      path: 'puzzle',
      next: 'program',
    },
    program: {
      title: 'プログラム関連',
      path: 'program',
      next: 'puzzle',
    },
  },

  init() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const modeParam = params.get('mode');
    if (type && this.modeMap[type]) {
      this.mode = type;
    }
    if (modeParam === 'pc' || modeParam === 'mobile') {
      this.viewMode = modeParam;
      document.body.classList.remove('pc-mode', 'mobile-mode');
      document.body.classList.add(`${modeParam}-mode`);
    } else {
      this.viewMode = 'pc';
      document.body.classList.add('pc-mode');
    }
    return this;
  },

  makeTitleField() {
    if (this.flag) {
      const titleEl = document.querySelector('.link-title');
      titleEl.textContent = this.modeMap[this.mode].title;
    }
    return this;
  },

  makeImageField() {
    if (this.flag) {
      this.updateImage();
      const leftBtn = document.querySelector('.arrow.left');
      const rightBtn = document.querySelector('.arrow.right');

      leftBtn.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex - 1 + this.imageCount) % this.imageCount;
        this.updateImage();
      });

      rightBtn.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex + 1) % this.imageCount;
        this.updateImage();
      });
    }
    return this;
  },

  updateImage() {
    const imgEl = document.querySelector('.main-image');
    const path = this.modeMap[this.mode].path;
    imgEl.src = `${path}/image${this.currentIndex + 1}.jpeg`;
  },

  setBackButton() {
    const btn = document.querySelector('.back-button');
    btn.addEventListener('click', () => {
      location.href = `IntroducingMySelf.html?mode=${this.viewMode}`;
    });
    return this;
  },

  setupLayoutSwitch() {
    // PC/スマホ切り替えボタンを作成し、切替時にbodyクラスを変更、viewMode保持
    if (this.flag) {
      const container = document.querySelector('.link-container');
      const switchDiv = document.createElement('div');
      switchDiv.className = 'mode_buttons';
      switchDiv.innerHTML = `
        <button id="pcButton">PC表示</button>
        <button id="mobileButton">スマホ表示</button>
      `;
      container.insertBefore(switchDiv, container.firstChild);

      const switchMode = (mode) => {
        if (mode === this.viewMode) return;
        this.viewMode = mode;
        document.body.classList.remove('pc-mode', 'mobile-mode');
        document.body.classList.add(`${mode}-mode`);
      };

      document.getElementById('pcButton').addEventListener('click', () => switchMode('pc'));
      document.getElementById('mobileButton').addEventListener('click', () => switchMode('mobile'));
    }
    return this;
  },

  run() {
    return this
      .init()
      .makeTitleField()
      .makeImageField()
      .setBackButton()
      .setupLayoutSwitch();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  App.run();
});
