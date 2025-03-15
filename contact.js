document.addEventListener("DOMContentLoaded", () => {
  // Form validation
  const contactForm = document.getElementById("contactForm")
  const successMessage = document.getElementById("successMessage")
  const resetFormBtn = document.getElementById("resetForm")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Reset previous error states
      const formGroups = this.querySelectorAll(".form-group")
      formGroups.forEach((group) => {
        group.classList.remove("error")
      })

      let isValid = true

      // Validate name
      const nameInput = document.getElementById("name")
      if (!nameInput.value.trim()) {
        document.getElementById("nameError").textContent = "Please enter your name"
        nameInput.closest(".form-group").classList.add("error")
        isValid = false
      }

      // Validate email
      const emailInput = document.getElementById("email")
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        document.getElementById("emailError").textContent = "Please enter a valid email address"
        emailInput.closest(".form-group").classList.add("error")
        isValid = false
      }

      // Validate phone (optional but must be valid if provided)
      const phoneInput = document.getElementById("phone")
      if (phoneInput.value.trim()) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/
        if (!phoneRegex.test(phoneInput.value)) {
          document.getElementById("phoneError").textContent = "Please enter a valid phone number"
          phoneInput.closest(".form-group").classList.add("error")
          isValid = false
        }
      }

      // Validate subject
      const subjectInput = document.getElementById("subject")
      if (!subjectInput.value) {
        document.getElementById("subjectError").textContent = "Please select a subject"
        subjectInput.closest(".form-group").classList.add("error")
        isValid = false
      }

      // Validate message
      const messageInput = document.getElementById("message")
      if (!messageInput.value.trim()) {
        document.getElementById("messageError").textContent = "Please enter your message"
        messageInput.closest(".form-group").classList.add("error")
        isValid = false
      }

      // Validate consent
      const consentInput = document.getElementById("consent")
      if (!consentInput.checked) {
        document.getElementById("consentError").textContent = "You must consent to proceed"
        consentInput.closest(".form-group").classList.add("error")
        isValid = false
      }

      // If form is valid, show success message
      if (isValid) {
        contactForm.style.display = "none"
        if (successMessage) {
          successMessage.style.display = "block"
        }

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: "smooth" })
      }
    })
  }

  // Reset form button
  if (resetFormBtn) {
    resetFormBtn.addEventListener("click", () => {
      if (contactForm) {
        contactForm.reset()
        contactForm.style.display = "flex"
        successMessage.style.display = "none"

        // Remove all error states
        const formGroups = contactForm.querySelectorAll(".form-group")
        formGroups.forEach((group) => {
          group.classList.remove("error")
        })
      }
    })
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item")

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")

      question.addEventListener("click", () => {
        // Check if this item is already active
        const isActive = item.classList.contains("active")

        // Close all FAQ items
        faqItems.forEach((faqItem) => {
          faqItem.classList.remove("active")
          const toggle = faqItem.querySelector(".faq-toggle i")
          if (toggle) {
            toggle.className = "fas fa-plus"
          }
        })

        // If the clicked item wasn't active, open it
        if (!isActive) {
          item.classList.add("active")
          const toggle = item.querySelector(".faq-toggle i")
          if (toggle) {
            toggle.className = "fas fa-minus"
          }
        }
      })
    })

    // Open the first FAQ item by default
    faqItems[0].classList.add("active")
    const toggle = faqItems[0].querySelector(".faq-toggle i")
    if (toggle) {
      toggle.className = "fas fa-minus"
    }
  }

  // Add animation on scroll with IntersectionObserver
  const animateElements = (elements, threshold = 0.1) => {
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold },
    )

    elements.forEach((element, index) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`
      element.classList.add("animate-target")
      observer.observe(element)
    })
  }

  // Apply animations to various elements
  animateElements(document.querySelectorAll(".contact-info-card"))
  animateElements(document.querySelectorAll(".faq-item"))

  // Add CSS for animation
  const style = document.createElement("style")
  style.textContent = `
        .animate-target.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `
  document.head.appendChild(style)
})

