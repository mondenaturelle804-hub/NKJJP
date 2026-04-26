export const validateEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'ANTHROPIC_API_KEY',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'PORT'
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missingVars.join(', ')}`
    );
  }

  console.log('✅ Variables d\'environnement validées');
};

export default validateEnv;
