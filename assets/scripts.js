

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

