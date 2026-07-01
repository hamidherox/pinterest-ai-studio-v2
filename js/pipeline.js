async function startGeneration() {
  if (S.rows.length === 0) {
    alert("No rows loaded! Please import an Excel sheet first.");
    return;
  }

  log(`🚀 Launching production pipeline for ${S.rows.length} structural entries...`, 'info');
  let pubCount = 0;

  const subModelElement = document.getElementById('img-sub-model');
  const subModel = subModelElement ? subModelElement.value : 'flux';

  for (let i = 0; i < S.rows.length; i++) {
    const row = S.rows[i];
    log(`--------------------------------------------------`, 'info');
    log(`[Row ${i + 1}/${S.rows.length}] Processing topic: "${row.title}"`, 'info');

    let finalPinUrl = '';
    let articleUrl = '';
    let wpStatus = 'failed';

    try {
      // 1. Text Copywriting Generation
      const article = await generateArticle(row.title, row.website);
      log(`  ✓ Recipe copy generated dynamically via AI.`, 'success');

      // 2. Generate Custom Prompts from Workspace Settings Template
      const prompt1 = getCustomImagePrompt(row.title, 1);
      const prompt2 = getCustomImagePrompt(row.title, 2);

      // 3. Dual Creative Asset Generations via Choice Provider Engine
      log(`  🎨 Synthesizing primary visual creative targets...`, 'info');
      const imgUrl1 = await dispatchImageGeneration(prompt1, subModel, 1);
      log(`    ✓ Asset Image 1 route resolved: ${imgUrl1}`, 'success');

      log(`  🎨 Synthesizing variant context angle targets...`, 'info');
      const imgUrl2 = await dispatchImageGeneration(prompt2, subModel, 2);
      log(`    ✓ Asset Image 2 route resolved: ${imgUrl2}`, 'success');

      // 4. Connect to Placid Composite Canvas Engine
      try {
        log('  Sending variant images to Placid Studio...', 'info');
        finalPinUrl = await generatePlacidComposite(row.title, imgUrl1, imgUrl2);
        log('  ✓ Placid high-resolution multi-layer pin generated!', 'success');
      } catch (placidErr) {
        log(`  ❌ Placid layout compilation failed: ${placidErr.message}. Defaulting to Image 1 route.`, 'warn');
        finalPinUrl = imgUrl1;
      }

      // 5. Handle WordPress Publishing Pipeline
      const wpElement = document.getElementById('enable-wp');
      const doWP = wpElement ? wpElement.checked : true;

      if (doWP) {
        const site = getSite(row.website);
        if (site) {
          let mediaId = null;
          let finalPinUrlHtml = '';

          if (finalPinUrl) {
            log('  Uploading Placid Final Pin to WordPress Media Library...', 'info');
            const m = await uploadUrlToWP(finalPinUrl, row.title, site);
            mediaId = m.id; 
            if (mediaId) {
              log('  ✓ Placid Pin attached as active Featured Image Thumbnail.', 'success');
            }
            
            finalPinUrlHtml = `<div class="recipe-featured-image-wrapper" style="margin-bottom:30px; text-align:center;">
              <img src="${finalPinUrl}" alt="${row.title}" class="wp-post-image recipe-main-img" style="width:100%; max-width:800px; height:auto; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.08);" />
            </div>`;
          }
          
          let contentWithImages = article.html;
          if (contentWithImages.includes('[TOP_FEATURED_IMAGE_PLACEHOLDER]')) {
            contentWithImages = contentWithImages.replace('[TOP_FEATURED_IMAGE_PLACEHOLDER]', finalPinUrlHtml);
          } else {
            contentWithImages = finalPinUrlHtml + contentWithImages;
          }

          const linkedArticle = { ...article, html: injectLinks(contentWithImages) };
          const wp = await publishPostWP(linkedArticle, mediaId, site);
          if (wp.url) { 
            articleUrl = wp.url; 
            wpStatus = 'published'; 
            pubCount++; 
            log(`  ✓ Luxury Article Published: ${wp.url}`, 'success'); 
          }
        } else {
          log(`  ❌ Missing credentials configuration entry matching target profile: ${row.website}`, 'error');
        }
      }

      // 6. Append to Local Workboard State
      S.posts.push({
        title: row.title,
        imageUrl: finalPinUrl,
        board: row.board,
        description: article.description,
        articleUrl: articleUrl,
        date: new Date().toISOString().split('T')[0],
        keywords: article.keywords
      });

    } catch (rowErr) {
      log(`❌ Critical Pipeline Crash on Row ${i + 1}: ${rowErr.message}`, 'error');
    }

    updateUI();
  }

  log(`==================================================`, 'info');
  log(`🏁 Generation Cycle Complete! ${pubCount} posts deployed.`, 'success');
  showToast(`Success! Generated ${pubCount} blog entries.`);
}

function injectLinks(html) {
  return html;
}

function updateUI() {
  document.getElementById('stat-published').textContent = S.posts.length;
  document.getElementById('stat-images').textContent = S.posts.filter(p => p.imageUrl).length;

  let html = '';
  S.posts.forEach((p, index) => {
    html += `<tr>
      <td>${index + 1}</td>
      <td><strong>${p.title}</strong></td>
      <td><span class="badge">${p.board}</span></td>
      <td><a href="${p.imageUrl}" target="_blank">View Pin Image</a></td>
      <td>${p.articleUrl ? `<a href="${p.articleUrl}" target="_blank" class="success-link">View Post Link</a>` : '<span style="color:var(--muted)">Skipped</span>'}</td>
    </tr>`;
  });
  
  if(html) {
    document.getElementById('preview-tbody').innerHTML = html;
  }
}
