// Parse your visual layout context string matching workspace templates
function getCustomImagePrompt(recipeTitle, variantIndex) {
  const template = S.config.promptTpl || 'food photography, [$title]::1, tilt shift, branding composition';
  let prompt = template.replace('[$title]', recipeTitle);
  
  if (variantIndex === 2) {
    prompt += ", alternative close-up angle asset";
  }
  return prompt;
}

/**
 * Global Direct Krea AI Image Synthesizer
 */
async function dispatchImageGeneration(prompt, subModel, variantIndex) {
  const apiKey = (S.config.kreaApiKey || '').trim();
  if (!apiKey) {
    throw new Error("Krea API token is missing from your configuration workspace settings.");
  }

  // Fallback to standard medium route if choice parameter is empty
  const selectedModel = subModel || 'krea/krea-2/medium';

  log(`  🎨 Dispatching prompt directly to Krea Endpoints [${selectedModel}]...`, 'info');

  const proxyUrl = "https://corsproxy.io/?";
  const targetUrl = `https://api.krea.ai/v1/image/${selectedModel}`;

  const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      input: {
        prompt: prompt,
        aspect_ratio: "2:3", 
        resolution: "1K"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Krea Gateway Error (Status ${response.status}): ${errorText.substring(0, 150)}`);
  }

  const result = await response.json();
  
  // Safely extract the valid URL string out of Krea's response body array wrapper
  const finalImgUrl = result.data?.urls?.[0] || result.data?.[0]?.uri || result.data?.[0]?.url || result.url;
  if (!finalImgUrl) {
    throw new Error("Krea API call executed successfully, but no valid image asset URL string was returned.");
  }
  
  return finalImgUrl;
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
