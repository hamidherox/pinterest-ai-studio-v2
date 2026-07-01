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

  // Map the dropdown clean values to Krea's exact string expectations
  // Krea expects "krea-2/medium" or "krea-2/large" inside the model field
  let selectedModel = "krea-2/medium";
  if (subModel && subModel.includes("large")) {
    selectedModel = "krea-2/large";
  }

  log(`  🎨 Dispatching prompt directly to Krea Core Pipeline [Model: ${selectedModel}]...`, 'info');

  // Direct target endpoint without using corsproxy.io
  const targetUrl = "https://api.krea.ai/v1/image/generate";

  const response = await fetch(targetUrl, {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Krea Gateway Error (Status ${response.status}): ${errorText.substring(0, 150)}`);
  }

  const result = await response.json();
  
  // Extract URL from Krea response payload
  const finalImgUrl = result.data?.urls?.[0] || result.data?.[0]?.uri || result.data?.[0]?.url || result.url || result.uri;
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
