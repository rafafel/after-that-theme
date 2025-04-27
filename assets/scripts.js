console.log("scripts.js is running");

document.addEventListener('DOMContentLoaded', function () {
  // Store source page before navigating to a filter
  document.querySelectorAll('.category-filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = link.dataset.filter;
      const basePath = window.location.pathname;
      const newUrl = `${basePath}?filter=${filter}`;
      window.location.href = newUrl; // <-- forces real navigation
    });
  });

  const backLink = document.querySelector('.subnav-left a');
  if (backLink && sessionStorage.getItem('cameFromShopAll')) {
    backLink.setAttribute('href', '/collections/shop-all');
    sessionStorage.removeItem('cameFromShopAll');
  }

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

  // PRODUCT PAGE size selection handling
  const productPageForm = document.querySelector('.product-page form');
  if (productPageForm) {
    const sizeButtons = productPageForm.querySelectorAll('.size-button');
    const hiddenInput = productPageForm.querySelector('.variant-id');
  
    sizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault(); // prevent form submission
        // remove 'selected' from all buttons
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        // add 'selected' to clicked button
        button.classList.add('selected');
        // update hidden input value
        hiddenInput.value = button.dataset.variantId;
      });
    });
  
    // Pre-select the default selected one if exists
    const preselected = productPageForm.querySelector('.size-button.selected');
    if (preselected) {
      hiddenInput.value = preselected.dataset.variantId;
    }
  }

// If there's only one global add-to-cart form (i.e. on the product page), run the same logic:
const singleForm = document.querySelector('.product-page .add-to-cart-form');
if (singleForm) {
  const addBtn = singleForm.querySelector('.add-to-cart-link');
  const addConfirm = singleForm.querySelector('.add-confirm');
  const variantIdInput = singleForm.querySelector('.variant-id');

  singleForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const variantId = variantIdInput.value;
    if (!variantId) return;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    }).then(res => {
      if (res.ok) {
        addConfirm?.classList.add('visible');
        setTimeout(() => {
          addBtn.textContent = 'ADD TO CART';
          addConfirm?.classList.remove('visible');
        }, 2000);
      }
    }).catch(err => console.error(err));
  });
}


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


  //CATEGORIES SUBNAVBAR
  const toggleBtn2 = document.querySelector('.category-toggle');
  const filterBar2 = document.querySelector('.category-filter-bar');

  if (toggleBtn2 && filterBar2) {
    toggleBtn2.addEventListener('click', () => {
      filterBar2.style.display = filterBar2.style.display === 'none' ? 'flex' : 'none';
    });
  }

  const params2 = new URLSearchParams(window.location.search);
  const filter2 = params2.get('filter');
  const allCards2 = Array.from(document.querySelectorAll('.product-card'));
  const filler2 = document.getElementById('filler');
  const emptyMsg2 = document.getElementById('filtered-empty');

  if (filter2 && filter2 !== 'all') {
    let visibleCount2 = 0;
    allCards2.forEach(card => {
      const tags = card.dataset.tags || '';
      if (tags.includes(filter2.toLowerCase())) {
        card.style.display = 'flex';
        visibleCount2++;
      } else {
        card.style.display = 'none';
      }
    });

    // only show filler when the last row isn’t full
    if (visibleCount2 === 0) {
      if (emptyMsg2) emptyMsg2.style.display = 'flex';
      if (filler2)    filler2.style.display = 'none';
    } else {
      if (emptyMsg2) emptyMsg2.style.display = 'none';
      if (filler2) {
        if (visibleCount2 % 3 !== 0) {
          filler2.style.display = 'flex';
        } else {
          filler2.style.display = 'none';
        }
      }
    }
  } else {
    // no filter → show everything
    allCards2.forEach(card => card.style.display = 'flex');
    if (emptyMsg2) emptyMsg2.style.display = 'none';
    if (filler2) {
      // only show filler when total count % 3 !== 0
      if (allCards2.length % 3 !== 0) {
        filler2.style.display = 'flex';
      } else {
        filler2.style.display = 'none';
      }
    }
  }


  // Force filter bar open & underline the active link
  const categoryFilterBar2 = document.querySelector('.category-filter-bar');
  if (filter2 && filter2 !== 'all' && categoryFilterBar2) {
    categoryFilterBar2.style.display = 'flex';
    const activeLink2 = categoryFilterBar2.querySelector(`a[data-filter="${filter2}"]`);
    if (activeLink2) {
    activeLink2.classList.remove('underline-hover', 'underline-always');
    activeLink2.classList.add('selected');
    }
  }


  // no filtered items
  const grid = document.querySelector('.product-grid');
  const emptyPanel = document.getElementById('filtered-empty');
  const cards = Array.from(document.querySelectorAll('.product-card'));
  document.querySelectorAll('.category-filter-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const filter = link.dataset.filter;
      // count how many match
      let matched = 0;
      cards.forEach(card => {
        const tags = (card.dataset.tags||'').split(',');
        if (tags.includes(filter)) {
          card.style.display = 'flex';
          matched++;
        } else {
          card.style.display = 'none';
        }
      });
      // if none, hide grid & show our panel
      if (matched === 0) {
        grid.style.display = 'none';
        emptyPanel.style.display = 'flex';
      } else {
        grid.style.display = 'flex';
        emptyPanel.style.display = 'none';
      }
    });
  });

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

  //INTRO LANDING
  const introScreen = document.getElementById('intro-screen');

  // Exit immediately if intro screen doesn't exist on this page
  if (!introScreen) return;

  // Only run the intro animation if not already shown this session
  if (sessionStorage.getItem('introShown')) {
    // Skip intro: just remove the screen immediately
    introScreen.remove();
    // Show elements immediately
    const navbar = document.querySelector('.landing .navbar');
const navWrapper = document.querySelector('.landing .nav-wrapper');
const plusWrapper = document.querySelector('.landing .plus-wrapper');

// Immediately show, no transition
navbar.style.transition = 'none';
navWrapper.style.transition = 'none';
plusWrapper.style.transition = 'none';

navbar.style.opacity = '1';
navWrapper.style.opacity = '1';
plusWrapper.style.opacity = '1';
    document.querySelector('.landing .nav-wrapper').style.opacity = '1';
    document.querySelector('.landing .plus-wrapper').style.opacity = '1';
    return;
  }

  // Mark intro as shown for this session
  sessionStorage.setItem('introShown', 'true');

  const video = document.querySelector('.landing-video-bg');
  const blurOverlay = document.getElementById('blur-overlay');
  const logoOverlay = document.getElementById('logo-overlay');
  const navbar2 = document.querySelector('.landing .navbar');
  const navWrapper2 = document.querySelector('.landing .nav-wrapper');
  const plusWrapper2 = document.querySelector('.landing .plus-wrapper');

  const startAnimation = () => {
    introScreen.style.opacity = '1';

    setTimeout(() => {
      blurOverlay.style.backdropFilter = 'blur(0px)';
      logoOverlay.style.filter = 'blur(30px)';
      logoOverlay.style.opacity = '0';

      navbar2.style.opacity = '1';
      navWrapper2.style.opacity = '1';
      plusWrapper2.style.opacity = '1';
    }, 1000);

    setTimeout(() => {
      introScreen.remove();
    }, 3600);
  };

  // wait for video to be ready before triggering animation
  if (video.readyState >= 2) {
    startAnimation();
  } else {
    video.addEventListener('loadeddata', startAnimation, { once: true });
  }

  //MOBILE
    
    


});
