export default {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT! === 'production',
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN!,
  mongoURL: process.env.NEXT_PUBLIC_MONGODB_URL!,
  mongoUser: process.env.NEXT_PUBLIC_MONGODB_USER!,
  mongoPassword: process.env.NEXT_PUBLIC_MONGODB_PASSWORD!,
  mongoDatabase: process.env.NEXT_PUBLIC_MONGODB_DATABASE!,
}