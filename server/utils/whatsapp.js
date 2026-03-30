/**
 * WhatsApp deep-link message generator
 * Generates pre-filled WhatsApp URLs for reminders and confirmations
 */

const TEMPLATES = {
  confirmation_request: (data) =>
    `Hola ${data.name}, somos ROSÉ Cafe Bar 🌹\n\nPor favor confirma tu reserva para el ${data.date} a las ${data.time} para ${data.partySize} persona(s).\n\nResponde SÍ o NO. ¡Gracias!`,

  reminder: (data) =>
    `Hola ${data.name} 🌹\n\nTe recordamos tu reserva de hoy a las ${data.time} para ${data.partySize} persona(s) en ROSÉ Cafe Bar.\n\n¡Te esperamos! 🥂`,

  cancellation: (data) =>
    `Tu reserva para el ${data.date} a las ${data.time} ha sido cancelada.\n\nGracias por avisarnos. ¡Te esperamos pronto en ROSÉ Cafe Bar! 🌹`,
};

export function generateWhatsAppMessage(type, reservation) {
  const template = TEMPLATES[type];
  if (!template) return null;

  return template({
    name: reservation.fullName.split(' ')[0],
    date: reservation.reservationDate,
    time: reservation.reservationTime,
    partySize: reservation.partySize,
  });
}

export function generateWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function getWhatsAppAction(type, reservation) {
  const message = generateWhatsAppMessage(type, reservation);
  if (!message) return null;
  return {
    message,
    link: generateWhatsAppLink(reservation.phone, message),
  };
}
