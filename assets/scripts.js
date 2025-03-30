

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

});

document.addEventListener('DOMContentLoaded', () => {
  console.log('scripts.js: DOM fully loaded');

  const buttons = document.querySelectorAll('.remove-item');
  console.log('Found remove buttons:', buttons.length);

  buttons.forEach(button => {
    console.log('Binding button:', button);
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const line = parseInt(button.dataset.line);
      console.log('CLICKED REMOVE — line:', line);

      if (isNaN(line)) {
        console.warn('No valid line number found!');
        return;
      }

      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            line: line,
            quantity: 0
          })
        });

        const cart = await res.json();
        console.log('Updated cart:', cart);
        location.reload();
      } catch (err) {
        console.error('Error during fetch:', err);
      }
    });
  });
});
