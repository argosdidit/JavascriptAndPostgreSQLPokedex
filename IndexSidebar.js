const ThisProject = (() => {
  'use strict';

  let
  //HTML関連(位置判定)
  areaPageTitle,
  areaTop,
  areaMiddle,
  areaBottom,

  //HTML関連(挿入)
  htmlPageTitle,
  htmlTop,
  htmlMiddle,
  htmlBottom,
  func,
  flag,
  active;

  const conf = {
    area_top: `area-top`,
    fieldPageTitle: `field-page-title`,
    area_middle: `area-middle`,
    area_bottom: `area-bottom`,
  };

  func = {

    init: function () {
      flag = true;

      areaTop = document.querySelector(`[${conf.area_top}]`);
      areaMiddle = document.querySelector(`[${conf.area_middle}]`);
      areaBottom = document.querySelector(`[${conf.area_bottom}]`);

      return this;
    },
    makeFieldPageTitle(){
      if(flag){
        areaPageTitle = document.querySelector(`[${conf.fieldPageTitle}]`);
        htmlPageTitle =
        `<h1>～ My Web Page ～</h1>`;

        areaPageTitle.insertAdjacentHTML('beforeend', htmlPageTitle);

      }
      return this;
    },

    /* middle：サイドバー + メインコンテンツ + トグルボタン */
    makeMiddleArea: function () {
      htmlMiddle = `
        <nav class="sidebar" id="sidebar">
          <button class="sidebar-close-btn" id="sidebar-close">☰</button>
          <ul>
            <li data-menu="1">タイプ</li>
            <li data-menu="2">特性</li>
            <li data-menu="3">性別</li>
            <li data-menu="4">タマゴグループ</li>
            <li data-menu="5">種族値</li>
            <li data-menu="6">姿違い</li>
          </ul>
        </nav>

        <div class="main-content" id="main-content">
          <h2>メインコンテンツ</h2>
          <p>左上のメニューを開いて操作してください。</p>

          <!-- テーマ切り替えボタン -->
          <button class="theme-toggle" id="theme-toggle">Dark</button>

          <div id="dynamic-content"></div>
        </div>
      `;
      areaMiddle.insertAdjacentHTML('beforeend', htmlMiddle);
      return this;
    },

    makeBottomArea: function () {
      htmlBottom = `<p>フッターエリア</p>`;
      areaBottom.insertAdjacentHTML('beforeend', htmlBottom);
      return this;
    },

    /* サイドバー開閉 */
    bindMenuButton: function () {
      const btn = document.getElementById("menu-btn");
      const sidebar = document.getElementById("sidebar");
      const main = document.getElementById("main-content");

      btn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        main.classList.toggle("shift");
      });

      return this;
    },

    /* サイドバー内の閉じるボタン */
    bindSidebarCloseButton: function () {
      const closeBtn = document.getElementById("sidebar-close");
      const sidebar = document.getElementById("sidebar");
      const main = document.getElementById("main-content");

      closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
        main.classList.remove("shift");
      });

      return this;
    },

    /* メニュークリックで閉じる */
    bindSidebarEvents: function () {
      const items = document.querySelectorAll('.sidebar li');
      const dynamic = document.getElementById('dynamic-content');
      const sidebar = document.getElementById('sidebar');
      const main = document.getElementById('main-content');

      items.forEach(item => {
        item.addEventListener('click', () => {
          const num = item.dataset.menu;
          dynamic.innerHTML = `<p>Menu ${num} が選択されました。</p>`;
          sidebar.classList.remove("active");
          main.classList.remove("shift");
        });
      });

      return this;
    },

    /* テーマ切り替え */
    bindThemeToggle: function () {
      const toggle = document.getElementById("theme-toggle");
      const sidebar = document.getElementById("sidebar");
      
      let isBright = false;
      // ★ 初期状態で Dark を付ける
      sidebar.classList.add("dark");
      
      toggle.addEventListener("click", () => {
        isBright = !isBright;
        
        if (isBright)
        {
          sidebar.classList.remove("dark");
          sidebar.classList.add("bright");
          toggle.textContent = "Bright";
        }
        else
        {
          sidebar.classList.remove("bright");
          sidebar.classList.add("dark");
          toggle.textContent = "Dark";
        }
      });
      return this;
    }
  };

  active = () => {
    func
      .init()
      .makeFieldPageTitle()
      .makeMiddleArea()
      .makeBottomArea()
      .bindMenuButton()
      .bindSidebarCloseButton()
      .bindSidebarEvents()
      .bindThemeToggle();
  };

  return active;

})();

window.addEventListener('load', () => {
  ThisProject();
});

//[タイプ]
//[特性]
//[性別]
//[種族値]
//[タマゴグループ]
//[姿違い]
//オス・メス, フォルムチェンジ, リージョンフォーム, メガ, キョダイマックス
//<地方>, <世代>

