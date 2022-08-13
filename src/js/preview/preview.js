/*@license
 *
 * Tokusetsu 4:
 *   licenses: MIT
 *   Copyright (c) 2021 sanographix
 *   https://github.com/sanographix/tokusetsu4
 * CSV.js:
 *   licenses: MIT
 *   Copyright (c) 2014 Kash Nouroozi
 *   https://github.com/knrz/CSV.js
 */

// watchされているので保存したらビルドされる
function csv_data(dataPath) {
  const request = new XMLHttpRequest();
  request.addEventListener("load", (event) => {
    // ロードさせ実行
    const response = event.target.responseText; // 受け取ったテキストを返す
    csv_array(response); //csv_arrayの関数を実行
  });
  request.open("GET", dataPath, true); // csvのパスを指定
  request.send();
}
csv_data("../config.csv"); // csvのパス

function csv_array(data) {
  const array = new CSV(data, {
    header: ['option', 'value1', 'value2', 'value3', 'value4', 'value5', 'required', 'description'],
    cast: false,
  }).parse(); //配列を用意

  console.log(array);

  // ここからサイトの設定項目を組み立てる

  /////////////////////////////////////
  // -Basics-

  // Site Title
  const optWorkTitle = array.filter((value) => value.option === 'Title');
  const optEventDate = array.filter((value) => value.option === 'Date (Local Time)');

  const valWorkTitle = optWorkTitle[0].value1;
  const valEventDate = optEventDate[0].value1;
  // エンコードされたイベントタイトル（Googleカレンダー追加ボタンに使う）
  const encodedEventTitle = encodeURIComponent(valWorkTitle);

  const siteTitle = new String(valWorkTitle + ' | ' + valEventDate);
  // エンコードされたタイトル（シェアボタンに使う）
  const encodedSiteTitle = encodeURIComponent(siteTitle);

  document.title = siteTitle;

  // Site URL (トレイリングスラッシュありに統一してる)
  const siteUrl = `${location.protocol}//${location.hostname}/`;

  // Hashtag
  const valHashtag = array.filter((value) => value.option === 'Hashtag')[0].value1;

  /////////////////////////////////////
  // -Header-

  // Header title
  try {
    const domTitle = document.querySelector('.js-title');
    domTitle.textContent = valWorkTitle;
    // 文字数が長いときフォントサイズを変える
    const eventTitleStringCount = valWorkTitle.length;
    if (eventTitleStringCount > 20) {
      domTitle.classList.add('is-string-count-long');
    }
  } catch(error) {
    console.error('Error: header title');
  }


}
