import browser = require('webextension-polyfill');

let minuteLeft;

const startNewPomodoro = () => {
  minuteLeft = 5
  browser.browserAction.setBadgeText({ text: minuteLeft.toString() });
  browser.alarms.create("Times Up", { periodInMinutes: window.oneMinute });
}

const handlePomodoro = () => {
  minuteLeft--;
  browser.browserAction.setBadgeText({ text: minuteLeft.toString() });

  if (minuteLeft === 0) {
    browser.alarms.clear("Times Up");
    browser.notifications.create("TimesUp",
      {
        title: "It's time for a break",
        message: "Let's play",
        type: "basic",
        iconUrl: browser.runtime.getURL("icon.png")
      });
    browser.browserAction.setBadgeText({ text: "" });
  }
};

const openBreakTab = () => {
  browser.tabs.create({ url: "https://www.nytimes.com/games/wordle/index.html" });
  browser.notifications.clear("TimesUp");
};

function onInstalled() {
  console.log("Hello Devoxx & App Installed !");
}

function onStartup() {
  console.log("Hello Devoxx & App Started !");
}

browser.alarms.onAlarm.addListener(handlePomodoro);
browser.notifications.onClicked.addListener(openBreakTab)
browser.browserAction.onClicked.addListener(startNewPomodoro);
browser.runtime.onInstalled.addListener(onInstalled)
browser.runtime.onStartup.addListener(onStartup);
