import Cookies from "js-cookie";

const cookieName = import.meta.env.VITE_SUBTRACKPRO_COOKIE_NAME;
export const setCookie = async (data: string) => {
  await Cookies.set(cookieName, data, {
    sameSite: "None",
    expires: 7,
    secure: true,
  });
};

export const getCookie = () => {
  return Cookies.get(cookieName);
};

export const removeCookie = () => {
  Cookies.remove(cookieName);
};
