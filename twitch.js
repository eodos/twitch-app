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
  let streamPromises = [];
  const accountQuery = "https://wind-bow.glitch.me/twitch-api/users/";
  const streamQuery = "https://wind-bow.glitch.me/twitch-api/streams/";

  $.each(channels, (index, channel) => {
    accountPromises.push(axios.get(accountQuery + channel));
  });

  axios.all(accountPromises)
  .then(
    axios.spread((...args) => {
      $.each(args, (index, arg) => {
        if (arg.data.error) {
          $("#alertMessage")[0].innerHTML =
            `<div class="alert alert-danger alert-dismissible in" role="alert">
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              ${arg.data.message}
            </div>`;
        }
        else {
          streamPromises.push(axios.get(streamQuery + arg.data.display_name));
        }
      });
    })
  )
  .then(
    () => {
      axios.all(streamPromises)
      .then(axios.spread((...args) => {
        $.each(args, (index, arg) => {
          parseResponse(arg);
        });
        render();
      }))
    }
  );
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

const parseResponse = response => {
  let connected, game, logo, status, url, html;

  const data = response.data;
  const channel = response.request.responseURL.split("/")[5];

  data.stream == null ? (connected = false) : (connected = true);
  connected
    ? (game = `Playing ... ${data.stream.channel.game}`)
    : (game = "OFFLINE");
  connected
    ? (logo = data.stream.channel.logo)
    : (logo = "./img/Twitch-Icon-150x150.png");
  connected ? (status = data.stream.channel.status) : (status = "");
  connected ? (url = data.stream.channel.url) : (url = "");

  html =
    `<div class='channel' id='channel_${channel}'>
      <a target='_blank' href='${url}'>
        <table style='width:100%'>
          <tr>
            <td style='width:100px'>
              <img height=80 class='logo' src='${logo}'/>
            </td>
            <td>
              <h4>${channel}</h4>
              ${game}
              <br/>
              ${status}
            </td>
          </tr>
        </table>
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
$("#addChannel").on('keyup', (e) => {
    if (e.keyCode == 13) {
      getAccountsInfo([$("#addChannel")[0].value]);
      $("#addChannel")[0].value = "";
    }
});
