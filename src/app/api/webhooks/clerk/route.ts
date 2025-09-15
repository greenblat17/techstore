import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Log environment status
console.log('🔧 Webhook handler loaded, DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('🔑 CLERK_WEBHOOK_SECRET present:', !!process.env.CLERK_WEBHOOK_SECRET);

export async function POST(req: Request) {
  console.log('📨 Webhook received at:', new Date().toISOString());
  
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log('🔍 Headers present:', { 
    hasSvixId: !!svix_id, 
    hasSvixTimestamp: !!svix_timestamp, 
    hasSvixSignature: !!svix_signature 
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing svix headers');
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('CLERK_WEBHOOK_SECRET is not defined');
  }

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook events
  const eventType = evt.type;
  console.log('📌 Event type:', eventType);
  console.log('📊 Event data:', JSON.stringify(evt.data, null, 2).substring(0, 500));
  
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    console.log('👤 Processing user.created for:', id);
    
    const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
    
    if (!primaryEmail) {
      console.error('❌ No primary email found for user:', id);
      return new Response('No primary email found', { status: 400 });
    }

    console.log('📧 Primary email:', primaryEmail.email_address);

    try {
      // Create user in database
      const newCustomer = {
        clerkId: id,
        email: primaryEmail.email_address,
        firstName: first_name || null,
        lastName: last_name || null,
      };
      
      console.log('💾 Inserting customer:', newCustomer);
      
      await db.insert(customers).values(newCustomer).onConflictDoNothing();

      console.log(`✅ User ${id} created successfully in database`);
    } catch (error) {
      console.error('❌ Error creating user in database:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
    
    if (!primaryEmail) {
      return new Response('No primary email found', { status: 400 });
    }

    try {
      // Update user in database
      await db.update(customers)
        .set({
          email: primaryEmail.email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          updatedAt: new Date(),
        })
        .where(eq(customers.clerkId, id));

      console.log(`User ${id} updated successfully`);
    } catch (error) {
      console.error('Error updating user in database:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Soft delete or handle user deletion based on business requirements
      // For now, we'll keep the user data but you might want to:
      // 1. Soft delete by adding a deletedAt field
      // 2. Hard delete the user and their associated data
      // 3. Anonymize the user data
      
      // Example: Mark orders as from deleted user but keep them for records
      console.log(`User ${id} deletion webhook received - keeping data for audit`);
      
      // Optionally, you could update a status field:
      // await db.update(customers)
      //   .set({ status: 'deleted', deletedAt: new Date() })
      //   .where(eq(customers.clerkId, id));
    } catch (error) {
      console.error('Error handling user deletion:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}