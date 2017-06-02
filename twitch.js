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
var count = 0;

function render() {
  $.each(renders, function(index, component) {
    $("#channels").append(component);
  });
}

function getData(channel, callback) {
  let query = "https://wind-bow.glitch.me/twitch-api/streams/" + channel;
  $.getJSON(query, function(data) {
    callback(channel, data);
  });
}

function parseResponse(channel, data) {
  let connected, game, logo, status, url, html;

  data.stream == null ? (connected = "offline") : (connected = "online");
  connected == "online"
    ? (game = "Playing ... " + data.stream.channel.game)
    : (game = "OFFLINE");
  connected == "online"
    ? (logo = data.stream.channel.logo)
    : (logo =
        "./img/Twitch-Icon-150x150.png");
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

  count += 1;
  count < channels.length ? getData(channels[count], parseResponse) : render();
}

$(document).ready(function() {
  getData(channels[0], parseResponse);
});
