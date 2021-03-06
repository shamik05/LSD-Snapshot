/* eslint-disable no-multi-assign */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
$(document).ready(() => {
  const today = moment().format("YYYY MMM Do");
  const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const avgArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const labels = ["", "", "", "", "", "", "", "", "", "", "Live"];

  // Dark Mode Retrieval
  let savedTheme = localStorage.getItem("theme");

  let liveInterval;
  let historicalInterval;
  let globalIntervalNum;
  let globalIntervalString;
  let globalCoin;
  const myChart = document.getElementById("myChart").getContext("2d");
  $(".mui-btn--primary").css("background-color", "#446684");
  $("#submitEmail").css("background-color", "#446684");
  const toggleSwitch = document.querySelector(".theme-switch input[type=\"checkbox\"]");
  let podcastResponse;
  let podPlayer;
  let carouselIndex = 0;
  let volStatus = true;
  // aos function animate
  AOS.init();

  // console.log(savedTheme);
  if (savedTheme === "dark") {
    toggleSwitch.checked = true;
  }

  // object with description about coins
  const aboutCoin = {
    bitcoin:
    "Bitcoin is a cryptocurrency which isn’t managed by a bank or agency but in which transactions are recorded in the blockchain that is public and contains records of each and every transaction that takes place. The cryptocurrency is traded by individuals with cryptographic keys that act as wallets. Bitcoin was first invented in 2009 by an anonymous founder known as Satoshi Nakamoto. Bitcoins are moved in blocks every 10 minutes on a decentralized ledger that connects blocks into a coherent chain dating back to the first genesis block. It was originally described as a peer-to-peer electronic cash but the technology has evolved to emphasize being a settlement layer rather than a payment network. This has left integrated second layer solutions, like Lightning Network, to prioritize that use case. It has remained the largest cryptocurrency by market cap.",
    ethereum:
    "Ethereum is a software system which is part of a decentralised system meaning it is not controlled by any single entity. Ethereum is different to Bitcoin because it expands on its technologies to create a completely new network including an internet browser, coding language and payment system – 'in short, Ethereum is a public, open-source, Blockchain based distributed software platform that allows developers to build and deploy decentralised applications'. The platform’s currency is called Ether. The platform was founded in 2014 by Vitalik Buterin and a team of other developers. The currency is just one aspect/component of Ethereum yet can be mined by individuals more easily than Bitcoin.",
    dash:
    "Dash is derivative of Litecoin, which is a derivative of Bitcoin and was created by Evan Duffield in January of 2014. It was originally known as Darkcoin but later rebranded as Dash in March of 2015. It uses a mix of miners and masternodes to validate transactions. A unique feature of Dash, is that it has has masternodes that stake at least 1000 DASH that have the ability to instantly confirm transactions. Transaction speed can be increased through masternode only validation which excludes miners. Privacy can also be enabled through 'PrivateSend' transactions that mix units. Dash has a voting system in place that can enable quick changes in governance if required rather than having a hard fork",
    eos:
    "EOS is similar to Ethereum in that it is a blockchain platform which allows decentralised apps to be created and developed. The platform should effectively provide its own operating system including cloud storage and has the ability to process one million transactions per second without any fees. A notable distinction is that transaction confirmation is done through a democracy like system where block producers are chosen by the entire EOS ecosystem through voting known as delegated proof of stake (DPoS). Block.one created EOS in September 2017 and it now has over 100 decentralised apps (dapps) with at most 6,000 daily active users.",
    "bitcoin-cash":
    "Bitcoin Cash is a fork of Bitcoin that prioritizes onchain scaling and utility as a peer-to-peer electronic cash system. The 1 megabyte limit on bitcoin blocks meant that there was often a significant delay between transactions being initiated and completing, as well as increased fees due to the limited supply per block. Bitcoin Cash increased and will continue to increase block sizes which thereby increase the potential volume of transactions on the network. On August 1, 2017, Amaury Séchet released the first Bitcoin Cash software implementation. Miners running this software were able to validate a new kind transaction to create a new chain, BCH. This process is known as a 'hard fork' since it created a new version of the BTC chain that followed BCH rules. Today, BCH and BTC share the exact same transaction history up to that point.",
    waves:
    "Waves is a Blockchain platform developed to provide users with the opportunity of creating their own new custom token. Those tokens may be used for loyalty programs, in-app currency creation, and for ICO founding. ... The new token can be traded on Waves decentralized exchange.",
    litecoin:
    "For all intents and purposes, the function of Litecoin is almost identical to that of Bitcoin – it is a decentralised digital currency. It reduced the 10 min block confirmation time to 2.5 minutes which enables faster processing. The currency was created by Charlie Lee in October 2011 as an attempt to make Bitcoin more scalable and quick. During the period of high BTC fees of late 2017, observers suggested users were utilizing LTC as a second layer to send transactions.",
    "binance-coin":
    "Binance Coin is the crypto-coin issued by Binance exchange, and trades with the BNB symbol. Binance coin runs on the Ethereum blockchain with ERC 20 standard, and has a strict limit of maximum 200 million BNB tokens.",
  };
  // Global Options for my chart
  Chart.defaults.global.defaultFontFamily = "Helvetica";
  Chart.defaults.global.defaultFontSize = 18;
  Chart.defaults.global.defaultFontColor = "black";

  // CHART.JS
  const massPopChart = new Chart(myChart, {
    type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels,
      datasets: [
        {
          label: "Price USD",
          fill: false,
          data: arr,
          borderWidth: 1,
          borderColor: "green",
          backgroundColor: "green",
          hoverBorderWidth: 7,
          hoverBorderColor: "red",
        },
        {
          label: "5 candle Average",
          fill: false,
          data: avgArr,
          borderWidth: 1,
          borderColor: "grey",
          backgroundColor: "grey",
          hoverBorderWidth: 7,
          hoverBorderColor: "orange",
        },
      ],

    },
    options: {
      scales: {
        xAxes: [
          {
            display: false, // this will remove all the x-axis grid lines
          },
        ],
      },
      title: {
        display: true,
        text: "",
        fontSize: 25,
        fontColor: "goldenrod",
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          fontColor: "#000",
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        },
      },
      tooltips: {
        enabled: true,
      },
    },
  });

  // API for news
  function getNews(coin) {
    const urlNews = `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?language=en&q=${coin}+crypto&from=${today}&sortBy=publishedAt&apiKey=46f225ffb36d463dbf82d74ee65a1700`;

    $.ajax({
      url: urlNews,
      method: "GET",
    }).then((response) => {
      // console.log(response)
      for (let i = 0; i < 6; i++) {
        const { title } = response.articles[i];
        const { description } = response.articles[i];
        const explore = response.articles[i].url;
        const image = response.articles[i].urlToImage;
        // console.log(explore)
        $(`#title${i}`).text(title);
        $(`#des${i}`).text(description);
        $(`#link-button${i}`).attr("href", explore);
        $(`#card-img${i}`).attr("src", image);
      }
    });
  }

  // function for moving average
  function movingAvg(data) {
    const delta = data.length - avgArr.length;
    let i = delta;

    for (i; i < data.length; i++) {
      const price1 = parseFloat(parseFloat(data[i].priceUsd).toFixed(3));
      const price2 = parseFloat(parseFloat(data[i - 1].priceUsd).toFixed(3));
      const price3 = parseFloat(parseFloat(data[i - 2].priceUsd).toFixed(3));
      const price4 = parseFloat(parseFloat(data[i - 3].priceUsd).toFixed(3));
      const price5 = parseFloat(parseFloat(data[i - 4].priceUsd).toFixed(3));

      avgArr[i - delta - 1] = ((price1 + price2 + price3 + price4 + price5) / 5).toFixed(3);
      $("#average").html(`<i class="fa fa-bar-chart" aria-hidden="true"></i> Average: $${avgArr[i - delta - 1]}`);
    }

    avgArr[avgArr.length - 1] = ((arr[arr.length - 1] + arr[arr.length - 2] + arr[arr.length - 3] + arr[arr.length - 4] + arr[arr.length - 5]) / 5).toFixed(3);
  }

  // function getting historical data price
  function getHistorical(queryURL) {
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then((response) => {
      const { data } = response;
      const delta = data.length - arr.length;
      let i = delta;
      for (i; i < data.length; i++) {
        const price = parseFloat(parseFloat(data[i].priceUsd).toFixed(3));
        arr[i - delta - 1] = price;
        // avgArr[i - delta - 1] = price-10;
        labels[i - delta - 1] = globalCoin;
      }
      movingAvg(data);
      massPopChart.update();
    });
  }

  // function for live price
  function getLivePrice(queryURL) {
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then((response) => {
      const price = parseFloat(parseFloat(response.data.rateUsd).toFixed(3));
      // console.log(price);
      $("#realTimePrice").html(`<i class='fas fa-coins'></i> Live price: $${price}`);
      arr[arr.length - 1] = price;

      // for moving average live
      if (arr[0] !== 0) {
        avgArr[avgArr.length - 1] = ((arr[arr.length - 1] + arr[arr.length - 2] + arr[arr.length - 3] + arr[arr.length - 4] + arr[arr.length - 5]) / 5).toFixed(3);
      }

      massPopChart.update();
    });
  }

  const configPrice = function (coin, intervalString, intervalNum) {
    globalCoin = coin;
    globalIntervalString = intervalString;
    globalIntervalNum = intervalNum;

    // set description
    $("#description").html(aboutCoin[coin]);
    // title for coins
    massPopChart.options.title.text = coin.toUpperCase();

    const currentTime = Date.now();
    const startTime = currentTime - 600000 * intervalNum * 2;
    const queryHistorical = `https://api.coincap.io/v2/assets/${coin}/history?interval=${intervalString}&start=${startTime}&end=${currentTime}`;
    const queryLive = `https://api.coincap.io/v2/rates/${coin}`;

    getHistorical(queryHistorical);
    getLivePrice(queryLive);
    getNews(coin);

    clearInterval(historicalInterval);
    clearInterval(liveInterval);

    historicalInterval = setInterval(() => {
      getHistorical(queryHistorical);
    }, intervalNum * 60000);
    liveInterval = setInterval(() => {
      getLivePrice(queryLive);
    }, 60000);
  };

  configPrice("bitcoin", "m1", 1);

  // Retrieves last viewed currency and duration
  if (localStorage.getItem("time0")) {
    configPrice(localStorage.getItem("time0"), localStorage.getItem("time1"), localStorage.getItem("time2"));
    configPrice(localStorage.getItem("coin0"), localStorage.getItem("coin1"), localStorage.getItem("coin2"));
  }

  // listener for time duration menu
  $("#timeDropdown").click((event) => {
    const intervalNum = event.target.value;
    const intervalString = event.target.id;
    configPrice(globalCoin, intervalString, intervalNum);

    // Play sound & save in localstorage
    if (volStatus) {
      $("#soundDropdown").get(0).play();
    }
    localStorage.setItem("time0", globalCoin);
    localStorage.setItem("time1", intervalString);
    localStorage.setItem("time2", intervalNum);
  });

  // listener for coin name
  $("#currentCoin").click((event) => {
    const coin = event.target.id;
    configPrice(coin, globalIntervalString, globalIntervalNum);

    // Play sound & save in localstorage
    if (volStatus) {
      $("#soundDropdown").get(0).play();
    }
    localStorage.setItem("coin0", coin);
    localStorage.setItem("coin1", globalIntervalString);
    localStorage.setItem("coin2", globalIntervalNum);
  });

  // ajax request for contact us form with formspree
  $("#submitEmail").click((e) => {
    const name = $("#inputName").val();
    const email = $("#inputEmail").val();
    const message = $("#inputMessage").val();

    if (name === "" || email === "" || message === "") {
    // console.log("fail");
      return false;
    }
    e.preventDefault();
    const status = document.getElementById("my-form-status");
    const url = "https://formspree.io/xwkrpzap";
    const method = "POST";
    const data = new FormData();
    data.append("email", email);
    data.append("name", name);
    data.append("message", message);

    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        // console.log("success");
        status.innerHTML = "Thanks! Your message was send.";
        if (volStatus) {
          $("#soundEmail").get(0).play();
        }
      } else {
        // console.log("error");
        status.innerHTML = "Oops! There was a problem. Please enter a valid email address";
      }
    };
    return xhr.send(data);
  });

  // GMAIL News Modal
  $("#newsBtn").on("click", (event) => {
    event.preventDefault();
    // const key = "c7607f7ed4342aee28bd3bb885a9faac";
    const key2 = "f0307841dc1bad77a771b46d5faa4fbc";
    let search = massPopChart.options.title.text;

    if (search === "WAVES") {
      search += " Enterprise Blockchain";
    } else if (search === "EOS") {
      search += " Blockchain";
    }

    // Play sound
    if (volStatus) {
      $("#soundDropdown").get(0).play();
    }
    const queryURL = `https://gnews.io/api/v3/search?q=${search}&token=${key2}`;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then((response) => {
      // console.log(response)
      const results = response;
      $(results.articles).each((index) => {
        const { title } = response.articles[index];
        const webUrl = response.articles[index].url;
        const source = response.articles[index].source.name;
        const newsLink = $("<a>");
        const dateLine = $("<p>");
        const articleContainer = $("<div>");

        newsLink.attr("href", webUrl);
        newsLink.attr("target", "_blank");
        newsLink.text(title);

        dateLine.text(`Date: ${response.articles[index].publishedAt}`);
        dateLine.attr("class", "modal-dates");

        articleContainer.append(newsLink);
        articleContainer.append("<br>", "Source: ", source, dateLine);
        articleContainer.attr("data-aos", "fade-left");
        articleContainer.attr("data-aos-anchor", "#newsModal");

        $("#modal-links").append(articleContainer, "<hr>");
      });
      $("#newsModal").css("display", "block");
    });
  });

  $("#close-modal").on("click", () => {
    event.preventDefault();
    $("#newsModal").css("display", "none");
    $("#modal-links").empty();
  });

  $(window).on("click", (event) => {
    if (event.target.id === "newsModal") {
      $("#newsModal").hide();
      $("#modal-links").empty();
    }
  });

  // Podcast update function
  function podcastUpdate() {
    podShow = podcastResponse[carouselIndex].show_id;
    podImage = podcastResponse[carouselIndex].image_url;

    podPlayer.iframe.src = `https://widget.spreaker.com/player?show_id=${podShow}&theme=${savedTheme}&playlist=show&chapters-image=true`;
  // "&cover_image_url=" + podImage;
  }

  // Dark Mode switch
  function darkMode() {
    if (toggleSwitch.checked) {
      savedTheme = "dark";
      localStorage.setItem("theme", "dark");
      $("#body").css("background", "linear-gradient(143deg, rgba(17,5,46,0.9) 33%, rgba(75,12,227,1) 73%");
      $("#body").css("color", "white");
      $(".mui-panel").css("background", "#0a0d18d6");
      $(".card-example ").css("background", "#0a0d18d6");
      $(".mui--text-dark").css("color", "white");
      $("#contact-us").css("background", "linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)");
      $("#contact-form>legend").css("color", "white");
      $("#body>footer").css("background", "black");
      $("#modal-body").css("background", "linear-gradient(143deg, rgba(17,5,46,0.9) 33%, rgba(75,12,227,1) 73%");
      $("#modal-title").css("color", "white");
      Chart.defaults.global.defaultFontColor = "white";
      massPopChart.options.legend.labels.fontColor = "white";
      massPopChart.options.scales.yAxes[0].gridLines.color = "white";
      massPopChart.options.title.fontColor = "gold";
      $(".mui--text-title").css("color", "gold");
      $(".mui--text-headline").css("color", "#818cab");
      $(".mui-dropdown__menu").css("background", "linear-gradient(153deg, rgba(78,11,117,1) 17%, rgba(128,0,128,1) 62%, rgba(255,243,0,1) 93%)");
      $(".mui-btn--primary").css("background-color", "#4e0b75");
      $("#submitEmail").css("background-color", "#4e0b75");
      $("#siteNav").css("background", "");

      $(".mui-dropdown__menu li").mouseover(function () {
        $(this).css("background", "#E3B93B");
      });

      $(".mui-dropdown__menu li").mouseout(function () {
        $(this).css("background", "");
      });
      $("#smallTheme span").text(savedTheme);
      podcastUpdate();
    } else {
      savedTheme = "light";
      localStorage.setItem("theme", "light");
      $("#body").css("background", "");
      $("#body").css("color", "");
      $(".mui-panel").css("background", "");
      $(".card-example ").css("background", "");
      $(".mui--text-dark").css("color", "");
      $("#contact-us").css("background", "");
      $("#contact-form>legend").css("color", "");
      $("#body>footer").css("background", "");
      $("#modal-body").css("background", "");
      $("#modal-title").css("color", "");
      Chart.defaults.global.defaultFontColor = "black";
      massPopChart.options.legend.labels.fontColor = "black";
      massPopChart.options.scales.yAxes[0].gridLines.color = "grey";
      massPopChart.options.title.fontColor = "goldenrod";
      $(".mui--text-title").css("color", "");
      $(".mui--text-headline").css("color", "");
      $(".mui-dropdown__menu").css("background", "");
      $(".mui-btn--primary").css("background-color", "#446684");
      $("#submitEmail").css("background-color", "#446684");
      $("");
      $(".mui-dropdown__menu li").mouseover(function () {
        $(this).css("background", "");
      });

      $(".mui-dropdown__menu li").mouseout(function () {
        $(this).css("background", "");
      });
      $("#smallTheme span").text(savedTheme);
      podcastUpdate();
    }
  }

  // Podcast Ajax Call
  function podcast() {
    const queryURL = "https://api.spreaker.com/v2/search?type=shows&q=crypto";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then((response) => {
      podcastResponse = response.response.items.slice(0, 5);
      // console.log(response);
      // console.log(podcastResponse)
      darkMode();
    });
  }
  podcast();

  // Podcast Carousel Options
  $(".carousel").carousel({
    fullWidth: true,
    dist: 0,
    indicators: true,
    onCycleTo(ele) {
      carouselIndex = $(ele).index();
    // console.log(carouselIndex)
    },
  });

  // Podcast widget load (doesnt work without window.onload)
  window.onload = function () {
    podPlayer = SP.getWidget("podPlayer");
    podPlayer.iframe.src = `https://widget.spreaker.com/player?show_id=1242925&theme=${savedTheme}&playlist=show&playlist-continuous=true&playlist-loop=false&playlist-autoupdate=true&autoplay=false&live-autoplay=false&chapters-image=true&episode_image_position=right&hide-likes=false&hide-comments=false&hide-sharing=false&hide-logo=false&hide-download=true&hide-episode-description=false&hide-playlist-images=false&hide-playlist-descriptions=false&gdpr-consent=null`;
  };

  // Podcast doubleclick function
  $(".carousel-item").dblclick(podcastUpdate);

  // Dark Mode firing
  toggleSwitch.addEventListener("change", darkMode, false);
  $("#smallTheme").click(() => {
    if (savedTheme === "light") {
      toggleSwitch.checked = true;
    } else {
      toggleSwitch.checked = false;
    }
    darkMode();
    if (volStatus) {
      $("#soundDark").get(0).play();
    }
  });

  // Dark Mode toggle
  $("#checkboxWrapper").click(() => {
    if (volStatus) {
      $("#soundDark").get(0).play();
    }
  });

  // Dark Mode Retrieval
  savedTheme = localStorage.getItem("theme");
  // console.log(savedTheme);
  if (savedTheme === "dark") {
    toggleSwitch.checked = true;
    darkMode();
  }

  // Volume toggle
  $("#volume").click((event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.target);
    console.log(event.currentTarget);
    const audioEl = document.getElementsByTagName("audio");
    for (let i = 0; i < audioEl.length; i++) {
      audioEl[i].pause();
    }
    volStatus = !volStatus;
    console.log(volStatus);
    $("#smallVol span").text(`Volume ${volStatus}`);
    $("#volume").empty();
    volStatus ? ($("#volume").append("<i class='fas fa-volume-up'></i>")) : ($("#volume").append("<i class='fas fa-volume-mute'></i>"));
  });

  // Volume toggle for smallscreen
  const smallVol = document.querySelector("#smallVol");
  smallVol.addEventListener("click", () => {
  // console.log($("#volume svg")[0].classList)
    const audioEl = document.getElementsByTagName("audio");
    for (let i = 0; i < audioEl.length; i++) {
      audioEl[i].pause();
    }
    volStatus = !volStatus;
    $("#smallVol span").text(`Volume ${volStatus}`);
    console.log(volStatus);
    $("#volume").find("[data-fa-i2svg]").toggleClass("fa fa-volume-up").toggleClass("fa fa-volume-mute");
  });
});
