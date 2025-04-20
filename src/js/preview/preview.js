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
 * vanilla-tilt.js:
 *   licenses: MIT
 *   Copyright (c) 2017 Șandor Sergiu
 *   https://github.com/micku7zu/vanilla-tilt.js
 * i18n-language.js:
 *   licenses: MIT
 *   Copyright (c) 2020 Shin Hyun
 *   https://github.com/kyaryunha/i18n-language.js
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
    header: [
      "option",
      "value1",
      "value2",
      "value3",
      "value4",
      "value5",
      "required",
      "description",
    ],
    cast: false,
  }).parse(); //配列を用意

  console.log(array);

  // ここからサイトの設定項目を組み立てる

  /////////////////////////////////////
  // -Basics-

  // Site Title
  const optWorkTitle = array.filter((value) => value.option === "Title");
  const optOrganization = array.filter(
    (value) => value.option === "Organization Name"
  );

  const valWorkTitle = optWorkTitle[0].value1;
  var valOrganization = optOrganization[0].value1;

  // エンコードされたイベントタイトル（Googleカレンダー追加ボタンに使う）
  const encodedWorkTitle = encodeURIComponent(valWorkTitle);

  const siteTitle = new String(valWorkTitle + " | " + valOrganization);
  // エンコードされたタイトル（シェアボタンに使う）
  const encodedSiteTitle = encodeURIComponent(siteTitle);

  document.title = siteTitle;

  // Site URL (トレイリングスラッシュありに統一してる)
  // サブディレクトリも考慮して、location.pathnameの最後のスラッシュを削除
  const siteUrl = `${location.protocol}//${location.hostname}${location.pathname.replace(/\/[^/]*$/, '/')}`;

  // Hashtag
  const valHashtag = array.filter((value) => value.option === "Hashtag")[0]
    .value1;

  // Favicon (option)
  try {
    const optFavicon = array.filter(
      (value) => value.option === "Site Icon (favicon)"
    );
    const valFavicon = optFavicon[0].value1;
    if (valFavicon != "") {
      var favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.href = valFavicon;
      document.head.appendChild(favicon);
    }
  } catch (error) {
    console.error("Error: favicon");
  }

  // Canonical
  try {
    const domCanonical = document.getElementById("canonical");
    domCanonical.href = siteUrl;
  } catch (error) {
    console.error("Error: canonical");
  }

  // cover (og-imageの代替になりうるので先に定義しておく)
  const optCover = array.filter((value) => value.option === "Cover");
  var valCoverSrc = optCover[0].value1;

  // og-image
  const optOgImage = array.filter((value) => value.option === "Share Image");
  var valOgImageSrc = optOgImage[0].value1;
  // Share Imageが記入されていればファイル名を指定
  // カラだったらカバーを代替画像にする
  if (valOgImageSrc != "") {
    var valOgImage = valOgImageSrc;
  } else {
    var valOgImage = valCoverSrc;
  }

  // og-description
  // About の1行目の値を利用する
  const optAbout = array.filter((value) => value.option === "About");
  const valAbout = optAbout[0].value1;

  // OGP
  try {
    const OGP = [
      {
        property: "og:description",
        content: valAbout,
      },
      {
        property: "og:title",
        content: siteTitle,
      },
      {
        property: "og:url",
        content: siteUrl,
      },
      {
        property: "og:image",
        content: siteUrl + valOgImage,
      },
      {
        name: "twitter:title",
        content: siteTitle,
      },
      {
        name: "twitter:description",
        content: valAbout,
      },
      {
        name: "twitter:image",
        content: siteUrl + valOgImage,
      },
    ];
    for (let i = 0; i < OGP.length; i++) {
      const metaTag = document.createElement("meta");
      for (let prop in OGP[i]) {
        metaTag.setAttribute(prop, OGP[i][prop]);
      }
      document.head.appendChild(metaTag);
    }
  } catch (error) {
    console.error("Error: OGP");
  }

  /////////////////////////////////////
  // -Design-

  // Utils
  // 文字色（白・黒）を背景色のカラーコードから判定する関数
  // Theme, Accent Color で使用
  function blackOrWhite(hexcolor) {
    var r = parseInt(hexcolor.substr(1, 2), 16);
    var g = parseInt(hexcolor.substr(3, 2), 16);
    var b = parseInt(hexcolor.substr(5, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128 ? "white" : "black";
  }

  // Background Color
  try {
    var valBackgroundColor = array.filter(
      (value) => value.option === "Background Color (Hex)"
    )[0].value1;
    if (valBackgroundColor != "") {
      // 背景色を適用
      document.head.insertAdjacentHTML(
        "beforeend",
        "<style>:root{--color-bg:" + valBackgroundColor + "}</style>"
      );
    }
  } catch (error) {
    console.error("Error: background-color");
  }

  // Accent Color
  try {
    const valAccentColor = array.filter(
      (value) => value.option === "Accent Color (Hex)"
    )[0].value1;
    if (valAccentColor != "") {
      // アクセントカラーを適用
      document.head.insertAdjacentHTML(
        "beforeend",
        "<style>:root{--color-primary:" + valAccentColor + "}</style>"
      );
      document.documentElement.setAttribute(
        "data-accent-color",
        valAccentColor
      );
      // metaタグに指定
      const domThemeColor = document.getElementById("meta-theme-color");
      domThemeColor.content = valAccentColor;

      const AccentColorText = blackOrWhite(valAccentColor);
      switch (AccentColorText) {
        case "black":
          document.head.insertAdjacentHTML(
            "beforeend",
            "<style>:root{--color-btn-primary-text: var(--color-black)}</style>"
          );
          break;
        case "white":
          document.head.insertAdjacentHTML(
            "beforeend",
            "<style>:root{--color-btn-primary-text: var(--color-white)}</style>"
          );
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.error("Error: accent-color");
  }

  // Background Image
  try {
    const optBackgroundImage = array.filter(
      (value) => value.option === "Background Image"
    );
    const valBackgroundImageSrc = optBackgroundImage[0].value1;
    const valBackgroundImageRepeat = optBackgroundImage[0].value2;
    const valBackgroundImageAlign = optBackgroundImage[0].value3;
    const valBackgroundImageFixed = optBackgroundImage[0].value4;
    // 画像URL
    if (valBackgroundImageSrc != "") {
      document.body.style.backgroundImage =
        "url(" + valBackgroundImageSrc + ")";
    }
    // 画像の繰り返し
    switch (valBackgroundImageRepeat) {
      case "Both":
        document.body.style.backgroundRepeat = "repeat";
        break;
      case "Horizontally":
        document.body.style.backgroundRepeat = "repeat-x";
        break;
      case "Vertically":
        document.body.style.backgroundRepeat = "repeat-y";
        break;
      case "None":
        document.body.style.backgroundRepeat = "no-repeat";
        break;
      default:
        document.body.style.backgroundRepeat = "no-repeat";
    }
    // 画像の位置
    switch (valBackgroundImageAlign) {
      case "Center":
        document.body.style.backgroundPosition = "center top";
        break;
      case "Left":
        document.body.style.backgroundPosition = "left top";
        break;
      case "Right":
        document.body.style.backgroundPosition = "right top";
        break;
      default:
        document.body.style.backgroundPosition = "center top";
    }
    // 画像の固定
    if (valBackgroundImageFixed == "✅") {
      document.body.style.backgroundAttachment = "fixed";
    }
  } catch (error) {
    console.error("Error: Background Image");
  }

  // Content Background Color(Hex)
  try {
    const optContentBackground = array.filter(
      (value) => value.option === "Content Background Color(Hex)"
    );
    // テーマカラー判定で使うので const ではなく var
    var valContentBackgroundColor = optContentBackground[0].value1;
    const valContentBackgroundOpacity = optContentBackground[0].value2;
    if (valContentBackgroundColor != "") {
      document.head.insertAdjacentHTML(
        "beforeend",
        "<style>:root{--color-bg-content:" +
          valContentBackgroundColor +
          "}</style>"
      );
      const domContentBackground = document.querySelector(".js-containerMask");
      domContentBackground.style.opacity = valContentBackgroundOpacity;
      document.body.classList.add("is-bgMask-enabled");
    }
  } catch (error) {
    console.error("Error: Background mask opacity");
  }

  // Theme
  try {
    // 文字色（白・黒）を背景色のカラーコードから判定
    var valThemeTextColor = blackOrWhite(valContentBackgroundColor);
    switch (valThemeTextColor) {
      case "black":
        document.documentElement.setAttribute("data-theme", "Light");
        break;
      case "white":
        document.documentElement.setAttribute("data-theme", "Dark");
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Error: theme");
  }

  /////////////////////////////////////
  // -Cover-

  try {
    const domCover = document.querySelector(".js-cover-img");
    // 画像URL
    if (valCoverSrc != "") {
      domCover.setAttribute("src", valCoverSrc);
    } else {
      document.querySelector(".js-cover").remove();
    }
  } catch (error) {
    console.error("Error: Cover");
  }

  /////////////////////////////////////
  // -Overview-

  // Art Image
  try {
    const optArtImage = array.filter((value) => value.option === "Art Image");
    const valArtImageSrc = optArtImage[0].value1;
    const domArtImage = document.querySelector(".js-art-img");
    // 画像URL
    if (valArtImageSrc != "") {
      domArtImage.setAttribute("src", valArtImageSrc);
      document.getElementById("art-empty").remove();
    } else {
      document.getElementById("art").remove();
    }
  } catch (error) {
    console.error("Error: Art Image");
  }

  // Work Title
  try {
    const domTitle = document.querySelector(".js-title");
    domTitle.textContent = valWorkTitle;
  } catch (error) {
    console.error("Error: Title");
  }

  // Organization
  try {
    const domOrganization = document.querySelector(".js-organizationName");
    domOrganization.textContent = valOrganization;
  } catch (error) {
    console.error("Error: Organization");
  }

  // Specification
  try {
    const domSpecification = document.querySelector(
      ".js-specification-content"
    );
    const optSpecification = array.filter(
      (value) => value.option === "Specification"
    );
    const valSpecification = optSpecification[0].value1;
    domSpecification.textContent = valSpecification;
  } catch (error) {
    console.error("Error: Overview Specification");
  }

  // Release Date
  try {
    const domReleaseDate = document.querySelector(".js-releaseDate-content");
    const optReleaseDate = array.filter(
      (value) => value.option === "Release Date"
    );
    const valReleaseDate = optReleaseDate[0].value1;
    domReleaseDate.textContent = valReleaseDate;
  } catch (error) {
    console.error("Error: Overview Release Date");
  }

  // Location
  try {
    const domLocation = document.querySelector(".js-location-content");
    const optLocation = array.filter((value) => value.option === "Location");
    const valLocation = optLocation[0].value1;
    domLocation.textContent = valLocation;
    // 空欄ならHTMLから非表示
    if (valLocation == "") {
      document.querySelector(".js-overview-label").remove();
    }
  } catch (error) {
    console.error("Error: Overview Location");
  }

  // Price
  try {
    const domPrice = document.querySelector(".js-price-content");
    const optPrice = array.filter((value) => value.option === "Price");
    const valPrice = optPrice[0].value1;
    domPrice.textContent = valPrice;
  } catch (error) {
    console.error("Error: Overview Price");
  }

  // Hashtag
  try {
    const domHashtag = document.querySelector(".js-hashtag");
    const domHashtagLabel = document.querySelector(".js-hashtag-label");
    const domHashtagLink = document.querySelector(".js-hashtag-link");
    if (valHashtag != "") {
      domHashtagLink.textContent = "#" + valHashtag;
      const HashtagLink =
        "https://twitter.com/hashtag/" + valHashtag + "?src=hash";
      domHashtagLink.setAttribute("href", HashtagLink);
    } else {
      domHashtag.remove();
      domHashtagLabel.remove();
    }
  } catch (error) {
    console.error("Error: Overview hashtag");
  }

  /////////////////////////////////////
  // -Store-
  // Store Heading (Option)
  try {
    const domStoreHeading = document.querySelector(".js-store-heading");
    const optStoreHeading = array.filter(
      (value) => value.option === "Store Heading"
    );
    const valStoreHeading = optStoreHeading[0].value1;
    domStoreHeading.textContent = valStoreHeading;
    // 空欄ならHTMLから非表示
    if (valStoreHeading == "") {
      document.querySelector(".js-section-store").remove();
    }
  } catch (error) {
    console.error("Error: Store heading");
  }
  // Store (Option)
  try {
    const domStoreWrap = document.querySelector(".js-store-wrap");
    const domStore = document.querySelector(".js-store-link"); // コピー元を取得
    const optStore = array.filter((value) => value.option === "Store");
    for (let i = 0; i < optStore.length; i++) {
      const domStoreClone = domStore.cloneNode(true);
      // option
      if (optStore[i].value1 != "") {
        domStoreClone.textContent = optStore[i].value1;
        domStoreClone.setAttribute("href", optStore[i].value2);
      }
      domStoreWrap.appendChild(domStoreClone);
    }
    domStore.remove(); // コピー元を削除
  } catch (error) {
    console.error("Error: Store");
  }

  /////////////////////////////////////
  // -Share Buttons-
  try {
    const domShareTwitter = document.querySelector(".js-share-tw");
    const domShareFacebook = document.querySelector(".js-share-fb");
    let twitterLink =
      "https://twitter.com/share?text=" + encodedSiteTitle + "&url=" + siteUrl;
    // ハッシュタグが設定されていればシェアURLに含める
    if (valHashtag != "") {
      twitterLink += "&hashtags=" + valHashtag;
    }
    domShareTwitter.setAttribute("href", twitterLink);
    const facebookLink = "http://www.facebook.com/sharer.php?u=" + siteUrl;
    domShareFacebook.setAttribute("href", facebookLink);
  } catch (error) {
    console.error("Error: Share buttons");
  }

  /////////////////////////////////////
  // -Embedded Players-

  // SoundCloud
  try {
    const domSoundCloudPlayer = document.getElementById("soundcloud-embed");
    const valPlayerSoundCloud = array.filter(
      (value) => value.option === "Player (SoundCloud)"
    )[0].value2;
    const soundCloudType = array.filter(
      (value) => value.option === "Player (SoundCloud)"
    )[0].value1;
    if (valPlayerSoundCloud != "") {
      switch (soundCloudType) {
        case "Track":
          domSoundCloudPlayer.setAttribute(
            "src",
            "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" +
              valPlayerSoundCloud +
              "&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"
          );
          break;
        case "Playlist":
          domSoundCloudPlayer.setAttribute(
            "src",
            "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/" +
              valPlayerSoundCloud +
              "&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"
          );
          break;
        default:
          break;
      }
    } else {
      domSoundCloudPlayer.remove();
    }
  } catch (error) {
    console.error("Error: SoundCloud Player");
  }

  // YouTube
  try {
    const domYouTubePlayer = document.getElementById("youtube-embed");
    const valPlayerYouTube = array.filter(
      (value) => value.option === "Player (YouTube)"
    )[0].value2;
    if (valPlayerYouTube != "") {
      domYouTubePlayer
        .querySelector(".js-embedded-player")
        .setAttribute(
          "src",
          "https://www.youtube.com/embed/" + valPlayerYouTube
        );
    } else {
      domYouTubePlayer.remove();
    }
  } catch (error) {
    console.error("Error: YouTube Player");
  }

  /////////////////////////////////////
  // -About-
  // About Heading
  try {
    const domAboutHeading = document.querySelector(".js-about-heading");
    const optAboutHeading = array.filter(
      (value) => value.option === "About Heading"
    );
    const valAboutHeading = optAboutHeading[0].value1;
    domAboutHeading.textContent = valAboutHeading;
  } catch (error) {
    console.error("Error: About heading");
  }

  // About
  try {
    const domAboutWrap = document.querySelector(".js-about-wrap");
    const domAbout = document.querySelector(".js-about"); // コピー元を取得
    for (let i = 0; i < optAbout.length; i++) {
      const domAboutClone = domAbout.cloneNode(true);
      domAboutClone.textContent = optAbout[i].value1;
      domAboutWrap.appendChild(domAboutClone);
    }
    domAbout.remove(); // コピー元を削除
  } catch (error) {
    console.error("Error: About");
  }

  /////////////////////////////////////
  // -Gallery-
  try {
    const optGallery = array.filter((value) => value.option === "Gallery");
    const domGalleryWrap = document.querySelector(".js-dom-gallery-wrap");
    const domGallery = document.querySelector(".js-dom-gallery"); // コピー元を取得

    // lightbox
    const domGalleryLightboxWrap = document.querySelector(
      ".js-dom-gallery-lightbox-wrap"
    );
    const domGalleryLightbox = document.querySelector(
      ".js-dom-gallery-lightbox"
    ); // コピー元を取得

    for (let i = 0; i < optGallery.length; i++) {
      const domGalleryClone = domGallery.cloneNode(true);
      domGalleryClone.setAttribute("data-index", i + 1); // lightbox のために data 属性を振る
      domGalleryClone
        .querySelector(".js-dom-gallery-img")
        .setAttribute("src", optGallery[i].value1);
      domGalleryWrap.appendChild(domGalleryClone);

      // lightbox
      const domGalleryLightboxClone = domGalleryLightbox.cloneNode(true);
      domGalleryLightboxClone.setAttribute("data-index", i + 1); // lightbox のために data 属性を振る
      domGalleryLightboxClone
        .querySelector(".js-dom-gallery-lightbox-img")
        .setAttribute("src", optGallery[i].value1);
      domGalleryLightboxWrap.appendChild(domGalleryLightboxClone);
    }
    domGallery.remove(); // コピー元を削除
    domGalleryLightbox.remove(); // コピー元を削除
    // 空欄ならHTMLからセクションごと非表示
    if (optGallery[0].value1 == "") {
      document.getElementById("gallery").remove();
    }
  } catch (error) {
    console.error("Error: Gallery");
  }

  /////////////////////////////////////
  // -Tracklist-
  // Tracklist Heading
  try {
    const domTracklistHeading = document.querySelector(".js-tracklist-heading");
    const optTracklistHeading = array.filter(
      (value) => value.option === "Tracklist Heading"
    );
    const valTracklistHeading = optTracklistHeading[0].value1;
    domTracklistHeading.textContent = valTracklistHeading;
    // 空欄ならHTMLからセクションごと非表示
    if (valTracklistHeading == "") {
      document.getElementById("tracklist").remove();
    }
  } catch (error) {
    console.error("Error: Tracklist heading");
  }

  // Tracklist
  try {
    const domTrackWrap = document.querySelector(".js-track-wrap");
    const domTrack = document.querySelector(".js-track"); // コピー元を取得
    const optTrack = array.filter((value) => value.option === "Track");
    for (let i = 0; i < optTrack.length; i++) {
      const domTrackClone = domTrack.cloneNode(true);
      // track title
      domTrackClone.querySelector(".js-track-name").textContent =
        optTrack[i].value1;
      // track description
      if (optTrack[i].value2 != "") {
        domTrackClone.querySelector(".js-track-description").textContent =
          optTrack[i].value2;
      } else {
        domTrackClone.querySelector(".js-track-description").remove();
      }
      // track titleが空欄でなければ配置
      if (optTrack[i].value1 != "") {
        domTrackWrap.appendChild(domTrackClone);
      }
    }
    domTrack.remove(); // コピー元を削除
  } catch (error) {
    console.error("Error: Track");
  }

  /////////////////////////////////////
  // -Member-
  // Member Heading
  try {
    const domMemberHeading = document.querySelector(".js-member-heading");
    const optMemberHeading = array.filter(
      (value) => value.option === "Member Heading"
    );
    const valMemberHeading = optMemberHeading[0].value1;
    domMemberHeading.textContent = valMemberHeading;
  } catch (error) {
    console.error("Error: Member heading");
  }

  // Member
  try {
    const domMemberWrap = document.querySelector(".js-member-wrap");
    const domMember = document.querySelector(".js-member"); // コピー元を取得
    const optMember = array.filter((value) => value.option === "Member");
    for (let i = 0; i < optMember.length; i++) {
      const domMemberClone = domMember.cloneNode(true);
      domMemberClone.querySelector(".js-member-name").textContent =
        optMember[i].value1;
      // option
      if (optMember[i].value2 != "") {
        domMemberClone.querySelector(".js-member-role").textContent =
          optMember[i].value2;
      } else {
        domMemberClone.querySelector(".js-member-role").remove();
      }
      if (optMember[i].value3 != "") {
        domMemberClone
          .querySelector(".js-member-url")
          .setAttribute("href", optMember[i].value3);
      } else {
        domMemberClone.querySelector(".js-member-link").remove();
      }
      domMemberWrap.appendChild(domMemberClone);
    }
    domMember.remove(); // コピー元を削除
  } catch (error) {
    console.error("Error: Member");
  }

  /////////////////////////////////////
  // -Organization-

  // Organization Logo
  try {
    const optOrganizationLogo = array.filter(
      (value) => value.option === "Organization Logo"
    );
    const valOrganizationLogoSrc = optOrganizationLogo[0].value1;
    const domOrganizationLogo = document.querySelector(
      ".js-organization-logo-img"
    );
    // 画像URL
    if (valOrganizationLogoSrc != "") {
      domOrganizationLogo.setAttribute("src", valOrganizationLogoSrc);
      domOrganizationLogo.setAttribute("alt", valOrganization);
    } else {
      domOrganizationLogo.remove();
      document.querySelector(".js-organization-logo").textContent =
        valOrganization;
    }
  } catch (error) {
    console.error("Error: Organization Logo");
  }

  // Organization Links
  try {
    const domOrganizationLinkWrap = document.querySelector(
      ".js-organization-link-wrap"
    );
    const domOrganizationLink = document.querySelector(".js-organization-link"); // コピー元を取得
    const optOrganizationLink = array.filter(
      (value) => value.option === "Organization Link"
    );

    for (let i = 0; i < optOrganizationLink.length; i++) {
      const domOrganizationLinkClone = domOrganizationLink.cloneNode(true);
      domOrganizationLinkClone.setAttribute(
        "href",
        optOrganizationLink[i].value2
      );
      domOrganizationLinkClone.querySelector(
        ".js-organization-link-label"
      ).textContent = optOrganizationLink[i].value1;

      domOrganizationLinkWrap.appendChild(domOrganizationLinkClone);
    }
    domOrganizationLink.remove(); // コピー元を削除
    // 空欄ならHTMLから非表示
    if (optOrganizationLink[0].value1 == "") {
      domOrganizationLinkWrap.remove();
    }
  } catch (error) {
    console.error("Error: Organization Links");
  }

  /////////////////////////////////////
  // -Footer-
  document.querySelector(".js-footer-workTitle").textContent = valWorkTitle;
  // footer-text (option)
  try {
    const domFooterText = document.querySelector(".js-footer-text");
    const optFooterText = array.filter(
      (value) => value.option === "Footer Text"
    );
    const valFooterText = optFooterText[0].value1;
    if (valFooterText != "") {
      domFooterText.textContent = valFooterText;
    } else {
      domFooterText.remove();
    }
  } catch (error) {
    console.error("Error: Footer text");
  }

  /////////////////////////////////////
  // -Preiview-
  // ダウンロードリンクを動的に生成
  const downloadLink = document.querySelector('.prebuild-download');
  if (downloadLink) {
    downloadLink.href = `${siteUrl}preview.html?prebuild=true`;
  }

  /////////////////////////////////////
  // -Download-
  // クエリパラメータが?prebuild=trueのときテンプレートをダウンロード
  const urlParam = location.search;
  if (urlParam === "?prebuild=true") {
    // プレビュー用バナーを消す
    document.querySelector(".js-prebuild").remove();
    // 検索避けない設定の場合noindex消す
    const valRobots = array.filter(
      (value) => value.option === "Hide on Search Results"
    )[0].value1;
    if (valRobots == "-") {
      document.getElementById("meta-robots").remove();
    }
    // jsでの書き換えがロードしきってからDOMを取得する
    window.addEventListener("load", function () {
      let snapshot = new XMLSerializer().serializeToString(document);
      // 不要な要素をhtml文字列から抜き取る
      snapshot = snapshot.replace(
        '<script src="_src/preview.js"></script>',
        ""
      );
      snapshot = snapshot.replace(
        '<script src="_src/i18n-language.js"></script>',
        ""
      );
      // ダウンロード
      let blob = new Blob([snapshot], { type: "text/plan" });
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "index.html";
      link.click();
    });
  }
}
