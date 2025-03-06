let webhookURL = "YOUR_DISCORD_WEBHOOK_URL"; // Replace with your Discord Webhook URL

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
            let time = getTime();
            if(time < 1){
                sendWebhook("Reaped");
            }
        }, 200);
    })(100, 362); //change these vals (in seconds) if you want.
})();
