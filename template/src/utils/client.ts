export const canOpenUrlSC = () => !!window.CefSharp;

export const openUrlSC = (url: string) => {
  if (!url || !canOpenUrlSC) return;
  window.CefSharp.BindObjectAsync("JsObj").then(() => {
    window.JsObj && window.JsObj.showUrl(url);
  });
};

export const onIthAnchorClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
  if (canOpenUrlSC()) {
    e.preventDefault();
    const url = e.currentTarget.href;
    openUrlSC(url);
  }
};

export const ithOpenUrl = (url: string, target = '_blank') => {
  if (canOpenUrlSC()) {
    openUrlSC(url);
    return;
  }
  window.open(url, target);
};
