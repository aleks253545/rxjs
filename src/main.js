import './main.scss';
// import { createStore } from 'redux';
import { Subject } from 'rxjs';
import * as $ from '../node_modules/jquery/src/jquery';

function renderUsers(items) {
  $('.friends_main').empty();
  items.map((item, index) => {
    $('.friends_main')
      .append($('<div>').addClass('friend').attr('main-index', index)
        .append($('<img>').attr('src', `${item.avatar_url}`).addClass('friend_ava'))
        .append($('<div>').addClass('friend_main')
          .append($('<h3>').addClass('friend_main_name').text(item.name))
          .append($('<span>').addClass('friend_main_geo').append($('<i>').addClass('fa fa-map-marker')).append(item.location))
          .append($('<span>').addClass('friend_main_login').text(`@${item.login}`)))
        .append($('<div>').addClass('friend_delete')
          .append($('<i>').addClass('fa fa-angle-right friend_delete_arrow'))
          .append($('<div>').addClass('friend_delete_trash').append($('<i>').addClass('fa fa-trash').attr('del-index', index)))));
  });
}
let users = [];
const $allUsersStream = new Subject();
$allUsersStream.subscribe((data) => renderUsers(data));

function Downoload() {
  const page = Math.floor(Math.random() * (100 - 1)) + 1;
  return fetch(`https://api.github.com/user/${page}`)
    .then((item) => item.json()).then((data) => {
      if (data.message === 'Not Found') {
        return Downoload();
      }
      return data;
    });
}
// function pageReducer(state=initialState,action){
//      switch (action.type){
//          case DELETE_USER:{
//              state.splice(action.index,1,action.newUser);
//              console.log(state);
//              renderUser(state);
//              return state
//              break;
//          }
//          case 'START':{
//              renderUser(action.state);
//              return action.state
//          }
//          case "RERENDER":{
//             return state;
//          }
//      }
// }
function setNewusers() {
  Promise.all([Downoload(), Downoload(), Downoload()]).then((results) => {
    users = results.concat();
    $allUsersStream.next(users);
  });
}
window.onload = function () {
  setNewusers();
};

$(document).ready(() => {
  $('.friends_main').on('click', '.fa-trash', (event) => {
    Downoload().then((item) => {
      users.splice(event.target.getAttribute('del-index'), 1, item);
      $allUsersStream.next(users);
    });
  });
  $('.friends_footer').on('click', '', () => {
    setNewusers();
  });
});
