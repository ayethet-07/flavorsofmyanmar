document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = this.querySelector('.newsletter-input').value;
      const button = this.querySelector('.btn-primary');
      const originalText = button.textContent;
      
      try {
        button.disabled = true;
        button.textContent = 'Suscribiendo...';
        
        const response = await api.subscribeToNewsletter(email);
        
        alert('¡Gracias por suscribirte! Revisa tu email para descargar el e-book.');
        this.reset();
        
      } catch (error) {
        if (error.message.includes('already subscribed')) {
          alert('Este email ya está suscrito a nuestro boletín.');
        } else {
          alert('Error al suscribirse. Por favor, intenta de nuevo.');
          console.error('Subscription error:', error);
        }
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }
});