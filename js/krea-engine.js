// Parse your visual layout context string matching workspace templates
function getCustomImagePrompt(recipeTitle, variantIndex) {
  const template = S.config.promptTpl || 'food photography, [$title]::1, tilt shift, branding composition';
  let prompt = template.replace('[$title]', recipeTitle);
  if (variantIndex === 2) prompt += ", alternative close-up angle asset";
  return prompt;
}

/**
 * Global Asynchronous Krea AI Image Synthesizer
 * Submits job -> Polls until completed -> Returns final URL asset
 */
async function dispatchImageGeneration(prompt, subModel, variantIndex) {
  const apiKey = (S.config.kreaApiKey || '').trim();
  if (!apiKey) {
    throw new Error("Krea API token is missing from your configuration workspace settings.");
  }

  let selectedModel = "image/krea/krea-2/medium";
  if (subModel && subModel.includes("large")) {
    selectedModel = "image/krea/krea-2/large";
  }

  log(`  🎨 Submitting job request to Krea Pipeline [Model: ${selectedModel}]...`, 'info');

  const baseGenerateUrl = "https://api.krea.ai/v1/image/generate";
  const proxyGenerateUrl = "https://corsproxy.io/?" + encodeURIComponent(baseGenerateUrl);

  // 1. Submit the Creation Job
  const submitResponse = await fetch(proxyGenerateUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      model: selectedModel,
      prompt: prompt,
      aspect_ratio: "2:3",
      resolution: "1K"
    })
  });

  if (!submitResponse.ok) {
    const errorText = await submitResponse.text();
    throw new Error(`Krea Job Submission Failed (${submitResponse.status}): ${errorText.substring(0, 100)}`);
  }

  const jobInfo = await submitResponse.json();
  // Extract tracking Job ID (Supports direct id or nested within data object)
  const jobId = jobInfo.id || jobInfo.data?.id;
  
  if (!jobId) {
    throw new Error("Krea accepted the generation data request, but failed to return a tracking Job ID.");
  }

  log(`  ⏳ Job accepted! ID: ${jobId}. Waiting for image synthesis to complete...`, 'info');

  // 2. Poll the Job Status until completion
  const baseStatusUrl = `https://api.krea.ai/v1/jobs/${jobId}`;
  const proxyStatusUrl = "https://corsproxy.io/?" + encodeURIComponent(baseStatusUrl);
  
  let attempts = 0;
  const maxAttempts = 30; // Max out at 60 seconds (2s * 30)
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between cycles
    attempts++;

    const statusResponse = await fetch(proxyStatusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!statusResponse.ok) continue; // If proxy blips, don't crash, keep polling

    const statusData = await statusResponse.json();
    const currentStatus = statusData.status || statusData.data?.status;

    if (currentStatus === 'completed' || currentStatus === 'succeeded') {
      const payload = statusData.data || statusData;
      const finalImgUrl = payload.urls?.[0] || payload.output?.[0] || payload.uri || payload.url;
      
      if (finalImgUrl) {
        log(`  ✓ Image generated successfully!`, 'success');
        return finalImgUrl;
      }
    } else if (currentStatus === 'failed') {
      throw new Error(`Krea background worker reported a synthesis error on job execution loop.`);
    }
  }

  throw new Error("Image synthesis timed out on Krea distribution servers after 60 seconds.");
}

// Dedicated configuration connectivity check for Text/OpenAI engine tokens
async function testAIConnection() {
  saveConfig();
  const apikey = (S.config.apikey || '').trim();
  if (!apikey) { 
    alert("❌ OpenAI API Key is empty."); 
    return; 
  }
  
  log(`[DEBUG] Validating text engine gateway connection...`, 'info');
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apikey}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Ping' }], max_tokens: 5 })
    });
    if (!res.ok) { 
      alert(`❌ Connection failed with status ${res.status}`); 
    } else { 
      alert("✓ Connected successfully to OpenAI text engine."); 
    }
  } catch (e) { 
    log(`[DEBUG ERROR] ${e.message}`, 'error'); 
  }
}
