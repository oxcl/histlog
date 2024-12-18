document.addEventListener('DOMContentLoaded', async () => {
    const endpointInput = document.getElementById('endpoint');
    const saveButton = document.getElementById('save');
  
    const isLocked = await new Promise((resolve) => {
      browser.storage.managed.get('endpointURL', (result) => {
        if(result) resolve(true);
        resolve(false);
      });
    });
  
    if (isLocked) {
      endpointInput.disabled = true;
      saveButton.disabled = true;
      endpointInput.value = "Set by the System Administrator"
      return;
    }
    endpointInput.disabled = false;
    saveButton.disabled = false;
    
  
    // Load saved endpoint URL
    browser.storage.local.get('endpointURL', (result) => {
      if (result.endpointURL) {
        endpointInput.value = result.endpointURL;
      }
    });

    endpointInput.addEventListener('change',()=> {
        saveButton.disabled = false;
        saveButton.value = "Save"
    })
  
    // Save endpoint URL
    saveButton.addEventListener('click', () => {
      const endpointURL = endpointInput.value;
      browser.storage.local.set({ endpointURL }, () => {
        saveButton.disabled = true;
        saveButton.innerText = "Saved"
      });
    });
  });
  