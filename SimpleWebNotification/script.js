const checkPermission = () => {
    if (!("serviceWorker" in navigator))
        throw new Error("no support for service worker");
};

const registerSW = async () => {
    const registration = await navigator.serviceWorker.register("sw.js");
    return registration;
};

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("permission not granted");
    else {
        new Notification("hello world");
    }
};

checkPermission();
registerSW();
requestNotificationPermission();
