import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';
// at it's simplest, the acces control returns a yes or no value depending on the users session

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermitions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria - yes or no
export const permissions = {
  ...generatedPermitions,
};

// Rule base funstion
// Rules can return a boolean - yead or no - or a filter which limits which they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. Do they have the permission af canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true; // They can read everything!
    }
    // they should see available products (based on the status field)
    return { status: 'AVAILABLE' };
  },
};
