const DEBUG = true;

// Listener for new history items
browser.history.onVisited.addListener(historyItem => {
    if (DEBUG) console.log('New history item:', historyItem);

    const { id, Url, title, lastVisitTime, visitCount } = historyItem;
    sendHistoryData({ id, URL: Url, title, lastVisitTime, visitCount });
});

async function getEndpointURL() {
    return new Promise((resolve) => {
        // Check if a policy-defined endpoint is set
        browser.storage.managed.get('endpointURL', (result) => {
            if (result && result.endpointURL) {
                resolve(result);
            } else {
                // Fallback to user-defined endpoint
                browser.storage.local.get('endpointURL', (result) => {
                    resolve(result ? result.endpointURL : null || '');
                });
            }
        });
    });
}

// Function to send history data to the endpoint
async function sendHistoryData(data) {
    try {
        const endpointURL = await getEndpointURL();
        if (!endpointURL) {
            if(DEBUG) console.warn('Endpoint URL is not set. Skipping sending history data.');
            return;
        }

        const response = await fetch(endpointURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error('Failed to send history data:', response.statusText);
        }

        if(DEBUG) console.log(`sent history data to `,endpointURL,data)
    } catch (error) {
        console.error('Error sending history data:', error);
    }
}