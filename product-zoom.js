(() => {
  const oldModal = document.querySelector("#productZoomModal");
  if (oldModal) oldModal.remove();

  const modal = document.createElement("dialog");
  modal.id = "productZoomModal";
  modal.innerHTML = `
    <button type="button" class="zoom-x" aria-label="Close">×</button>
    <div class="zoom-stage">
      <img class="zoom-img" alt="">
      <div class="zoom-name"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const img = modal.querySelector(".zoom-img");
  const nameBox = modal.querySelector(".zoom-name");
  const closeBtn = modal.querySelector(".zoom-x");

  function closeZoom(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation?.();
    }

    img.classList.remove("zooming");
    img.style.transformOrigin = "center";
    if (modal.open) modal.close();
  }

  function openZoom(card) {
    const productImg = card.querySelector("img");
    const title = card.querySelector(".product-title")?.textContent?.trim() || "Premium product";

    if (!productImg) return;

    img.src = productImg.currentSrc || productImg.src || productImg.getAttribute("src");
    img.alt = title;
    nameBox.textContent = title;

    modal.showModal();
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("#productZoomModal .zoom-x")) {
      closeZoom(e);
      return;
    }

    const card = e.target.closest(".product-card");
    if (!card) return;

    if (
      e.target.closest(".add-product") ||
      e.target.closest(".size-pill") ||
      e.target.closest("button")
    ) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();

    openZoom(card);
  }, true);

  closeBtn.addEventListener("pointerdown", closeZoom, true);
  closeBtn.addEventListener("click", closeZoom, true);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeZoom(e);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.open) closeZoom(e);
  });

  function moveZoom(e) {
    const r = img.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }

  img.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    img.classList.add("zooming");
    moveZoom(e);
    img.setPointerCapture?.(e.pointerId);
  });

  img.addEventListener("pointermove", (e) => {
    if (img.classList.contains("zooming")) moveZoom(e);
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
    img.addEventListener(type, () => {
      img.classList.remove("zooming");
      img.style.transformOrigin = "center";
    });
  });
})();
