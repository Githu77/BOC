document.addEventListener("DOMContentLoaded", () => {
  // Timeline Slider Functionality
  const timelineSlides = document.querySelectorAll(".timeline-event")
  const timelineDots = document.querySelectorAll(".timeline-dots .dot")
  const prevButton = document.querySelector(".timeline-prev")
  const nextButton = document.querySelector(".timeline-next")
  let currentSlide = 0
  let touchStartX = 0
  let touchEndX = 0

  function showSlide(index) {
    // Hide all slides
    timelineSlides.forEach((slide) => {
      slide.classList.remove("active")
    })

    // Remove active class from all dots
    timelineDots.forEach((dot) => {
      dot.classList.remove("active")
    })

    // Show the current slide and activate the corresponding dot
    timelineSlides[index].classList.add("active")
    timelineDots[index].classList.add("active")
  }

  // Initialize dots click event
  if (timelineDots.length > 0) {
    timelineDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index
        showSlide(currentSlide)
      })
    })
  }

  // Initialize prev/next buttons
  if (prevButton && nextButton) {
    prevButton.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + timelineSlides.length) % timelineSlides.length
      showSlide(currentSlide)
    })

    nextButton.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % timelineSlides.length
      showSlide(currentSlide)
    })
  }

  // Add swipe functionality for timeline on touch devices
  const timelineContainer = document.querySelector(".timeline-slider")
  if (timelineContainer && timelineSlides.length > 0) {
    timelineContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    timelineContainer.addEventListener(
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
        currentSlide = (currentSlide + 1) % timelineSlides.length
        showSlide(currentSlide)
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        currentSlide = (currentSlide - 1 + timelineSlides.length) % timelineSlides.length
        showSlide(currentSlide)
      }
    }
  }

  // Auto-advance slides every 5 seconds
  let slideInterval = setInterval(() => {
    if (timelineSlides.length > 0) {
      currentSlide = (currentSlide + 1) % timelineSlides.length
      showSlide(currentSlide)
    }
  }, 5000)

  // Pause auto-advance when user interacts with timeline
  if (timelineContainer) {
    timelineContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval)
    })

    timelineContainer.addEventListener("mouseleave", () => {
      slideInterval = setInterval(() => {
        if (timelineSlides.length > 0) {
          currentSlide = (currentSlide + 1) % timelineSlides.length
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
  animateElements(document.querySelectorAll(".leader-card"))
  animateElements(document.querySelectorAll(".value-card"))
  animateElements(document.querySelectorAll(".gallery-item"))
})

document.querySelectorAll('.leader-image img').forEach(img => {
  img.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  img.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });
});