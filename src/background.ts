import browser = require('webextension-polyfill');

export interface UserPreferences {
  pomodoroDurationInMin: number;
  breakUrl: string;
  useNotification: boolean;
  forceBreak: boolean;
  takeABreakMessage: string;
}

let minuteLeft: number, userPref: UserPreferences;

const startNewPomodoro = () => {
  minuteLeft = userPref.pomodoroDurationInMin;
  browser.browserAction.setBadgeText({ text: minuteLeft.toString() });
  browser.alarms.create("Times Up", { periodInMinutes: window.oneMinute });
}

const handlePomodoro = () => {
  minuteLeft--;
  browser.browserAction.setBadgeText({ text: minuteLeft.toString() });

  if (minuteLeft === 0) {
    browser.alarms.clear("Times Up");

    if (browser.notifications && userPref.useNotification) {
      browser.notifications.create("TimesUp",
        {
          title: userPref.takeABreakMessage,
          message: "Let's play",
          type: "basic",
          iconUrl: browser.runtime.getURL("icon.png")
        });
    }
    browser.browserAction.setBadgeText({ text: "" });

    if (userPref.forceBreak) {
      forceTakeABreak();
    }
  }
};

async function forceTakeABreak() {
  await browser.tabs.executeScript({ file: "appendAlert.js" });
  const tab = await browser.tabs.query({ active: true, currentWindow: true });
  browser.tabs.sendMessage(tab[0].id, { message: userPref.takeABreakMessage, breakLink: userPref.breakUrl });
}

const openBreakTab = () => {
  browser.tabs.create({ url: userPref.breakUrl });
  browser.notifications.clear("TimesUp");
};

function onInstalled() {
  console.log("Hello Devoxx & App Installed !");
  const userPreferences = {
    pomodoroDurationInMin: 5,
    breakUrl: "https://www.nytimes.com/games/wordle/index.html",
    useNotification: true,
    forceBreak: true,
    takeABreakMessage: "It's time for a break"
  };
  userPref = userPreferences;
  browser.storage.local.set({ userPreferences });
}

async function onStartup() {
  console.log("Hello Devoxx & App Started !");
  // View storage: chrome.storage.local.get(function(result){console.log(result)})
  const localKey = await browser.storage.local.get("userPreferences");
  userPref = localKey.userPreferences as UserPreferences;
}

async function updateUserParams(changes) {
  let changedItems = Object.keys(changes);
  if (changedItems.length > 0) {
    const localKey = await browser.storage.local.get("userPreferences");
    userPref = localKey.userPreferences as UserPreferences;
  }
}

browser.alarms.onAlarm.addListener(handlePomodoro);
if (browser.notifications) {
  browser.notifications.onClicked.addListener(openBreakTab);
}
browser.browserAction.onClicked.addListener(startNewPomodoro);
browser.runtime.onInstalled.addListener(onInstalled)
browser.runtime.onStartup.addListener(onStartup);
browser.storage.onChanged.addListener(updateUserParams);