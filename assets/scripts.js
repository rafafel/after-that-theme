

console.log("scripts.js is running");


document.addEventListener('DOMContentLoaded', function () {
  const sizeButtons = document.querySelectorAll('.size-button');

  sizeButtons.forEach(button => {
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
        // Shopify usually expects these
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        id: lineKey,   // NOTE: 'id' is the line item key
        quantity: 0
      })
    })
    .then((response) => response.json())
    .then((cartData) => {
      // On success, you can refresh the page, or re-render the cart in JS.
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error removing item:', error);
    });
  });
});

});

