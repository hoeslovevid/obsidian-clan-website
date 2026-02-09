(function () {
  'use strict';

  // Nav logo: cursor-following reflection
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('mousemove', function (e) {
      var rect = logo.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      logo.style.setProperty('--mouse-x', x + '%');
      logo.style.setProperty('--mouse-y', y + '%');
    });
  }

  // Hero tagline: cursor-following reflection
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.addEventListener('mousemove', function (e) {
      var rect = heroContent.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      heroContent.style.setProperty('--mouse-x', x + '%');
      heroContent.style.setProperty('--mouse-y', y + '%');
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll-triggered animations
  const animated = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  animated.forEach(function (el) {
    observer.observe(el);
  });

  // Admins: load from localStorage or data/admins.js, render list, in-page editor
  var ADMIN_STORAGE_KEY = 'obsidian-admins';

  function getAdminList() {
    try {
      var stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        var list = JSON.parse(stored);
        if (Array.isArray(list)) return list;
      }
    } catch (e) { /* ignore */ }
    return (typeof window.ADMIN_LIST !== 'undefined' && Array.isArray(window.ADMIN_LIST))
      ? window.ADMIN_LIST.slice()
      : [];
  }

  function renderAdminList(list) {
    var adminListEl = document.getElementById('admin-list');
    if (!adminListEl) return;
    adminListEl.innerHTML = '';
    (list || []).forEach(function (admin) {
      var name = admin.name || 'Admin';
      var role = admin.role || '';
      var image = admin.image || '';
      var link = admin.link || '';

      var card = document.createElement('div');
      card.className = 'admin-card';

      var content = link
        ? document.createElement('a')
        : document.createElement('div');
      if (link) {
        content.href = link;
        content.target = '_blank';
        content.rel = 'noopener noreferrer';
        content.className = 'admin-card-inner admin-card-link';
      } else {
        content.className = 'admin-card-inner';
      }

      var avatar = document.createElement('div');
      avatar.className = 'admin-avatar';
      if (image) {
        var img = document.createElement('img');
        img.src = image;
        img.alt = name;
        img.loading = 'lazy';
        img.onerror = function () {
          avatar.classList.add('admin-avatar-placeholder');
          avatar.textContent = name.charAt(0).toUpperCase();
        };
        avatar.appendChild(img);
      } else {
        avatar.classList.add('admin-avatar-placeholder');
        avatar.textContent = name.charAt(0).toUpperCase();
      }

      var nameEl = document.createElement('span');
      nameEl.className = 'admin-name';
      nameEl.textContent = name;

      var roleEl = document.createElement('span');
      roleEl.className = 'admin-role';
      roleEl.textContent = role;

      content.appendChild(avatar);
      content.appendChild(nameEl);
      content.appendChild(roleEl);
      card.appendChild(content);
      adminListEl.appendChild(card);
    });
  }

  renderAdminList(getAdminList());

  // In-page admin editor (password-protected)
  var ADMIN_VERIFY_KEY = 'obsidian-admin-verified';
  var editorEl = document.getElementById('admin-editor');
  var editorGate = document.getElementById('admin-editor-gate');
  var editorContent = document.getElementById('admin-editor-content');
  var editorRows = document.getElementById('admin-editor-rows');
  var editorSaved = document.getElementById('admin-editor-saved');

  function isEditorVerified() {
    try {
      return sessionStorage.getItem(ADMIN_VERIFY_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setEditorVerified(verified) {
    try {
      if (verified) sessionStorage.setItem(ADMIN_VERIFY_KEY, '1');
      else sessionStorage.removeItem(ADMIN_VERIFY_KEY);
    } catch (e) { /* ignore */ }
  }

  function showEditorUI(showGate) {
    if (editorGate) editorGate.hidden = !showGate;
    if (editorContent) {
      editorContent.hidden = showGate;
      if (!showGate) populateEditorRows();
    }
  }

  function showEditor(show) {
    if (!editorEl) return;
    editorEl.classList.toggle('admin-editor-visible', show);
    editorEl.setAttribute('aria-hidden', !show);
    if (show) {
      if (isEditorVerified()) {
        showEditorUI(false);
      } else {
        showEditorUI(true);
        var errEl = document.getElementById('admin-editor-gate-error');
        if (errEl) errEl.textContent = '';
              var pwInput = document.getElementById('admin-editor-password');
        if (pwInput) pwInput.value = '';
      }
    }
  }

  function populateEditorRows() {
    if (!editorRows) return;
    var list = getAdminList();
    editorRows.innerHTML = '';
    list.forEach(function (admin, index) {
      var row = document.createElement('div');
      row.className = 'admin-editor-row';
      var imageValue = admin.image || '';
      row.innerHTML =
        '<label class="admin-editor-label">Name <input type="text" class="admin-edit-name" value="' + escapeAttr(admin.name || '') + '" placeholder="Display name"></label>' +
        '<label class="admin-editor-label">Role <input type="text" class="admin-edit-role" value="' + escapeAttr(admin.role || '') + '" placeholder="e.g. Clan Leader, Officer"></label>' +
        '<div class="admin-editor-photo">' +
          '<span class="admin-editor-label">Photo</span>' +
          '<div class="admin-editor-photo-wrap">' +
            '<input type="file" accept="image/*" class="admin-editor-file" aria-label="Choose photo">' +
            '<div class="admin-editor-preview">' +
              (imageValue ? '<img src="' + escapeAttr(imageValue) + '" alt="">' : '<span class="admin-editor-preview-empty">No photo</span>') +
            '</div>' +
            '<input type="hidden" class="admin-edit-image" value="' + escapeAttr(imageValue) + '">' +
            '<button type="button" class="admin-editor-clear-photo">Clear</button>' +
          '</div>' +
        '</div>' +
        '<label class="admin-editor-label">Link (optional) <input type="url" class="admin-edit-link" value="' + escapeAttr(admin.link || '') + '" placeholder="https://discord.com/..."></label>' +
        '<button type="button" class="admin-editor-remove" data-index="' + index + '">Remove admin</button>';
      editorRows.appendChild(row);

      var fileInput = row.querySelector('.admin-editor-file');
      var preview = row.querySelector('.admin-editor-preview');
      var hiddenImage = row.querySelector('.admin-edit-image');
      var clearBtn = row.querySelector('.admin-editor-clear-photo');

      function setPreview(src) {
        if (preview) {
          if (src) {
            var img = preview.querySelector('img');
            if (img) {
              img.src = src;
              img.style.display = '';
            } else {
              preview.innerHTML = '<img src="' + escapeAttr(src) + '" alt="">';
            }
            var empty = preview.querySelector('.admin-editor-preview-empty');
            if (empty) empty.style.display = 'none';
          } else {
            preview.innerHTML = '<span class="admin-editor-preview-empty">No photo</span>';
            if (hiddenImage) hiddenImage.value = '';
          }
        }
        if (hiddenImage) hiddenImage.value = src || '';
      }

      if (fileInput) {
        fileInput.addEventListener('change', function () {
          var file = fileInput.files && fileInput.files[0];
          if (!file || !file.type.match(/^image\//)) return;
          var reader = new FileReader();
          reader.onload = function (e) {
            setPreview(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          setPreview('');
          if (fileInput) fileInput.value = '';
        });
      }
    });

    editorRows.querySelectorAll('.admin-editor-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var list = getEditorList();
        var i = parseInt(btn.getAttribute('data-index'), 10);
        if (i >= 0 && i < list.length) {
          list.splice(i, 1);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(list));
          renderAdminList(list);
          populateEditorRows();
        }
      });
    });
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function getEditorList() {
    var rows = editorRows ? editorRows.querySelectorAll('.admin-editor-row') : [];
    var list = [];
    rows.forEach(function (row) {
      var name = (row.querySelector('.admin-edit-name') || {}).value || '';
      var role = (row.querySelector('.admin-edit-role') || {}).value || '';
      var image = (row.querySelector('.admin-edit-image') || {}).value || '';
      var link = (row.querySelector('.admin-edit-link') || {}).value || '';
      list.push({ name: name.trim(), role: role.trim(), image: image.trim(), link: link.trim() });
    });
    return list;
  }

  function onEditorSave() {
    var list = getEditorList();
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(list));
    renderAdminList(list);
    if (editorSaved) {
      editorSaved.classList.add('admin-editor-saved-visible');
      setTimeout(function () { editorSaved.classList.remove('admin-editor-saved-visible'); }, 2000);
    }
  }

  function onEditorExport() {
    var list = getEditorList();
    var lines = ['var ADMIN_LIST = ' + JSON.stringify(list, null, 2) + ';'];
    var blob = new Blob([lines.join('\n')], { type: 'application/javascript' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'admins.js';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function onEditorAdd() {
    var list = getAdminList();
    list.push({ name: '', role: '', image: '', link: '' });
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(list));
    renderAdminList(list);
    populateEditorRows();
  }

  if (editorEl) {
    if (window.location.hash === '#edit-admins') showEditor(true);
    window.addEventListener('hashchange', function () {
      showEditor(window.location.hash === '#edit-admins');
    });
  }

  var gateForm = document.getElementById('admin-editor-gate-form');
  if (gateForm) {
    gateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pwInput = document.getElementById('admin-editor-password');
      var errEl = document.getElementById('admin-editor-gate-error');
      var expected = (typeof window.ADMIN_EDIT_PASSWORD !== 'undefined') ? String(window.ADMIN_EDIT_PASSWORD) : null;
      var entered = pwInput ? pwInput.value : '';
      if (expected === null) {
        if (errEl) errEl.textContent = 'Admin access is not configured. Add data/admin-config.js with ADMIN_EDIT_PASSWORD set.';
        return;
      }
      if (entered === expected) {
        setEditorVerified(true);
        showEditorUI(false);
        if (errEl) errEl.textContent = '';
      } else {
        if (errEl) errEl.textContent = 'Incorrect password.';
      }
    });
  }

  var lockBtn = document.getElementById('admin-editor-lock');
  if (lockBtn) {
    lockBtn.addEventListener('click', function () {
      setEditorVerified(false);
      showEditorUI(true);
      var pwInput = document.getElementById('admin-editor-password');
      var errEl = document.getElementById('admin-editor-gate-error');
      if (pwInput) pwInput.value = '';
      if (errEl) errEl.textContent = '';
    });
  }

  var closeBtn = document.getElementById('admin-editor-close');
  if (closeBtn) closeBtn.addEventListener('click', function (e) { e.preventDefault(); window.location.hash = ''; });

  var addBtn = document.getElementById('admin-editor-add');
  if (addBtn) addBtn.addEventListener('click', onEditorAdd);

  var saveBtn = document.getElementById('admin-editor-save');
  if (saveBtn) saveBtn.addEventListener('click', onEditorSave);

  var exportBtn = document.getElementById('admin-editor-export');
  if (exportBtn) exportBtn.addEventListener('click', onEditorExport);

  // Discord member count (auto-updates when deployed with Netlify function)
  const discordCountEl = document.querySelector('.discord-member-number');
  const discordOnlineEl = document.querySelector('.discord-online-count');
  if (discordCountEl) {
    fetch('/.netlify/functions/discord-stats')
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (result && result.data && typeof result.data.count === 'number') {
          discordCountEl.textContent = result.data.count.toLocaleString();
          if (discordOnlineEl && typeof result.data.online === 'number') {
            discordOnlineEl.textContent = ' (' + result.data.online.toLocaleString() + ' online)';
          }
        }
      })
      .catch(function () { /* keep placeholder on fail (e.g. not on Netlify) */ });
  }
})();
