document.addEventListener("DOMContentLoaded", () => {
  // Accordion functionality
  const accordionItems = document.querySelectorAll(".accordion-item")

  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header")

      header.addEventListener("click", () => {
        // Check if this item is already active
        const isActive = item.classList.contains("active")

        // Close all accordion items
        accordionItems.forEach((accItem) => {
          accItem.classList.remove("active")
          const toggle = accItem.querySelector(".accordion-toggle i")
          if (toggle) {
            toggle.className = "fas fa-plus"
          }
        })

        // If the clicked item wasn't active, open it
        if (!isActive) {
          item.classList.add("active")
          const toggle = item.querySelector(".accordion-toggle i")
          if (toggle) {
            toggle.className = "fas fa-minus"
          }
        }
      })
    })

    // Open the first accordion item by default
    if (accordionItems[0]) {
      accordionItems[0].classList.add("active")
      const toggle = accordionItems[0].querySelector(".accordion-toggle i")
      if (toggle) {
        toggle.className = "fas fa-minus"
      }
    }
  }

  // Services search and filter functionality
  const serviceSearch = document.getElementById("serviceSearch")
  const specialtyFilter = document.getElementById("specialtyFilter")
  const availabilityFilter = document.getElementById("availabilityFilter")
  const filterBtn = document.querySelector(".filter-btn")
  const resetSearchBtn = document.querySelector(".reset-search")
  const serviceCards = document.querySelectorAll(".service-category-card")
  const noResultsMessage = document.querySelector(".no-results-message")

  function filterServices() {
    if (!serviceCards.length) return

    const searchTerm = serviceSearch ? serviceSearch.value.toLowerCase() : ""
    const specialty = specialtyFilter ? specialtyFilter.value.toLowerCase() : ""
    const availability = availabilityFilter ? availabilityFilter.value.toLowerCase() : ""

    let visibleCount = 0

    serviceCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase()
      const cardSpecialties = card.getAttribute("data-specialty") || ""
      const cardAvailability = card.getAttribute("data-availability") || ""

      const matchesSearch = !searchTerm || cardText.includes(searchTerm)
      const matchesSpecialty = !specialty || cardSpecialties.includes(specialty)
      const matchesAvailability = !availability || cardAvailability.includes(availability)

      if (matchesSearch && matchesSpecialty && matchesAvailability) {
        card.style.display = "flex"
        visibleCount++
      } else {
        card.style.display = "none"
      }
    })

    // Show or hide the "no results" message
    if (noResultsMessage) {
      if (visibleCount === 0) {
        noResultsMessage.style.display = "block"
      } else {
        noResultsMessage.style.display = "none"
      }
    }
  }

  // Add event listeners for search and filter
  if (filterBtn) {
    filterBtn.addEventListener("click", filterServices)
  }

  if (serviceSearch) {
    serviceSearch.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        filterServices()
      }
    })
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", () => {
      if (serviceSearch) serviceSearch.value = ""
      if (specialtyFilter) specialtyFilter.value = ""
      if (availabilityFilter) availabilityFilter.value = ""
      filterServices()
    })
  }

  // Testimonial slider functionality for service pages
  const testimonialSlides = document.querySelectorAll(".testimonial-slide")
  const testimonialDots = document.querySelectorAll(".dot")
  const prevButton = document.querySelector(".testimonial-prev")
  const nextButton = document.querySelector(".testimonial-next")
  let currentSlide = 0
  let touchStartX = 0
  let touchEndX = 0

  function showSlide(index) {
    if (!testimonialSlides.length) return

    // Hide all slides
    testimonialSlides.forEach((slide) => {
      slide.classList.remove("active")
    })

    // Remove active class from all dots
    testimonialDots.forEach((dot) => {
      dot.classList.remove("active")
    })

    // Show the current slide and activate the corresponding dot
    testimonialSlides[index].classList.add("active")
    testimonialDots[index].classList.add("active")
  }

  // Initialize dots click event
  if (testimonialDots.length > 0) {
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index
        showSlide(currentSlide)
      })
    })
  }

  // Initialize prev/next buttons
  if (prevButton && nextButton) {
    prevButton.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length
      showSlide(currentSlide)
    })

    nextButton.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % testimonialSlides.length
      showSlide(currentSlide)
    })
  }

  // Add swipe functionality for testimonials on touch devices
  const testimonialContainer = document.querySelector(".testimonial-container")
  if (testimonialContainer && testimonialSlides.length > 0) {
    testimonialContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    testimonialContainer.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        handleSwipe()
      },
      { passive: true },
    )

    function handleSwipe() {
      const swipeThreshold = 50
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        currentSlide = (currentSlide + 1) % testimonialSlides.length
        showSlide(currentSlide)
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length
        showSlide(currentSlide)
      }
    }
  }

  // Auto-advance slides every 5 seconds
  let slideInterval = setInterval(() => {
    if (testimonialSlides.length > 0) {
      currentSlide = (currentSlide + 1) % testimonialSlides.length
      showSlide(currentSlide)
    }
  }, 5000)

  // Pause auto-advance when user interacts with testimonials
  if (testimonialContainer) {
    testimonialContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval)
    })

    testimonialContainer.addEventListener("mouseleave", () => {
      slideInterval = setInterval(() => {
        if (testimonialSlides.length > 0) {
          currentSlide = (currentSlide + 1) % testimonialSlides.length
          showSlide(currentSlide)
        }
      }, 5000)
    })
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
  animateElements(document.querySelectorAll(".service-category-card"))
  animateElements(document.querySelectorAll(".benefit-card"))
  animateElements(document.querySelectorAll(".accordion-item"))
  animateElements(document.querySelectorAll(".team-member"))
})

