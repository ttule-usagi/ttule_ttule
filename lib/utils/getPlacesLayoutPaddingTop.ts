import { auth } from './auth';

export const getPlacesLayoutPaddingTop = async () => {
  const session = await auth();
  return session ? '' : 'md:pt-5';
};
