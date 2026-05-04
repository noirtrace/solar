// Mobile navigation toggle.
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// Subtle scroll reveal animation.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

function showErr(fieldId, errId, show) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  field.classList.toggle("error", show);
  err.classList.toggle("show", show);
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value) {
  if (!value.trim()) return true;
  const cleaned = value.replace(/[\s\-()]/g, "");
  return /^(\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
}

// Request quote form: validates fields and submits cleanly to Formspree.
const form = document.getElementById("leadForm");
const formSuccess = document.getElementById("form-success");
const formSubmitError = document.getElementById("form-submit-err");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formSubmitError.classList.remove("show");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  let valid = true;
  if (!name) { showErr("name", "name-err", true); valid = false; } else { showErr("name", "name-err", false); }
  if (!validateEmail(email)) { showErr("email", "email-err", true); valid = false; } else { showErr("email", "email-err", false); }
  if (!validatePhone(phone)) { showErr("phone", "phone-err", true); valid = false; } else { showErr("phone", "phone-err", false); }
  if (!message) { showErr("message", "message-err", true); valid = false; } else { showErr("message", "message-err", false); }
  if (!valid) return;

  const button = form.querySelector(".btn-submit");
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Form submission failed");

    form.reset();
    formSuccess.style.display = "block";
    setTimeout(() => { formSuccess.style.display = "none"; }, 6000);
  } catch (error) {
    formSubmitError.classList.add("show");
  } finally {
    button.disabled = false;
    button.innerHTML = originalText;
  }
});

["name", "email", "phone", "message"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => showErr(id, id + "-err", false));
});

// Review form: clickable star rating and separate structured Formspree submit.
const feedbackForm = document.getElementById("feedbackForm");
const feedbackSuccess = document.getElementById("feedback-success");
const feedbackSubmitError = document.getElementById("feedback-submit-err");
const ratingInput = document.getElementById("review-rating");
const ratingStars = document.querySelectorAll(".rating-star");

function paintStars(value) {
  ratingStars.forEach((star) => {
    star.classList.toggle("active", Number(star.dataset.rating) <= Number(value));
  });
}

ratingStars.forEach((star) => {
  star.addEventListener("click", () => {
    ratingInput.value = star.dataset.rating;
    paintStars(ratingInput.value);
    showErr("review-rating", "review-rating-err", false);
  });
});

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  feedbackSubmitError.classList.remove("show");

  const rating = ratingInput.value;
  const reviewName = document.getElementById("review-name").value.trim();
  const reviewEmail = document.getElementById("review-email").value.trim();
  const reviewFeedback = document.getElementById("review-feedback").value.trim();

  let valid = true;
  if (!rating) { showErr("review-rating", "review-rating-err", true); valid = false; } else { showErr("review-rating", "review-rating-err", false); }
  if (!reviewName) { showErr("review-name", "review-name-err", true); valid = false; } else { showErr("review-name", "review-name-err", false); }
  if (reviewEmail && !validateEmail(reviewEmail)) { showErr("review-email", "review-email-err", true); valid = false; } else { showErr("review-email", "review-email-err", false); }
  if (!reviewFeedback) { showErr("review-feedback", "review-feedback-err", true); valid = false; } else { showErr("review-feedback", "review-feedback-err", false); }
  if (!valid) return;

  const button = feedbackForm.querySelector(".btn-submit");
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

  try {
    const response = await fetch(feedbackForm.action, {
      method: "POST",
      body: new FormData(feedbackForm),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Feedback submission failed");

    feedbackForm.reset();
    ratingInput.value = "";
    paintStars(0);
    feedbackSuccess.style.display = "block";
    setTimeout(() => { feedbackSuccess.style.display = "none"; }, 6000);
  } catch (error) {
    feedbackSubmitError.classList.add("show");
  } finally {
    button.disabled = false;
    button.innerHTML = originalText;
  }
});

["review-name", "review-email", "review-feedback"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => showErr(id, id + "-err", false));
});
