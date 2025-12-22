//アイコンデザイン変更(アイコンクリック時にコール)
function toggleTypeSelection(imgElement) {
  imgElement.classList.toggle("selected");
}

//選択されたタイプを取得(BtnSearchクリック時にコール)
function prepareSearch() {
  //type-iconの中でselectedされたデザインのイメージを取得(複数)
  const selectedImages = document.querySelectorAll(".type-icon.selected");

  //タイプIDの変数定義(配列)
  const typeIds = [];

  //selectedのtypeidを変数の中に格納
  selectedImages.forEach(img => {
    const typeId = img.getAttribute("data-typeid");
    if (typeId) {
      typeIds.push(typeId);
    }
  });


  //aspx側に追加したHiddenSelectedTypesにIDを「,」区切りで代入
  const hiddenField = document.getElementById("HiddenSelectedTypes");
  if (hiddenField) {
    hiddenField.value = typeIds.join(",");
  }
}
