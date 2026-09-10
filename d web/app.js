/**
 * RS - ANTI-GRAVITY E-COMMERCE & DROPSHIPPING RESOURCE HUB
 * Interactive Physics, Calculators, Blueprints & Dynamic Telemetry
 */

const App = (() => {
  'use strict';

  // --- Safe LocalStorage State Retrieval ---
  let initialBookmarks = [];
  try {
    initialBookmarks = JSON.parse(localStorage.getItem('RS_bookmarks') || '[]');
  } catch (err) {
    initialBookmarks = [];
  }

  // --- State Store ---
  const state = {
    bookmarks: initialBookmarks,
    activeCalcTab: 'profit-calc',
    activeTutorialCategory: 'all',
    activeSupplierFilter: 'all',
    activePipelineStep: 1,
    pipelineAutoplayInterval: null,
    get guidesData() {
      return window.GUIDES_DATA || {};
    }
  };

  // --- Initialize Application ---
  const init = () => {
    const modules = [
      ['initCanvasGravity', initCanvasGravity],
      ['init3DTilt', init3DTilt],
      ['initProfitCalculator', initProfitCalculator],
      ['initShippingCalculator', initShippingCalculator],
      ['initNicheScanner', initNicheScanner],
      ['initTutorialFilters', initTutorialFilters],
      ['initGuideModals', initGuideModals],
      ['initBookmarks', initBookmarks],
      ['initSupplierSearch', initSupplierSearch],
      ['initPipelineVisualizer', initPipelineVisualizer],
      ['initStandaloneReader', initStandaloneReader],
      ['initFaqAccordion', initFaqAccordion],
      ['initModals', initModals],
      ['initMobileMenu', initMobileMenu],
      ['initTimedMonetizationEngine', initTimedMonetizationEngine],
      ['updateBookmarkBadge', updateBookmarkBadge]
    ];

    modules.forEach(([name, fn]) => {
      try {
        if (typeof fn === 'function') fn();
      } catch (err) {
        console.warn(`[RS] Module ${name} encountered an issue:`, err);
      }
    });
  };

  // =========================================================================
  // 1. Dynamic Canvas Gravity Particle System
  // =========================================================================
  const initCanvasGravity = () => {
    const canvas = document.getElementById('gravity-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const isMobile = window.innerWidth < 768;
    const numParticles = isMobile ? 18 : Math.min(Math.floor((width * height) / 16000), 65);

    let mouse = { x: width / 2, y: height / 2, active: false };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    const particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.hue = Math.random() > 0.6 ? 190 : 250; // Cyan or Indigo
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse gentle gravitational pull / repulsion
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            this.x += (dx / dist) * force * 1.2;
            this.y += (dy / dist) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${this.hue}, 90%, 60%, 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    let isAnimationActive = true;
    const animate = () => {
      if (!isAnimationActive) return;
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle zero-gravity filaments
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    // Page Visibility API: Pause animation in background to guarantee Zero-G Speed & save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isAnimationActive = false;
      } else {
        if (!isAnimationActive) {
          isAnimationActive = true;
          requestAnimationFrame(animate);
        }
      }
    });

    requestAnimationFrame(animate);
  };

  // =========================================================================
  // 2. 3D Parallax Tilt Physics on Cards & Hero Stage
  // =========================================================================
  const init3DTilt = () => {
    const cards = document.querySelectorAll('.tilt-card');
    const heroStage = document.getElementById('hero-3d-stage');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });

    if (heroStage) {
      window.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const rotateX = ((e.clientY - centerY) / centerY) * -6;
        const rotateY = ((e.clientX - centerX) / centerX) * 6;

        heroStage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    }
  };

  // =========================================================================
  // 3. Profit Margin & ROAS Engine Calculator
  // =========================================================================
  const initProfitCalculator = () => {
    const sellPriceInp = document.getElementById('inp-sell-price');
    const cogsInp = document.getElementById('inp-cogs');
    const shippingInp = document.getElementById('inp-shipping');
    const adSpendInp = document.getElementById('inp-ad-spend');
    const feeRateInp = document.getElementById('inp-fee-rate');
    const volumeInp = document.getElementById('inp-volume');

    if (!sellPriceInp) return;

    const inputs = [sellPriceInp, cogsInp, shippingInp, adSpendInp, feeRateInp, volumeInp];
    inputs.forEach((input) => {
      input.addEventListener('input', calculateProfit);
    });

    // 1-Click Presets
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        if (preset === 'tiktok-gadget') {
          sellPriceInp.value = '29.99';
          cogsInp.value = '4.80';
          shippingInp.value = '4.20';
          adSpendInp.value = '9.50';
          feeRateInp.value = '3.5';
          volumeInp.value = '1500';
        } else if (preset === 'high-ticket') {
          sellPriceInp.value = '129.00';
          cogsInp.value = '28.00';
          shippingInp.value = '12.50';
          adSpendInp.value = '34.00';
          feeRateInp.value = '3.0';
          volumeInp.value = '400';
        } else if (preset === 'apparel') {
          sellPriceInp.value = '48.00';
          cogsInp.value = '11.50';
          shippingInp.value = '5.00';
          adSpendInp.value = '15.00';
          feeRateInp.value = '3.5';
          volumeInp.value = '850';
        } else if (preset === 'beauty') {
          sellPriceInp.value = '39.00';
          cogsInp.value = '5.20';
          shippingInp.value = '4.50';
          adSpendInp.value = '12.00';
          feeRateInp.value = '3.5';
          volumeInp.value = '1200';
        }
        calculateProfit();
        showToast(`Preset "${btn.textContent.trim()}" applied!`);
      });
    });

    calculateProfit();
  };

  const calculateProfit = () => {
    const sellPriceInp = document.getElementById('inp-sell-price');
    const cogsInp = document.getElementById('inp-cogs');
    const shippingInp = document.getElementById('inp-shipping');
    const adSpendInp = document.getElementById('inp-ad-spend');
    const feeRateInp = document.getElementById('inp-fee-rate');
    const volumeInp = document.getElementById('inp-volume');

    if (!sellPriceInp) return;

    const sellPrice = parseFloat(sellPriceInp.value) || 0;
    const cogs = parseFloat(cogsInp.value) || 0;
    const shipping = parseFloat(shippingInp.value) || 0;
    const adSpend = parseFloat(adSpendInp.value) || 0;
    const feeRate = parseFloat(feeRateInp.value) || 0;
    const volume = parseInt(volumeInp.value, 10) || 1;

    const feeAmount = sellPrice * (feeRate / 100);
    const totalCostPerUnit = cogs + shipping + adSpend + feeAmount;
    const netUnitProfit = sellPrice - totalCostPerUnit;
    const netMarginPct = sellPrice > 0 ? (netUnitProfit / sellPrice) * 100 : 0;

    // Break-even ROAS = Sell Price / (Sell Price - COGS - Shipping - Fees)
    const marginBeforeAds = sellPrice - cogs - shipping - feeAmount;
    const breakEvenRoas = marginBeforeAds > 0 ? (sellPrice / marginBeforeAds).toFixed(2) : 'N/A';
    const currentRoas = adSpend > 0 ? (sellPrice / adSpend).toFixed(2) : '∞';

    const monthlyGmv = sellPrice * volume;
    const monthlyNet = netUnitProfit * volume;

    // Update DOM
    const netUnitProfitEl = document.getElementById('out-net-unit-profit');
    const marginBadgeEl = document.getElementById('out-margin-badge');
    const breakevenRoasEl = document.getElementById('out-breakeven-roas');
    const currentRoasEl = document.getElementById('out-current-roas');
    const monthlyGmvEl = document.getElementById('out-monthly-gmv');
    const monthlyNetEl = document.getElementById('out-monthly-net');

    if (netUnitProfitEl) {
      netUnitProfitEl.textContent = `$${netUnitProfit.toFixed(2)}`;
      netUnitProfitEl.style.color = netUnitProfit >= 0 ? '#10b981' : '#f43f5e';
    }

    if (marginBadgeEl) {
      if (netMarginPct >= 28) {
        marginBadgeEl.className = 'output-margin-badge badge-healthy';
        marginBadgeEl.textContent = `${netMarginPct.toFixed(1)}% Net Margin (High Performance)`;
      } else if (netMarginPct >= 15) {
        marginBadgeEl.className = 'output-margin-badge badge-warning';
        marginBadgeEl.textContent = `${netMarginPct.toFixed(1)}% Net Margin (Moderate Buffer)`;
      } else {
        marginBadgeEl.className = 'output-margin-badge badge-danger';
        marginBadgeEl.textContent = `${netMarginPct.toFixed(1)}% Net Margin (High CAC Risk)`;
      }
    }

    if (breakevenRoasEl) breakevenRoasEl.textContent = `${breakEvenRoas}x`;
    if (currentRoasEl) currentRoasEl.textContent = `${currentRoas}x`;
    if (monthlyGmvEl) monthlyGmvEl.textContent = `$${monthlyGmv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (monthlyNetEl) {
      monthlyNetEl.textContent = `$${monthlyNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      monthlyNetEl.style.color = monthlyNet >= 0 ? '#10b981' : '#f43f5e';
    }

    // Dynamic Stacked Bar Progress Calculation
    if (sellPrice > 0) {
      const cogsPct = Math.max(0, Math.min(100, (cogs / sellPrice) * 100));
      const shipPct = Math.max(0, Math.min(100, (shipping / sellPrice) * 100));
      const adsPct = Math.max(0, Math.min(100, (adSpend / sellPrice) * 100));
      const feesPct = Math.max(0, Math.min(100, (feeAmount / sellPrice) * 100));
      const marginPct = Math.max(0, Math.min(100, (netUnitProfit / sellPrice) * 100));

      const barCogs = document.getElementById('bar-cogs');
      const barShipping = document.getElementById('bar-shipping');
      const barAds = document.getElementById('bar-ads');
      const barFees = document.getElementById('bar-fees');
      const barMargin = document.getElementById('bar-margin');

      if (barCogs) barCogs.style.width = `${cogsPct}%`;
      if (barShipping) barShipping.style.width = `${shipPct}%`;
      if (barAds) barAds.style.width = `${adsPct}%`;
      if (barFees) barFees.style.width = `${feesPct}%`;
      if (barMargin) barMargin.style.width = `${marginPct}%`;
    }
  };

  // =========================================================================
  // 4. Volumetric Shipping Estimator
  // =========================================================================
  const initShippingCalculator = () => {
    const lengthInp = document.getElementById('inp-ship-length');
    const widthInp = document.getElementById('inp-ship-width');
    const heightInp = document.getElementById('inp-ship-height');
    const weightInp = document.getElementById('inp-ship-weight');

    if (!lengthInp) return;

    const shipInputs = [lengthInp, widthInp, heightInp, weightInp];
    shipInputs.forEach((input) => {
      input.addEventListener('input', calculateShipping);
    });

    calculateShipping();
  };

  const calculateShipping = () => {
    const lInp = document.getElementById('inp-ship-length');
    const wInp = document.getElementById('inp-ship-width');
    const hInp = document.getElementById('inp-ship-height');
    const weightInp = document.getElementById('inp-ship-weight');

    if (!lInp) return;

    const l = parseFloat(lInp.value) || 10;
    const w = parseFloat(wInp.value) || 10;
    const h = parseFloat(hInp.value) || 10;
    const actualGrams = parseFloat(weightInp.value) || 300;

    // Standard courier DIM divisor (6000 for standard air express, result in grams)
    const volumetricGrams = Math.round((l * w * h) / 6000 * 1000);
    const chargeableGrams = Math.max(actualGrams, volumetricGrams);

    const outVolWeight = document.getElementById('out-volumetric-weight');
    if (outVolWeight) {
      const isVolumetricCharge = volumetricGrams > actualGrams;
      outVolWeight.textContent = `${chargeableGrams}g (${isVolumetricCharge ? 'Volumetric Charge' : 'Actual Weight'})`;
      outVolWeight.style.color = isVolumetricCharge ? '#f59e0b' : '#06b6d4';
    }

    // Rate calculations (benchmarked on China to US air lines)
    const yunRate = (2.20 + (chargeableGrams / 100) * 0.70).toFixed(2);
    const cneRate = (2.50 + (chargeableGrams / 100) * 0.76).toFixed(2);
    const dhlRate = (12.00 + (chargeableGrams / 100) * 1.65).toFixed(2);
    const seaRate = (0.60 + (chargeableGrams / 100) * 0.18).toFixed(2);

    const tierYun = document.getElementById('tier-yunexpress');
    const tier4px = document.getElementById('tier-4px');
    const tierDhl = document.getElementById('tier-dhl');
    const tierSea = document.getElementById('tier-sea');

    if (tierYun) tierYun.textContent = `$${yunRate}`;
    if (tier4px) tier4px.textContent = `$${cneRate}`;
    if (tierDhl) tierDhl.textContent = `$${dhlRate}`;
    if (tierSea) tierSea.textContent = `$${seaRate}`;
  };

  // =========================================================================
  // 5. Niche Feasibility Scorecard Quiz
  // =========================================================================
  const initNicheScanner = () => {
    const calcBtn = document.getElementById('btn-calc-niche');
    if (!calcBtn) return;

    const runScorecard = () => {
      const q1El = document.getElementById('niche-q1');
      const q2El = document.getElementById('niche-q2');
      const q3El = document.getElementById('niche-q3');
      const q4El = document.getElementById('niche-q4');

      if (!q1El || !q2El || !q3El || !q4El) return;

      const q1 = parseInt(q1El.value, 10) || 3;
      const q2 = parseInt(q2El.value, 10) || 3;
      const q3 = parseInt(q3El.value, 10) || 3;
      const q4 = parseInt(q4El.value, 10) || 3;

      const totalPoints = q1 + q2 + q3 + q4; // Max 12, Min 4
      const score = Math.round((totalPoints / 12) * 100);

      const scoreVal = document.getElementById('niche-score-val');
      const verdictBadge = document.getElementById('niche-verdict-badge');
      const feedbackText = document.getElementById('niche-feedback-text');

      if (scoreVal) scoreVal.innerHTML = `${score}<span style="font-size:1.5rem; color:var(--text-muted);">/100</span>`;

      if (verdictBadge && feedbackText) {
        if (score >= 85) {
          verdictBadge.className = 'output-margin-badge badge-healthy';
          verdictBadge.textContent = '🚀 Prime Unicorn Winner';
          feedbackText.textContent = 'This item exhibits exceptional viral demonstration dynamics, strong margin buffer against rising ad CACs, and minimal return friction. Greenlight for testing!';
        } else if (score >= 65) {
          verdictBadge.className = 'output-margin-badge badge-warning';
          verdictBadge.textContent = '⚖️ Moderate Viability (Refine Creative)';
          feedbackText.textContent = 'Solid potential, but ad costs may compress margins if your video hook is not razor-sharp. Consider testing with a multi-quantity bundle (Buy 2 Get 1 Free).';
        } else {
          verdictBadge.className = 'output-margin-badge badge-danger';
          verdictBadge.textContent = '⚠️ High Risk / Unfavorable Unit Economics';
          feedbackText.textContent = 'High return risk, fragile parcel shipping penalties, or weak margin markup potential. Recommend pivoting to a higher perceived value variant.';
        }
      }
    };

    calcBtn.addEventListener('click', () => {
      runScorecard();
      const scoreVal = document.getElementById('niche-score-val');
      const scoreNum = scoreVal ? parseInt(scoreVal.textContent, 10) : 90;
      showToast(`Niche scored: ${scoreNum}/100`);
    });

    runScorecard();
  };

  // =========================================================================
  // 6. Tutorial Filtering, Tabs & Bookmarks
  // =========================================================================
  const initTutorialFilters = () => {
    const filterPills = document.querySelectorAll('.filter-pill[data-category]');
    const cards = document.querySelectorAll('.tutorial-card');

    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.dataset.category;
        state.activeTutorialCategory = category;

        cards.forEach((card) => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Calculator Category Switcher Tabs
    const calcTabs = document.querySelectorAll('.calc-tab-btn');
    const calcPanels = document.querySelectorAll('.calc-view-panel');

    calcTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        calcTabs.forEach((t) => t.classList.remove('active'));
        calcPanels.forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');
        const toolId = tab.dataset.tool;
        const targetPanel = document.getElementById(`panel-${toolId}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  };

  const initBookmarks = () => {
    const bookmarkBtns = document.querySelectorAll('.btn-bookmark');
    const savedHeaderBtn = document.getElementById('saved-bookmarks-btn');

    bookmarkBtns.forEach((btn) => {
      const guideId = btn.dataset.target;
      if (state.bookmarks.includes(guideId)) {
        btn.classList.add('bookmarked');
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(guideId, btn);
      });
    });

    if (savedHeaderBtn) {
      savedHeaderBtn.addEventListener('click', () => {
        if (state.bookmarks.length === 0) {
          showToast('No saved blueprints yet! Tap the bookmark icon on any guide.');
        } else {
          showToast(`You have ${state.bookmarks.length} saved blueprints in your vault.`);
        }
      });
    }
  };

  const toggleBookmark = (guideId, btnElement) => {
    const index = state.bookmarks.indexOf(guideId);
    if (index > -1) {
      state.bookmarks.splice(index, 1);
      btnElement.classList.remove('bookmarked');
      showToast('Guide removed from saved blueprints.');
    } else {
      state.bookmarks.push(guideId);
      btnElement.classList.add('bookmarked');
      showToast('Guide saved to your offline blueprint vault! ⭐');
    }
    try {
      localStorage.setItem('RS_bookmarks', JSON.stringify(state.bookmarks));
    } catch (e) {
      // Ignore localStorage errors
    }
    updateBookmarkBadge();
  };

  const updateBookmarkBadge = () => {
    const countEl = document.getElementById('bookmark-count');
    if (countEl) {
      countEl.textContent = state.bookmarks.length;
    }
  };

  // =========================================================================
  // 7. In-Depth Guide Viewer Modal with 10-Page Masterclass Reader & Anti-Gravity Download Button
  // =========================================================================
  let currentActiveGuide = null;
  let currentActivePageNum = 1;

  const initGuideModals = () => {
    const guideModal = document.getElementById('guide-modal');
    const guideModalClose = document.getElementById('guide-modal-close');

    // Delegated click handler for any .read-guide-btn across entire document
    document.addEventListener('click', (e) => {
      const guideBtn = e.target.closest('.read-guide-btn');
      if (guideBtn && guideBtn.dataset.guideId) {
        e.preventDefault();
        const guideId = guideBtn.dataset.guideId;
        openGuideReader(guideId, 1);
      }
    });

    if (guideModalClose && guideModal) {
      guideModalClose.addEventListener('click', () => {
        guideModal.classList.remove('active');
      });
    }
  };

  const openGuideReader = (guideId, pageNum = 1) => {
    const guides = window.GUIDES_DATA || state.guidesData;
    const guide = guides[guideId];
    const guideModal = document.getElementById('guide-modal');
    const guideModalContent = document.getElementById('guide-modal-content');

    if (!guide || !guideModal || !guideModalContent) return;

    currentActiveGuide = guideId;
    currentActivePageNum = pageNum;

    renderGuideReaderUI(guide, pageNum);
    guideModal.classList.add('active');
  };

  const renderGuideReaderUI = (guide, activePage) => {
    const guideModalContent = document.getElementById('guide-modal-content');
    if (!guideModalContent) return;

    const totalPages = guide.pages ? guide.pages.length : 10;
    const isAll = activePage === 'all';
    const activePageData = !isAll && guide.pages ? (guide.pages.find((p) => p.pageNumber === activePage) || guide.pages[0]) : null;

    // Generate navigation pills for all 10 pages
    const pillsHtml = guide.pages ? `
      <div class="bp-page-nav-track">
        <button class="bp-page-pill ${isAll ? 'active' : ''}" onclick="App.switchGuidePage('${guide.id}', 'all')">
          <span>📖 View All 10 Pages</span>
        </button>
        ${guide.pages.map((p) => `
          <button class="bp-page-pill ${!isAll && p.pageNumber === activePage ? 'active' : ''}" onclick="App.switchGuidePage('${guide.id}', ${p.pageNumber})">
            <span>Page ${p.pageNumber}</span>
          </button>
        `).join('')}
      </div>
    ` : '';

    // Generate page cards
    let pagesHtml = '';
    if (guide.pages) {
      if (isAll) {
        pagesHtml = guide.pages.map((p) => `
          <div class="bp-page-card" style="margin-bottom: 1.5rem;">
            <div class="bp-page-number-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>PAGE ${p.pageNumber} OF ${totalPages} • ${p.pageNumber === 1 ? 'COVER & OVERVIEW' : 'CHAPTER ' + (p.pageNumber - 1)}</span>
            </div>
            ${p.pageNumber > 1 ? `
              <h3 class="bp-page-title">${p.chapterTitle}</h3>
              <div class="bp-page-subtitle">${p.chapterSubtitle}</div>
            ` : ''}
            <div style="color:var(--text-body); font-size:0.95rem; line-height:1.7;">
              ${p.content}
            </div>
          </div>
        `).join('');
      } else if (activePageData) {
        pagesHtml = `
          <div class="bp-page-card">
            <div class="bp-page-number-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>PAGE ${activePageData.pageNumber} OF ${totalPages} • ${activePageData.pageNumber === 1 ? 'COVER & OVERVIEW' : 'CHAPTER ' + (activePageData.pageNumber - 1)}</span>
            </div>
            ${activePageData.pageNumber > 1 ? `
              <h3 class="bp-page-title">${activePageData.chapterTitle}</h3>
              <div class="bp-page-subtitle">${activePageData.chapterSubtitle}</div>
            ` : ''}
            <div style="color:var(--text-body); font-size:0.95rem; line-height:1.7;">
              ${activePageData.content}
            </div>
          </div>
        `;
      }
    } else {
      pagesHtml = `
        <div class="bp-page-card">
          <div style="color:var(--text-body); font-size:0.95rem; line-height:1.7;">
            ${guide.content || ''}
          </div>
        </div>
      `;
    }

    guideModalContent.innerHTML = `
      <div class="bp-reader-container">
        <div class="bp-header-bar">
          <div>
            <div class="badge-tag cyan" style="margin-bottom:0.5rem;">
              <span>${guide.badge}</span>
            </div>
            <h2 class="bp-modal-main-title">${guide.title}</h2>
          </div>

          <a href="#" 
             class="btn-anti-gravity-download btn-sm" 
             id="guide-pdf-download-btn"
             onclick="App.downloadGuidePdf('${guide.id}', event)"
             aria-label="Download ${guide.title} as 10-Page PDF Blueprint">
            <svg class="download-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download 10-Page PDF Blueprint</span>
          </a>
        </div>

        ${pillsHtml}

        <div class="bp-page-display-wrap">
          ${pagesHtml}
        </div>

        <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            ${!isAll && activePage > 1 ? `
              <button class="btn btn-secondary btn-sm" onclick="App.switchGuidePage('${guide.id}', ${activePage - 1})">
                ← Previous Page
              </button>
            ` : ''}
            ${!isAll && activePage < totalPages ? `
              <button class="btn btn-secondary btn-sm" onclick="App.switchGuidePage('${guide.id}', ${activePage + 1})">
                Next Page (${activePage + 1}/10) →
              </button>
            ` : ''}
            ${isAll ? `
              <button class="btn btn-secondary btn-sm" onclick="App.switchGuidePage('${guide.id}', 1)">
                View Single Page Mode
              </button>
            ` : ''}
          </div>

          <div style="display:flex; gap:0.75rem; align-items:center;">
            <button class="btn btn-secondary btn-sm" onclick="App.closeGuideModal()">Close</button>
            <a href="#" 
               class="btn-anti-gravity-download btn-sm" 
               onclick="App.downloadGuidePdf('${guide.id}', event)">
              <svg class="download-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download 10-Page PDF</span>
            </a>
          </div>
        </div>
      </div>
    `;
  };

  const switchGuidePage = (guideId, pageNum) => {
    const guides = window.GUIDES_DATA || state.guidesData;
    const guide = guides[guideId];
    if (!guide) return;
    currentActiveGuide = guideId;
    currentActivePageNum = pageNum;
    renderGuideReaderUI(guide, pageNum);

    const modalDialog = document.querySelector('#guide-modal .modal-dialog');
    if (modalDialog) modalDialog.scrollTop = 0;
  };

  // =========================================================================
  // 7b. Standalone Full-Page 10-Page Blueprint Reader (guide.html)
  // =========================================================================
  const initStandaloneReader = () => {
    const standaloneContainer = document.getElementById('standalone-guide-container');
    if (!standaloneContainer) return;

    // Parse URL query parameters ?id=...&page=...
    const urlParams = new URLSearchParams(window.location.search);
    const guideId = urlParams.get('id') || 'shopify-zero-to-100k';
    const pageParam = urlParams.get('page');
    const pageNum = pageParam === 'all' ? 'all' : parseInt(pageParam || '1', 10);

    loadStandaloneGuide(guideId, pageNum);
  };

  const loadStandaloneGuide = (guideId, activePage = 1) => {
    const standaloneContainer = document.getElementById('standalone-guide-container');
    if (!standaloneContainer) return;

    const guides = window.GUIDES_DATA || state.guidesData;
    const guide = guides[guideId] || guides['shopify-zero-to-100k'];
    if (!guide) return;

    // Update dropdown selector
    const guideSelect = document.getElementById('standalone-guide-select');
    if (guideSelect) {
      guideSelect.value = guide.id;
    }

    // Update document title
    document.title = `${guide.title} — 10-Page Master SOP (RS)`;

    // Update dynamic JSON-LD schema for AI Answer Engines & Search Bots
    const schemaEl = document.getElementById('guide-jsonld-schema');
    if (schemaEl) {
      schemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": guide.title,
        "description": (guide.badge || 'RS Blueprint') + ' — 10-page masterclass standard operating procedure and scaling framework.',
        "url": `https://RS.vercel.app/guide.html?id=${guide.id}`,
        "author": {
          "@type": "Organization",
          "name": "RS Intelligence",
          "url": "https://RS.vercel.app/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "RS",
          "logo": {
            "@type": "ImageObject",
            "url": "https://RS.vercel.app/logo.png"
          }
        },
        "mainEntityOfPage": `https://RS.vercel.app/guide.html?id=${guide.id}`,
        "inLanguage": "en-US"
      });
    }

    // Update PDF action slot
    const pdfSlot = document.getElementById('standalone-pdf-action-slot');
    if (pdfSlot) {
      pdfSlot.innerHTML = `
        <a href="#" 
           class="btn-anti-gravity-download btn-sm" 
           onclick="App.downloadGuidePdf('${guide.id}', event)"
           title="Download Full 10-Page Printable PDF Blueprint">
          <svg class="download-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download 10-Page PDF</span>
        </a>
      `;
    }

    const totalPages = guide.pages ? guide.pages.length : 10;
    const isAll = activePage === 'all';
    const activePageData = !isAll && guide.pages ? (guide.pages.find((p) => p.pageNumber === activePage) || guide.pages[0]) : null;

    // Generate navigation pills for all 10 pages
    const pillsHtml = guide.pages ? `
      <div class="bp-page-nav-track" style="margin-bottom:2rem;">
        <button class="bp-page-pill ${isAll ? 'active' : ''}" onclick="App.switchStandalonePage('${guide.id}', 'all')">
          <span>📖 View All 10 Pages</span>
        </button>
        ${guide.pages.map((p) => `
          <button class="bp-page-pill ${!isAll && p.pageNumber === activePage ? 'active' : ''}" onclick="App.switchStandalonePage('${guide.id}', ${p.pageNumber})">
            <span>Page ${p.pageNumber}</span>
          </button>
        `).join('')}
      </div>
    ` : '';

    // Generate page cards
    let pagesHtml = '';
    if (guide.pages) {
      if (isAll) {
        pagesHtml = guide.pages.map((p) => `
          <div class="bp-page-card" style="margin-bottom: 2rem; border-color: rgba(0, 212, 255, 0.25);">
            <div class="bp-page-number-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>PAGE ${p.pageNumber} OF ${totalPages} • ${p.pageNumber === 1 ? 'COVER & OVERVIEW' : 'CHAPTER ' + (p.pageNumber - 1)}</span>
            </div>
            ${p.pageNumber > 1 ? `
              <h3 class="bp-page-title" style="font-size:1.45rem;">${p.chapterTitle}</h3>
              <div class="bp-page-subtitle">${p.chapterSubtitle}</div>
            ` : ''}
            <div style="color:var(--text-body); font-size:0.975rem; line-height:1.75;">
              ${p.content}
            </div>
          </div>
        `).join('');
      } else if (activePageData) {
        pagesHtml = `
          <div class="bp-page-card" style="border-color: rgba(0, 212, 255, 0.35);">
            <div class="bp-page-number-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>PAGE ${activePageData.pageNumber} OF ${totalPages} • ${activePageData.pageNumber === 1 ? 'COVER & OVERVIEW' : 'CHAPTER ' + (activePageData.pageNumber - 1)}</span>
            </div>
            ${activePageData.pageNumber > 1 ? `
              <h3 class="bp-page-title" style="font-size:1.45rem;">${activePageData.chapterTitle}</h3>
              <div class="bp-page-subtitle">${activePageData.chapterSubtitle}</div>
            ` : ''}
            <div style="color:var(--text-body); font-size:0.975rem; line-height:1.75;">
              ${activePageData.content}
            </div>
          </div>
        `;
      }
    }

    standaloneContainer.innerHTML = `
      <div class="bp-reader-container">
        <div class="bp-header-bar" style="margin-bottom:1.75rem;">
          <div>
            <div class="badge-tag cyan" style="margin-bottom:0.5rem;">
              <span>${guide.badge || 'Confidential SOP'}</span>
            </div>
            <h1 class="bp-standalone-main-title">${guide.title}</h1>
          </div>
        </div>

        ${pillsHtml}

        <div class="bp-page-display-wrap ag-reading-core">
          ${pagesHtml}
        </div>

        <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            ${!isAll && activePage > 1 ? `
              <button class="btn btn-secondary btn-sm" onclick="App.switchStandalonePage('${guide.id}', ${activePage - 1})">
                ← Previous Page (${activePage - 1}/10)
              </button>
            ` : ''}
            ${!isAll && activePage < totalPages ? `
              <button class="btn btn-primary btn-sm" onclick="App.switchStandalonePage('${guide.id}', ${activePage + 1})">
                Next Page (${activePage + 1}/10) →
              </button>
            ` : ''}
            ${isAll ? `
              <button class="btn btn-secondary btn-sm" onclick="App.switchStandalonePage('${guide.id}', 1)">
                View Single Page Mode
              </button>
            ` : ''}
          </div>

          <div style="display:flex; gap:0.75rem; align-items:center;">
            <a href="blueprints.html" class="btn btn-secondary btn-sm">Back to Blueprints</a>
            <a href="#" 
               class="btn-anti-gravity-download btn-sm" 
               onclick="App.downloadGuidePdf('${guide.id}', event)">
              <svg class="download-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download 10-Page PDF</span>
            </a>
          </div>
        </div>
      </div>
    `;
  };

  const switchStandalonePage = (guideId, pageNum) => {
    loadStandaloneGuide(guideId, pageNum);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // =========================================================================
  // 8. Programmatic Direct Blob 10-Page PDF / File Downloader
  // =========================================================================
  const downloadGuidePdf = (guideId, event) => {
    if (event && event.preventDefault) event.preventDefault();
    const guides = window.GUIDES_DATA || state.guidesData;
    const guide = guides[guideId];
    if (!guide) return;

    const pages = guide.pages || [];

    // Generate comprehensive 10-page standalone printable document
    const printableDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${guide.title} - 10-Page Master Blueprint (2026 Edition)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f1d;
      color: #334155;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* Sticky Action Bar for Screen Viewing */
    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 999;
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0, 212, 255, 0.3);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 25px rgba(0,0,0,0.6);
    }
    .bar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
    }
    .bar-brand span {
      background: linear-gradient(135deg, #38bdf8, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .print-btn {
      background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
      color: #fff;
      border: none;
      padding: 10px 22px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .print-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(0, 212, 255, 0.7);
    }

    /* Multi-Page Document Container */
    .doc-container {
      max-width: 860px;
      margin: 35px auto;
      padding: 0 20px 80px 20px;
    }

    .pdf-page {
      background: #ffffff;
      color: #1e293b;
      min-height: 1120px;
      padding: 50px 55px 70px 55px;
      margin-bottom: 45px;
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
    }

    .page-running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-bottom: 24px;
      font-size: 11px;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .page-running-footer {
      position: absolute;
      bottom: 24px;
      left: 55px;
      right: 55px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 11px;
      color: #64748b;
    }

    .page-main-body {
      flex: 1;
    }

    /* Content Elements */
    h1, h2, h3, h4, h5, h6 { color: #0f172a; font-weight: 700; line-height: 1.3; }
    h4 { font-size: 16.5px; margin-bottom: 8px; color: #0f172a; }
    p { margin-bottom: 12px; font-size: 13.5px; line-height: 1.65; color: #334155; }
    
    .bp-cover-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;
    }
    .bp-cover-box .bp-tag { color: #0284c7; font-weight: 700; font-size: 12px; letter-spacing: 0.05em; margin-bottom: 8px; }
    .bp-cover-box .bp-title { font-size: 26px; color: #0f172a; margin-bottom: 6px; }
    .bp-cover-box .bp-subtitle { font-size: 14px; color: #64748b; margin-bottom: 16px; font-weight: 400; }
    
    .bp-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .bp-meta-item { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; }
    .bp-meta-item .label { font-size: 10px; text-transform: uppercase; color: #64748b; display: block; }
    .bp-meta-item .val { font-size: 13px; font-weight: 700; color: #0f172a; }

    .bp-callout { padding: 14px 16px; border-radius: 6px; margin: 14px 0; font-size: 13px; line-height: 1.6; }
    .bp-callout.cyan { background: #f0f9ff; border-left: 4px solid #0284c7; color: #0369a1; }
    .bp-callout.warning { background: #fffbeb; border-left: 4px solid #f59e0b; color: #92400e; }
    .bp-callout.emerald { background: #f0fdf4; border-left: 4px solid #10b981; color: #166534; }

    .bp-toc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; color: #334155; }
    
    .bp-table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 12px; }
    .bp-table th { background: #f1f5f9; color: #0f172a; font-weight: 700; padding: 8px 10px; text-align: left; border-bottom: 2px solid #cbd5e1; }
    .bp-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    .bp-table tr.highlight td { background: #f0f9ff; font-weight: 700; color: #0369a1; }

    .bp-code { background: #0f172a; color: #38bdf8; padding: 12px 14px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; margin: 12px 0; overflow-x: auto; }
    .bp-feature-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin: 14px 0; }
    .bp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; }
    .bp-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 12px 0; }
    .bp-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; }
    .bp-wireframe-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin: 12px 0; display: flex; flex-direction: column; gap: 6px; }
    .wf-item { background: #ffffff; border: 1px dashed #cbd5e1; padding: 6px 10px; border-radius: 4px; font-size: 12px; color: #334155; }
    .wf-item.highlight { border-color: #0284c7; background: #f0f9ff; color: #0369a1; font-weight: 600; }
    .wf-item.highlight-cta { border-color: #10b981; background: #f0fdf4; color: #166534; font-weight: 700; }
    .bp-checklist-grid { display: grid; grid-template-columns: 1fr; gap: 4px; font-size: 12px; color: #334155; }

    /* Print Specific Media Rules */
    @media print {
      body { background: #ffffff !important; padding: 0 !important; margin: 0 !important; color: #000000 !important; }
      .no-print { display: none !important; }
      .doc-container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
      .pdf-page {
        margin: 0 !important;
        padding: 30px 35px 50px 35px !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
        page-break-after: always !important;
        break-after: page !important;
        min-height: 100vh !important;
        height: 100% !important;
      }
      .page-running-footer {
        position: absolute !important;
        bottom: 15px !important;
        left: 35px !important;
        right: 35px !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 10mm 15mm 10mm;
      }
    }
  </style>
</head>
<body>
  <div class="top-action-bar no-print">
    <div class="bar-brand">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      <div>RS <span>10-Page Blueprint System</span></div>
    </div>
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="color:#94a3b8; font-size:13px;">10 Distinct Printable Pages</span>
      <button class="print-btn" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        <span>Print / Save as 10-Page PDF</span>
      </button>
    </div>
  </div>

  <div class="doc-container">
    ${pages.map((p) => `
      <div class="pdf-page" id="page-${p.pageNumber}">
        <div class="page-running-header">
          <div>RS • 7-FIGURE OPERATOR FRAMEWORK</div>
          <div>${guide.title}</div>
        </div>
        
        <div class="page-main-body">
          ${p.pageNumber > 1 ? `
            <div style="margin-bottom:16px;">
              <h2 style="font-size:20px; color:#0f172a; margin-bottom:4px;">${p.chapterTitle}</h2>
              <div style="font-size:13px; color:#0284c7; font-weight:600;">${p.chapterSubtitle}</div>
            </div>
          ` : ''}
          ${p.content}
        </div>

        <div class="page-running-footer">
          <div>© 2026 RS Resource Hub • Confidential E-Commerce Operator Manual</div>
          <div><strong>Page ${p.pageNumber} of ${pages.length}</strong></div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

    // Create binary Blob and trigger direct save
    const blob = new Blob([printableDoc], { type: 'text/html;charset=utf-8;' });
    const objectUrl = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    const sanitizedFilename = guide.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

    downloadAnchor.href = objectUrl;
    downloadAnchor.download = `${sanitizedFilename}_10_page_blueprint_2026.html`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    downloadAnchor.remove();
    window.URL.revokeObjectURL(objectUrl);

    showToast(`Downloading 10-Page Master Blueprint: "${guide.title}"! 🚀`);
  };

  const downloadStarterVault = (event) => {
    if (event && event.preventDefault) event.preventDefault();

    const vault = window.STARTER_VAULT_DATA;
    if (!vault) return;

    const pages = vault.pages || [];

    // Generate formatted 10-page master operating system document
    const printableDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${vault.title} - 10-Page Master System (2026 Edition)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f1d;
      color: #334155;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 999;
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0, 212, 255, 0.3);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 25px rgba(0,0,0,0.6);
    }
    .bar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
    }
    .bar-brand span {
      background: linear-gradient(135deg, #38bdf8, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .print-btn {
      background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
      color: #fff;
      border: none;
      padding: 10px 22px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .print-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(0, 212, 255, 0.7);
    }

    .doc-container {
      max-width: 860px;
      margin: 35px auto;
      padding: 0 20px 80px 20px;
    }

    .pdf-page {
      background: #ffffff;
      color: #1e293b;
      min-height: 1120px;
      padding: 50px 55px 70px 55px;
      margin-bottom: 45px;
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
    }

    .page-running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-bottom: 24px;
      font-size: 11px;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .page-running-footer {
      position: absolute;
      bottom: 24px;
      left: 55px;
      right: 55px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 11px;
      color: #64748b;
    }

    .page-main-body { flex: 1; }

    h1, h2, h3, h4, h5, h6 { color: #0f172a; font-weight: 700; line-height: 1.3; }
    h4 { font-size: 16.5px; margin-bottom: 8px; color: #0f172a; }
    p { margin-bottom: 12px; font-size: 13.5px; line-height: 1.65; color: #334155; }
    
    .bp-cover-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 20px; }
    .bp-cover-box .bp-tag { color: #0284c7; font-weight: 700; font-size: 12px; letter-spacing: 0.05em; margin-bottom: 8px; }
    .bp-cover-box .bp-title { font-size: 26px; color: #0f172a; margin-bottom: 6px; }
    .bp-cover-box .bp-subtitle { font-size: 14px; color: #64748b; margin-bottom: 16px; font-weight: 400; }
    
    .bp-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .bp-meta-item { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; }
    .bp-meta-item .label { font-size: 10px; text-transform: uppercase; color: #64748b; display: block; }
    .bp-meta-item .val { font-size: 13px; font-weight: 700; color: #0f172a; }

    .bp-callout { padding: 14px 16px; border-radius: 6px; margin: 14px 0; font-size: 13px; line-height: 1.6; }
    .bp-callout.cyan { background: #f0f9ff; border-left: 4px solid #0284c7; color: #0369a1; }
    .bp-callout.warning { background: #fffbeb; border-left: 4px solid #f59e0b; color: #92400e; }
    .bp-callout.emerald { background: #f0fdf4; border-left: 4px solid #10b981; color: #166534; }

    .bp-toc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; color: #334155; }
    
    .bp-table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 12px; }
    .bp-table th { background: #f1f5f9; color: #0f172a; font-weight: 700; padding: 8px 10px; text-align: left; border-bottom: 2px solid #cbd5e1; }
    .bp-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    .bp-table tr.highlight td { background: #f0f9ff; font-weight: 700; color: #0369a1; }

    .bp-code { background: #0f172a; color: #38bdf8; padding: 12px 14px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; margin: 12px 0; overflow-x: auto; }
    .bp-feature-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin: 14px 0; }
    .bp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; }
    .bp-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 12px 0; }
    .bp-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; }
    .bp-wireframe-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin: 12px 0; display: flex; flex-direction: column; gap: 6px; }
    .wf-item { background: #ffffff; border: 1px dashed #cbd5e1; padding: 6px 10px; border-radius: 4px; font-size: 12px; color: #334155; }
    .wf-item.highlight { border-color: #0284c7; background: #f0f9ff; color: #0369a1; font-weight: 600; }
    .wf-item.highlight-cta { border-color: #10b981; background: #f0fdf4; color: #166534; font-weight: 700; }
    .bp-checklist-grid { display: grid; grid-template-columns: 1fr; gap: 4px; font-size: 12px; color: #334155; }

    @media print {
      body { background: #ffffff !important; padding: 0 !important; margin: 0 !important; color: #000000 !important; }
      .no-print { display: none !important; }
      .doc-container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
      .pdf-page {
        margin: 0 !important;
        padding: 30px 35px 50px 35px !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
        page-break-after: always !important;
        break-after: page !important;
        min-height: 100vh !important;
        height: 100% !important;
      }
      .page-running-footer {
        position: absolute !important;
        bottom: 15px !important;
        left: 35px !important;
        right: 35px !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 10mm 15mm 10mm;
      }
    }
  </style>
</head>
<body>
  <div class="top-action-bar no-print">
    <div class="bar-brand">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      <div>RS <span>Starter Vault Master System</span></div>
    </div>
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="color:#94a3b8; font-size:13px;">10 Distinct Printable Pages</span>
      <button class="print-btn" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        <span>Print / Save as 10-Page PDF</span>
      </button>
    </div>
  </div>

  <div class="doc-container">
    ${pages.map((p) => `
      <div class="pdf-page" id="page-${p.pageNumber}">
        <div class="page-running-header">
          <div>RS • 7-FIGURE MASTER OPERATING SYSTEM</div>
          <div>${vault.title}</div>
        </div>
        
        <div class="page-main-body">
          ${p.pageNumber > 1 ? `
            <div style="margin-bottom:16px;">
              <h2 style="font-size:20px; color:#0f172a; margin-bottom:4px;">${p.chapterTitle}</h2>
              <div style="font-size:13px; color:#0284c7; font-weight:600;">${p.chapterSubtitle}</div>
            </div>
          ` : ''}
          ${p.content}
        </div>

        <div class="page-running-footer">
          <div>© 2026 RS Resource Hub • Turnkey Master Operating System</div>
          <div><strong>Page ${p.pageNumber} of ${pages.length}</strong></div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([printableDoc], { type: 'text/html;charset=utf-8;' });
    const objectUrl = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');

    downloadAnchor.href = objectUrl;
    downloadAnchor.download = 'RS_7figure_starter_vault_10_page_master_2026.html';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    downloadAnchor.remove();
    window.URL.revokeObjectURL(objectUrl);

    showToast('Direct download initiated: 10-Page 7-Figure Starter Pack Master System! 📥');
  };

  // =========================================================================
  // 9. Verified Supplier Directory Search & Filter
  // =========================================================================
  const initSupplierSearch = () => {
    const searchInp = document.getElementById('supplier-search');
    const filterBtns = document.querySelectorAll('.filter-pill[data-supplier-filter]');
    const cards = document.querySelectorAll('.supplier-card');

    const filterSuppliers = () => {
      const query = (searchInp ? searchInp.value.toLowerCase() : '').trim();
      const activeFilter = state.activeSupplierFilter;

      cards.forEach((card) => {
        const type = card.dataset.type;
        const text = card.textContent.toLowerCase();

        const matchesType = activeFilter === 'all' || type === activeFilter;
        const matchesQuery = query === '' || text.includes(query);

        if (matchesType && matchesQuery) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    };

    if (searchInp) {
      searchInp.addEventListener('input', filterSuppliers);
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeSupplierFilter = btn.dataset.supplierFilter;
        filterSuppliers();
      });
    });
  };

  // =========================================================================
  // 10. Interactive FAQ Accordion
  // =========================================================================
  const initFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-question-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach((other) => other.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  // =========================================================================
  // 11. Modals & Toast Alerts System
  // =========================================================================
  const initModals = () => {
    const openLeadBtn = document.getElementById('btn-open-blueprint');
    const heroVaultCta = document.getElementById('btn-cta-vault');
    const leadModal = document.getElementById('lead-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    const openLead = () => {
      if (leadModal) leadModal.classList.add('active');
    };

    if (openLeadBtn) openLeadBtn.addEventListener('click', openLead);
    if (heroVaultCta) heroVaultCta.addEventListener('click', openLead);

    if (modalCloseBtn && leadModal) {
      modalCloseBtn.addEventListener('click', () => {
        leadModal.classList.remove('active');
      });
    }

    // Close on backdrop click
    window.addEventListener('click', (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
      }
    });

      // Close on Escape key
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-overlay.active').forEach((m) => m.classList.remove('active'));
        }
      });
    };

  const handleLeadSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const nameEl = document.getElementById('lead-name');
    const emailEl = document.getElementById('lead-email');

    const name = nameEl ? nameEl.value : 'Founder';
    const email = emailEl ? emailEl.value : 'your email';

    const leadModal = document.getElementById('lead-modal');
    if (leadModal) leadModal.classList.remove('active');

    // Trigger starter pack direct download immediately
    downloadStarterVault(e);
    showToast(`Welcome aboard, ${name}! Your 2026 Vault is downloading now & copy sent to ${email}. 🚀`);
  };

  const showToast = (message) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  };

  // =========================================================================
  // 12. Interactive 5-Step Supply Chain Pipeline Visualizer & Telemetry
  // =========================================================================
  const PIPELINE_STEPS = {
    1: {
      stepNumber: 1,
      title: 'Order Webhook & ERP Ingestion',
      subtitle: 'Sub-3-Second Automated Cloud Ingestion • Zero Manual CSV Exporting',
      dayBadge: 'Day 1 (0h - 6h)',
      statusBadge: 'ACTIVE TELEMETRY',
      kpis: [
        { label: 'Sync Latency', value: '2.84 sec', subtext: 'Shopify / WooCommerce to Dianxiaomi' },
        { label: 'Address CASS Pass Rate', value: '99.8%', subtext: 'Automated USPS normalization' },
        { label: 'SKU Mapping Accuracy', value: '100%', subtext: '1688 / Factory BOM Match' },
        { label: 'Payload Queue Status', value: '0 Pending', subtext: 'Zero dropped webhooks' }
      ],
      sopTitle: 'Operational Execution SOP (Chapter 1 / Page 2)',
      sopItems: [
        'Shopify / WooCommerce webhook triggers instant <code>orders/create</code> payload to Dianxiaomi / ERP999.',
        'Automated USPS CASS address verification scrubs apartment/suite errors and standardizes 9-digit ZIP codes.',
        'SKU Mapping Engine dynamically translates store variant titles into Chinese factory BOM part IDs.',
        'Automated warehouse packing slip and barcoded shipping label generated within 60 seconds of checkout.'
      ],
      consoleLogs: [
        '[00:00:01] POST /api/v3/webhooks/orders/create -> 200 OK (Payload Size: 4.2KB)',
        '[00:00:02] Address CASS Validation Passed: 742 Evergreen Terr, Springfield, OR 97477',
        '[00:00:03] SKU Translation: [AETHER-GLOW-BLK-M] -> Factory BOM #SZ-8821-MB',
        '[00:00:03] Barcode Generated: YUN-US-9200190384110398 • Label Printed to Bin #402'
      ],
      guidePage: 2,
      simActionText: 'Simulate Live Order Webhook Ingestion',
      simSuccessMsg: 'Simulated new Shopify order #9824 webhook received & routed to Shenzhen ERP in 2.1s!'
    },
    2: {
      stepNumber: 2,
      title: 'Warehouse 100% Pre-Flight QC & Custom Pack',
      subtitle: '4-Point Functional & Cosmetic Bench Testing • Returns Kept Under 1.2%',
      dayBadge: 'Day 1 (6h - 24h)',
      statusBadge: 'PRE-FLIGHT QC',
      kpis: [
        { label: 'Defect Catch Rate', value: '100%', subtext: 'Pre-flight factory bench testing' },
        { label: 'Return Rate Target', value: '< 1.1%', subtext: 'Customer chargebacks prevented' },
        { label: 'Pack Cycle Time', value: '4.2 min/unit', subtext: 'Custom box + thank-you card seal' },
        { label: 'Visual Inspection Light', value: '5000K White', subtext: 'Zero micro-scratch tolerance' }
      ],
      sopTitle: 'Operational Execution SOP (Chapter 2 / Page 3)',
      sopItems: [
        'Item unpackaged and placed on ESD anti-static bench for 4-point functional and cosmetic testing.',
        'Battery & electrical power cycle tested across 3 output modes (100% functional; zero circuit shorts).',
        'Packaged into custom matte branded luxury box with embossed logo and personalized thank-you insert card.',
        'Weight verification scan (±1.5g variance detection) to ensure zero missing accessories or charging cables.'
      ],
      consoleLogs: [
        '[06:14:20] Unit Bench Test #SZ-8821-MB -> Voltage: 5.02V | Amperage: 1.98A [PASS]',
        '[06:15:02] 5000K Optical Surface Scan: Zero micro-scratches or seam cracks [PASS]',
        '[06:16:30] Bill-of-Materials: Base Unit + Type-C Braided Cable + Eng Manual Verified',
        '[06:17:45] Weight Verification: 342.6g (Nominal 342.0g) -> QC Seal Applied #QC-PASS-491'
      ],
      guidePage: 3,
      simActionText: 'Run 4-Point QC Bench Test',
      simSuccessMsg: 'QC Bench Test Completed: Electrical 5.0V PASS, Optical 5000K PASS, Custom Pack Sealed!'
    },
    3: {
      stepNumber: 3,
      title: 'Dedicated Air Cargo & Daily Chartered Linehaul',
      subtitle: 'Daily Scheduled Flights (SZX / HKG -> LAX / ORD / JFK) • 12-14h Flight Time',
      dayBadge: 'Day 2 - 4 (24h - 96h)',
      statusBadge: 'AIRBORNE TRANSIT',
      kpis: [
        { label: 'Flight Frequency', value: '7 Days/Wk', subtext: 'Daily chartered pallet allocations' },
        { label: 'Air Transit Time', value: '12 - 14 hrs', subtext: 'Trans-Pacific linehaul route' },
        { label: 'Pallet Build SLA', value: '< 8 hours', subtext: 'Airport transfer & palletization' },
        { label: 'Carrier Network', value: 'YunExpress / CNE', subtext: 'Tier-1 Special Line Logistics' }
      ],
      sopTitle: 'Operational Execution SOP (Chapter 3 / Page 4)',
      sopItems: [
        'Shenzhen fulfillment warehouse palletizes daily orders sorted by destination airport code (LAX, JFK, ORD).',
        'High-speed bonded truck transfer to SZX / HKG international cargo terminal with export customs clearance scan.',
        'Loaded onto daily direct chartered Boeing 777 / 747 freighter with climate-controlled hold.',
        'Trans-Pacific flight tracking telemetry updated every 30 minutes in global tracking dashboard.'
      ],
      consoleLogs: [
        '[24:00:10] Master Airway Bill (MAWB) Issued: 999-40819201 • Pallet #SZX-LAX-09',
        '[28:30:00] Bonded Transfer Complete -> Departed Shenzhen Hub to HKG Airport',
        '[34:15:00] Flight ETD SZX 02:40 UTC -> Flight ETA LAX 16:20 UTC (13h 40m Trans-Pacific)',
        '[48:00:00] Aircraft Touchdown LAX Terminal 4 Cargo Gateway • Pallet De-Containerized'
      ],
      guidePage: 4,
      simActionText: 'Track Active Air Cargo Flight',
      simSuccessMsg: 'Flight Telemetry Updated: Cargo 777F SZX->LAX on schedule (Altitude: 36,000ft, ETA: 4h 12m).'
    },
    4: {
      stepNumber: 4,
      title: 'Digital Manifest Customs Pre-Clearance (Section 321)',
      subtitle: 'Electronic Data Interchange (EDI) Entry Type 86 • Zero Bonded Hold Delays',
      dayBadge: 'Day 3 - 4 (48h - 96h)',
      statusBadge: 'PRE-CLEARED',
      kpis: [
        { label: 'Pre-Clearance Rate', value: '98.6%', subtext: 'Cleared before aircraft wheels touch down' },
        { label: 'Duty Exemption', value: 'Section 321', subtext: '$800 De Minimis Duty-Free' },
        { label: 'Customs Hold Delay', value: '0 Hours', subtext: 'Zero bonded warehouse queue' },
        { label: 'EDI Protocol', value: 'CBP Entry Type 86', subtext: 'Direct Broker Electronic Filing' }
      ],
      sopTitle: 'Operational Execution SOP (Chapter 4 / Page 5)',
      sopItems: [
        'Electronic Data Interchange (EDI) parcel manifest transmitted to US CBP while flight is airborne.',
        'Automated Section 321 Entry Type 86 filing applies duty-free status for consumer shipments under $800 value.',
        'Automated Harmonized Tariff Schedule (HTS) code verification matches declared commercial invoices.',
        'Digital pre-release issued prior to wheel touchdown, eliminating port container inspection delays.'
      ],
      consoleLogs: [
        '[52:10:00] Electronic Manifest Transmitted to US CBP (ACE Secure Data Portal)',
        '[52:10:15] Section 321 Eligibility Verified: Total Declared Value $38.50 USD (< $800 Threshold)',
        '[54:00:00] HTS Code 8509.80.5045 Auto-Validated with Zero Regulatory Red Flags',
        '[56:30:00] CBP Pre-Clearance Granted: Electronic Release Code #CBP-REL-889102'
      ],
      guidePage: 5,
      simActionText: 'Simulate Electronic Customs Clearance',
      simSuccessMsg: 'Customs Pre-Clearance Success: CBP Section 321 Entry Type 86 approved with ZERO holds!'
    },
    5: {
      stepNumber: 5,
      title: 'Regional Hub Sorting & Last-Mile Doorstep Delivery',
      subtitle: 'Domestic USPS Ground Advantage / DHL Express Induction • 5.8-Day Avg Door-to-Door',
      dayBadge: 'Day 5 - 6 (96h - 144h)',
      statusBadge: 'DELIVERED',
      kpis: [
        { label: 'Total Door-to-Door', value: '5.8 Days Avg', subtext: 'Purchase to customer doorstep' },
        { label: 'USPS Domestic Scan', value: '< 24 Hours', subtext: 'Airport cross-dock to SCF hub' },
        { label: 'On-Time Delivery', value: '99.4%', subtext: 'Across all 48 continental states' },
        { label: 'SMS Carrier Alerts', value: 'Live Updates', subtext: 'Real-time doorstep photo scan' }
      ],
      sopTitle: 'Operational Execution SOP (Chapter 5 / Page 6)',
      sopItems: [
        'Pallets cross-docked from airport cargo gateway directly to regional USPS Sectional Center Facility (SCF).',
        'Parcels receive domestic induction scan and tracking switches to native USPS Ground Advantage tracking.',
        'Dispatched to local neighborhood USPS sorting station on Day 5 night sort.',
        'Letter carrier executes final doorstep delivery with timestamped GPS delivery scan on Day 6 morning.'
      ],
      consoleLogs: [
        '[98:00:00] Arrived at USPS Destination Regional Facility: LOS ANGELES CA DISTRIBUTION CENTER',
        '[112:30:00] Departed USPS Regional Facility -> In Transit to Local Post Office (97477)',
        '[130:15:00] Out for Delivery: Courier on Route with Expected Delivery by 1:30 PM',
        '[138:42:00] DELIVERED: Left with Individual / Front Porch • Photo Scan Uploaded'
      ],
      guidePage: 6,
      simActionText: 'Simulate Final Doorstep Delivery',
      simSuccessMsg: 'Final Delivery Simulated: Delivered at customer front doorstep with domestic tracking scan!'
    }
  };

  const initPipelineVisualizer = () => {
    const stepCards = document.querySelectorAll('.pipeline-step-card');
    const autoplayBtn = document.getElementById('btn-pipeline-autoplay');

    if (!stepCards.length) return;

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        const stepNum = parseInt(card.getAttribute('data-step') || '1', 10);
        switchPipelineStep(stepNum, true);
      });

      // Keyboard accessibility (Enter, Space, Arrow Keys)
      card.addEventListener('keydown', (e) => {
        const currentStep = parseInt(card.getAttribute('data-step') || '1', 10);
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchPipelineStep(currentStep, true);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextStep = currentStep === 5 ? 1 : currentStep + 1;
          const nextCard = document.querySelector(`.pipeline-step-card[data-step="${nextStep}"]`);
          if (nextCard) {
            nextCard.focus();
            switchPipelineStep(nextStep, true);
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevStep = currentStep === 1 ? 5 : currentStep - 1;
          const prevCard = document.querySelector(`.pipeline-step-card[data-step="${prevStep}"]`);
          if (prevCard) {
            prevCard.focus();
            switchPipelineStep(prevStep, true);
          }
        }
      });
    });

    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => {
        togglePipelineAutoplay();
      });
    }

    // Render initial step (Step 1)
    renderPipelineStep(state.activePipelineStep || 1);
  };

  const switchPipelineStep = (stepNum, shouldStopAutoplay = false) => {
    if (shouldStopAutoplay && state.pipelineAutoplayInterval) {
      stopPipelineAutoplay();
    }

    state.activePipelineStep = stepNum;

    // Update active tab states
    const stepCards = document.querySelectorAll('.pipeline-step-card');
    stepCards.forEach((card) => {
      const cardStep = parseInt(card.getAttribute('data-step') || '1', 10);
      const isActive = cardStep === stepNum;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    renderPipelineStep(stepNum);
  };

  const renderPipelineStep = (stepNum) => {
    const detailPanel = document.getElementById('pipeline-step-detail-panel');
    if (!detailPanel) return;

    const data = PIPELINE_STEPS[stepNum] || PIPELINE_STEPS[1];

    detailPanel.innerHTML = `
      <div class="step-detail-header">
        <div class="step-detail-title-wrap">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.35rem; flex-wrap:wrap;">
            <span class="step-num-badge" style="background:var(--accent-cyan); color:#000; font-weight:800; font-size:0.75rem; padding:0.2rem 0.55rem; border-radius:6px;">
              STEP ${data.stepNumber} OF 5
            </span>
            <h4 style="margin:0; font-size:1.3rem; color:#fff;">${data.title}</h4>
          </div>
          <p style="color:var(--text-muted); font-size:0.875rem; margin:0;">${data.subtitle}</p>
        </div>

        <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
          <span class="badge-tag cyan" style="margin:0; font-size:0.75rem;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${data.dayBadge}</span>
          </span>
          <span class="badge-tag indigo" style="margin:0; font-size:0.75rem;">
            <span>${data.statusBadge}</span>
          </span>
        </div>
      </div>

      <!-- Real-Time 4-Card KPI Telemetry -->
      <div class="step-kpi-grid">
        ${data.kpis.map((kpi) => `
          <div class="step-kpi-card">
            <div class="step-kpi-label">${kpi.label}</div>
            <div class="step-kpi-val">${kpi.value}</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px;">${kpi.subtext}</div>
          </div>
        `).join('')}
      </div>

      <!-- 2-Column Content: SOP Checklist & Live Console Logs -->
      <div class="step-content-grid">
        <div class="step-sop-box">
          <h5>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>${data.sopTitle}</span>
          </h5>
          <ul class="step-sop-list">
            ${data.sopItems.map((item) => `
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <div>${item}</div>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="step-console-box">
          <div class="step-console-header">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span>
              <span>LIVE TELEMETRY CONSOLE • STAGE #${data.stepNumber}</span>
            </div>
            <span style="color:var(--text-muted); font-size:0.7rem;">PING: 24ms</span>
          </div>
          <div class="step-console-body" id="step-console-output">
            ${data.consoleLogs.map((log) => `<div>${log}</div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Action Bar with Direct Guide / PDF Links -->
      <div class="step-action-bar">
        <div style="display:flex; align-items:center; gap:0.55rem; color:var(--text-muted); font-size:0.825rem;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan-bright)" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>Linehaul Stage #${data.stepNumber} SOP & Protocol Specifications</span>
        </div>

        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="App.openGuideReader('logistics-private-agent-linehaul', ${data.guidePage})" title="Read detailed Chapter SOP on Page ${data.guidePage}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <span>Read Page ${data.guidePage} SOP</span>
          </button>

          <a 
            href="#" 
            class="btn-anti-gravity-download btn-sm" 
            onclick="App.downloadGuidePdf('logistics-private-agent-linehaul', event)" 
            title="Download Complete 10-Page Linehaul PDF Blueprint"
          >
            <svg class="download-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download 10-Page PDF</span>
          </a>
        </div>
      </div>
    `;
  };

  const runStepSimulation = (stepNum) => {
    const data = PIPELINE_STEPS[stepNum] || PIPELINE_STEPS[1];
    const consoleOutput = document.getElementById('step-console-output');
    
    if (consoleOutput) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newLog = document.createElement('div');
      newLog.style.color = '#38bdf8';
      newLog.style.fontWeight = '700';
      newLog.innerHTML = `[${timeStr}] ⚡ TELEMETRY PING: Executed live simulation for Step #${stepNum} (${data.title})`;
      consoleOutput.appendChild(newLog);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    showToast(data.simSuccessMsg);
  };

  const togglePipelineAutoplay = () => {
    const autoplayBtn = document.getElementById('btn-pipeline-autoplay');

    if (state.pipelineAutoplayInterval) {
      stopPipelineAutoplay();
      showToast('Pipeline auto-simulation paused.');
    } else {
      showToast('Starting 6-day lifecycle auto-simulation playback! 🚀');
      if (autoplayBtn) {
        autoplayBtn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          <span>Pause Simulation</span>
        `;
        autoplayBtn.classList.add('active');
        autoplayBtn.style.borderColor = 'var(--accent-cyan-bright)';
      }

      state.pipelineAutoplayInterval = setInterval(() => {
        const nextStep = state.activePipelineStep >= 5 ? 1 : state.activePipelineStep + 1;
        switchPipelineStep(nextStep, false);
      }, 3500);
    }
  };

  const stopPipelineAutoplay = () => {
    if (state.pipelineAutoplayInterval) {
      clearInterval(state.pipelineAutoplayInterval);
      state.pipelineAutoplayInterval = null;
    }
    const autoplayBtn = document.getElementById('btn-pipeline-autoplay');
    if (autoplayBtn) {
      autoplayBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span>Auto-Simulate</span>
      `;
      autoplayBtn.classList.remove('active');
      autoplayBtn.style.borderColor = '';
    }
  };

  const selectStrategy = (strategyType) => {
    const pipelineEl = document.getElementById('supply-chain-pipeline');
    if (pipelineEl) {
      pipelineEl.scrollIntoView({ behavior: 'smooth' });
    }

    if (strategyType === 'private_agent') {
      switchPipelineStep(1, true);
    } else if (strategyType === 'direct_factory') {
      switchPipelineStep(2, true);
    } else if (strategyType === 'domestic_3pl') {
      switchPipelineStep(5, true);
    }

    showToast(`Loaded ${strategyType.replace('_', ' ').toUpperCase()} telemetry pipeline.`);
  };

  const openContactModal = (supplierName) => {
    const leadModal = document.getElementById('lead-modal');
    if (leadModal) {
      leadModal.classList.add('active');
      showToast(`Requesting direct WhatsApp quote from ${supplierName}...`);
    }
  };

  const openBlueprintModal = () => {
    const leadModal = document.getElementById('lead-modal');
    const guideModal = document.getElementById('guide-modal');
    if (guideModal) guideModal.classList.remove('active');
    if (leadModal) leadModal.classList.add('active');
  };

  const closeGuideModal = () => {
    const guideModal = document.getElementById('guide-modal');
    if (guideModal) guideModal.classList.remove('active');
  };

  const initMobileMenu = () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    if (!mobileToggle) return;

    let drawer = document.getElementById('mobile-nav-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'mobile-nav-drawer';
      drawer.className = 'mobile-nav-drawer';
      drawer.innerHTML = `
        <button class="mobile-nav-drawer-close" id="mobile-drawer-close" aria-label="Close Navigation Menu">&times;</button>
        <ul class="mobile-nav-drawer-links">
          <li><a href="index.html" class="mobile-nav-drawer-link">Home Overview</a></li>
          <li><a href="blueprints.html" class="mobile-nav-drawer-link">Store Blueprints</a></li>
          <li><a href="logistics.html" class="mobile-nav-drawer-link">Fulfillment Matrix</a></li>
          <li><a href="calculators.html" class="mobile-nav-drawer-link">Profit Engines</a></li>
          <li><a href="suppliers.html" class="mobile-nav-drawer-link">Verified Suppliers</a></li>
          <li><a href="faq.html" class="mobile-nav-drawer-link">Knowledge Base FAQ</a></li>
          <li><a href="https://www.profitableratecpmnetwork.com/amspcnscr?key=47a7763944a29938f61984e3f44174b0" target="_blank" rel="noopener noreferrer" class="mobile-nav-drawer-link" style="color:var(--accent-cyan-bright); font-weight:800;">🔥 VIP Partner Deals &rarr;</a></li>
        </ul>
      `;
      document.body.appendChild(drawer);

      const closeBtn = document.getElementById('mobile-drawer-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          drawer.classList.remove('active');
        });
      }

      drawer.querySelectorAll('.mobile-nav-drawer-link').forEach(link => {
        link.addEventListener('click', () => {
          drawer.classList.remove('active');
        });
      });
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      drawer.classList.toggle('active');
    });
  };

  // =========================================================================
  // 15. 10-Second Timed Flash Notification Engine
  // =========================================================================
  const initTimedMonetizationEngine = () => {
    const DURATION_SECONDS = 10;

    // Render 10-Second Flash Notification Box
    const banner = document.createElement('div');
    banner.id = 'timed-flash-ad-banner';
    banner.className = 'timed-flash-banner';
    banner.innerHTML = `
      <div class="timed-flash-content">
        <div class="timed-flash-badge">
          <span class="pulse-dot"></span>
          <span>LIMITED OFFER (<span id="flash-timer-count">${DURATION_SECONDS}s</span>)</span>
        </div>
        <div class="timed-flash-title">⚡ Claim VIP Fast-Track Supplier Registry & Sourcing Deals</div>
        <a href="https://www.profitableratecpmnetwork.com/amspcnscr?key=47a7763944a29938f61984e3f44174b0" target="_blank" rel="noopener noreferrer" class="timed-flash-cta">
          Access Now &rarr;
        </a>
      </div>
      <button class="timed-flash-close" aria-label="Close Ad" onclick="document.getElementById('timed-flash-ad-banner')?.remove()">&times;</button>
      <div class="timed-flash-progress"><div class="timed-flash-bar" id="flash-progress-bar"></div></div>
    `;
    document.body.appendChild(banner);

    // Animate progress bar across 10 seconds
    const progressBar = document.getElementById('flash-progress-bar');
    if (progressBar) {
      progressBar.style.transition = `width ${DURATION_SECONDS}s linear`;
      requestAnimationFrame(() => {
        progressBar.style.width = '0%';
      });
    }

    // Count down 10 seconds
    let remaining = DURATION_SECONDS;
    const timerInterval = setInterval(() => {
      remaining -= 1;
      const countEl = document.getElementById('flash-timer-count');
      if (countEl) countEl.textContent = `${remaining}s`;

      if (remaining <= 0) {
        clearInterval(timerInterval);

        // Smoothly dismiss floating notification
        const activeBanner = document.getElementById('timed-flash-ad-banner');
        if (activeBanner) {
          activeBanner.classList.add('fade-out');
          setTimeout(() => activeBanner.remove(), 450);
        }
      }
    }, 1000);
  };

  // Public API
  return {
    init,
    handleLeadSubmit,
    selectStrategy,
    openContactModal,
    openBlueprintModal,
    closeGuideModal,
    openGuideReader,
    switchGuidePage,
    downloadGuidePdf,
    downloadStarterVault,
    showToast,
    switchPipelineStep,
    runStepSimulation,
    togglePipelineAutoplay,
    stopPipelineAutoplay,
    loadStandaloneGuide,
    switchStandalonePage
  };
})();

// Attach to window for global inline accessibility
window.App = App;

// Safe DOM initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}
