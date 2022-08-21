/*@license
 *
 * Tokusetsu 4:
 *   licenses: MIT
 *   Copyright (c) 2022 sanographix
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
  const optOrganization = array.filter((value) => value.option === 'Organization Name');

  const valWorkTitle = optWorkTitle[0].value1;
  const valOrganization = optOrganization[0].value1;

  // エンコードされたイベントタイトル（Googleカレンダー追加ボタンに使う）
  const encodedWorkTitle = encodeURIComponent(valWorkTitle);

  const siteTitle = new String(valWorkTitle + ' | ' + valOrganization);
  // エンコードされたタイトル（シェアボタンに使う）
  const encodedSiteTitle = encodeURIComponent(siteTitle);

  document.title = siteTitle;

  // Site URL (トレイリングスラッシュありに統一してる)
  const siteUrl = `${location.protocol}//${location.hostname}/`;

  // Hashtag
  const valHashtag = array.filter((value) => value.option === 'Hashtag')[0].value1;

  // Favicon
  try {
    const optFavicon = array.filter((value) => value.option === 'Site Icon (favicon)');
    const valFavicon = optFavicon[0].value1;
    const domFavicon = document.getElementById('favicon');
    domFavicon.href = valFavicon;
  } catch(error) {
    console.error('Error: favicon');
  }

  // og-description
  // About の1行目の値を利用する
  const optAbout = array.filter((value) => value.option === 'About');
  const valAbout = optAbout[0].value1;

  /////////////////////////////////////
  // -Header-


  /////////////////////////////////////
  // -Overview-

  // Work Title
  try {
    const domTitle = document.querySelector('.js-title');
    domTitle.textContent = valWorkTitle;
  } catch(error) {
    console.error('Error: Title');
  }

  // Organization
  try {
    const domOrganization = document.querySelector('.js-organizationName');
    domOrganization.textContent = valOrganization;
  } catch(error) {
    console.error('Error: Organization');
  }

  // Specification
  try {
    const domSpecification = document.querySelector('.js-specification-content');
    const optSpecification = array.filter((value) => value.option === 'Specification');
    const valSpecification = optSpecification[0].value1;
    domSpecification.textContent = valSpecification;
  } catch(error) {
    console.error('Error: Overview Specification');
  }

  // Release Date
  try {
    const domReleaseDate = document.querySelector('.js-releaseDate-content');
    const optReleaseDate = array.filter((value) => value.option === 'Release Date (Local Time)');
    const valReleaseDate = optReleaseDate[0].value1;
    domReleaseDate.textContent = valReleaseDate;
  } catch(error) {
    console.error('Error: Overview Release Date');
  }

  // Location
  try {
    const domLocation = document.querySelector('.js-location-content');
    const optLocation = array.filter((value) => value.option === 'Location');
    const valLocation = optLocation[0].value1;
    domLocation.textContent = valLocation;
  } catch(error) {
    console.error('Error: Overview Location');
  }

  // Price
  try {
    const domPrice = document.querySelector('.js-price-content');
    const optPrice = array.filter((value) => value.option === 'Price');
    const valPrice = optPrice[0].value1;
    domPrice.textContent = valPrice;
  } catch(error) {
    console.error('Error: Overview Price');
  }

  /////////////////////////////////////
  // -About-
  // About Heading
  try {
    const domAboutHeading = document.querySelector('.js-about-heading');
    const optAboutHeading = array.filter((value) => value.option === 'About Heading');
    const valAboutHeading = optAboutHeading[0].value1;
    domAboutHeading.textContent = valAboutHeading;
    document.querySelector('.js-nav-link-about').textContent = valAboutHeading;
  } catch(error) {
    console.error('Error: About heading');
  }

  // About
  try {
    const domAboutWrap = document.querySelector('.js-about-wrap');
    const domAbout = document.querySelector('.js-about'); // コピー元を取得
    for (let i = 0; i < optAbout.length; i++) {
      const domAboutClone = domAbout.cloneNode(true);
      domAboutClone.textContent = optAbout[i].value1;
      domAboutWrap.appendChild(domAboutClone);
    }
    domAbout.remove(); // コピー元を削除
  } catch(error) {
    console.error('Error: About');
  }

}
