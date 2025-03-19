document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle with improved functionality
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mainNav = document.querySelector(".main-nav")
  const body = document.body

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      if (mainNav) {
        mainNav.classList.toggle("active")

        // Prevent body scrolling when menu is open
        if (mainNav.classList.contains("active")) {
          body.style.overflow = "hidden"
        } else {
          body.style.overflow = ""
        }

        // Change icon based on menu state
        const icon = this.querySelector("i")
        if (icon) {
          if (mainNav.classList.contains("active")) {
            icon.classList.remove("fa-bars")
            icon.classList.add("fa-times")
          } else {
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
          }
        }
      }
    })
  }

  // Improve dropdown behavior on mobile
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const dropdownLink = dropdown.querySelector("a")
    const dropdownContent = dropdown.querySelector(".dropdown-content")

    if (dropdownLink && dropdownContent) {
      // Add dropdown toggle for mobile
      const dropdownToggle = document.createElement("span")
      dropdownToggle.className = "dropdown-toggle"
      dropdownToggle.innerHTML = '<i class="fas fa-chevron-down"></i>'
      dropdownLink.appendChild(dropdownToggle)

      dropdownToggle.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()

        // Close all other dropdowns first
        dropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            const otherContent = otherDropdown.querySelector(".dropdown-content")
            if (otherContent) {
              otherContent.classList.remove("show")
            }
            const otherToggle = otherDropdown.querySelector(".dropdown-toggle i")
            if (otherToggle) {
              otherToggle.className = "fas fa-chevron-down"
            }
          }
        })

        // Toggle current dropdown
        dropdownContent.classList.toggle("show")

        // Rotate chevron
        const icon = this.querySelector("i")
        if (icon) {
          if (dropdownContent.classList.contains("show")) {
            icon.className = "fas fa-chevron-up"
          } else {
            icon.className = "fas fa-chevron-down"
          }
        }
      })
    }
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (mainNav && mainNav.classList.contains("active")) {
      if (!mainNav.contains(e.target) && e.target !== mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove("active")
        body.style.overflow = ""
        const icon = mobileMenuBtn.querySelector("i")
        if (icon) {
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      }
    }

    // Close dropdowns when clicking outside
    dropdowns.forEach((dropdown) => {
      const dropdownContent = dropdown.querySelector(".dropdown-content")
      if (dropdownContent && dropdownContent.classList.contains("show")) {
        if (!dropdown.contains(e.target)) {
          dropdownContent.classList.remove("show")
          const toggle = dropdown.querySelector(".dropdown-toggle i")
          if (toggle) {
            toggle.className = "fas fa-chevron-down"
          }
        }
      }
    })
  })

  // Service search functionality
  const searchInput = document.querySelector(".search-box input")
  const serviceItems = document.querySelectorAll(".service-item")

  if (searchInput && serviceItems.length > 0) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()

      serviceItems.forEach((item) => {
        const serviceText = item.textContent.toLowerCase()
        if (serviceText.includes(searchTerm)) {
          item.style.display = "flex"
        } else {
          item.style.display = "none"
        }
      })
    })
  }

    //Find contact us section
    const scrollButtons = document.querySelectorAll('[data-scroll-to]');

    scrollButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Get the target ID from the data attribute
        const targetId = button.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
  
        if (targetElement) {
          // Scroll to the target element
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // Don't prevent default for dropdown toggles
      if (
        this.parentElement.classList.contains("dropdown") &&
        this.nextElementSibling &&
        this.nextElementSibling.classList.contains("dropdown-content")
      ) {
        return
      }

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        e.preventDefault()
        targetElement.scrollIntoView({
          behavior: "smooth",
        })

        // Close mobile menu after navigation
        if (mainNav && mainNav.classList.contains("active")) {
          mainNav.classList.remove("active")
          body.style.overflow = ""
          const icon = mobileMenuBtn.querySelector("i")
          if (icon) {
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
          }
        }
      }
    })
  })

  // Add animation on scroll with IntersectionObserver for better performance
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
      // Remove all animation-related styles
      // element.style.opacity = "0";
      // element.style.transform = "translateY(20px)";
      // element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
      element.classList.add("animate-target");
      observer.observe(element);
    });
  }

  // Add the CSS for animation
  const style = document.createElement("style")
  style.textContent = `
    .animate-target.animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    /* Improved mobile menu styles */
    @media (max-width: 992px) {
      .main-nav {
        display: none;
      }

      .contact-link{
        display: block;
      }
      
      .main-nav.active {
        display: block;
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        z-index: 1000;
        padding: 20px;
        overflow-y: auto;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      }
      
      .main-nav.active ul {
        flex-direction: column;
        gap: 0;
      }
      
      .main-nav.active li {
        width: 100%;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .main-nav.active a {
        display: block;
        padding: 15px 0;
      }
      
      .dropdown-toggle {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }
      
      .dropdown > a {
        position: relative;
        padding-right: 50px !important;
      }
      
      .dropdown-content {
        display: none;
        position: static;
        box-shadow: none;
        padding-left: 20px;
        background-color: #f8f9fa;
        border-radius: 0;
      }
      
      .dropdown-content.show {
        display: block;
      }
      
      .dropdown-content a {
        padding: 12px 15px !important;
      }
    }
  `
  document.head.appendChild(style)

  // Apply animations to various elements
  animateElements(document.querySelectorAll(".service-item"))
  animateElements(document.querySelectorAll(".service-card"))
  animateElements(document.querySelectorAll(".specialty-item"))
  animateElements(document.querySelectorAll(".doctor-card"))
  animateElements(document.querySelectorAll(".news-card"))
  animateElements(document.querySelectorAll(".stat-item"))

  // About section animations with IntersectionObserver
  const aboutImage = document.querySelector(".about-image")
  const aboutText = document.querySelector(".about-text")

  if (aboutImage && aboutText) {
    // Set initial state
    aboutImage.style.opacity = "0"
    aboutImage.style.transform = "translateX(50px)"
    aboutImage.style.transition = "opacity 0.1s ease, transform 0.1s ease"

    aboutText.style.opacity = "0"
    aboutText.style.transform = "translateX(-50px)"
    aboutText.style.transition = "opacity 0.1s ease, transform 0.1s ease"

    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutImage.style.opacity = "1"
            aboutImage.style.transform = "translateX(0)"
            aboutText.style.opacity = "1"
            aboutText.style.transform = "translateX(0)"
            aboutObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )

    aboutObserver.observe(document.querySelector(".about-us"))
  }




  // Testimonial slider functionality
  const testimonialSlides = document.querySelectorAll(".testimonial-slide")
  const testimonialDots = document.querySelectorAll(".dot")
  const prevButton = document.querySelector(".testimonial-prev")
  const nextButton = document.querySelector(".testimonial-next")
  let currentSlide = 0
  let touchStartX = 0
  let touchEndX = 0

  function showSlide(index) {
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

  // Tab functionality for services
  const tabButtons = document.querySelectorAll(".tab-btn")
  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        tabButtons.forEach((btn) => {
          btn.classList.remove("active")
        })

        // Add active class to clicked button
        this.classList.add("active")

        // Get the tab to show
        const tabId = this.getAttribute("data-tab")

        // Hide all tab panes
        document.querySelectorAll(".tab-pane").forEach((pane) => {
          pane.classList.remove("active")
        })

        // Show the selected tab pane
        document.getElementById(tabId).classList.add("active")
      })
    })
  }

  // Doctor search functionality
  const doctorSearchInput = document.querySelector(".doctor-search input")
  const doctorCards = document.querySelectorAll(".doctor-card")
  const filterSelects = document.querySelectorAll(".filter-select")
  const searchBtn = document.querySelector(".search-btn")

  if (searchBtn && doctorCards.length > 0) {
    searchBtn.addEventListener("click", filterDoctors)

    // Also filter when pressing Enter in the search input
    if (doctorSearchInput) {
      doctorSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          filterDoctors()
        }
      })
    }
  }

  function filterDoctors() {
    const searchTerm = doctorSearchInput ? doctorSearchInput.value.toLowerCase() : ""
    const specialtyFilter = filterSelects[0] ? filterSelects[0].value.toLowerCase() : ""
    const availabilityFilter = filterSelects[1] ? filterSelects[1].value.toLowerCase() : ""

    doctorCards.forEach((card) => {
      const doctorName = card.querySelector("h3").textContent.toLowerCase()
      const doctorSpecialty = card.querySelector(".doctor-specialty").textContent.toLowerCase()
      const doctorAvailability = card.querySelector(".doctor-availability").textContent.toLowerCase()

      // Check if the doctor matches all active filters
      const matchesSearch = !searchTerm || doctorName.includes(searchTerm) || doctorSpecialty.includes(searchTerm)
      const matchesSpecialty = !specialtyFilter || doctorSpecialty.includes(specialtyFilter)
      const matchesAvailability =
        !availabilityFilter ||
        (availabilityFilter === "today" && doctorAvailability.includes("Today")) ||
        (availabilityFilter === "week" && !doctorAvailability.includes("Weekend")) ||
        (availabilityFilter === "weekend" && doctorAvailability.includes("Weekend"))

      // Show or hide based on filter results
      if (matchesSearch && matchesSpecialty && matchesAvailability) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  }

  // Form validation for appointment request
  const appointmentForm = document.querySelector(".appointment-form form")
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Basic validation
      const name = this.querySelector("#name").value
      const phone = this.querySelector("#phone").value
      const service = this.querySelector("#service").value
      const date = this.querySelector("#date").value

      if (!name || !phone || !service || !date) {
        alert("Please fill in all required fields")
        return
      }

      // If validation passes, you would normally submit the form
      // For demo purposes, just show a success message
      alert("Thank you! Your appointment request has been submitted. Our team will contact you within 24 hours.")
      this.reset()
    })
  }

  // Newsletter subscription
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = this.querySelector('input[type="email"]').value

      if (!email || !email.includes("@")) {
        alert("Please enter a valid email address")
        return
      }

      // If validation passes, you would normally submit the form
      // For demo purposes, just show a success message
      alert("Thank you for subscribing to our newsletter!")
      this.reset()
    })
  }

  // Resize handler for responsive adjustments
  function handleResize() {
    // Adjust mobile menu behavior based on screen width
    if (window.innerWidth >= 992) {
      if (mainNav) {
        mainNav.classList.remove("active")
        body.style.overflow = ""

        // Reset dropdown styles for desktop
        dropdowns.forEach((dropdown) => {
          const dropdownContent = dropdown.querySelector(".dropdown-content")
          if (dropdownContent) {
            dropdownContent.classList.remove("show")
            dropdownContent.style.display = ""
          }

          const toggle = dropdown.querySelector(".dropdown-toggle i")
          if (toggle) {
            toggle.className = "fas fa-chevron-down"
          }
        })
      }
    }
  }

  // Initial call and event listener for resize
  handleResize()
  window.addEventListener("resize", handleResize)
})

// Partners slider functionality
const partnerTrack = document.querySelector(".partner-track")
if (partnerTrack) {
  // Pause animation on hover
  partnerTrack.addEventListener("mouseenter", () => {
    partnerTrack.style.animationPlayState = "paused"
  })

  partnerTrack.addEventListener("mouseleave", () => {
    partnerTrack.style.animationPlayState = "running"
  })

  // Handle focus events for accessibility
  const partnerLogos = partnerTrack.querySelectorAll(".partner-logo")
  partnerLogos.forEach((logo) => {
    logo.addEventListener("focus", () => {
      partnerTrack.style.animationPlayState = "paused"
    })

    logo.addEventListener("blur", () => {
      partnerTrack.style.animationPlayState = "running"
    })
  })

  // Ensure smooth animation restart when the track is cloned
  let isAnimationReset = false
  partnerTrack.addEventListener("animationend", () => {
    if (!isAnimationReset) {
      partnerTrack.style.animation = "none"
      partnerTrack.offsetHeight // Trigger reflow
      partnerTrack.style.animation = null
      isAnimationReset = true
      setTimeout(() => {
        isAnimationReset = false
      }, 0)
    }
  })
}

