export const FindParamByKey = (key, params) => {
  const paramList = params ?? window.location.search;

  if (paramList) {
    const params = paramList.split("&");
    return params
      .find((param) => param.includes(`${key}=`))
      .split(`${key}=`)[1];
  }
};
