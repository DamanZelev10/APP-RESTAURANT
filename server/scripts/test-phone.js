import { normalizePhone } from '../utils/phone.js';

const phones = [
  '3001234567',
  '+573001234567',
  '57 300 123 4567',
  '0 300 123 4567'
];

phones.forEach(p => {
  console.log(`${p} -> ${normalizePhone(p)}`);
});
