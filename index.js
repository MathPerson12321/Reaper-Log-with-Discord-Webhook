let webhookURL = "https://discord.com/api/webhooks/1347016202530328588/A7P9G1H-A_iw847pBPADBj6lWDoCjcyD8OpzrIiFDIu0iAWidpBudELEZkL5Xylz5lU6"; // Replace with your Discord Webhook URL
let lastReap = "";

function getTime(){ //Get timer from jQuery selector
    const count = $("#last-reap")[0].textContent.split(' '); //get time and set into text array
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
    const match = str.match(/(\d+ minutes, \d+ seconds)$/);
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
            let content =document.getElementById("recent-reaps").children[1];
            if(content != lastReap){
                let timereaped = getTime(extractLastTime(content.textContent));
                let username = extractUsername(content.textContent);
                let bonus = extractBonus(content.textContent);
                let message = "";
                if(bonus == null){
                    message = username + " reaped " + timereaped + " seconds raw.";
                }else{
                    message = username + " reaped " + timereaped + " seconds with a " + bonus;
                }
                sendWebhook(message);
                lastReap = content;
            }
        }, 200);
    })(100, 362); //change these vals (in seconds) if you want.
})();
