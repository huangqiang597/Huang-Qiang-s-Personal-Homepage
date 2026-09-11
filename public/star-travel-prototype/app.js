(() => {
  const screens = [...document.querySelectorAll('.app-screen')];
  const flowButtons = [...document.querySelectorAll('.flow-nav [data-go]')];
  const viewport = document.getElementById('appViewport');
  const modal = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalCopy = document.getElementById('modalCopy');
  const modalCancel = document.getElementById('modalCancel');
  const modalConfirm = document.getElementById('modalConfirm');
  const toast = document.getElementById('toast');
  let pendingAction = null;
  let toastTimer = null;

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function goTo(name, updateHash = true) {
    const next = screens.find((screen) => screen.dataset.screen === name);
    if (!next) return;
    screens.forEach((screen) => screen.classList.toggle('active', screen === next));
    flowButtons.forEach((button) => button.classList.toggle('active', button.dataset.go === name));
    const scroller = next.querySelector('.screen-scroll');
    if (scroller) scroller.scrollTop = 0;
    if (updateHash) history.replaceState(null, '', `#${name}`);
  }

  function openModal(action, title, copy, confirmLabel) {
    pendingAction = action;
    modalTitle.textContent = title;
    modalCopy.textContent = copy;
    modalConfirm.textContent = confirmLabel;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    pendingAction = null;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('click', (event) => {
    const goButton = event.target.closest('[data-go]');
    if (goButton) {
      goTo(goButton.dataset.go);
      return;
    }

    const planButton = event.target.closest('.select-plan');
    if (planButton) {
      showToast(`已选择${planButton.dataset.plan}，正在生成预订预览`);
      window.setTimeout(() => goTo('booking'), 450);
      return;
    }

    const rememberButton = event.target.closest('.remember-btn');
    if (rememberButton) {
      rememberButton.textContent = '已记住';
      rememberButton.disabled = true;
      showToast('偏好已保存，可在“我的”中随时修改或删除');
      return;
    }

    const choiceButton = event.target.closest('.choice');
    if (choiceButton) {
      choiceButton.parentElement.querySelectorAll('.choice').forEach((item) => item.classList.remove('active'));
      choiceButton.classList.add('active');
    }
  });

  document.getElementById('confirmBooking').addEventListener('click', () => {
    if (!document.getElementById('bookingCheck').checked) {
      showToast('请先确认乘机人、日期、退改规则和订单金额');
      return;
    }
    openModal(
      'booking',
      '确认创建订单？',
      '订单总额 ¥2,356。确认后系统将使用一次性凭证执行预订，并记录完整审计日志。',
      '确认创建订单'
    );
  });

  document.getElementById('submitExpense').addEventListener('click', () => {
    if (!document.getElementById('expenseCheck').checked) {
      showToast('提交前请确认费用真实且未重复报销');
      return;
    }
    openModal(
      'expense',
      '提交报销单？',
      '个人预计报销 ¥2,028。提交后将进入直属经理审批，你仍可在审批前撤回。',
      '确认提交'
    );
  });

  document.getElementById('approveApproval').addEventListener('click', () => {
    openModal(
      'approve',
      '批准住宿例外？',
      '批准后，超标原因、政策依据、候选方案和你的审批意见都会写入审计记录。',
      '确认批准'
    );
  });

  document.getElementById('rejectApproval').addEventListener('click', () => {
    showToast('已进入驳回意见填写页（原型演示）');
  });

  modalCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  modalConfirm.addEventListener('click', () => {
    const action = pendingAction;
    closeModal();
    if (action === 'booking') {
      goTo('trip');
      showToast('订单创建成功，已加入“我的行程”');
    } else if (action === 'expense') {
      showToast('报销单 RMB-20260730-026 已提交审批');
    } else if (action === 'approve') {
      const button = document.getElementById('approveApproval');
      button.textContent = '已批准';
      button.disabled = true;
      document.getElementById('rejectApproval').disabled = true;
      showToast('住宿例外已批准，审批记录已留痕');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  const initialScreen = location.hash.slice(1);
  goTo(screens.some((screen) => screen.dataset.screen === initialScreen) ? initialScreen : 'home', false);

  viewport.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = event.target.closest('[data-go]');
    if (target) goTo(target.dataset.go);
  });
})();
