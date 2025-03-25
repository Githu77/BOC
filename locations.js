document.addEventListener("DOMContentLoaded", () => {
  // Location search functionality
  const locationSearch = document.getElementById("locationSearch")
  const locationCards = document.querySelectorAll(".location-card")
  const searchBtn = document.querySelector(".search-btn")

  function searchLocations() {
    const searchTerm = locationSearch ? locationSearch.value.toLowerCase() : ""
    let hasResults = false

    locationCards.forEach((card) => {
      const locationText = card.textContent.toLowerCase()
      if (locationText.includes(searchTerm)) {
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

  if (searchBtn && locationSearch) {
    searchBtn.addEventListener("click", searchLocations)
    locationSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchLocations()
      }
    })
  }

 // Map controls
const resetMap = document.getElementById("resetMap");
const mapIframe = document.querySelector(".map-wrapper iframe");

if (resetMap && mapIframe) {
  // Store original map src for reset
  const originalSrc = mapIframe.src;

  resetMap.addEventListener("click", () => {
    mapIframe.src = originalSrc;
  });
}
  // Share location functionality
 // Target all buttons with the class "share-location-btn"
const shareLocationButtons = document.querySelectorAll(".share-location-btn");

shareLocationButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    // Get location data from data attributes or fallback to defaults
    const lat = button.getAttribute("data-lat") || "-1.3024891998467594";
    const lng = button.getAttribute("data-lng") || "36.81893243921625";
    const locationTitle = button.getAttribute("data-title") || document.querySelector("h1")?.textContent || "Location";
    const locationUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    // Check if Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: locationTitle,
          text: `Check out this location: ${locationTitle}`,
          url: locationUrl,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      const tempInput = document.createElement("input");
      document.body.appendChild(tempInput);
      tempInput.value = locationUrl;
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      alert("Location URL copied to clipboard!");
    }
  });
});

  // Form validation for contact forms
  const locationContactForms = document.querySelectorAll(".location-contact-form")

  locationContactForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()

      let isValid = true
      const requiredFields = this.querySelectorAll("[required]")

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.classList.add("error")
        } else {
          field.classList.remove("error")
        }
      })

      if (isValid) {
        alert("Thank you for your message! We will get back to you soon.")
        this.reset()
      } else {
        alert("Please fill in all required fields.")
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
  animateElements(document.querySelectorAll(".location-card"))
  animateElements(document.querySelectorAll(".contact-info-card"))
  animateElements(document.querySelectorAll(".service-item"))
  animateElements(document.querySelectorAll(".feature-item"))
  animateElements(document.querySelectorAll(".gallery-item"))
  animateElements(document.querySelectorAll(".staff-card"))

  // Get directions functionality
  const directionButtons = document.querySelectorAll(".get-directions-btn")

  directionButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()

      // Get location address from data attribute or nearby element
      const locationCard = this.closest(".location-card") || this.closest(".location-detail")
      const address = locationCard ? locationCard.getAttribute("data-address") : ""

      if (!address) {
        console.error("No address found for this location")
        return
      }

      // Check if geolocation is available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude
            const userLng = position.coords.longitude

            // Open Google Maps with directions
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${encodeURIComponent(address)}&travelmode=driving`
            window.open(mapsUrl, "_blank")
          },
          (error) => {
            console.error("Error getting user location:", error)
            // Fallback - just open Google Maps with the destination
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
            window.open(mapsUrl, "_blank")
          },
        )
      } else {
        // Fallback for browsers without geolocation
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        window.open(mapsUrl, "_blank")
      }
    })
  })

  // Filter locations by service
  const serviceFilters = document.querySelectorAll(".service-filter")

  if (serviceFilters.length) {
    serviceFilters.forEach((filter) => {
      filter.addEventListener("click", function () {
        const service = this.getAttribute("data-service")

        // Toggle active class
        serviceFilters.forEach((f) => f.classList.remove("active"))
        this.classList.add("active")

        // Filter location cards
        locationCards.forEach((card) => {
          const services = card.getAttribute("data-services") || ""

          if (service === "all" || services.includes(service)) {
            card.style.display = "flex"
          } else {
            card.style.display = "none"
          }
        })

        // Update counter
        const visibleLocations = document.querySelectorAll(".location-card[style*='display: flex']").length
        const counter = document.querySelector(".locations-counter")
        if (counter) {
          counter.textContent = `Showing ${visibleLocations} location${visibleLocations !== 1 ? "s" : ""}`
        }
      })
    })
  }

  // Calculate and display distance from user's location
  function calculateDistances() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude

          const distanceElements = document.querySelectorAll("[data-lat][data-lng]")

          distanceElements.forEach((element) => {
            const locationLat = Number.parseFloat(element.getAttribute("data-lat"))
            const locationLng = Number.parseFloat(element.getAttribute("data-lng"))

            if (isNaN(locationLat) || isNaN(locationLng)) return

            const distance = calculateHaversineDistance(userLat, userLng, locationLat, locationLng)

            // Find or create distance display element
            let distanceDisplay = element.querySelector(".distance-display")
            if (!distanceDisplay) {
              distanceDisplay = document.createElement("div")
              distanceDisplay.className = "distance-display"
              element.appendChild(distanceDisplay)
            }

            // Display distance
            distanceDisplay.textContent = `${distance.toFixed(1)} km from you`
            distanceDisplay.style.display = "block"
          })
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    }
  }

  // Haversine formula to calculate distance between two points
  function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km

    return distance
  }

  // Calculate distances if there are elements with coordinates
  if (document.querySelectorAll("[data-lat][data-lng]").length) {
    calculateDistances()

    // Add refresh button functionality
    const refreshDistanceBtn = document.getElementById("refreshDistance")
    if (refreshDistanceBtn) {
      refreshDistanceBtn.addEventListener("click", calculateDistances)
    }
  }

  // Appointment booking integration
  const appointmentButtons = document.querySelectorAll(".book-appointment-btn")

  appointmentButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()

      const locationId = this.getAttribute("data-location-id")
      const locationName = this.getAttribute("data-location-name") || "this location"

      // Show appointment modal
      const modal = document.getElementById("appointmentModal")
      const locationDisplay = document.getElementById("appointmentLocationName")
      const locationInput = document.getElementById("appointmentLocationId")

      if (modal && locationDisplay && locationInput) {
        modal.style.display = "flex"
        locationDisplay.textContent = locationName
        locationInput.value = locationId

        // Prevent body scrolling
        document.body.style.overflow = "hidden"
      }
    })
  })

  // Close appointment modal
  const closeModalButtons = document.querySelectorAll(".close-modal")

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      if (modal) {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  })

  // Appointment form validation and submission
  const appointmentForm = document.getElementById("appointmentForm")

  if (appointmentForm) {
    appointmentForm.addEventListener("submit", function (e) {
      e.preventDefault()

      let isValid = true
      const requiredFields = this.querySelectorAll("[required]")

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.classList.add("error")
        } else {
          field.classList.remove("error")
        }
      })

      // Validate email format
      const emailField = this.querySelector('input[type="email"]')
      if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(emailField.value)) {
          isValid = false
          emailField.classList.add("error")
        }
      }

      // Validate phone format
      const phoneField = this.querySelector('input[type="tel"]')
      if (phoneField && phoneField.value) {
        const phonePattern = /^[\d\s+\-$$$$]{7,20}$/
        if (!phonePattern.test(phoneField.value)) {
          isValid = false
          phoneField.classList.add("error")
        }
      }

      if (isValid) {
        // Show success message
        const modal = this.closest(".modal")
        const successMessage = document.getElementById("appointmentSuccess")

        if (modal && successMessage) {
          modal.style.display = "none"
          successMessage.style.display = "flex"

          // Hide success message after 3 seconds
          setTimeout(() => {
            successMessage.style.display = "none"
            document.body.style.overflow = "auto"
          }, 3000)
        }

        this.reset()
      } else {
        // Show error message
        const errorMessage = document.querySelector(".form-error-message")
        if (errorMessage) {
          errorMessage.style.display = "block"

          // Hide error message after 3 seconds
          setTimeout(() => {
            errorMessage.style.display = "none"
          }, 3000)
        }
      }
    })
  }

  // Accessibility enhancements

  // Make all interactive elements properly focusable
  const interactiveElements = document.querySelectorAll(".location-card, .service-filter, button, a")

  interactiveElements.forEach((element) => {
    if (
      !element.getAttribute("tabindex") &&
      element.tagName.toLowerCase() !== "a" &&
      element.tagName.toLowerCase() !== "button"
    ) {
      element.setAttribute("tabindex", "0")
    }

    // Add keyboard interaction for non-button/link elements
    if (element.tagName.toLowerCase() !== "a" && element.tagName.toLowerCase() !== "button") {
      element.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          this.click()
        }
      })
    }
  })

  // Add skip to content link functionality
  const skipLink = document.getElementById("skipToContent")

  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault()

      const mainContent = document.getElementById("mainContent")
      if (mainContent) {
        mainContent.setAttribute("tabindex", "-1")
        mainContent.focus()
      }
    })
  }

  // Initialize location-specific events
  function initLocationSpecificEvents() {
    // Check if we're on a specific location page
    const locationDetail = document.querySelector(".location-detail")

    if (locationDetail) {
      const locationId = locationDetail.getAttribute("data-location-id")

      if (locationId) {
        // Load location-specific events if available
        fetchLocationEvents(locationId)

        // Initialize virtual tour if available
        const virtualTourBtn = document.getElementById("virtualTourBtn")

        if (virtualTourBtn) {
          virtualTourBtn.addEventListener("click", function (e) {
            e.preventDefault()

            const tourUrl = this.getAttribute("data-tour-url")

            if (tourUrl) {
              // Show virtual tour modal
              const tourModal = document.getElementById("virtualTourModal")
              const tourFrame = document.getElementById("virtualTourFrame")

              if (tourModal && tourFrame) {
                tourFrame.src = tourUrl
                tourModal.style.display = "flex"
                document.body.style.overflow = "hidden"
              }
            }
          })
        }
      }
    }
  }

  // Fetch location events from API or static data
  function fetchLocationEvents(locationId) {
    // This would typically be an API call
    // For demo purposes, we'll use static data
    const eventsContainer = document.querySelector(".location-events")

    if (!eventsContainer) return

    // Demo events data
    const demoEvents = {
      "main-hospital": [
        { title: "Free Health Screening", date: "2025-04-15", time: "9:00 AM - 12:00 PM" },
        { title: "Blood Donation Drive", date: "2025-04-20", time: "10:00 AM - 4:00 PM" },
        { title: "Diabetes Management Workshop", date: "2025-04-25", time: "2:00 PM - 4:00 PM" },
      ],
      "ol-jororok": [
        { title: "Community Health Talk", date: "2025-04-18", time: "11:00 AM - 1:00 PM" },
        { title: "Maternal Health Clinic", date: "2025-04-22", time: "9:00 AM - 3:00 PM" },
      ],
    }

    const events = demoEvents[locationId] || []

    if (events.length) {
      // Clear existing content
      eventsContainer.innerHTML = ""

      // Create events list
      const eventsList = document.createElement("ul")
      eventsList.className = "events-list"

      events.forEach((event) => {
        const eventItem = document.createElement("li")
        eventItem.className = "event-item"

        const eventDate = new Date(event.date)
        const formattedDate = eventDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })

        eventItem.innerHTML = `
                    <div class="event-date">${formattedDate}</div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <p>${event.time}</p>
                    </div>
                    <button class="btn btn-sm btn-outline">Add to Calendar</button>
                `

        eventsList.appendChild(eventItem)
      })

      eventsContainer.appendChild(eventsList)

      // Add calendar functionality
      const calendarButtons = eventsContainer.querySelectorAll(".btn-outline")

      calendarButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
          const event = events[index]

          // Create Google Calendar link
          const startDate = new Date(event.date + "T" + event.time.split(" - ")[0])
          const endDate = new Date(event.date + "T" + event.time.split(" - ")[1])

          // Format dates for Google Calendar
          const formatDate = (date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, "")
          }

          const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&location=${encodeURIComponent("Brooks of Cherith Hospitals")}&details=${encodeURIComponent("Event at Brooks of Cherith Hospitals")}`

          window.open(calendarUrl, "_blank")
        })
      })
    } else {
      eventsContainer.innerHTML = "<p>No upcoming events at this location.</p>"
    }
  }

  // Initialize location-specific events
  initLocationSpecificEvents()

  // Weather information for locations
  function fetchWeatherForLocation() {
    const weatherContainer = document.querySelector(".location-weather")

    if (!weatherContainer) return

    const lat = weatherContainer.getAttribute("data-lat")
    const lng = weatherContainer.getAttribute("data-lng")

    if (!lat || !lng) return

    // This would typically be an API call to a weather service
    // For demo purposes, we'll use static data
    const weatherData = {
      temperature: "24°C",
      condition: "Partly Cloudy",
      humidity: "65%",
      wind: "10 km/h",
    }

    // Display weather information
    weatherContainer.innerHTML = `
            <div class="weather-card">
                <h4>Current Weather</h4>
                <div class="weather-info">
                    <div class="weather-temp">${weatherData.temperature}</div>
                    <div class="weather-condition">${weatherData.condition}</div>
                    <div class="weather-details">
                        <span>Humidity: ${weatherData.humidity}</span>
                        <span>Wind: ${weatherData.wind}</span>
                    </div>
                </div>
            </div>
        `
  }

  // Fetch weather for location
  fetchWeatherForLocation()
})

