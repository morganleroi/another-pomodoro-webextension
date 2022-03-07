import browser = require('webextension-polyfill');

let intervalId: number;
let minuteLeft: number;

interface UserPreferences {
  pomodoroDurationInMin: number;
  breakUrl: string;
  useNotification: boolean;
  forceBreak: boolean;
  takeABreakMessage: string;
}

let userParams: UserPreferences = {
  pomodoroDurationInMin: 5,
  breakUrl: "https://www.nytimes.com/games/wordle/index.html",
  useNotification: true, 
  forceBreak: true,
  takeABreakMessage: "It's time for a break"
};

const openPauseTab = () => {
  browser.tabs.create({ url: userParams.breakUrl });
  browser.notifications.clear("TimesUp");
};

const startNewPomodoro = async () => {
  const { pomodoroDurationInMin } = userParams;
  minuteLeft = pomodoroDurationInMin;
  browser.browserAction.setBadgeText({ text: pomodoroDurationInMin.toString() });
  console.log("Set intervan", window.oneMinuteInMs);
  intervalId = setInterval(handlePomodoro, window.oneMinuteInMs);
}

const initUserPreferences = async () => {
  await browser.storage.local.set({ "user": userParams });
  minuteLeft = 0;
};

const loadUserPreferences = async () => {
  userParams = await browser.storage.local.get("user") as UserPreferences;
  minuteLeft = 0;
};

const handlePomodoro = async () => {
  minuteLeft--;

  browser.browserAction.setBadgeText({ text: minuteLeft.toString() });

  if (minuteLeft === 0) {
    clearInterval(intervalId);

    if (userParams.useNotification) {
      launchNotification();
    }

    if (userParams.forceBreak) {
      launchForceTakeABreak();
    }

    browser.browserAction.setBadgeText({ text: "" });
  }

  async function launchForceTakeABreak() {
    await browser.tabs.executeScript({ file: "appendAlert.js" });
    const tab = await browser.tabs.query({ active: true, currentWindow: true });
    browser.tabs.sendMessage(tab[0].id, { message: userParams.takeABreakMessage, breakLink: userParams.breakUrl });
  }

  function launchNotification() {
    if (browser.notifications) {
      browser.notifications.create("TimesUp", { title: userParams.takeABreakMessage, message: "Let's go !", type: "basic", iconUrl: browser.runtime.getURL("icon.png") });
    }
  }
};

browser.runtime.onInstalled.addListener(initUserPreferences);
browser.runtime.onStartup.addListener(loadUserPreferences);
browser.browserAction.onClicked.addListener(startNewPomodoro);

if (browser.notifications) {
  browser.notifications.onClicked.addListener(openPauseTab);
}