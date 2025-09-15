import { auth, currentUser } from '@clerk/nextjs/server';

interface CustomSessionClaims {
  metadata?: {
    role?: string;
  };
}

/**
 * Check if the current user has admin role
 * Uses Clerk's public metadata to determine admin status
 */
export async function isAdmin() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return false;
  }
  
  // Check for admin role in public metadata
  const claims = sessionClaims as CustomSessionClaims;
  return claims?.metadata?.role === 'admin';
}

/**
 * Get the current user with admin status
 * Useful for components that need both user data and admin check
 */
export async function getCurrentUserWithAdminStatus() {
  const user = await currentUser();
  
  if (!user) {
    return {
      user: null,
      isAdmin: false
    };
  }
  
  // Check admin status from public metadata
  const isAdminUser = user.publicMetadata?.role === 'admin';
  
  return {
    user,
    isAdmin: isAdminUser
  };
}

/**
 * Require admin access - throws error if not admin
 * Use this in server actions or API routes that require admin access
 */
export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized: No user found');
  }
  
  const claims = sessionClaims as CustomSessionClaims;
  if (claims?.metadata?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  
  return { userId, isAdmin: true };
}

/**
 * Check if a specific user ID is an admin
 * Useful for checking other users' admin status
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  // This would need to be implemented differently depending on your setup
  // You might need to query your database or use Clerk's backend API
  const { userId: currentUserId, sessionClaims } = await auth();
  
  // If checking current user
  if (currentUserId === userId) {
    const claims = sessionClaims as CustomSessionClaims;
    return claims?.metadata?.role === 'admin';
  }
  
  // For other users, you'd need to query your database or Clerk's API
  // For now, return false for other users
  return false;
}