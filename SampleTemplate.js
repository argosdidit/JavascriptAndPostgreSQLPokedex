const ThisProject = (() => {
  'use strict';
  let
  area_greeting,
  html_greeting,
  area_contents,
  html_contents,
  func,
  flag,
  active;
  const conf ={
    area_greeting: `area-greeting`,
    area_contents: `area-contents`,
    search_field: `search-field`,
  };
  func = {
    init: function(){
      flag = true;
      return this;
    },
    makeAreaGreeting: function(){
      if(flag){
        html_greeting =
        `<h1>こんにちは!</h1>`;

        area_greeting = document.querySelector(`[${conf.area_greeting}]`);
        area_greeting.insertAdjacentHTML('beforeend', html_greeting);
      }
      return this;
    },
    makeAreaContents: function(){
      if(flag){
        html_contents =
        `<p>HTMLの簡単な記法です</p>`;
        area_contents = document.querySelector(`[${conf.area_contents}]`);
        area_contents.insertAdjacentHTML('beforeend', html_contents);

      }
      return this;
    }
  };

  active = () => {
    func
      .init()
      .makeAreaGreeting()
      .makeAreaContents()
    return;
  }
  return (active);
})();

window.addEventListener('load', function(){
  ThisProject.active();
});