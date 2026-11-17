/**
 * js/renderer.js
 * Renders the bioluminescent clearing, magnetic motes, projectiles,
 * player firefly, enemies, The Umbral Moth boss, VFX, and radar minimap.
 */
window.Lumen = window.Lumen || {};

Lumen.Renderer = {
  renderBackground(ctx) {
    const { CONFIG, State, WorldEnv } = Lumen;
    const W = CONFIG.WORLD_W;
    const H = CONFIG.WORLD_H;

    const bgGrad = ctx.createRadialGradient(
      W / 2,
      H / 2,
      120,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.72
    );
    bgGrad.addColorStop(0, '#0a222d');
    bgGrad.addColorStop(0.55, '#06151e');
    bgGrad.addColorStop(1, '#030b10');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle bioluminescent clearing grid
    ctx.save();
    ctx.strokeStyle = 'rgba(126, 249, 255, 0.045)';
    ctx.lineWidth = 1;
    const step = 160;
    const startX = Math.max(0, Math.floor((State.cam.x - State.cam.w * 0.6) / step) * step);
    const endX = Math.min(W, Math.ceil((State.cam.x + State.cam.w * 0.6) / step) * step);
    const startY = Math.max(0, Math.floor((State.cam.y - State.cam.h * 0.6) / step) * step);
    const endY = Math.min(H, Math.ceil((State.cam.y + State.cam.h * 0.6) / step) * step);

    ctx.beginPath();
    for (let x = startX; x <= endX; x += step) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += step) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    if (WorldEnv) {
      if (typeof WorldEnv.render === 'function') WorldEnv.render(ctx);
      else if (typeof WorldEnv.draw === 'function') WorldEnv.draw(ctx);
    }

    // World perimeter mist border
    ctx.strokeStyle = 'rgba(126, 249, 255, 0.28)';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, W - 36, H - 36);
    ctx.restore();
  },

  renderMotes(ctx) {
    const { State, Utils } = Lumen;
    for (const m of State.moteOrbs) {
      if (!m) continue;
      const pulse = 0.85 + 0.15 * Math.sin(m.phase);
      ctx.save();
      ctx.translate(m.x, m.y);

      if (m.kind === 'powerup') {
        const isNova = m.powerType === 'nova';
        const mainCol = isNova ? '#ffd24a' : '#7ef9ff';
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 28 * pulse);
        glow.addColorStop(0, Utils.hexWithAlpha(mainCol, 0.85));
        glow.addColorStop(1, Utils.hexWithAlpha(mainCol, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 28 * pulse, 0, Utils.TAU);
        ctx.fill();

        ctx.strokeStyle = mainCol;
        ctx.lineWidth = 2;
        ctx.rotate(m.phase * 0.35);
        ctx.strokeRect(-9, -9, 18, 18);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Utils.TAU);
        ctx.fill();
      } else {
        const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 15 * pulse);
        glow.addColorStop(0, 'rgba(255, 210, 74, 0.85)');
        glow.addColorStop(1, 'rgba(255, 210, 74, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 15 * pulse, 0, Utils.TAU);
        ctx.fill();

        ctx.fillStyle = '#fff5bd';
        ctx.beginPath();
        ctx.arc(0, 0, 3.6 * pulse, 0, Utils.TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  },

  renderProjectiles(ctx) {
    const { State, Utils } = Lumen;

    // Player luminous bolts
    for (const b of State.pshots) {
      if (!b) continue;
      const ang = Math.atan2(b.vy, b.vx);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(ang);

      const grad = ctx.createLinearGradient(-16, 0, 8, 0);
      grad.addColorStop(0, Utils.hexWithAlpha(b.col || '#ffd24a', 0));
      grad.addColorStop(0.6, Utils.hexWithAlpha(b.col || '#ffd24a', 0.85));
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, b.r || 4.2, 0, 0, Utils.TAU);
      ctx.fill();
      ctx.restore();
    }

    // Enemy projectiles
    for (const s of State.eshots) {
      if (!s) continue;
      ctx.save();
      const col = s.col || '#ff4fa3';
      const glow = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, s.r * 2.3);
      glow.addColorStop(0, Utils.hexWithAlpha(col, 0.85));
      glow.addColorStop(1, Utils.hexWithAlpha(col, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.3, 0, Utils.TAU);
      ctx.fill();

      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Utils.TAU);
      ctx.fill();

      ctx.fillStyle = '#fff5bd';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 0.42, 0, Utils.TAU);
      ctx.fill();
      ctx.restore();
    }

    // Homing Shadow-Seeker spores
    for (const sk of State.seekers) {
      if (!sk) continue;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 79, 163, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(sk.x, sk.y, sk.r * 1.15, sk.phase * 0.4, sk.phase * 0.4 + Math.PI * 1.3);
      ctx.stroke();

      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(sk.x, sk.y, sk.r * 0.85, 0, Utils.TAU);
      ctx.fill();

      ctx.fillStyle = '#fff5bd';
      ctx.beginPath();
      ctx.arc(sk.x, sk.y, sk.r * 0.55, 0, Utils.TAU);
      ctx.fill();
      ctx.restore();
    }
  },

  renderPlayer(ctx) {
    const { State, Utils } = Lumen;
    const p = State.player;
    if (!p) return;

    for (let i = 0; i < p.trail.length; i++) {
      const tr = p.trail[i];
      const ratio = tr.life / 0.24;
      ctx.fillStyle = `rgba(255, 210, 74, ${ratio * 0.25})`;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, 9 * ratio, 0, Utils.TAU);
      ctx.fill();
    }

    if (p.invulnT > 0 && Math.floor(p.invulnT * 18) % 2 === 1 && p.dashActiveT <= 0) {
      return;
    }

    ctx.save();
    ctx.translate(p.x, p.y);

    const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, 72);
    halo.addColorStop(0, 'rgba(255, 245, 189, 0.55)');
    halo.addColorStop(0.45, 'rgba(255, 210, 74, 0.16)');
    halo.addColorStop(1, 'rgba(255, 210, 74, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 72, 0, Utils.TAU);
    ctx.fill();

    if (p.shield) {
      const sPulse = 0.82 + 0.18 * Math.sin(State.time * 8);
      ctx.strokeStyle = `rgba(126, 249, 255, ${0.72 * sPulse})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Utils.TAU);
      ctx.stroke();
    }

    ctx.rotate(p.angle + Math.PI / 2);

    // Fluttering bioluminescent wings
    const flap = Math.sin(p.wingPhase) * 0.42;
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.rotate(flap);
      ctx.fillStyle = 'rgba(126, 249, 255, 0.34)';
      ctx.strokeStyle = 'rgba(255, 245, 189, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(12, 2, 11, 5.5, 0.35, 0, Utils.TAU);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Firefly body & glowing lantern
    ctx.fillStyle = '#1b3b48';
    ctx.beginPath();
    ctx.ellipse(0, -2, 5.2, 10, 0, 0, Utils.TAU);
    ctx.fill();

    ctx.fillStyle = '#ffd24a';
    ctx.beginPath();
    ctx.ellipse(0, 5, 5.5, 7, 0, 0, Utils.TAU);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 5, 3, 0, Utils.TAU);
    ctx.fill();

    ctx.restore();
  },

  renderFoe(ctx, f) {
    const { Utils } = Lumen;
    ctx.save();
    ctx.translate(f.x, f.y);

    const isFlashing = f.hitFlash > 0;
    const mainCol = isFlashing ? '#ffffff' : f.col;
    const accentCol = isFlashing ? '#ffffff' : f.accent || f.col;
    const flap = Math.sin(f.phase) * 0.35;

    const aura = ctx.createRadialGradient(0, 0, 4, 0, 0, f.r * 1.9);
    aura.addColorStop(0, Utils.hexWithAlpha(f.col, 0.32));
    aura.addColorStop(1, Utils.hexWithAlpha(f.col, 0));
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, f.r * 1.9, 0, Utils.TAU);
    ctx.fill();

    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.rotate(flap);
      ctx.fillStyle = Utils.hexWithAlpha(mainCol, 0.45);
      ctx.strokeStyle = mainCol;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(f.r * 0.68, 0, f.r * 0.65, f.r * 0.36, 0.25, 0, Utils.TAU);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = accentCol;
    ctx.beginPath();
    ctx.arc(0, 0, f.r * 0.55, 0, Utils.TAU);
    ctx.fill();

    ctx.fillStyle = '#fff5bd';
    ctx.beginPath();
    ctx.arc(-4, -3, 2, 0, Utils.TAU);
    ctx.arc(4, -3, 2, 0, Utils.TAU);
    ctx.fill();

    if (f.hp < f.maxHp) {
      const barW = f.r * 1.6;
      const pct = Utils.clamp(f.hp / f.maxHp, 0, 1);
      ctx.fillStyle = 'rgba(5, 16, 23, 0.75)';
      ctx.fillRect(-barW / 2, -f.r - 12, barW, 4);
      ctx.fillStyle = f.col;
      ctx.fillRect(-barW / 2, -f.r - 12, barW * pct, 4);
    }

    ctx.restore();
  },

  renderBoss(ctx, b) {
    const { State, Utils } = Lumen;
    if (b.dashState === 'telegraph') {
      ctx.save();
      const pulse = 0.5 + 0.5 * Math.sin(State.time * 28);
      const laneGrad = ctx.createLinearGradient(b.dashStartX, b.dashStartY, b.dashEndX, b.dashEndY);
      laneGrad.addColorStop(0, `rgba(255, 79, 163, ${0.22 + 0.22 * pulse})`);
      laneGrad.addColorStop(0.6, `rgba(255, 23, 68, ${0.34 + 0.25 * pulse})`);
      laneGrad.addColorStop(1, 'rgba(255, 210, 74, 0.05)');

      ctx.strokeStyle = laneGrad;
      ctx.lineWidth = 48;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(b.dashStartX, b.dashStartY);
      ctx.lineTo(b.dashEndX, b.dashEndY);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 190, 231, ${0.55 + 0.35 * pulse})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(b.dashStartX, b.dashStartY);
      ctx.lineTo(b.dashEndX, b.dashEndY);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(b.x, b.y);

    const isGuarding = b.guardTimer > 0;
    const isFlashing = b.hitFlash > 0;
    const flap = Math.sin(b.wingPhase) * 0.26;

    // Boss ambient aura
    const auraCol = b.phase === 3 ? '#ff1744' : b.phase === 2 ? '#d500f9' : '#ff4fa3';
    const aura = ctx.createRadialGradient(0, 0, 12, 0, 0, 135);
    aura.addColorStop(0, Utils.hexWithAlpha(auraCol, 0.42));
    aura.addColorStop(1, Utils.hexWithAlpha(auraCol, 0));
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 135, 0, Utils.TAU);
    ctx.fill();

    // Forewings & hindwings
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.rotate(flap);

      ctx.fillStyle = isFlashing ? 'rgba(255, 255, 255, 0.85)' : 'rgba(155, 48, 255, 0.48)';
      ctx.strokeStyle = isFlashing ? '#ffffff' : '#ff4fa3';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(44, -10, 42, 22, -0.22, 0, Utils.TAU);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isFlashing ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 79, 163, 0.42)';
      ctx.beginPath();
      ctx.ellipse(34, 18, 28, 16, 0.35, 0, Utils.TAU);
      ctx.fill();
      ctx.stroke();

      // Wing eyespots
      ctx.fillStyle = '#ffd24a';
      ctx.beginPath();
      ctx.arc(48, -10, 5.5, 0, Utils.TAU);
      ctx.fill();
      ctx.restore();
    }

    // Moth thorax & head
    ctx.fillStyle = isFlashing ? '#ffffff' : '#230b36';
    ctx.strokeStyle = '#ff4fa3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 2, 15, 30, 0, 0, Utils.TAU);
    ctx.fill();
    ctx.stroke();

    // Glowing eyes
    ctx.fillStyle = b.phase === 3 ? '#ffd24a' : '#7ef9ff';
    ctx.beginPath();
    ctx.arc(-4.5, -17, 2.8, 0, Utils.TAU);
    ctx.arc(4.5, -17, 2.8, 0, Utils.TAU);
    ctx.fill();

    // Wing Guard Hexagonal Barrier
    if (isGuarding) {
      const guardPulse = 0.75 + 0.25 * Math.sin(State.time * 16);
      ctx.strokeStyle = `rgba(126, 249, 255, ${0.72 * guardPulse})`;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      const sides = 6;
      const shieldR = 66;
      for (let s = 0; s <= sides; s++) {
        const a = (s / sides) * Utils.TAU + State.time * 0.9;
        const px = Math.cos(a) * shieldR;
        const py = Math.sin(a) * shieldR;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.strokeStyle = `rgba(213, 0, 249, ${0.65 * guardPulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 74, 0, Utils.TAU);
      ctx.stroke();
    }

    ctx.restore();
  },

  renderVFX(ctx) {
    const { State, Utils } = Lumen;

    for (const r of State.rings) {
      if (!r) continue;
      const maxL = r.maxLife || 0.4;
      const t = Utils.clamp(1 - r.life / maxL, 0, 1);
      const rad = Utils.lerp(r.r || 8, r.maxR || 80, t);
      ctx.save();
      ctx.strokeStyle = Utils.hexWithAlpha(r.col || '#ffd24a', (1 - t) * 0.85);
      ctx.lineWidth = (r.width || 3) * (1 - t * 0.5);
      ctx.beginPath();
      ctx.arc(r.x, r.y, rad, 0, Utils.TAU);
      ctx.stroke();
      ctx.restore();
    }

    for (const pt of State.particles) {
      if (!pt) continue;
      const alpha = Utils.clamp(pt.life / (pt.maxLife || 0.4), 0, 1);
      ctx.fillStyle = Utils.hexWithAlpha(pt.col || '#ffd24a', alpha);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, (pt.r || 3) * alpha, 0, Utils.TAU);
      ctx.fill();
    }

    for (const c of State.callouts) {
      if (!c) continue;
      const alpha = Utils.clamp(c.life / (c.maxLife || 1.2), 0, 1);
      ctx.save();
      ctx.font = '700 14px Cinzel, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = Utils.hexWithAlpha(c.col || '#ffd24a', alpha);
      ctx.fillText(c.text, c.x, c.y);
      ctx.restore();
    }
  },

  renderMinimap() {
    const { CONFIG, State, DOM } = Lumen;
    const mCtx = DOM.miniCtx;
    const mCanvas = DOM.miniCanvas;
    if (!mCtx || !mCanvas) return;

    const mw = mCanvas.width;
    const mh = mCanvas.height;
    mCtx.clearRect(0, 0, mw, mh);

    mCtx.fillStyle = 'rgba(5, 16, 23, 0.82)';
    mCtx.fillRect(0, 0, mw, mh);

    const sx = mw / CONFIG.WORLD_W;
    const sy = mh / CONFIG.WORLD_H;

    for (const m of State.moteOrbs) {
      if (!m) continue;
      mCtx.fillStyle = m.kind === 'powerup' ? '#7ef9ff' : 'rgba(255, 210, 74, 0.7)';
      mCtx.fillRect(m.x * sx - 1, m.y * sy - 1, 2.2, 2.2);
    }

    for (const f of State.foes) {
      if (!f || f.dead) continue;
      if (f.type === 'boss') {
        mCtx.fillStyle = '#ff1744';
        mCtx.beginPath();
        mCtx.arc(f.x * sx, f.y * sy, 4.5, 0, Math.PI * 2);
        mCtx.fill();
      } else {
        mCtx.fillStyle = '#ff4fa3';
        mCtx.beginPath();
        mCtx.arc(f.x * sx, f.y * sy, 2.4, 0, Math.PI * 2);
        mCtx.fill();
      }
    }

    if (State.player) {
      mCtx.fillStyle = '#ffd24a';
      mCtx.beginPath();
      mCtx.arc(State.player.x * sx, State.player.y * sy, 3.2, 0, Math.PI * 2);
      mCtx.fill();
    }
  },

  render() {
    const { State, DOM } = Lumen;
    const ctx = DOM.ctx;
    if (!ctx) return;

    const cw = State.cam.w;
    const ch = State.cam.h;
    ctx.clearRect(0, 0, cw, ch);

    const shakeX = State.shakeMag > 0 ? (Math.random() - 0.5) * State.shakeMag : 0;
    const shakeY = State.shakeMag > 0 ? (Math.random() - 0.5) * State.shakeMag : 0;

    ctx.save();
    ctx.translate(cw / 2 - State.cam.x + shakeX, ch / 2 - State.cam.y + shakeY);

    this.renderBackground(ctx);
    this.renderMotes(ctx);
    this.renderPlayer(ctx);

    for (const f of State.foes) {
      if (!f || f.dead) continue;
      if (f.type === 'boss') this.renderBoss(ctx, f);
      else this.renderFoe(ctx, f);
    }

    this.renderProjectiles(ctx);
    this.renderVFX(ctx);
    ctx.restore();

    if (State.flash > 0) {
      ctx.fillStyle = Lumen.Utils.hexWithAlpha(State.flashCol || '#fff5bd', State.flash * 0.45);
      ctx.fillRect(0, 0, cw, ch);
    }

    this.renderMinimap();
  }
};