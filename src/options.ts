import browser = require('webextension-polyfill');
import { UserPreferences } from './background';

type UserPrefHtmlElement = {
    [property in keyof UserPreferences]: HTMLInputElement;
};

function getHtmlElements(): UserPrefHtmlElement {
    return {
        pomodoroDurationInMin: document.querySelector("#pomodoroDurationInMin") as HTMLInputElement,
        takeABreakMessage: document.querySelector("#takeABreakMessage") as HTMLInputElement,
        breakUrl: document.querySelector("#breakUrl") as HTMLInputElement,
        useNotification: document.querySelector("#useNotification") as HTMLInputElement,
        forceBreak: document.querySelector("#forceBreak") as HTMLInputElement,
    }
}

function saveOptions(e) {
    const elements = getHtmlElements();
    browser.storage.local.set({
        "userPreferences": {
            pomodoroDurationInMin: elements.pomodoroDurationInMin.value,
            breakUrl: elements.breakUrl.value,
            useNotification: elements.useNotification.checked,
            forceBreak: elements.forceBreak.checked,
            takeABreakMessage: elements.takeABreakMessage.value
        }
    }).then(() => {
        let alert = document.querySelector("#user-pref-saved") as HTMLElement;       
        alert.style.display = "block";
    });
    e.preventDefault();
}

function restoreOptions() {
    var storageItem = browser.storage.local.get('userPreferences');

    storageItem.then((res) => {
        const userPref = res.userPreferences;
        const elements = getHtmlElements();

        elements.pomodoroDurationInMin.value = userPref.pomodoroDurationInMin;
        elements.takeABreakMessage.value = userPref.takeABreakMessage;
        elements.breakUrl.value = userPref.breakUrl;
        elements.useNotification.checked = userPref.useNotification;
        elements.forceBreak.checked = userPref.forceBreak;

        let durationValue = document.getElementById("pomodoroDurationValue") as HTMLElement;
        durationValue.innerText = userPref.pomodoroDurationInMin;
    });
}

function changePomodoroDuration(e) {
    let durationValue = document.getElementById("pomodoroDurationValue") as HTMLElement;
    durationValue.innerText = e.target.value;
}

document.getElementById("pomodoroDurationInMin").addEventListener("input", changePomodoroDuration);
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);