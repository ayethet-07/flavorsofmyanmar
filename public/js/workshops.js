document.addEventListener('DOMContentLoaded', function() {
  const bookingButtons = document.querySelectorAll('[data-workshop-id]');
  
  bookingButtons.forEach(button => {
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const workshopId = this.getAttribute('data-workshop-id');
      const originalText = this.textContent;
      
      try {
        const user = localStorage.getItem('token');
        if (!user) {
          alert('Por favor inicia sesión para reservar un taller.');
          window.location.href = '/login.html';
          return;
        }
        
        this.disabled = true;
        this.textContent = 'Reservando...';
        
        const response = await api.bookWorkshop(workshopId);
        
        alert('¡Taller reservado exitosamente! Pronto recibirás los detalles por email.');
        this.textContent = 'Reservado';
        this.disabled = true;
        
      } catch (error) {
        if (error.message.includes('full')) {
          alert('Lo sentimos, este taller está lleno.');
        } else if (error.message.includes('already booked')) {
          alert('Ya tienes una reserva para este taller.');
        } else {
          alert('Error al reservar el taller. Por favor, intenta de nuevo.');
          console.error('Booking error:', error);
        }
        
        this.disabled = false;
        this.textContent = originalText;
      }
    });
  });
});