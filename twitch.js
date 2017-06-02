var channels = [
  "ESL_SC2",
  "OgamingSC2",
  "cretetion",
  "freecodecamp",
  "storbeck",
  "habathcx",
  "RobotCaleb",
  "noobs2ninjas",
  "brunofin",
  "comster404",
  "anniefuchsia"
];
var renders = [];

function getAccountsInfo() {
  let promises = [];
  let query = "https://wind-bow.glitch.me/twitch-api/streams/";
  for (let i = 0; i < channels.length; ++i) {
    promises.push(axios.get(query + channels[i]));
  }

  axios.all(promises).then(
    axios.spread((...args) => {
      for (let i = 0; i < args.length; i++) {
        console.log(args[i]);
        parseResponse(args[i]);
      }
      render();
    })
  );
}

function render() {
  $.each(renders, function(index, component) {
    $("#channels").append(component);
  });
}

function parseResponse(response) {
  let connected, game, logo, status, url, html;

  let data = response.data;
  let channel = response.request.responseURL.split("/")[5];

  data.stream == null ? (connected = "offline") : (connected = "online");
  connected == "online"
    ? (game = "Playing ... " + data.stream.channel.game)
    : (game = "OFFLINE");
  connected == "online"
    ? (logo = data.stream.channel.logo)
    : (logo = "./img/Twitch-Icon-150x150.png");
  connected == "online" ? (status = data.stream.channel.status) : (status = "");
  connected == "online" ? (url = data.stream.channel.url) : (url = "");

  html =
    "<div class='channel'><a target='_blank' href='" +
    url +
    "'><table style='width:100%'><tr><td style='width:120px'><img height=100 class='logo' src='" +
    logo +
    "'/></td><td><h4>" +
    channel +
    "</h4>" +
    game +
    "<br/>" +
    status +
    "</td></tr></table></a></div>";

  connected == "online" ? renders.unshift(html) : renders.push(html);
}

getAccountsInfo();
