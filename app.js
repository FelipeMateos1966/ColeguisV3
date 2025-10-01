console.log('App Coleguis iniciada.');

// Solicitar permiso para el micrófono al iniciar la app
window.addEventListener('load', () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      console.log('Acceso al micrófono concedido.');
      // Detener el stream inmediatamente ya que solo queremos el permiso
      stream.getTracks().forEach(track => track.stop());
    })
    .catch(err => {
      console.error('Error al solicitar acceso al micrófono:', err);
    });
});