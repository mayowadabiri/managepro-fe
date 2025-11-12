import Cookies from "js-cookie";

export const setCookie = async (data: string) => {
  await Cookies.set("auth_token", data, {
    sameSite: "None",
    expires: 7,
    secure: true,
  });
};

export const getCookie = () => {
  return Cookies.get("auth_token");
};

export const removeCookie = () => {
  Cookies.remove("auth_token");
};
