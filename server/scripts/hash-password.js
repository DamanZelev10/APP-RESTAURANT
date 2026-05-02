import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Por favor, proporciona una contraseña para hashear.');
  console.error('Uso: node scripts/hash-password.js "mi_password_secreto"');
  process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
    process.exit(1);
  }
  console.log('\n--- Hash Generado Exitosamente ---\n');
  console.log(`Contraseña Original: ${password}`);
  console.log(`Hash (Copia esto en tu .env): ${hash}\n`);
});
