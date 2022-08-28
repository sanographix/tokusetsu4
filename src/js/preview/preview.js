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
  // -Design-

  // Accent Color
  try {
    const valAccentColor = array.filter((value) => value.option === 'Accent Color (Hex)')[0].value1;
    if (valAccentColor != '') {
      // アクセントカラーを適用
      document.head.insertAdjacentHTML('beforeend', '<style>:root{--color-primary:' + valAccentColor + '}</style>');
      document.documentElement.setAttribute('data-accent-color', valAccentColor);
      // metaタグに指定
      const domThemeColor = document.getElementById('meta-theme-color');
      domThemeColor.content = valAccentColor;

      // アクセントカラーのボタン文字色を白黒から判定
      function blackOrWhite ( hexcolor ) {
        var r = parseInt( hexcolor.substr( 1, 2 ), 16 ) ;
        var g = parseInt( hexcolor.substr( 3, 2 ), 16 ) ;
        var b = parseInt( hexcolor.substr( 5, 2 ), 16 ) ;
        return ( ( ( (r * 299) + (g * 587) + (b * 114) ) / 1000 ) < 128 ) ? 'white' : 'black' ;
      }
      const AccentColorText = blackOrWhite( valAccentColor ) ;
      switch (AccentColorText) {
        case 'black':
          document.head.insertAdjacentHTML('beforeend', '<style>:root{--color-btn-primary-text: var(--color-black)}</style>');
          break;
        case 'white':
          document.head.insertAdjacentHTML('beforeend', '<style>:root{--color-btn-primary-text: var(--color-white)}</style>');
          break;
        default:
          break;
      }
    }
  } catch(error) {
    console.error('Error: accent-color');
  }



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

  // Hashtag
  try {
    const domHashtag = document.querySelector('.js-hashtag');
    const domHashtagLabel = document.querySelector('.js-hashtag-label');
    const domHashtagLink = document.querySelector('.js-hashtag-link');
    if (valHashtag != '') {
      domHashtagLink.textContent = '#' + valHashtag;
      const HashtagLink = 'https://twitter.com/hashtag/' + valHashtag + '?src=hash';
      domHashtagLink.setAttribute('href', HashtagLink);
    } else {
      domHashtag.remove();
      domHashtagLabel.remove();
    }
  } catch(error) {
    console.error('Error: Overview hashtag');
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

  /////////////////////////////////////
  // -Member-
  // Member Heading
  try {
    const domMemberHeading = document.querySelector('.js-member-heading');
    const optMemberHeading = array.filter((value) => value.option === 'Member Heading');
    const valMemberHeading = optMemberHeading[0].value1;
    domMemberHeading.textContent = valMemberHeading;
    document.querySelector('.js-nav-link-member').textContent = valMemberHeading;
  } catch(error) {
    console.error('Error: Member heading');
  }

  // Member
  try {
    const domMemberWrap = document.querySelector('.js-member-wrap');
    const domMember = document.querySelector('.js-member'); // コピー元を取得
    const optMember = array.filter((value) => value.option === 'Member');
    for (let i = 0; i < optMember.length; i++) {
      const domMemberClone = domMember.cloneNode(true);
      domMemberClone.querySelector('.js-member-name').textContent = optMember[i].value1;
      // option
      if (optMember[i].value2 != '') {
        domMemberClone.querySelector('.js-member-role').textContent = optMember[i].value2;
      } else {
        domMemberClone.querySelector('.js-member-role').remove();
      }
      if (optMember[i].value3 != '') {
        domMemberClone.querySelector('.js-member-url').setAttribute('href', optMember[i].value3);
      } else {
        domMemberClone.querySelector('.js-member-link').remove();
      }
      domMemberWrap.appendChild(domMemberClone);
    }
    domMember.remove(); // コピー元を削除
  } catch(error) {
    console.error('Error: Member');
  }

}
