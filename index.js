let webhookURL = "https://discord.com/api/webhooks/1347016202530328588/A7P9G1H-A_iw847pBPADBj6lWDoCjcyD8OpzrIiFDIu0iAWidpBudELEZkL5Xylz5lU6"; // Replace with your Discord Webhook URL
let lastReap = document.getElementById("recent-reaps").children[1];
let pingmintime = 900;

function getTime(timestr){ //Get timer from jQuery selector
    const count = timestr.split(" ");
    while(count.length > 4){
        count.pop();
    }
    if(count.length === 4){ // count = [num_min: str]['minutes, '][num_sec: str]['seconds, ']
        return parseInt(count[0], 10) * 60 + parseInt(count[2], 10); //minutes val to base10, multiply by 60 and add to seconds val for seconds
    } else if(count.length === 2 && ((count[1] == "minute") || (count[1] == "minutes"))){
        return parseInt(count[0], 10) * 60;
    } else if(count.length === 6){
        return parseInt(count[0], 10) * 3600 + parseInt(count[2], 10) * 60 + parseInt(count[4], 10);
    } else if(count.length === 2 && ((count[1] == "hour") || (count[1] == "hours"))){
        return parseInt(count[0], 10) * 3600;
    }
    return parseInt(count[0], 10); //else return just pure seconds
}

function extractLastTime(str) {
    const match = str.match(/(?<=gained\s)(.*)/);
    return match ? match[0] : null;
}

function extractUsername(str) {
    const match = str.match(/^(\S+)/);
    return match ? match[1] : null;
}

function extractBonus(str) {
    const match = str.match(/(\bTriple Reap!\b)$/); // Looks for "Triple Reap!" at the end
    return match ? match[0] : null;
}

function extractTimeFromString(inputString) {
  // Regular expression to match the time format HH:MM:SS
  const timeRegex = /\b\d{2}:\d{2}:\d{2}\b/;
  
  const match = inputString.match(timeRegex);
  
  if (match) {
    return match[0]; // Return the time in HH:MM:SS format
  } else {
    return null; // Return null if no time is found
  }
}

function sendWebhook(message){
    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: message
        })
    }).then(response => {
        if (response.ok) {
            console.log("Message sent successfully!");
        } else {
            console.log("Error sending message:", response);
        }
    });
}

(function() {
    (function awaitTimeAndReap(n, f){ //params: n is time for reap (s), f is time for free reap (s)
        setInterval(() => {
            let content = document.getElementById("recent-reaps").children[1];
            if(content != lastReap){
                let timereaped = extractLastTime(content.textContent);
                let username = extractUsername(content.textContent);
                let bonus = extractBonus(content.textContent);
                let message = "";
                if(bonus == null){
                    message = username + " reaped " + timereaped + " (" + getTime(timereaped) + " seconds).";
                }else{
                    message = username + " reaped " + timereaped + " (" + getTime(timereaped) + " seconds) with a " + bonus + ".";
                }
                const today = new Date();
                const [hours, minutes, seconds] = content.textContent.split(':').map(Number);
                const timeDate = new Date(today.setHours(hours, minutes, seconds, 0));
                const unixTimestamp = Math.floor(timeDate.getTime() / 1000);
                message += " Reaped at <t:"+unixTimestamp+":d>, <t:"+unixTimestamp+":T>";
                sendWebhook(message);
                lastReap = content;
            }
            let pingsent = false;
            if(getTime(document.getElementById("last-reap").textContent) > pingmintime && getTime(document.getElementById("last-reap").textContent) % 60 < 1 && pingsent == false){
                sendWebhook("@everyone Timer is at " + getTime(document.getElementById("last-reap").textContent) + " seconds.");
                pingsent = true
            }else if(getTime(document.getElementById("last-reap").textContent) % 60 > 2){
                pingsent = false
            }
        }, 200);
    })(100, 362); //change these vals (in seconds) if you want.
})();
