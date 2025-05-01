console.log("scripts.js is running");

document.addEventListener('DOMContentLoaded', function () {

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
  // CATEGORIES FILTER (toggleable)
const toggleBtn = document.querySelector('.category-toggle');
const filterBar = document.querySelector('.category-filter-bar');
const filterLinks = document.querySelectorAll('.category-filter-link');
const products = Array.from(document.querySelectorAll('.product-card'));
const productGrid = document.querySelector('.product-grid');
const emptyState = document.getElementById('filtered-empty');
const filler = document.getElementById('filler');

// Show/hide filter bar
if (toggleBtn && filterBar) {
  toggleBtn.addEventListener('click', () => {
    filterBar.style.display = filterBar.style.display === 'flex' ? 'none' : 'flex';
  });
}

filterLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const filter = link.dataset.filter;
    const wasActive = link.classList.contains('selected');

    // Clear all selections
    filterLinks.forEach(l => l.classList.remove('selected'));

    // If it wasn’t active, activate this one
    const activeFilter = !wasActive ? filter : null;
    if (activeFilter) link.classList.add('selected');

    // Filter products
    let anyVisible = false;
    products.forEach(card => {
      const tags = (card.dataset.tags || '').split(',');
      const keep = !activeFilter || tags.includes(activeFilter);
      card.style.display = keep ? '' : 'none';
      if (keep) anyVisible = true;
    });

    // Show empty state if nothing matches
    if (activeFilter && !anyVisible) {
      productGrid.style.display = 'none';
      emptyState.style.display = 'flex';
      filler.style.display = 'none';
    } else {
      productGrid.style.display = 'flex';
      emptyState.style.display = 'none';
      // Show filler only when there are visible products
      filler.style.display = anyVisible ? 'flex' : 'none';
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


  // ─── AJAX qty‐change with sync’d buttons + nav count ───────────────────────────
;(function(){
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('button.qty-btn');
    if (!btn) return;           // only our +/– buttons
    e.preventDefault();

    const form = btn.closest('form.cart-qty-form');
    const id   = form.querySelector('input[name="id"]').value;
    const wantedQty = parseInt(btn.value, 10);

    fetch('/cart/change.js', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/x-www-form-urlencoded',
        'Accept':            'application/json'
      },
      body: new URLSearchParams({ id, quantity: wantedQty }).toString()
    })
    .then(r => r.json())
    .then(cart => {
      // find updated line
      const item = cart.items.find(i => i.key === id);
      const row  = document.querySelector(`.cart-item[data-key="${id}"]`);

      if (row) {
        if (item) {
          const newQty = item.quantity;
          // 1) qty bubble
          row.querySelector('.cart-qty').textContent = newQty;
          // 2) line‐price
          row.querySelector('.cart-item-price').textContent =
            new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'})
            .format(item.line_price/100);
          // 3) re-sync button values
          const [dec, inc] = row.querySelectorAll('button.qty-btn');
          dec.value = newQty - 1;
          inc.value = newQty + 1;
        } else {
          // removed entirely
          row.remove();
        }
      }

      // update cart total
      const totalEl = document.querySelector('.cart-total');
      if (totalEl) {
        totalEl.textContent =
          'Total: ' + new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'})
          .format(cart.total_price/100);
      }

      // update navbar count badge
      const navCount = document.getElementById('cart-count');
      if (navCount) navCount.textContent = `(${cart.item_count})`;
    })
    .catch(err => console.error('Cart AJAX failed:', err));
  });
})();


  

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
  const logoOverlay = document.getElementById('logo-overlay');
  const navbar2 = document.querySelector('.landing .navbar');
  const navWrapper2 = document.querySelector('.landing .nav-wrapper');
  const plusWrapper2 = document.querySelector('.landing .plus-wrapper');

  const startAnimation = () => {
    introScreen.style.opacity = '1';

    setTimeout(() => {
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
