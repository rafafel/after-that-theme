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

  

  // NAVBAR OFFSET
    function updateOffsetVar() {
      const navbar = document.querySelector('.navbar');
      const subnavbar = document.querySelector('.sub-navbar');
      const totalHeight = 
        (navbar?.offsetHeight || 0) + (subnavbar?.offsetHeight || 0);

      document.documentElement.style.setProperty('--navbar-offset', `${totalHeight}px`);
    }

    updateOffsetVar();
    window.addEventListener('resize', updateOffsetVar);



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

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Find all plus elements and forcibly reset their transforms
    const pluses = document.querySelectorAll(".plus");
    pluses.forEach(plus => {
      plus.style.transform = "none";
      plus.style.transition = "none";
    });

    // Optional: add a class to override hover logic if needed
    document.body.classList.add("no-plus-hover");
  }


  //second image hover

  document.querySelectorAll('.product-image').forEach(wrapper => {
    const secondary = wrapper.querySelector('img.secondary');
    if (!secondary) return;
  
    wrapper.addEventListener('mouseenter', () => {
      secondary.classList.add('visible');
    });
  
    wrapper.addEventListener('mouseleave', () => {
      secondary.classList.remove('visible');
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


  //ADD TO CART CONFIRM CHECK
  document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const variantId = formData.get('id');

      if (!variantId) return;

      fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (!response.ok) throw new Error('Add to cart failed.');
          return response.json();
        })
        .then(data => {
          const checkmark = form.querySelector('.add-confirm');
          checkmark.classList.add('visible');
          setTimeout(() => {
            checkmark.classList.remove('visible');
          }, 3000);

        fetch('/cart.js')
        .then(res => res.json())
        .then(cart => {
          const cartCount = document.getElementById('cart-count');
          if (cart.item_count > 0) {
            cartCount.textContent = `(${cart.item_count})`;
          } else {
            cartCount.textContent = '';
          }
        });
        })
        
        .catch(err => {
          alert('Could not add to cart. Try again.');
          console.error(err);
        });
    });
  });


  //MOBILE
  
  
  



});
