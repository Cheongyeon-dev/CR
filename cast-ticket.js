(function () {
  var STORAGE_KEY = 'tdos-cast-boarded';

  var embarkGate = document.getElementById('embark-gate');
  var btnEmbark = document.getElementById('btn-embark');
  var passOverlay = document.getElementById('pass-overlay');
  var cruisePass = document.getElementById('cruise-pass');
  var page = document.getElementById('cast-page');
  var btnPass = document.getElementById('btn-pass-confirm');

  if (!page) return;

  var tearing = false;

  function isBoarded() {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  }

  function hideEl(el) {
    if (!el) return;
    el.classList.add('is-closed');
    el.setAttribute('hidden', '');
    el.classList.remove('is-leaving', 'is-ready');
  }

  function showEl(el) {
    if (!el) return;
    el.removeAttribute('hidden');
    el.classList.remove('is-closed', 'is-leaving', 'is-ready');
  }

  function applyBoardedState() {
    tearing = false;
    document.body.classList.remove('is-pass-review', 'is-embarking');
    document.body.classList.add('is-boarded');
    page.setAttribute('aria-hidden', 'false');

    hideEl(embarkGate);
    hideEl(passOverlay);

    if (cruisePass) cruisePass.classList.remove('is-torn');

    if (btnPass) {
      btnPass.disabled = false;
      btnPass.textContent = '승선권 확인';
    }
  }

  function showEmbarkGate() {
    document.body.classList.remove('is-boarded', 'is-pass-review');
    document.body.classList.add('is-embarking');
    page.setAttribute('aria-hidden', 'true');
    showEl(embarkGate);
    hideEl(passOverlay);
  }

  function showBoardingPass() {
    document.body.classList.remove('is-boarded', 'is-embarking');
    document.body.classList.add('is-pass-review');
    page.setAttribute('aria-hidden', 'true');
    hideEl(embarkGate);

    if (!passOverlay || !btnPass) {
      applyBoardedState();
      return;
    }

    showEl(passOverlay);
    if (cruisePass) cruisePass.classList.remove('is-torn');
    btnPass.disabled = false;
    btnPass.textContent = '승선권 확인';
  }

  if (isBoarded()) {
    applyBoardedState();
  } else if (embarkGate && btnEmbark) {
    showEmbarkGate();
  } else if (passOverlay && btnPass) {
    showBoardingPass();
  } else {
    applyBoardedState();
  }

  if (btnEmbark && embarkGate) {
    btnEmbark.addEventListener('click', function () {
      if (btnEmbark.disabled) return;
      btnEmbark.disabled = true;
      embarkGate.classList.add('is-leaving');
      window.setTimeout(function () {
        showBoardingPass();
        embarkGate.classList.remove('is-leaving');
        btnEmbark.disabled = false;
      }, 600);
    });
  }

  if (btnPass && passOverlay && cruisePass) {
    btnPass.addEventListener('click', function () {
      if (tearing || btnPass.disabled || cruisePass.classList.contains('is-torn')) return;
      if (isBoarded()) {
        applyBoardedState();
        return;
      }

      tearing = true;
      btnPass.disabled = true;
      btnPass.textContent = '탑승 중…';
      cruisePass.classList.add('is-torn');

      window.setTimeout(function () {
        sessionStorage.setItem(STORAGE_KEY, '1');
        passOverlay.classList.add('is-leaving');

        window.setTimeout(function () {
          applyBoardedState();
        }, 700);
      }, 900);
    });
  }

  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    if (isBoarded()) applyBoardedState();
  });
})();
