const channels = [
  "ESL_SC2",
  "OgamingSC2",
  "cretetion",
  "freecodecamp",
  "storbeck",
  "habathcx",
  "RobotCaleb",
  "xLanne",
  "Claritytx",
  "summit1g",
  "anniefuchsia"
];
let renders = [];

const getAccountsInfo = channels => {
  let accountPromises = [];
  let accountInfo = [];
  let streamPromises = [];
  const accountQuery = "https://wind-bow.glitch.me/twitch-api/users/";
  const streamQuery = "https://wind-bow.glitch.me/twitch-api/streams/";

  $.each(channels, (index, channel) => {
    accountPromises.push(axios.get(accountQuery + channel));
  });

  axios
    .all(accountPromises)
    .then(
      axios.spread((...args) => {
        $.each(args, (index, arg) => {
          if (arg.data.error) {
            $(
              "#alertMessage"
            )[0].innerHTML = `<div class="alert alert-danger alert-dismissible in" role="alert">
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              ${arg.data.message}
            </div>`;
          } else {
            accountInfo.push(arg.data);
            streamPromises.push(axios.get(streamQuery + arg.data.display_name));
          }
        });
      })
    )
    .then(() => {
      axios.all(streamPromises).then(
        axios.spread((...args) => {
          $.each(args, (index, streamInfo) => {
            parseResponse(accountInfo[index], streamInfo);
          });
          render();
        })
      );
    });
};

const render = (online = true, offline = true) => {
  let div = $("#channels")[0];
  while (div.lastChild) {
    div.removeChild(div.lastChild);
  }

  $.each(renders, (index, component) => {
    if (online & component.online) $("#channels").append(component.html);
    else if (offline & !component.online) $("#channels").append(component.html);
  });
};

const parseResponse = (accountInfo, streamInfo) => {
  let connected, game, logo, status, url, html;
  const data = streamInfo.data;
  const channel = accountInfo.display_name;

  data.stream == null ? (connected = false) : (connected = true);
  connected
    ? (game = `Playing ... ${data.stream.channel.game}`)
    : (game = "OFFLINE");
  accountInfo.logo
    ? (logo = accountInfo.logo)
    : (logo = "./img/twitch.png");
  connected ? (status = data.stream.channel.status) : (status = "");
  connected
    ? (url = data.stream.channel.url)
    : (url = `https://www.twitch.tv/${channel}`);

  html = `<div class='channel connected_${connected}' id='channel_${channel}'>
      <a target='_blank' href='${url}'>
        <div class="media">
          <div class="media-left media-middle">
            <img class="media-object logo" height=80 src="${logo}" alt="...">
          </div>
          <div class="media-body">
          <h4 class="media-heading">${channel}</h4>
          ${game}
          <br/>
          ${status}
          </div>
        </div>
      </a>
      <a class='close' style='margin: -67px -50px 0px 0px; color: black'
        onclick='deleteChannel("${channel}")'>&times;
      </a>
    </div>`;

  const output = {
    online: connected,
    name: channel,
    html: html
  };

  connected ? renders.unshift(output) : renders.push(output);
};

const deleteChannel = channel => {
  $.each(renders, (index, component) => {
    if (component.name == channel) {
      renders.splice(index, 1);
      $(`#channel_${channel}`).remove();
      return false;
    }
  });
};

getAccountsInfo(channels);
$("#showAll").click(() => {
  render(true, true);
});
$("#showOnline").click(() => {
  render(true, false);
});
$("#showOffline").click(() => {
  render(false, true);
});
$("#addChannel").on("keyup", e => {
  if (e.keyCode == 13) {
    getAccountsInfo([$("#addChannel")[0].value]);
    $("#addChannel")[0].value = "";
  }
});
