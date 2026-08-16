import { auth } from './auth';

export const getPlacesLayoutPaddingTop = async () => {
  const session = await auth();
  return session ? '' : 'pt-5';
};
