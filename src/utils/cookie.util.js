
import { Cookies } from 'quasar';

function SetCookie(name, value) {
  Cookies.set(name, value);
};

function GetCookie(name) {
  return Cookies.get(name);
};

function RemoveCookie(name) {
  Cookies.remove(name);
};

export { SetCookie, GetCookie, RemoveCookie };
