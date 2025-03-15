document.addEventListener("DOMContentLoaded", () => {
  // Featured Articles Carousel
  const carouselSlides = document.querySelectorAll(".carousel-slide")
  const carouselDots = document.querySelectorAll(".carousel-dots .dot")
  const prevButton = document.querySelector(".carousel-prev")
  const nextButton = document.querySelector(".carousel-next")
  let currentSlide = 0
  let touchStartX = 0
  let touchEndX = 0

  function showSlide(index) {
    // Hide all slides
    carouselSlides.forEach((slide) => {
      slide.classList.remove("active")
    })

    // Remove active class from all dots
    carouselDots.forEach((dot) => {
      dot.classList.remove("active")
    })

    // Show the current slide and activate the corresponding dot
    carouselSlides[index].classList.add("active")
    carouselDots[index].classList.add("active")
  }

  // Initialize dots click event
  if (carouselDots.length > 0) {
    carouselDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index
        showSlide(currentSlide)
      })
    })
  }

  // Initialize prev/next buttons
  if (prevButton && nextButton) {
    prevButton.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length
      showSlide(currentSlide)
    })

    nextButton.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % carouselSlides.length
      showSlide(currentSlide)
    })
  }

  // Add swipe functionality for carousel on touch devices
  const carouselContainer = document.querySelector(".carousel-slider")
  if (carouselContainer && carouselSlides.length > 0) {
    carouselContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    carouselContainer.addEventListener(
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
        currentSlide = (currentSlide + 1) % carouselSlides.length
        showSlide(currentSlide)
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length
        showSlide(currentSlide)
      }
    }
  }

  // Auto-advance slides every 5 seconds
  let slideInterval = setInterval(() => {
    if (carouselSlides.length > 0) {
      currentSlide = (currentSlide + 1) % carouselSlides.length
      showSlide(currentSlide)
    }
  }, 5000)

  // Pause auto-advance when user interacts with carousel
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval)
    })

    carouselContainer.addEventListener("mouseleave", () => {
      slideInterval = setInterval(() => {
        if (carouselSlides.length > 0) {
          currentSlide = (currentSlide + 1) % carouselSlides.length
          showSlide(currentSlide)
        }
      }, 5000)
    })
  }

  // Search functionality
  const searchInput = document.querySelector(".search-box input")
  const articleCards = document.querySelectorAll(".article-card")
  const searchButton = document.querySelector(".search-box button")

  function searchArticles() {
    const searchTerm = searchInput.value.toLowerCase()
    let hasResults = false

    articleCards.forEach((card) => {
      const articleText = card.textContent.toLowerCase()
      if (articleText.includes(searchTerm)) {
        card.style.display = "flex"
        hasResults = true
      } else {
        card.style.display = "none"
      }
    })

    // Show/hide no results message
    const noResultsMessage = document.querySelector(".no-results-message")
    if (noResultsMessage) {
      noResultsMessage.style.display = hasResults ? "none" : "block"
    }
  }

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", searchArticles)
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchArticles()
      }
    })
  }

  // Load More functionality
  const loadMoreBtn = document.getElementById("loadMoreBtn")
  const hiddenArticles = document.querySelectorAll(".article-card.hidden")

  if (loadMoreBtn && hiddenArticles.length > 0) {
    loadMoreBtn.addEventListener("click", () => {
      // Show next batch of hidden articles (e.g., 3 at a time)
      let count = 0
      hiddenArticles.forEach((article) => {
        if (article.classList.contains("hidden") && count < 3) {
          article.classList.remove("hidden")
          article.style.display = "flex"
          count++
        }
      })

      // Hide the load more button if no more hidden articles
      const remainingHidden = document.querySelectorAll(".article-card.hidden").length
      if (remainingHidden === 0) {
        loadMoreBtn.style.display = "none"
      }
    })
  }

  // Newsletter form submission
  const newsletterForms = document.querySelectorAll(".newsletter-form, .newsletter-form-large")

  newsletterForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()

      const emailInput = this.querySelector('input[type="email"]')
      if (emailInput && emailInput.value) {
        // Show success message
        const successMessage = document.createElement("div")
        successMessage.className = "form-success"
        successMessage.innerHTML = "<p>Thank you for subscribing to our newsletter!</p>"

        // Replace form with success message
        this.innerHTML = ""
        this.appendChild(successMessage)
      }
    })
  })

  // Share buttons functionality
  const shareButtons = document.querySelectorAll(".share-btn")

  shareButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()

      const articleTitle = this.closest(".article-card").querySelector("h3").textContent
      const articleUrl = window.location.href

      // Determine which social platform to share on
      if (this.querySelector(".fa-facebook-f")) {
        window.open(
          `https://www.facebook.com/sharer/sharer.  {
                window.open(\`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(articleTitle)}`,
          "_blank",
        )
      } else if (this.querySelector(".fa-twitter")) {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(articleUrl)}`,
          "_blank",
        )
      } else if (this.querySelector(".fa-envelope")) {
        window.open(
          `mailto:?subject=${encodeURIComponent(articleTitle)}&body=${encodeURIComponent(articleUrl)}`,
          "_blank",
        )
      }
    })
  })

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
  animateElements(document.querySelectorAll(".article-card"))
  animateElements(document.querySelectorAll(".sidebar-widget"))
})

