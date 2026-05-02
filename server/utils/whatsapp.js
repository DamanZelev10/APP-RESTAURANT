import { format12h } from './date.js';

const TEMPLATES = {
  confirmation_request: (data) =>
    `Hola ${data.name}, somos ROSÉ Cafe Bar 🌹\n\nPor favor confirma tu reserva para el ${data.date} a las ${format12h(data.time)} para ${data.partySize} persona(s).\n\n${data.portalUrl ? `Accede a tu reserva para confirmar o cancelar: ${data.portalUrl}\n\n` : ''}¡Gracias!`,

  reminder: (data) =>
    `Hola ${data.name} 🌹\n\nTe recordamos tu reserva de hoy a las ${format12h(data.time)} para ${data.partySize} persona(s) en ROSÉ Cafe Bar.\n\n${data.portalUrl ? `Ver detalles de tu reserva: ${data.portalUrl}\n\n` : ''}¡Te esperamos! 🥂`,

  cancellation: (data) =>
    `Tu reserva para el ${data.date} a las ${format12h(data.time)} ha sido cancelada.\n\nGracias por avisarnos. ¡Te esperamos pronto en ROSÉ Cafe Bar! 🌹`,
};

export function generateWhatsAppMessage(type, reservation, portalToken = null) {
  const template = TEMPLATES[type];
  if (!template) return null;

  const domain = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const portalUrl = portalToken ? `${domain}/mi-reserva/${portalToken}` : null;

  return template({
    name: reservation.fullName.split(' ')[0],
    date: reservation.reservationDate,
    time: reservation.reservationTime,
    partySize: reservation.partySize,
    portalUrl
  });
}

export function generateWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function getWhatsAppAction(type, reservation, portalToken = null) {
  const message = generateWhatsAppMessage(type, reservation, portalToken);
  if (!message) return null;
  return {
    message,
    link: generateWhatsAppLink(reservation.phone, message),
  };
}
