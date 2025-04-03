console.log("scripts.js is running");

document.addEventListener('DOMContentLoaded', function () {
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach((card) => {
    const sizeButtons = card.querySelectorAll('.size-button');
    const variantInput = card.querySelector('.variant-id');

    // Find the first available (not sold-out) size
    const firstAvailable = Array.from(sizeButtons).find(
      (btn) => !btn.classList.contains("sold-out")
    );

    // Select the first available size button by default
    if (firstAvailable) {
      firstAvailable.classList.add("selected");
      if (variantInput) {
        variantInput.value = firstAvailable.dataset.variantId;
      }
    }

    sizeButtons.forEach(button => {
      if (!button.classList.contains("sold-out")) {
        button.addEventListener('click', function (e) {
          e.preventDefault();

          // Remove selected class from all siblings
          const group = button.closest('.sizes');
          group.querySelectorAll('.size-button').forEach(b => b.classList.remove('selected'));

          // Add selected to the clicked one
          button.classList.add('selected');

          // Update hidden input in the form
          const variantInput = button.closest('.product-info-right').querySelector('.variant-id');
          if (variantInput) {
            variantInput.value = button.dataset.variantId;
          }
        });
      }
    });
  });

  // landing + rotation
  const hoverPairs = [
    {
      nav: ".nav-top-left",
      plus: ".plus-top-left",
      transform: "translate(8vw, 9.3vh) rotate(90deg)"
    },
    {
      nav: ".nav-top-right",
      plus: ".plus-top-right",
      transform: "translate(-8vw, 9.3vh) rotate(-90deg)"
    },
    {
      nav: ".nav-bottom-left",
      plus: ".plus-bottom-left",
      transform: "translate(8vw, -9.3vh) rotate(90deg)"
    },
    {
      nav: ".nav-bottom-right",
      plus: ".plus-bottom-right",
      transform: "translate(-8vw, -9.3vh) rotate(-90deg)"
    }
  ];

  hoverPairs.forEach(({ nav, plus, transform }) => {
    const navEl = document.querySelector(nav);
    const plusEl = document.querySelector(plus);

    if (navEl && plusEl) {
      navEl.addEventListener("mouseenter", () => {
        plusEl.style.transform = transform;
      });

      navEl.addEventListener("mouseleave", () => {
        plusEl.style.transform = "translate(0, 0) rotate(0deg)";
      });
    }
  });


  //second image hover
  const switchImages = document.querySelectorAll("img.hover-switch");

  switchImages.forEach((img) => {
    const altSrc = img.getAttribute("data-alt-src");
    if (!altSrc) return;

    const originalSrc = img.src;

    img.addEventListener("mouseenter", () => {
      img.src = altSrc;
    });

    img.addEventListener("mouseleave", () => {
      img.src = originalSrc;
    });
  });

  
  //image carousel
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const images = carousel.querySelectorAll(".carousel-image");
    const prev = carousel.querySelector(".carousel-btn.prev");
    const next = carousel.querySelector(".carousel-btn.next");

    let currentIndex = 0;

    const fadeToImage = (nextIndex) => {
      if (nextIndex === currentIndex) return;

      const currentImage = images[currentIndex];
      const nextImage = images[nextIndex];

      nextImage.classList.add("active");

      // After transition, remove .active from previous image
      setTimeout(() => {
        currentImage.classList.remove("active");
        currentIndex = nextIndex;
      }, 500); // Matches CSS transition duration
    };

    prev.addEventListener("click", () => {
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      fadeToImage(newIndex);
    });

    next.addEventListener("click", () => {
      const newIndex = (currentIndex + 1) % images.length;
      fadeToImage(newIndex);
    });
  });

  // Select all remove buttons
  const removeButtons = document.querySelectorAll('.cart-remove');

  removeButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault(); // Stop any default link or button behavior

      // Get the unique line item key from the data attribute
      const lineKey = btn.getAttribute('data-line-key');
      if (!lineKey) return; // Safety check

      // Send POST request to remove only this item
      fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          id: lineKey,
          quantity: 0
        })
      })
      .then((response) => response.json())
      .then((cartData) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error removing item:', error);
      });
    });
  });
});
